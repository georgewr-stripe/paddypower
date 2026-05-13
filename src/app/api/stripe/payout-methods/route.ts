import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const recipientId = searchParams.get('recipientId');

  if (!recipientId) {
    return NextResponse.json({ error: 'recipientId is required' }, { status: 400 });
  }

  try {
    const payoutMethods = await stripe.v2.moneyManagement.payoutMethods.list(
      {},
      { stripeContext: recipientId },
    );

    const methods = payoutMethods.data.map((pm) => ({
      id: pm.id,
      type: pm.type,
      usageStatus: pm.usage_status,
      availablePayoutSpeeds: pm.available_payout_speeds || [],
      ...(pm.bank_account && {
        bankAccount: {
          last4: pm.bank_account.last4,
          bankName: pm.bank_account.bank_name,
          country: pm.bank_account.country,
          supportedCurrencies: pm.bank_account.supported_currencies,
        },
      }),
      ...(pm.card && {
        card: {
          last4: pm.card.last4,
          expMonth: pm.card.exp_month,
          expYear: pm.card.exp_year,
        },
      }),
    }));

    return NextResponse.json({ data: methods });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to list payout methods';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
