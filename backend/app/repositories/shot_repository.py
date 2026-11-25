import uuid
from sqlalchemy.orm import Session
from app.db.models.shot import Shot
from app.schemas.shot import ShotCreate, ShotUpdate


class ShotRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, payload: ShotCreate) -> Shot:
        record = Shot(
            project_id=payload.project_id,
            shot_number=payload.shot_number,
            title=payload.title,
            duration_seconds=payload.duration_seconds,
            narration_text=payload.narration_text,
            subtitle_text=payload.subtitle_text,
            visual_prompt=payload.visual_prompt,
            metadata_=payload.metadata_,
        )
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return record

    def get_by_id(self, shot_id: uuid.UUID) -> Shot | None:
        return self.db.get(Shot, shot_id)

    def list_by_project(self, project_id: uuid.UUID) -> list[Shot]:
        return (
            self.db.query(Shot)
            .filter(Shot.project_id == project_id)
            .order_by(Shot.shot_number)
            .all()
        )

    def update(self, shot: Shot, payload: ShotUpdate) -> Shot:
        data = payload.model_dump(exclude_unset=True)
        for key, value in data.items():
            setattr(shot, key, value)
        self.db.commit()
        self.db.refresh(shot)
        return shot

    def delete(self, shot: Shot) -> None:
        self.db.delete(shot)
        self.db.commit()
