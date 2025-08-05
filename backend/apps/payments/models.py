from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
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
    
    CLAIM_TYPE_CHOICES = [
        ('Auto Insurance', 'Auto Insurance'),
        ('Home Insurance', 'Home Insurance'),
        ('Health Insurance', 'Health Insurance'),
        ('Life Insurance', 'Life Insurance'),
        ('Travel Insurance', 'Travel Insurance'),
        ('Business Insurance', 'Business Insurance'),
        ('Other', 'Other'),
    ]
    
    id = models.CharField(max_length=50, primary_key=True)
    amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        null=False,
        blank=False
    )
    currency = models.CharField(
        max_length=3, 
        choices=CURRENCY_CHOICES, 
        default='USD',
        null=False,
        blank=False
    )
    scheduled_date = models.DateField(
        db_index=True,
        null=False,
        blank=False
    )
    recipient = models.CharField(
        max_length=255, 
        db_index=True,
        null=False,
        blank=False
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending',
        null=False,
        blank=False
    )
    claim_type = models.CharField(
        max_length=50, 
        choices=CLAIM_TYPE_CHOICES, 
        default='Other', 
        null=False, 
        blank=False, 
        db_index=True
    )
    description = models.TextField(blank=False, null=False)
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
            models.Index(fields=['claim_type']),
            models.Index(fields=['scheduled_date', 'status']),
            models.Index(fields=['scheduled_date', 'claim_type']),
        ]
    
    def __str__(self):
        return f"{self.id} - {self.recipient} - {self.amount} {self.currency}"
    
    def clean(self):
        """Validate model data before saving"""
        super().clean()
        
        # Validate that all required fields are present
        errors = {}
        
        if not self.recipient:
            errors['recipient'] = ValidationError("Recipient is required")
            
        if not self.scheduled_date:
            errors['scheduled_date'] = ValidationError("Scheduled date is required")
            
        if not self.amount or self.amount <= 0:
            errors['amount'] = ValidationError("Amount must be greater than zero")
            
        if not self.currency:
            errors['currency'] = ValidationError("Currency is required")
            
        if not self.status:
            errors['status'] = ValidationError("Status is required")
            
        if not self.claim_type:
            errors['claim_type'] = ValidationError("Claim type is required")
            
        if not self.description:
            errors['description'] = ValidationError("Description is required")
            
        # If any errors were found, raise them
        if errors:
            raise ValidationError(errors)
            
    def save(self, *args, **kwargs):
        """Override save to enforce validation and ensure ID is present"""
        if not self.id:
            self.id = f"txn_{uuid.uuid4().hex[:12]}"
        
        self.full_clean()  # This calls clean() and validates model fields
        # Run full validation before saving
        self.full_clean()
            
        super().save(*args, **kwargs)
