import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const { customerId, stake, odds, description } = await request.json();

  if (!customerId || !stake || !odds) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const winningsAmount = Math.round(stake * odds);

  const customer = await stripe.customers.retrieve(customerId) as { metadata: Record<string, string> };
  const currentWinnings = parseInt(customer.metadata?.winnings || '0', 10);
  const newWinnings = currentWinnings + winningsAmount;

  await stripe.customers.update(customerId, {
    metadata: {
      winnings: String(newWinnings),
    },
  });

  return NextResponse.json({
    won: true,
    winningsAmount: winningsAmount / 100,
    totalWinnings: newWinnings / 100,
    description,
  });
}
