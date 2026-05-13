import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countries = searchParams.get('countries');

  try {
    const params = countries
      ? { countries: countries.split(',') }
      : undefined;

    const spec = await stripe.v2.moneyManagement.payoutMethodsBankAccountSpecs.retrieve(params);

    return NextResponse.json(spec);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch bank account spec';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
