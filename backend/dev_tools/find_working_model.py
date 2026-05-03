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

print("Searching for a working model...")
client = genai.Client(api_key=API_KEYS[0])

for model in client.models.list():
    # Check if 'generateContent' is in the supported actions
    # The SDK usually uses 'generate_content' but the action name is 'generateContent'
    if "generateContent" in model.supported_actions:
        print(f"\nModel: {model.name}")
        try:
            res = client.models.generate_content(model=model.name, contents="test")
            print(f"SUCCESS with {model.name}!")
            # Exit after first success
            exit(0)
        except Exception as e:
            print(f"FAILED with {model.name}: {e}")
