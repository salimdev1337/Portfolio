"""
Custom exception classes.
"""


class WebhookError(Exception):
    """Raised when n8n webhook request fails."""

    pass


class ValidationError(Exception):
    """Raised when input validation fails."""

    pass


class RateLimitError(Exception):
    """Raised when rate limit is exceeded."""

    pass
