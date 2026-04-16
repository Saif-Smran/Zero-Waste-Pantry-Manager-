from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


def clear_existing_food_items(apps, schema_editor):
    FoodItem = apps.get_model("inventory", "FoodItem")
    FoodItem.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("inventory", "0002_fooditem"),
    ]

    operations = [
        migrations.RunPython(clear_existing_food_items, migrations.RunPython.noop),
        migrations.AddField(
            model_name="fooditem",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="food_items",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
