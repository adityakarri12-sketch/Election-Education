"""
Unit tests for IntelligenceService.
Verifies logic paths and fallback behavior when AI fails.
"""

import pytest
from unittest.mock import MagicMock, AsyncMock
from app.services.intelligence_service import IntelligenceService
from app.schemas.intelligence import LiveIntelligence, ConstituencyPulse


@pytest.mark.asyncio
async def test_live_intelligence_success() -> None:
    """Tests successful live intelligence retrieval with caching."""
    repo = AsyncMock()
    repo.fetch_json_data.return_value = {
        "upcoming_elections": [], 
        "upcoming_results": [], 
        "past_results": []
    }
    cache = MagicMock()
    cache.get.return_value = None
    
    service = IntelligenceService(repo, cache)
    result = await service.get_live_intelligence()
    
    assert isinstance(result, LiveIntelligence)
    cache.set.assert_called_once()


@pytest.mark.asyncio
async def test_live_intelligence_from_cache() -> None:
    """Tests that the service returns data from cache if available."""
    repo = AsyncMock()
    cache = MagicMock()
    cache.get.return_value = {
        "upcoming_elections": [], 
        "upcoming_results": [], 
        "past_results": []
    }
    
    service = IntelligenceService(repo, cache)
    result = await service.get_live_intelligence()
    
    assert isinstance(result, LiveIntelligence)
    repo.fetch_json_data.assert_not_called()


@pytest.mark.asyncio
async def test_live_intelligence_fallback() -> None:
    """
    Tests that the service returns a fallback when the AI repository fails.
    """
    repo = AsyncMock()
    repo.fetch_json_data.side_effect = Exception("AI Offline")
    cache = MagicMock()
    cache.get.return_value = None
    
    service = IntelligenceService(repo, cache)
    result = await service.get_live_intelligence()
    
    assert result.upcoming_elections[0].title == "State Elections"


@pytest.mark.asyncio
async def test_pincode_success() -> None:
    """Tests successful pincode lookup."""
    repo = AsyncMock()
    repo.fetch_json_data.return_value = {
        "name": "Test", "state": "Test", "mp": "Test", "mla": "Test",
        "district": "Test", "booths": 10, "turnout": "50%", "status": "Active"
    }
    cache = MagicMock()
    
    service = IntelligenceService(repo, cache)
    result = await service.get_constituency_pulse("111111")
    assert result.name == "Test"


@pytest.mark.asyncio
async def test_pincode_fallback() -> None:
    """
    Tests that the service returns a fallback for constituency pulse when AI fails.
    """
    repo = AsyncMock()
    repo.fetch_json_data.side_effect = Exception("AI Offline")
    cache = MagicMock()
    
    service = IntelligenceService(repo, cache)
    result = await service.get_constituency_pulse("500001")
    
    assert "District 500" in result.name


@pytest.mark.asyncio
async def test_chat_success() -> None:
    """Tests successful chat interaction."""
    repo = AsyncMock()
    repo.fetch_text_data.return_value = "Hello back"
    cache = MagicMock()
    
    service = IntelligenceService(repo, cache)
    result = await service.chat_with_assistant("Hello")
    assert result == "Hello back"


@pytest.mark.asyncio
async def test_chat_failure_message() -> None:
    """
    Tests the error message when the chat assistant fails.
    """
    repo = AsyncMock()
    repo.fetch_text_data.side_effect = Exception("AI Offline")
    cache = MagicMock()
    
    service = IntelligenceService(repo, cache)
    result = await service.chat_with_assistant("Hello")
    
    assert "recalibrating" in result
