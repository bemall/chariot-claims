import { mockPayments, mockSummary } from './mockData';
import { Payment, PaymentFilters, PaymentResponse } from './types';

/**
 * API configuration
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8020/api';
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

/**
 * Payment summary interface
 */
export interface PaymentSummary {
  total_amount: number;
  currency_breakdown: Record<string, number>;
  claim_type_breakdown?: Record<string, number>;
  status_counts: Record<string, number>;
}

/**
 * PaymentAPI class
 * Handles all API requests for payments, with support for both server-side and client-side fetching
 * Includes mock data support for development and testing
 */
class PaymentAPI {
  /**
   * Fetch data with error handling and mock data fallback
   * @param url API endpoint URL
   * @param options Fetch options
   * @returns Promise with response data
   */
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

  /**
   * Generate mock response based on URL and query parameters
   * @param url API endpoint URL
   * @returns Promise with mock response data
   */
  private getMockResponse(url: string) {
    // Parse URL to extract query parameters
    const urlObj = new URL(url, 'http://localhost');
    const params = urlObj.searchParams;
    
    if (url.includes('/payments/summary')) {
      // For summary endpoint, filter the data first, then calculate summary
      const filteredPayments = this.filterMockPayments(mockPayments, params);
      
      // Calculate summary based on filtered payments
      const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
      
      // Create a filtered summary based on the filtered payments
      const filteredSummary = {
        ...mockSummary,
        total_amount: totalAmount,
        // You could recalculate other summary data here if needed
      };
      
      return Promise.resolve(filteredSummary);
    }
    
    if (url.includes('/payments/')) {
      // Filter payments based on URL parameters
      const filteredPayments = this.filterMockPayments(mockPayments, params);
      
      return Promise.resolve({
        count: filteredPayments.length,
        next: null,
        previous: null,
        results: filteredPayments
      });
    }
    
    return Promise.reject(new Error('Unknown endpoint'));
  }
  
  /**
   * Filter mock payments based on URL parameters
   * @param payments Array of payment objects
   * @param params URL search parameters for filtering
   * @returns Filtered array of payment objects
   */
  private filterMockPayments(payments: Payment[], params: URLSearchParams) {
    // If no filters are applied, return all payments
    if (params.toString() === '') {
      return payments;
    }
    
    return payments.filter(payment => {
      // Filter by recipient (case-insensitive partial match)
      if (params.has('recipient') && params.get('recipient') !== '') {
        const recipientFilter = params.get('recipient')!.toLowerCase();
        if (!payment.recipient.toLowerCase().includes(recipientFilter)) {
          return false;
        }
      }
      
      // Filter by status (case-insensitive exact match)
      if (params.has('status') && params.get('status') !== '') {
        const statusFilter = params.get('status')!.toLowerCase();
        if (payment.status.toLowerCase() !== statusFilter) {
          return false;
        }
      }
      
      // Filter by scheduled date (after)
      if (params.has('after') && params.get('after') !== '') {
        const afterDate = new Date(params.get('after')!);
        const paymentDate = new Date(payment.scheduled_date);
        if (paymentDate < afterDate) {
          return false;
        }
      }
      
      // Filter by claim type (case-insensitive partial match)
      if (params.has('claim_type') && params.get('claim_type') !== '') {
        const claimTypeFilter = params.get('claim_type')!.toLowerCase();
        if (!payment.claim_type || !payment.claim_type.toLowerCase().includes(claimTypeFilter)) {
          return false;
        }
      }
      
      return true;
    });
  }

  /**
   * Get payments with optional filtering
   * @param filters Optional payment filters
   * @returns Promise with paginated payment response
   */
  async getPayments(filters?: PaymentFilters): Promise<PaymentResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    return this.fetchWithError(`${API_URL}/payments/?${params}`);
  }
  
  /**
   * Get payment summary with optional filtering
   * @param filters Optional payment filters
   * @returns Promise with payment summary
   */
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