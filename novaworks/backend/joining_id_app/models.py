from django.db import models
from django.contrib.auth.models import User

class JoiningID(models.Model):
    full_name  = models.CharField(max_length=200)
    department = models.CharField(max_length=100)
    year       = models.CharField(max_length=4)
    joining_id = models.CharField(max_length=50, unique=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.joining_id
