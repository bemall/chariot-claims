const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8020/api';

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  scheduled_date: string;
  recipient: string;
  status: string;
  description?: string;
  metadata?: Record<string, any>;
  is_due_soon: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentSummary {
  total_amount: number;
  payment_count: number;
  filters_applied: Record<string, string>;
  currency_breakdown: Record<string, number>;
}

export interface PaymentFilters {
  recipient?: string;
  scheduled_date?: string;
  after?: string;
  status?: string;
  currency?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

class PaymentAPI {
  private async fetchWithError(url: string, options?: RequestInit) {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async getPayments(filters?: PaymentFilters): Promise<PaginatedResponse<Payment>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    return this.fetchWithError(`${API_URL}/payments/?${params}`);
  }
  
  async getPaymentSummary(filters?: PaymentFilters): Promise<PaymentSummary> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    return this.fetchWithError(`${API_URL}/payments/summary/?${params}`);
  }
}

export const paymentAPI = new PaymentAPI();
