"""
Dependency injection providers for ElectraLearn.
Centralizes the instantiation of services and repositories.
"""

from fastapi import Depends

from app.core.config import settings
from app.repositories.ai_repository import AIRepository
from app.services.ai_cluster import GenAICluster, IntelligenceCache
from app.services.intelligence_service import IntelligenceService
from app.services.system_service import SystemService


def get_ai_cluster() -> GenAICluster:
    """Provides a singleton instance of the GenAI cluster."""
    # GenAICluster expects a list of keys
    return GenAICluster(settings.GEMINI_API_KEYS)


def get_cache() -> IntelligenceCache:
    """Provides a singleton instance of the intelligence cache."""
    return IntelligenceCache(ttl_seconds=3600)


def get_intelligence_service(
    cluster: GenAICluster = Depends(get_ai_cluster),
    cache: IntelligenceCache = Depends(get_cache),
) -> IntelligenceService:
    """Injects and provides the IntelligenceService."""
    repo = AIRepository(cluster)
    return IntelligenceService(repo, cache)


def get_system_service() -> SystemService:
    """Provides the SystemService instance."""
    return SystemService()
