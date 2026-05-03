import pytest
from fastapi.testclient import TestClient
from main import app
from unittest.mock import patch, MagicMock

client = TestClient(app)

def test_translate_endpoint():
    """Validates the translation endpoint with a mock GCP client."""
    with patch("google_cloud_utils.translate_client.translate") as mock_translate:
        mock_translate.return_value = {"translatedText": "नमस्ते"}
        response = client.post("/api/translate", json={
            "text": "Hello",
            "target_language": "hi"
        })
        assert response.status_code == 200
        assert response.json()["translated_text"] == "नमस्ते"

def test_save_progress_endpoint():
    """Validates Firestore persistence integration."""
    with patch("google_cloud_utils.db.collection") as mock_db:
        mock_doc = MagicMock()
        mock_db.return_value.document.return_value = mock_doc
        
        response = client.post("/api/save-progress", json={
            "user_id": "user123",
            "score_data": {"quiz_score": 95}
        })
        assert response.status_code == 200
        assert response.json()["status"] == "saved"
        assert response.json()["database"] == "Google Cloud Firestore"

def test_leaderboard_endpoint():
    """Validates leaderboard retrieval from Firestore."""
    with patch("google_cloud_utils.db.collection") as mock_db:
        mock_query = MagicMock()
        mock_db.return_value.order_by.return_value.limit.return_value.stream.return_value = [
            MagicMock(to_dict=lambda: {"user_id": "u1", "score": 100})
        ]
        
        response = client.get("/api/leaderboard?limit=5")
        assert response.status_code == 200
        assert len(response.json()) > 0
        assert response.json()[0]["user_id"] == "u1"

def test_vision_id_verification():
    """Validates Vision API integration for ID extraction."""
    with patch("google_cloud_utils.vision_client.text_detection") as mock_vision:
        mock_annotation = MagicMock()
        mock_annotation.description = "VOTER ID CARD: ADITYA KARRI"
        mock_response = MagicMock()
        mock_response.text_annotations = [mock_annotation]
        mock_vision.return_value = mock_response
        
        # Create a mock image file
        files = {"file": ("test.jpg", b"fake-image-data", "image/jpeg")}
        response = client.post("/api/verify-id", files=files)
        
        assert response.status_code == 200
        assert response.json()["status"] == "Verified"
        assert "ADITYA" in response.json()["extracted_data"]

def test_tasks_scheduling():
    """Validates Cloud Tasks integration for voter alerts."""
    with patch("google_cloud_utils.tasks_client.create_task") as mock_tasks:
        mock_task_response = MagicMock()
        mock_task_response.name = "projects/p/locations/l/queues/q/tasks/t"
        mock_tasks.return_value = mock_task_response
        
        response = client.post("/api/schedule-alert", json={
            "user_id": "user123",
            "message": "Time to vote!",
            "schedule_time": "2026-05-10T10:00:00"
        })
        assert response.status_code == 200
        assert response.json()["status"] == "scheduled"
        assert "tasks/t" in response.json()["task_id"]
