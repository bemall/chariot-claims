from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Count
from django.utils.dateparse import parse_date
from .models import Payment
from .serializers import PaymentSerializer, PaymentSummarySerializer
from .filters import PaymentFilter

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = PaymentFilter
    search_fields = ['recipient', 'id', 'description']
    ordering_fields = ['scheduled_date', 'amount', 'created_at']
    ordering = ['-scheduled_date']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Handle 'after' parameter
        after_date = self.request.query_params.get('after')
        if after_date:
            parsed_date = parse_date(after_date)
            if parsed_date:
                queryset = queryset.filter(scheduled_date__gte=parsed_date)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get summary statistics for filtered payments"""
        queryset = self.filter_queryset(self.get_queryset())
        
        # Calculate totals by currency
        currency_breakdown = {}
        for currency, _ in Payment.CURRENCY_CHOICES:
            currency_total = queryset.filter(currency=currency).aggregate(
                total=Sum('amount')
            )['total'] or 0
            if currency_total > 0:
                currency_breakdown[currency] = float(currency_total)
        
        # Overall statistics
        total = queryset.aggregate(
            total_amount=Sum('amount'),
            payment_count=Count('id')
        )
        
        summary_data = {
            'total_amount': total['total_amount'] or 0,
            'payment_count': total['payment_count'] or 0,
            'filters_applied': request.query_params.dict(),
            'currency_breakdown': currency_breakdown
        }
        
        serializer = PaymentSummarySerializer(summary_data)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user if self.request.user.is_authenticated else None)
