import uuid
from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session
from app.core.exceptions import NotFoundException
from app.db.session import get_db
from app.repositories.project_repository import ProjectRepository
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate
from app.services.project_service import ProjectService

router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("/", response_model=ProjectResponse, status_code=201)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    return ProjectRepository(db).create(payload)


@router.get("/", response_model=list[ProjectResponse])
def list_projects(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return ProjectRepository(db).list(skip=skip, limit=limit)


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: uuid.UUID, db: Session = Depends(get_db)):
    return ProjectService(db).get_project(project_id)


@router.post("/{project_id}/upload", response_model=ProjectResponse)
async def upload_project_document(
    project_id: uuid.UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    return await ProjectService(db).upload_document(project_id, file)


@router.patch("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: uuid.UUID, payload: ProjectUpdate, db: Session = Depends(get_db)
):
    repo = ProjectRepository(db)
    project = repo.get_by_id(project_id)
    if not project:
        raise NotFoundException("Project", project_id)
    return repo.update(project, payload)


@router.delete("/{project_id}", status_code=204)
def delete_project(project_id: uuid.UUID, db: Session = Depends(get_db)):
    repo = ProjectRepository(db)
    project = repo.get_by_id(project_id)
    if not project:
        raise NotFoundException("Project", project_id)
    repo.delete(project)
