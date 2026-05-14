import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const { paymentMethodId } = await request.json();

  if (!paymentMethodId) {
    return NextResponse.json({ error: 'Missing paymentMethodId' }, { status: 400 });
  }

  await stripe.paymentMethods.detach(paymentMethodId);

  return NextResponse.json({ success: true });
}
