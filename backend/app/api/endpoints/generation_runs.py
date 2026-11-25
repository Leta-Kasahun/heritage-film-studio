import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.exceptions import NotFoundException
from app.db.session import get_db
from app.repositories.generation_run_repository import GenerationRunRepository
from app.schemas.generation_run import GenerationRunCreate, GenerationRunResponse

router = APIRouter(prefix="/generation-runs", tags=["generation_runs"])


@router.post("/", response_model=GenerationRunResponse, status_code=201)
def create_generation_run(payload: GenerationRunCreate, db: Session = Depends(get_db)):
    return GenerationRunRepository(db).create(payload)


@router.get("/project/{project_id}", response_model=list[GenerationRunResponse])
def list_runs_by_project(project_id: uuid.UUID, db: Session = Depends(get_db)):
    return GenerationRunRepository(db).list_by_project(project_id)


@router.get("/{run_id}", response_model=GenerationRunResponse)
def get_generation_run(run_id: uuid.UUID, db: Session = Depends(get_db)):
    run = GenerationRunRepository(db).get_by_id(run_id)
    if not run:
        raise NotFoundException("GenerationRun", run_id)
    return run
