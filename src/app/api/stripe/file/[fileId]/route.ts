import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;

  const res = await fetch(`https://files.stripe.com/v1/files/${fileId}/contents`, {
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const contentType = res.headers.get('content-type') || 'image/png';
  const buffer = await res.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
