import pytest
import json
from unittest.mock import AsyncMock, MagicMock
from app.services.intelligence_service import IntelligenceService

@pytest.mark.asyncio
async def test_get_live_intelligence_success():
    # Setup
    mock_ai = AsyncMock()
    mock_ai.generate.return_value = json.dumps({
        "upcoming_elections": [{"title": "Test Election", "date": "May 2026", "type": "Assembly"}],
        "upcoming_results": [],
        "past_results": []
    })
    mock_cache = MagicMock()
    mock_cache.get.return_value = None
    
    service = IntelligenceService(mock_ai, mock_cache)
    
    # Execute
    result = await service.get_live_intelligence()
    
    # Assert
    assert result["upcoming_elections"][0]["title"] == "Test Election"
    mock_ai.generate.assert_called_once()
    mock_cache.set.assert_called_once()

@pytest.mark.asyncio
async def test_get_constituency_pulse_failure_fallback():
    mock_ai = AsyncMock()
    mock_ai.generate.side_effect = Exception("API Error")
    mock_cache = MagicMock()
    service = IntelligenceService(mock_ai, mock_cache)
    result = await service.get_constituency_pulse("123456")
    assert "Electoral District" in result["name"]

@pytest.mark.asyncio
async def test_get_live_intelligence_failure_fallback():
    mock_ai = AsyncMock()
    mock_ai.generate.side_effect = Exception("API Error")
    mock_cache = MagicMock()
    mock_cache.get.return_value = None
    
    service = IntelligenceService(mock_ai, mock_cache)
    result = await service.get_live_intelligence()
    
    assert "West Bengal Assembly" in str(result)

@pytest.mark.asyncio
async def test_get_live_intelligence_cache_hit():

    mock_ai = AsyncMock()
    mock_cache = MagicMock()
    mock_cache.get.return_value = {"cached": "data"}
    service = IntelligenceService(mock_ai, mock_cache)
    result = await service.get_live_intelligence()
    assert result == {"cached": "data"}

@pytest.mark.asyncio
async def test_translate_content_failure():
    mock_ai = AsyncMock()
    mock_ai.generate.side_effect = Exception("Translation Error")
    mock_cache = MagicMock()
    service = IntelligenceService(mock_ai, mock_cache)
    result = await service.translate_content("Hello", "fr")
    assert "[Service Temporarily Unavailable]" in result

@pytest.mark.asyncio
async def test_chat_with_assistant_failure():
    mock_ai = AsyncMock()
    mock_ai.generate.side_effect = Exception("Chat Error")
    mock_cache = MagicMock()
    service = IntelligenceService(mock_ai, mock_cache)
    result = await service.chat_with_assistant("Hi")
    assert "recalibrating" in result


