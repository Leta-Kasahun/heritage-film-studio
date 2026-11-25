# Heritage Film Studio

Turn family and cultural stories into **60–90 second narrated short films** (in both **16:9 horizontal** and **9:16 vertical** formats) with AI-generated visuals, native-language narration, background music, English subtitles, and an AI disclosure end card.

---

## Main Features

- **Multi-Language Story Creation:** Write or upload a story (`.txt`, `.pdf`, `.docx`) in **Amharic**, **English**, **Afaan Oromo**, **Tigrinya**, **Somali**, or **French**.
- **Choose Output Type:** Generate a full **Video**, **Audio** narration, or **Images** storyboard gallery.
- **Automatic Background Generation:** Progress updates live from `0%` to `100%` without exposing technical steps to the user.
- **Media Gallery & Slide Viewer:** Watch videos, listen to narration audio, slide through all frames of a story in a modal gallery, switch `16:9` / `9:16` aspect ratios, download, or remove files.
- **Shot-Level Caching:** Every stage hashes its inputs (`.sha256`). Changing one shot in `storyboard.json` regenerates **only** that shot.
- **One-Command CLI:** Anyone can clone the repository and regenerate the film directly from `storyboard.json`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, TanStack Query, Lucide Icons |
| Backend API | FastAPI, SQLAlchemy, PostgreSQL (`psycopg2-binary`) |
| Script & Storyboard | Google Gemini (`gemini-3.8-flash`) with Groq fallback (`openai/gpt-oss-120b`) |
| Voice Narration | Google Gemini TTS (`gemini-3.8-flash-tts`) |
| Keyframe Images | Cloudflare Workers AI (`@cf/black-forest-labs/flux-1-schnell` / `flux-2-klein-4b`) |
| Music & Moving Shots | ACE-Step 1.5 / ambient fallback, Wan 2.2 TI2V-5B / FFmpeg Ken Burns |
| Video Assembly | FFmpeg (`sidechaincompress` audio ducking, `-14 LUFS` loudness, burned-in SRT, end card) |

---

## Pipeline Workflow

```text
Story / Upload  ──►  Script (Gemini / Groq)
                          │
                          ▼
               storyboard.json (validated against schema/storyboard.schema.json)
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
   Keyframes          Narration           Music
(Cloudflare FLUX)   (Gemini TTS)    (ACE-Step / Ambient)
        │                 │                 │
        ▼                 │                 │
  Moving Shots            │                 │
(Wan 2.2 / Ken Burns)     │                 │
        └─────────────────┼─────────────────┘
                          ▼
               FFmpeg Assembly + English SRT + AI End Card
                          │
                          ▼
          final_16x9.mp4  &  final_9x16.mp4
```

Every AI model call is logged to `backend/runs.jsonl` with timestamp, stage, model, parameters, latency, and status.

---

## Environment Setup (`.env.example`)

Copy the example environment files and add your free-tier API keys:

```powershell
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env.local
```

Key variables in `backend/.env`:

```env
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="postgres123"
POSTGRES_DB="heritage_db"
DATABASE_URL="postgresql+psycopg2://postgres:postgres123@localhost:5432/heritage_db"
STORAGE_DIR="../storage"

GEMINI_API_KEY="your-google-ai-studio-key"
GEMINI_MODEL="gemini-3.8-flash"
GEMINI_TTS_MODEL="gemini-3.8-flash-tts"

CLOUDFLARE_ACCOUNT_ID="your-cloudflare-account-id"
CLOUDFLARE_API_TOKEN="your-cloudflare-api-token"
CF_IMAGE_MODEL="@cf/black-forest-labs/flux-1-schnell"
CF_IMAGE_ALT_MODEL="@cf/black-forest-labs/flux-2-klein-4b"

GROQ_API_KEY="your-groq-api-key"
GROQ_MODEL="openai/gpt-oss-120b"
```

---

## How to Install & Run

### Option 1 — Docker Compose (Recommended)

Includes PostgreSQL, Backend (with `ffmpeg` + `ffprobe`), and Frontend:

```powershell
git clone https://github.com/Leta-Kasahun/heritage-film-studio.git
cd heritage-film-studio
copy backend\.env.example backend\.env
docker compose up --build -d
```

- **Studio UI:** http://localhost:3000
- **API Docs:** http://localhost:8000/api/docs

### Option 2 — Local Development

**1. Backend (Python 3.11+ & PostgreSQL):**
```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**2. Frontend (Node.js 20+ & pnpm):**
```powershell
cd frontend
pnpm install
pnpm run dev
```

### Option 3 — One-Command Film Generation (CLI)

Regenerate both `16:9` and `9:16` MP4 films directly from `storyboard.json`:

```powershell
cd backend
python -m pipeline.runner --storyboard ..\storyboard.json --project-id ethiopian-coffee
```

Outputs are saved in `storage/video/ethiopian-coffee/` (`final_16x9.mp4` and `final_9x16.mp4`).

---

## Repository Structure

```text
heritage-film-studio/
├── backend/
│   ├── app/                # FastAPI endpoints, models, repositories, schemas, services
│   ├── pipeline/           # context, runner, providers, media/ffmpeg, stages
│   ├── tests/              # API, storyboard contract, and caching tests
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # Navbar, Footer, Reveal, CustomSelect, Icon, StatusBadge
│   │   ├── features/       # projects, storyboard, generation, media
│   │   └── lib/            # api-client, query-client
│   └── Dockerfile
├── schema/
│   └── storyboard.schema.json
├── docs/                   # ARCHITECTURE, DESIGN, EXPERIMENTS, FAILURES, COSTS, ETHICS
├── storyboard.json         # Storyboard contract
├── compose.yaml            # Full-stack Docker Compose
└── README.md
```
