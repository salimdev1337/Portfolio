"""
Contact form endpoint with full security.
"""

import logging
import uuid
from fastapi import APIRouter, Request, HTTPException, Depends
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.models import ContactRequest, ContactResponse, ErrorResponse
from app.services.validation import InputValidator
from app.services.webhook import WebhookClient
from app.config import settings
from app.utils.exceptions import WebhookError

logger = logging.getLogger(__name__)
router = APIRouter()


# Get limiter from app state
def get_limiter(request: Request) -> Limiter:
    """Dependency to get limiter from app state."""
    return request.app.state.limiter


@router.post(
    "/contact",
    response_model=ContactResponse,
    responses={
        200: {"description": "Contact form submitted successfully"},
        422: {"model": ErrorResponse, "description": "Validation error"},
        429: {"description": "Rate limit exceeded"},
        503: {"model": ErrorResponse, "description": "Webhook service unavailable"},
    },
    summary="Submit Contact Form",
    description=f"""
    Submit a contact form with rate limiting ({settings.rate_limit_per_hour} requests/hour per IP).

    ## Security Features
    - Rate limiting (prevents spam)
    - Input validation (Pydantic models)
    - XSS prevention (HTML sanitization)
    - SQL injection protection (pattern matching)
    - CORS protection (allowed origins only)

    ## Process Flow
    1. Validate request data (Pydantic)
    2. Sanitize inputs (remove HTML, dangerous content)
    3. Check rate limit
    4. Forward to n8n webhook
    5. Return success response
    """,
)
async def submit_contact_form(
    request: Request, contact: ContactRequest, limiter: Limiter = Depends(get_limiter)
) -> ContactResponse:
    """
    Handle contact form submission.

    Args:
        request: FastAPI request object
        contact: Validated contact form data
        limiter: Rate limiter instance

    Returns:
        ContactResponse with success status

    Raises:
        HTTPException: If validation fails or webhook errors
    """
    # Generate unique request ID for tracking
    request_id = f"req_{uuid.uuid4().hex[:12]}"

    logger.info(
        "Contact form submission received",
        extra={
            "request_id": request_id,
            "ip": get_remote_address(request),
            "sender_name": contact.name,
            "message_subject": contact.subject,
        },
    )

    try:
        # Additional sanitization (defense in depth)
        sanitized_data = InputValidator.sanitize_contact_form(contact.model_dump())

        # Validate email domain (block disposable emails)
        if not InputValidator.validate_email_domain(contact.email):
            logger.warning(
                "Disposable email rejected",
                extra={"request_id": request_id, "email": contact.email},
            )
            raise HTTPException(status_code=400, detail="Please use a permanent email address")

        # Forward to n8n webhook
        webhook_client = WebhookClient(settings.n8n_webhook_url)
        webhook_response = await webhook_client.send_contact_form(
            data=sanitized_data, request_id=request_id
        )

        logger.info(
            "Contact form forwarded to n8n successfully",
            extra={"request_id": request_id, "webhook_response": webhook_response},
        )

        return ContactResponse(
            success=True,
            message="Thank you for your message! I'll get back to you soon.",
            request_id=request_id,
        )

    except WebhookError as e:
        logger.error("Webhook error", extra={"request_id": request_id, "error": str(e)})
        raise

    except ValueError as e:
        logger.warning("Validation error", extra={"request_id": request_id, "error": str(e)})
        raise HTTPException(status_code=400, detail=str(e))

    except Exception:
        logger.exception(
            "Unexpected error processing contact form", extra={"request_id": request_id}
        )
        raise HTTPException(
            status_code=500, detail="An unexpected error occurred. Please try again later."
        )


# Apply rate limiting to the endpoint
limiter = Limiter(key_func=get_remote_address)
submit_contact_form = limiter.limit(f"{settings.rate_limit_per_hour}/hour")(submit_contact_form)
