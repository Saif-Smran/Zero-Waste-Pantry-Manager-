# Zero-Waste Pantry Manager

## Description
Zero-Waste Pantry Manager is a web application that helps users manage pantry inventory, monitor expiration dates, and reduce food waste with better item visibility.

## Repository Structure
- Backend: Django API and data layer
- Frontend: Client application workspace (implementation in progress)
- docs: Supporting technical documentation

## Current Tech Stack
- Backend: Python, Django, Django REST Framework
- Database: PostgreSQL (Railway)
- Config and Environment: python-decouple
- API Access: django-cors-headers

## Quick Start
1. Go to the backend directory.
2. Create and activate a virtual environment.
3. Install dependencies from Backend/requirements.txt.
4. Copy Backend/.env.example to Backend/.env.
5. Fill database and secret values in Backend/.env.
6. Run migrations.
7. Start the backend server.

## Database Notes
- The backend is configured for PostgreSQL as the main database.
- For Railway from local development, use public proxy values or a full public database URL in Backend/.env.
- Do not use Railway private hostnames from local machines.

## Documentation
- Backend setup guide: [Backend/README.md](Backend/README.md)
- Database setup notes: [docs/part-2-db-setup.md](docs/part-2-db-setup.md)

## Team Members
- A H M Saif Smran
- Md. Saikhul Hasan Saif
- Mohammed Mustavi Araf