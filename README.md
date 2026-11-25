# Heritage Short Studio

**AI-powered short film pipeline** — upload a family story document, generate a storyboard, keyframe images, narration audio and assemble a 60–90 s film.

## Stack

| Layer | Technology |
|-------|-----------|
| Backend API | FastAPI + SQLite (SQLAlchemy) |
| Frontend | Next.js 16 App Router + TypeScript + Tailwind CSS |
| Image generation | Cloudflare Workers AI — FLUX.1 schnell |
| Script + Storyboard | Google Gemini 2.0 Flash |
| Narration TTS | Google Gemini TTS |
| Assembly | FFmpeg |

## Quick Start

### 1. Clone & configure secrets

```bash
git clone <repo>
cd heritage-short

# Backend secrets
cp backend/.env.example backend/.env
# Edit backend/.env — fill in GEMINI_API_KEY, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN
```

### 2. Backend (FastAPI)

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

API runs at **http://localhost:8000**  
Swagger docs: **http://localhost:8000/api/docs**

### 3. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:3000**

### 4. Smoke test (verify all API keys)

```bash
cd backend
python ../pipeline/smoke_test.py
```

### 5. Assemble final film (requires FFmpeg)

```bash
python pipeline/assemble.py --project-id 1
```

Outputs:
- `backend/outputs/video/project_1_16x9.mp4`
- `backend/outputs/video/project_1_9x16.mp4`

## Folder Structure

```
heritage-short/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── api/routes/          # projects.py, runs.py
│   │   ├── core/                # config.py, logging.py
│   │   ├── db/                  # database.py, models.py
│   │   ├── schemas/             # project.py (Pydantic)
│   │   └── services/            # gemini, cloudflare, document_parser, project
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   └── src/
│       ├── app/                 # Next.js App Router pages
│       │   ├── page.tsx         # Home — project list + upload
│       │   ├── projects/[id]/   # Project detail + pipeline controls
│       │   └── runs/            # Run log viewer
│       ├── components/          # UploadForm, ProjectList, PipelinePanel, ShotGrid, RunsTable, StatusBadge
│       └── lib/api.ts           # Typed API client
├── pipeline/
│   ├── smoke_test.py            # Provider connectivity test
│   ├── validate_storyboard.py   # JSON Schema validation
│   └── assemble.py              # FFmpeg assembly
├── schema/
│   └── storyboard.schema.json   # JSON Schema contract
└── runs.jsonl                   # (auto-generated) model call log
```

## Pipeline Stages

```
Document Upload
     │
     ▼
Stage 1: Script + Storyboard (Gemini Flash)
     │  → storyboard.json (validated against schema/)
     ▼
Stage 2: Keyframe Images (Cloudflare FLUX)
     │  → outputs/images/  (cached by shot hash)
     ▼
Stage 3: Narration Audio (Gemini TTS)
     │  → outputs/audio/   (cached per shot)
     ▼
Stage 4: Assembly (FFmpeg)
     │  → 16:9 + 9:16 MP4
     ▼
     Done ✅
```

## Caching

Re-running any stage only regenerates shots whose `image_path` / `audio_path` is missing or the file is gone — cached outputs are skipped.

## Run Logs

Every model call is appended to `backend/runs.jsonl`:
```json
{"ts":"…","stage":"keyframe","model":"@cf/…/flux-1-schnell","params":{…},"seed":12345,"latency_ms":1234,"cost_usd":0,"status":"ok"}
```

View all logs in the UI at **http://localhost:3000/runs**

## Ethical Notes

- Real people's voices or faces require explicit, recorded consent in `ETHICS.md`
- All generated output carries the AI end-card label
- Model licences: Gemini (Google ToS), FLUX.1 schnell (Apache 2.0), Wan 2.2 (Apache 2.0), ACE-Step 1.5 (MIT)
