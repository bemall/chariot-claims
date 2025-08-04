import { mockPayments, mockSummary } from './mockData';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8020/api';
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Type definitions
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
  recipient_name: string;
  recipient_account: string;
  recipient: string; // Added for PaymentTable
  payment_method: string;
  description?: string;
  scheduled_date: string; // Added for PaymentTable
  is_due_soon: boolean; // Added for PaymentTable
  claim_type?: string; // Added for claim type breakdown
}

export interface PaymentFilters {
  status?: string;
  payment_method?: string;
  min_amount?: string;
  max_amount?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
}

export interface PaymentSummary {
  total_amount: number;
  currency_breakdown: Record<string, number>;
  claim_type_breakdown?: Record<string, number>;
  status_counts: Record<string, number>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

class PaymentAPI {
  private async fetchWithError(url: string, options?: RequestInit) {
    // Use mock data if enabled or if API fails
    if (USE_MOCK_DATA) {
      return this.getMockResponse(url);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.warn('API failed, falling back to mock data:', error);
      return this.getMockResponse(url);
    }
  }

  private getMockResponse(url: string) {
    if (url.includes('/payments/summary')) {
      return Promise.resolve(mockSummary);
    }
    if (url.includes('/payments/')) {
      return Promise.resolve({
        count: mockPayments.length,
        next: null,
        previous: null,
        results: mockPayments
      });
    }
    return Promise.reject(new Error('Unknown endpoint'));
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