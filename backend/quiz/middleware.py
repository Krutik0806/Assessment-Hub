"""
Middleware to block automated bot requests while allowing legitimate traffic.
"""
from django.http import JsonResponse
import logging

logger = logging.getLogger(__name__)


class BlockBotsMiddleware:
    """
    Block python-requests and other bot user agents from all endpoints
    except /api/health/ (needed for Render keep-alive).
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        self.blocked_agents = [
            'python-requests',
            'python-urllib',
            'aiohttp',
            'httpx',
            'urllib3',
            'curl',
            'wget',
            'scrapy',
            'bot',
            'crawler',
            'spider',
            'python/',  # Catches "Python/3.13" etc
            'go-http-client',
            'java',
            'rust-',
            'node-fetch',
            'axios',
        ]
    
    def __call__(self, request):
        user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
        path = request.path
        
        # Check if user agent is a bot
        is_bot = any(agent in user_agent for agent in self.blocked_agents)
        
        if is_bot:
            # Allow python-requests ONLY for health check endpoint
            if path == '/api/health/':
                return self.get_response(request)
            
            # Log blocked bot attempt
            logger.warning(f'🛑 Blocked bot request: {user_agent[:100]} → {path}')
            
            # Block all other bot requests
            return JsonResponse({
                'error': 'Automated requests are not allowed. Please use a web browser.',
                'blocked': True
            }, status=403)
        
        # Allow all legitimate browser traffic
        return self.get_response(request)
