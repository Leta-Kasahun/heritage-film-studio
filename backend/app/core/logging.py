import json
import time
from datetime import datetime, timezone
from typing import Any
from app.core.config import get_settings


def current_iso_timestamp() -> str:
    return datetime.now(timezone.utc).isoformat()


def append_run_log(
    stage: str,
    model: str,
    params: dict[str, Any],
    latency_ms: float,
    seed: int | None = None,
    cost_usd: float = 0.0,
    status: str = "ok",
    note: str = "",
) -> None:
    payload = {
        "ts": current_iso_timestamp(),
        "stage": stage,
        "model": model,
        "params": params,
        "seed": seed,
        "latency_ms": round(latency_ms, 2),
        "cost_usd": cost_usd,
        "status": status,
        "note": note,
    }
    settings = get_settings()
    with settings.RUNS_LOG.open("a", encoding="utf-8") as file:
        file.write(json.dumps(payload, ensure_ascii=False) + "\n")


class StopWatch:
    def __enter__(self) -> "StopWatch":
        self.start_time = time.perf_counter()
        return self

    def __exit__(self, *args: object) -> None:
        self.duration_ms = (time.perf_counter() - self.start_time) * 1000

    @property
    def elapsed_ms(self) -> float:
        return getattr(self, "duration_ms", 0.0)
