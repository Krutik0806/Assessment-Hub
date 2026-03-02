"""
Load Testing Tool for Assessment Hub
Simulates multiple concurrent users taking tests
"""

import asyncio
import aiohttp
import time
from datetime import datetime
import json


# Configuration
BASE_URL = "https://assessment-hub-backend.onrender.com"  # Change to your deployed URL
# For local testing: BASE_URL = "http://localhost:8000"

NUM_USERS = 150  # Number of concurrent users to simulate
TEST_DURATION = 60  # Seconds to run the test


class LoadTester:
    def __init__(self, base_url, num_users):
        self.base_url = base_url
        self.num_users = num_users
        self.results = {
            'total_requests': 0,
            'successful': 0,
            'failed': 0,
            'timeouts': 0,
            'response_times': [],
            'errors': []
        }
    
    async def simulate_user(self, session, user_id):
        """Simulate a single user taking a test"""
        try:
            # 1. Health check / Get tests
            start_time = time.time()
            async with session.get(f"{self.base_url}/api/tests/", timeout=30) as response:
                elapsed = time.time() - start_time
                self.results['total_requests'] += 1
                
                if response.status == 200:
                    self.results['successful'] += 1
                    self.results['response_times'].append(elapsed)
                    print(f"✓ User {user_id}: GET tests - {elapsed:.2f}s - Status {response.status}")
                else:
                    self.results['failed'] += 1
                    print(f"✗ User {user_id}: GET tests - {elapsed:.2f}s - Status {response.status}")
                    
        except asyncio.TimeoutError:
            self.results['total_requests'] += 1
            self.results['timeouts'] += 1
            print(f"⏱ User {user_id}: Timeout")
        except Exception as e:
            self.results['total_requests'] += 1
            self.results['failed'] += 1
            self.results['errors'].append(str(e))
            print(f"❌ User {user_id}: Error - {str(e)[:50]}")
    
    async def run_load_test(self):
        """Run the load test with concurrent users"""
        print(f"\n{'='*60}")
        print(f"🚀 LOAD TEST STARTING")
        print(f"{'='*60}")
        print(f"Target: {self.base_url}")
        print(f"Concurrent Users: {self.num_users}")
        print(f"Start Time: {datetime.now().strftime('%H:%M:%S')}\n")
        
        connector = aiohttp.TCPConnector(limit=self.num_users)
        timeout = aiohttp.ClientTimeout(total=60)
        
        async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
            # Create tasks for all users
            tasks = [self.simulate_user(session, i+1) for i in range(self.num_users)]
            
            # Run all users concurrently
            start = time.time()
            await asyncio.gather(*tasks)
            total_time = time.time() - start
        
        # Print results
        self.print_results(total_time)
    
    def print_results(self, total_time):
        """Print test results"""
        print(f"\n{'='*60}")
        print(f"📊 LOAD TEST RESULTS")
        print(f"{'='*60}\n")
        
        print(f"Total Time: {total_time:.2f} seconds")
        print(f"Total Requests: {self.results['total_requests']}")
        print(f"✓ Successful: {self.results['successful']} ({self.results['successful']/self.results['total_requests']*100:.1f}%)")
        print(f"✗ Failed: {self.results['failed']} ({self.results['failed']/self.results['total_requests']*100:.1f}%)")
        print(f"⏱ Timeouts: {self.results['timeouts']} ({self.results['timeouts']/self.results['total_requests']*100:.1f}%)")
        
        if self.results['response_times']:
            avg_time = sum(self.results['response_times']) / len(self.results['response_times'])
            min_time = min(self.results['response_times'])
            max_time = max(self.results['response_times'])
            
            print(f"\n⏱️ Response Times:")
            print(f"  Average: {avg_time:.2f}s")
            print(f"  Fastest: {min_time:.2f}s")
            print(f"  Slowest: {max_time:.2f}s")
        
        print(f"\n🎯 Performance Grade:")
        success_rate = self.results['successful'] / self.results['total_requests'] * 100
        
        if success_rate >= 99 and avg_time < 2:
            print("  ⭐⭐⭐ EXCELLENT - Production Ready!")
        elif success_rate >= 95 and avg_time < 5:
            print("  ⭐⭐ GOOD - Works well for most use cases")
        elif success_rate >= 85:
            print("  ⭐ FAIR - May need optimization")
        else:
            print("  ❌ POOR - Needs immediate attention")
        
        print(f"\n{'='*60}\n")


async def main():
    """Main function"""
    print("\n" + "="*60)
    print("  ASSESSMENT HUB - LOAD TESTING TOOL")
    print("="*60 + "\n")
    
    # You can change these values
    tester = LoadTester(BASE_URL, NUM_USERS)
    await tester.run_load_test()
    
    print("\n💡 Tips:")
    print("  - If success rate < 95%, consider upgrading server")
    print("  - Average response time < 2s is excellent")
    print("  - Response time < 5s is acceptable for exams")
    print("  - If timeouts occur, increase server workers\n")


if __name__ == "__main__":
    asyncio.run(main())
