"""
Advanced input validation and sanitization services.
Defense against XSS, SQL injection, and malicious input.
"""
import re
import bleach
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)


# Allowed HTML tags (none for plain text forms)
ALLOWED_TAGS = []
ALLOWED_ATTRIBUTES = {}


class InputValidator:
    """Advanced input validation and sanitization."""

    @staticmethod
    def sanitize_html(text: str) -> str:
        """
        Remove all HTML tags and dangerous content.
        Prevents XSS attacks.

        Args:
            text: Raw input text

        Returns:
            Sanitized plain text
        """
        # Remove HTML tags
        clean_text = bleach.clean(
            text,
            tags=ALLOWED_TAGS,
            attributes=ALLOWED_ATTRIBUTES,
            strip=True
        )

        return clean_text.strip()

    @staticmethod
    def validate_no_sql_injection(text: str) -> bool:
        """
        Check for common SQL injection patterns.
        Defense-in-depth even though we're not using SQL.

        Args:
            text: Input text to validate

        Returns:
            True if safe, False if suspicious
        """
        # Common SQL injection patterns
        sql_patterns = [
            r"('\s*(OR|AND)\s*')",  # ' OR ' / ' AND '
            r"(--|#|\/\*|\*\/)",     # SQL comments
            r"(;|\|\||&&)",          # Statement separators
            r"(\bUNION\b.*\bSELECT\b)",  # UNION SELECT
            r"(\bDROP\b|\bDELETE\b|\bINSERT\b)",  # Dangerous keywords
            r"(\bEXEC\b|\bEXECUTE\b)",  # Execute commands
        ]

        text_upper = text.upper()
        for pattern in sql_patterns:
            if re.search(pattern, text_upper, re.IGNORECASE):
                logger.warning(
                    "Potential SQL injection attempt detected",
                    extra={"pattern": pattern, "text_sample": text[:50]}
                )
                return False

        return True

    @staticmethod
    def validate_no_script_tags(text: str) -> bool:
        """
        Check for script tags and JavaScript.

        Args:
            text: Input text to validate

        Returns:
            True if safe, False if suspicious
        """
        dangerous_patterns = [
            r"<script[^>]*>.*?</script>",
            r"javascript:",
            r"on\w+\s*=",  # Event handlers like onclick=
            r"<iframe",
            r"<object",
            r"<embed",
        ]

        text_lower = text.lower()
        for pattern in dangerous_patterns:
            if re.search(pattern, text_lower, re.IGNORECASE):
                logger.warning(
                    "Potential XSS attempt detected",
                    extra={"pattern": pattern, "text_sample": text[:50]}
                )
                return False

        return True

    @classmethod
    def sanitize_contact_form(cls, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Comprehensive sanitization for contact form data.

        Args:
            data: Raw contact form data

        Returns:
            Sanitized data dictionary
        """
        sanitized = {}

        for key, value in data.items():
            if isinstance(value, str):
                # Validate BEFORE sanitizing (to catch attacks)
                if not cls.validate_no_script_tags(value):
                    raise ValueError(f"Dangerous content detected in {key}")

                if not cls.validate_no_sql_injection(value):
                    raise ValueError(f"Suspicious input detected in {key}")

                # Sanitize HTML after validation
                clean_value = cls.sanitize_html(value)

                sanitized[key] = clean_value
            else:
                sanitized[key] = value

        return sanitized

    @staticmethod
    def validate_email_domain(email: str, blocked_domains: list = None) -> bool: # type: ignore
        """
        Validate email domain against blocklist.

        Args:
            email: Email address to validate
            blocked_domains: List of blocked domains

        Returns:
            True if valid, False if blocked
        """
        if blocked_domains is None:
            blocked_domains = [
                "tempmail.com",
                "throwaway.email",
                "guerrillamail.com",
                # Add more disposable email domains
            ]

        domain = email.split("@")[-1].lower()
        return domain not in blocked_domains
