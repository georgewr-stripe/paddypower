import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  // Search for existing customer by email
  const existing = await stripe.customers.list({ email, limit: 1 });

  if (existing.data.length > 0) {
    const customer = existing.data[0];
    return NextResponse.json({
      id: customer.id,
      email: customer.email,
      name: customer.name,
      recipientId: customer.metadata?.recipient_id || undefined,
      verified: customer.metadata?.verified === 'true',
    });
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email,
    metadata: {
      source: 'paddy-power-demo',
      verified: 'false',
    },
  });

  return NextResponse.json({
    id: customer.id,
    email: customer.email,
    name: customer.name,
    verified: false,
  });
}
