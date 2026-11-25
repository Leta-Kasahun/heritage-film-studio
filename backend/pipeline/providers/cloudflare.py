import base64
import time
import httpx
from app.core.config import get_settings
from app.core.logging import StopWatch, append_run_log

CF_URL = "https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/{model}"


def _decode_image_response(res: httpx.Response) -> bytes:
    content_type = res.headers.get("content-type", "")
    if "application/json" in content_type:
        b64 = res.json()["result"]["image"]
        return base64.b64decode(b64)
    return res.content


def generate_image(
    prompt: str,
    width: int = 1280,
    height: int = 720,
    seed: int | None = None,
    steps: int = 4,
) -> bytes:
    settings = get_settings()
    if not settings.CLOUDFLARE_ACCOUNT_ID or not settings.CLOUDFLARE_API_TOKEN:
        raise RuntimeError("Cloudflare Workers AI credentials are not configured")

    models = [settings.CF_IMAGE_MODEL, settings.CF_IMAGE_ALT_MODEL]
    headers = {"Authorization": f"Bearer {settings.CLOUDFLARE_API_TOKEN}"}

    last_error: Exception | None = None
    for model in models:
        if not model:
            continue
        url = CF_URL.format(account_id=settings.CLOUDFLARE_ACCOUNT_ID, model=model)
        with StopWatch() as sw:
            try:
                with httpx.Client(timeout=120.0) as client:
                    if "flux-2" in model:
                        res = client.post(url, headers=headers, files={"prompt": (None, prompt)})
                    else:
                        body: dict[str, object] = {"prompt": prompt, "steps": steps}
                        res = client.post(url, headers=headers, json=body)
                if res.status_code == 429:
                    time.sleep(2)
                res.raise_for_status()
                append_run_log(
                    stage="keyframes",
                    model=model,
                    params={"width": width, "height": height, "steps": steps},
                    seed=seed,
                    latency_ms=sw.elapsed_ms,
                    status="ok",
                )
                return _decode_image_response(res)
            except Exception as exc:
                last_error = exc
                append_run_log(
                    stage="keyframes",
                    model=model,
                    params={"width": width, "height": height, "steps": steps},
                    seed=seed,
                    latency_ms=sw.elapsed_ms,
                    status="error",
                    note=str(exc).split("?")[0],
                )

    raise RuntimeError(f"Cloudflare image generation failed: {last_error}")
