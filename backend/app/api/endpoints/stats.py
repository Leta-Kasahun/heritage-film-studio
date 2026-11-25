from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.db.models.asset import Asset
from app.db.models.project import Project
from app.db.session import get_db

router = APIRouter(prefix="/stats", tags=["stats"])


class StudioStatsResponse(BaseModel):
    total_projects: int
    videos_generated: int
    storage_bytes: int
    languages_count: int


@router.get("/", response_model=StudioStatsResponse)
def get_studio_stats(db: Session = Depends(get_db)):
    total_projects = db.query(func.count(Project.id)).scalar() or 0
    videos_generated = (
        db.query(func.count(Asset.id))
        .filter(Asset.asset_type == "video")
        .scalar()
        or 0
    )
    storage_bytes = db.query(func.coalesce(func.sum(Asset.size_bytes), 0)).scalar() or 0
    languages_count = (
        db.query(func.count(func.distinct(Project.language_code))).scalar() or 0
    )
    return StudioStatsResponse(
        total_projects=total_projects,
        videos_generated=videos_generated,
        storage_bytes=int(storage_bytes),
        languages_count=languages_count,
    )
