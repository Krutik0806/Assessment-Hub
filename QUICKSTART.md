# Quick Deployment Steps for Assessment Hub

## 1. Push to GitHub

```bash
# If not already a git repository
git init

# Add all files (gitignore will exclude unnecessary ones)
git add .

# Commit
git commit -m "Initial commit"

# Create GitHub repo and push
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## 2. Deploy on Render

1. Go to https://dashboard.render.com/
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render detects `render.yaml` automatically
5. Click "Apply"

Both backend and frontend will deploy automatically.

## 3. After First Deployment

Once deployed, you'll get URLs like:
- Backend: `https://assessment-hub-backend-xxxx.onrender.com`
- Frontend: `https://assessment-hub-frontend-xxxx.onrender.com`

Now update these files with your actual URLs:

**backend/start_server.py** (Line 13):
```python
RENDER_URL = os.environ.get("RENDER_EXTERNAL_URL", "https://YOUR-BACKEND-URL.onrender.com")
```

**render.yaml** (Lines 16, 18, 26):
```yaml
ALLOWED_HOSTS: your-backend-url.onrender.com
CORS_ALLOWED_ORIGINS: https://your-frontend-url.onrender.com
VITE_API_BASE_URL: https://your-backend-url.onrender.com/api
```

Commit and push:
```bash
git add .
git commit -m "Update production URLs"
git push
```

## 4. Set Up Google OAuth

1. Go to https://console.cloud.google.com/
2. Create OAuth 2.0 Client ID
3. Add authorized origins: `https://your-frontend-url.onrender.com`
4. Copy the Client ID

Update in these files:
- **backend/quiz/views.py** (Line 20)
- **src/main.jsx** (Line 7)

Commit and push again.

## 5. Create Admin User

Go to Render dashboard → Your backend service → Shell tab:
```bash
python manage.py createsuperuser
```

Or just set ADMIN_EMAIL in `backend/quiz/views.py` to your Google email.

## 6. Load Questions

In Render Shell:
```bash
python manage.py load_questions
```

Or use the admin panel PDF upload feature.

## Done!

Visit your frontend URL and test the application.

The keep-alive system runs automatically - check backend logs to see it ping every 3 minutes.

---

For detailed troubleshooting, see DEPLOYMENT.md
