"""
Pytest configuration and fixtures.
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.config import settings


@pytest.fixture
def client():
    """Create test client."""
    return TestClient(app)


@pytest.fixture
def valid_contact_data():
    """Valid contact form data for testing."""
    return {
        "name": "Test User",
        "email": "test@example.com",
        "subject": "Test Subject",
        "message": "This is a test message with enough content.",
        "rating": 5
    }


@pytest.fixture
def mock_n8n_webhook(monkeypatch):
    """Mock n8n webhook response."""
    async def mock_send(*args, **kwargs):
        return {"success": True}

    monkeypatch.setattr(
        "app.services.webhook.WebhookClient.send_contact_form",
        mock_send
    )
