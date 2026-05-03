"""
Security tests for ElectraLearn.
Verifies the presence and correctness of security headers and rate limiting.
"""

import pytest
from fastapi.testclient import TestClient


def test_security_headers_presence(client: TestClient) -> None:
    """
    Ensures all mandatory security headers are present in responses.
    """
    response = client.get("/api/v1/system/health")
    headers = response.headers

    assert "Content-Security-Policy" in headers
    assert "Strict-Transport-Security" in headers
    assert "X-Content-Type-Options" in headers
    assert "X-Frame-Options" in headers
    assert "X-XSS-Protection" in headers
    assert "Referrer-Policy" in headers
    assert "Permissions-Policy" in headers


def test_security_header_values(client: TestClient) -> None:
    """
    Ensures security headers have the correct hardened values.
    """
    response = client.get("/api/v1/system/health")
    headers = response.headers

    assert headers["X-Frame-Options"] == "DENY"
    assert headers["X-Content-Type-Options"] == "nosniff"
    assert "max-age=63072000" in headers["Strict-Transport-Security"]
    assert "default-src 'self'" in headers["Content-Security-Policy"]


def test_payload_size_limit(client: TestClient) -> None:
    """
    Ensures the application rejects oversized payloads.
    """
    # Create a payload larger than 1MB
    large_payload = "a" * (1024 * 1024 + 100)
    response = client.post(
        "/api/v1/simulation/save-progress", 
        content=large_payload,
        headers={"Content-Type": "application/json"}
    )
    assert response.status_code == 413


def test_rate_limiting_trigger(client: TestClient) -> None:
    """
    Ensures the rate limiter throttles excessive requests.
    """
    # Exceed the limit (default 60 per minute in middleware)
    # We use a loop and check the last response
    response = None
    for _ in range(65):
        response = client.get("/api/v1/intelligence/live")
    
    assert response is not None
    assert response.status_code == 429
    assert response.json()["status"] == "error"
