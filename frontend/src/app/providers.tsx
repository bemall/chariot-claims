'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

/**
 * React Query provider component
 * 
 * Sets up React Query for the application with optimal configuration for a payment/ledger system:
 * - Stale time of 60 seconds to reduce unnecessary refetches
 * - Refetch on window focus for real-time updates
 * - Devtools for development debugging (only visible in development)
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 60 seconds
        refetchOnWindowFocus: true,
        retry: 1,
        // Prevent cache issues that can lead to ChunkLoadError
        gcTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
