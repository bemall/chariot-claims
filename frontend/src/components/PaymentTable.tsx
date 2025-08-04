'use client';

import { useState, useEffect, useCallback } from 'react';
import { Payment, PaymentFilters as PaymentFiltersType, PaymentSummary, paymentAPI } from '@/lib/api';
import { formatCurrency, formatDate, classNames } from '@/lib/utils';
import PaymentFilters from './PaymentFilters';
import LoadingSpinner from './LoadingSpinner';

export default function PaymentTable() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PaymentFiltersType>({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [summaryData, setSummaryData] = useState<PaymentSummary | null>(null);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [paymentsData, summaryResult] = await Promise.all([
        paymentAPI.getPayments(filters),
        paymentAPI.getPaymentSummary(filters),
      ]);
      
      setPayments(paymentsData.results);
      setTotalAmount(summaryResult.total_amount);
      setSummaryData(summaryResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payments');
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleFilterChange = (newFilters: PaymentFiltersType) => {
    setFilters(newFilters);
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Pending Payments</h1>
        <button 
          onClick={fetchPayments}
          className="btn-primary"
          disabled={loading}
        >
          Refresh
        </button>
      </div>
      
      {/* Filters */}
      <PaymentFilters onFilterChange={handleFilterChange} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900">Total Amount</h3>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalAmount, 'USD')}
          </p>
        </div>
        
        <div className="card bg-green-50 border-green-200">
          <h3 className="text-lg font-semibold text-green-900">Payment Count</h3>
          <p className="text-2xl font-bold text-green-600">
            {payments.length}
          </p>
        </div>
        
        <div className="card bg-purple-50 border-purple-200">
          <h3 className="text-lg font-semibold text-purple-900">Claim Type Breakdown</h3>
          <div className="space-y-1">
            {summaryData?.claim_type_breakdown && Object.keys(summaryData.claim_type_breakdown).length > 0 ? (
              Object.entries(summaryData.claim_type_breakdown).map(([claimType, amount]) => (
                <p key={claimType} className="text-sm">
                  <span className="font-medium">{claimType}:</span> {formatCurrency(Number(amount), 'USD')}
                </p>
              ))
            ) : (
              <p className="text-sm">No claim type data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((payment, index) => (
                  <tr
                    key={payment.id}
                    className={classNames(
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-yellow-50',
                      'hover:bg-gray-100 transition-colors animate-slide-up'
                    )}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.recipient}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold">
                        {formatCurrency(payment.amount, payment.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(payment.scheduled_date)}
                      </div>
                      {payment.is_due_soon && (
                        <span className="text-xs text-yellow-600 font-semibold">
                          Due Soon
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={classNames(
                        'px-2 py-1 text-xs rounded-full font-medium',
                        getStatusColor(payment.status)
                      )}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {payment.description || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

