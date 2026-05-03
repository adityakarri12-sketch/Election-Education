"""
Unit tests for structured logging.
"""

import logging
import json
from app.core.logging import JSONFormatter, setup_logging


def test_json_formatter() -> None:
    """Tests that the JSON formatter produces valid JSON with expected keys."""
    formatter = JSONFormatter()
    record = logging.LogRecord(
        name="test", level=logging.INFO, pathname="test.py", lineno=1,
        msg="test message", args=(), exc_info=None
    )
    formatted = formatter.format(record)
    data = json.loads(formatted)
    
    assert data["message"] == "test message"
    assert data["level"] == "INFO"
    assert "timestamp" in data


def test_setup_logging() -> None:
    """Tests that logging setup runs without error."""
    setup_logging()
    logger = logging.getLogger()
    assert len(logger.handlers) > 0
    assert isinstance(logger.handlers[0].formatter, JSONFormatter)
