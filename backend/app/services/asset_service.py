import uuid
from pathlib import Path
from sqlalchemy.orm import Session
from app.core.config import get_settings
from app.core.exceptions import NotFoundException
from app.db.models.asset import Asset
from app.repositories.asset_repository import AssetRepository


class AssetService:
    def __init__(self, db: Session) -> None:
        self.repo = AssetRepository(db)
        self.storage_dir = get_settings().STORAGE_DIR.resolve()

    def get_asset(self, asset_id: uuid.UUID) -> Asset:
        asset = self.repo.get_by_id(asset_id)
        if not asset:
            raise NotFoundException("Asset", asset_id)
        return asset

    def resolve_file_path(self, asset: Asset) -> Path:
        target = (self.storage_dir / asset.object_key).resolve()
        if not target.is_relative_to(self.storage_dir) or not target.is_file():
            raise NotFoundException("Asset file", asset.id)
        return target

    def delete_asset(self, asset_id: uuid.UUID) -> None:
        asset = self.get_asset(asset_id)
        target = (self.storage_dir / asset.object_key).resolve()
        if target.is_relative_to(self.storage_dir) and target.is_file():
            target.unlink()
        self.repo.delete(asset)
