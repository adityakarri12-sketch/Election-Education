import os

from dotenv import load_dotenv

load_dotenv()
load_dotenv(dotenv_path="../.env")

API_KEYS_RAW = (
    os.getenv("GEMINI_API_KEYS")
    or os.getenv("GEMINI_API_KEY")
    or os.getenv("VITE_GEMINI_API_KEY")
)
print(f"RAW: {API_KEYS_RAW}")
API_KEYS = (
    [k.strip() for k in API_KEYS_RAW.split(",") if k.strip()] if API_KEYS_RAW else []
)
print(f"KEYS FOUND: {len(API_KEYS)}")
for i, k in enumerate(API_KEYS):
    print(f"Key {i}: {k[:10]}...")
