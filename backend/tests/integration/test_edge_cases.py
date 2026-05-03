"""
Edge case and negative testing for ElectraLearn.
Verifies system resilience against malformed inputs and service failures.
"""

import pytest
from fastapi.testclient import TestClient


def test_invalid_pincode_format(client: TestClient) -> None:
    """
    Tests handling of invalid pincode formats.
    """
    # Too short
    response = client.get("/api/v1/intelligence/constituency/123")
    assert response.status_code == 400

    # Non-numeric
    response = client.get("/api/v1/intelligence/constituency/ABCDEF")
    assert response.status_code == 400


def test_empty_chat_message(client: TestClient) -> None:
    """
    Tests handling of empty or whitespace-only chat messages.
    """
    response = client.post("/api/v1/intelligence/chatbot", json={"message": ""})
    assert response.status_code == 422


def test_injection_attempt_sanitization(client: TestClient) -> None:
    """
    Verifies that injection attempts are handled gracefully.
    """
    injection_message = "<script>alert('XSS')</script> Tell me about elections."
    response = client.post("/api/v1/intelligence/chatbot", json={"message": injection_message})
    
    assert response.status_code == 200
    assert response.json()["status"] == "success"


def test_malformed_json_payload(client: TestClient) -> None:
    """
    Tests handling of malformed JSON.
    """
    response = client.post(
        "/api/v1/intelligence/chatbot", 
        content="{invalid: json}",
        headers={"Content-Type": "application/json"}
    )
    assert response.status_code == 422
