"""
Pytest configuration and fixtures.
"""

import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.middleware.rate_limit import limiter


@pytest.fixture(autouse=True)
def reset_rate_limits():
    """Clear in-memory rate limit counters before every test so tests don't bleed into each other."""
    limiter._storage.reset()
    yield


@pytest.fixture
def client():
    """Create test client."""
    return TestClient(app)


@pytest_asyncio.fixture
async def async_client():
    """Create async test client."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


@pytest.fixture
def valid_contact_data():
    """Valid contact form data for testing."""
    return {
        "name": "Test User",
        "email": "test@example.com",
        "subject": "Test Subject",
        "message": "This is a test message with enough content.",
        "rating": 5,
    }
