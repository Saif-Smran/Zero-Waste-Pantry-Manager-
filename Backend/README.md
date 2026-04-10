# Zero-Waste Pantry Manager - Backend

## Description
Django backend for Zero-Waste Pantry Manager. It provides API foundations, inventory data management, and database-backed workflows for pantry tracking and waste reduction.

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
7. Run migrations:
   - cd pantry_manager
   - python manage.py migrate
8. Start server:
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
- Migrations:
  - python manage.py migrate
- Optional DB write/read check:
  - python manage.py shell -c "from inventory.models import ConnectionCheck; obj=ConnectionCheck.objects.create(name='db-check'); print(obj.id)"

## Related Documentation
- Root overview: [readme.md](../readme.md)
- Database setup details: [docs/part-2-db-setup.md](../docs/part-2-db-setup.md)

## Team Members
- A H M Saif Smran
- Md. Saikhul Hasan Saif
- Mohammed Mustavi Araf
