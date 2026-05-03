"""
ElectraLearn: High-Fidelity Electoral Intelligence Platform.
Entry point for the FastAPI application featuring modular architecture.
"""

import logging
import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.logging import setup_logging
from app.core.security import RateLimitMiddleware, SecurityHardeningMiddleware
from app.routers import intelligence, simulation, system

# Global Initialization
setup_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Manages the application lifecycle.
    """
    logger.info(
        "Platform %s v%s is INITIALIZING.", settings.PROJECT_NAME, settings.VERSION
    )
    yield
    logger.info("Platform %s is SHUTTING DOWN.", settings.PROJECT_NAME)


def create_application() -> FastAPI:
    """
    Factory function to initialize the FastAPI application.

    Returns:
        FastAPI: The configured application instance.
    """
    application = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="Modular electoral intelligence core with AI clusters.",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        lifespan=lifespan,
    )

    # Security & Hardening Layer
    application.add_middleware(SecurityHardeningMiddleware)
    application.add_middleware(RateLimitMiddleware, max_requests=60)
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Router Registration
    application.include_router(intelligence.router, prefix=settings.API_V1_STR)
    application.include_router(system.router, prefix=settings.API_V1_STR)
    application.include_router(simulation.router, prefix=settings.API_V1_STR)

    # Static Content Serving (Production)
    static_paths = ["/app/static", "static", "../frontend/out", "./frontend/out"]
    for path in static_paths:
        if os.path.exists(path):
            logger.info("Mounting static files from: %s", path)
            application.mount(
                "/", StaticFiles(directory=path, html=True), name="static"
            )
            break

    # Standardized Global Exception Handler
    @application.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception) -> Response:
        """Intercepts all unhandled exceptions."""
        logger.error("UNHANDLED_EXCEPTION: %s", str(exc), exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "data": None,
                "error": "Internal integrity error occurred.",
            },
        )

    return application


app = create_application()
