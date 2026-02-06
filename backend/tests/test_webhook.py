"""
Tests for n8n webhook client.
"""
import pytest
from unittest.mock import AsyncMock, patch
from app.services.webhook import WebhookClient
from app.utils.exceptions import WebhookError


@pytest.mark.asyncio
async def test_webhook_client_success():
    """Test successful webhook request."""
    webhook_url = "https://test.n8n.webhook.url/contact"
    client = WebhookClient(webhook_url=webhook_url) # type: ignore

    # Mock the HTTP client
    with patch.object(client.client, 'post') as mock_post:
        mock_response = AsyncMock()
        mock_response.status_code = 200
        mock_response.text = '{"success": true}'
        mock_response.json.return_value = {"success": True}
        mock_response.raise_for_status = AsyncMock()
        mock_post.return_value = mock_response

        data = {
            "name": "Test User",
            "email": "test@example.com",
            "subject": "Test",
            "message": "Test message",
            "rating": 5
        }

        result = await client.send_contact_form(data, "req_test123")
        assert result["success"] is True


@pytest.mark.asyncio
async def test_webhook_client_http_error():
    """Test webhook HTTP error handling."""
    webhook_url = "https://test.n8n.webhook.url/contact"
    client = WebhookClient(webhook_url=webhook_url, max_retries=2) # type: ignore

    # Mock the HTTP client to raise HTTP error
    with patch.object(client.client, 'post') as mock_post:
        mock_response = AsyncMock()
        mock_response.status_code = 500
        mock_response.raise_for_status.side_effect = Exception("HTTP Error")
        mock_post.return_value = mock_response

        data = {
            "name": "Test User",
            "email": "test@example.com",
            "subject": "Test",
            "message": "Test message",
            "rating": 5
        }

        with pytest.raises(WebhookError):
            await client.send_contact_form(data, "req_test123")


@pytest.mark.asyncio
async def test_webhook_client_close():
    """Test webhook client close."""
    webhook_url = "https://test.n8n.webhook.url/contact"
    client = WebhookClient(webhook_url=webhook_url) # type: ignore

    with patch.object(client.client, 'aclose') as mock_close:
        mock_close.return_value = AsyncMock()
        await client.close()
        mock_close.assert_called_once()
