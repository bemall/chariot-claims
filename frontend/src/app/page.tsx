import PaymentTable from '@/components/PaymentTable';
import { paymentAPI } from '@/lib/api';
import { PaymentFilters } from '@/lib/types';

/**
 * Home page component with server-side data fetching
 * 
 * This is a Server Component that fetches the initial payment data on the server
 * before rendering the page. This provides several benefits:
 * - Faster initial page load (data is included in the HTML)
 * - Better SEO (search engines see the fully rendered content)
 * - Reduced client-side JavaScript needed for initial render
 */
export default async function Home({
  searchParams
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  // Create a filters object with only the needed properties to avoid searchParams access issues
  // This approach avoids using Object.keys, Object.entries, or other methods that cause the await error
  const filters: PaymentFilters = {
    recipient: searchParams.recipient || undefined,
    status: searchParams.status || undefined,
    after: searchParams.after || undefined,
  };
  
  // Server-side data fetching with filters from URL
  const initialData = await paymentAPI.getPayments(filters);
  const initialSummary = await paymentAPI.getPaymentSummary(filters);
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Payment Dashboard</h1>
      <PaymentTable 
        initialData={initialData}
        initialSummary={initialSummary}
      />
    </div>
  );
}
