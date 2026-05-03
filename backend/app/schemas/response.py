"""
Standardized API response schemas for ElectraLearn.
Ensures consistent interface across all endpoints.
"""

from typing import Any, Dict, Generic, Optional, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """
    Global standard for API responses.
    """

    status: str = "success"
    data: Optional[T] = None
    error: Optional[str] = None


def create_response(data: Any = None, error: Optional[str] = None) -> Dict[str, Any]:
    """
    Helper function to create a standardized response dictionary.

    Args:
        data: The payload to include in the response.
        error: An error message if the request failed.

    Returns:
        Dict[str, Any]: Standardized response dictionary.
    """
    return {"status": "success" if not error else "error", "data": data, "error": error}
