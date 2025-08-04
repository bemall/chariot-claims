import django_filters
from .models import Payment

class PaymentFilter(django_filters.FilterSet):
    scheduled_date = django_filters.DateFilter()
    scheduled_date__gte = django_filters.DateFilter(field_name='scheduled_date', lookup_expr='gte')
    scheduled_date__lte = django_filters.DateFilter(field_name='scheduled_date', lookup_expr='lte')
    recipient = django_filters.CharFilter(lookup_expr='icontains')
    amount__gte = django_filters.NumberFilter(field_name='amount', lookup_expr='gte')
    amount__lte = django_filters.NumberFilter(field_name='amount', lookup_expr='lte')
    
    class Meta:
        model = Payment
        fields = ['status', 'currency']
