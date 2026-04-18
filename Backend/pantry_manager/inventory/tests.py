from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from .models import FoodItem


class InventoryAPITestCase(TestCase):
	def setUp(self):
		self.client = APIClient()
		self.user_model = get_user_model()
		self.user = self.user_model.objects.create_user(username="tester", password="pass12345")
		self.today = timezone.localdate()
		self.client.force_authenticate(user=self.user)


class TestFoodItemCreate(InventoryAPITestCase):
	def test_post_valid_item_returns_201(self):
		response = self.client.post(
			"/api/items/",
			{
				"name": "Tomatoes",
				"quantity": 4,
				"expiry_date": str(self.today + timedelta(days=5)),
			},
			format="json",
		)

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(FoodItem.objects.count(), 1)
		self.assertEqual(FoodItem.objects.get().name, "Tomatoes")

	def test_post_with_past_expiry_returns_400(self):
		response = self.client.post(
			"/api/items/",
			{
				"name": "Yogurt",
				"quantity": 1,
				"expiry_date": str(self.today - timedelta(days=1)),
			},
			format="json",
		)

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertIn("error", response.data)

	def test_post_with_negative_quantity_returns_400(self):
		response = self.client.post(
			"/api/items/",
			{
				"name": "Lentils",
				"quantity": -1,
				"expiry_date": str(self.today + timedelta(days=7)),
			},
			format="json",
		)

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertIn("error", response.data)

	def test_post_with_empty_name_returns_400(self):
		response = self.client.post(
			"/api/items/",
			{
				"name": "   ",
				"quantity": 1,
				"expiry_date": str(self.today + timedelta(days=7)),
			},
			format="json",
		)

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertIn("error", response.data)


class TestFoodItemList(InventoryAPITestCase):
	def setUp(self):
		super().setUp()
		FoodItem.objects.create(
			user=self.user,
			name="Banana",
			quantity=2,
			expiry_date=self.today + timedelta(days=5),
		)
		FoodItem.objects.create(
			user=self.user,
			name="Apple",
			quantity=3,
			expiry_date=self.today + timedelta(days=1),
		)
		FoodItem.objects.create(
			user=self.user,
			name="Carrot",
			quantity=1,
			expiry_date=self.today + timedelta(days=3),
		)

	def test_get_returns_200(self):
		response = self.client.get("/api/items/")
		self.assertEqual(response.status_code, status.HTTP_200_OK)

	def test_items_sorted_by_expiry_date_ascending(self):
		response = self.client.get("/api/items/")
		names = [item["name"] for item in response.data]
		self.assertEqual(names, ["Apple", "Carrot", "Banana"])

	def test_sort_name_returns_alphabetical_order(self):
		response = self.client.get("/api/items/?sort=name")
		names = [item["name"] for item in response.data]
		self.assertEqual(names, ["Apple", "Banana", "Carrot"])


class TestFoodItemUpdate(InventoryAPITestCase):
	def test_patch_quantity_decrement_works(self):
		item = FoodItem.objects.create(
			user=self.user,
			name="Rice",
			quantity=5,
			expiry_date=self.today + timedelta(days=10),
		)

		response = self.client.patch(
			f"/api/items/{item.id}/",
			{"quantity": 4},
			format="json",
		)

		item.refresh_from_db()
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(item.quantity, 4)

	def test_patch_quantity_to_negative_returns_400(self):
		item = FoodItem.objects.create(
			user=self.user,
			name="Pasta",
			quantity=5,
			expiry_date=self.today + timedelta(days=10),
		)

		response = self.client.patch(
			f"/api/items/{item.id}/",
			{"quantity": -2},
			format="json",
		)

		item.refresh_from_db()
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertEqual(item.quantity, 5)


class TestFoodItemDelete(InventoryAPITestCase):
	def test_delete_returns_204_and_get_after_delete_returns_404(self):
		item = FoodItem.objects.create(
			user=self.user,
			name="Milk",
			quantity=1,
			expiry_date=self.today + timedelta(days=4),
		)

		delete_response = self.client.delete(f"/api/items/{item.id}/")
		get_response = self.client.get(f"/api/items/{item.id}/")

		self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)
		self.assertEqual(get_response.status_code, status.HTTP_404_NOT_FOUND)


class TestNearExpiryEndpoint(InventoryAPITestCase):
	def test_near_expiry_returns_only_items_expiring_in_three_days_or_less(self):
		FoodItem.objects.create(
			user=self.user,
			name="Eggs",
			quantity=6,
			expiry_date=self.today,
		)
		FoodItem.objects.create(
			user=self.user,
			name="Bread",
			quantity=1,
			expiry_date=self.today + timedelta(days=2),
		)
		FoodItem.objects.create(
			user=self.user,
			name="Cheese",
			quantity=1,
			expiry_date=self.today + timedelta(days=3),
		)
		FoodItem.objects.create(
			user=self.user,
			name="Beans",
			quantity=1,
			expiry_date=self.today + timedelta(days=4),
		)
		FoodItem.objects.create(
			user=self.user,
			name="Old Spice",
			quantity=1,
			expiry_date=self.today - timedelta(days=1),
		)

		response = self.client.get("/api/items/near-expiry/")

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		returned_names = sorted([item["name"] for item in response.data])
		self.assertEqual(returned_names, ["Bread", "Cheese", "Eggs"])


class TestSummaryEndpoint(InventoryAPITestCase):
	def test_summary_returns_correct_total_items_and_near_expiry_count(self):
		FoodItem.objects.create(
			user=self.user,
			name="Flour",
			quantity=1,
			expiry_date=self.today + timedelta(days=10),
		)
		FoodItem.objects.create(
			user=self.user,
			name="Juice",
			quantity=1,
			expiry_date=self.today + timedelta(days=1),
		)
		FoodItem.objects.create(
			user=self.user,
			name="Butter",
			quantity=1,
			expiry_date=self.today + timedelta(days=3),
		)
		FoodItem.objects.create(
			user=self.user,
			name="Old Salt",
			quantity=1,
			expiry_date=self.today - timedelta(days=1),
		)

		response = self.client.get("/api/items/summary/")

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data["total_items"], 4)
		self.assertEqual(response.data["near_expiry_count"], 2)


class FoodItemIsolationTests(TestCase):
	def setUp(self):
		self.client = APIClient()
		self.user_model = get_user_model()
		self.user_a = self.user_model.objects.create_user(username="user_a", password="pass12345")
		self.user_b = self.user_model.objects.create_user(username="user_b", password="pass12345")
		self.today = timezone.localdate()

	def test_list_returns_only_authenticated_users_items(self):
		FoodItem.objects.create(
			user=self.user_a,
			name="Rice",
			quantity=2,
			expiry_date=self.today + timedelta(days=10),
		)
		FoodItem.objects.create(
			user=self.user_b,
			name="Milk",
			quantity=1,
			expiry_date=self.today + timedelta(days=2),
		)

		self.client.force_authenticate(user=self.user_a)
		response = self.client.get("/api/items/")

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data), 1)
		self.assertEqual(response.data[0]["name"], "Rice")

	def test_create_assigns_authenticated_owner(self):
		self.client.force_authenticate(user=self.user_a)
		response = self.client.post(
			"/api/items/",
			{
				"name": "Beans",
				"quantity": 3,
				"expiry_date": str(self.today + timedelta(days=6)),
			},
			format="json",
		)

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		created = FoodItem.objects.get(id=response.data["id"])
		self.assertEqual(created.user, self.user_a)

	def test_cross_user_item_access_is_hidden(self):
		other_item = FoodItem.objects.create(
			user=self.user_b,
			name="Oil",
			quantity=1,
			expiry_date=self.today + timedelta(days=7),
		)

		self.client.force_authenticate(user=self.user_a)
		detail_response = self.client.get(f"/api/items/{other_item.id}/")
		patch_response = self.client.patch(
			f"/api/items/{other_item.id}/",
			{"quantity": 9},
			format="json",
		)
		delete_response = self.client.delete(f"/api/items/{other_item.id}/")

		self.assertEqual(detail_response.status_code, status.HTTP_404_NOT_FOUND)
		self.assertEqual(patch_response.status_code, status.HTTP_404_NOT_FOUND)
		self.assertEqual(delete_response.status_code, status.HTTP_404_NOT_FOUND)

	def test_summary_and_near_expiry_are_user_scoped(self):
		FoodItem.objects.create(
			user=self.user_a,
			name="Bread",
			quantity=1,
			expiry_date=self.today + timedelta(days=2),
		)
		FoodItem.objects.create(
			user=self.user_a,
			name="Flour",
			quantity=1,
			expiry_date=self.today - timedelta(days=1),
		)
		FoodItem.objects.create(
			user=self.user_b,
			name="Cheese",
			quantity=1,
			expiry_date=self.today + timedelta(days=1),
		)

		self.client.force_authenticate(user=self.user_a)

		summary_response = self.client.get("/api/items/summary/")
		near_expiry_response = self.client.get("/api/items/near-expiry/")

		self.assertEqual(summary_response.status_code, status.HTTP_200_OK)
		self.assertEqual(summary_response.data["total_items"], 2)
		self.assertEqual(summary_response.data["near_expiry_count"], 1)
		self.assertEqual(summary_response.data["expired_count"], 1)

		self.assertEqual(near_expiry_response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(near_expiry_response.data), 1)
		self.assertEqual(near_expiry_response.data[0]["name"], "Bread")

	def test_items_list_requires_authentication(self):
		response = self.client.get("/api/items/")
		self.assertIn(
			response.status_code,
			[status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN],
		)


class AuthSessionFlowTests(TestCase):
	def setUp(self):
		self.client = APIClient()
		self.user_model = get_user_model()
		self.username = "session_user"
		self.password = "pass12345"
		self.user_model.objects.create_user(username=self.username, password=self.password)

	def test_session_endpoint_reports_unauthenticated_by_default(self):
		response = self.client.get("/api/auth/session/")

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertFalse(response.data["authenticated"])
		self.assertIsNone(response.data["user"])
		self.assertIn("csrf_token", response.data)

	def test_login_sets_session_visible_to_session_endpoint(self):
		login_response = self.client.post(
			"/api/auth/login/",
			{"username": self.username, "password": self.password},
			format="json",
		)

		self.assertEqual(login_response.status_code, status.HTTP_200_OK)
		self.assertEqual(login_response.data["user"]["username"], self.username)

		session_response = self.client.get("/api/auth/session/")
		self.assertEqual(session_response.status_code, status.HTTP_200_OK)
		self.assertTrue(session_response.data["authenticated"])
		self.assertEqual(session_response.data["user"]["username"], self.username)

	def test_logout_clears_authenticated_session(self):
		login_response = self.client.post(
			"/api/auth/login/",
			{"username": self.username, "password": self.password},
			format="json",
		)
		self.assertEqual(login_response.status_code, status.HTTP_200_OK)

		logout_response = self.client.post("/api/auth/logout/", format="json")
		self.assertEqual(logout_response.status_code, status.HTTP_204_NO_CONTENT)

		session_response = self.client.get("/api/auth/session/")
		self.assertEqual(session_response.status_code, status.HTTP_200_OK)
		self.assertFalse(session_response.data["authenticated"])
		self.assertIsNone(session_response.data["user"])
