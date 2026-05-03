import pytest
from unittest.mock import MagicMock, patch
from app.services.ai_cluster import GenAICluster, IntelligenceCache
import time

def test_intelligence_cache_ttl():
    cache = IntelligenceCache(ttl_seconds=1)
    cache.set("key", "value")
    assert cache.get("key") == "value"
    time.sleep(1.1)
    assert cache.get("key") is None

def test_genai_cluster_sanitization():
    cluster = GenAICluster(["key1"])
    dirty_prompt = "Hello\x00World"
    clean_prompt = cluster._sanitize_prompt(dirty_prompt)
    assert clean_prompt == "HelloWorld"
    
    # Malicious pattern
    malicious = "DROP TABLE users;"
    clean_malicious = cluster._sanitize_prompt(malicious)
    assert "[FILTERED]" in clean_malicious

@pytest.mark.asyncio
async def test_genai_cluster_rotation_failover():
    # Mocking two clients where first one fails
    with patch("app.services.ai_cluster.genai.Client") as mock_client_class:
        mock_client1 = MagicMock()
        mock_client1.models.generate_content.side_effect = Exception("Quota Exceeded")
        
        mock_client2 = MagicMock()
        mock_client2.models.generate_content.return_value = MagicMock(text="Success")
        
        mock_client_class.side_effect = [mock_client1, mock_client2]
        
        cluster = GenAICluster(["key1", "key2"])
        result = await cluster.generate("test prompt")
        
        assert result == "Success"
        assert cluster.current_index == 1

@pytest.mark.asyncio
async def test_genai_cluster_all_fail():
    with patch("app.services.ai_cluster.genai.Client") as mock_client_class:
        mock_client = MagicMock()
        mock_client.models.generate_content.side_effect = Exception("All Quota Exceeded")
        mock_client_class.return_value = mock_client
        
        cluster = GenAICluster(["key1"])
        with pytest.raises(Exception, match="Quota exhausted"):
            await cluster.generate("test")

@pytest.mark.asyncio
async def test_genai_cluster_no_clients():
    cluster = GenAICluster([])
    with pytest.raises(Exception, match="No operational clients"):
        await cluster.generate("test")



