import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.exceptions import NotFoundException
from app.db.session import get_db
from app.repositories.shot_repository import ShotRepository
from app.schemas.shot import ShotCreate, ShotResponse, ShotUpdate

router = APIRouter(prefix="/shots", tags=["shots"])


@router.post("/", response_model=ShotResponse, status_code=201)
def create_shot(payload: ShotCreate, db: Session = Depends(get_db)):
    return ShotRepository(db).create(payload)


@router.get("/project/{project_id}", response_model=list[ShotResponse])
def list_shots_by_project(project_id: uuid.UUID, db: Session = Depends(get_db)):
    return ShotRepository(db).list_by_project(project_id)


@router.get("/{shot_id}", response_model=ShotResponse)
def get_shot(shot_id: uuid.UUID, db: Session = Depends(get_db)):
    shot = ShotRepository(db).get_by_id(shot_id)
    if not shot:
        raise NotFoundException("Shot", shot_id)
    return shot


@router.patch("/{shot_id}", response_model=ShotResponse)
def update_shot(shot_id: uuid.UUID, payload: ShotUpdate, db: Session = Depends(get_db)):
    repo = ShotRepository(db)
    shot = repo.get_by_id(shot_id)
    if not shot:
        raise NotFoundException("Shot", shot_id)
    return repo.update(shot, payload)


@router.delete("/{shot_id}", status_code=204)
def delete_shot(shot_id: uuid.UUID, db: Session = Depends(get_db)):
    repo = ShotRepository(db)
    shot = repo.get_by_id(shot_id)
    if not shot:
        raise NotFoundException("Shot", shot_id)
    repo.delete(shot)
