# Deployment Checklist for Assessment Hub on Render.com

## Before You Deploy

### 1. Update Google OAuth Client ID

**In backend/quiz/views.py (Line 20):**
```python
GOOGLE_CLIENT_ID = 'your-actual-client-id.apps.googleusercontent.com'
```

**In src/components/AuthPage.jsx:**
Search for `clientId` and update it with your Google OAuth Client ID.

### 2. Set Admin Email

**In backend/quiz/views.py (Line 21):**
```python
ADMIN_EMAIL = 'your-email@example.com'
```

### 3. Commit and Push to GitHub

```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

## Deployment Steps

### Step 1: Create Render Account

1. Go to https://render.com/
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 2: Deploy via Blueprint

1. Click "New +" button
2. Select "Blueprint"
3. Connect your GitHub repository
4. Render will detect `render.yaml`
5. Click "Apply"

Both services (backend and frontend) will be created automatically.

### Step 3: Wait for Initial Deploy

- Backend build takes 3-5 minutes
- Frontend build takes 2-3 minutes
- Check logs if any service fails

### Step 4: Get Your URLs

After deployment, you'll have:
- Backend: `https://csa-backend-xxxx.onrender.com`
- Frontend: `https://csa-frontend-xxxx.onrender.com`

### Step 5: Update Configuration with Actual URLs

**In backend/start_server.py (Line 13):**
```python
RENDER_URL = os.environ.get("RENDER_EXTERNAL_URL", "https://your-actual-backend-url.onrender.com")
```

**In render.yaml:**

Update line 16:
```yaml
value: your-actual-backend-url.onrender.com
```

Update line 18:
```yaml
value: https://your-actual-frontend-url.onrender.com
```

Update line 26:
```yaml
value: https://your-actual-backend-url.onrender.com/api
```

**Commit and push these changes:**
```bash
git add .
git commit -m "Update production URLs"
git push
```

Render will automatically redeploy.

### Step 6: Configure Google OAuth

1. Go to https://console.cloud.google.com/
2. Select your project or create new one
3. Go to "Credentials"
4. Create OAuth 2.0 Client ID (Web application)
5. Add Authorized JavaScript origins:
   - `https://your-actual-frontend-url.onrender.com`
6. Add Authorized redirect URIs:
   - `https://your-actual-frontend-url.onrender.com`
7. Copy the Client ID
8. Update it in both files mentioned in "Before You Deploy" section
9. Commit and push

### Step 7: Set Up Admin User

**Option A - Via Admin Panel (Recommended):**
1. Visit `https://your-backend-url.onrender.com/admin/`
2. It will show an error (no superuser yet)
3. You'll need to run the command manually

**Option B - Via Render Shell:**
1. Go to your backend service on Render
2. Click "Shell" tab
3. Run:
   ```bash
   python manage.py createsuperuser
   ```
4. Follow prompts to create admin account

**Option C - Set Admin Email:**
Just set ADMIN_EMAIL in views.py to your Google account email, then log in via Google OAuth.

### Step 8: Load Questions

Via Render Shell:
```bash
python manage.py load_questions
```

Or use the admin panel PDF upload feature.

## Verify Deployment

1. Visit your frontend URL
2. Try logging in with Google
3. Check if tests are visible
4. Submit a test attempt
5. Check leaderboard
6. Log in with admin account and verify admin panel access

## Keep-Alive System

The keep-alive system is already configured:
- Pings `/api/health/` every 3 minutes
- Prevents Render free tier shutdown
- Starts automatically with the server
- Check logs to see ping status

## Troubleshooting

### Backend Won't Start
- Check build logs for errors
- Verify all requirements are in requirements.txt
- Check environment variables

### Frontend Shows API Errors
- Verify VITE_API_BASE_URL is correct
- Check CORS settings in backend
- Ensure backend is running

### Google OAuth Fails
- Verify Client ID is correct
- Check authorized origins and redirect URIs
- Ensure frontend URL matches exactly

### Database Issues
- Check if migrations ran during build
- Run migrations manually via Shell if needed
- Verify db.sqlite3 is created

## Post-Deployment Tasks

1. Test all features thoroughly
2. Monitor the first few hours for errors
3. Check backend logs for keep-alive pings
4. Set up custom domain (optional)
5. Enable HTTPS (Render does this automatically)

## Updating After Deployment

Every code change:
```bash
git add .
git commit -m "Your message"
git push
```

Render automatically redeploys on push to main branch.

## Free Tier Limitations

- Backend may sleep after inactivity (prevented by keep-alive)
- 750 hours/month free (one service = 24/7)
- Database persists between deploys
- Static site hosting is unlimited

## Need Help?

- Check Render logs (click on service > Logs)
- Review Django errors in backend logs
- Check browser console for frontend errors
- Verify all URLs are updated correctly
