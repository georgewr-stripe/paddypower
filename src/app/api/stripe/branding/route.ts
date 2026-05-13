import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET() {
  try {
    const account = await stripe.accounts.retrieveCurrent();

    const branding = account.settings?.branding;
    const name = account.settings?.dashboard?.display_name || account.business_profile?.name || '';

    const logoUrl = branding?.logo ? `/api/stripe/file/${branding.logo}` : '';
    const iconUrl = branding?.icon ? `/api/stripe/file/${branding.icon}` : '';

    return NextResponse.json({
      name: name || undefined,
      logoUrl: logoUrl || undefined,
      iconUrl: iconUrl || undefined,
      primaryColor: branding?.primary_color || undefined,
      secondaryColor: branding?.secondary_color || undefined,
    });
  } catch (error) {
    console.error('Failed to fetch Stripe branding:', error);
    return NextResponse.json({});
  }
}
