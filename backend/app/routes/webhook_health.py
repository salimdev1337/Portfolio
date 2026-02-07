"""
Webhook health check endpoint for monitoring n8n connectivity.
"""
import logging
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import httpx
from datetime import datetime, timezone

from app.config import settings
from app.utils.security import generate_webhook_signature, generate_request_id

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/webhook/health", response_model=Dict[str, Any])
async def check_webhook_health():
    """
    Check n8n webhook connectivity and health.

    This endpoint sends a test ping to the configured n8n webhook
    to verify it's accessible and responding correctly.

    Returns:
        Dict with health status, response time, and details

    Example Response:
        {
            "healthy": true,
            "webhook_url": "https://n8n.example.com/webhook/...",
            "response_time_ms": 234,
            "status_code": 200,
            "timestamp": "2026-02-06T12:00:00Z",
            "details": {
                "signature_enabled": true,
                "retry_attempts": 3
            }
        }
    """
    start_time = datetime.now(timezone.utc)

    # Create test payload
    test_payload = {
        "request_id": generate_request_id(),
        "timestamp": start_time.isoformat(),
        "test": True,
        "message": "Health check ping from portfolio backend"
    }

    # Add signature if configured
    headers = {"Content-Type": "application/json"}
    if settings.n8n_webhook_secret:
        signature = generate_webhook_signature(test_payload, settings.n8n_webhook_secret)
        headers["X-Webhook-Signature"] = signature

    try:
        async with httpx.AsyncClient(timeout=settings.n8n_timeout) as client:
            response = await client.post(
                str(settings.n8n_webhook_url),
                json=test_payload,
                headers=headers
            )

            end_time = datetime.now(timezone.utc)
            response_time_ms = int((end_time - start_time).total_seconds() * 1000)

            # Check if response is successful
            is_healthy = 200 <= response.status_code < 300

            return {
                "healthy": is_healthy,
                "webhook_url": str(settings.n8n_webhook_url).replace(
                    settings.n8n_webhook_url.path or "",
                    "/webhook/***"  # Mask path for security
                ),
                "response_time_ms": response_time_ms,
                "status_code": response.status_code,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "details": {
                    "signature_enabled": bool(settings.n8n_webhook_secret),
                    "timeout_seconds": settings.n8n_timeout,
                    "environment": settings.environment
                }
            }

    except httpx.TimeoutException as e:
        logger.error(f"Webhook health check timeout: {e}")
        return {
            "healthy": False,
            "webhook_url": "***",
            "response_time_ms": settings.n8n_timeout * 1000,
            "status_code": 0,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "error": "Timeout connecting to webhook",
            "details": {
                "signature_enabled": bool(settings.n8n_webhook_secret),
                "timeout_seconds": settings.n8n_timeout,
                "environment": settings.environment
            }
        }

    except httpx.RequestError as e:
        logger.error(f"Webhook health check failed: {e}")
        return {
            "healthy": False,
            "webhook_url": "***",
            "response_time_ms": 0,
            "status_code": 0,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "error": f"Connection failed: {str(e)}",
            "details": {
                "signature_enabled": bool(settings.n8n_webhook_secret),
                "timeout_seconds": settings.n8n_timeout,
                "environment": settings.environment
            }
        }

    except Exception as e:
        logger.exception("Unexpected error in webhook health check")
        raise HTTPException(
            status_code=500,
            detail=f"Health check failed: {str(e)}"
        )


@router.get("/webhook/config", response_model=Dict[str, Any])
async def get_webhook_config():
    """
    Get webhook configuration details (non-sensitive).

    Returns public webhook configuration for debugging and monitoring.

    Returns:
        Dict with configuration details

    Example Response:
        {
            "webhook_configured": true,
            "signature_enabled": true,
            "timeout_seconds": 10,
            "environment": "production"
        }
    """
    return {
        "webhook_configured": bool(settings.n8n_webhook_url),
        "signature_enabled": bool(settings.n8n_webhook_secret),
        "timeout_seconds": settings.n8n_timeout,
        "rate_limit_per_hour": settings.rate_limit_per_hour,
        "environment": settings.environment,
        "api_version": settings.api_version
    }
