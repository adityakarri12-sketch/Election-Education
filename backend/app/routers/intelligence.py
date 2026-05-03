from fastapi import APIRouter, Depends, HTTPException
from typing import Any, Dict, List

from app.models.schemas import (
    ChatRequest, ChatResponse, 
    TranslationRequest, TranslationResponse, 
    ConstituencyPulse, LiveIntelligence
)
from app.services.intelligence_service import IntelligenceService
from app.repositories.ai_repository import AIRepository
from app.services.ai_cluster import GenAICluster, IntelligenceCache
from app.core.config import settings

router = APIRouter(prefix="/intelligence", tags=["Intelligence"])

# Dependency Providers
def get_ai_cluster() -> GenAICluster:
    """Provides a singleton instance of the GenAI cluster."""
    return GenAICluster(settings.api_keys_list)

def get_cache() -> IntelligenceCache:
    """Provides a singleton instance of the intelligence cache."""
    return IntelligenceCache(ttl_seconds=settings.CACHE_TTL)

def get_intelligence_service(
    cluster: GenAICluster = Depends(get_ai_cluster),
    cache: IntelligenceCache = Depends(get_cache)
) -> IntelligenceService:
    """Injects and provides the IntelligenceService."""
    repo = AIRepository(cluster)
    return IntelligenceService(repo, cache)

@router.get("/live", response_model=LiveIntelligence)
async def get_live_intelligence(
    service: IntelligenceService = Depends(get_intelligence_service)
) -> LiveIntelligence:
    """
    Retrieves real-time election intelligence.
    """
    data = await service.get_live_intelligence()
    return LiveIntelligence(**data)

@router.get("/constituency/{pincode}", response_model=ConstituencyPulse)
async def get_constituency_pulse(
    pincode: str,
    service: IntelligenceService = Depends(get_intelligence_service)
) -> ConstituencyPulse:
    """
    Maps a pincode to electoral representatives.
    """
    try:
        data = await service.get_constituency_pulse(pincode)
        return ConstituencyPulse(**data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/booths/{pincode}", response_model=List[Dict[str, Any]])
async def get_nearby_booths(
    pincode: str,
    service: IntelligenceService = Depends(get_intelligence_service)
) -> List[Dict[str, Any]]:
    """
    Returns nearby polling booths for a specific region.
    """
    return await service.get_nearby_booths(pincode)

@router.post("/chatbot", response_model=ChatResponse)

async def chat_with_electra(
    request: ChatRequest,
    service: IntelligenceService = Depends(get_intelligence_service)
) -> ChatResponse:
    """
    AI assistant for electoral education.
    """
    response_text = await service.chat_with_assistant(request.message)
    return ChatResponse(response=response_text)

@router.post("/translate", response_model=TranslationResponse)
async def translate_text(
    request: TranslationRequest,
    service: IntelligenceService = Depends(get_intelligence_service)
) -> TranslationResponse:
    """
    Translates electoral content.
    """
    translated = await service.translate_content(request.text, request.target_lang)
    return TranslationResponse(translated_text=translated)
