from rest_framework import serializers
from .models import Payment
from datetime import date, timedelta

class PaymentSerializer(serializers.ModelSerializer):
    is_due_soon = serializers.SerializerMethodField()
    
    class Meta:
        model = Payment
        fields = [
            'id', 'amount', 'currency', 'scheduled_date', 
            'recipient', 'status', 'description', 'metadata',
            'is_due_soon', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_due_soon']
    
    def get_is_due_soon(self, obj):
        """Check if payment is due within 24 hours"""
        tomorrow = date.today() + timedelta(days=1)
        return obj.scheduled_date <= tomorrow

class PaymentSummarySerializer(serializers.Serializer):
    total_amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    payment_count = serializers.IntegerField()
    filters_applied = serializers.DictField()
    currency_breakdown = serializers.DictField()
