import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST() {
  const session = await stripe.financialConnections.sessions.create({
    account_holder: { type: 'customer', customer: 'cus_demo' },
    permissions: ['balances', 'payment_method'],
  });

  return NextResponse.json({
    clientSecret: session.client_secret,
    sessionId: session.id,
  });
}
