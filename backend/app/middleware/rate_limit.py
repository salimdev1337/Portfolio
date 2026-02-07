"""
Rate limiting configuration and utilities.
Prevents abuse and DoS attacks.
"""

from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request
import logging

logger = logging.getLogger(__name__)


def get_request_identifier(request: Request) -> str:
    """
    Get unique identifier for rate limiting.
    Uses IP address with X-Forwarded-For support for proxies.

    Args:
        request: FastAPI request object

    Returns:
        Unique identifier string
    """
    # Check for forwarded IP (from reverse proxy)
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        # Get first IP in chain (original client)
        ip = forwarded.split(",")[0].strip()
    else:
        # Get direct connection IP
        ip = get_remote_address(request)

    logger.debug(f"Rate limit identifier: {ip}")
    return ip


def create_limiter(storage_uri: str = "memory://") -> Limiter:
    """
    Create rate limiter instance.

    Args:
        storage_uri: Storage backend URI (memory:// or redis://)

    Returns:
        Configured Limiter instance
    """
    return Limiter(
        key_func=get_request_identifier,
        storage_uri=storage_uri,
        headers_enabled=True,  # Send X-RateLimit-* headers
        strategy="fixed-window",  # Fixed time window strategy
    )
