"""
Router for system-level diagnostic endpoints.
Provides health checks and evaluation metrics.
"""

from typing import Any, Dict

from fastapi import APIRouter, Depends

from app.api.dependencies import get_system_service
from app.schemas.response import APIResponse
from app.services.system_service import SystemService

router = APIRouter(prefix="/system", tags=["System"])


@router.get("/health", response_model=APIResponse[Dict[str, str]])
async def health_check(
    service: SystemService = Depends(get_system_service),
) -> APIResponse[Dict[str, str]]:
    """
    Returns the operational status of the platform core.
    """
    return APIResponse(data=service.get_health_status())


@router.get("/evaluate", response_model=APIResponse[Dict[str, Any]])
async def get_evaluation_metrics(
    service: SystemService = Depends(get_system_service),
) -> APIResponse[Dict[str, Any]]:
    """
    Provides real-time proof signals for the evaluation system.
    """
    return APIResponse(data=service.get_evaluation_metrics())
