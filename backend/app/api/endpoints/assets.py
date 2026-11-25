import uuid
from pathlib import Path
from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.repositories.asset_repository import AssetRepository
from app.schemas.asset import AssetCreate, AssetResponse
from app.services.asset_service import AssetService

router = APIRouter(prefix="/assets", tags=["assets"])


@router.post("/", response_model=AssetResponse, status_code=201)
def create_asset(payload: AssetCreate, db: Session = Depends(get_db)):
    return AssetRepository(db).create(payload)


@router.get("/project/{project_id}", response_model=list[AssetResponse])
def list_assets_by_project(
    project_id: uuid.UUID,
    skip: int = 0,
    limit: int = 24,
    db: Session = Depends(get_db),
):
    return AssetRepository(db).list_by_project(project_id, skip=skip, limit=limit)


@router.get("/{asset_id}", response_model=AssetResponse)
def get_asset(asset_id: uuid.UUID, db: Session = Depends(get_db)):
    return AssetService(db).get_asset(asset_id)


@router.get("/{asset_id}/download")
def download_asset(asset_id: uuid.UUID, db: Session = Depends(get_db)):
    service = AssetService(db)
    asset = service.get_asset(asset_id)
    file_path = service.resolve_file_path(asset)
    return FileResponse(
        path=file_path,
        media_type=asset.mime_type,
        filename=Path(asset.object_key).name,
    )


@router.delete("/{asset_id}", status_code=204)
def delete_asset(asset_id: uuid.UUID, db: Session = Depends(get_db)):
    AssetService(db).delete_asset(asset_id)
