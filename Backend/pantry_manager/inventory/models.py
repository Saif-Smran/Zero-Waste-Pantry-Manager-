from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone

class ConnectionCheck(models.Model):
    name = models.CharField(max_length=100, default='db-check')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class FoodItem(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    expiry_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['expiry_date']

    def clean(self):
        super().clean()
        if self.expiry_date and self.expiry_date < timezone.localdate():
            raise ValidationError({'expiry_date': 'Expiry date cannot be in the past.'})

    @property
    def days_until_expiry(self):
        return (self.expiry_date - timezone.localdate()).days

    @property
    def is_near_expiry(self):
        return self.days_until_expiry <= 3

    def __str__(self):
        return f'{self.name} (Qty: {self.quantity})'
