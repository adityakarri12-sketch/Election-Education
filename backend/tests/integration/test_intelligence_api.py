import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/system/health")
    assert response.status_code == 200
    assert response.json()["status"] == "operational"

def test_get_constituency_invalid_pincode():
    response = client.get("/api/v1/intelligence/constituency/123")
    assert response.status_code == 400
    assert "Invalid Indian Pincode" in response.json()["detail"]

def test_chatbot_endpoint_validation():
    # Test missing field
    response = client.post("/api/v1/intelligence/chatbot", json={})
    assert response.status_code == 422
