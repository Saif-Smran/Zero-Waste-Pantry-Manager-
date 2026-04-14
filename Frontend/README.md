# Pantry Frontend

React frontend for Zero-Waste Pantry Manager, built with Vite.

## Stack
- Vite + React
- Tailwind CSS v4
- React Router DOM v7
- Axios
- React Icons

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
