"""
Router for electoral intelligence endpoints.
Handles HTTP requests and delegates to the IntelligenceService.
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.api.dependencies import get_intelligence_service
from app.schemas.intelligence import (
    BoothInfo,
    ChatRequest,
    ChatResponse,
    ConstituencyPulse,
    LiveIntelligence,
)
from app.schemas.response import APIResponse
from app.services.intelligence_service import IntelligenceService

router = APIRouter(prefix="/intelligence", tags=["Intelligence"])


@router.get("/live", response_model=APIResponse[LiveIntelligence])
async def get_live_intelligence(
    service: IntelligenceService = Depends(get_intelligence_service),
) -> APIResponse[LiveIntelligence]:
    """
    Retrieves real-time election intelligence.
    """
    data = await service.get_live_intelligence()
    return APIResponse(data=data)


@router.get("/constituency/{pincode}", response_model=APIResponse[ConstituencyPulse])
async def get_constituency_pulse(
    pincode: str, service: IntelligenceService = Depends(get_intelligence_service)
) -> APIResponse[ConstituencyPulse]:
    """
    Maps a pincode to electoral representatives.
    """
    try:
        data = await service.get_constituency_pulse(pincode)
        return APIResponse(data=data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.get("/booths/{pincode}", response_model=APIResponse[List[BoothInfo]])
async def get_nearby_booths(
    pincode: str, service: IntelligenceService = Depends(get_intelligence_service)
) -> APIResponse[List[BoothInfo]]:
    """
    Returns nearby polling booths for a specific region.
    """
    data = await service.get_nearby_booths(pincode)
    return APIResponse(data=data)


@router.post("/chatbot", response_model=APIResponse[ChatResponse])
async def chat_with_electra(
    request: ChatRequest,
    service: IntelligenceService = Depends(get_intelligence_service),
) -> APIResponse[ChatResponse]:
    """
    AI assistant for electoral education.
    """
    response_text = await service.chat_with_assistant(request.message)
    return APIResponse(data=ChatResponse(response=response_text))
