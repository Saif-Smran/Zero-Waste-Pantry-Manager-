# Part 4: Django Admin Configuration for FoodItem

## Purpose

This part documents how the Django admin panel is configured for the `FoodItem` model so pantry data can be managed quickly by administrators.

## Admin Registration Summary

`FoodItem` is registered with a custom `ModelAdmin` class in `inventory/admin.py`.

Configured options:

- `list_display = ['name', 'quantity', 'expiry_date', 'days_until_expiry', 'is_near_expiry', 'created_at']`
- `list_filter = ['expiry_date']`
- `search_fields = ['name']`
- `ordering = ['expiry_date']`
- `readonly_fields = ['created_at', 'updated_at']`

## Near-Expiry Highlighting

A custom list-display method is used for `is_near_expiry` in admin:

- Displays `Yes` in red when an item is near expiry.
- Displays `No` in green when an item is not near expiry.
- Uses safe HTML rendering to visually emphasize urgent items.

This makes soon-to-expire pantry entries stand out immediately in the admin list view.

## Screenshot Placeholder

Add an admin screenshot here after running the project locally.

![Django Admin FoodItem List Placeholder](./images/part-4-admin-fooditem-placeholder.png)

Suggested screenshot content:

- FoodItem changelist page
- `Near Expiry` column showing red `Yes` values
- Expiry date filter sidebar
- Search bar with name query

## How to Use the Admin Panel

1. Run the Django app and open `/admin`.
2. Sign in with a staff or superuser account.
3. Open `Food items` under the inventory app.
4. Use the search bar to find items by name.
5. Use the expiry-date filter to narrow records.
6. Sort by expiry behavior using the default ordering (soonest first).
7. Open a record to view details; `created_at` and `updated_at` are read-only audit fields.

## Scope Note

This part covers Django admin configuration and usage only. API behavior and frontend presentation are outside the scope of this document.
