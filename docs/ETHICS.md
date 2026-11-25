# Ethics, Consent & Licences

## 1. Consent

No real person's face or cloned voice is used in the generated film (`Ethiopian Coffee Ceremony`). All characters and scenes are fictionalized cultural depictions inspired by traditional family rituals, and the voice uses a synthetic prebuilt Gemini TTS voice (`Kore`).

| Subject / Voice | Type | Consent Status | Notes |
|---|---|---|---|
| Visual characters | AI-generated illustrations | N/A (synthetic) | No real person likeness used |
| Narration voice (`Kore`) | Prebuilt synthetic TTS | Google AI ToS | No voice cloning performed |

---

## 2. AI Labelling & Provenance

- Every exported MP4 (`final_16x9.mp4` and `final_9x16.mp4`) ends with a 3-second visible AI disclosure card: **`Made with AI · Heritage Film Studio`**.
- Platform AI disclosure toggles are enabled when publishing externally.
- Output provenance metadata is kept intact.

---

## 3. Model Licences

| Model | Provider | Licence |
|---|---|---|
| `gemini-3.8-flash` & `gemini-3.8-flash-tts` | Google | Google AI Terms of Service |
| `openai/gpt-oss-120b` | Groq / OpenAI | Apache 2.0 |
| `@cf/black-forest-labs/flux-1-schnell` | Black Forest Labs (Cloudflare) | Apache 2.0 |
| `@cf/black-forest-labs/flux-2-klein-4b` | Black Forest Labs (Cloudflare) | Apache 2.0 |
| `Wan 2.2 TI2V-5B` | Alibaba / Wan-Video | Apache 2.0 |
| `ACE-Step 1.5` | ACE-Step | MIT |

---

## 4. Privacy

Uploaded story documents stay in local `storage/uploads/` and are sent only to the configured text/media providers. Personal family names and private identifiers are excluded from prompts.
