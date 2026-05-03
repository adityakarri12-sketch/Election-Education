import pytest
from unittest.mock import MagicMock, AsyncMock
from fastapi.responses import JSONResponse
from app.core.security import RateLimitMiddleware
import time

@pytest.mark.asyncio
async def test_rate_limiting_logic_directly():
    from fastapi import FastAPI
    
    mock_app = FastAPI()
    middleware = RateLimitMiddleware(mock_app, max_requests=2, window_seconds=1)
    
    class MockRequest:
        def __init__(self, host):
            self.client = MagicMock()
            self.client.host = host
            self.url = MagicMock()
            self.url.path = "/test"
    
    async def call_next(request):
        return JSONResponse(content={"status": "ok"})
    
    # Request 1
    req1 = MockRequest("1.1.1.1")
    res1 = await middleware.dispatch(req1, call_next)
    assert res1.status_code == 200
    
    # Request 2
    res2 = await middleware.dispatch(req1, call_next)
    assert res2.status_code == 200
    
    # Request 3 - Should fail
    res3 = await middleware.dispatch(req1, call_next)
    assert res3.status_code == 429
    
    # Wait for window to reset
    time.sleep(1.1)
    res4 = await middleware.dispatch(req1, call_next)
    assert res4.status_code == 200

