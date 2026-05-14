import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const { customerId, customerAccount } = await request.json();

  if (!customerId) {
    return NextResponse.json({ error: 'Missing customerId' }, { status: 400 });
  }

  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    customer_account: customerAccount || undefined,
    automatic_payment_methods: { enabled: true },
    usage: 'on_session',
  });

  return NextResponse.json({
    clientSecret: setupIntent.client_secret,
  });
}
