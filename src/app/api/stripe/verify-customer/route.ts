import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const { customerId, name } = await request.json();

  if (!customerId) {
    return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
  }

  await stripe.customers.update(customerId, {
    ...(name && { name }),
    metadata: {
      verified: 'true',
    },
  });

  return NextResponse.json({ verified: true });
}
