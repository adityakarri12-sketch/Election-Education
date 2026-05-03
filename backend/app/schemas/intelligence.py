"""
Schemas for electoral intelligence data.
Defines strict Pydantic models for all intelligence-related payloads.
"""

from typing import List

from pydantic import BaseModel, Field


class ElectionInfo(BaseModel):
    """Details of a specific election."""

    title: str
    date: str
    type: str


class ResultSummary(BaseModel):
    """Summary of past election results."""

    title: str
    summary: str


class LiveIntelligence(BaseModel):
    """Comprehensive real-time election report."""

    upcoming_elections: List[ElectionInfo]
    upcoming_results: List[str] = []
    past_results: List[ResultSummary]


class BoothInfo(BaseModel):
    """Location and status details for a polling booth."""

    id: int
    name: str
    distance: str
    status: str
    address: str


class ConstituencyPulse(BaseModel):
    """Electoral profile for a specific region."""

    name: str
    state: str
    mp: str
    mla: str
    district: str
    booths: int
    turnout: str
    status: str


class ChatRequest(BaseModel):
    """User request for AI interaction."""

    message: str = Field(..., min_length=1)


class ChatResponse(BaseModel):
    """AI response for the chatbot."""

    response: str


class TranslationRequest(BaseModel):
    """Request to translate text."""

    text: str
    target_lang: str


class TranslationResponse(BaseModel):
    """Payload containing translated content."""

    translated_text: str
