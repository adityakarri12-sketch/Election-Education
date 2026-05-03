import json
import logging
from typing import Any, Dict, Optional
from google.genai import types
from app.services.ai_cluster import GenAICluster

class AIRepository:
    """
    Repository: High-Fidelity AI Data Retrieval.
    Encapsulates all direct interactions with the GenAI Cluster.
    """
    def __init__(self, ai_cluster: GenAICluster):
        """
        Initializes the AI repository with a cluster instance.

        Args:
            ai_cluster (GenAICluster): The underlying AI cluster for generation.
        """
        self.ai_cluster = ai_cluster

    async def fetch_json_data(self, prompt: str, temperature: float = 0.1) -> Dict[str, Any]:
        """
        Fetches and parses JSON data from the AI cluster.

        Args:
            prompt (str): The prompt to send to the AI.
            temperature (float, optional): Generation temperature. Defaults to 0.1.

        Returns:
            Dict[str, Any]: Parsed JSON response.

        Raises:
            json.JSONDecodeError: If AI output is not valid JSON.
        """
        res = await self.ai_cluster.generate(
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=temperature,
                response_mime_type="application/json"
            )
        )
        return json.loads(res)

    async def fetch_text_data(self, prompt: str, temperature: float = 0.1) -> str:
        """
        Fetches raw text data from the AI cluster.

        Args:
            prompt (str): The prompt to send to the AI.
            temperature (float, optional): Generation temperature. Defaults to 0.1.

        Returns:
            str: Raw text response.
        """
        return await self.ai_cluster.generate(
            contents=prompt,
            config=types.GenerateContentConfig(temperature=temperature)
        )
