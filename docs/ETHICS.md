# Ethics

## Consent

> Record every real person who appears or is voiced before generating anything.

| Person | Role in film | Consent type | Date | Notes |
|--------|-------------|-------------|------|-------|
| (add) | (narrator/subject) | Written/verbal | — | — |

If a real person's voice is cloned with Gemini TTS, their informed, recorded consent for that specific use must be obtained first.

## Labelling

- All exported MP4 files include a visible AI end card ("Made with AI — Heritage Short Studio").
- When posting to YouTube/TikTok/Instagram, the platform's AI content disclosure toggle is enabled.
- SynthID watermarks (from Gemini TTS/image outputs) are preserved.

## Model Licences

| Model | Provider | Licence |
|-------|---------|---------|
| Gemini 2.0 Flash | Google | Google AI ToS |
| Gemini TTS | Google | Google AI ToS |
| FLUX.1 schnell | Black Forest Labs | Apache 2.0 |
| Wan 2.2 TI2V-5B | Alibaba / Wan-Video | Apache 2.0 |
| ACE-Step 1.5 | ACE-Step team | MIT |

## Privacy

- Uploaded documents processed server-side only; not sent to third parties beyond the AI providers named above.
- Gemini API may use inputs to improve the model (see Google AI ToS); keep private family details out of prompts where this matters.
- Cloudflare Workers AI: inputs not used for model training (per Cloudflare ToS).
