# Zero-Waste Pantry Manager - Backend

## Project Name
Zero-Waste Pantry Manager (Backend)

## Description
The backend for the Zero-Waste Pantry Manager web application built with Django and Django REST Framework. It manages pantry inventory data and provides API foundations for tracking items, reducing food waste, and supporting expiration-aware workflows.

## Tech Stack
- Python
- Django
- Django REST Framework
- PostgreSQL driver (psycopg2-binary)
- django-cors-headers
- python-decouple

## Setup Instructions
1. Navigate to the backend folder:
   - cd Backend
2. Create a virtual environment:
   - python -m venv .venv
3. Activate the virtual environment:
   - Windows (PowerShell): .\\.venv\\Scripts\\Activate.ps1
4. Install dependencies:
   - pip install -r requirements.txt
5. Copy environment template:
   - copy .env.example .env
6. Navigate to the Django project folder:
   - cd pantry_manager
7. Run migrations:
   - python manage.py migrate
8. Start the development server:
   - python manage.py runserver

## Team Members
- Add team member names here
