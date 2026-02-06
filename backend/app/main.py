"""
FastAPI application entry point.
Initializes the app, middleware, and routes.
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.config import settings
from app.routes import contact, health
from app.utils.logger import setup_logging
from app.utils.exceptions import WebhookError


# Setup logging
setup_logging()
logger = logging.getLogger(__name__)


# Rate limiter instance
limiter = Limiter(
    key_func=get_remote_address,
    storage_uri=settings.rate_limit_storage_url,
    default_limits=[f"{settings.rate_limit_per_hour}/hour"]
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager."""
    # Startup
    logger.info(
        "Starting Portfolio Contact API",
        extra={
            "version": settings.api_version,
            "environment": settings.environment,
            "debug": settings.debug
        }
    )

    yield

    # Shutdown
    logger.info("Shutting down Portfolio Contact API")


# Initialize FastAPI app
app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    description=settings.api_description,
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
    lifespan=lifespan
)


# Add rate limiter state to app
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler) # type: ignore


# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
    max_age=settings.cors_max_age
)


# Exception Handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors with detailed messages."""
    errors = []
    for error in exc.errors():
        errors.append({
            "field": " -> ".join(str(loc) for loc in error["loc"]),
            "message": error["msg"],
            "type": error["type"]
        })

    logger.warning(
        "Validation error",
        extra={"errors": errors, "path": request.url.path}
    )

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Validation error. Please check your input.",
            "error_code": "VALIDATION_ERROR",
            "details": {"errors": errors}
        }
    )


@app.exception_handler(WebhookError)
async def webhook_exception_handler(request: Request, exc: WebhookError):
    """Handle webhook-specific errors."""
    logger.error(
        "Webhook error",
        extra={"error": str(exc), "path": request.url.path}
    )

    return JSONResponse(
        status_code=503,
        content={
            "success": False,
            "message": "Unable to process your request. Please try again later.",
            "error_code": "WEBHOOK_ERROR"
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected errors."""
    logger.exception(
        "Unexpected error",
        extra={"error": str(exc), "path": request.url.path}
    )

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "An unexpected error occurred. Please try again later.",
            "error_code": "INTERNAL_ERROR"
        }
    )


# Include routers
app.include_router(health.router, prefix="", tags=["Health"])
app.include_router(contact.router, prefix="/api", tags=["Contact"])


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint - redirect to docs in dev, return basic info in prod."""
    return {
        "name": settings.api_title,
        "version": settings.api_version,
        "status": "operational",
        "docs": "/docs" if settings.is_development else "Contact the administrator"
    }
