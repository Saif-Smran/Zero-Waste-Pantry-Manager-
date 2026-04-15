from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import FoodItemViewSet, csrf_cookie, login_user, logout_user, register_user, session_user

router = DefaultRouter()
router.register("items", FoodItemViewSet, basename="food-item")

urlpatterns = [
	path("auth/csrf/", csrf_cookie, name="auth-csrf"),
	path("auth/register/", register_user, name="auth-register"),
	path("auth/login/", login_user, name="auth-login"),
	path("auth/logout/", logout_user, name="auth-logout"),
	path("auth/session/", session_user, name="auth-session"),
] + router.urls
