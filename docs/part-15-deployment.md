# Part 15: Railway Deployment Guide

## Purpose
This document defines exact steps and commands to deploy the Zero-Waste Pantry Manager Django backend on Railway.

## Prerequisites
- Railway account
- Railway CLI installed
- Backend changes committed and pushed

## Files Used for Deployment
- `Backend/Procfile`
- `Backend/runtime.txt`
- `Backend/requirements.txt`
- `Backend/pantry_manager/pantry_manager/settings.py`
- `Frontend/netlify.toml`

## Step-by-Step Deployment (Exact Commands)

### 1) Login and initialize Railway project
Run from repository root:

```bash
railway login
railway init
```

### 2) Configure service root directory
In Railway dashboard for the backend service:
- Set Root Directory to `Backend`

### 3) Add PostgreSQL
In Railway dashboard:
1. New
2. Database
3. PostgreSQL
4. Attach it to the same project

### 4) Set environment variables in Railway dashboard
Open backend service -> Variables and set:

- `SECRET_KEY=<your-django-secret-key>`
- `DEBUG=False`
- `ALLOWED_HOSTS=<your-backend-domain>,localhost,127.0.0.1`
- `PYTHONPATH=pantry_manager`
- `USE_LOCAL_SQLITE=false`
- `CORS_ALLOWED_ORIGINS=https://<your-frontend-domain>`
- `CSRF_TRUSTED_ORIGINS=https://<your-frontend-domain>`
- `SESSION_COOKIE_SAMESITE=None`
- `CSRF_COOKIE_SAMESITE=None`
- `SESSION_COOKIE_SECURE=true`
- `CSRF_COOKIE_SECURE=true`

Railway PostgreSQL automatically provides:
- `PGHOST`
- `PGPORT`
- `PGDATABASE`
- `PGUSER`
- `PGPASSWORD`

Cookie note:
- In production cross-origin HTTPS setups, `SameSite=None` must be paired with `Secure=true` for session and CSRF cookies.
- Keep `USE_LOCAL_SQLITE` disabled in Railway production (set `false` or remove the variable).

### 5) Deploy backend
Run from repository root:

```bash
railway up
```

### 6) Migrations run automatically during deploy

`Backend/Procfile` includes both release and web process types:

```txt
release: cd pantry_manager && python manage.py migrate --noinput
web: cd pantry_manager && gunicorn pantry_manager.wsgi:application --bind 0.0.0.0:$PORT
```

Railway executes `release` before `web`, so database migrations are applied automatically on each deploy.

If needed, you can still run migrations manually from repository root:

```bash
railway run python pantry_manager/manage.py migrate
```

### 7) Collect static files on Railway
Run from repository root:

```bash
railway run python pantry_manager/manage.py collectstatic --noinput
```

### 8) Create admin user (optional)

```bash
railway run python pantry_manager/manage.py createsuperuser
```

### 9) Check deployment status

```bash
railway status
```

### 10) Configure Netlify frontend deployment
In Netlify site settings:

- Base directory: `Frontend`
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL=https://<your-backend-domain>`

`Frontend/netlify.toml` provides an SPA fallback redirect to `index.html`, preventing 404 errors on client-side routes.

## Railway Build and Start Behavior
- Build dependencies from `Backend/requirements.txt`
- Runtime from `Backend/runtime.txt`
- Process commands from `Backend/Procfile`:

```txt
release: cd pantry_manager && python manage.py migrate --noinput
web: cd pantry_manager && gunicorn pantry_manager.wsgi:application --bind 0.0.0.0:$PORT
```

## Notes
- If your backend URL is `https://<your-backend-domain>`, include it in `ALLOWED_HOSTS` without protocol, for example: `api-myapp.up.railway.app`.
- Keep `DEBUG=False` in production.
- If frontend is deployed separately, update frontend API base URL to your Railway backend URL.
