# Failures & Workarounds

Real blockers hit during build and generation, and how each was resolved.

| ID | Blocker | Cause | Fix / Workaround |
|---|---|---|---|
| **FAIL-001** | `gemini-3.8-flash` returned `503` / `429` on script & storyboard | Free-tier capacity & rate limits | Added Groq `openai/gpt-oss-120b` automatic fallback in `gemini.py` |
| **FAIL-002** | Groq fallback returned `0` chars | Reasoning model spent tokens on internal reasoning | Set `reasoning_effort="low"` and `max_tokens=4096` |
| **FAIL-003** | Cloudflare `flux-1-schnell` returned `400` / `flux-2-klein-4b` failed JSON | Unsupported `seed`/`width` on `flux-1`; `flux-2` requires `multipart/form-data` | Sent `{"prompt","steps"}` + base64 JSON decode for `flux-1`; multipart for `flux-2` |
| **FAIL-004** | `gemini-3.8-flash-tts` stopped pipeline at 55% with `429` | Strict free-tier per-minute / daily quota across 8–10 shots | Added `6 s` pacing, `20s/40s` backoff, `.sha256` caching, and timed silence fallback |
| **FAIL-005** | `runs.jsonl` logged `latency_ms: 0.0` and leaked `?key=` in error notes | `StopWatch.elapsed_ms` read `duration_ms` before `__exit__`; `httpx` printed full URL | Computed live `perf_counter()` delta and masked `key=***` |
| **FAIL-006** | HTTP `500` on `/api/assets/project/{id}` | Pydantic `alias="metadata"` hit SQLAlchemy's `Base.metadata` (`MetaData()`) | Changed schemas to `validation_alias="metadata_", serialization_alias="metadata"` |
| **FAIL-007** | `ffmpeg` missing on Windows host & Debian `apt-get` took 18+ min | No local `winget`/FFmpeg; Debian pulled 180+ GUI/LLVM packages | Used `mwader/static-ffmpeg:7.1` in `Dockerfile` and Docker fallback in `ffmpeg.py` |
| **FAIL-008** | Exported `9:16` MP4 showed `DAR 1:1` | Non-square pixel `SAR` carried over from input scaling | Added `,setsar=1` and `-ar 48000 -ac 2` in `assemble_film()` |
