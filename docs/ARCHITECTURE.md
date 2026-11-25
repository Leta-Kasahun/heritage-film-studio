# Architecture

## Overview

The application follows a strict **5-stage linear pipeline** where `storyboard.json` is the single contract that every stage reads from and writes to.

```
storyboard.json (contract)
        │
        ├── Stage 1 ── Script + Storyboard (Gemini Flash)
        ├── Stage 2 ── Keyframe Images     (Cloudflare FLUX)
        ├── Stage 3 ── Narration Audio     (Gemini TTS)
        ├── Stage 4 ── Music Score         (ACE-Step, Kaggle)
        └── Stage 5 ── Assembly            (FFmpeg)
```

## Backend (FastAPI)

### SOLID principles applied

| Principle | How |
|-----------|-----|
| **S** ingle Responsibility | Each service module does one thing: `gemini_service.py` → Gemini calls only, `cloudflare_service.py` → CF calls only, `document_parser.py` → text extraction only |
| **O** pen/Closed | New AI providers add a new `*_service.py` without touching existing code |
| **L** iskov | All service functions return plain Python types (str, Path, dict) — easy to swap implementations |
| **I** nterface Segregation | Pydantic schemas separated from ORM models; each route only imports what it needs |
| **D** ependency Inversion | Routes depend on `project_service` (business layer), not on AI providers directly |

### Layers

```
Routes (api/routes/)
   │  — HTTP contract, request validation, BackgroundTasks dispatch
   ▼
Services (services/project_service.py)
   │  — Pipeline orchestration, DB state, caching logic
   ▼
AI Services (services/gemini_service.py, cloudflare_service.py)
   │  — Single-purpose provider wrappers, logging every call
   ▼
DB (db/models.py + database.py)
   └  — SQLite via SQLAlchemy ORM
```

### Caching Strategy

Each stage checks whether the output file already exists before calling the AI provider:
```python
if shot.image_path and Path(shot.image_path).exists():
    continue  # cache hit
```
This means a re-run after a quota error or network failure only regenerates the missing shots.

### Failure Handling

- Network/API errors are caught per-shot; the pipeline continues to the next shot and records the error on the project row.
- Background tasks (FastAPI `BackgroundTasks`) run outside the HTTP request so the client doesn't time out.
- `runs.jsonl` captures every call with status `ok` or `error` for post-mortem analysis.

## Frontend (Next.js App Router)

```
src/app/
  page.tsx                   ← Home (Server + Client hybrid)
  projects/[id]/page.tsx     ← Project detail (polls status every 4 s while pipeline runs)
  runs/page.tsx              ← Run log viewer

src/components/
  UploadForm.tsx             ← Drag-and-drop file upload
  ProjectList.tsx            ← List with status badges
  PipelinePanel.tsx          ← Stage trigger buttons
  ShotGrid.tsx               ← Image + audio per shot
  StatusBadge.tsx            ← Colour-coded status chip
  RunsTable.tsx              ← Model call log table

src/lib/
  api.ts                     ← Typed fetch wrappers for all endpoints
```

The frontend polls the project endpoint every 4 seconds while `status` is in an active pipeline state, so the UI updates as shots are generated without a websocket.

## Data Model

```
Project
  │  1──1  Storyboard  (logline, audience, intent, raw JSON, path)
  └──1──n  Shot        (index, prompts, narration, generated asset paths)
```

## Contracts

- `schema/storyboard.schema.json` — JSON Schema (Draft 7) validated before every pipeline run
- `runs.jsonl` — append-only NDJSON log of every model call
- `outputs/` — generated files, addressable by project ID + shot index
