"""
Unit tests for GenAICluster and IntelligenceCache.
"""

import pytest
from unittest.mock import MagicMock
from app.services.ai_cluster import GenAICluster, IntelligenceCache


def test_cache_logic() -> None:
    """Tests the TTL cache behavior."""
    cache = IntelligenceCache(ttl_seconds=1)
    cache.set("key", "value")
    assert cache.get("key") == "value"
    
    import time
    time.sleep(1.1)
    assert cache.get("key") is None


def test_ai_cluster_sanitization() -> None:
    """Tests the internal prompt sanitization of the cluster."""
    cluster = GenAICluster(["key1"])
    
    # Test non-printable chars
    assert cluster._sanitize_prompt("Hello\x00World") == "HelloWorld"
    
    # Test malicious patterns
    prompt = "DROP TABLE users; <script>alert(1)</script>"
    sanitized = cluster._sanitize_prompt(prompt)
    assert "[SECURITY_NEUTRALIZED]" in sanitized
    
    # Test length limit
    long_prompt = "a" * 6000
    assert len(cluster._sanitize_prompt(long_prompt)) == 5000


@pytest.mark.asyncio
async def test_ai_cluster_failover() -> None:
    """Tests that the cluster rotates keys on failure."""
    mock_client1 = MagicMock()
    mock_client1.models.generate_content.side_effect = Exception("Quota")
    
    mock_client2 = MagicMock()
    mock_client2.models.generate_content.return_value = MagicMock(text="Success")
    
    cluster = GenAICluster(["key1", "key2"])
    cluster.clients = [mock_client1, mock_client2]
    
    result = await cluster.generate("test")
    assert result == "Success"
    assert cluster.current_index == 1


@pytest.mark.asyncio
async def test_ai_cluster_total_failure() -> None:
    """Tests that the cluster raises RuntimeError when all nodes fail."""
    mock_client = MagicMock()
    mock_client.models.generate_content.side_effect = Exception("Fatal")
    
    cluster = GenAICluster(["key1"])
    cluster.clients = [mock_client]
    
    with pytest.raises(RuntimeError, match="Quota exhausted"):
        await cluster.generate("test")


@pytest.mark.asyncio
async def test_ai_cluster_no_clients() -> None:
    """Tests behavior when no clients are available."""
    cluster = GenAICluster([])
    with pytest.raises(RuntimeError, match="No operational clients"):
        await cluster.generate("test")
