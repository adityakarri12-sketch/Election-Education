from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import time

class SecurityHardeningMiddleware(BaseHTTPMiddleware):
    """
    Middleware: Production Security Hardening.
    Implements CSP, HSTS, XSS protection, and frame options.
    """
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Hardening Headers
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' https://accounts.google.com https://www.gstatic.com; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data: https:; "
            "frame-src https://accounts.google.com;"
        )
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        
        return response

class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Middleware: Adaptive Rate Limiting.
    Prevents brute-force and DDoS on intelligence endpoints.
    """
    def __init__(self, app, max_requests: int = 60, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window = window_seconds
        self.counts = {}

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        now = time.time()
        
        # Simple window-based cleanup
        if client_ip in self.counts:
            requests, last_reset = self.counts[client_ip]
            if now - last_reset > self.window:
                self.counts[client_ip] = (1, now)
            else:
                if requests >= self.max_requests:
                    return JSONResponse(
                        status_code=429,
                        content={"detail": "Too many requests. Recalibrating cluster access."}
                    )
                self.counts[client_ip] = (requests + 1, last_reset)
        else:
            self.counts[client_ip] = (1, now)
            
        return await call_next(request)
