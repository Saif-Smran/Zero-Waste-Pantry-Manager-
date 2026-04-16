# Part 3: FoodItem Model Design

## Model Purpose

The FoodItem model represents inventory entries in the Zero-Waste Pantry Manager. Each row stores one pantry item with quantity and expiration metadata used for freshness tracking.

## Django Model Definition

```python
class FoodItem(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='food_items')
    name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    expiry_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

## Fields and Constraints

- id: AutoField, primary key, unique and auto-incremented.
- user: ForeignKey(User), required owner reference for per-account inventory isolation.
- name: CharField(max_length=255), required (NOT NULL).
- quantity: PositiveIntegerField, required (NOT NULL), constrained to values >= 0 by field type validation.
- expiry_date: DateField, required (NOT NULL).
- created_at: DateTimeField(auto_now_add=True), automatically set once at record creation.
- updated_at: DateTimeField(auto_now=True), automatically updated on every save.

## Business Rules and Derived Properties

The model includes application-level rules for freshness handling:

- clean(): Raises ValidationError if expiry_date is earlier than the current local date.
- days_until_expiry: Returns integer days between expiry_date and today.
- is_near_expiry: Returns True when days_until_expiry <= 3.

These rules support proactive waste reduction by identifying items that need urgent use.

## Ordering and Representation

- Meta ordering: ['expiry_date'] so soonest-expiring items appear first by default.
- __str__: Human-readable text including item name and quantity.

## Ownership and Data Isolation

Each FoodItem belongs to exactly one authenticated user through the `user` foreign key.
This relationship is the basis for API-level data isolation: users can only list, retrieve,
update, and delete their own inventory entries.

## Normalization Compliance (3NF)

The FoodItem table satisfies Third Normal Form (3NF):

- 1NF: All attributes are atomic (single value per column), no repeating groups.
- 2NF: The primary key is a single-column key (id), and every non-key column fully depends on that key.
- 3NF: No transitive dependencies among non-key attributes. For example, name, quantity, and expiry_date describe only the FoodItem identified by id, and timestamp fields depend directly on row identity/lifecycle.

Because derived values (days_until_expiry and is_near_expiry) are computed properties and not stored columns, redundancy is minimized and update anomalies are reduced.

## Scope Note

This part defines model schema and model-level validation/computed logic only. API serializers, views, endpoints, and UI behavior are documented in later parts.
