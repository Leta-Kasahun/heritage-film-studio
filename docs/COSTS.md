# Costs & Measurement

> Measured latency and GPU minutes per stage, with list-price equivalent.

## Per-stage measurements

| Stage | Model | Avg latency | GPU mins | Free tier limit | List price equiv. |
|-------|-------|-------------|----------|----------------|------------------|
| Script | Gemini 2.0 Flash | — ms | — | 1 M tok/day | \$0 |
| Storyboard | Gemini 2.0 Flash | — ms | — | 1 M tok/day | \$0 |
| Keyframe (×10) | FLUX.1 schnell (CF) | — ms/img | — | ~100 img/day | \$0 |
| Narration (×10) | Gemini TTS | — ms | — | free tier | \$0 |
| Assembly | FFmpeg (local) | — s | — | — | \$0 |

## Frontier comparison

| Task | Open model | Frontier model | Quality diff | Latency diff | Cost diff |
|------|-----------|----------------|-------------|-------------|---------|
| Keyframe | FLUX.1 schnell | (e.g. Imagen 3) | — | — | — |
| Script | Gemini Flash | Gemini 1.5 Pro | — | — | — |

## Total pipeline cost (10-shot film)

| Provider | Calls | Estimated cost |
|---------|-------|---------------|
| Gemini API | — | \$0 (free tier) |
| Cloudflare AI | — | \$0 (free allowance) |
| Kaggle GPU | — h | \$0 (free quota) |
| **Total** | | **\$0** |
