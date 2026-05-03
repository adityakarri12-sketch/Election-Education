"""
Security hardening and rate limiting middleware for ElectraLearn.
"""

import logging
import time
from typing import Any, Callable, Dict, Tuple

from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware


class SecurityHardeningMiddleware(BaseHTTPMiddleware):
    """
    Production Security Hardening Middleware.
    Enforces strict security headers and body size limits.
    """

    MAX_BODY_SIZE = 1024 * 1024  # 1MB limit for security

    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Any]
    ) -> Response:
        """
        Intercepts requests to inject security-centric response headers.
        """
        # 1. Content Length Check (Payload Protection)
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > self.MAX_BODY_SIZE:
            return JSONResponse(
                status_code=413,
                content={"status": "error", "error": "Request entity too large."},
            )

        response: Response = await call_next(request)

        # 2. Hardening Headers (Defense-in-Depth)
        response.headers["Content-Security-Policy"] = (
            "default-src 'self' http://localhost:3000 http://localhost:8000; "
            "script-src 'self' 'unsafe-inline' https://apis.google.com; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: blob:; "
            "frame-ancestors 'none';"
        )
        response.headers["Strict-Transport-Security"] = (
            "max-age=63072000; includeSubDomains; preload"
        )
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "no-referrer"
        response.headers["Permissions-Policy"] = "geolocation=(), camera=(), microphone=()"

        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Adaptive Rate Limiting Middleware.
    Implements IP-based throttling and protection against burst traffic.
    """

    def __init__(self, app: Any, max_requests: int = 60, window_seconds: int = 60):
        """
        Initializes the rate limiter with strict defaults.
        """
        super().__init__(app)
        self.max_requests = max_requests
        self.window = window_seconds
        self.counts: Dict[str, Tuple[int, float]] = {}

    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Any]
    ) -> Response:
        """
        Validates request rate against the defined threshold.
        """
        if request.url.path == "/api/v1/system/health" or request.method == "OPTIONS":
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        now = time.time()

        if client_ip in self.counts:
            requests, last_reset = self.counts[client_ip]
            if now - last_reset > self.window:
                self.counts[client_ip] = (1, now)
            else:
                if requests >= self.max_requests:
                    logging.warning("Rate limit triggered for IP: %s", client_ip)
                    return JSONResponse(
                        status_code=429,
                        content={
                            "status": "error",
                            "error": "Too many requests. Throttling active.",
                        },
                    )
                self.counts[client_ip] = (requests + 1, last_reset)
        else:
            self.counts[client_ip] = (1, now)

        return await call_next(request)
