# Pantry Frontend

React frontend for Zero-Waste Pantry Manager, built with Vite.

## Stack
- Vite + React
- Tailwind CSS v4
- React Router DOM v7
- Axios
- React Icons
- clsx

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
	- Quantity display and decrement/delete actions
- `src/components/AddItemForm.jsx` - add new pantry item using item name, quantity, and expiry date.

### Auth Pages and Routing
- `src/pages/LoginPage.jsx` - username/password login screen.
- `src/pages/RegisterPage.jsx` - account creation screen.
- `src/App.jsx` protects the inventory route and redirects unauthenticated users to login.
- `src/context/AuthContext.jsx` restores session on app startup.

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

## Tailwind Configuration
- Tailwind v4 is loaded through `@import 'tailwindcss'` in `src/index.css`.
- Custom design tokens are declared with `@theme` in `src/index.css`:
	- `safe`, `warning`, `danger`
	- `pantry-bg`, `pantry-card`

## Environment Variable
- `VITE_API_URL` (example: `http://localhost:8000`)

## Auth API Endpoints Used by Frontend
- `GET /api/auth/csrf/`
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/logout/`
- `GET /api/auth/session/`

## Troubleshooting
- `npm run dev` must be run inside the `Frontend` folder.
- If you run it from backend folders, npm cannot find `package.json` and exits with ENOENT.
