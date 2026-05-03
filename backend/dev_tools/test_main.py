import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to ElectraLearn API"}


def test_get_dashboard_stats():
    response = client.get("/api/dashboard/stats")
    assert response.status_code == 200
    assert "summary" in response.json()
    assert "turnout_history" in response.json()


def test_get_live_intelligence():
    # This might fail if Gemini API is not working, but we can check if it returns 200 (even with fallback)
    response = client.get("/api/intelligence/live")
    assert response.status_code == 200
    data = response.json()
    assert "upcoming_elections" in data
    assert "upcoming_results" in data
    assert "past_results" in data


@pytest.mark.parametrize("pincode", ["533003", "110001"])
def test_get_constituency_data(pincode):
    response = client.get(f"/api/constituency/{pincode}")
    assert response.status_code == 200
    data = response.json()
    assert "mp" in data
    assert "mla" in data
    assert "district" in data
