from datetime import timedelta

from django.contrib.auth import authenticate, get_user_model, login, logout
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.decorators import action, api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import exception_handler
from rest_framework.viewsets import ModelViewSet

from .models import FoodItem
from .serializers import FoodItemSerializer


def _extract_error_and_field(detail):
    field = None
    message = "An unexpected error occurred."

    if isinstance(detail, dict) and detail:
        field, value = next(iter(detail.items()))
        if isinstance(value, list) and value:
            message = str(value[0])
        else:
            message = str(value)
    elif isinstance(detail, list) and detail:
        message = str(detail[0])
    elif detail:
        message = str(detail)

    if field == "non_field_errors":
        field = None

    return message, field


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return Response(
            {"error": "An unexpected error occurred.", "field": None},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    message, field = _extract_error_and_field(response.data)
    response.data = {"error": message, "field": field}
    return response


def _serialize_user(user):
    return {
        "id": user.id,
        "username": user.get_username(),
    }


@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def csrf_cookie(request):
    return Response({"message": "CSRF cookie set."})


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def register_user(request):
    username = (request.data.get("username") or "").strip()
    password = request.data.get("password") or ""

    if not username:
        return Response({"error": "Username is required.", "field": "username"}, status=400)
    if not password:
        return Response({"error": "Password is required.", "field": "password"}, status=400)

    user_model = get_user_model()
    if user_model.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists.", "field": "username"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = user_model.objects.create_user(username=username, password=password)
    login(request, user)
    return Response({"user": _serialize_user(user)}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def login_user(request):
    username = (request.data.get("username") or "").strip()
    password = request.data.get("password") or ""

    if not username or not password:
        return Response(
            {"error": "Username and password are required.", "field": None},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(request, username=username, password=password)
    if user is None:
        return Response(
            {"error": "Invalid username or password.", "field": None},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    login(request, user)
    return Response({"user": _serialize_user(user)}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def logout_user(request):
    if request.user.is_authenticated:
        logout(request)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@permission_classes([AllowAny])
def session_user(request):
    if not request.user.is_authenticated:
        return Response(
            {"error": "Not authenticated.", "field": None},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    return Response({"user": _serialize_user(request.user)}, status=status.HTTP_200_OK)


class FoodItemViewSet(ModelViewSet):
    serializer_class = FoodItemSerializer
    queryset = FoodItem.objects.all()

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return FoodItem.objects.none()

        queryset = FoodItem.objects.filter(user=self.request.user)
        sort = self.request.query_params.get("sort")

        if sort == "name":
            return queryset.order_by("name")
        if sort == "quantity":
            return queryset.order_by("quantity")
        return queryset.order_by("expiry_date")

    def perform_create(self, serializer):
        instance = FoodItem(user=self.request.user, **serializer.validated_data)
        instance.full_clean()
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.instance
        for attr, value in serializer.validated_data.items():
            setattr(instance, attr, value)
        instance.full_clean()
        serializer.save()

    @action(detail=False, methods=["get"], url_path="near-expiry")
    def near_expiry(self, request):
        today = timezone.localdate()
        threshold = today + timedelta(days=3)
        queryset = self.get_queryset().filter(expiry_date__gte=today, expiry_date__lte=threshold)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="summary")
    def summary(self, request):
        today = timezone.localdate()
        threshold = today + timedelta(days=3)
        base_queryset = self.get_queryset()

        data = {
            "total_items": base_queryset.count(),
            "near_expiry_count": base_queryset.filter(
                expiry_date__gte=today,
                expiry_date__lte=threshold,
            ).count(),
            "expired_count": base_queryset.filter(expiry_date__lt=today).count(),
        }
        return Response(data)
