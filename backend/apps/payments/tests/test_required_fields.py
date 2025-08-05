import pytest
from django.core.exceptions import ValidationError
from apps.payments.models import Payment
from apps.payments.factories import PaymentFactory
from datetime import date

@pytest.mark.django_db
def test_payment_requires_recipient():
    """Test that Payment cannot be created without recipient"""
    # Try to create a payment without recipient
    payment = Payment(
        amount=100.00,
        currency='USD',
        scheduled_date=date.today(),
        status='pending',
        claim_type='Auto Insurance'
    )
    
    # Should raise ValidationError
    with pytest.raises(ValidationError) as excinfo:
        payment.save()
    
    # Check that the error is about recipient
    assert 'recipient' in str(excinfo.value)

@pytest.mark.django_db
def test_payment_requires_scheduled_date():
    """Test that Payment cannot be created without scheduled_date"""
    # Try to create a payment without scheduled_date
    payment = Payment(
        recipient="Test Recipient",
        amount=100.00,
        currency='USD',
        status='pending',
        claim_type='Auto Insurance'
    )
    
    # Should raise ValidationError
    with pytest.raises(ValidationError) as excinfo:
        payment.save()
    
    # Check that the error is about scheduled_date
    assert 'scheduled_date' in str(excinfo.value)

@pytest.mark.django_db
def test_payment_requires_amount():
    """Test that Payment cannot be created without amount"""
    # Try to create a payment without amount
    payment = Payment(
        recipient="Test Recipient",
        scheduled_date=date.today(),
        currency='USD',
        status='pending',
        claim_type='Auto Insurance'
    )
    
    # Should raise ValidationError
    with pytest.raises(ValidationError) as excinfo:
        payment.save()
    
    # Check that the error is about amount
    assert 'amount' in str(excinfo.value)

@pytest.mark.django_db
def test_payment_requires_currency():
    """Test that Payment cannot be created without currency"""
    # Try to create a payment without currency
    payment = Payment(
        recipient="Test Recipient",
        scheduled_date=date.today(),
        amount=100.00,
        status='pending',
        claim_type='Auto Insurance'
    )
    
    # Should raise ValidationError
    with pytest.raises(ValidationError) as excinfo:
        payment.save()
    
    # Check that the error is about currency
    assert 'currency' in str(excinfo.value)

@pytest.mark.django_db
def test_payment_requires_status():
    """Test that Payment cannot be created without status"""
    # Try to create a payment without status
    payment = Payment(
        recipient="Test Recipient",
        scheduled_date=date.today(),
        amount=100.00,
        currency='USD',
        claim_type='Auto Insurance'
    )
    
    # Should raise ValidationError
    with pytest.raises(ValidationError) as excinfo:
        payment.save()
    
    # Check that the error is about status
    assert 'status' in str(excinfo.value)

@pytest.mark.django_db
def test_payment_requires_claim_type():
    """Test that Payment cannot be created without claim_type"""
    # Try to create a payment without claim_type
    payment = Payment(
        recipient="Test Recipient",
        scheduled_date=date.today(),
        amount=100.00,
        currency='USD',
        status='pending'
    )
    
    # Should raise ValidationError
    with pytest.raises(ValidationError) as excinfo:
        payment.save()
    
    # Check that the error is about claim_type
    assert 'claim_type' in str(excinfo.value)

@pytest.mark.django_db
def test_payment_factory_creates_valid_payments():
    """Test that PaymentFactory always creates valid payments with all required fields"""
    # Create 10 payments with the factory
    payments = [PaymentFactory.create() for _ in range(10)]
    
    # Verify all required fields are present in each payment
    for payment in payments:
        assert payment.recipient is not None and payment.recipient != ""
        assert payment.scheduled_date is not None
        assert payment.amount is not None and payment.amount > 0
        assert payment.currency is not None and payment.currency == 'USD'
        assert payment.status is not None and payment.status != ""
        assert payment.claim_type is not None and payment.claim_type != ""
