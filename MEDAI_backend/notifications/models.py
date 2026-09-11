from django.db import models
from accounts.models import User


class Notification(models.Model):
    TYPE_CHOICES = [
        ('reminder', 'Reminder'),
        ('missed_dose', 'Missed dose'),
        ('alert', 'Alert'),
        ('system', 'System'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=15, choices=TYPE_CHOICES)
    title = models.CharField(max_length=150)
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    related_id = models.BigIntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        indexes = [models.Index(fields=['user', 'is_read'])]

    def __str__(self):
        return f'{self.title} -> {self.user}'
