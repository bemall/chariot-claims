from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import Payment

@shared_task
def process_pending_payments():
    """Process payments that are due today"""
    today = timezone.now().date()
    pending_payments = Payment.objects.filter(
        status='pending',
        scheduled_date__lte=today
    )
    
    processed_count = 0
    for payment in pending_payments:
        # Simulate payment processing
        payment.status = 'processing'
        payment.save()
        processed_count += 1
    
    return f"Processed {processed_count} payments"

@shared_task
def send_payment_reminders():
    """Send reminders for upcoming payments"""
    tomorrow = timezone.now().date() + timedelta(days=1)
    upcoming_payments = Payment.objects.filter(
        status='pending',
        scheduled_date=tomorrow
    )
    
    # Simulate sending reminders
    reminder_count = upcoming_payments.count()
    return f"Sent {reminder_count} payment reminders"
