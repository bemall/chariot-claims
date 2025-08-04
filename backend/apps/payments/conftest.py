import pytest
from rest_framework.test import APIClient
from apps.accounts.models import CustomUser
from apps.payments.models import Payment

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user():
    return CustomUser.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123'
    )

@pytest.fixture
def authenticated_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client

@pytest.fixture
def sample_payment():
    return Payment.objects.create(
        id='test_payment_001',
        amount=1000.00,
        currency='USD',
        scheduled_date='2025-08-01',
        recipient='Test Recipient',
        status='pending',
        description='Test payment'
    )
