import os

from dotenv import load_dotenv
from google import genai

load_dotenv()
load_dotenv(dotenv_path="../.env")

API_KEYS_RAW = (
    os.getenv("GEMINI_API_KEYS")
    or os.getenv("GEMINI_API_KEY")
    or os.getenv("VITE_GEMINI_API_KEY")
)
API_KEYS = (
    [k.strip() for k in API_KEYS_RAW.split(",") if k.strip()] if API_KEYS_RAW else []
)

print(f"Testing {len(API_KEYS)} keys...")

for i, k in enumerate(API_KEYS):
    print(f"\n--- Testing Key {i} ({k[:10]}...) ---")
    try:
        client = genai.Client(api_key=k)
        response = client.models.generate_content(
            model="gemini-1.5-flash", contents="Hello"
        )
        print(f"Success: {response.text[:50]}...")
    except Exception as e:
        print(f"FAILED: {e}")
