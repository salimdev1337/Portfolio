"""
n8n webhook client for forwarding contact form submissions.
"""

import logging
from typing import Dict, Any, Optional
import httpx
from pydantic import HttpUrl
from datetime import datetime, timezone

from app.utils.exceptions import WebhookError
from app.utils.security import generate_webhook_signature
from app.config import settings

logger = logging.getLogger(__name__)


class WebhookClient:
    """Client for sending data to n8n webhooks."""

    def __init__(self, webhook_url: HttpUrl, timeout: int = 10, max_retries: int = 3):
        """
        Initialize webhook client.

        Args:
            webhook_url: n8n webhook URL
            timeout: Request timeout in seconds
            max_retries: Maximum number of retry attempts
        """
        self.webhook_url = str(webhook_url)
        self.timeout = timeout
        self.max_retries = max_retries

        # Create async HTTP client
        self.client = httpx.AsyncClient(
            timeout=timeout, headers={"Content-Type": "application/json"}
        )

    async def send_contact_form(self, data: Dict[str, Any], request_id: str) -> Dict[str, Any]:
        """
        Send contact form data to n8n webhook.

        Args:
            data: Sanitized contact form data
            request_id: Unique request identifier

        Returns:
            Webhook response data

        Raises:
            WebhookError: If webhook request fails
        """
        payload = {
            "request_id": request_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "form_data": {
                "name": data.get("name"),
                "email": data.get("email"),
                "subject": data.get("subject"),
                "message": data.get("message"),
                "rating": data.get("rating", 0),
            },
            "metadata": {"source": "portfolio_contact_form", "version": settings.api_version},
        }

        # Generate webhook signature if secret is configured
        headers = {}
        if settings.n8n_webhook_secret:
            signature = generate_webhook_signature(payload, settings.n8n_webhook_secret)
            headers["X-Webhook-Signature"] = signature
            logger.debug(
                "Generated webhook signature",
                extra={"request_id": request_id, "signature": signature[:8] + "..."},
            )

        logger.info(
            "Sending contact form to n8n webhook",
            extra={"request_id": request_id, "webhook_url": self.webhook_url},
        )

        for attempt in range(1, self.max_retries + 1):
            try:
                response = await self.client.post(self.webhook_url, json=payload, headers=headers)

                # Check response status
                response.raise_for_status()

                logger.info(
                    "Webhook request successful",
                    extra={
                        "request_id": request_id,
                        "status_code": response.status_code,
                        "attempt": attempt,
                    },
                )

                return response.json() if response.text else {"success": True}

            except httpx.HTTPStatusError as e:
                logger.error(
                    "Webhook HTTP error",
                    extra={
                        "request_id": request_id,
                        "status_code": e.response.status_code,
                        "attempt": attempt,
                        "error": str(e),
                    },
                )

                if attempt == self.max_retries:
                    raise WebhookError(
                        f"Webhook request failed after {self.max_retries} attempts"
                    ) from e

            except httpx.RequestError as e:
                logger.error(
                    "Webhook network error",
                    extra={"request_id": request_id, "attempt": attempt, "error": str(e)},
                )

                if attempt == self.max_retries:
                    raise WebhookError(
                        f"Webhook network error after {self.max_retries} attempts"
                    ) from e

            except Exception as e:
                logger.exception(
                    "Unexpected webhook error", extra={"request_id": request_id, "attempt": attempt}
                )

                if attempt == self.max_retries:
                    raise WebhookError("Unexpected error sending webhook") from e

        # Should never reach here
        raise WebhookError("Webhook request failed")

    async def close(self):
        """Close HTTP client connection."""
        await self.client.aclose()


# Singleton instance
_webhook_client: Optional[WebhookClient] = None


def get_webhook_client() -> WebhookClient:
    """
    Get or create webhook client singleton.

    Returns:
        WebhookClient instance
    """
    global _webhook_client

    if _webhook_client is None:
        _webhook_client = WebhookClient(
            webhook_url=settings.n8n_webhook_url, timeout=settings.n8n_timeout
        )

    return _webhook_client
