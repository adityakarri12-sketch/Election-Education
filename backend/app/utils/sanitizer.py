"""
Sanitization utilities for protecting AI pipelines.
Prevents prompt injection and cross-site scripting (XSS) in AI inputs.
"""

import re
from typing import List


class PromptSanitizer:
    """
    Sanitizes user input before it is processed by AI models.
    """

    # Patterns to detect and remove common injection/attack vectors
    FORBIDDEN_PATTERNS: List[str] = [
        r"<script.*?>.*?</script>",  # SCRIPT tags
        r"javascript:",              # javascript: pseudo-protocol
        r"onload=",                  # Event handlers
        r"onerror=",
        r"OR 1=1",                   # Basic SQL injection
        r"DROP TABLE",               # Destructive SQL
        r"system\s*\(",              # OS command injection patterns
        r"import\s+os",               # Python code injection
    ]

    @classmethod
    def sanitize(cls, text: str, max_length: int = 1000) -> str:
        """
        Main sanitization entry point.

        Args:
            text (str): The raw input text.
            max_length (int): Maximum allowed length for the prompt.

        Returns:
            str: The cleaned and truncated text.
        """
        if not text:
            return ""

        # 1. Truncate to prevent payload-based resource exhaustion
        sanitized = text[:max_length]

        # 2. Remove HTML/Script tags and forbidden patterns
        for pattern in cls.FORBIDDEN_PATTERNS:
            sanitized = re.sub(pattern, "", sanitized, flags=re.IGNORECASE | re.DOTALL)

        # 3. Strip leading/trailing whitespace and normalize internal whitespace
        sanitized = " ".join(sanitized.split())

        return sanitized
