from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from decimal import Decimal
import uuid

User = get_user_model()

class Payment(models.Model):
    CURRENCY_CHOICES = [
        ('USD', 'US Dollar'),
        ('EUR', 'Euro'),
        ('GBP', 'British Pound'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.CharField(max_length=50, primary_key=True)
    amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='USD')
    scheduled_date = models.DateField(db_index=True)
    recipient = models.CharField(max_length=255, db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    description = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='created_payments'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payments'
        ordering = ['-scheduled_date', '-created_at']
        indexes = [
            models.Index(fields=['scheduled_date']),
            models.Index(fields=['recipient']),
            models.Index(fields=['status']),
            models.Index(fields=['scheduled_date', 'status']),
        ]
    
    def __str__(self):
        return f"{self.id} - {self.recipient} - {self.amount} {self.currency}"
    
    def save(self, *args, **kwargs):
        if not self.id:
            self.id = f"txn_{uuid.uuid4().hex[:12]}"
        super().save(*args, **kwargs)
