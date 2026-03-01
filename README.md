# Assessment Hub

A web-based quiz and assessment platform with exam proctoring, leaderboards, and admin management.

## Features

- Multiple choice quiz system with practice and exam modes
- Google OAuth authentication
- Real-time exam proctoring with violation tracking
- Leaderboard and performance analytics
- Admin panel for test management and user monitoring
- PDF import for question generation
- Timed exams with automatic submission

## Tech Stack

**Frontend:** React, Vite, Framer Motion, Lucide Icons  
**Backend:** Django, Django REST Framework, SQLite  
**Authentication:** Google OAuth 2.0, JWT

## Local Development

### Prerequisites

- Python 3.10+
- Node.js 18+
- pip and npm

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The backend runs on `http://localhost:8000`

### Frontend Setup

```bash
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`

### Loading Questions

```bash
cd backend
python manage.py load_questions
```

## Deployment on Render

This project is configured for deployment on Render.com with automatic keep-alive to prevent free tier shutdowns.

### Prerequisites

1. GitHub account
2. Render.com account
3. Google OAuth credentials

### Step 1: Prepare Repository

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Update Configuration

Before deploying, update these values:

1. **backend/start_server.py** - Line 13: Set your Render backend URL
2. **render.yaml** - Line 16: Update ALLOWED_HOSTS with your backend URL
3. **render.yaml** - Line 18: Update CORS_ALLOWED_ORIGINS with your frontend URL
4. **render.yaml** - Line 26: Update VITE_API_BASE_URL with your backend URL

### Step 3: Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" > "Blueprint"
3. Connect your GitHub repository
4. Render will detect the `render.yaml` and create both services
5. Set environment variables if needed (SECRET_KEY is auto-generated)
6. Click "Apply" to start deployment

### Step 4: Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized JavaScript origins:
   - `https://your-frontend.onrender.com`
4. Add authorized redirect URIs:
   - `https://your-frontend.onrender.com`
5. Update the client ID in `backend/quiz/views.py` (line 20)
6. Update the client ID in `src/components/AuthPage.jsx`

### Step 5: Post-Deployment

After deployment completes:

1. Visit your backend URL to verify it's running
2. The keep-alive system automatically prevents shutdown
3. Create an admin account via Django admin or management command
4. Load questions using the admin panel

## Admin Access

Set the admin email in `backend/quiz/views.py`:

```python
ADMIN_EMAIL = 'your-email@example.com'
```

Users with this email or Django staff status get admin privileges.

## Project Structure

```
├── backend/
│   ├── csa_backend/          # Django project settings (backend config)
│   ├── quiz/                 # Main app with models, views, serializers
│   ├── manage.py
│   ├── requirements.txt
│   └── start_server.py       # Render startup script with keep-alive
├── src/
│   ├── components/           # React components
│   ├── api.js               # API client
│   └── main.jsx
├── render.yaml              # Render deployment config
└── package.json

```

## API Endpoints

- `POST /api/auth/google/` - Google OAuth login
- `GET /api/packages/` - List question packages
- `GET /api/tests/` - List available tests
- `POST /api/attempts/submit/` - Submit test attempt
- `GET /api/tests/<slug>/leaderboard/` - View leaderboard
- `GET /api/health/` - Health check (for keep-alive)

Admin endpoints require authentication and admin privileges.

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

MIT
