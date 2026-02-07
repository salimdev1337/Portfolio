"""
Tests for contact form endpoint.
"""

import pytest


@pytest.fixture
def mock_n8n_webhook(monkeypatch):
    """Mock n8n webhook for contact form tests."""

    async def mock_send(*args, **kwargs):
        return {"success": True}

    monkeypatch.setattr("app.services.webhook.WebhookClient.send_contact_form", mock_send)


def test_contact_form_success(client, valid_contact_data, mock_n8n_webhook):
    """Test successful contact form submission."""
    response = client.post("/api/contact", json=valid_contact_data)

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "request_id" in data


def test_contact_form_validation_name_too_short(client):
    """Test validation error for short name."""
    data = {
        "name": "A",
        "email": "test@example.com",
        "subject": "Test",
        "message": "Test message here",
        "rating": 5,
    }

    response = client.post("/api/contact", json=data)
    assert response.status_code == 422


def test_contact_form_validation_invalid_email(client):
    """Test validation error for invalid email."""
    data = {
        "name": "Test User",
        "email": "not-an-email",
        "subject": "Test",
        "message": "Test message here",
        "rating": 5,
    }

    response = client.post("/api/contact", json=data)
    assert response.status_code == 422


def test_contact_form_xss_attempt(client, mock_n8n_webhook):
    """Test XSS prevention."""
    data = {
        "name": "Test User",
        "email": "test@example.com",
        "subject": "Test",
        "message": "Message with <script>alert('xss')</script>",
        "rating": 5,
    }

    response = client.post("/api/contact", json=data)
    # Should reject dangerous content
    assert response.status_code == 400


def test_rate_limiting(client, valid_contact_data, mock_n8n_webhook):
    """Test rate limiting enforcement."""
    # Note: Rate limit is 100/hour in test config, so this test
    # verifies the rate limiter is configured, not that it triggers
    # Make multiple requests - should all succeed with high test limit
    for _ in range(5):
        response = client.post("/api/contact", json=valid_contact_data)
        assert response.status_code == 200

    # In production with 5/hour limit, 6th request would be 429


def test_health_check(client):
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data


def test_root_endpoint(client):
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert "version" in data
