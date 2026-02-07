#!/usr/bin/env python3
"""
Generate a secure secret key for production use.
Run this script and copy the output to your Render environment variables.
"""
import secrets

def generate_secret_key(length: int = 32) -> str:
    """Generate a cryptographically secure secret key."""
    return secrets.token_hex(length)

if __name__ == "__main__":
    secret_key = generate_secret_key()
    print("=" * 70)
    print("🔐 SECRET KEY GENERATOR")
    print("=" * 70)
    print("\nYour new secret key:")
    print("-" * 70)
    print(secret_key)
    print("-" * 70)
    print("\n📋 Instructions:")
    print("1. Copy the secret key above")
    print("2. Go to Render Dashboard → Your Service → Environment")
    print("3. Add environment variable: SECRET_KEY")
    print("4. Paste the secret key")
    print("5. Click 'Save Changes'")
    print("\n⚠️  IMPORTANT:")
    print("- Keep this secret! Never commit to Git")
    print("- Never share this with anyone")
    print("- Store securely (password manager)")
    print("- Rotate every 3-6 months")
    print("\n✅ This key is cryptographically secure and ready for production use.")
    print("=" * 70)
