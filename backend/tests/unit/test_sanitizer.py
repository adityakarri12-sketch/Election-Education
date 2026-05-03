"""
Unit tests for PromptSanitizer.
Verifies the detection and removal of malicious patterns.
"""

import pytest
from app.utils.sanitizer import PromptSanitizer


def test_basic_sanitization() -> None:
    """
    Ensures leading/trailing whitespace is removed and internal whitespace normalized.
    """
    input_text = "   Hello   World   "
    assert PromptSanitizer.sanitize(input_text) == "Hello World"


def test_script_tag_removal() -> None:
    """
    Ensures <script> tags are removed.
    """
    input_text = "Hello <script>alert('XSS')</script> World"
    assert PromptSanitizer.sanitize(input_text) == "Hello World"


def test_sql_injection_patterns() -> None:
    """
    Ensures basic SQL injection patterns are removed.
    """
    input_text = "Select * from users OR 1=1"
    # Note: Regex is case insensitive
    assert "OR 1=1" not in PromptSanitizer.sanitize(input_text)


def test_max_length_truncation() -> None:
    """
    Ensures input is truncated to the specified maximum length.
    """
    input_text = "a" * 2000
    assert len(PromptSanitizer.sanitize(input_text, max_length=100)) == 100


def test_empty_input() -> None:
    """
    Ensures empty input returns an empty string.
    """
    assert PromptSanitizer.sanitize("") == ""
    assert PromptSanitizer.sanitize(None) == ""
