'use client';

import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';

interface ClientOnlyDateProps {
  date: string;
}

/**
 * ClientOnlyDate component
 * 
 * This component renders dates only on the client side to prevent
 * hydration mismatches between server and client rendering.
 * During SSR, it renders nothing, then on client it renders the formatted date.
 */
export default function ClientOnlyDate({ date }: ClientOnlyDateProps) {
  // Start with empty state during SSR
  const [mounted, setMounted] = useState(false);
  
  // After hydration, set mounted to true
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Only render the date on the client side
  if (!mounted) {
    // Return empty placeholder during SSR to avoid hydration mismatch
    return <span className="opacity-0">Loading...</span>;
  }
  
  // Client-side only rendering of the date
  return <span>{formatDate(date)}</span>;
}
