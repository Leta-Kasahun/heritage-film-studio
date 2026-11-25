# Costs & Measurement

Measured from `backend/runs.jsonl` and FFmpeg assembly on an 8-shot (67 s) film.

## 1. Per-Stage Measurements

| Stage | Model / Tool | Measured Avg Latency | GPU / Compute | Cost |
|---|---|---|---|---|
| Script | `openai/gpt-oss-120b` (Groq fallback) | 2,900 ms | Free tier | \$0 |
| Storyboard | `openai/gpt-oss-120b` (Groq fallback) | 4,680 ms | Free tier | \$0 |
| Keyframes (×8) | `@cf/black-forest-labs/flux-1-schnell` | 3,400 ms / image | CF free daily allowance | \$0 |
| Narration (×8) | `gemini-3.8-flash-tts` | 5,300 ms / shot | Gemini free tier | \$0 |
| Assembly (×2 MP4) | FFmpeg (`mwader/static-ffmpeg:7.1`) | ~105 s total | Local CPU / Docker | \$0 |

---

## 2. Total Cost Equivalent (8-Shot Film, 16:9 + 9:16)

| Provider | Calls | Paid List-Price Equivalent | Actual Spend |
|---|---|---|---|
| Google Gemini API | 8 TTS + retries | ~\$0.05 | \$0 |
| Groq API | 2 text calls | ~\$0.01 | \$0 |
| Cloudflare Workers AI | 8 FLUX images | ~\$0.04 | \$0 |
| **Total** | **18 calls** | **~\$0.10** | **\$0** |
