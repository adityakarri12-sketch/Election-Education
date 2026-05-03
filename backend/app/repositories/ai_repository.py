"""
Repository for direct AI cluster interactions.
Encapsulates GenAI API calls and JSON parsing.
"""

import json
from typing import Any, Dict

from google.genai import types

from app.services.ai_cluster import GenAICluster


class AIRepository:
    """
    Repository for High-Fidelity AI Data Retrieval.

    Handles communication with the generative AI cluster and
    standardizes the extraction of structured and unstructured data.
    """

    def __init__(self, ai_cluster: GenAICluster) -> None:
        """
        Initializes the AI repository with a cluster instance.

        Args:
            ai_cluster (GenAICluster): The underlying AI cluster for generation.
        """
        self.ai_cluster = ai_cluster

    async def fetch_json_data(
        self, prompt: str, temperature: float = 0.1
    ) -> Dict[str, Any]:
        """
        Fetches and parses JSON data from the AI cluster.

        Args:
            prompt (str): The prompt to send to the AI.
            temperature (float, optional): Generation temperature. Defaults to 0.1.

        Returns:
            Dict[str, Any]: Parsed JSON response.
        """
        res = await self.ai_cluster.generate(
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=temperature, response_mime_type="application/json"
            ),
        )
        data: Dict[str, Any] = json.loads(res)
        return data

    async def fetch_text_data(self, prompt: str, temperature: float = 0.1) -> str:
        """
        Fetches raw text data from the AI cluster.

        Args:
            prompt (str): The prompt to send to the AI.
            temperature (float, optional): Generation temperature. Defaults to 0.1.

        Returns:
            str: Raw text response.
        """
        response: str = await self.ai_cluster.generate(
            contents=prompt,
            config=types.GenerateContentConfig(temperature=temperature),
        )
        return response
