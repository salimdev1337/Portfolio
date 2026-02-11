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

    On Render (and most reverse proxies), the real client IP is available via
    request.client.host after the ASGI server unwraps the proxy connection.
    We avoid reading X-Forwarded-For directly because a malicious client can
    prepend arbitrary IPs to that header before the proxy appends the real one.
    Falling back to the last X-Forwarded-For entry is safer than the first.
    """
    # request.client.host is set by Uvicorn from the actual TCP connection;
    # on Render this reflects the real client IP after proxy unwrapping.
    if request.client and request.client.host:
        ip = request.client.host
    else:
        # Fallback: take the LAST entry in X-Forwarded-For (proxy-appended, not client-controlled)
        forwarded = request.headers.get("X-Forwarded-For", "")
        if forwarded:
            ip = forwarded.split(",")[-1].strip()
        else:
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


# ---------------------------------------------------------------------------
# Shared singleton — imported by main.py and all route modules so every route
# shares the same storage backend and counter state.
# The local import avoids a circular dependency at module load time.
# ---------------------------------------------------------------------------
def _build_shared_limiter() -> Limiter:
    from app.config import settings  # noqa: PLC0415 — intentional deferred import
    return create_limiter(settings.rate_limit_storage_url)


limiter: Limiter = _build_shared_limiter()
