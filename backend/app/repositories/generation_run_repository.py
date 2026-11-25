import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.db.models.generation_run import GenerationRun
from app.schemas.generation_run import GenerationRunCreate


class GenerationRunRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, payload: GenerationRunCreate) -> GenerationRun:
        record = GenerationRun(
            project_id=payload.project_id,
            shot_id=payload.shot_id,
            stage=payload.stage,
            provider=payload.provider,
            model=payload.model,
            status=payload.status,
            prompt=payload.prompt,
            input_data=payload.input_data,
            parameters=payload.parameters,
            output_data=payload.output_data,
            error_message=payload.error_message,
            cost_usd=payload.cost_usd,
            started_at=payload.started_at,
            completed_at=payload.completed_at,
        )
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return record

    def get_by_id(self, run_id: uuid.UUID) -> GenerationRun | None:
        return self.db.get(GenerationRun, run_id)

    def list_by_project(self, project_id: uuid.UUID) -> list[GenerationRun]:
        return (
            self.db.query(GenerationRun)
            .filter(GenerationRun.project_id == project_id)
            .order_by(GenerationRun.created_at.desc())
            .all()
        )

    def mark_completed(
        self,
        run: GenerationRun,
        status: str,
        output_data: dict | None = None,
        error_message: str | None = None,
    ) -> GenerationRun:
        run.status = status
        run.completed_at = datetime.now(timezone.utc)
        if output_data is not None:
            run.output_data = output_data
        if error_message is not None:
            run.error_message = error_message
        self.db.commit()
        self.db.refresh(run)
        return run
