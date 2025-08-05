'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { PaymentFilters } from '@/lib/types';

/**
 * Hook for managing filter state in the URL
 * 
 * This hook provides a way to:
 * 1. Read current filters from URL search params
 * 2. Update filters by pushing new search params to the URL
 * 3. Clear all filters by removing all search params
 * 
 * Using URL-based state management provides several benefits:
 * - Shareable filtered views (users can share URLs with filters applied)
 * - Browser history navigation through different filter states
 * - Persistence across page refreshes
 * - SEO benefits for filtered views
 */
export function useFilterState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Extract current filters from URL search params
  const currentFilters = Object.fromEntries(searchParams.entries());
  
  /**
   * Update filters by pushing new search params to the URL
   * @param filters New filter values to apply
   */
  const updateFilters = useCallback((filters: Partial<PaymentFilters>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    // Only update if there are actual changes
    const newParamsString = params.toString();
    const currentParamsString = searchParams.toString();
    if (newParamsString !== currentParamsString) {
      router.push(`${pathname}?${newParamsString}`);
    }
  }, [router, pathname, searchParams]);
  
  /**
   * Clear all filters by removing all search params
   */
  const clearFilters = useCallback(() => {
    // Only clear if there are actually filters to clear
    if (searchParams.toString() !== '') {
      router.push(pathname);
    }
  }, [router, pathname, searchParams]);
  
  return { 
    filters: currentFilters as PaymentFilters, 
    updateFilters,
    clearFilters
  };
}
