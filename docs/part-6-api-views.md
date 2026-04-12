# Part 6: API Views and Endpoints (DRF)

## Purpose
This part documents the Django REST Framework API views for FoodItem. The API is implemented with a ModelViewSet, supports full CRUD operations, optional sorting, and two custom collection endpoints for near-expiry and summary metrics.

## Base Path
- /api/food-items/

## Endpoint Table

| Method | Endpoint | Description | Query Params / Notes |
|---|---|---|---|
| GET | /api/food-items/ | List all food items | Default sort: expiry_date ascending |
| GET | /api/food-items/{id}/ | Retrieve one food item by ID | Returns serializer fields including computed fields |
| POST | /api/food-items/ | Create a food item | full_clean() runs before save |
| PUT | /api/food-items/{id}/ | Fully update a food item | full_clean() runs before save |
| PATCH | /api/food-items/{id}/ | Partially update a food item | full_clean() runs before save |
| DELETE | /api/food-items/{id}/ | Delete a food item | Returns 204 on success |
| GET | /api/food-items/near-expiry/ | List items expiring within 3 days | Includes today through today+3 days |
| GET | /api/food-items/summary/ | Get inventory summary counters | Returns total_items, near_expiry_count, expired_count |

## Sorting Behavior (List Endpoint)
Use the optional sort query parameter on list requests:

- /api/food-items/?sort=name -> alphabetical by name (ascending)
- /api/food-items/?sort=quantity -> by quantity (ascending)
- /api/food-items/ -> default by expiry_date (ascending)
- Unknown sort values fall back to default expiry_date ordering.

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
