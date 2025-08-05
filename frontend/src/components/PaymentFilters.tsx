'use client';

import { useState, useEffect } from 'react';
import type { PaymentFilters } from '@/lib/types';

interface PaymentFiltersProps {
  onFilterChange: (filters: Partial<PaymentFilters>) => void;
  onClearFilters: () => void;
  currentFilters: PaymentFilters;
}

/**
 * PaymentFilters component for filtering payments
 * 
 * This component is used to filter payments by recipient, date, status, and claim type.
 * It uses URL-based state management for shareable filtered views.
 * Enhanced with visual feedback and improved UX.
 */
export default function PaymentFilters({ 
  onFilterChange, 
  onClearFilters,
  currentFilters 
}: PaymentFiltersProps) {
  // Track active filters for visual feedback
  const [activeFilterCount, setActiveFilterCount] = useState<number>(0);
  
  // Update active filter count whenever filters change
  useEffect(() => {
    const count = Object.values(currentFilters).filter(value => value !== undefined && value !== '').length;
    setActiveFilterCount(count);
  }, [currentFilters]);

  const handleChange = (key: keyof PaymentFilters, value: string) => {
    // Only update if the value has changed
    if (currentFilters[key] !== value) {
      onFilterChange({ [key]: value || undefined });
    }
  };

  // Get class names for filter inputs based on whether they have values
  const getInputClasses = (key: keyof PaymentFilters) => {
    const baseClasses = "w-full rounded-md shadow-sm focus:border-chariot-blue focus:ring-chariot-blue transition-all duration-200";
    return currentFilters[key] 
      ? `${baseClasses} border-blue-500 bg-blue-50` 
      : `${baseClasses} border-gray-300`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <button
          onClick={onClearFilters}
          className={`text-sm px-3 py-1 rounded-md transition-all ${activeFilterCount > 0 
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
            : 'text-gray-400 cursor-not-allowed'}`}
          disabled={activeFilterCount === 0}
        >
          Clear all
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipient
          </label>
          <input
            type="text"
            value={currentFilters.recipient || ''}
            onChange={(e) => handleChange('recipient', e.target.value)}
            className={getInputClasses('recipient')}
            placeholder="Filter by recipient..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Scheduled After
          </label>
          <input
            type="date"
            value={currentFilters.after || ''}
            onChange={(e) => handleChange('after', e.target.value)}
            className={getInputClasses('after')}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={currentFilters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            className={getInputClasses('status')}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Claim Type
          </label>
          <select
            value={currentFilters.claim_type || ''}
            onChange={(e) => handleChange('claim_type', e.target.value)}
            className={getInputClasses('claim_type')}
          >
            <option value="">All Claim Types</option>
            <option value="Auto Insurance">Auto Insurance</option>
            <option value="Health Insurance">Health Insurance</option>
            <option value="Property Damage">Property Damage</option>
            <option value="Personal Property">Personal Property</option>
            <option value="Travel Insurance">Travel Insurance</option>
            <option value="Rent Gouging">Rent Gouging</option>
            <option value="For Sale">For Sale</option>
            <option value="Supplements">Supplements</option>
          </select>
        </div>
      </div>
    </div>
  );
}
