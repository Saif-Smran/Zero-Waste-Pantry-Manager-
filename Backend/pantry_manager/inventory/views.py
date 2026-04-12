from datetime import timedelta

from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import FoodItem
from .serializers import FoodItemSerializer


class FoodItemViewSet(ModelViewSet):
    serializer_class = FoodItemSerializer
    queryset = FoodItem.objects.order_by("expiry_date")

    def get_queryset(self):
        sort = self.request.query_params.get("sort")

        if sort == "name":
            return FoodItem.objects.order_by("name")
        if sort == "quantity":
            return FoodItem.objects.order_by("quantity")
        return FoodItem.objects.order_by("expiry_date")

    def perform_create(self, serializer):
        instance = FoodItem(**serializer.validated_data)
        instance.full_clean()
        serializer.save()

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
        base_queryset = FoodItem.objects.all()

        data = {
            "total_items": base_queryset.count(),
            "near_expiry_count": base_queryset.filter(
                expiry_date__gte=today,
                expiry_date__lte=threshold,
            ).count(),
            "expired_count": base_queryset.filter(expiry_date__lt=today).count(),
        }
        return Response(data)
