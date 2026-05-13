import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const recipientId = searchParams.get("recipientId");

  if (!recipientId) {
    return NextResponse.json(
      { error: "recipientId is required" },
      { status: 400 },
    );
  }

  try {
    const outboundPayments =
      await stripe.v2.moneyManagement.outboundPayments.list({
        recipient: recipientId,
      });

    const payments = outboundPayments.data.map((op) => ({
      id: op.id,
      status: op.status,
      amount: op.amount,
      description: op.description || null,
      created: op.created,
      expectedArrivalDate: op.expected_arrival_date || null,
      statusTransitions: op.status_transitions || null,
      payoutMethodId: op.to.payout_method,
      recipientId: op.to.recipient,
      receiptUrl: op.receipt_url || null,
      traceId: op.trace_id
        ? { status: op.trace_id.status, value: op.trace_id.value || null }
        : null,
    }));

    return NextResponse.json({ data: payments });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to list outbound payments";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
