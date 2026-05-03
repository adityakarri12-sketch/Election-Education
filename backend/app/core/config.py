"""
Centralized configuration management for the ElectraLearn backend.
Handles environment variables and global constants.
"""

import os
from typing import List

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Application settings using Pydantic for validation.
    """

    PROJECT_NAME: str = "ElectraLearn"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "DEVELOPMENT_SECRET_KEY_REPLACE_IN_PROD")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    # External APIs
    GEMINI_API_KEY_RAW: str = os.getenv("GEMINI_API_KEY") or os.getenv("VITE_GEMINI_API_KEY") or ""
    GOOGLE_MAPS_API_KEY: str = os.getenv("GOOGLE_MAPS_API_KEY", "")

    @property
    def GEMINI_API_KEYS(self) -> List[str]:
        """Returns a list of parsed API keys for the cluster."""
        if not self.GEMINI_API_KEY_RAW:
            return []
        return [k.strip() for k in self.GEMINI_API_KEY_RAW.split(",") if k.strip()]

    @property
    def GEMINI_API_KEY(self) -> str:
        """Returns the primary API key."""
        keys = self.GEMINI_API_KEYS
        return keys[0] if keys else ""

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

    class Config:
        case_sensitive = True


settings = Settings()
