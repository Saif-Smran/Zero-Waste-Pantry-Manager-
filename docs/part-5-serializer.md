# Part 5: Django REST Framework Serializer for FoodItem

## Purpose

This part documents the `FoodItemSerializer` implementation for API request/response handling in the inventory app.

## Serializer Overview

`FoodItemSerializer` is implemented using `ModelSerializer` in `inventory/serializers.py` and maps directly to the `FoodItem` model.

## Field Definitions and Rules

- `id`
  - Type: integer
  - Source: model primary key
  - Access: read-only in API responses

- `name`
  - Type: string
  - Access: writable
  - Validation rule:
    - Leading/trailing whitespace is stripped.
    - Value must not be empty after trimming.

- `quantity`
  - Type: integer
  - Access: writable
  - Validation rule:
    - Must be `>= 0`.

- `expiry_date`
  - Type: date (`YYYY-MM-DD`)
  - Access: writable
  - Validation rule:
    - Must not be earlier than today.

- `created_at`
  - Type: datetime
  - Access: read-only
  - Behavior: auto-generated when record is created.

- `updated_at`
  - Type: datetime
  - Access: read-only
  - Behavior: auto-updated when record changes.

- `days_until_expiry`
  - Type: integer
  - Access: read-only
  - Source: `SerializerMethodField`
  - Behavior: computed from model property and returned in responses.

- `is_near_expiry`
  - Type: boolean
  - Access: read-only
  - Source: `SerializerMethodField`
  - Behavior: computed from model property and returned in responses.

## Example Request Bodies

### Valid Create Request

```json
{
  "name": "  Brown Rice  ",
  "quantity": 2,
  "expiry_date": "2026-12-31"
}
```

Expected behavior:
- Request is accepted.
- `name` is normalized to `"Brown Rice"`.
- Read-only fields (`id`, timestamps, computed fields) are returned by API output, not required in input.

### Invalid Request: Past Expiry Date

```json
{
  "name": "Milk",
  "quantity": 1,
  "expiry_date": "2020-01-01"
}
```

Expected validation error:
- `expiry_date`: `"Expiry date cannot be in the past."`

### Invalid Request: Negative Quantity

```json
{
  "name": "Eggs",
  "quantity": -5,
  "expiry_date": "2026-06-10"
}
```

Expected validation error:
- `quantity`: `"Quantity cannot be negative."`

### Invalid Request: Empty Name After Trimming

```json
{
  "name": "   ",
  "quantity": 3,
  "expiry_date": "2026-06-10"
}
```

Expected validation error:
- `name`: `"Name cannot be empty."`

## Scope Note

This part covers serializer structure, output fields, and field-level validation rules only. API views, routing, and frontend integration are outside the scope of this document.
