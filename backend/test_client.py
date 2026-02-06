#!/usr/bin/env python3
"""
Simple test client for the Portfolio Backend API
"""
import requests
import json
from typing import Dict, Any


class PortfolioAPIClient:
    """Simple client for testing the Portfolio API"""

    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})

    def health_check(self) -> Dict[str, Any]:
        """Check API health"""
        response = self.session.get(f"{self.base_url}/health")
        return response.json()

    def submit_contact(
        self,
        name: str,
        email: str,
        subject: str,
        message: str,
        rating: int = 0
    ) -> Dict[str, Any]:
        """Submit a contact form"""
        data = {
            "name": name,
            "email": email,
            "subject": subject,
            "message": message,
            "rating": rating
        }
        response = self.session.post(f"{self.base_url}/api/contact", json=data)
        return {
            "status_code": response.status_code,
            "body": response.json() if response.text else {}
        }


def main():
    """Run test scenarios"""
    print("🧪 Testing Portfolio Backend API with Python Client\n")

    client = PortfolioAPIClient()

    # Test 1: Health Check
    print("Test 1: Health Check")
    try:
        health = client.health_check()
        print(f"✅ Status: {health.get('status')}")
        print(f"   Version: {health.get('version')}")
        print(f"   Environment: {health.get('environment')}\n")
    except Exception as e:
        print(f"❌ Error: {e}\n")

    # Test 2: Valid Contact Form
    print("Test 2: Valid Contact Form")
    try:
        result = client.submit_contact(
            name="Jane Smith",
            email="jane.smith@example.com",
            subject="API Testing",
            message="This is a test message from the Python client script. Testing the contact form functionality.",
            rating=5
        )
        if result["status_code"] == 200:
            print(f"✅ Success: {result['body'].get('message')}")
            print(f"   Request ID: {result['body'].get('request_id')}\n")
        else:
            print(f"❌ Failed with status {result['status_code']}")
            print(f"   Response: {json.dumps(result['body'], indent=2)}\n")
    except Exception as e:
        print(f"❌ Error: {e}\n")

    # Test 3: Invalid Email
    print("Test 3: Invalid Email (Should Fail)")
    try:
        result = client.submit_contact(
            name="Test User",
            email="not-an-email",
            subject="Test",
            message="This should fail validation",
            rating=5
        )
        if result["status_code"] == 422:
            print(f"✅ Validation error as expected (HTTP {result['status_code']})\n")
        else:
            print(f"❌ Unexpected status code: {result['status_code']}\n")
    except Exception as e:
        print(f"❌ Error: {e}\n")

    # Test 4: Short Message
    print("Test 4: Short Message (Should Fail)")
    try:
        result = client.submit_contact(
            name="Test User",
            email="test@example.com",
            subject="Test",
            message="Short",
            rating=5
        )
        if result["status_code"] == 422:
            print(f"✅ Validation error as expected (HTTP {result['status_code']})\n")
        else:
            print(f"❌ Unexpected status code: {result['status_code']}\n")
    except Exception as e:
        print(f"❌ Error: {e}\n")

    print("🏁 Testing Complete!")
    print("\nNext steps:")
    print("1. Check interactive docs at: http://localhost:8000/docs")
    print("2. Run unit tests: pytest tests/ -v")
    print("3. Test with curl: ./test_api.sh")


if __name__ == "__main__":
    main()
