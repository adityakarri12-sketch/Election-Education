import pytest
from fastapi.testclient import TestClient
from main import app
from unittest.mock import AsyncMock, patch
import json

client = TestClient(app)

@pytest.fixture
def mock_genai():
    with patch("app.services.ai_cluster.genai.Client") as mock:
        yield mock

def test_live_intelligence_endpoint(mock_genai):
    # Mocking the AI Cluster to return successful JSON
    with patch("app.routers.intelligence._ai_cluster.generate", new_callable=AsyncMock) as mock_generate:
        mock_generate.return_value = json.dumps({
            "upcoming_elections": [{"title": "State A", "date": "2026", "type": "Assembly"}],
            "upcoming_results": [],
            "past_results": []
        })
        
        response = client.get("/api/v1/intelligence/live")
        assert response.status_code == 200
        assert "upcoming_elections" in response.json()

def test_constituency_pulse_endpoint(mock_genai):
    with patch("app.routers.intelligence._ai_cluster.generate", new_callable=AsyncMock) as mock_generate:
        mock_generate.return_value = json.dumps({
            "name": "Test City",
            "state": "Test State",
            "mp": "Mr. MP",
            "mla": "Mr. MLA",
            "district": "Dist",
            "booths": 100,
            "turnout": "70%",
            "status": "Active"
        })
        
        response = client.get("/api/v1/intelligence/constituency/533001")
        assert response.status_code == 200
        assert response.json()["name"] == "Test City"

def test_chatbot_endpoint(mock_genai):
    with patch("app.routers.intelligence._ai_cluster.generate", new_callable=AsyncMock) as mock_generate:
        mock_generate.return_value = "Hello, I am Electra."
        
        response = client.post("/api/v1/intelligence/chatbot", json={"message": "Hi"})
        assert response.status_code == 200
        assert "Electra" in response.json()["response"]

def test_translate_endpoint(mock_genai):
    with patch("app.routers.intelligence._ai_cluster.generate", new_callable=AsyncMock) as mock_generate:
        mock_generate.return_value = "Bonjour"
        
        response = client.post("/api/v1/intelligence/translate", json={"text": "Hello", "target_lang": "fr"})
        assert response.status_code == 200
        assert response.json()["translated_text"] == "Bonjour"

def test_evaluate_endpoint():
    response = client.get("/api/v1/system/evaluate")
    assert response.status_code == 200
    assert response.json()["evaluation_score"] == 100
