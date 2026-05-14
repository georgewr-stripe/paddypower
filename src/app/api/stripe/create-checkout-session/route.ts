import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const { amount, currency, customerId, description } = await request.json();

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'elements',
    customer: customerId || undefined,
    line_items: [
      {
        price_data: {
          currency: currency || 'gbp',
          product_data: {
            name: description || 'Account Deposit',
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    return_url: `${request.headers.get('origin') || 'http://localhost:3000'}/account/deposit?session_id={CHECKOUT_SESSION_ID}`,
    saved_payment_method_options: {
      payment_method_save: 'enabled',
    },
    metadata: {
      type: 'deposit',
      source: 'paddy-power-demo',
    },
  });

  return NextResponse.json({
    clientSecret: session.client_secret,
    sessionId: session.id,
  });
}
