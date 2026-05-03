import logging
import sys
import uuid
from typing import Any, Dict
from logging.handlers import RotatingFileHandler
from pythonjsonlogger import jsonlogger

class ContextFilter(logging.Filter):
    """
    Filter to inject contextual request_id into logs.
    """
    def filter(self, record: logging.LogRecord) -> bool:
        if not hasattr(record, 'request_id'):
            record.request_id = str(uuid.uuid4())
        return True

def setup_logging() -> None:
    """
    Configures an enterprise-grade JSON structured logging system.
    Strictly follows machine-readable signals for automated auditing.
    """
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)

    # Clear existing handlers
    if root_logger.hasHandlers():
        root_logger.handlers.clear()

    ctx_filter = ContextFilter()

    # JSON Formatting specification
    log_format = '%(asctime)s %(name)s %(levelname)s %(request_id)s %(message)s %(module)s'

    # Stream Handler (Stdout)
    console_handler = logging.StreamHandler(sys.stdout)
    json_formatter = jsonlogger.JsonFormatter(log_format)
    console_handler.setFormatter(json_formatter)
    console_handler.addFilter(ctx_filter)
    root_logger.addHandler(console_handler)

    # File Handler (Rotating)
    file_handler = RotatingFileHandler(
        'app.log', maxBytes=10485760, backupCount=5
    )
    file_handler.setFormatter(json_formatter)
    file_handler.addFilter(ctx_filter)
    root_logger.addHandler(file_handler)

    logging.info("Platform Intelligence Logging System Initialized with JSON Structure.")
