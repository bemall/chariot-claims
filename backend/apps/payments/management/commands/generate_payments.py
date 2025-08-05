import time
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
import argparse
from apps.payments.factories import PaymentFactory
from apps.payments.models import Payment


class Command(BaseCommand):
    help = 'Generate sample payment data using factories'

    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=100,
            help='Number of payments to generate'
        )
        parser.add_argument(
            '--batch-size',
            type=int,
            default=100,
            help='Batch size for bulk creation'
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing payments before generating new ones'
        )

    def handle(self, *args, **options):
        count = options['count']
        batch_size = options['batch_size']
        clear = options['clear']
        
        start_time = time.time()
        
        if clear:
            deleted_count = Payment.objects.all().delete()[0]
            self.stdout.write(
                self.style.WARNING(f"Deleted {deleted_count} existing payments")
            )
        
        # Calculate number of batches
        num_batches = (count + batch_size - 1) // batch_size  # Ceiling division
        
        total_created = 0
        
        for batch_num in range(num_batches):
            batch_start = time.time()
            
            # Calculate how many to create in this batch
            remaining = count - total_created
            current_batch_size = min(batch_size, remaining)
            
            self.stdout.write(
                self.style.WARNING(f"Generating batch {batch_num + 1}/{num_batches} ({current_batch_size} payments)...")
            )
            
            # Create payments in a transaction for better performance
            with transaction.atomic():
                for _ in range(current_batch_size):
                    # Explicitly set currency to USD for all generated payments
                    PaymentFactory.create(currency='USD')
            
            total_created += current_batch_size
            batch_time = time.time() - batch_start
            
            self.stdout.write(
                self.style.SUCCESS(
                    f"Batch {batch_num + 1}/{num_batches} completed in {batch_time:.2f}s. "
                    f"Progress: {total_created}/{count} ({(total_created/count)*100:.1f}%)"
                )
            )
        
        total_time = time.time() - start_time
        
        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully generated {count} payments in {total_time:.2f}s. "
                f"Average: {count/total_time:.2f} payments/second"
            )
        )
