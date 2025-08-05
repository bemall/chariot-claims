/**
 * Types for the payment and ledger application
 */

/**
 * Payment status options
 */
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * Payment object structure
 * Matches the structure from the backend API and mock data
 */
export interface Payment {
  id: string;
  recipient: string;
  recipient_name?: string;
  recipient_account?: string;
  amount: number;
  currency: string;
  status: string;
  scheduled_date: string;
  created_at: string;
  updated_at: string;
  payment_method?: string;
  description?: string;
  is_due_soon?: boolean;
  claim_type?: string;
}

/**
 * Payment filters structure
 * Used for filtering payments in the UI and API requests
 */
export interface PaymentFilters {
  recipient?: string;
  status?: string;
  after?: string;
  before?: string;
  min_amount?: string;
  max_amount?: string;
  payment_method?: string;
  search?: string;
  claim_type?: string;
}

/**
 * API response structure for paginated payment data
 */
export interface PaymentResponse {
  results: Payment[];
  count: number;
  next: string | null;
  previous: string | null;
}
