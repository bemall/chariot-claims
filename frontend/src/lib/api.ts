// API client for payments
import { Payment, PaymentFilters, PaymentResponse } from './types';

/**
 * API configuration
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8020/api';

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
   * Fetch data with error handling
   * @param url API endpoint URL
   * @param options Fetch options
   * @returns Promise with response data
   */
  private async fetchWithError(url: string, options?: RequestInit) {
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
      console.error('API request failed:', error);
      throw error;
    }
  }

  // No mock data methods needed - all data comes from backend API

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