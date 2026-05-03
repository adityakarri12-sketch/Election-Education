import httpx

try:
    print("Sending request to backend (Pincode 533001)...")
    res = httpx.get("http://localhost:8000/api/constituency/533001", timeout=60.0)
    print(f"Status: {res.status_code}")
    print(f"Body: {res.text}")
except Exception as e:
    print(f"Error: {e}")
