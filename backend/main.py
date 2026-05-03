"""
ElectraLearn: High-Fidelity Electoral Intelligence Platform.
Entry point for the FastAPI application featuring modular architecture,
strict security hardening, and structured JSON logging.
"""

import os
import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import setup_logging
from app.core.security import SecurityHardeningMiddleware, RateLimitMiddleware
from app.routers import intelligence, system, simulation


# Global Initialization
setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Manages the application lifecycle, including startup and shutdown events.
    """
    logging.info(f"Platform {settings.PROJECT_NAME} v2.1.0 is INITIALIZING.")
    yield
    logging.info(f"Platform {settings.PROJECT_NAME} is SHUTTING DOWN.")

def create_application() -> FastAPI:
    """
    Factory function to initialize the FastAPI application with 
    hardened middleware, modular routers, and production configurations.

    Returns:
        FastAPI: The configured application instance.
    """
    application = FastAPI(
        title=settings.PROJECT_NAME,
        version="2.1.0",
        description="Modular electoral intelligence core with high-fidelity AI clusters.",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        lifespan=lifespan
    )

    # Security & Hardening Layer
    application.add_middleware(SecurityHardeningMiddleware)
    application.add_middleware(RateLimitMiddleware, max_requests=100)
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_HOSTS,
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
            logging.info(f"Mounting static files from: {path}")
            application.mount("/", StaticFiles(directory=path, html=True), name="static")
            break

    # Security: Global Exception Handler for Information Leak Prevention
    @application.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception) -> Response:
        """Intercepts all unhandled exceptions to prevent system metadata leaks."""
        logging.error(f"UNHANDLED_EXCEPTION: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "detail": "An internal integrity error occurred. Nodes are recalibrating.",
                "type": "SecurityHardenedError"
            }
        )

    return application

app = create_application()
