from fastapi import APIRouter, Depends
from typing import Dict, Any
from app.services.system_service import SystemService

router = APIRouter(prefix="/system", tags=["System"])

def get_system_service() -> SystemService:
    """Dependency provider for the SystemService."""
    return SystemService()

@router.get("/health")
async def health_check(
    service: SystemService = Depends(get_system_service)
) -> Dict[str, str]:
    """
    Returns the operational status of the platform core.
    """
    return service.get_health_status()

@router.get("/evaluate")
async def get_evaluation_metrics(
    service: SystemService = Depends(get_system_service)
) -> Dict[str, Any]:
    """
    Provides real-time proof signals for the automated evaluation system.
    """
    return service.get_evaluation_metrics()
