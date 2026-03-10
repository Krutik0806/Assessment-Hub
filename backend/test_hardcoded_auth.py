"""Test hardcoded student authentication"""
import requests
import json

BASE_URL = 'http://127.0.0.1:8000/api'

# Add browser user agent to bypass bot blocking
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

# Test 1: Valid student login
print("\n=== Test 1: Valid student login ===")
valid_student = {
    'username': '2303031050031@paruluniversity.ac.in',
    'password': '2303031050031'
}
response = requests.post(f'{BASE_URL}/auth/login/', json=valid_student, headers=HEADERS)
print(f"Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

# Test 2: Invalid enrollment (wrong password)
print("\n=== Test 2: Wrong password ===")
wrong_password = {
    'username': '2303031050031@paruluniversity.ac.in',
    'password': 'wrongpassword'
}
response = requests.post(f'{BASE_URL}/auth/login/', json=wrong_password, headers=HEADERS)
print(f"Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

# Test 3: Unauthorized email (not in student list)
print("\n=== Test 3: Unauthorized email ===")
unauthorized = {
    'username': 'notastudent@example.com',
    'password': 'anypassword'
}
response = requests.post(f'{BASE_URL}/auth/login/', json=unauthorized, headers=HEADERS)
print(f"Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

# Test 4: Check if Google login is disabled (should return 404)
print("\n=== Test 4: Google login disabled ===")
try:
    response = requests.post(f'{BASE_URL}/auth/google/', json={'credential': 'test'}, headers=HEADERS)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")

# Test 5: Check if register is disabled (should return 404)
print("\n=== Test 5: Register disabled ===")
try:
    response = requests.post(f'{BASE_URL}/auth/register/', json={'email': 'test@test.com'}, headers=HEADERS)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
