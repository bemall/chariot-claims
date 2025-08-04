import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaymentTable from '../PaymentTable';
import { paymentAPI } from '@/lib/api';

// Mock the API
jest.mock('@/lib/api', () => ({
  paymentAPI: {
    getPayments: jest.fn(),
    getPaymentSummary: jest.fn(),
  },
}));

describe('PaymentTable', () => {
  const mockPayments = {
    count: 2,
    next: null,
    previous: null,
    results: [
      {
        id: 'txn_001',
        amount: 1000,
        currency: 'USD',
        scheduled_date: '2025-07-31',
        recipient: 'John Doe',
        status: 'pending',
        is_due_soon: true,
        created_at: '2025-07-30T00:00:00Z',
        updated_at: '2025-07-30T00:00:00Z',
      },
      {
        id: 'txn_002',
        amount: 2000,
        currency: 'USD',
        scheduled_date: '2025-08-15',
        recipient: 'Jane Smith',
        status: 'pending',
        is_due_soon: false,
        created_at: '2025-07-30T00:00:00Z',
        updated_at: '2025-07-30T00:00:00Z',
      },
    ],
  };

  const mockSummary = {
    total_amount: 3000,
    payment_count: 2,
    filters_applied: {},
    currency_breakdown: { USD: 3000 },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (paymentAPI.getPayments as jest.Mock).mockResolvedValue(mockPayments);
    (paymentAPI.getPaymentSummary as jest.Mock).mockResolvedValue(mockSummary);
  });

  it('renders payment table with data', async () => {
    render(<PaymentTable />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    const johnRow = screen.getByText('John Doe').closest('tr');
    expect(johnRow).toHaveClass('bg-yellow-50');

    expect(screen.getByText('$3,000.00')).toBeInTheDocument();
  });

  it('filters by recipient', async () => {
    const user = userEvent.setup();
    render(<PaymentTable />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const recipientInput = screen.getByPlaceholderText('Filter by recipient...');
    await user.type(recipientInput, 'John');

    await waitFor(() => {
      expect(paymentAPI.getPayments).toHaveBeenCalledWith({ recipient: 'John' });
    });
  });

  it('handles loading state', () => {
    render(<PaymentTable />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    (paymentAPI.getPayments as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch')
    );

    render(<PaymentTable />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
  });
});
