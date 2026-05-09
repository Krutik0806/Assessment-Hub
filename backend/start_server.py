"""
Startup script for Render.com deployment.
Runs Django app with Gunicorn and starts keep-alive ping service.
"""

import os
import sys
import threading
import time
import requests
from subprocess import Popen, run

# Configuration
RENDER_URL = os.environ.get("RENDER_EXTERNAL_URL", "https://assessment-hub.onrender.com")
PORT = os.environ.get("PORT", "8080")


def cleanup_db():
    """Run cleanup_packages to remove stale packages (e.g. CAD folder)."""
    print("Running DB cleanup...")
    result = run(["python", "manage.py", "cleanup_packages"], capture_output=True, text=True)
    print(result.stdout)
    if result.returncode != 0:
        print(f"Cleanup warning: {result.stderr}")


def ping_server():
    """Background thread to ping the server every 3 minutes."""
    print("Keep-alive service started")
    time.sleep(60)  # Wait 1 minute before starting
    
    while True:
        try:
            response = requests.get(f"{RENDER_URL}/api/health/", timeout=10)
            if response.status_code == 200:
                print("Keep-alive ping successful")
            else:
                print(f"Keep-alive ping returned status: {response.status_code}")
        except Exception as e:
            print(f"Keep-alive ping failed: {e}")
        
        # Sleep for 3 minutes (180 seconds)
        time.sleep(180)


def start_django():
    """Start Django with Gunicorn."""
    print(f"Starting Django on port {PORT}")

    # Clean up stale packages before starting
    cleanup_db()

    # Start ping service in background thread
    ping_thread = threading.Thread(target=ping_server, daemon=True)
    ping_thread.start()
    
    # Start Gunicorn with optimized settings for concurrent users
    cmd = [
        "gunicorn",
        "csa_backend.wsgi:application",
        "--bind", f"0.0.0.0:{PORT}",
        "--workers", "4",  # 4 sync workers
        "--threads", "4",  # 4 threads per worker = 16 concurrent requests
        "--timeout", "120",
        "--max-requests", "1000",  # Restart workers after 1000 requests (prevents memory leaks)
        "--max-requests-jitter", "50",
        "--log-level", "info"
    ]
    
    process = Popen(cmd)
    process.wait()


if __name__ == "__main__":
    start_django()
