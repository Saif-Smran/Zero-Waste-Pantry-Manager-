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
- Frontend inventory list view implemented with reusable hooks and Tailwind UI components.
- Frontend supports sorting inventory by expiry, name, and quantity.
- Frontend item cards include expiry-status color coding and expired badge labeling.
- Session-based authentication is implemented (register, login, logout, session check).
- Inventory routes are protected in frontend and require authenticated session.
- Frontend includes add-item form for creating inventory items from the UI with inline field validation.
- Add-item form now validates client-side before submit:
  - Item name is required.
  - Quantity must be a positive integer.
  - Expiry date cannot be in the past.
- Add-item submission disables Clear/Add buttons and shows `Adding...` while request is in progress.
- On successful create (201), frontend refetches inventory and resets the form.
- react-hot-toast is integrated in frontend for immediate success/error feedback.
- Security hardening added in backend settings and API error handling:
  - Active CSRF middleware.
  - DRF default authentication and permission classes (authenticated-only by default).
  - Security headers for XSS, clickjacking, and content-type sniff protection.
  - Consistent JSON error format for API failures.
  - Serializer input length validation for item name.

## Repository Structure
- Backend: Django API and data layer
- Frontend: React client with auth pages and inventory management UI
- docs: Supporting technical documentation

## Current Tech Stack
- Backend: Python, Django, Django REST Framework
- Database: PostgreSQL (Railway)
- Config and Environment: python-decouple
- API Access: django-cors-headers
- Frontend: Vite + React, Tailwind CSS v4, React Router DOM v7, Axios, React Icons, clsx, react-hot-toast

## Frontend Architecture
- `src/pages/InventoryPage.jsx` composes the inventory list experience.
- `src/pages/LoginPage.jsx` and `src/pages/RegisterPage.jsx` provide auth flows.
- `src/hooks/useInventory.js` handles item list fetching, sorting, loading/error state, and refetch.
- `src/hooks/useSummary.js` handles summary metrics fetching.
- `src/hooks/useAuth.js` and `src/context/AuthContext.jsx` manage session state.
- `src/components/AddItemForm.jsx`, `src/components/SummaryBar.jsx`, `src/components/SortControls.jsx`, and `src/components/ItemCard.jsx` provide reusable inventory UI building blocks.

## Quick Start
1. Go to the backend directory.
2. Create and activate a virtual environment.
3. Install dependencies from Backend/requirements.txt.
4. Copy Backend/.env.example to Backend/.env.
5. Fill database and secret values in Backend/.env.
6. Create and apply migrations.
7. Start the backend server.

## Frontend Setup
1. Go to the frontend directory.
2. Install dependencies.
3. Copy `.env.example` to `.env`.
4. Set `VITE_API_URL` in `.env`.
5. Start the frontend development server from the `Frontend` folder.

```bash
cd Frontend
npm install
cp .env.example .env
npm run dev
```

For Windows PowerShell:

```powershell
Set-Location Frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Frontend stack includes Vite + React, Tailwind CSS v4, React Router DOM v7, Axios, and React Icons.

## Authentication Flow
- Register: create account from frontend register page.
- Login: authenticate with username and password.
- Session check: frontend restores session state on page load.
- Logout: clears session and redirects protected routes to login.
- API access: inventory endpoints require authenticated session.

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
- Frontend setup guide: [Frontend/README.md](Frontend/README.md)
- Database setup notes: [docs/part-2-db-setup.md](docs/part-2-db-setup.md)
- Model design and normalization notes: [docs/part-3-model.md](docs/part-3-model.md)
- Admin configuration and usage notes: [docs/part-4-admin.md](docs/part-4-admin.md)
- Serializer fields and validation notes: [docs/part-5-serializer.md](docs/part-5-serializer.md)
- API views and endpoints: [docs/part-6-api-views.md](docs/part-6-api-views.md)
- URL routing and endpoint map: [docs/part-7-urls.md](docs/part-7-urls.md)
- Security implementation and SRS mapping: [docs/part-8-security.md](docs/part-8-security.md)

## Security Notes
- API endpoints now require authenticated access by default.
- Local admin credentials are stored in .md.local for this machine only.
- .md.local is gitignored and must never be committed.

## Team Members
- A H M Saif Smran
- Md. Saikhul Hasan Saif
- Mohammed Mustavi Araf