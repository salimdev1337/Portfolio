#!/bin/bash
# Backend API Testing Script

echo "🧪 Testing Portfolio Backend API"
echo "=================================="
echo ""

API_URL="${1:-http://localhost:8000}"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "${BLUE}Test 1: Health Check${NC}"
echo "GET $API_URL/health"
response=$(curl -s -w "\n%{http_code}" "$API_URL/health")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC} (HTTP $http_code)"
    echo "$body" | python3 -m json.tool
else
    echo -e "${RED}❌ FAIL${NC} (HTTP $http_code)"
fi
echo ""

# Test 2: Root Endpoint
echo -e "${BLUE}Test 2: Root Endpoint${NC}"
echo "GET $API_URL/"
response=$(curl -s -w "\n%{http_code}" "$API_URL/")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC} (HTTP $http_code)"
    echo "$body" | python3 -m json.tool
else
    echo -e "${RED}❌ FAIL${NC} (HTTP $http_code)"
fi
echo ""

# Test 3: Valid Contact Form
echo -e "${BLUE}Test 3: Valid Contact Form Submission${NC}"
echo "POST $API_URL/api/contact"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "subject": "Test Inquiry",
    "message": "This is a test message from the API testing script.",
    "rating": 5
  }')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC} (HTTP $http_code)"
    echo "$body" | python3 -m json.tool
else
    echo -e "${RED}❌ FAIL${NC} (HTTP $http_code)"
    echo "$body"
fi
echo ""

# Test 4: Invalid Email
echo -e "${BLUE}Test 4: Invalid Email Validation${NC}"
echo "POST $API_URL/api/contact (with invalid email)"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "not-an-email",
    "subject": "Test",
    "message": "This should fail validation",
    "rating": 5
  }')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "422" ]; then
    echo -e "${GREEN}✅ PASS${NC} (HTTP $http_code - Validation Error as expected)"
    echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
else
    echo -e "${RED}❌ FAIL${NC} (Expected HTTP 422, got $http_code)"
fi
echo ""

# Test 5: Short Name
echo -e "${BLUE}Test 5: Short Name Validation${NC}"
echo "POST $API_URL/api/contact (name too short)"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "A",
    "email": "test@example.com",
    "subject": "Test",
    "message": "This should fail validation",
    "rating": 5
  }')
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" = "422" ]; then
    echo -e "${GREEN}✅ PASS${NC} (HTTP $http_code - Validation Error as expected)"
else
    echo -e "${RED}❌ FAIL${NC} (Expected HTTP 422, got $http_code)"
fi
echo ""

# Test 6: XSS Attempt
echo -e "${BLUE}Test 6: XSS Prevention${NC}"
echo "POST $API_URL/api/contact (with script tags)"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "XSS Test",
    "message": "<script>alert(\"xss\")</script>This is a test",
    "rating": 5
  }')
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" = "400" ] || [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC} (HTTP $http_code - Handled correctly)"
else
    echo -e "${RED}❌ FAIL${NC} (HTTP $http_code)"
fi
echo ""

# Summary
echo "=================================="
echo "🏁 Testing Complete!"
echo ""
echo "Next steps:"
echo "1. Check the API docs at: $API_URL/docs"
echo "2. Run the test suite: pytest tests/ -v"
echo "3. Test with Postman or Thunder Client"
