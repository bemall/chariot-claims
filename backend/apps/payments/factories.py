import factory
from factory.django import DjangoModelFactory
from datetime import date, timedelta
import random
import uuid
from decimal import Decimal
from apps.payments.models import Payment
from apps.accounts.models import CustomUser
from faker import Faker


class UserFactory(DjangoModelFactory):
    class Meta:
        model = CustomUser
        django_get_or_create = ('username',)

    username = factory.LazyFunction(lambda: f"user_{uuid.uuid4().hex[:8]}")
    email = factory.LazyAttribute(lambda obj: f"{obj.username}@example.com")
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")


class PaymentFactory(DjangoModelFactory):
    class Meta:
        model = Payment
        django_get_or_create = ('id',)

    # Required fields with no default values - must be explicitly provided
    id = factory.LazyFunction(lambda: f"txn_{uuid.uuid4().hex[:8]}")
    
    # Always use USD for currency
    currency = 'USD'
    
    # Ensure amount is always a valid decimal between 10 and 10000
    amount = factory.LazyFunction(
        lambda: Decimal(str(round(random.uniform(10, 10000), 2)))
    )
    
    # Ensure scheduled_date is always present with a valid date
    scheduled_date = factory.LazyFunction(
        lambda: date.today() + timedelta(days=random.randint(-30, 60))
    )
    
    # Ensure recipient is always present with a valid name
    @factory.lazy_attribute
    def recipient(self):
        fake = Faker()
        return f"Claimant {fake.first_name()} {fake.last_name()}"
        
    # Ensure description is always present with valid content
    @factory.lazy_attribute
    def description(self):
        fake = Faker()
        claim_types = dict(self.Meta.model.CLAIM_TYPE_CHOICES)
        claim_type = self.claim_type or 'Other'
        claim_desc = claim_types.get(claim_type, 'Insurance')
        return f"{claim_desc} claim for {fake.sentence(nb_words=6)}"
    
    # Ensure status is always present with a valid value
    status = factory.LazyFunction(
        lambda: random.choice([choice[0] for choice in Payment.STATUS_CHOICES])
    )
    
    # Ensure claim_type is always present with a valid value
    claim_type = factory.LazyFunction(
        lambda: random.choice([choice[0] for choice in Payment.CLAIM_TYPE_CHOICES])
    )
    
    # Ensure description is always present with a valid value
    description = factory.LazyFunction(
        lambda: Faker().sentence(nb_words=8)
    )
    
    # Link to a user
    created_by = factory.SubFactory(UserFactory)
    
    @factory.lazy_attribute
    def metadata(self):
        return {
            "invoice_number": f"INV-{random.randint(1000, 9999)}",
            "department": random.choice(["Sales", "Marketing", "Engineering", "HR", "Finance", "Legal"]),
            "claim_reference": f"REF-{uuid.uuid4().hex[:6].upper()}",
            "notes": "Sample payment notes for claim processing."
        }
