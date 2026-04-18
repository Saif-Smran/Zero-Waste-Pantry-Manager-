# Part 13: Inventory API Unit Tests

## Overview
This document summarizes automated Django unit tests for the inventory API using Django TestCase and DRF APIClient.

## Test Case Matrix

| Test Class | Test Method | Endpoint and Method | What It Tests | Expected Outcome |
|---|---|---|---|---|
| TestFoodItemCreate | test_post_valid_item_returns_201 | POST /api/items/ | Create a valid item payload | 201 Created, one item saved |
| TestFoodItemCreate | test_post_with_past_expiry_returns_400 | POST /api/items/ | Reject expiry date in the past | 400 Bad Request |
| TestFoodItemCreate | test_post_with_negative_quantity_returns_400 | POST /api/items/ | Reject negative quantity | 400 Bad Request |
| TestFoodItemCreate | test_post_with_empty_name_returns_400 | POST /api/items/ | Reject empty or whitespace name | 400 Bad Request |
| TestFoodItemList | test_get_returns_200 | GET /api/items/ | List endpoint availability for authenticated user | 200 OK |
| TestFoodItemList | test_items_sorted_by_expiry_date_ascending | GET /api/items/ | Default ordering by expiry_date ascending | Items returned in nearest-expiry-first order |
| TestFoodItemList | test_sort_name_returns_alphabetical_order | GET /api/items/?sort=name | Name sort behavior | Items returned A-Z by name |
| TestFoodItemUpdate | test_patch_quantity_decrement_works | PATCH /api/items/{id}/ | Partial quantity update with lower value | 200 OK, quantity updated in DB |
| TestFoodItemUpdate | test_patch_quantity_to_negative_returns_400 | PATCH /api/items/{id}/ | Reject negative quantity in partial update | 400 Bad Request, DB quantity unchanged |
| TestFoodItemDelete | test_delete_returns_204_and_get_after_delete_returns_404 | DELETE /api/items/{id}/ then GET /api/items/{id}/ | Delete lifecycle behavior | DELETE returns 204, later GET returns 404 |
| TestNearExpiryEndpoint | test_near_expiry_returns_only_items_expiring_in_three_days_or_less | GET /api/items/near-expiry/ | Near-expiry window filter (today through today plus 3 days) | 200 OK, only qualifying items returned |
| TestSummaryEndpoint | test_summary_returns_correct_total_items_and_near_expiry_count | GET /api/items/summary/ | Summary aggregation for total and near-expiry items | 200 OK, total_items and near_expiry_count are correct |
| FoodItemIsolationTests | test_list_returns_only_authenticated_users_items | GET /api/items/ | Per-user queryset isolation in list | 200 OK, only current user items returned |
| FoodItemIsolationTests | test_create_assigns_authenticated_owner | POST /api/items/ | Owner assignment during create | 201 Created, owner equals authenticated user |
| FoodItemIsolationTests | test_cross_user_item_access_is_hidden | GET/PATCH/DELETE /api/items/{id}/ | Cross-user access control | 404 Not Found for other user items |
| FoodItemIsolationTests | test_summary_and_near_expiry_are_user_scoped | GET /api/items/summary/ and GET /api/items/near-expiry/ | User scoping in custom actions | 200 OK with counts/items only from authenticated user |
| FoodItemIsolationTests | test_items_list_requires_authentication | GET /api/items/ | Authentication requirement | 401 Unauthorized or 403 Forbidden |

## Run Tests
From Backend/pantry_manager:

python manage.py test inventory.tests
