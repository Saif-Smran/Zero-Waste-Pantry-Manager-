# Zero-Waste Pantry Manager

## Description
Zero-Waste Pantry Manager is a web application that helps users manage pantry inventory, monitor expiration dates, and reduce food waste with better item visibility.

## Current Implementation Status
- Core inventory model implemented: FoodItem (name, quantity, expiry date, created/updated timestamps).
- Model-level validation prevents saving items with past expiry dates.
- Expiry helper properties support near-expiry workflows.
- Default inventory ordering is by nearest expiry date.
- Django Admin configured for FoodItem with search, filter, ordering, and near-expiry visual highlighting.
- DRF FoodItem serializer implemented with computed output fields and request validation.
- DRF FoodItem API views implemented using ModelViewSet with full CRUD.
- API supports dynamic sorting by name and quantity, with default expiry-date sorting.
- Custom API actions available for near-expiry items and inventory summary metrics.

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
6. Create and apply migrations.
7. Start the backend server.

## Inventory Data Model

The backend currently includes a FoodItem model with the following behavior:

- Required fields: id, name, quantity, expiry_date, created_at, updated_at.
- Validation rule: expiry_date must not be earlier than today.
- Computed properties:
  - days_until_expiry: integer days left until expiration.
  - is_near_expiry: true when an item expires in 3 days or less.
- Default ordering: soonest expiry first.

## Django Admin

FoodItem is available in Django Admin with operational inventory tooling:

- Changelist columns: name, quantity, expiry date, days until expiry, near-expiry status, created timestamp.
- Filter: by expiry date.
- Search: by item name.
- Ordering: earliest expiry date first.
- Read-only audit fields: created_at, updated_at.
- Near-expiry visualization: red highlighted values for items close to expiry.

## Database Notes
- The backend is configured for PostgreSQL as the main database.
- For Railway from local development, use public proxy values or a full public database URL in Backend/.env.
- Do not use Railway private hostnames from local machines.

## Documentation
- Backend setup guide: [Backend/README.md](Backend/README.md)
- Database setup notes: [docs/part-2-db-setup.md](docs/part-2-db-setup.md)
- Model design and normalization notes: [docs/part-3-model.md](docs/part-3-model.md)
- Admin configuration and usage notes: [docs/part-4-admin.md](docs/part-4-admin.md)
- Serializer fields and validation notes: [docs/part-5-serializer.md](docs/part-5-serializer.md)
- API views and endpoints: [docs/part-6-api-views.md](docs/part-6-api-views.md)
- URL routing and endpoint map: [docs/part-7-urls.md](docs/part-7-urls.md)

## Team Members
- A H M Saif Smran
- Md. Saikhul Hasan Saif
- Mohammed Mustavi Araf