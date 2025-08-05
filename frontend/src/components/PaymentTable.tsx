'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { PaymentResponse } from '@/lib/types';
import { PaymentSummary, paymentAPI } from '@/lib/api';
import { formatCurrency, formatDate, classNames, isWithin24Hours } from '@/lib/utils';
import PaymentFilterComponent from './PaymentFilters';
import LoadingSpinner from './LoadingSpinner';
import { useFilterState } from '@/hooks/useFilterState';



interface PaymentTableProps {
  initialData?: PaymentResponse;
  initialSummary?: PaymentSummary;
}

/**
 * PaymentTable component with hybrid data fetching approach
 * 
 * This component uses a hybrid approach for data fetching:
 * 1. Initial data is provided by the server component (SSR)
 * 2. Subsequent data fetching is handled by React Query (CSR)
 * 3. Filter state is managed in the URL for shareable filtered views
 */
export default function PaymentTable({
  initialData,
  initialSummary
}: PaymentTableProps) {
  // Get the query client instance
  const queryClient = useQueryClient();
  
  // Use URL-based filter state management
  const { filters, updateFilters, clearFilters } = useFilterState();
  
  // React Query for client-side data fetching with initial SSR data
  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({
    queryKey: ['payments', filters],
    queryFn: () => paymentAPI.getPayments(filters),
    initialData,
    staleTime: 30000, // 30 seconds
  });
  
  // React Query for summary data with initial SSR data
  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ['paymentSummary', filters],
    queryFn: () => paymentAPI.getPaymentSummary(filters),
    initialData: initialSummary,
    staleTime: 30000, // 30 seconds
  });
  
  // Calculate accurate total amount from actual payment data
  const calculatedTotalAmount = paymentsData?.results?.reduce(
    (sum, payment) => {
      // Ensure amount is a valid number before adding
      const amount = typeof payment.amount === 'number' ? payment.amount : 
                    (typeof payment.amount === 'string' ? parseFloat(payment.amount) : 0);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 
    0
  ) || 0;
  
  // Function to refresh data with window reload for complete refresh
  const refreshData = () => {
    // First invalidate queries to trigger React Query refetch
    queryClient.invalidateQueries({ queryKey: ['payments'] });
    queryClient.invalidateQueries({ queryKey: ['paymentSummary'] });
    
    // Then reload the page to ensure complete refresh
    window.location.reload();
  };
  
  // Loading state combines both queries
  const isLoading = paymentsLoading || summaryLoading;
  
  // Extract data for rendering
  const payments = paymentsData?.results || [];
  // Use calculated total amount for accuracy and ensure it's a valid number
  const totalAmount = isNaN(calculatedTotalAmount) ? 0 : calculatedTotalAmount;
  // Get the actual payment count from the API response or fallback to array length
  const paymentCount = paymentsData?.count || payments.length || 0;
  
  // Status color mapping helper
  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Payment Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">
            {paymentCount} payment{paymentCount !== 1 ? 's' : ''} found
          </p>
        </div>
        <button 
          onClick={refreshData}
          className="btn-primary flex items-center gap-2"
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
      
      {/* Filters */}
      <PaymentFilterComponent 
        onFilterChange={(newFilters) => updateFilters(newFilters)} 
        onClearFilters={clearFilters}
        currentFilters={filters}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-blue-50 border-blue-200 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-blue-900">Total Amount</h3>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalAmount, 'USD')}
          </p>
          <p className="text-xs text-blue-500 mt-2">
            Average: {formatCurrency(paymentCount > 0 ? totalAmount / paymentCount : 0, 'USD')}
          </p>
        </div>
        
        <div className="card bg-green-50 border-green-200 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-green-900">Payment Status</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(summaryData?.status_counts || {}).length > 0 ? (
              Object.entries(summaryData?.status_counts || {}).map(([status, count]) => (
                <div key={status} className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-1 ${getStatusColor(status).replace('text-', 'bg-')}`}></span>
                  <span className="text-sm">
                    {status}: <span className="font-semibold">{count}</span>
                  </span>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No payment status data available</div>
            )}
          </div>
        </div>
        
        <div className="card bg-purple-50 border-purple-200 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-purple-900">Claim Type Breakdown</h3>
          <div className="space-y-1 mt-2 max-h-24 overflow-y-auto">
            {summaryData?.claim_type_breakdown && Object.keys(summaryData.claim_type_breakdown).length > 0 ? (
              Object.entries(summaryData.claim_type_breakdown).map(([claimType, amount]) => (
                <div key={claimType} className="flex justify-between items-center text-sm">
                  <span className="font-medium truncate max-w-[70%]">{claimType}:</span>
                  <span>{formatCurrency(Number(amount), 'USD')}</span>
                </div>
              ))
            ) : (
              <p className="text-sm">No claim type data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Payment Table */}
      <div className="bg-white shadow-lg overflow-hidden rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claim Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.recipient || 'No recipient'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(payment.amount, payment.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col">
                        <>
                          <span suppressHydrationWarning className="font-medium">
                            {formatDate(payment.scheduled_date)}
                          </span>
                          {isWithin24Hours(payment.scheduled_date) && (
                            <span className="text-xs font-medium text-amber-600 mt-1 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Due soon
                            </span>
                          )}
                        </>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={classNames(
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        getStatusColor(payment.status)
                      )}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.claim_type ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                          {payment.claim_type}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Not specified</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.description ? (
                        <span className="line-clamp-2">{payment.description}</span>
                      ) : (
                        <span className="text-gray-400 italic">No description</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-chariot-blue hover:text-chariot-blue-dark mr-2">
                        View
                      </button>
                      <button className="text-chariot-blue hover:text-chariot-blue-dark">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

