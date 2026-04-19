# Zero-Waste Pantry Manager - Backend

## Description
Django backend for Zero-Waste Pantry Manager. It provides API foundations, inventory data management, and database-backed workflows for pantry tracking and waste reduction.

## Inventory Domain Status

The inventory app currently includes:

- ConnectionCheck model for basic database connectivity checks.
- FoodItem model for pantry item tracking.
- FoodItem DRF serializer for API payload validation and response shaping.
- FoodItem DRF ModelViewSet with full CRUD and custom inventory actions.

FoodItem schema and rules:

- id: AutoField primary key
- user: ForeignKey to authenticated owner (required)
- name: CharField(max_length=255), required
- quantity: PositiveIntegerField, required (>= 0)
- expiry_date: DateField, required
- created_at: DateTimeField(auto_now_add=True)
- updated_at: DateTimeField(auto_now=True)
- Validation: expiry_date cannot be in the past (clean method)
- Computed properties: days_until_expiry, is_near_expiry
- Default ordering: expiry_date ascending

FoodItem Django Admin configuration:

- Registered with a custom ModelAdmin.
- list_display: name, user, quantity, expiry_date, days_until_expiry, is_near_expiry, created_at.
- list_filter: expiry_date, user.
- search_fields: name, user__username.
- ordering: expiry_date ascending.
- readonly_fields: created_at, updated_at.
- Near-expiry column is rendered with HTML color highlighting for fast visual identification.

FoodItem API endpoints:

- Base path: /api/items/
- Full CRUD available through DRF ModelViewSet.
- All item endpoints are scoped to the authenticated user owner.
- Sorting options:
   - /api/items/?sort=name
   - /api/items/?sort=quantity
   - /api/items/ (default sort by expiry_date ascending)
- Custom actions:
   - /api/items/near-expiry/ (GET): returns items expiring in the next 3 days (including today)
   - /api/items/summary/ (GET): returns total_items, near_expiry_count, expired_count
- Authentication endpoints:
   - /api/auth/csrf/ (GET): sets CSRF cookie for frontend session requests
   - /api/auth/register/ (POST): creates user and starts authenticated session
   - /api/auth/login/ (POST): authenticates user and starts session
   - /api/auth/logout/ (POST): ends authenticated session
   - /api/auth/session/ (GET): returns current authenticated user session state
- Model-level validation is enforced during create and update via full_clean().
- New items are always created with `request.user` as the owner.
- Security defaults:
   - CSRF middleware is active.
   - DRF defaults require authentication for API access.
   - Queryset-level ownership filtering prevents cross-user item access.
   - A custom exception handler returns consistent error JSON.
   - Security headers include XSS filter, frame deny, and no-sniff.

## Tech Stack
- Python
- Django
- Django REST Framework
- PostgreSQL with psycopg2-binary
- django-cors-headers
- python-decouple

## Local Setup
1. Open terminal at Backend.
2. Create virtual environment:
   - python -m venv .venv
3. Activate virtual environment on PowerShell:
   - .\.venv\Scripts\Activate.ps1
4. Install dependencies:
   - pip install -r requirements.txt
5. Copy environment template:
   - copy .env.example .env
6. Update Backend/.env with real values.
7. Create migrations:
   - cd pantry_manager
   - python manage.py makemigrations
8. Apply migrations:
   - python manage.py migrate
9. Start server:
   - python manage.py runserver

## Required Environment Variables
Set these in Backend/.env:

- SECRET_KEY
- DEBUG
- ALLOWED_HOSTS
- DATABASE_PUBLIC_URL (recommended for Railway public connection)
- DATABASE_URL (optional private/internal URL)
- RAILWAY_TCP_PROXY_DOMAIN
- RAILWAY_TCP_PROXY_PORT
- DB_NAME
- DB_USER
- DB_PASSWORD
- DB_HOST
- DB_PORT
- DB_SSLMODE
- DB_CONNECT_TIMEOUT
- DB_CONN_MAX_AGE (optional, default 600 for PostgreSQL connection reuse)
- DB_CONN_HEALTH_CHECKS (optional, default true)
- USE_LOCAL_SQLITE (optional, set true for faster local development profile)
- TIME_ZONE (optional, overrides OS-detected local timezone)
- CORS_ALLOWED_ORIGINS (optional, defaults include local Vite origins)
- CSRF_TRUSTED_ORIGINS (optional, defaults include local Vite origins)
- SESSION_COOKIE_SAMESITE (optional, local default `Lax`)
- CSRF_COOKIE_SAMESITE (optional, local default `Lax`)
- SESSION_COOKIE_SECURE (optional, local default `false`)
- CSRF_COOKIE_SECURE (optional, local default `false`)

Cookie profile examples:

- Local same-site profile:
   - `SESSION_COOKIE_SAMESITE=Lax`
   - `CSRF_COOKIE_SAMESITE=Lax`
   - `SESSION_COOKIE_SECURE=false`
   - `CSRF_COOKIE_SECURE=false`
- Production cross-origin HTTPS profile:
   - `SESSION_COOKIE_SAMESITE=None`
   - `CSRF_COOKIE_SAMESITE=None`
   - `SESSION_COOKIE_SECURE=true`
   - `CSRF_COOKIE_SECURE=true`

Production note:
- On Railway, set variables in Shared Variables. The app reads process environment directly when `Backend/.env` is not present.
- Keep `Backend/.env` for local development only.
- If a local frontend (`http://localhost:5173`) is allowed to call Railway during testing, include those localhost origins in both `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS`.



Local performance note:
- When `USE_LOCAL_SQLITE=true`, Django uses local SQLite for faster local auth/API iteration.
- Keep `USE_LOCAL_SQLITE=false` (or unset) for PostgreSQL-compatible validation.

## Railway PostgreSQL Guidance
- For local development, use Railway public proxy host and port, or DATABASE_PUBLIC_URL.
- Railway private hostname values are not reachable from local machines.
- If needed, use Railway CLI to verify and sync variables:
  - railway login
  - railway link
  - railway variables --json

## Validation Commands
- Django system checks:
  - python manage.py check
- Admin access setup (first-time local use):
   - python manage.py createsuperuser
- Admin credential local record:
   - store local admin login details in ../.md.local only
   - do not commit ../.md.local
- Run server and open admin:
   - python manage.py runserver
   - visit /admin and open Food items under inventory
- Create migrations after model changes:
   - python manage.py makemigrations
- Migrations:
  - python manage.py migrate
- Optional DB write/read check:
  - python manage.py shell -c "from inventory.models import ConnectionCheck; obj=ConnectionCheck.objects.create(name='db-check'); print(obj.id)"

## Related Documentation
- Root overview: [readme.md](../readme.md)
- Database setup details: [docs/part-2-db-setup.md](../docs/part-2-db-setup.md)
- Model specification and 3NF notes: [docs/part-3-model.md](../docs/part-3-model.md)
- Admin configuration and usage: [docs/part-4-admin.md](../docs/part-4-admin.md)
- Serializer fields and validation: [docs/part-5-serializer.md](../docs/part-5-serializer.md)
- API views and endpoints: [docs/part-6-api-views.md](../docs/part-6-api-views.md)
- URL routing and endpoint map: [docs/part-7-urls.md](../docs/part-7-urls.md)
- Security implementation and SRS mapping: [docs/part-8-security.md](../docs/part-8-security.md)

## Team Members
- A H M Saif Smran
- Md. Saikhul Hasan Saif
- Mohammed Mustavi Araf
