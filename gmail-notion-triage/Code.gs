/**
 * Gmail → Notion AI Triage
 * --------------------------------------------------------------------------
 * Runs on a time-driven trigger. For every new inbox thread it hasn't seen
 * before, it asks Gemini Flash to classify the email, then:
 *   - ACTIONABLE  → creates a task in the "Email Actions" Notion database
 *   - PROMOTIONAL → logs it in the "Unsubscribe / Promo" Notion database,
 *                   with the real unsubscribe link from the List-Unsubscribe
 *                   header (not guessed by the AI)
 *   - FYI / other → skipped (just labelled so it's never re-processed)
 *
 * Every processed thread is tagged with the Gmail label AI_TRIAGED_LABEL so
 * it is never handled twice — safe to run every few minutes forever.
 *
 * Setup: see README.md. You only need to fill in Script Properties
 * (File ▸ Project Settings ▸ Script Properties) — no secrets in this file.
 */

// ---- Configuration ---------------------------------------------------------

var AI_TRIAGED_LABEL = 'AI-Triaged';   // Gmail label used to mark handled mail
var LOOKBACK = 'newer_than:2d';        // how far back to scan each run
var MAX_THREADS_PER_RUN = 25;          // keep each run well under the 6-min limit
var GEMINI_MODEL = 'gemini-2.0-flash'; // free-tier model; swap if you like

// Notion database IDs (already created for you).
var NOTION_ACTIONS_DB = '7272e83bd3bb405abb3c6b3adc9059ca';
var NOTION_PROMO_DB    = 'd48af317616d408fbf4d703328a49ef1';

// Pulled from Script Properties — never hard-code keys here.
function cfg_(key) {
  var v = PropertiesService.getScriptProperties().getProperty(key);
  if (!v) throw new Error('Missing Script Property: ' + key);
  return v;
}

// ---- Entry point (set this as the trigger) ---------------------------------

function triageInbox() {
  var label = getOrCreateLabel_(AI_TRIAGED_LABEL);
  var query = 'in:inbox -label:' + AI_TRIAGED_LABEL +
              ' -category:social ' + LOOKBACK;
  var threads = GmailApp.search(query, 0, MAX_THREADS_PER_RUN);

  var done = 0;
  for (var i = 0; i < threads.length; i++) {
    var thread = threads[i];
    try {
      processThread_(thread);
      thread.addLabel(label);   // mark handled ONLY on success...
      done++;
    } catch (err) {
      // ...so a transient error (e.g. Gemini rate limit) is retried next run
      // instead of being silently dropped. Persistent failures re-log each run.
      Logger.log('Error on thread ' + thread.getId() + ': ' + err);
    }
  }
  Logger.log('Triaged ' + done + ' of ' + threads.length + ' thread(s).');
}

// ---- Per-thread handling ---------------------------------------------------

function processThread_(thread) {
  var msg = thread.getMessages()[0];                 // the originating message
  var subject = thread.getFirstMessageSubject() || '(no subject)';
  var from = msg.getFrom();
  var snippet = (msg.getPlainBody() || '').slice(0, 1500);
  var threadLink = 'https://mail.google.com/mail/u/0/#inbox/' + thread.getId();
  var unsub = extractUnsubscribe_(msg);              // {url, oneClick} or null

  var verdict = classifyWithGemini_(subject, from, snippet, !!unsub);

  if (verdict.category === 'actionable') {
    createActionTask_(verdict, from, subject, threadLink);
  } else if (verdict.category === 'promotional' && verdict.want_to_unsubscribe) {
    createPromoEntry_(from, subject, threadLink, unsub);
  }
  // 'fyi' / unwanted promos with no desire to unsubscribe → just labelled.
}

// ---- Gemini classification -------------------------------------------------

function classifyWithGemini_(subject, from, snippet, hasUnsub) {
  var url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
            GEMINI_MODEL + ':generateContent?key=' + cfg_('GEMINI_API_KEY');

  var prompt =
    'You are triaging a personal email. Classify it.\n' +
    'Return ONLY JSON matching the schema.\n\n' +
    'category: "actionable" if it needs the user to DO something (reply, pay, ' +
    'sign, complete a form, decide, attend); "promotional" for marketing, ' +
    'newsletters, sales, offers; "fyi" for receipts, confirmations, security ' +
    'codes, notifications needing no action.\n' +
    'priority: High/Medium/Low (High = deadline or urgent).\n' +
    'due_date: ISO YYYY-MM-DD if a deadline is stated, else null.\n' +
    'task_title: short imperative summary (e.g. "Reply to landlord re: viewing").\n' +
    'category_tag: one of Work/NHS, Housing, Admin, Travel, Personal.\n' +
    'want_to_unsubscribe: true if promotional AND the user would plausibly want ' +
    'off this list (' + (hasUnsub ? 'an unsubscribe link IS present' :
    'no unsubscribe link found') + ').\n\n' +
    'From: ' + from + '\nSubject: ' + subject + '\nBody:\n' + snippet;

  var payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          category: { type: 'STRING', enum: ['actionable', 'promotional', 'fyi'] },
          priority: { type: 'STRING', enum: ['High', 'Medium', 'Low'] },
          due_date: { type: 'STRING' },
          task_title: { type: 'STRING' },
          category_tag: { type: 'STRING',
            enum: ['Work/NHS', 'Housing', 'Admin', 'Travel', 'Personal'] },
          want_to_unsubscribe: { type: 'BOOLEAN' }
        },
        required: ['category', 'task_title']
      }
    }
  };

  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() >= 300) {
    throw new Error('Gemini error ' + res.getResponseCode() + ': ' + res.getContentText());
  }
  var data = JSON.parse(res.getContentText());
  var text = data.candidates[0].content.parts[0].text;
  return JSON.parse(text);
}

// ---- Notion writers --------------------------------------------------------

function createActionTask_(v, from, subject, link) {
  var tag = mapCategory_(v.category_tag);
  var props = {
    'Task':     { title: [{ text: { content: v.task_title || subject } }] },
    'Status':   { select: { name: 'To Do' } },
    'Priority': { select: { name: v.priority || 'Medium' } },
    'Category': { multi_select: [{ name: tag }] },
    'From':     { rich_text: [{ text: { content: from.slice(0, 200) } }] },
    'Email Link': { url: link }
  };
  if (v.due_date && /^\d{4}-\d{2}-\d{2}$/.test(v.due_date)) {
    props['Due Date'] = { date: { start: v.due_date } };
  }
  notionCreatePage_(NOTION_ACTIONS_DB, props);
}

function createPromoEntry_(from, subject, link, unsub) {
  var props = {
    'Sender':      { title: [{ text: { content: senderName_(from) } }] },
    'Status':      { select: { name: 'To Unsubscribe' } },
    'From Address':{ rich_text: [{ text: { content: from.slice(0, 200) } }] },
    'Subject':     { rich_text: [{ text: { content: subject.slice(0, 200) } }] },
    'One-Click':   { checkbox: !!(unsub && unsub.oneClick) },
    'First Seen':  { date: { start: new Date().toISOString().slice(0, 10) } },
    'Email Link':  { url: link }
  };
  if (unsub && unsub.url) props['Unsubscribe Link'] = { url: unsub.url };
  notionCreatePage_(NOTION_PROMO_DB, props);
}

function notionCreatePage_(databaseId, properties) {
  var res = UrlFetchApp.fetch('https://api.notion.com/v1/pages', {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + cfg_('NOTION_TOKEN'),
      'Notion-Version': '2022-06-28'
    },
    payload: JSON.stringify({ parent: { database_id: databaseId }, properties: properties }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() >= 300) {
    throw new Error('Notion error ' + res.getResponseCode() + ': ' + res.getContentText());
  }
}

// ---- Helpers ---------------------------------------------------------------

// Map the AI's tag to the exact option names in the Email Actions DB.
function mapCategory_(tag) {
  if (tag === 'Work/NHS') return 'Work / NHS';
  if (['Housing', 'Admin', 'Travel', 'Personal'].indexOf(tag) >= 0) return tag;
  return 'Admin';
}

function senderName_(from) {
  var m = from.match(/^\s*"?([^"<]+?)"?\s*<.*>/);
  return (m ? m[1] : from).trim().slice(0, 100) || from.slice(0, 100);
}

// Pull the List-Unsubscribe header out of the raw message.
// Returns {url, oneClick} or null. Prefers an https link over a mailto.
function extractUnsubscribe_(msg) {
  var raw = msg.getRawContent();
  var hdr = matchHeader_(raw, 'List-Unsubscribe');
  if (!hdr) return null;
  var oneClick = /List-Unsubscribe-Post:\s*List-Unsubscribe=One-Click/i.test(raw);
  var urls = hdr.match(/<([^>]+)>/g) || [];
  var http = null, mailto = null;
  for (var i = 0; i < urls.length; i++) {
    var u = urls[i].replace(/[<>]/g, '');
    if (/^https?:/i.test(u) && !http) http = u;
    else if (/^mailto:/i.test(u) && !mailto) mailto = u;
  }
  var url = http || mailto;
  return url ? { url: url, oneClick: oneClick && !!http } : null;
}

// Grab a single header value (handles RFC 2822 folded lines).
function matchHeader_(raw, name) {
  var re = new RegExp('^' + name + ':\\s*([\\s\\S]*?)(?:\\r?\\n[^ \\t]|$)', 'im');
  var m = raw.match(re);
  return m ? m[1].replace(/\r?\n[ \t]+/g, ' ').trim() : null;
}

function getOrCreateLabel_(name) {
  return GmailApp.getUserLabelByName(name) || GmailApp.createLabel(name);
}

// ---- One-time installer: run once to create the recurring trigger ----------

function installTrigger() {
  // remove any existing triggers for this function first
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'triageInbox') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('triageInbox').timeBased().everyMinutes(15).create();
  Logger.log('Trigger installed: triageInbox every 15 minutes.');
}
