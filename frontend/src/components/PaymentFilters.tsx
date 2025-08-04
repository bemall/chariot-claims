'use client';

import { useState } from 'react';
import { PaymentFilters as Filters } from '@/lib/api';

interface PaymentFiltersProps {
  onFilterChange: (filters: Filters) => void;
}

export default function PaymentFilters({ onFilterChange }: PaymentFiltersProps) {
  const [filters, setFilters] = useState<Filters>({});

  const handleChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear all
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipient
          </label>
          <input
            type="text"
            value={filters.recipient || ''}
            onChange={(e) => handleChange('recipient', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-chariot-blue focus:ring-chariot-blue"
            placeholder="Filter by recipient..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Scheduled After
          </label>
          <input
            type="date"
            value={filters.after || ''}
            onChange={(e) => handleChange('after', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-chariot-blue focus:ring-chariot-blue"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-chariot-blue focus:ring-chariot-blue"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    </div>
  );
}
