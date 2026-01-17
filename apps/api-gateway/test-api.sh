#!/bin/bash

# API Gateway Testing Script
# Este script permite probar los endpoints del API Gateway

API_URL="http://localhost:3002"
TOKEN="Bearer your_jwt_token_here"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== API Gateway Testing ===${NC}\n"

# Test 1: Health Check (sin autenticación)
echo -e "${GREEN}1. Testing Health Check${NC}"
curl -X GET "$API_URL/health" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 2: Get Attendance (con autenticación)
echo -e "${GREEN}2. Testing Get Attendance (requires authentication)${NC}"
curl -X GET "$API_URL/attendance" \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN" \
  -w "\nStatus: %{http_code}\n\n"

# Test 3: Get Attendance by ID
echo -e "${GREEN}3. Testing Get Attendance by ID${NC}"
curl -X GET "$API_URL/attendance/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN" \
  -w "\nStatus: %{http_code}\n\n"

# Test 4: Create Attendance
echo -e "${GREEN}4. Testing Create Attendance${NC}"
curl -X POST "$API_URL/attendance" \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN" \
  -d '{
    "userId": "123",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
    "status": "present"
  }' \
  -w "\nStatus: %{http_code}\n\n"

# Test 5: Test without authentication (should fail)
echo -e "${RED}5. Testing without authentication (should fail)${NC}"
curl -X GET "$API_URL/attendance" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

echo -e "${BLUE}=== Testing Complete ===${NC}"
