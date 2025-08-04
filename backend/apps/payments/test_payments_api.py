import pytest
from datetime import date, timedelta
from django.urls import reverse
from rest_framework import status
from apps.payments.models import Payment

@pytest.mark.django_db
class TestPaymentAPI:
    def test_list_payments(self, api_client, sample_payment):
        url = reverse('payment-list')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] >= 1
        assert any(p['id'] == sample_payment.id for p in response.data['results'])
    
    def test_filter_by_recipient(self, api_client, sample_payment):
        url = reverse('payment-list')
        response = api_client.get(url, {'recipient': 'Test'})
        
        assert response.status_code == status.HTTP_200_OK
        assert all('Test' in p['recipient'] for p in response.data['results'])
    
    def test_filter_by_date(self, api_client):
        today = date.today()
        
        Payment.objects.create(
            id='past_payment',
            amount=500,
            scheduled_date=today - timedelta(days=7),
            recipient='Past Payment'
        )
        
        Payment.objects.create(
            id='future_payment',
            amount=1500,
            scheduled_date=today + timedelta(days=7),
            recipient='Future Payment'
        )
        
        url = reverse('payment-list')
        response = api_client.get(url, {
            'after': today.isoformat()
        })
        
        assert response.status_code == status.HTTP_200_OK
        assert all(
            date.fromisoformat(p['scheduled_date']) >= today 
            for p in response.data['results']
        )
    
    def test_payment_summary(self, api_client):
        Payment.objects.bulk_create([
            Payment(id=f'test_{i}', amount=100 * i, currency='USD', 
                   scheduled_date=date.today(), recipient=f'Recipient {i}')
            for i in range(1, 4)
        ])
        
        url = reverse('payment-summary')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'total_amount' in response.data
        assert 'payment_count' in response.data
        assert 'currency_breakdown' in response.data
    
    def test_due_soon_flag(self, api_client):
        today = date.today()
        tomorrow = today + timedelta(days=1)
        next_week = today + timedelta(days=7)
        
        soon_payment = Payment.objects.create(
            id='due_soon',
            amount=1000,
            scheduled_date=tomorrow,
            recipient='Due Soon'
        )
        
        later_payment = Payment.objects.create(
            id='due_later',
            amount=2000,
            scheduled_date=next_week,
            recipient='Due Later'
        )
        
        url = reverse('payment-list')
        response = api_client.get(url)
        
        results = {p['id']: p for p in response.data['results']}
        assert results['due_soon']['is_due_soon'] is True
        assert results['due_later']['is_due_soon'] is False
