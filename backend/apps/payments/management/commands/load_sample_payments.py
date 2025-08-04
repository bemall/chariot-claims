import json
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from apps.payments.models import Payment

class Command(BaseCommand):
    help = 'Load sample payment data'
    
    def handle(self, *args, **options):
        # Sample data with various dates
        today = date.today()
        sample_data = [
            {
                "id": "txn_001",
                "amount": 5000.00,
                "currency": "USD",
                "scheduled_date": (today + timedelta(days=1)).isoformat(),
                "recipient": "John Doe",
                "description": "Monthly subscription payment"
            },
            {
                "id": "txn_002",
                "amount": 2500.50,
                "currency": "USD",
                "scheduled_date": (today + timedelta(days=15)).isoformat(),
                "recipient": "Jane Smith",
                "description": "Consulting services"
            },
            {
                "id": "txn_003",
                "amount": 7500.00,
                "currency": "USD",
                "scheduled_date": today.isoformat(),
                "recipient": "Acme Corp",
                "description": "Equipment purchase"
            },
            {
                "id": "txn_004",
                "amount": 1200.75,
                "currency": "USD",
                "scheduled_date": (today + timedelta(days=2)).isoformat(),
                "recipient": "Bob Wilson",
                "description": "Travel reimbursement"
            },
            {
                "id": "txn_005",
                "amount": 3300.00,
                "currency": "USD",
                "scheduled_date": (today + timedelta(days=1)).isoformat(),
                "recipient": "Tech Solutions Inc",
                "description": "Software license renewal"
            },
            {
                "id": "txn_006",
                "amount": 890.25,
                "currency": "EUR",
                "scheduled_date": (today + timedelta(days=7)).isoformat(),
                "recipient": "European Ventures",
                "description": "International transfer"
            }
        ]
        
        for item in sample_data:
            payment, created = Payment.objects.update_or_create(
                id=item['id'],
                defaults={
                    'amount': item['amount'],
                    'currency': item.get('currency', 'USD'),
                    'scheduled_date': item['scheduled_date'],
                    'recipient': item['recipient'],
                    'description': item.get('description', ''),
                    'status': 'pending'
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created payment {payment.id}"))
            else:
                self.stdout.write(self.style.WARNING(f"Updated payment {payment.id}"))
        
        total_count = Payment.objects.count()
        self.stdout.write(self.style.SUCCESS(f'Successfully loaded sample payments. Total: {total_count}'))
