"""
Test script to verify aiohttp bot blocking is working
"""
import asyncio
import aiohttp

BACKEND_URL = "https://assessment-hub-backend.onrender.com"

async def test_aiohttp_blocking():
    print("🧪 Testing aiohttp bot blocking...")
    print(f"Target: {BACKEND_URL}/api/auth/login/\n")
    
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(
                f"{BACKEND_URL}/api/auth/login/",
                json={"email": "test@example.com", "password": "test123"},
                timeout=aiohttp.ClientTimeout(total=10)
            ) as response:
                status = response.status
                text = await response.text()
                
                if status == 403:
                    print("✅ SUCCESS: aiohttp is now BLOCKED!")
                    print(f"   Status: {status}")
                    print(f"   Response: {text[:200]}")
                elif status == 200:
                    print("❌ FAILURE: aiohttp is still ALLOWED!")
                    print(f"   Status: {status}")
                    print(f"   This means bots can still bypass protection")
                else:
                    print(f"⚠️  Unexpected status: {status}")
                    print(f"   Response: {text[:200]}")
                    
        except Exception as e:
            print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_aiohttp_blocking())
