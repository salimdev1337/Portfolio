"""
Pydantic models for request/response validation.
Provides automatic validation, serialization, and API documentation.
"""

from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator
import re


class ContactRequest(BaseModel):
    """Contact form submission request model."""

    name: str = Field(
        ..., min_length=2, max_length=50, description="Sender's full name", examples=["John Doe"]
    )

    email: EmailStr = Field(
        ..., description="Valid email address", examples=["john.doe@example.com"]
    )

    subject: str = Field(
        ...,
        min_length=3,
        max_length=100,
        description="Message subject line",
        examples=["Interested in your services"],
    )

    message: str = Field(
        ...,
        min_length=10,
        max_length=1000,
        description="Message content",
        examples=["I would like to discuss a project..."],
    )

    rating: int = Field(
        default=0, ge=0, le=5, description="Portfolio rating (0-5 stars)", examples=[5]
    )

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        """Validate name: letters (Unicode), spaces, hyphens, apostrophes only."""
        # Allow Unicode letters, spaces, hyphens, and apostrophes
        # \w includes Unicode letters and digits, so we exclude digits explicitly
        if not re.match(r"^[\w\s\-']+$", v, re.UNICODE) or re.search(r"\d", v):
            raise ValueError("Name must contain only letters, spaces, hyphens, and apostrophes")
        return v.strip()

    @field_validator("subject", "message")
    @classmethod
    def sanitize_text(cls, v: str) -> str:
        """Trim whitespace and remove excessive newlines."""
        # Replace multiple whitespaces with single space
        v = re.sub(r"\s+", " ", v)
        # Trim
        return v.strip()

    class Config:
        """Pydantic model configuration."""

        json_schema_extra = {
            "example": {
                "name": "Jane Smith",
                "email": "jane.smith@example.com",
                "subject": "Project Inquiry",
                "message": "I'm interested in discussing a web development project...",
                "rating": 5,
            }
        }


class ContactResponse(BaseModel):
    """Contact form submission response model."""

    success: bool = Field(..., description="Whether submission was successful")

    message: str = Field(..., description="Human-readable status message")

    request_id: Optional[str] = Field(None, description="Unique request identifier for tracking")

    class Config:
        """Pydantic model configuration."""

        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Thank you for your message! I'll get back to you soon.",
                "request_id": "req_abc123xyz",
            }
        }


class HealthResponse(BaseModel):
    """Health check response model."""

    status: str = Field(..., description="Service health status", examples=["healthy"])

    version: str = Field(..., description="API version", examples=["1.0.0"])

    environment: str = Field(..., description="Deployment environment", examples=["production"])

    n8n_configured: bool = Field(..., description="Whether n8n webhook is configured")


class ChatMessage(BaseModel):
    """A single message in the conversation history."""

    role: str = Field(..., description="Either 'user' or 'assistant'")
    content: str = Field(..., description="The message text")


class ChatRequest(BaseModel):
    """Incoming chat message from the user."""

    message: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="The user's message",
        examples=["What is your preferred tech stack?"],
    )
    session_id: Optional[str] = Field(
        None,
        description="Session ID from a previous message. Omit on first message.",
        examples=["sess_abc123xyz"],
    )

    class Config:
        json_schema_extra = {
            "example": {
                "message": "What projects have you built?",
                "session_id": None,
            }
        }


class ChatResponse(BaseModel):
    """Response sent back after processing a chat message (non-streaming metadata)."""

    session_id: str = Field(..., description="Session ID to include in the next request")
    message_count: int = Field(..., description="Total messages sent in this session so far")
    is_limit_reached: bool = Field(..., description="True when the session limit has been hit")


class ErrorResponse(BaseModel):
    """Error response model."""

    success: bool = Field(False, description="Always false for errors")

    message: str = Field(..., description="Error message")

    error_code: Optional[str] = Field(None, description="Machine-readable error code")

    details: Optional[dict] = Field(None, description="Additional error details")
