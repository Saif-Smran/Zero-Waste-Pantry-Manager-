from django.utils import timezone
from rest_framework import serializers

from .models import FoodItem


class FoodItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=255, trim_whitespace=False)
    quantity = serializers.IntegerField()
    days_until_expiry = serializers.SerializerMethodField(read_only=True)
    is_near_expiry = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = FoodItem
        fields = [
            "id",
            "name",
            "quantity",
            "expiry_date",
            "created_at",
            "updated_at",
            "days_until_expiry",
            "is_near_expiry",
        ]
        read_only_fields = [
            "created_at",
            "updated_at",
            "days_until_expiry",
            "is_near_expiry",
        ]

    def get_days_until_expiry(self, obj):
        return obj.days_until_expiry

    def get_is_near_expiry(self, obj):
        return obj.is_near_expiry

    def validate_expiry_date(self, value):
        if value < timezone.localdate():
            raise serializers.ValidationError("Expiry date cannot be in the past.")
        return value

    def validate_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Quantity cannot be negative.")
        return value

    def validate_name(self, value):
        cleaned_name = value.strip()
        if not cleaned_name:
            raise serializers.ValidationError("Name cannot be empty.")
        return cleaned_name
