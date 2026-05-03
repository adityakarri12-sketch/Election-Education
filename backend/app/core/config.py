import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    """
    Centralized platform configuration using Pydantic Settings.
    Ensures type-safe environment variable management.
    """
    PROJECT_NAME: str = "ElectraLearn Intelligence"
    PROJECT_ID: str = "refreshing-gear-495005-s0"
    API_V1_STR: str = "/api/v1"
    
    # AI Cluster Configuration
    GEMINI_API_KEYS: str = os.getenv("VITE_GEMINI_API_KEY", "")
    
    @property
    def api_keys_list(self) -> List[str]:
        return [k.strip() for k in self.GEMINI_API_KEYS.split(",") if k.strip()]

    # Security Configuration
    ALLOWED_HOSTS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "https://election-platform-396628837152.us-central1.run.app", "*"]
    SECRET_KEY: str = os.getenv("SECRET_KEY", "platform_integrity_secret_2026")
    
    # Cache Configuration
    CACHE_TTL: int = 600

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"

settings = Settings()
