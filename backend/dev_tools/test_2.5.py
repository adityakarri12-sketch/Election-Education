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

test_models = ["gemini-2.5-flash", "gemini-flash-latest"]

for k_idx, k in enumerate(API_KEYS):
    print(f"\n--- KEY {k_idx} ---")
    client = genai.Client(api_key=k)
    for m in test_models:
        try:
            res = client.models.generate_content(model=m, contents="hi")
            print(f"KEY {k_idx} SUCCESS with {m}: {res.text[:20]}...")
        except Exception as e:
            print(f"KEY {k_idx} FAILED with {m}: {str(e)[:100]}")
