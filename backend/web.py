"""
Web server with auto-ping functionality to keep Render.com service alive.
Prevents the free tier from shutting down after 5 minutes of inactivity.
"""

import os
import asyncio
import aiohttp
from aiohttp import web

# Update this URL after deploying to Render
RENDER_URL = "https://assessment-hub-backend.onrender.com"  # Replace with your actual Render URL
PORT = int(os.environ.get("PORT", 8080))


async def health_check(request):
    """Simple health check endpoint."""
    return web.Response(text="Bot is alive! ✅", status=200)


async def ping_server():
    """Auto-ping function to keep the server alive."""
    await asyncio.sleep(60)  # Wait 1 minute before starting ping cycle
    
    while True:
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{RENDER_URL}/health") as response:
                    if response.status == 200:
                        print("✅ Ping successful - Server is alive!")
                    else:
                        print(f"⚠️ Ping returned status: {response.status}")
        except Exception as e:
            print(f"❌ Ping failed: {e}")
        
        # Wait 3 minutes before next ping (to prevent 5-minute shutdown)
        await asyncio.sleep(180)


async def start_background_tasks(app):
    """Start background tasks when the app starts."""
    app['ping_task'] = asyncio.create_task(ping_server())


async def cleanup_background_tasks(app):
    """Cleanup background tasks when the app stops."""
    app['ping_task'].cancel()
    await app['ping_task']


def create_app():
    """Create and configure the web application."""
    app = web.Application()
    app.router.add_get('/health', health_check)
    app.router.add_get('/', health_check)
    
    # Register startup and cleanup handlers
    app.on_startup.append(start_background_tasks)
    app.on_cleanup.append(cleanup_background_tasks)
    
    return app


def run_server():
    """Run the web server."""
    app = create_app()
    print(f"🚀 Starting web server on port {PORT}")
    print(f"🔄 Auto-ping enabled - pinging every 3 minutes")
    web.run_app(app, host='0.0.0.0', port=PORT)


if __name__ == '__main__':
    run_server()
