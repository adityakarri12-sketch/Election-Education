import os

from dotenv import load_dotenv
from google import genai

load_dotenv()
load_dotenv(dotenv_path="../.env")

raw_keys = os.getenv("GEMINI_API_KEY") or os.getenv("VITE_GEMINI_API_KEY") or ""
API_KEY = [k.strip() for k in raw_keys.split(",") if k.strip()][0] if raw_keys else ""
client = genai.Client(api_key=API_KEY)

try:
    print("Available Models:")
    for model in client.models.list():
        print(f"- {model.name}")
except Exception as e:
    print(f"Error: {e}")
