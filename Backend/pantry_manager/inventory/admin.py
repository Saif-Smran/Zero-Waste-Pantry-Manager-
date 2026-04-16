from django.contrib import admin
from django.utils.html import format_html

from .models import FoodItem


@admin.register(FoodItem)
class FoodItemAdmin(admin.ModelAdmin):
	list_display = ['name', 'user', 'quantity', 'expiry_date', 'days_until_expiry', 'is_near_expiry', 'created_at']
	list_filter = ['expiry_date', 'user']
	search_fields = ['name', 'user__username']
	ordering = ['expiry_date']
	readonly_fields = ['created_at', 'updated_at']

	def save_model(self, request, obj, form, change):
		if not change and not obj.user_id:
			obj.user = request.user
		super().save_model(request, obj, form, change)

	@admin.display(description='Near Expiry')
	def is_near_expiry(self, obj):
		if obj.is_near_expiry:
			return format_html(
				'<span style="color: #c62828; font-weight: 700;">{}</span>',
				'Yes',
			)
		return format_html('<span style="color: #2e7d32;">{}</span>', 'No')
