"""
Shared pytest fixtures and configuration for ElectraLearn tests.
"""

import os
import sys
from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient

# Ensure app directory is in path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app


@pytest.fixture(autouse=True)
def mock_settings(monkeypatch):
    """
    Ensures environment variables are set for testing.
    """
    monkeypatch.setenv("GEMINI_API_KEY", "test-key")
    monkeypatch.setenv("GOOGLE_MAPS_API_KEY", "test-key")


@pytest.fixture(autouse=True)
def mock_external_services(mocker):
    """
    Globally mocks external AI and Cloud services to prevent API calls.
    """
    # Mock GenAI Cluster
    mock_genai = mocker.patch("app.services.ai_cluster.GenAICluster")
    instance = mock_genai.return_value
    
    # Default JSON response for repo.fetch_json_data
    instance.generate.return_value = (
        '{"upcoming_elections": [{"title": "Test", "date": "2026", "type": "Test"}], '
        '"upcoming_results": [], '
        '"past_results": [{"title": "Past", "summary": "Past"}], '
        '"name": "Test District", "state": "Test", "mp": "Test", "mla": "Test", '
        '"district": "Test", "booths": 100, "turnout": "80%", "status": "Active", '
        '"id": 1, "distance": "1km", "address": "test", "confidence": 0.99, '
        '"extracted_data": {"id_type": "EPIC_CARD"}, "score": 100, "message": "success", '
        '"status": "Verified", "response": "AI Response", "evaluation_score": 100}'
    )
    
    # Mock Cache
    mocker.patch("app.services.ai_cluster.IntelligenceCache")
    
    return instance


@pytest.fixture
def client():
    """
    Provides a TestClient.
    """
    return TestClient(app)
