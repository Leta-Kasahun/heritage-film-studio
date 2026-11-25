import uuid
from sqlalchemy.orm import Session
from app.db.models.asset import Asset
from app.schemas.asset import AssetCreate


class AssetRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, payload: AssetCreate) -> Asset:
        record = Asset(
            project_id=payload.project_id,
            shot_id=payload.shot_id,
            generation_run_id=payload.generation_run_id,
            asset_type=payload.asset_type,
            role=payload.role,
            storage_provider=payload.storage_provider,
            bucket=payload.bucket,
            object_key=payload.object_key,
            mime_type=payload.mime_type,
            size_bytes=payload.size_bytes,
            checksum_sha256=payload.checksum_sha256,
            width_px=payload.width_px,
            height_px=payload.height_px,
            duration_seconds=payload.duration_seconds,
            metadata_=payload.metadata_,
        )
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return record

    def get_by_id(self, asset_id: uuid.UUID) -> Asset | None:
        return self.db.get(Asset, asset_id)

    def list_by_project(
        self, project_id: uuid.UUID, skip: int = 0, limit: int = 24
    ) -> list[Asset]:
        return (
            self.db.query(Asset)
            .filter(Asset.project_id == project_id)
            .order_by(Asset.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def delete(self, asset: Asset) -> None:
        self.db.delete(asset)
        self.db.commit()
