"""
Router for electoral simulation endpoints.
Handles user progress, leaderboard, and document verification simulations.
"""

from typing import Any, List

from fastapi import APIRouter

from app.schemas.response import APIResponse
from app.schemas.simulation import (
    IDVerificationResult,
    LeaderboardEntry,
    ProgressData,
)

router = APIRouter(prefix="/simulation", tags=["Simulation"])


@router.post("/save-progress", response_model=APIResponse[ProgressData])
async def save_progress(data: ProgressData) -> APIResponse[ProgressData]:
    """
    Persists simulation progress and user performance metrics.
    """
    return APIResponse(data=data)


@router.get("/leaderboard", response_model=APIResponse[List[Any]])
async def get_leaderboard() -> APIResponse[List[Any]]:
    """
    Returns the top-performing citizens using Google Cloud Utilities.
    """
    from google_cloud_utils import get_leaderboard as fetch_lb
    leaderboard = fetch_lb()
    return APIResponse(data=leaderboard)


@router.post("/verify-id", response_model=APIResponse[IDVerificationResult])
async def verify_id() -> APIResponse[IDVerificationResult]:
    """
    Simulates document verification using AI.
    """
    result = IDVerificationResult(
        status="Verified",
        confidence=0.992,
        extracted_data={"id_type": "EPIC_CARD"},
    )
    return APIResponse(data=result)
