import logging
from typing import Any, Dict, List, Optional
from app.services.ai_cluster import IntelligenceCache
from app.repositories.ai_repository import AIRepository
from app.core.config import settings

class IntelligenceService:
    """
    Service: Electoral Intelligence Management.
    Handles business logic for data generation, caching, and multi-lingual support.
    """
    def __init__(self, repository: AIRepository, cache: IntelligenceCache):
        """
        Initializes the service with a repository and cache.

        Args:
            repository (AIRepository): The data access layer for AI.
            cache (IntelligenceCache): The performance optimization layer.
        """
        self.repository = repository
        self.cache = cache

    async def get_live_intelligence(self) -> Dict[str, Any]:
        """
        Retrieves real-time election intelligence with fallback support.

        Returns:
            Dict[str, Any]: A report containing upcoming elections and results.
        """
        cached = self.cache.get("live_intel")
        if isinstance(cached, dict):
            return cached

        prompt = (
            "Generate a high-fidelity JSON report for May 2026 Indian elections. "
            "Include 'upcoming_elections' (list of {title, date, type}), "
            "'upcoming_results' (list), and 'past_results' (list). "
            "Focus on accuracy and official formatting."
        )
        
        try:
            data = await self.repository.fetch_json_data(prompt, temperature=0.2)
            self.cache.set("live_intel", data)
            return data
        except Exception as e:
            logging.error(f"Intelligence Generation Failure: {str(e)}")
            return self._get_live_intelligence_fallback()

    async def get_constituency_pulse(self, pincode: str) -> Dict[str, Any]:
        """
        Maps a pincode to electoral data with format validation.

        Args:
            pincode (str): The 6-digit Indian Pincode.

        Returns:
            Dict[str, Any]: Electoral representatives and booth data.

        Raises:
            ValueError: If the pincode format is invalid.
        """
        if not pincode.isdigit() or len(pincode) != 6:
            raise ValueError("Invalid Indian Pincode format. Must be 6 numeric digits.")

        prompt = (
            f"Generate a detailed JSON report for Indian Pincode {pincode}. "
            "Fields: name, state, mp, mla, district, booths (int), turnout (string), status (Active/Upcoming)."
        )
        
        try:
            return await self.repository.fetch_json_data(prompt, temperature=0.1)
        except Exception as e:
            logging.error(f"Constituency Pulse Failure for {pincode}: {str(e)}")
            return self._get_constituency_fallback(pincode)

    async def translate_content(self, text: str, target_lang: str) -> str:
        """
        Translates electoral education content via AI repository.

        Args:
            text (str): The source text.
            target_lang (str): Target ISO language code.

        Returns:
            str: Translated text or original if failure occurs.
        """
        prompt = f"Translate the following electoral text to {target_lang}: {text}. Maintain formal and educational tone."
        try:
            return await self.repository.fetch_text_data(prompt, temperature=0.1)
        except Exception as e:
            logging.error(f"Translation Failure: {str(e)}")
            return f"[Service Temporarily Unavailable] {text}"

    async def chat_with_assistant(self, message: str) -> str:
        """
        Handles conversational AI for electoral education.

        Args:
            message (str): User query.

        Returns:
            str: AI-generated response.
        """
        system_context = (
            "You are Electra, a specialized AI Electoral Assistant. "
            "Provide accurate, non-partisan information about Indian elections."
        )
        prompt = f"{system_context}\nUser Query: {message}"
        
        try:
            return await self.repository.fetch_text_data(prompt, temperature=0.7)
        except Exception as e:
            logging.error(f"Chat Assistant Failure: {str(e)}")
            return "I am currently recalibrating my intelligence nodes. Please retry shortly."

    def _get_live_intelligence_fallback(self) -> Dict[str, Any]:
        """Internal helper for high-fidelity fallback data."""
        return {
            "upcoming_elections": [
                {"title": "West Bengal Assembly", "date": "May 2026", "type": "Assembly"},
                {"title": "Tamil Nadu Assembly", "date": "May 2026", "type": "Assembly"}
            ],
            "upcoming_results": [],
            "past_results": [
                {"title": "General Elections 2024", "summary": "NDA Alliance formed the government."}
            ]
        }

    async def get_nearby_booths(self, pincode: str) -> List[Dict[str, Any]]:
        """
        Retrieves a list of nearby polling booths for a given pincode.

        Args:
            pincode (str): The 6-digit Indian Pincode.

        Returns:
            List[Dict[str, Any]]: List of booth locations and metadata.
        """
        # Mock booth data for simulation
        return [
            {"id": 1, "name": "Government Primary School", "distance": "0.4 km", "status": "Active"},
            {"id": 2, "name": "Community Center Hall", "distance": "1.2 km", "status": "Active"},
            {"id": 3, "name": "Public Library Wing A", "distance": "2.1 km", "status": "Backup"}
        ]

    def _get_constituency_fallback(self, pincode: str) -> Dict[str, Any]:

        """Internal helper for pincode data fallback."""
        return {
            "name": f"Electoral District {pincode[:3]}",
            "state": "Verified State",
            "mp": "Constituency Representative",
            "mla": "Local Representative",
            "district": "Administrative Region",
            "booths": 150,
            "turnout": "N/A",
            "status": "Active"
        }
