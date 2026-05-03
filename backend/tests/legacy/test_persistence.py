import pytest
import google_cloud_utils as gcp

# --- UNIT TESTS: DATA PERSISTENCE ---

def test_firestore_leaderboard_fallback():
    """
    Verifies that the Firestore module provides professional mock data 
    for demo environments when the live database is empty.
    """
    results = gcp.get_leaderboard(limit=5)
    assert len(results) > 0
    assert "score" in results[0]
    assert "role" in results[0]

def test_score_persistence_interface():
    """Verifies the schema for saving user scores to Firestore."""
    user_id = "test_user_99"
    score_data = {"score": 100, "accuracy": 95, "role": "Expert"}
    
    # We check if the save function handles the input without crashing
    # (Mocked or real check)
    try:
        success = gcp.save_user_score(user_id, score_data)
        assert isinstance(success, bool)
    except Exception:
        pytest.fail("Score persistence interface crashed.")

# --- UNIT TESTS: CLOUD STORAGE ---

def test_gcs_upload_interface():
    """Verifies the interface for uploading assets to Google Cloud Storage."""
    # Test the function signature and error handling
    url = gcp.upload_to_gcs("mock-bucket", "non-existent.file", "test.file")
    assert url is None # Should return None for non-existent local file
