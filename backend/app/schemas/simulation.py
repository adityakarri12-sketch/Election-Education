"""
Schemas for electoral simulation data.
"""

from typing import Any, Dict, List

from pydantic import BaseModel, Field


class ProgressData(BaseModel):
    """User progress and score data."""
    score: int = Field(..., ge=0, le=1000)
    user_id: str = Field(default="anonymous", min_length=3)


class LeaderboardEntry(BaseModel):
    """Entry in the global leaderboard."""
    id: int
    name: str
    score: int
    rank: int


class IDVerificationResult(BaseModel):
    """Results of AI document verification."""
    status: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    extracted_data: Dict[str, Any]
