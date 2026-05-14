import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get('customerId');

  if (!customerId) {
    return NextResponse.json({ paymentMethods: [] });
  }

  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) {
    return NextResponse.json({ paymentMethods: [] });
  }

  const paymentMethods = await stripe.customers.listPaymentMethods(customerId, {
    limit: 20,
  });

  return NextResponse.json({
    paymentMethods: paymentMethods.data.map((pm) => ({
      id: pm.id,
      type: pm.type,
      brand: pm.card?.brand || null,
      last4: pm.card?.last4 || null,
      expMonth: pm.card?.exp_month || null,
      expYear: pm.card?.exp_year || null,
      bankName: pm.us_bank_account?.bank_name || pm.sepa_debit?.bank_code || null,
      bankLast4: pm.us_bank_account?.last4 || pm.sepa_debit?.last4 || null,
      email: pm.link?.email || pm.paypal?.payer_email || null,
    })),
  });
}
