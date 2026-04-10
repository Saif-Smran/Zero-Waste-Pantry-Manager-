from django.db import models

class ConnectionCheck(models.Model):
    name = models.CharField(max_length=100, default='db-check')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
