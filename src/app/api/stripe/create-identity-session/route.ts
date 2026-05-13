import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  const sessionParams: Parameters<typeof stripe.identity.verificationSessions.create>[0] = {
    type: 'document',
    provided_details: {
      email: body.email || undefined,
    },
    options: {
      document: {
        require_matching_selfie: true,
      },
    },
    metadata: {
      source: 'paddy-power-demo',
      flow: body.flow || 'onboarding',
      customer_id: body.customerId || '',
    },
  };

  if (body.customerId) {
    sessionParams.related_customer = body.customerId;
  }

  const session = await stripe.identity.verificationSessions.create(sessionParams);

  return NextResponse.json({
    clientSecret: session.client_secret,
    sessionId: session.id,
  });
}
