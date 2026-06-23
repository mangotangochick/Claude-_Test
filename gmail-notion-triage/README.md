# Gmail → Notion AI Triage (Google Apps Script)

Automatically screens every new Gmail inbox message with **Gemini Flash** and
files it into Notion:

- **Actionable** emails → tasks in the **📥 Email Actions** database
- **Promotional** emails you'd want off → the **🚫 Unsubscribe / Promo**
  database, with the real one-click unsubscribe link pulled from the
  `List-Unsubscribe` header
- **FYI** (receipts, codes, confirmations) → skipped

Each handled thread gets a Gmail label (`AI-Triaged`) so it's never processed
twice. Runs every 15 minutes on a time-driven trigger.

---

## What you need (one-time, ~10 min)

1. **A Gemini API key (free tier)** — https://aistudio.google.com/apikey →
   "Create API key". Copy it.
2. **A Notion internal integration token** —
   https://www.notion.so/my-integrations → "New integration" → copy the
   **Internal Integration Secret** (starts with `ntn_` / `secret_`).
3. **Share both Notion databases with that integration** — open each database
   in Notion → top-right **•••** → **Connections** → add your integration:
   - 📥 Email Actions
   - 🚫 Unsubscribe / Promo

   (Without this step Notion returns 404 — the integration can only see
   databases explicitly shared with it.)

---

## Install

1. Go to https://script.google.com → **New project**.
2. Delete the placeholder `Code.gs` and paste in the contents of this repo's
   [`Code.gs`](./Code.gs). Save.
3. **Project Settings** (gear icon) → **Script Properties** → add two:
   | Property        | Value                          |
   | --------------- | ------------------------------ |
   | `GEMINI_API_KEY`| your Gemini key from step 1    |
   | `NOTION_TOKEN`  | your Notion secret from step 2 |
4. Back in the editor, select the function **`triageInbox`** and click **Run**.
   Approve the Gmail + external-request permissions when prompted. Check the
   **Execution log** — it should report how many threads it triaged, and new
   rows should appear in Notion.
5. Select **`installTrigger`** and click **Run** once. This schedules
   `triageInbox` to run every 15 minutes automatically. Done.

---

## Tuning

All knobs are constants at the top of `Code.gs`:

| Constant                | Default            | What it does |
| ----------------------- | ------------------ | ------------ |
| `LOOKBACK`              | `newer_than:2d`    | How far back each run scans. The label prevents re-processing, so this only needs to comfortably exceed your run interval. |
| `MAX_THREADS_PER_RUN`   | `25`               | Cap per run (keeps each execution under Apps Script's 6-min limit). |
| `GEMINI_MODEL`          | `gemini-2.0-flash` | Swap for another free model if you like. |
| trigger interval        | 15 min             | Change `everyMinutes(15)` in `installTrigger`. |

### First-run backfill
To triage older mail once, temporarily set `LOOKBACK` to e.g. `newer_than:14d`
and run `triageInbox` manually a few times (25 threads each), then set it back.

### Swapping Gemini for Claude Haiku
Replace `classifyWithGemini_` with a call to the Anthropic Messages API
(`model: "claude-haiku-4-5"`, `https://api.anthropic.com/v1/messages`, header
`x-api-key`). The rest of the script is unchanged — it only consumes the parsed
JSON verdict. Add an `ANTHROPIC_API_KEY` script property instead of the Gemini
one.

---

## How classification works

The AI receives the sender, subject, body snippet, and *whether* a
`List-Unsubscribe` header was found, and returns strict JSON:

```json
{ "category": "actionable | promotional | fyi",
  "priority": "High|Medium|Low",
  "due_date": "YYYY-MM-DD or null",
  "task_title": "...",
  "category_tag": "Work/NHS | Housing | Admin | Travel | Personal",
  "want_to_unsubscribe": true }
```

The unsubscribe **link itself** is never guessed by the AI — it's extracted
from the email's `List-Unsubscribe` header (preferring an `https` one-click
link over a `mailto:`). The AI only decides whether you'd want off the list.

---

## Notes & safety

- The script only **reads** Gmail and **adds a label**. It never deletes,
  archives, replies, or actually unsubscribes — promo entries land in Notion
  with the link for you to click. (Auto-unsubscribing the one-click ones is a
  possible later addition.)
- Secrets live only in Script Properties, never in the code.
- Gemini free-tier limits are generous for personal inbox volume. A thread is
  labelled `AI-Triaged` **only after it's successfully filed**, so a transient
  error (rate limit, network blip) just logs and retries that thread on the
  next run rather than dropping it.
