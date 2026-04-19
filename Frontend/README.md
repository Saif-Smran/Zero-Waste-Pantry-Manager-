# Pantry Frontend

React frontend for Zero-Waste Pantry Manager, built with Vite.

## Stack
- Vite + React
- Tailwind CSS v4
- React Router DOM v7
- Axios
- React Icons
- clsx
- react-hot-toast

## Inventory List View

The inventory list page is implemented in `src/pages/InventoryPage.jsx` and composed from reusable hooks and UI components.

### Hooks
- `src/hooks/useInventory.js`
	- Fetches inventory from `GET /api/items/?sort=<sortParam>` on mount and when sort changes.
	- Exposes `{ items, loading, error, refetch }`.
- `src/hooks/useSummary.js`
	- Fetches summary metrics from `GET /api/items/summary/`.
	- Exposes `{ summary, loading }` where summary includes:
		- `total_items`
		- `near_expiry_count`
		- `expired_count`
- `src/hooks/useAuth.js`
	- Exposes session auth state and actions through context-backed hook.
	- Supports `login`, `register`, `logout`, and session refresh.

### Components
- `src/components/SummaryBar.jsx` - top stats strip for total/expiring/expired counts.
- `src/components/SortControls.jsx` - sort selector for expiry, name, and quantity.
- `src/components/ItemCard.jsx` - inventory item card with:
	- Expiry-based left border and status color
	- `EXPIRED` badge for expired items
	- Quantity display and decrement action button (`-`) that disables at quantity 0
	- Delete action with confirmation prompt before removal
	- Toast feedback after decrement and delete actions
- `src/components/AddItemForm.jsx` - add new pantry item using item name, quantity, and expiry date.
	- Card layout: `bg-white rounded-xl shadow-sm p-6 mb-6`
	- Form layout: `grid grid-cols-1 sm:grid-cols-3 gap-4 items-end`
	- Inline validation errors per field (name, quantity, expiry_date)
	- Client-side validation:
		- Name is required
		- Quantity must be a positive integer
		- Expiry date cannot be in the past
	- Submit state disables Clear/Add buttons and shows `Adding...`
	- On `201 Created`, triggers parent `onSuccess` callback (inventory refetch), then resets form
	- On `400`, maps API field errors to inline field errors
	- Uses `react-hot-toast` for success/general error feedback
- `src/components/HelpModal.jsx` - overlay modal with:
	- Sorting explanation
	- Expiry color legend:
		- Green: More than 7 days remaining
		- Orange: Expiring within 7 days
		- Red: Expiring within 3 days or already expired
	- Step-by-step add-item instructions
	- Delete behavior explanation
	- Close interactions:
		- Escape key closes modal
		- Overlay click closes modal
		- Close button (top-right) closes modal
	- Scrollable content area for smaller screens (`max-h-[80vh] overflow-y-auto`)

### Auth Pages and Routing
- `src/pages/LoginPage.jsx` - username/password login screen.
- `src/pages/RegisterPage.jsx` - account creation screen.
- `src/App.jsx` protects the inventory route and redirects unauthenticated users to login.
- `src/App.jsx` includes an authenticated navbar Help button and renders the Help modal.
- `src/context/AuthContext.jsx` restores session on app startup.
- `src/main.jsx` includes the global `Toaster` host (bottom-right) for toast notifications.

### Sort Values
- By Expiry -> `expiry`
- By Name -> `name`
- By Quantity -> `quantity`

## Setup
1. Open a terminal in this folder.
2. Install dependencies:

```bash
npm install
```

3. Create local environment file from the example:

```bash
cp .env.example .env
```

For Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

4. Start development server:

```bash
npm run dev
```

## Scripts
- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## Netlify Deployment
- Base directory: `Frontend`
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL=https://<your-backend-domain>`

This repo includes `netlify.toml` with an SPA fallback redirect (`/* -> /index.html`) so direct page loads and refreshes on routes like `/login` and `/register` work correctly.

## Tailwind Configuration
- Tailwind v4 is loaded through `@import 'tailwindcss'` in `src/index.css`.
- Custom design tokens are declared with `@theme` in `src/index.css`:
	- `safe`, `warning`, `danger`
	- `pantry-bg`, `pantry-card`

## Environment Variable
- `VITE_API_URL` (optional in local dev, required when deployed frontend and backend are on different origins)
- `VITE_DEV_PROXY_TARGET` (local dev only, sets Vite /api proxy target)

API resolution behavior:
- Local development defaults to same-origin `/api` requests and uses Vite proxy to `VITE_DEV_PROXY_TARGET` (fallback `http://localhost:8000`).
- Production uses `VITE_API_URL` when set.
- If `VITE_API_URL` is not set, requests use same-origin `/api`.

Recommended profiles:

- Local proxy to local backend profile:
	- `VITE_API_URL=`
	- `VITE_DEV_PROXY_TARGET=http://localhost:8000`
- Local proxy to Railway backend profile:
	- `VITE_API_URL=`
	- `VITE_DEV_PROXY_TARGET=https://<your-backend-domain>`
- Local direct backend profile (cross-origin):
	- `VITE_API_URL=http://localhost:8000`
- Production profile (deployed frontend):
	- `VITE_API_URL=https://<your-backend-domain>`

Important:
- When running frontend on `localhost`, prefer proxy mode (`VITE_API_URL=` and `VITE_DEV_PROXY_TARGET=...`) even for Railway backends. It keeps requests same-origin in the browser and avoids third-party cookie restrictions that can cause CSRF/login failures.
- Avoid pointing local frontend to production backend unless production CORS/CSRF origins and secure cookie settings are configured for that local origin.
- A local-to-production origin mismatch can appear as immediate post-login session loss.

## Auth API Endpoints Used by Frontend
- `GET /api/auth/csrf/`
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/logout/`
- `GET /api/auth/session/`

## Troubleshooting
- `npm run dev` must be run inside the `Frontend` folder.
- If you run it from backend folders, npm cannot find `package.json` and exits with ENOENT.
- If toasts do not appear, ensure `react-hot-toast` is installed and that `src/main.jsx` renders `<Toaster position="bottom-right" />`.
