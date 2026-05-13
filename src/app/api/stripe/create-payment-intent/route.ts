import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const { amount, description, currency, customerId } = await request.json();

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: currency || 'gbp',
    description,
    customer: customerId || undefined,
    automatic_payment_methods: { enabled: true },
    metadata: {
      type: 'deposit',
      source: 'paddy-power-demo',
    },
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    id: paymentIntent.id,
  });
}
