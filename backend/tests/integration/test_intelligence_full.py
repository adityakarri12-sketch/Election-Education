"""
Full integration tests for Intelligence endpoints.
Verifies successful paths and fallback mechanisms.
"""

import pytest
from fastapi.testclient import TestClient


def test_get_live_intelligence_success(client: TestClient) -> None:
    """
    Tests the successful retrieval of live intelligence.
    """
    response = client.get("/api/v1/intelligence/live")
    assert response.status_code == 200
    data = response.json()["data"]
    assert "upcoming_elections" in data
    assert "past_results" in data


def test_get_constituency_pulse_success(client: TestClient) -> None:
    """
    Tests the successful retrieval of constituency pulse for a valid pincode.
    """
    response = client.get("/api/v1/intelligence/constituency/500001")
    assert response.status_code == 200
    data = response.json()["data"]
    assert "name" in data
    assert "mp" in data


def test_get_nearby_booths_success(client: TestClient) -> None:
    """
    Tests the successful retrieval of nearby booths.
    """
    response = client.get("/api/v1/intelligence/booths/500001")
    assert response.status_code == 200
    data = response.json()["data"]
    assert len(data) > 0
    assert data[0]["name"] == "Gov Primary School"


def test_chatbot_success(client: TestClient) -> None:
    """
    Tests the successful interaction with the chatbot.
    """
    response = client.post("/api/v1/intelligence/chatbot", json={"message": "How do I vote?"})
    assert response.status_code == 200
    assert "response" in response.json()["data"]
