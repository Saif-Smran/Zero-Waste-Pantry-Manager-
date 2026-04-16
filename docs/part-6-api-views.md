# Part 6: API Views and Endpoints (DRF)

## Purpose
This part documents the Django REST Framework API views for FoodItem. The API is implemented with a ModelViewSet, supports full CRUD operations, optional sorting, and two custom collection endpoints for near-expiry and summary metrics.

## Base Path
- /api/items/

## Endpoint Table

| Method | Endpoint | Description | Query Params / Notes |
|---|---|---|---|
| GET | /api/items/ | List authenticated user's food items | Default sort: expiry_date ascending |
| GET | /api/items/{id}/ | Retrieve one owned food item by ID | Returns serializer fields including computed fields |
| POST | /api/items/ | Create a food item | full_clean() runs before save, owner set from session |
| PUT | /api/items/{id}/ | Fully update an owned food item | full_clean() runs before save |
| PATCH | /api/items/{id}/ | Partially update an owned food item | full_clean() runs before save |
| DELETE | /api/items/{id}/ | Delete an owned food item | Returns 204 on success |
| GET | /api/items/near-expiry/ | List owned items expiring within 3 days | Includes today through today+3 days |
| GET | /api/items/summary/ | Get owned inventory summary counters | Returns total_items, near_expiry_count, expired_count |

## Sorting Behavior (List Endpoint)
Use the optional sort query parameter on list requests:

- /api/items/?sort=name -> alphabetical by name (ascending)
- /api/items/?sort=quantity -> by quantity (ascending)
- /api/items/ -> default by expiry_date (ascending)
- Unknown sort values fall back to default expiry_date ordering.

## Ownership Scope

- All item endpoints require authentication and are filtered by `request.user`.
- Cross-user access attempts resolve as not found because non-owned rows are excluded from the queryset.

## Validation Behavior
The API applies both serializer-level and model-level validation:

- Serializer validation checks request format and field rules.
- Model validation is enforced through full_clean() during create and update.
- If expiry_date is in the past, the request returns a validation error.

## Example Summary Response

```json
{
  "total_items": 12,
  "near_expiry_count": 4,
  "expired_count": 1
}
```

## Scope Notes
This document covers API views and endpoints for FoodItem only. Authentication, pagination, and frontend integration are outside the scope of this part.
