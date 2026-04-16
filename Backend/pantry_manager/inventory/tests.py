from datetime import timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import FoodItem


class FoodItemIsolationTests(APITestCase):
	def setUp(self):
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
