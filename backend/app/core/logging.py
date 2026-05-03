"""
Structured JSON logging configuration for ElectraLearn.
Ensures consistency and machine-readability of logs.
"""

import json
import logging
from typing import Any, Dict


class JSONFormatter(logging.Formatter):
    """
    Custom JSON formatter for logging.
    """

    def format(self, record: logging.LogRecord) -> str:
        """
        Formats the log record as a JSON string.
        """
        log_record: Dict[str, Any] = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "module": record.module,
            "message": record.getMessage(),
            "request_id": getattr(record, "request_id", "N/A"),
        }
        if record.exc_info:
            log_record["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_record)


def setup_logging() -> None:
    """
    Initializes the logging system with JSON formatting.
    """
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Avoid duplicate handlers
    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(JSONFormatter())
        logger.addHandler(handler)

    # Standard library loggers adjustment
    logging.getLogger("uvicorn.access").handlers = logger.handlers
    logging.getLogger("uvicorn.error").handlers = logger.handlers
