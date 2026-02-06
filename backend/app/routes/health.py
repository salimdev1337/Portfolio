"""
Health check endpoint for monitoring and load balancers.
"""
import logging
from fastapi import APIRouter
from app.models import HealthResponse
from app.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health Check",
    description="Check if the API is healthy and operational"
)
async def health_check() -> HealthResponse:
    """
    Health check endpoint.
    Used by Render and monitoring tools.

    Returns:
        HealthResponse with service status
    """
    return HealthResponse(
        status="healthy",
        version=settings.api_version,
        environment=settings.environment,
        n8n_configured=bool(settings.n8n_webhook_url)
    )
