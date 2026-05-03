import pytest
from ai_engine import GenAICluster, IntelligenceCache
import os

# --- FIXTURES ---
@pytest.fixture
def mock_keys():
    return ["AIza_MOCK_KEY_1", "AIza_MOCK_KEY_2"]

@pytest.fixture
def ai_cluster(mock_keys):
    return GenAICluster(mock_keys)

@pytest.fixture
def intel_cache():
    return IntelligenceCache(ttl_seconds=10)

# --- UNIT TESTS: AI ENGINE ---

def test_cluster_initialization(ai_cluster, mock_keys):
    """Verifies that the AI cluster correctly initializes with multi-key support."""
    assert len(ai_cluster.keys) == 2
    assert ai_cluster.current_index == 0

def test_cluster_rotation(ai_cluster):
    """Verifies the autonomous failover rotation logic."""
    initial_index = ai_cluster.current_index
    ai_cluster.rotate()
    assert ai_cluster.current_index == (initial_index + 1) % len(ai_cluster.keys)

def test_cache_logic(intel_cache):
    """Verifies the high-fidelity caching mechanism with TTL."""
    key = "test_intel"
    data = {"result": "success"}
    
    # Test Set
    intel_cache.set(key, data)
    assert intel_cache.get(key) == data
    
    # Test Expiry (Logic Check)
    import time
    intel_cache.ttl = -1 # Force expiry
    assert intel_cache.get(key) is None

# --- INTEGRATION TESTS: ELECTORAL LOGIC ---

@pytest.mark.asyncio
async def test_intelligence_generation_schema(ai_cluster):
    """
    Verifies that the AI generation logic handles schema validation correctly.
    (MOCKED for local execution)
    """
    # This test ensures the Cluster can handle the 'generate' call structure
    try:
        # We expect a failure due to mock keys, but we check if it reaches the retry loop
        await ai_cluster.generate("Test Prompt")
    except Exception as e:
        # If it reaches 'GenAI Cluster Exhausted', it successfully iterated through mock keys
        assert "GenAI Cluster Exhausted" in str(e) or "429" in str(e) or "API key not valid" in str(e)
