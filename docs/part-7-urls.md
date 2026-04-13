## Purpose
This document captures URL routing for the Django backend and provides a complete API endpoint reference for the FoodItem resource.

## URL Routing Overview
- Project URL config includes the inventory API under `/api/`.
- Inventory routes are generated using DRF `DefaultRouter` with prefix `items`.
- Frontend entry page (`index.html`) is served at root path `/`.

## API Endpoints
| Method | URL | Description |
| --- | --- | --- |
| GET | `/api/items/` | List all food items (default ordering by nearest expiry; supports `?sort=name` and `?sort=quantity`). |
| POST | `/api/items/` | Create a new food item. |
| GET | `/api/items/{id}/` | Retrieve a single food item by ID. |
| PUT | `/api/items/{id}/` | Fully update an existing food item by ID. |
| PATCH | `/api/items/{id}/` | Partially update an existing food item by ID. |
| DELETE | `/api/items/{id}/` | Delete a food item by ID. |
| GET | `/api/items/near-expiry/` | List items expiring within the next 3 days (including today). |
| GET | `/api/items/summary/` | Return inventory metrics: total items, near-expiry count, and expired count. |

## Scope Notes
- Endpoint generation and trailing slash behavior follow DRF router defaults.
- Authentication and permission policies are not changed in this routing step.
