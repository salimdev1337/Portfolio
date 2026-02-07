"""
Security utilities for webhook signature verification and HMAC generation.
"""
import hmac
import hashlib
import secrets
from typing import Dict, Any
import json


def generate_webhook_signature(
    payload: Dict[str, Any],
    secret: str
) -> str:
    """
    Generate HMAC-SHA256 signature for webhook payload.

    Args:
        payload: The payload to sign
        secret: The signing secret

    Returns:
        Hex-encoded signature

    Example:
        >>> payload = {"name": "John", "email": "john@example.com"}
        >>> secret = "my-secret-key"
        >>> signature = generate_webhook_signature(payload, secret)
        >>> print(signature)
        'a1b2c3d4e5f6...'
    """
    if not secret:
        return ""

    # Convert payload to canonical JSON string
    payload_string = json.dumps(payload, sort_keys=True, separators=(',', ':'))
    payload_bytes = payload_string.encode('utf-8')
    secret_bytes = secret.encode('utf-8')

    # Generate HMAC-SHA256 signature
    signature = hmac.new(
        secret_bytes,
        payload_bytes,
        hashlib.sha256
    ).hexdigest()

    return signature


def verify_webhook_signature(
    payload: Dict[str, Any],
    signature: str,
    secret: str
) -> bool:
    """
    Verify webhook signature matches the payload.

    Args:
        payload: The payload to verify
        signature: The signature to check
        secret: The signing secret

    Returns:
        True if signature is valid, False otherwise

    Example:
        >>> payload = {"name": "John"}
        >>> secret = "my-secret"
        >>> sig = generate_webhook_signature(payload, secret)
        >>> verify_webhook_signature(payload, sig, secret)
        True
    """
    if not secret or not signature:
        # If no secret configured, skip verification
        return True

    expected_signature = generate_webhook_signature(payload, secret)

    # Use constant-time comparison to prevent timing attacks
    return hmac.compare_digest(signature, expected_signature)


def generate_webhook_secret(length: int = 32) -> str:
    """
    Generate a cryptographically secure random webhook secret.

    Args:
        length: Length of the secret in bytes (default: 32)

    Returns:
        Hex-encoded random secret

    Example:
        >>> secret = generate_webhook_secret()
        >>> len(secret)
        64  # 32 bytes = 64 hex characters
    """
    return secrets.token_hex(length)


def generate_request_id() -> str:
    """
    Generate a unique request ID for tracking.

    Returns:
        Random hex string (16 bytes / 32 characters)

    Example:
        >>> request_id = generate_request_id()
        >>> len(request_id)
        32
    """
    return secrets.token_hex(16)
