"""
Unit tests for AIRepository.
"""

import pytest
from unittest.mock import AsyncMock
from app.repositories.ai_repository import AIRepository


@pytest.mark.asyncio
async def test_fetch_json_success() -> None:
    """Tests successful JSON fetching and parsing."""
    cluster = AsyncMock()
    cluster.generate.return_value = '{"key": "value"}'
    repo = AIRepository(cluster)
    
    result = await repo.fetch_json_data("prompt")
    assert result == {"key": "value"}


@pytest.mark.asyncio
async def test_fetch_text_success() -> None:
    """Tests successful raw text fetching."""
    cluster = AsyncMock()
    cluster.generate.return_value = "raw text"
    repo = AIRepository(cluster)
    
    result = await repo.fetch_text_data("prompt")
    assert result == "raw text"
