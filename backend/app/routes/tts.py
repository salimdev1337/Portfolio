"""
TTS endpoint — proxies text to ElevenLabs and streams the audio back.

POST /api/tts
  Body: { "text": str, "voice_id": str (optional) }

Returns:
  StreamingResponse with media_type="audio/mpeg"

Requires ELEVENLABS_API_KEY env var. Returns 503 if not set.
"""

import logging
from fastapi import APIRouter, Request, Response
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
import httpx

from app.config import settings
from app.middleware.rate_limit import limiter

logger = logging.getLogger(__name__)
router = APIRouter()

ELEVENLABS_TTS_URL = "https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
MAX_TTS_CHARS = 800  # Trim to save free-tier credits


class TTSRequest(BaseModel):
    text: str
    voice_id: str = ""


@router.post(
    "/tts",
    response_model=None,
    responses={
        200: {"description": "Audio/mpeg stream of the synthesized speech"},
        400: {"description": "Text is empty"},
        429: {"description": "Rate limit exceeded"},
        503: {"description": "TTS service unavailable (no API key configured)"},
    },
    summary="Text-to-speech via ElevenLabs",
)
@limiter.limit(f"{settings.chat_rate_limit_per_minute}/minute")
async def text_to_speech(
    request: Request,
    response: Response,
    body: TTSRequest,
):
    """
    Proxy text to ElevenLabs TTS and stream the audio back to the client.

    Silently degrades to 503 when ELEVENLABS_API_KEY is not configured so that
    the frontend can skip audio without interrupting the chat experience.
    """
    if not settings.elevenlabs_api_key:
        return JSONResponse(
            status_code=503,
            content={"error": "TTS service not configured"},
        )

    text = body.text.strip()
    if not text:
        return JSONResponse(status_code=400, content={"error": "Text is required"})

    # Trim to save free-tier credits — worst case bot messages are ~1600 chars
    text = text[:MAX_TTS_CHARS]

    voice_id = body.voice_id.strip() or settings.elevenlabs_voice_id
    url = ELEVENLABS_TTS_URL.format(voice_id=voice_id)

    async def audio_stream():
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                async with client.stream(
                    "POST",
                    url,
                    headers={
                        "xi-api-key": settings.elevenlabs_api_key,
                        "Content-Type": "application/json",
                        "Accept": "audio/mpeg",
                    },
                    json={
                        "text": text,
                        "model_id": "eleven_monolingual_v1",
                    },
                ) as el_response:
                    if el_response.status_code != 200:
                        logger.warning(
                            "ElevenLabs returned %s", el_response.status_code
                        )
                        return
                    async for chunk in el_response.aiter_bytes(chunk_size=4096):
                        yield chunk
        except Exception as exc:
            logger.warning("TTS stream error: %s", exc)

    return StreamingResponse(
        audio_stream(),
        media_type="audio/mpeg",
        headers={"Cache-Control": "no-store"},
    )
