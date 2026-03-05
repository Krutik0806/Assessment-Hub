import requests
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

BACKEND_URL = "https://assessment-hub-backend.onrender.com"
TOTAL_REQUESTS = 200

print("🚀 LOAD TEST: Sending 200 requests to production")
print(f"Target: {BACKEND_URL}/api/auth/login/")
print(f"User-Agent: python-requests (should be blocked by middleware)")
print(f"Time: {datetime.now().strftime('%H:%M:%S')}\n")

results = {
    'success': 0,
    'blocked_403': 0,
    'errors': 0,
    'response_times': []
}

def send_request(i):
    try:
        start = time.time()
        response = requests.post(
            f"{BACKEND_URL}/api/auth/login/",
            json={"email": f"test{i}@example.com", "password": "test123"},
            timeout=10
        )
        duration = time.time() - start
        
        return {
            'index': i,
            'status': response.status_code,
            'duration': duration,
            'response': response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text[:100]
        }
    except Exception as e:
        return {
            'index': i,
            'status': 'ERROR',
            'duration': 0,
            'response': str(e)
        }

# Send all requests concurrently
print("📊 Sending requests...\n")
start_time = time.time()

with ThreadPoolExecutor(max_workers=20) as executor:
    futures = [executor.submit(send_request, i) for i in range(1, TOTAL_REQUESTS + 1)]
    
    for future in as_completed(futures):
        result = future.result()
        
        if result['status'] == 403:
            results['blocked_403'] += 1
            print(f"Request #{result['index']:3d}: 🛑 BLOCKED (403) - {result['duration']:.2f}s")
        elif result['status'] == 200:
            results['success'] += 1
            print(f"Request #{result['index']:3d}: ✅ SUCCESS (200) - {result['duration']:.2f}s")
        else:
            results['errors'] += 1
            print(f"Request #{result['index']:3d}: ❌ {result['status']} - {result['response']}")
        
        results['response_times'].append(result.get('duration', 0))

total_time = time.time() - start_time

# Summary
print("\n" + "="*70)
print("📈 LOAD TEST RESULTS")
print("="*70)
print(f"Total Requests:     {TOTAL_REQUESTS}")
print(f"Blocked (403):      {results['blocked_403']} ({'✅ EXPECTED' if results['blocked_403'] == TOTAL_REQUESTS else '❌ ISSUE'})")
print(f"Success (200):      {results['success']}")
print(f"Errors:             {results['errors']}")
print(f"Total Time:         {total_time:.2f}s")
print(f"Requests/sec:       {TOTAL_REQUESTS/total_time:.2f}")

if results['response_times']:
    avg_response = sum(results['response_times']) / len(results['response_times'])
    max_response = max(results['response_times'])
    min_response = min(results['response_times'])
    print(f"\nResponse Times:")
    print(f"  Average:          {avg_response:.3f}s")
    print(f"  Min:              {min_response:.3f}s")
    print(f"  Max:              {max_response:.3f}s")

print("\n" + "="*70)
print("🎯 EXPECTED BEHAVIOR:")
print("  - All 200 requests should be BLOCKED with 403")
print("  - Middleware blocks at framework level (very fast)")
print("  - Server should NOT crash or slow down")
print("  - No database load (requests blocked before routing)")
print("="*70)

if results['blocked_403'] == TOTAL_REQUESTS:
    print("\n✅ PERFECT! All bot requests blocked. Server protected!")
else:
    print(f"\n⚠️  WARNING: Only {results['blocked_403']}/{TOTAL_REQUESTS} blocked!")
