import requests
import time

# Test bot blocking on production
BACKEND_URL = "https://assessment-hub-backend.onrender.com"

print("🤖 Testing Bot Blocking on Production...")
print(f"Target: {BACKEND_URL}/api/auth/login/\n")

# Test 1: python-requests user agent (should be blocked)
print("Test 1: python-requests user agent")
try:
    response = requests.post(
        f"{BACKEND_URL}/api/auth/login/",
        json={"email": "test@example.com", "password": "test123"},
        timeout=10
    )
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
    if response.status_code == 403:
        print("   ✅ BLOCKED (as expected)\n")
    else:
        print("   ❌ NOT BLOCKED (security issue!)\n")
except Exception as e:
    print(f"   Error: {e}\n")

# Test 2: Browser user agent (should work)
print("Test 2: Browser user agent (Chrome)")
try:
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    response = requests.post(
        f"{BACKEND_URL}/api/auth/login/",
        json={"email": "test@example.com", "password": "wrongpassword"},
        headers=headers,
        timeout=10
    )
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
    if response.status_code in [400, 401]:
        print("   ✅ ALLOWED (request processed, just wrong credentials)\n")
    elif response.status_code == 403:
        print("   ❌ BLOCKED (should allow browsers!)\n")
except Exception as e:
    print(f"   Error: {e}\n")

# Test 3: Health check with python-requests (should be allowed)
print("Test 3: Health check endpoint (should allow bots)")
try:
    response = requests.get(f"{BACKEND_URL}/api/health/", timeout=10)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        print("   ✅ ALLOWED (health check works)\n")
    else:
        print(f"   Response: {response.text}\n")
except Exception as e:
    print(f"   Error: {e}\n")

print("\n" + "="*60)
print("EXPECTED RESULTS:")
print("  Test 1: 403 Forbidden (bot blocked)")
print("  Test 2: 400/401 (browser allowed, just wrong password)")
print("  Test 3: 200 OK (health check allowed for bots)")
print("="*60)
