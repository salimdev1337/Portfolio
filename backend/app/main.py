"""
FastAPI application entry point.
Initializes the app, middleware, and routes.
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.middleware.base import RequestResponseEndpoint
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.routes import contact, health, webhook_health, chat
from app.services.rag import RAGService
from app.services.chatbot import ChatbotService, Session
from app.utils.logger import setup_logging
from app.utils.exceptions import WebhookError
from app.middleware.rate_limit import limiter

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager."""
    # Startup
    logger.info(
        "Starting Portfolio Contact API",
        extra={
            "version": settings.api_version,
            "environment": settings.environment,
            "debug": settings.debug,
        },
    )

    # Initialize RAG service (loads embedding model + builds ChromaDB index)
    # This runs once at startup and takes ~3-8 seconds on first boot.
    # Wrapped in try/except so a Gemini API failure (missing key, quota, network)
    # does NOT crash the server — chatbot degrades gracefully to no-context mode.
    rag_service = RAGService()
    try:
        await rag_service.initialize()
    except Exception as exc:
        logger.error(
            "RAG service initialization failed — chatbot will run without context: %s", exc
        )

    # In-memory session store — dict keyed by session_id
    # Shared across all requests via app.state
    sessions: dict[str, Session] = {}

    # Initialize chatbot service with the RAG service and shared session store
    app.state.rag_service = rag_service
    app.state.sessions = sessions
    app.state.chatbot_service = ChatbotService(rag_service, sessions)

    yield

    # Shutdown
    logger.info(
        "Shutting down Portfolio Contact API",
        extra={"active_sessions": len(app.state.sessions)},
    )


# Initialize FastAPI app
app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    description=settings.api_description,
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
    lifespan=lifespan,
)


# Add rate limiter state to app
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)  # type: ignore


# Security headers middleware — must be registered BEFORE CORSMiddleware so that
# CORS is the outermost layer and adds its headers even on error responses.
@app.middleware("http")
async def security_headers_middleware(
    request: Request, call_next: RequestResponseEndpoint
) -> Response:
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    if settings.is_production:
        response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains"
    return response


# CORS Middleware — added last so it wraps everything and is always outermost.
# This ensures Access-Control-Allow-Origin is present even on error responses.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
    max_age=settings.cors_max_age,
)


# Exception Handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors with detailed messages."""
    errors = []
    for error in exc.errors():
        errors.append(
            {
                "field": " -> ".join(str(loc) for loc in error["loc"]),
                "message": error["msg"],
                "type": error["type"],
            }
        )

    logger.warning("Validation error", extra={"errors": errors, "path": request.url.path})

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Validation error. Please check your input.",
            "error_code": "VALIDATION_ERROR",
            "details": {"errors": errors},
        },
    )


@app.exception_handler(WebhookError)
async def webhook_exception_handler(request: Request, exc: WebhookError):
    """Handle webhook-specific errors."""
    logger.error("Webhook error", extra={"error": str(exc), "path": request.url.path})

    return JSONResponse(
        status_code=503,
        content={
            "success": False,
            "message": "Unable to process your request. Please try again later.",
            "error_code": "WEBHOOK_ERROR",
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected errors.

    NOTE: This handler is registered on ServerErrorMiddleware which sits *outside*
    CORSMiddleware, so we must inject the CORS header manually — otherwise the
    browser sees a CORS error instead of the real 500.
    """
    logger.exception("Unexpected error", extra={"error": str(exc), "path": request.url.path})

    headers = {}
    origin = request.headers.get("origin")
    if origin and origin in settings.allowed_origins_list:
        headers["Access-Control-Allow-Origin"] = origin

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "An unexpected error occurred. Please try again later.",
            "error_code": "INTERNAL_ERROR",
        },
        headers=headers,
    )


# Include routers
app.include_router(health.router, prefix="", tags=["Health"])
app.include_router(contact.router, prefix="/api", tags=["Contact"])
app.include_router(webhook_health.router, prefix="/api", tags=["Webhook"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint - redirect to docs in dev, return basic info in prod."""
    return {
        "name": settings.api_title,
        "version": settings.api_version,
        "status": "operational",
        "docs": "/docs" if settings.is_development else "Contact the administrator",
    }
