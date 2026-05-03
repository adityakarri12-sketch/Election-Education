import httpx

try:
    res = httpx.get("http://localhost:8000/api/intelligence/live", timeout=15.0)
    print(f"Status: {res.status_code}")
    print(f"Body snippet: {res.text[:200]}")
except Exception as e:
    print(f"Error: {e}")
