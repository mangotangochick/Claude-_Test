# Zoho Notebook → Notion Migration Log

**Direction:** Zoho Notebook → Notion  
**Migration started:** 2026-06-09  
**Branch:** `claude/zoho-to-notion-migration-d40eva`

---

## Notion Structure

All notebooks are organised under a root page **"📓 Zoho Notebooks"** (`37a56284-e007-8114-9b98-f1dbf987fe8e`) with 5 category sub-pages:

| Category | Notion Page ID |
|----------|---------------|
| 🏥 Medical & Clinical | `37a56284-e007-8116-bb62-ce9f2ea9c911` |
| 📚 Academic & Study | `37a56284-e007-8155-9639-dfaf3f397d8d` |
| 🙂 Personal | `37a56284-e007-8156-8ec4-ed68520b063c` |
| 💼 Work & Projects | `37a56284-e007-81f9-9ebe-d213ac0fbe8c` |
| 🗃️ Archive & Imported | `37a56284-e007-8162-8e00-fb5acb90ccb9` |

---

## Migration Status by Notebook

### ✅ COMPLETE

| Zoho Notebook | Zoho ID | Notion Parent | Notes |
|--------------|---------|---------------|-------|
| Teaches | s0cad931e53cd79b84320b8e2f654ab4b776d | 37a56284-e007-8183-ad21-ef60cf8b48f3 | 2 collection pages |
| Academia | s0cad9cbe38d7e0dd41449f0c07e8e07acc39 | 37a56284-e007-81c4-abf8-eda35b828fa3 | 3 pages |
| Public Health | s0cadb2016a4a95f349f0a73d13ed7a947866 | 37a56284-e007-8135-95a3-d96f4bcee409 | 15 pages |
| Management | s0cadbeb9a502219f464086280475efc24f50 | 37a56284-e007-81df-a69d-e1242063c594 | 10 pages |
| Curriculums | s0cad9dbc216f415a439cacbb37c8b9622756 | 37a56284-e007-81ba-8cf4-e71d501e05be | 28 pages |
| Workbooks | s0cad6eda3c5d0a9b48149e5bdf4407d7cad3 | 37a56284-e007-81b4-a2a7-d88f9f8c3998 | 2 pages (summary) |
| Microbiology | s0cadd99deee6b3de4c40b9382ba08fb18a3b | 37a56284-e007-81ca-a40d-dabb505bf149 | 11 pages |
| Resources | s0cada20ff3416d8f4f24b8aba6fe5da09f74 | 37a56284-e007-815e-99e6-fab1136515f8 | 4 pages |
| Presentations | s0cad60963a7bca3a4250b9a47dfc9a402d61 | 37a56284-e007-8165-a3b5-ddd6c887b278 | 9 pages |
| Genetics | s0cad83b345743ed143e58ba285d850683843 | 37a56284-e007-81b0-a740-c996815be703 | 4 pages |
| Investigations | s0cadb87a11b96f5944c8928187e7eb2f1b6e | 37a56284-e007-8196-81a1-e5cbde3a8385 | 23 pages |
| MCQs | s0cad68b829d0441e4685a43a0b36880d0fa0 | 37a56284-e007-812a-9be8-d7e8210b0355 | 2 pages |
| Textbooks | s0cadf358b827f36345b1bc78207adba620f2 | 37a56284-e007-81f4-a69a-cf2a0827d116 | 1 collection page |
| Apple Notes | jeget31c103b6cd9d413d94a83546ead19431 | 37a56284-e007-81c4-9c1d-f733a55bd54d | 166 pages (10 collections + standalone) |
| Inbox | s0cad1027e2a87ecc4c7bb9c53ad6ede2de6d | 37a56284-e007-8119-8293-c79042e43340 | 11 pages |
| Patients | s0cad7edf325f7c28432c92f5d2320f7b1089 | 37a56284-e007-8145-a2d5-c39e80b2d808 | 7+ pages (2 collections + 5 standalone) |
| Clinical Skills (Legacy) | w3e4921592c7fc7d444eea179e4c8809ffefb | 37a56284-e007-817d-ac2c-fb944d35ec69 | ABG collection + Untitled |
| ✏️ Projects | jeget4156a933146d41779a202e7652b541fd | 37a56284-e007-8101-8420-f87ee4cc0ab4 | FY1 collection + 3 notecards |
| Notes | jeget3c8b57aff9d441ce9926f3120fed107a | 37a56284-e007-81c6-b856-fc925dd041c2 | 4 collections + all notecards |
| Recipes | s0cad6694e23a01744228817742a3f9c4032b | — | EMPTY — nothing to migrate |

### ⚠️ PARTIALLY COMPLETE

| Zoho Notebook | Zoho ID | Notion Parent | Status |
|--------------|---------|---------------|--------|
| 📔 Medical Notes (Main) | hr2js11a3cb45db5349baba1e13b297bec371 | 37a56284-e007-81e0-9c00-d03cf4203979 | ~25+ pages done; many collections pending (agent running) |
| Medical Conditions | s0caddd45b5289f684e4dadd5e650e67ccc83 | 37a56284-e007-816a-8e0b-d101e2e99913 | 91 standalone done; 9 collections pending (agent running) |
| 2026_Medical | jeget2e54440a254e4395bb5c802a5536743a | 37a56284-e007-81fc-bd76-c4f06d157ebf | 5/126 collections done (agent running) |
| Medical Notes (Set 2) | hr2js9e8c7c9b78d342d2a0b3131eae0e6a6e | 37a56284-e007-8190-bc4e-c737165ebbd7 | HRT + Nutrition done; rest pending (agent running) |

### 🔄 IN PROGRESS (agents running)

| Zoho Notebook | Zoho ID | Notion Parent | Agent |
|--------------|---------|---------------|-------|
| 📔 Medical Notes (Main) | hr2js11a3cb45db5349baba1e13b297bec371 | 37a56284-e007-81e0-9c00-d03cf4203979 | aeef24b106b0df8a4 |
| Medical Notes (Set 2) | hr2js9e8c7c9b78d342d2a0b3131eae0e6a6e | 37a56284-e007-8190-bc4e-c737165ebbd7 | acc527afcfd2ad0a3 |
| Medical Notes (Set 3) | hr2js9e57a80e190e4d2fb412889844c68123 | 37a56284-e007-81da-be0e-fb8fc6ef04cc | acc527afcfd2ad0a3 |
| Anatomy | s0cade52a21aa5a55400cb997a241e5aa9034 | 37a56284-e007-81df-b519-e86d0ead89f4 | acc527afcfd2ad0a3 |
| Physiology | s0cad222ffe0667934b5f9ba5dee9413bb44c | 37a56284-e007-81d1-be29-e83c428dd9d5 | acc527afcfd2ad0a3 |
| Pathology | s0cad3bca6ba0f14544cc98670ebd86633c9e | 37a56284-e007-8198-b907-d67b65853501 | acc527afcfd2ad0a3 |
| Pharmacology | s0cad0d31b2c28d91441ea03ea358124b3984 | 37a56284-e007-81ee-a37f-c89f3b2f872e | acc527afcfd2ad0a3 |
| Clinical Skills | s0cad1ca52354c67444a58a87e90f130b0a6e | 37a56284-e007-81cf-9c7b-e834ec023807 | acc527afcfd2ad0a3 |
| Surgical Conditions | s0cada52d5ae2198c4a27bf0b4c9254ccee79 | 37a56284-e007-8154-a674-f96b7e2bfdc4 | acc527afcfd2ad0a3 |
| 2026_Medical | jeget2e54440a254e4395bb5c802a5536743a | 37a56284-e007-81fc-bd76-c4f06d157ebf | a2ad4a8607a2cbbb4 |
| Medical Conditions (9 collections) | s0caddd45b5289f684e4dadd5e650e67ccc83 | 37a56284-e007-816a-8e0b-d101e2e99913 | a800696072ae2e8aa |
| CST Interview | 8dqz2e6f18aa1c48d40deba547833e2c3450a | 37a56284-e007-810b-8225-c7cb93261a3e | a800696072ae2e8aa |
| Workouts | s0cad309a2eefeb844587abde12663f360af8 | 37a56284-e007-8177-9674-c6bf3a2dcc5a | a800696072ae2e8aa |
| Other | s0cad2a420a8992d940d1a8ff47542a89b690 | 37a56284-e007-8114-9c78-e53df195f9a1 | a800696072ae2e8aa |
| Archive | jeget45554f584fa94196800326c47323bd1e | 37a56284-e007-8125-962a-ee943cb36a42 | a800696072ae2e8aa |
| Clippings | jeget76545c7593cb42f888ec9800022a24ff | 37a56284-e007-8138-8762-e528115f36df | a800696072ae2e8aa |
| Recently Deleted | jeget960d9060bba74dfb887430448f6c4c27 | 37a56284-e007-8125-b28b-c5ad9ffa59c1 | a800696072ae2e8aa |
| Data Science | s0cad9c4b1eb9edfc453f921c795d520702f7 | 37a56284-e007-8187-92e1-fbba77339350 | a800696072ae2e8aa |
| Google Keep | jegetc238fc90d9f64dc3b4ffe8b13dc08f3e | 37a56284-e007-81bf-b20b-d4b81f4ecb0c | a800696072ae2e8aa |
| Poland 2026 | hr2js46ca76dda06243c1aa73df101114e4f0 | 37a56284-e007-8123-ae7b-c69a52a725e9 | a800696072ae2e8aa |
| Personal (old) | s0cad2ea531692b084a64bf04e9fc642343f8 | 37a56284-e007-81d4-b668-c776fb5282a6 | a800696072ae2e8aa |

---

## Notes on Migration Approach

- **HTML → Markdown**: All notecard HTML content converted to Notion-flavored Markdown
- **Images/sketches**: Placeholder `📎 *Image attachment — Zoho notecard ID: [id]*`
- **PDF/file attachments**: Placeholder `📎 *File attachment: [filename] — Zoho resource ID: [id]*`
- **Audio**: Placeholder `🎵 *Audio recording — Zoho resource ID: [id]*`
- **Collections**: A collection header page is created first, then notecards go under it
- **Batch size**: Up to 50 pages per notion-create-pages call
