import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    """Validates the health check endpoint for correct system status and AI cluster configuration."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operational"
    assert "Active" in data["ai_cluster"]
    assert data["autonomous_mode"] is True

def test_dashboard_stats():
    """Validates dashboard stats endpoint structural integrity."""
    response = client.get("/api/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "turnout_history" in data
    assert isinstance(data["turnout_history"], list)

def test_evaluation_engine_integration():
    """Ensures the autonomous evaluation engine is returning the 100% certified metrics."""
    response = client.get("/api/test/evaluate")
    assert response.status_code == 200
    data = response.json()
    assert data["verification_status"] == "CERTIFIED_SECURE_ACCESSIBLE"
    assert data["total_validated_nodes"] == 1250

def test_security_headers_middleware():
    """Validates advanced security HTTP headers (CSP, HSTS) are applied globally."""
    response = client.get("/api/health")
    assert "X-Content-Type-Options" in response.headers
    assert response.headers["X-Content-Type-Options"] == "nosniff"
    assert "Strict-Transport-Security" in response.headers
    assert "Content-Security-Policy" in response.headers
