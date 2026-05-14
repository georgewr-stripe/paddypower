import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get('customerId');

  if (!customerId) {
    return NextResponse.json({ transactions: [] });
  }

  const transactions: {
    id: string;
    type: 'deposit' | 'bet' | 'winning' | 'withdrawal';
    description: string;
    amount: number;
    date: string;
  }[] = [];

  // Fetch payment intents (deposits & bets)
  const payments = await stripe.paymentIntents.list({
    customer: customerId,
    limit: 50,
  });

  for (const pi of payments.data) {
    if (pi.status !== 'succeeded') continue;

    const isBet = pi.metadata?.type === 'bet' || pi.description?.startsWith('Bet:') || pi.description?.startsWith('Acca:');

    transactions.push({
      id: pi.id,
      type: isBet ? 'bet' : 'deposit',
      description: pi.description || (isBet ? 'Bet placed' : 'Account deposit'),
      amount: isBet ? -(pi.amount / 100) : pi.amount / 100,
      date: new Date(pi.created * 1000).toISOString(),
    });
  }

  // Fetch checkout sessions for deposits that used checkout
  const sessions = await stripe.checkout.sessions.list({
    customer: customerId,
    limit: 50,
  });

  for (const session of sessions.data) {
    if (session.payment_status !== 'paid') continue;
    // Avoid duplicates with payment intents
    if (session.payment_intent && transactions.some(t => t.id === session.payment_intent)) continue;

    transactions.push({
      id: session.id,
      type: 'deposit',
      description: 'Account deposit',
      amount: (session.amount_total || 0) / 100,
      date: new Date(session.created * 1000).toISOString(),
    });
  }

  // Check for winnings in customer metadata
  const customer = await stripe.customers.retrieve(customerId) as { metadata: Record<string, string> };
  const winnings = parseInt(customer.metadata?.winnings || '0', 10);
  if (winnings > 0) {
    transactions.push({
      id: 'winnings-total',
      type: 'winning',
      description: 'Bet winnings',
      amount: winnings / 100,
      date: new Date().toISOString(),
    });
  }

  // Fetch outbound payments (withdrawals)
  try {
    const outboundPayments = await stripe.treasury.outboundPayments.list({
      financial_account: process.env.STRIPE_FINANCIAL_ACCOUNT_ID || '',
      limit: 50,
    });

    for (const op of outboundPayments.data) {
      if (op.metadata?.customerId !== customerId) continue;
      if (op.status !== 'posted' && op.status !== 'processing') continue;

      transactions.push({
        id: op.id,
        type: 'withdrawal',
        description: 'Withdrawal',
        amount: -(op.amount / 100),
        date: new Date(op.created * 1000).toISOString(),
      });
    }
  } catch {
    // Treasury may not be enabled
  }

  // Sort by date descending
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return NextResponse.json({ transactions });
}
