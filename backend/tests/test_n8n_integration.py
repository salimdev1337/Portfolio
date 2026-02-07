"""
End-to-end integration tests for n8n webhook workflow.
Tests the complete flow: Contact form → Backend → n8n → Notifications
"""

import asyncio
import pytest
import httpx
from unittest.mock import AsyncMock, patch, MagicMock
from datetime import datetime

from app.config import settings
from app.utils.security import (
    generate_webhook_signature,
    verify_webhook_signature,
)

pytestmark = pytest.mark.asyncio


class TestN8NIntegration:
    """Test n8n webhook integration end-to-end."""

    async def test_complete_contact_form_flow(self, async_client, mock_n8n_webhook):
        """Test complete flow from form submission to n8n webhook."""
        # Submit contact form
        form_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "subject": "Project Inquiry",
            "message": "I'd like to discuss a project opportunity.",
            "rating": 5,
        }

        response = await async_client.post("/api/contact", json=form_data)

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "request_id" in data

        # Verify n8n webhook was called
        assert mock_n8n_webhook.call_count == 1

        # Verify webhook payload structure
        call_args = mock_n8n_webhook.call_args
        webhook_payload = call_args.kwargs.get("json") or call_args.args[0]

        assert "request_id" in webhook_payload
        assert "timestamp" in webhook_payload
        assert "form_data" in webhook_payload
        assert "metadata" in webhook_payload

        # Verify form data was passed correctly
        assert webhook_payload["form_data"]["name"] == "John Doe"
        assert webhook_payload["form_data"]["email"] == "john@example.com"
        assert webhook_payload["form_data"]["subject"] == "Project Inquiry"
        assert webhook_payload["form_data"]["rating"] == 5

        # Verify metadata
        metadata = webhook_payload["metadata"]
        assert metadata["source"] == "portfolio_contact_form"
        assert metadata["version"] == settings.api_version

    async def test_webhook_signature_generation(self, async_client, mock_n8n_webhook):
        """Test that webhook signatures are generated correctly."""
        # Configure webhook secret
        with patch.object(settings, "n8n_webhook_secret", "test-secret-key"):
            form_data = {
                "name": "Test User",
                "email": "test@example.com",
                "subject": "Test",
                "message": "Testing signatures",
                "rating": 4,
            }

            response = await async_client.post("/api/contact", json=form_data)
            assert response.status_code == 200

            # Verify signature header was sent
            call_args = mock_n8n_webhook.call_args
            headers = call_args.kwargs.get("headers", {})

            assert "X-Webhook-Signature" in headers
            signature = headers["X-Webhook-Signature"]
            assert len(signature) == 64  # SHA256 hex = 64 chars

            # Verify signature is valid
            payload = call_args.kwargs.get("json")
            assert verify_webhook_signature(payload, signature, "test-secret-key")

    async def test_webhook_retry_on_failure(self, async_client):
        """Test that webhook retries on failure."""
        # Mock webhook to fail first 2 attempts, succeed on 3rd
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.text = '{"success": true}'
        mock_response.json.return_value = {"success": True}

        with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
            # Fail first 2 attempts
            mock_post.side_effect = [
                httpx.RequestError("Connection failed"),
                httpx.RequestError("Connection failed"),
                mock_response,
            ]

            form_data = {
                "name": "Retry Test",
                "email": "retry@example.com",
                "subject": "Test Retry",
                "message": "Testing retry logic",
                "rating": 3,
            }

            response = await async_client.post("/api/contact", json=form_data)

            # Should succeed after retries
            assert response.status_code == 200
            assert mock_post.call_count == 3

    async def test_webhook_failure_after_max_retries(self, async_client):
        """Test that request fails after max retries exceeded."""
        with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
            # Fail all attempts
            mock_post.side_effect = httpx.RequestError("Connection failed")

            form_data = {
                "name": "Fail Test",
                "email": "fail@example.com",
                "subject": "Test Failure",
                "message": "Testing failure scenario",
                "rating": 2,
            }

            response = await async_client.post("/api/contact", json=form_data)

            # Should return 500 error
            assert response.status_code == 500
            data = response.json()
            assert data["detail"] == "Failed to send notification"

    async def test_webhook_timeout_handling(self, async_client):
        """Test that webhook timeouts are handled gracefully."""
        with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
            mock_post.side_effect = httpx.TimeoutException("Request timeout")

            form_data = {
                "name": "Timeout Test",
                "email": "timeout@example.com",
                "subject": "Test Timeout",
                "message": "Testing timeout handling",
                "rating": 4,
            }

            response = await async_client.post("/api/contact", json=form_data)

            assert response.status_code == 500
            assert "Failed to send notification" in response.json()["detail"]

    async def test_n8n_workflow_payload_format(self, async_client, mock_n8n_webhook):
        """Test that webhook payload matches n8n workflow expectations."""
        form_data = {
            "name": "Alice Smith",
            "email": "alice@example.com",
            "subject": "Bug Report",
            "message": "Found a bug in the contact form.",
            "rating": 3,
        }

        await async_client.post("/api/contact", json=form_data)

        # Get webhook payload
        call_args = mock_n8n_webhook.call_args
        payload = call_args.kwargs.get("json")

        # Verify n8n workflow can extract these fields
        form_data_payload = payload["form_data"]
        assert form_data_payload["name"] == "Alice Smith"
        assert form_data_payload["email"] == "alice@example.com"
        assert form_data_payload["subject"] == "Bug Report"
        assert form_data_payload["message"] == ("Found a bug in the contact form.")
        assert form_data_payload["rating"] == 3

        # Verify timestamp format (ISO 8601)
        timestamp = payload["timestamp"]
        parsed_time = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
        assert parsed_time.tzinfo is not None  # Has timezone

        # Verify request_id format
        request_id = payload["request_id"]
        assert len(request_id) == 32  # 16 bytes hex = 32 chars
        assert all(c in "0123456789abcdef" for c in request_id)

    async def test_multiple_concurrent_submissions(self, async_client, mock_n8n_webhook):
        """Test handling multiple concurrent form submissions."""
        form_submissions = [
            {
                "name": f"User {i}",
                "email": f"user{i}@example.com",
                "subject": f"Subject {i}",
                "message": f"Message {i}",
                "rating": (i % 5) + 1,
            }
            for i in range(5)
        ]

        # Submit all forms concurrently
        responses = await asyncio.gather(
            *[async_client.post("/api/contact", json=form) for form in form_submissions]
        )

        # All should succeed
        assert all(r.status_code == 200 for r in responses)

        # Webhook should be called for each submission
        assert mock_n8n_webhook.call_count == 5

        # Each should have unique request_id
        request_ids = [r.json()["request_id"] for r in responses]
        assert len(set(request_ids)) == 5  # All unique

    async def test_webhook_with_special_characters(self, async_client, mock_n8n_webhook):
        """Test that special characters are handled correctly in webhook."""
        form_data = {
            "name": "José García-López",
            "email": "jose.garcia@example.com",
            "subject": ("Test with émojis 🎮 and spëcial çharacters"),
            "message": "Message with\nline breaks\tand tabs",
            "rating": 5,
        }

        response = await async_client.post("/api/contact", json=form_data)
        assert response.status_code == 200

        # Verify special characters are preserved
        call_args = mock_n8n_webhook.call_args
        payload = call_args.kwargs.get("json")

        assert payload["form_data"]["name"] == "José García-López"
        assert "🎮" in payload["form_data"]["subject"]
        assert "\n" in payload["form_data"]["message"]

    async def test_webhook_error_response_handling(self, async_client):
        """Test handling of n8n error responses."""
        with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
            # Mock n8n returning error response
            error_response = MagicMock()
            error_response.status_code = 500
            error_response.text = "Internal Server Error"
            error_response.raise_for_status.side_effect = httpx.HTTPStatusError(
                "Server error",
                request=MagicMock(),
                response=error_response,
            )
            mock_post.return_value = error_response

            form_data = {
                "name": "Error Test",
                "email": "error@example.com",
                "subject": "Test Error",
                "message": "Testing error handling",
                "rating": 1,
            }

            response = await async_client.post("/api/contact", json=form_data)

            # Should return 500 error after retries
            assert response.status_code == 500


class TestWebhookSecurity:
    """Test webhook security features."""

    def test_signature_generation(self):
        """Test HMAC signature generation."""
        payload = {"name": "John Doe", "email": "john@example.com"}
        secret = "test-secret-key"

        signature1 = generate_webhook_signature(payload, secret)
        signature2 = generate_webhook_signature(payload, secret)

        # Same payload and secret should produce same signature
        assert signature1 == signature2
        assert len(signature1) == 64  # SHA256 hex = 64 chars

    def test_signature_verification_success(self):
        """Test successful signature verification."""
        payload = {"name": "Alice", "email": "alice@example.com"}
        secret = "test-secret"

        signature = generate_webhook_signature(payload, secret)
        is_valid = verify_webhook_signature(payload, signature, secret)

        assert is_valid is True

    def test_signature_verification_failure(self):
        """Test signature verification with wrong signature."""
        payload = {"name": "Bob", "email": "bob@example.com"}
        secret = "test-secret"

        wrong_signature = "0" * 64
        is_valid = verify_webhook_signature(payload, wrong_signature, secret)

        assert is_valid is False

    def test_signature_verification_tampered_payload(self):
        """Test that tampering with payload invalidates signature."""
        original_payload = {"name": "Charlie", "email": "charlie@example.com"}
        secret = "test-secret"

        signature = generate_webhook_signature(original_payload, secret)

        # Tamper with payload
        tampered_payload = {"name": "Hacker", "email": "charlie@example.com"}

        is_valid = verify_webhook_signature(tampered_payload, signature, secret)

        assert is_valid is False

    def test_signature_with_empty_secret(self):
        """Test that empty secret returns empty signature."""
        payload = {"name": "Dave"}
        signature = generate_webhook_signature(payload, "")

        assert signature == ""

    def test_verification_without_secret_passes(self):
        """Test that verification passes when no secret is configured."""
        payload = {"name": "Eve"}
        # With no secret, verification should pass
        is_valid = verify_webhook_signature(payload, "", "")

        assert is_valid is True


@pytest.fixture
def mock_n8n_webhook():
    """Mock n8n webhook endpoint."""
    original_post = httpx.AsyncClient.post
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.text = '{"success": true}'
    mock_response.json.return_value = {"success": True}
    mock_response.raise_for_status = MagicMock()

    # Track calls to webhook
    call_tracker = MagicMock()

    async def selective_mock(self, url, **kwargs):
        """Only mock webhook URLs, pass through API calls."""
        # If it's a webhook URL (contains n8n or webhook), return mock
        if isinstance(url, str) and ("n8n" in url or "webhook" in url):
            # Track this call
            call_tracker(url, **kwargs)
            return mock_response
        # Otherwise, call the original method for API endpoints
        return await original_post(self, url, **kwargs)

    with patch.object(httpx.AsyncClient, "post", selective_mock):
        yield call_tracker
