"""
Application configuration management.
Uses pydantic-settings for type-safe environment variables.
"""

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, HttpUrl


class Settings(BaseSettings):
    """Application settings from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=False, extra="ignore"
    )

    # API Configuration
    api_title: str = "Portfolio Contact API"
    api_version: str = "1.0.0"
    api_description: str = "Secure contact form API with rate limiting"

    # Server Configuration
    host: str = "0.0.0.0"  # nosec B104
    port: int = 8000
    debug: bool = Field(False, validation_alias="DEBUG")
    environment: str = Field("production", validation_alias="ENVIRONMENT")

    # Security
    secret_key: str = Field(..., validation_alias="SECRET_KEY", min_length=32)
    allowed_origins: str = Field(
        default="http://localhost:5173,http://localhost:3000",
        validation_alias="ALLOWED_ORIGINS",
    )

    # Rate Limiting
    rate_limit_per_hour: int = Field(3, validation_alias="RATE_LIMIT_PER_HOUR", ge=1, le=100)
    # Set REDIS_URL on Render to persist rate limits across cold-starts (e.g. Upstash rediss://)
    rate_limit_storage_url: str = Field("memory://", validation_alias="REDIS_URL")

    # n8n Webhook
    n8n_webhook_url: HttpUrl = Field(..., validation_alias="N8N_WEBHOOK_URL")
    n8n_timeout: int = Field(10, ge=1, le=30)  # seconds
    n8n_webhook_secret: str = Field(
        "", validation_alias="N8N_WEBHOOK_SECRET"
    )  # Optional signing secret

    # Gemini AI
    gemini_api_key: str = Field(..., validation_alias="GEMINI_API_KEY")

    # Chat / RAG
    chat_session_limit: int = Field(20, validation_alias="CHAT_SESSION_LIMIT", ge=1, le=100)
    chat_rate_limit_per_minute: int = Field(
        10, validation_alias="CHAT_RATE_LIMIT_PER_MINUTE", ge=1, le=60
    )
    chat_max_message_length: int = Field(
        500, validation_alias="CHAT_MAX_MESSAGE_LENGTH", ge=1, le=2000
    )
    chat_context_window: int = Field(5, validation_alias="CHAT_CONTEXT_WINDOW", ge=1, le=20)
    chat_max_sessions: int = Field(1000, validation_alias="CHAT_MAX_SESSIONS", ge=1)
    chat_session_ttl_minutes: int = Field(30, validation_alias="CHAT_SESSION_TTL_MINUTES", ge=1)

    # ElevenLabs TTS
    elevenlabs_api_key: str = Field("", validation_alias="ELEVENLABS_API_KEY")
    elevenlabs_voice_id: str = Field(
        "21m00Tcm4TlvDq8ikWAM",  # "Rachel" — free ElevenLabs voice
        validation_alias="ELEVENLABS_VOICE_ID",
    )

    # Logging
    log_level: str = Field("INFO", validation_alias="LOG_LEVEL")
    log_format: str = "json"  # json or text

    # CORS
    cors_allow_credentials: bool = False
    cors_allow_methods: List[str] = ["GET", "POST", "OPTIONS"]
    cors_allow_headers: List[str] = ["Content-Type", "Authorization"]
    cors_max_age: int = 600  # 10 minutes

    @property
    def allowed_origins_list(self) -> List[str]:
        """Parse allowed origins as a list."""
        if isinstance(self.allowed_origins, str):
            return [origin.strip() for origin in self.allowed_origins.split(",")]
        return self.allowed_origins

    @property
    def is_production(self) -> bool:
        """Check if running in production environment."""
        return self.environment.lower() == "production"

    @property
    def is_development(self) -> bool:
        """Check if running in development environment."""
        return self.environment.lower() == "development"


# Global settings instance
settings = Settings()  # type: ignore
