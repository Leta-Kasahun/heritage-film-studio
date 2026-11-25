import json
import re
import time
from typing import Any
import httpx
from app.core.config import get_settings
from app.core.logging import StopWatch, append_run_log

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


def _sanitize_error(exc: Exception) -> str:
    return re.sub(r"key=[^&\s'\"]+", "key=***", str(exc))


def _post_gemini(
    model: str,
    payload: dict[str, Any],
    stage: str,
    log_params: dict[str, Any],
    retries: int = 3,
) -> dict[str, Any]:
    settings = get_settings()
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not configured")

    url = GEMINI_URL.format(model=model)
    last_error: str = ""

    for attempt in range(retries):
        with StopWatch() as sw:
            try:
                with httpx.Client(timeout=90.0) as client:
                    res = client.post(
                        url,
                        params={"key": settings.GEMINI_API_KEY},
                        json=payload,
                    )
                if res.status_code in (429, 500, 502, 503, 504) and attempt < retries - 1:
                    time.sleep(2 ** attempt)
                    continue
                res.raise_for_status()
                data = res.json()
                append_run_log(stage=stage, model=model, params=log_params, latency_ms=sw.elapsed_ms, status="ok")
                return data
            except Exception as exc:
                last_error = _sanitize_error(exc)
                append_run_log(
                    stage=stage,
                    model=model,
                    params=log_params,
                    latency_ms=sw.elapsed_ms,
                    status="error",
                    note=last_error,
                )
                if attempt < retries - 1:
                    time.sleep(2 ** attempt)

    raise RuntimeError(f"Gemini request failed after {retries} attempts: {last_error}")


def _post_groq(prompt: str, stage: str, log_params: dict[str, Any], json_mode: bool = False) -> str:
    settings = get_settings()
    if not settings.GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY is not configured")

    body: dict[str, Any] = {
        "model": settings.GROQ_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 2048,
        "reasoning_effort": "low",
    }
    if json_mode:
        body["response_format"] = {"type": "json_object"}

    with StopWatch() as sw:
        try:
            with httpx.Client(timeout=90.0) as client:
                res = client.post(
                    GROQ_URL,
                    headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}"},
                    json=body,
                )
            res.raise_for_status()
            content = res.json()["choices"][0]["message"]["content"].strip()
            append_run_log(stage=stage, model=settings.GROQ_MODEL, params=log_params, latency_ms=sw.elapsed_ms, status="ok")
            return content
        except Exception as exc:
            append_run_log(
                stage=stage,
                model=settings.GROQ_MODEL,
                params=log_params,
                latency_ms=sw.elapsed_ms,
                status="error",
                note=_sanitize_error(exc),
            )
            raise


def _extract_text(data: dict[str, Any]) -> str:
    candidates = data.get("candidates", [])
    if not candidates:
        raise RuntimeError("Gemini returned no candidates")
    parts = candidates[0].get("content", {}).get("parts", [])
    return "".join(part.get("text", "") for part in parts).strip()


def generate_script(topic: str, source_text: str, language_code: str) -> str:
    settings = get_settings()
    prompt = (
        f"Write a concise 60-90 second documentary narration script (140-200 words) "
        f"in language '{language_code}' about: {topic}.\n"
        f"Keep sentences short, vivid, and natural for spoken narration.\n\n"
        f"Source notes:\n{source_text[:4000]}"
    )
    log_params = {"language": language_code, "topic": topic[:80]}
    try:
        data = _post_gemini(
            model=settings.GEMINI_MODEL,
            payload={"contents": [{"parts": [{"text": prompt}]}]},
            stage="script",
            log_params=log_params,
        )
        return _extract_text(data)
    except Exception:
        if settings.GROQ_API_KEY:
            return _post_groq(prompt, stage="script", log_params=log_params)
        raise


def generate_storyboard(
    script_text: str,
    language_code: str,
    num_shots: int = 10,
) -> dict[str, Any]:
    settings = get_settings()
    prompt = (
        f"Convert this narration script into a JSON storyboard with exactly {num_shots} shots "
        f"(total duration 60-90 seconds, each shot 4-10 seconds).\n"
        f"Return valid JSON matching keys: logline, audience, intent, language ('{language_code}'), "
        f"music_style, style_block, end_card_text, and shots (array of objects with index, description, "
        f"image_prompt, motion_prompt, narration_text, narration_en, duration_s, music_cue, reason).\n"
        f"Every image_prompt must be >= 25 characters and repeat the shared style_block.\n\n"
        f"Script:\n{script_text}"
    )
    log_params = {"language": language_code, "num_shots": num_shots}
    try:
        data = _post_gemini(
            model=settings.GEMINI_MODEL,
            payload={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"responseMimeType": "application/json"},
            },
            stage="storyboard",
            log_params=log_params,
        )
        return json.loads(_extract_text(data))
    except Exception:
        if settings.GROQ_API_KEY:
            return json.loads(_post_groq(prompt, stage="storyboard", log_params=log_params, json_mode=True))
        raise
