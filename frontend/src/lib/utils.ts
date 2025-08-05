export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Format a date string consistently between server and client rendering
 * 
 * This implementation uses a deterministic approach that guarantees
 * identical output on both server and client, preventing hydration mismatches.
 * 
 * @param dateString - ISO date string or YYYY-MM-DD format
 * @returns Formatted date string (e.g., "Jul 15, 2025")
 */
export function formatDate(dateString: string): string {
  // Handle empty or invalid input
  if (!dateString) return '';
  
  try {
    // For YYYY-MM-DD format (most common in our API)
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-').map(Number);
      // Validate date components
      if (isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
        return 'Invalid date';
      }
      // JavaScript months are 0-indexed in arrays
      const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1];
      return `${monthName} ${day}, ${year}`;
    }
    
    // For ISO format with time and timezone (e.g., 2025-07-15T10:00:00Z)
    // Extract just the date portion to avoid timezone issues
    const datePart = dateString.split('T')[0];
    if (datePart && datePart.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = datePart.split('-').map(Number);
      // Validate date components
      if (isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
        return 'Invalid date';
      }
      // JavaScript months are 0-indexed in arrays
      const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1];
      return `${monthName} ${day}, ${year}`;
    }
    
    // Fallback for other formats - use string manipulation instead of Date objects
    // to avoid timezone inconsistencies between server and client
    return 'Invalid date format';
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Error formatting date';
  }
}

export function isWithin24Hours(dateString: string): boolean {
  const paymentDate = new Date(dateString);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return paymentDate <= tomorrow;
}

export function isWithinSevenDays(dateString: string): boolean {
  // Use UTC date methods to ensure consistent rendering between server and client
  const paymentDate = new Date(dateString);
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  const now = new Date();
  
  // Compare using UTC timestamps to avoid timezone issues
  return paymentDate.getTime() <= sevenDaysFromNow.getTime() && paymentDate.getTime() >= now.getTime();
}

// Keep the old function for backward compatibility but make it use the new 7-day logic
export function isWithinTwoWeeks(dateString: string): boolean {
  return isWithinSevenDays(dateString);
}

export function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
