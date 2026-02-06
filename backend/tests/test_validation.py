"""
Tests for input validation and sanitization.
"""
import pytest
from app.services.validation import InputValidator


def test_sanitize_html():
    """Test HTML sanitization."""
    dirty = "<script>alert('xss')</script>Hello World"
    clean = InputValidator.sanitize_html(dirty)
    assert "<script>" not in clean
    assert "Hello World" in clean


def test_validate_no_sql_injection():
    """Test SQL injection detection."""
    safe_text = "This is a normal message"
    dangerous_text = "'; DROP TABLE users; --"

    assert InputValidator.validate_no_sql_injection(safe_text) is True
    assert InputValidator.validate_no_sql_injection(dangerous_text) is False


def test_validate_no_script_tags():
    """Test script tag detection."""
    safe_text = "This is a normal message"
    dangerous_text = "<script>alert('xss')</script>"

    assert InputValidator.validate_no_script_tags(safe_text) is True
    assert InputValidator.validate_no_script_tags(dangerous_text) is False


def test_sanitize_contact_form():
    """Test full contact form sanitization."""
    data = {
        "name": "John Doe",
        "email": "john@example.com",
        "subject": "Test Subject",
        "message": "This is a safe message",
        "rating": 5
    }

    sanitized = InputValidator.sanitize_contact_form(data)
    assert sanitized["name"] == "John Doe"
    assert sanitized["email"] == "john@example.com"


def test_sanitize_contact_form_with_html():
    """Test contact form sanitization with HTML."""
    data = {
        "name": "John<b>Doe</b>",
        "email": "john@example.com",
        "subject": "Test",
        "message": "Message with <strong>HTML</strong>",
        "rating": 5
    }

    sanitized = InputValidator.sanitize_contact_form(data)
    assert "<b>" not in sanitized["name"]
    assert "<strong>" not in sanitized["message"]


def test_sanitize_contact_form_with_dangerous_content():
    """Test contact form sanitization rejects dangerous content."""
    data = {
        "name": "John Doe",
        "email": "john@example.com",
        "subject": "Test",
        "message": "<script>alert('xss')</script>",
        "rating": 5
    }

    with pytest.raises(ValueError):
        InputValidator.sanitize_contact_form(data)


def test_validate_email_domain():
    """Test email domain validation."""
    valid_email = "john@gmail.com"
    disposable_email = "test@tempmail.com"

    assert InputValidator.validate_email_domain(valid_email) is True
    assert InputValidator.validate_email_domain(disposable_email) is False
