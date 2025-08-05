// Mock data for payments
export const mockPayments = [
  {
    id: '1',
    amount: 1250.00,
    currency: 'USD',
    status: 'completed',
    created_at: '2025-07-15T10:30:00Z',
    updated_at: '2025-07-15T10:35:00Z',
    recipient_name: 'John Smith',
    recipient_account: 'ACCT123456',
    recipient: 'John Smith',
    payment_method: 'direct_deposit',
    description: 'Auto claim payment',
    scheduled_date: '2025-07-15',
    is_due_soon: false,
    claim_type: 'Rent Gouging'
  },
  {
    id: '2',
    amount: 750.50,
    currency: 'USD',
    status: 'pending',
    created_at: '2025-07-20T14:20:00Z',
    updated_at: '2025-07-20T14:25:00Z',
    recipient_name: 'Jane Doe',
    recipient_account: 'ACCT789012',
    recipient: 'Jane Doe',
    payment_method: 'check',
    description: 'Property damage claim',
    scheduled_date: '2025-07-22',
    is_due_soon: true,
    claim_type: 'For Sale'
  },
  {
    id: '3',
    amount: 3200.75,
    currency: 'USD',
    status: 'completed',
    created_at: '2025-07-25T09:15:00Z',
    updated_at: '2025-07-25T09:20:00Z',
    recipient_name: 'Robert Johnson',
    recipient_account: 'ACCT345678',
    recipient: 'Robert Johnson',
    payment_method: 'direct_deposit',
    description: 'Medical expenses claim',
    scheduled_date: '2025-07-25',
    is_due_soon: false,
    claim_type: 'Supplements'
  },
  {
    id: '4',
    amount: 1875.25,
    currency: 'USD',
    status: 'processing',
    created_at: '2025-07-26T11:30:00Z',
    updated_at: '2025-07-26T11:35:00Z',
    recipient_name: 'Emily Wilson',
    recipient_account: 'ACCT456789',
    recipient: 'Emily Wilson',
    payment_method: 'direct_deposit',
    description: 'Vehicle repair claim',
    scheduled_date: '2025-07-28',
    is_due_soon: true
  },
  {
    id: '5',
    amount: 950.00,
    currency: 'USD',
    status: 'pending',
    created_at: '2025-07-27T13:45:00Z',
    updated_at: '2025-07-27T13:50:00Z',
    recipient_name: 'Michael Brown',
    recipient_account: 'ACCT567890',
    recipient: 'Michael Brown',
    payment_method: 'check',
    description: 'Property damage assessment',
    scheduled_date: '2025-07-30',
    is_due_soon: true
  },
  {
    id: '6',
    amount: 2450.75,
    currency: 'USD',
    status: 'completed',
    created_at: '2025-07-15T16:20:00Z',
    updated_at: '2025-07-15T16:25:00Z',
    recipient_name: 'Sarah Davis',
    recipient_account: 'ACCT678901',
    recipient: 'Sarah Davis',
    payment_method: 'direct_deposit',
    description: 'Medical claim reimbursement',
    scheduled_date: '2025-07-15',
    is_due_soon: false
  },
  {
    id: '7',
    amount: 1100.50,
    currency: 'USD',
    status: 'failed',
    created_at: '2025-07-18T10:10:00Z',
    updated_at: '2025-07-18T10:15:00Z',
    recipient_name: 'David Miller',
    recipient_account: 'ACCT789012',
    recipient: 'David Miller',
    payment_method: 'direct_deposit',
    description: 'Auto claim partial payment',
    scheduled_date: '2025-07-18',
    is_due_soon: false,
    claim_type: 'Auto Insurance'
  },
  {
    id: '8',
    amount: 3750.25,
    currency: 'USD',
    status: 'completed',
    created_at: '2025-07-19T14:30:00Z',
    updated_at: '2025-07-19T14:35:00Z',
    recipient_name: 'Jennifer Wilson',
    recipient_account: 'ACCT890123',
    recipient: 'Jennifer Wilson',
    payment_method: 'direct_deposit',
    description: 'Home damage claim',
    scheduled_date: '2025-07-19',
    is_due_soon: false
  },
  {
    id: '9',
    amount: 825.75,
    currency: 'USD',
    status: 'pending',
    created_at: '2025-07-21T09:45:00Z',
    updated_at: '2025-07-21T09:50:00Z',
    recipient_name: 'Thomas Anderson',
    recipient_account: 'ACCT901234',
    recipient: 'Thomas Anderson',
    payment_method: 'check',
    description: 'Personal item claim',
    scheduled_date: '2025-07-24',
    is_due_soon: true,
    claim_type: 'Personal Property'
  },
  {
    id: '10',
    amount: 1950.00,
    currency: 'USD',
    status: 'processing',
    created_at: '2025-07-22T11:15:00Z',
    updated_at: '2025-07-22T11:20:00Z',
    recipient_name: 'Lisa Martinez',
    recipient_account: 'ACCT012345',
    recipient: 'Lisa Martinez',
    payment_method: 'direct_deposit',
    description: 'Vehicle damage claim',
    scheduled_date: '2025-07-25',
    is_due_soon: true,
    claim_type: 'Auto Insurance'
  },
  {
    id: '11',
    amount: 2100.50,
    currency: 'USD',
    status: 'completed',
    created_at: '2025-07-23T13:30:00Z',
    updated_at: '2025-07-23T13:35:00Z',
    recipient_name: 'Daniel Taylor',
    recipient_account: 'ACCT123456',
    recipient: 'Daniel Taylor',
    payment_method: 'direct_deposit',
    description: 'Medical claim payment',
    scheduled_date: '2025-07-23',
    is_due_soon: false,
    claim_type: 'Health Insurance'
  },
  {
    id: '12',
    amount: 875.25,
    currency: 'EUR',
    status: 'pending',
    created_at: '2025-07-24T15:45:00Z',
    updated_at: '2025-07-24T15:50:00Z',
    recipient_name: 'Sophia Clark',
    recipient_account: 'ACCT234567',
    recipient: 'Sophia Clark',
    payment_method: 'check',
    description: 'Travel insurance claim',
    scheduled_date: '2025-07-27',
    is_due_soon: true,
    claim_type: 'Travel Insurance'
  },
  {
    id: '13',
    amount: 3250.00,
    currency: 'USD',
    status: 'completed',
    created_at: '2025-07-15T09:10:00Z',
    updated_at: '2025-07-15T09:15:00Z',
    recipient_name: 'William Adams',
    recipient_account: 'ACCT345678',
    recipient: 'William Adams',
    payment_method: 'direct_deposit',
    description: 'Property damage settlement',
    scheduled_date: '2025-07-15',
    is_due_soon: false
  },
  {
    id: '14',
    amount: 1425.75,
    currency: 'USD',
    status: 'processing',
    created_at: '2025-07-16T11:20:00Z',
    updated_at: '2025-07-16T11:25:00Z',
    recipient_name: 'Olivia Martin',
    recipient_account: 'ACCT456789',
    recipient: 'Olivia Martin',
    payment_method: 'direct_deposit',
    description: 'Auto repair claim',
    scheduled_date: '2025-07-19',
    is_due_soon: true,
    claim_type: 'Auto Insurance'
  },
  {
    id: '15',
    amount: 950.50,
    currency: 'USD',
    status: 'failed',
    created_at: '2025-07-17T14:30:00Z',
    updated_at: '2025-07-17T14:35:00Z',
    recipient_name: 'James Wilson',
    recipient_account: 'ACCT567890',
    recipient: 'James Wilson',
    payment_method: 'direct_deposit',
    description: 'Personal item claim',
    scheduled_date: '2025-07-17',
    is_due_soon: false,
    claim_type: 'Personal Property'
  },
  {
    id: '16',
    amount: 2750.25,
    currency: 'USD',
    status: 'completed',
    created_at: '2025-07-18T16:45:00Z',
    updated_at: '2025-07-18T16:50:00Z',
    recipient_name: 'Emma Thompson',
    recipient_account: 'ACCT678901',
    recipient: 'Emma Thompson',
    payment_method: 'direct_deposit',
    description: 'Home insurance claim',
    scheduled_date: '2025-07-18',
    is_due_soon: false,
    claim_type: 'Property Damage'
  },
  {
    id: '17',
    amount: 1150.00,
    currency: 'GBP',
    status: 'pending',
    created_at: '2025-07-19T09:15:00Z',
    updated_at: '2025-07-19T09:20:00Z',
    recipient_name: 'Alexander Davis',
    recipient_account: 'ACCT789012',
    recipient: 'Alexander Davis',
    payment_method: 'check',
    description: 'Travel insurance claim',
    scheduled_date: '2025-07-22',
    is_due_soon: true,
    claim_type: 'Travel Insurance'
  },
  {
    id: '18',
    amount: 3100.75,
    currency: 'USD',
    status: 'completed',
    created_at: '2025-07-20T11:30:00Z',
    updated_at: '2025-07-20T11:35:00Z',
    recipient_name: 'Mia Johnson',
    recipient_account: 'ACCT890123',
    recipient: 'Mia Johnson',
    payment_method: 'direct_deposit',
    description: 'Property damage claim',
    scheduled_date: '2025-07-20',
    is_due_soon: false,
    claim_type: 'Property Damage'
  },
  {
    id: '19',
    amount: 875.25,
    currency: 'USD',
    status: 'processing',
    created_at: '2025-07-21T13:45:00Z',
    updated_at: '2025-07-21T13:50:00Z',
    recipient_name: 'Benjamin Brown',
    recipient_account: 'ACCT901234',
    recipient: 'Benjamin Brown',
    payment_method: 'direct_deposit',
    description: 'Auto claim payment',
    scheduled_date: '2025-07-24',
    is_due_soon: true,
    claim_type: 'Auto Insurance'
  },
  {
    id: '20',
    amount: 1650.50,
    currency: 'USD',
    status: 'completed',
    created_at: '2025-07-22T16:00:00Z',
    updated_at: '2025-07-22T16:05:00Z',
    recipient_name: 'Charlotte Miller',
    recipient_account: 'ACCT012345',
    recipient: 'Charlotte Miller',
    payment_method: 'direct_deposit',
    description: 'Medical expenses claim',
    scheduled_date: '2025-07-22',
    is_due_soon: false,
    claim_type: 'Health Insurance'
  },
  {
    id: '21',
    amount: 2200.00,
    currency: 'USD',
    status: 'pending',
    created_at: '2025-07-23T09:30:00Z',
    updated_at: '2025-07-23T09:35:00Z',
    recipient_name: 'Henry Wilson',
    recipient_account: 'ACCT123456',
    recipient: 'Henry Wilson',
    payment_method: 'check',
    description: 'Property insurance claim',
    scheduled_date: '2025-07-26',
    is_due_soon: true,
    claim_type: 'Property Damage'
  },
  {
    id: '22',
    amount: 1325.75,
    currency: 'USD',
    status: 'completed',
    created_at: '2025-07-24T11:45:00Z',
    updated_at: '2025-07-24T11:50:00Z',
    recipient_name: 'Amelia Jackson',
    recipient_account: 'ACCT234567',
    recipient: 'Amelia Jackson',
    payment_method: 'direct_deposit',
    description: 'Auto damage claim',
    scheduled_date: '2025-07-24',
    is_due_soon: false,
    claim_type: 'Auto Insurance'
  },
  {
    id: '23',
    amount: 950.25,
    currency: 'EUR',
    status: 'processing',
    created_at: '2025-07-25T14:00:00Z',
    updated_at: '2025-07-25T14:05:00Z',
    recipient_name: 'Sebastian White',
    recipient_account: 'ACCT345678',
    recipient: 'Sebastian White',
    payment_method: 'direct_deposit',
    description: 'Travel insurance claim',
    scheduled_date: '2025-07-28',
    is_due_soon: true,
    claim_type: 'Travel Insurance'
  },
  {
    id: '24',
    amount: 3050.50,
    currency: 'USD',
    status: 'completed',
    created_at: '2025-07-15T16:15:00Z',
    updated_at: '2025-07-15T16:20:00Z',
    recipient_name: 'Lily Harris',
    recipient_account: 'ACCT456789',
    recipient: 'Lily Harris',
    payment_method: 'direct_deposit',
    description: 'Property damage settlement',
    scheduled_date: '2025-07-15',
    is_due_soon: false
  },
  {
    id: '25',
    amount: 1175.25,
    currency: 'USD',
    status: 'failed',
    created_at: '2025-07-16T09:30:00Z',
    updated_at: '2025-07-16T09:35:00Z',
    recipient_name: 'Jack Robinson',
    recipient_account: 'ACCT567890',
    recipient: 'Jack Robinson',
    payment_method: 'direct_deposit',
    description: 'Auto repair claim',
    scheduled_date: '2025-07-16',
    is_due_soon: false,
    claim_type: 'Auto Insurance'
  },
  {
    id: '26',
    amount: 2650.00,
    currency: 'USD',
    status: 'completed',
    created_at: '2025-07-17T11:45:00Z',
    updated_at: '2025-07-17T11:50:00Z',
    recipient_name: 'Chloe Martin',
    recipient_account: 'ACCT678901',
    recipient: 'Chloe Martin',
    payment_method: 'direct_deposit',
    description: 'Medical expenses claim',
    scheduled_date: '2025-07-17',
    is_due_soon: false
  },
  {
    id: '27',
    amount: 925.75,
    currency: 'GBP',
    status: 'pending',
    created_at: '2025-07-18T14:00:00Z',
    updated_at: '2025-07-18T14:05:00Z',
    recipient_name: 'Noah Thompson',
    recipient_account: 'ACCT789012',
    recipient: 'Noah Thompson',
    payment_method: 'check',
    description: 'Travel insurance claim',
    scheduled_date: '2025-07-21',
    is_due_soon: true
  },
  {
    id: '28',
    amount: 3300.25,
    currency: 'USD',
    status: 'completed',
    created_at: '2025-07-19T16:15:00Z',
    updated_at: '2025-07-19T16:20:00Z',
    recipient_name: 'Grace Wilson',
    recipient_account: 'ACCT890123',
    recipient: 'Grace Wilson',
    payment_method: 'direct_deposit',
    description: 'Home damage claim',
    scheduled_date: '2025-07-19',
    is_due_soon: false
  },
  {
    id: '29',
    amount: 1050.50,
    currency: 'USD',
    status: 'processing',
    created_at: '2025-07-20T09:30:00Z',
    updated_at: '2025-07-20T09:35:00Z',
    recipient_name: 'Lucas Davis',
    recipient_account: 'ACCT901234',
    recipient: 'Lucas Davis',
    payment_method: 'direct_deposit',
    description: 'Auto claim payment',
    scheduled_date: '2025-07-23',
    is_due_soon: true
  },
  {
    id: '30',
    amount: 1850.00,
    currency: 'USD',
    status: 'completed',
    created_at: '2025-07-21T11:45:00Z',
    updated_at: '2025-07-21T11:50:00Z',
    recipient_name: 'Zoe Brown',
    recipient_account: 'ACCT012345',
    recipient: 'Zoe Brown',
    payment_method: 'direct_deposit',
    description: 'Property damage claim',
    scheduled_date: '2025-07-21',
    is_due_soon: false
  },
];

// Array of realistic claim descriptions with their types
const claimData = [
  { description: 'Auto collision damage repair', type: 'Rent Gouging' },
  { description: 'Medical expenses reimbursement', type: 'Supplements' },
  { description: 'Property damage assessment', type: 'For Sale' },
  { description: 'Home insurance water damage', type: 'Rent Gouging' },
  { description: 'Personal item theft coverage', type: 'For Sale' },
  { description: 'Vehicle comprehensive claim', type: 'Rent Gouging' },
  { description: 'Liability coverage payment', type: 'Supplements' },
  { description: 'Travel insurance claim', type: 'For Sale' },
  { description: 'Emergency medical evacuation', type: 'Supplements' },
  { description: 'Lost baggage reimbursement', type: 'For Sale' },
  { description: 'Rental car damage coverage', type: 'Rent Gouging' },
  { description: 'Windshield replacement claim', type: 'Rent Gouging' },
  { description: 'Roof repair after storm damage', type: 'For Sale' },
  { description: 'Fire damage restoration', type: 'Rent Gouging' },
  { description: 'Flood damage remediation', type: 'Rent Gouging' },
  { description: 'Personal injury protection', type: 'Supplements' },
  { description: 'Motorcycle accident claim', type: 'Rent Gouging' },
  { description: 'Boat insurance damage', type: 'For Sale' },
  { description: 'Pet medical insurance', type: 'Supplements' },
  { description: 'Jewelry theft insurance', type: 'For Sale' },
  { description: 'Business interruption claim', type: 'For Sale' },
  { description: 'Professional liability claim', type: 'Supplements' },
  { description: 'Workers compensation payment', type: 'Supplements' }
];

// We don't need to extract descriptions separately anymore as we're using claimData directly

// Generate 23 more records to reach 53 total
for (let i = 31; i <= 53; i++) {
  // Determine status based on pattern
  let status = 'pending';
  if (i % 3 === 0) status = 'completed';
  if (i % 7 === 0) status = 'processing';
  if (i % 11 === 0) status = 'failed';
  
  // All payments in USD
  const currency = 'USD';
  
  // Generate random amount between 500 and 5000 with proper formatting
  const amount = parseFloat((Math.random() * 4500 + 500).toFixed(2));
  
  // Calculate date (within last 2 weeks) - using proper date formatting
  const daysAgo = i % 14;
  const formattedDate = `2025-07-${String(15 + daysAgo).padStart(2, '0')}`;
  const createdAt = `${formattedDate}T${String(10 + (i % 8)).padStart(2, '0')}:${String((i * 3) % 60).padStart(2, '0')}:00Z`;
  const updatedAt = `${formattedDate}T${String(10 + (i % 8)).padStart(2, '0')}:${String(((i * 3) % 60) + 5).padStart(2, '0')}:00Z`;
  
  // Is due soon if within next 3 days
  const isDueSoon = daysAgo >= 11;
  
  // Select a random description and its corresponding claim type
  const claimIndex = i % claimData.length;
  const description = claimData[claimIndex].description;
  const claimType = claimData[claimIndex].type;
  
  // Add to mockPayments array
  mockPayments.push({
    id: i.toString(),
    amount: amount,
    currency: currency,
    status: status,
    created_at: createdAt,
    updated_at: updatedAt,
    recipient_name: `Test Recipient ${i}`,
    recipient_account: `ACCT${(i * 111111) % 1000000}`,
    recipient: `Test Recipient ${i}`,
    payment_method: i % 4 === 0 ? 'check' : 'direct_deposit',
    description: description,
    scheduled_date: formattedDate,
    is_due_soon: isDueSoon,
    claim_type: claimType  // Add claim type to each payment
  });
}

// Calculate total amount and ensure it's a valid number
const totalAmount = parseFloat(mockPayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2));

// Calculate claim type breakdown
const claimTypeBreakdown: Record<string, number> = {};
mockPayments.forEach(payment => {
  if (payment.claim_type) {
    if (!claimTypeBreakdown[payment.claim_type]) {
      claimTypeBreakdown[payment.claim_type] = 0;
    }
    claimTypeBreakdown[payment.claim_type] += payment.amount;
  }
});

// Format claim type breakdown values to 2 decimal places
Object.keys(claimTypeBreakdown).forEach(key => {
  claimTypeBreakdown[key] = parseFloat(claimTypeBreakdown[key].toFixed(2));
});

// Mock data for summary - matching the PaymentSummary interface expected by the API
export const mockSummary = {
  total_amount: totalAmount,
  currency_breakdown: {
    USD: parseFloat(mockPayments.filter(p => p.currency === 'USD').reduce((sum, p) => sum + p.amount, 0).toFixed(2))
  },
  claim_type_breakdown: claimTypeBreakdown,
  status_counts: {
    completed: mockPayments.filter(p => p.status === 'completed').length,
    pending: mockPayments.filter(p => p.status === 'pending').length,
    processing: mockPayments.filter(p => p.status === 'processing').length,
    failed: mockPayments.filter(p => p.status === 'failed').length
  }
};
