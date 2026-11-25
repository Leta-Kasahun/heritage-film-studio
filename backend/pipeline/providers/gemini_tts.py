import base64
from app.core.config import get_settings
from pipeline.providers.gemini import _post_gemini


def generate_narration(
    text: str,
    language_code: str = "am",
    voice_style: str = "calm, warm, unhurried documentary narrator",
    voice_name: str = "Kore",
) -> tuple[bytes, str]:
    settings = get_settings()
    prompt = f"Speak in {language_code} with a {voice_style} tone:\n{text}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {
                "voiceConfig": {
                    "prebuiltVoiceConfig": {"voiceName": voice_name}
                }
            },
        },
    }
    data = _post_gemini(
        model=settings.GEMINI_TTS_MODEL,
        payload=payload,
        stage="narration",
        log_params={"language": language_code, "voice": voice_name, "chars": len(text)},
    )
    parts = data["candidates"][0]["content"]["parts"]
    inline = next((p["inlineData"] for p in parts if "inlineData" in p), None)
    if not inline:
        raise RuntimeError("Gemini TTS returned no inline audio data")
    audio_bytes = base64.b64decode(inline["data"])
    mime_type = inline.get("mimeType", "audio/L16;rate=24000")
    return audio_bytes, mime_type
