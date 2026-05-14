import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const { amount, currency, customerId, paymentMethodId } = await request.json();

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: currency || 'gbp',
    customer: customerId,
    payment_method: paymentMethodId,
    confirm: true,
    off_session: true,
    metadata: {
      type: 'deposit',
      source: 'paddy-power-demo',
    },
  });

  return NextResponse.json({
    status: paymentIntent.status,
    id: paymentIntent.id,
  });
}
