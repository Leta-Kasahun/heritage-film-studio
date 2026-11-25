from fastapi import APIRouter
from app.api.endpoints import assets, generation_runs, health, projects, shots, stats

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(stats.router)
api_router.include_router(projects.router)
api_router.include_router(shots.router)
api_router.include_router(generation_runs.router)
api_router.include_router(assets.router)
