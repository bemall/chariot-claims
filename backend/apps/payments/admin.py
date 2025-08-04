from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'recipient', 'amount', 'currency', 'scheduled_date', 'status', 'created_at')
    list_filter = ('status', 'currency', 'scheduled_date')
    search_fields = ('id', 'recipient', 'description')
    readonly_fields = ('id', 'created_at', 'updated_at', 'created_by')
    date_hierarchy = 'scheduled_date'
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
