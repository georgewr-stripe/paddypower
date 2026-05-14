import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get('customerId');

  if (!customerId) {
    return NextResponse.json({ balance: 0 });
  }

  let deposits = 0;
  let withdrawals = 0;

  const customer = await stripe.customers.retrieve(customerId) as { metadata: Record<string, string> };
  const winnings = parseInt(customer.metadata?.winnings || '0', 10);

  // Sum all successful payments for this customer
  const payments = await stripe.paymentIntents.list({
    customer: customerId,
    limit: 100,
  });

  for (const pi of payments.data) {
    if (pi.status === 'succeeded') {
      deposits += pi.amount;
    }
  }

  // Sum outbound payments (withdrawals)
  try {
    const outboundPayments = await stripe.treasury.outboundPayments.list({
      financial_account: process.env.STRIPE_FINANCIAL_ACCOUNT_ID || '',
      limit: 100,
    });

    for (const op of outboundPayments.data) {
      if (op.metadata?.customerId === customerId && (op.status === 'posted' || op.status === 'processing')) {
        withdrawals += op.amount;
      }
    }
  } catch {
    // Treasury may not be enabled
  }

  const balanceCents = deposits + winnings - withdrawals;

  return NextResponse.json({
    balance: Math.max(0, balanceCents) / 100,
    deposits: deposits / 100,
    winnings: winnings / 100,
    withdrawals: withdrawals / 100,
  });
}
