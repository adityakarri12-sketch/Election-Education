"""
Integration tests for System and Simulation endpoints.
"""

import pytest
from fastapi.testclient import TestClient


def test_system_health(client: TestClient) -> None:
    """Tests the health check endpoint."""
    response = client.get("/api/v1/system/health")
    assert response.status_code == 200
    assert response.json()["data"]["status"] == "operational"


def test_system_evaluate(client: TestClient) -> None:
    """Tests the evaluation metrics endpoint."""
    response = client.get("/api/v1/system/evaluate")
    assert response.status_code == 200
    assert response.json()["data"]["evaluation_score"] == 100


def test_simulation_save_progress(client: TestClient) -> None:
    """Tests saving simulation progress."""
    response = client.post("/api/v1/simulation/save-progress", json={"score": 100})
    assert response.status_code == 200
    assert "message" in response.json()["data"]


def test_simulation_leaderboard(client: TestClient) -> None:
    """Tests retrieving the leaderboard."""
    response = client.get("/api/v1/simulation/leaderboard")
    assert response.status_code == 200
    assert len(response.json()["data"]) > 0
    assert response.json()["data"][0]["name"] == "Aditya Karri"


def test_simulation_verify_id(client: TestClient) -> None:
    """Tests the ID verification simulation."""
    response = client.post("/api/v1/simulation/verify-id")
    assert response.status_code == 200
    assert response.json()["data"]["status"] == "Verified"
