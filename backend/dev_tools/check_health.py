import httpx

try:
    res = httpx.get("http://localhost:8000/api/health", timeout=5.0)
    print(f"Status: {res.status_code}")
    print(f"Body: {res.text}")
except Exception as e:
    print(f"Error: {e}")
