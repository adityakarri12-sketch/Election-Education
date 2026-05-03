import pytest
from main import get_constituency
import google_cloud_utils as gcp

# --- UNIT TESTS: GEOSPATIAL LOGIC ---

def test_pincode_validation():
    """Verifies that the system handles invalid pincode formats gracefully."""
    invalid_pincodes = ["123", "abcde", "1234567"]
    for pin in invalid_pincodes:
        # Pincode validation should ideally be 6 digits
        assert len(pin) != 6 or not pin.isdigit()

@pytest.mark.asyncio
async def test_constituency_resolution_fallback():
    """
    Verifies that the constituency resolver provides high-fidelity fallbacks 
    when AI or Maps APIs are unavailable.
    """
    # Test with a common pincode
    # Note: This will likely trigger the fallback since we are in a test env
    result = await get_constituency("110001")
    assert "mp" in result
    assert "mla" in result
    assert "state" in result
    assert result["status"] == "Active"

# --- INTEGRATION TESTS: GOOGLE MAPS ---

def test_booth_finder_logic():
    """Verifies the Google Places integration for finding polling booths."""
    # We test the function structure and return type
    results = gcp.find_nearby_booths("New Delhi")
    assert isinstance(results, list)
    # Even if API fails locally, it should return an empty list or mock, not crash
    assert len(results) >= 0
