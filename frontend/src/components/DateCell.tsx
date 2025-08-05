'use client';

import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';

interface DateCellProps {
  date: string;
}

/**
 * DateCell component
 * 
 * This component handles date rendering in a way that avoids hydration mismatches
 * by only rendering the formatted date on the client side after hydration.
 * 
 * @param date - ISO date string to format
 */
export default function DateCell({ date }: DateCellProps) {
  const [formattedDate, setFormattedDate] = useState('');
  
  useEffect(() => {
    setFormattedDate(formatDate(date));
  }, [date]);
  
  return <span>{formattedDate}</span>;
}
