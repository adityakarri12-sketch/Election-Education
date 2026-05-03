import logging
import os
from datetime import datetime
from typing import Dict, List, Optional

from google import genai
from google.genai import types

# Professional Logging Configuration
logger = logging.getLogger("ElectraLearn.AIEngine")


class GenAICluster:
    def __init__(self, keys: List[str]):
        self.keys: List[str] = keys
        self.current_index: int = 0
        self.clients = [genai.Client(api_key=k) for k in self.keys]

    def get_client(self) -> Optional[genai.Client]:
        if not self.clients:
            return None
        return self.clients[self.current_index]

    def rotate(self) -> bool:
        if len(self.clients) > 1:
            self.current_index = (self.current_index + 1) % len(self.clients)
            logger.info(f"AIEngine: Rotating to key index {self.current_index}")
            return True
        return False

    async def generate(self, contents, model="gemini-2.0-flash", config=None):
        """Generates content with automatic 429 failover and key rotation."""
        max_retries = len(self.clients)
        last_error = None

        for attempt in range(max_retries):
            client = self.get_client()
            if not client:
                raise Exception("No Gemini API clients available.")

            try:
                # Use the asynchronous client
                response = await client.aio.models.generate_content(
                    model=model, contents=contents, config=config
                )
                if response and response.text:
                    return response.text
                raise Exception("Empty response from Gemini")

            except Exception as e:
                last_error = e
                error_str = str(e).lower()

                # Check for rate limits or quota issues
                if "429" in error_str or "quota" in error_str or "limit" in error_str:
                    logger.warning(
                        f"Engine Index {self.current_index} Quota Exceeded. Rotating and retrying..."
                    )
                    self.rotate()
                    continue

                # If it's a model error or other transient issue, rotate and try again anyway
                logger.error(
                    f"Engine Index {self.current_index} encountered error: {e}. Failover triggered."
                )
                self.rotate()

        raise last_error or Exception("GenAI Cluster Exhausted.")


class IntelligenceCache:
    """
    High-performance in-memory cache system with Time-To-Live (TTL) support.
    Reduces API costs and prevents quota exhaustion by serving verified snapshots.
    """

    def __init__(self, ttl_seconds: int = 600):
        self._store: Dict[str, Dict] = {}
        self.ttl: int = ttl_seconds

    def get(self, key: str) -> Optional[Dict]:
        """Retrieves data if it hasn't expired."""
        if key in self._store:
            entry = self._store[key]
            if datetime.now().timestamp() < entry["expiry"]:
                return entry["data"]
            else:
                logger.debug(f"Cache: Entry '{key}' expired.")
        return None

    def set(self, key: str, data: Dict):
        """Stores data with a calculated expiry timestamp."""
        self._store[key] = {
            "data": data,
            "expiry": datetime.now().timestamp() + self.ttl,
        }
        logger.debug(f"Cache: Entry '{key}' stored.")

    def clear(self):
        """Purges the cache."""
        self._store.clear()
