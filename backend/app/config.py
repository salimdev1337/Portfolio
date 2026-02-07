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
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    # API Configuration
    api_title: str = "Portfolio Contact API"
    api_version: str = "1.0.0"
    api_description: str = "Secure contact form API with rate limiting"

    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = Field(False, validation_alias="DEBUG")
    environment: str = Field("production", validation_alias="ENVIRONMENT")

    # Security
    secret_key: str = Field(..., validation_alias="SECRET_KEY", min_length=32)
    allowed_origins: str = Field(
        default="http://localhost:5173,http://localhost:3000,https://*.github.io",
        validation_alias="ALLOWED_ORIGINS"
    )

    # Rate Limiting
    rate_limit_per_hour: int = Field(3, validation_alias="RATE_LIMIT_PER_HOUR", ge=1, le=100)
    rate_limit_storage_url: str = "memory://"  # Use Redis in production

    # n8n Webhook
    n8n_webhook_url: HttpUrl = Field(..., validation_alias="N8N_WEBHOOK_URL")
    n8n_timeout: int = Field(10, ge=1, le=30)  # seconds
    n8n_webhook_secret: str = Field("", validation_alias="N8N_WEBHOOK_SECRET")  # Optional signing secret

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
