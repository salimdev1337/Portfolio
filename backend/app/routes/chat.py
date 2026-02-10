"""
Chat endpoint with SSE (Server-Sent Events) streaming.

POST /api/chat
  - Accepts a user message + optional session_id
  - Sanitizes input (reuses existing InputValidator)
  - Rate limits per IP (slowapi)
  - Streams the Gemini response back word-by-word via SSE

SSE format:
  Each chunk is sent as:
    data: {"text": "chunk of text"}\n\n

  When the stream ends:
    data: {"done": true, "session_id": "...", "message_count": N}\n\n

  On error:
    data: {"error": "message"}\n\n

The frontend reads these events via fetch() with a ReadableStream
(or the EventSource API for GET — we use POST so fetch is required).
"""

import json
import logging
from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import StreamingResponse
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.models import ChatRequest
from app.services.validation import InputValidator
from app.services.chatbot import ChatbotService
from app.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()

# Rate limiter — same pattern as contact.py
limiter = Limiter(key_func=get_remote_address)


def get_chatbot(request: Request) -> ChatbotService:
    """Dependency: pull the ChatbotService from app.state (set at startup)."""
    return request.app.state.chatbot_service


@router.post(
    "/chat",
    responses={
        200: {"description": "SSE stream of chat response chunks"},
        400: {"description": "Invalid or dangerous input"},
        429: {"description": "Rate limit exceeded"},
        503: {"description": "Chatbot service unavailable"},
    },
    summary="Chat with Salim Bot",
    description=f"""
    Send a message to Salim Bot and receive a streamed response.

    ## Security Features
    - Rate limiting ({settings.chat_rate_limit_per_minute} requests/minute per IP)
    - XSS and injection prevention (bleach + pattern matching)
    - Session message limit ({settings.chat_session_limit} messages per session)
    - Input length cap ({settings.chat_max_message_length} characters)

    ## Streaming
    Response is streamed as Server-Sent Events (text/event-stream).
    Read chunks via fetch() with ReadableStream on the frontend.
    """,
)
async def chat(
    request: Request,
    body: ChatRequest,
    chatbot: ChatbotService = Depends(get_chatbot),
) -> StreamingResponse:
    """
    Handle an incoming chat message and stream the response.

    Args:
        request: FastAPI request (needed for rate limiter + IP logging)
        body:    Validated ChatRequest (message + optional session_id)
        chatbot: ChatbotService from app.state

    Returns:
        StreamingResponse with media_type="text/event-stream"
    """
    ip = get_remote_address(request)

    # --- Security: validate and sanitize the message ---
    # 1. Check for script tags / XSS patterns BEFORE sanitizing
    if not InputValidator.validate_no_script_tags(body.message):
        logger.warning("XSS attempt in chat message", extra={"ip": ip})
        raise HTTPException(status_code=400, detail="Invalid input detected")

    if not InputValidator.validate_no_sql_injection(body.message):
        logger.warning("Injection attempt in chat message", extra={"ip": ip})
        raise HTTPException(status_code=400, detail="Invalid input detected")

    # 2. Strip any residual HTML
    clean_message = InputValidator.sanitize_html(body.message)

    if not clean_message:
        raise HTTPException(status_code=400, detail="Message cannot be empty after sanitization")

    # --- Session: get or create ---
    session = chatbot.get_or_create_session(body.session_id)

    logger.info(
        "Chat message received",
        extra={
            "ip": ip,
            "session_id": session.session_id,
            "message_count": session.message_count,
            "message_preview": clean_message[:50],
        },
    )

    # --- SSE generator ---
    async def event_stream():
        """
        Async generator that yields SSE-formatted strings.

        SSE spec requires each event to end with two newlines (\n\n).
        We send JSON payloads so the frontend can parse them easily.
        """
        try:
            async for chunk in chatbot.stream_response(clean_message, session):
                # Send each text chunk as it arrives from Gemini
                data = json.dumps({"text": chunk})
                yield f"data: {data}\n\n"

            # Send the final "done" event with session metadata
            done_data = json.dumps({
                "done": True,
                "session_id": session.session_id,
                "message_count": session.message_count,
                "is_limit_reached": session.message_count >= settings.chat_session_limit,
            })
            yield f"data: {done_data}\n\n"

        except Exception as e:
            logger.exception(f"Error in SSE stream for session {session.session_id}: {e}")
            error_data = json.dumps({"error": "Stream error. Please try again."})
            yield f"data: {error_data}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            # Disable buffering — critical for streaming to work through proxies
            "X-Accel-Buffering": "no",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )


# Apply rate limiting — same pattern as contact.py
chat = limiter.limit(f"{settings.chat_rate_limit_per_minute}/minute")(chat)
