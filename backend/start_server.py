"""
Startup script for Render.com deployment.
Runs Django app with Gunicorn and starts keep-alive ping service.
"""

import os
import sys
import threading
import time
import requests
from subprocess import Popen

# Configuration
RENDER_URL = os.environ.get("RENDER_EXTERNAL_URL", "https://assessment-hub-backend.onrender.com")
PORT = os.environ.get("PORT", "8080")


def ping_server():
    """Background thread to ping the server every 3 minutes."""
    print("🔄 Keep-alive service started")
    time.sleep(60)  # Wait 1 minute before starting
    
    while True:
        try:
            response = requests.get(f"{RENDER_URL}/api/health/", timeout=10)
            if response.status_code == 200:
                print("✅ Keep-alive ping successful")
            else:
                print(f"⚠️ Keep-alive ping returned status: {response.status_code}")
        except Exception as e:
            print(f"❌ Keep-alive ping failed: {e}")
        
        # Sleep for 3 minutes (180 seconds)
        time.sleep(180)


def start_django():
    """Start Django with Gunicorn."""
    print(f"🚀 Starting Django on port {PORT}")
    
    # Start ping service in background thread
    ping_thread = threading.Thread(target=ping_server, daemon=True)
    ping_thread.start()
    
    # Start Gunicorn
    cmd = [
        "gunicorn",
        "csa_backend.wsgi:application",
        "--bind", f"0.0.0.0:{PORT}",
        "--workers", "2",
        "--timeout", "120",
        "--log-level", "info"
    ]
    
    process = Popen(cmd)
    process.wait()


if __name__ == "__main__":
    start_django()
