import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (secret) {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");
      if (signature !== expectedSignature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const event = JSON.parse(body);

    switch (event.type) {
      case "payment_intent.succeeded":
      case "order.paid": {
        const payload = event.payload || event.data?.object || {};
        const razorpayOrderId = payload.order?.entity?.id || payload.id;
        const razorpayPaymentId = payload.payment?.entity?.id || payload.id;

        if (!razorpayOrderId) break;

        const supabase = await createClient();
        await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            razorpay_payment_id: razorpayPaymentId,
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_order_id", razorpayOrderId);

        break;
      }
      case "payment_intent.payment_failed":
      case "order.failed": {
        const failPayload = event.payload || event.data?.object || {};
        const failOrderId = failPayload.order?.entity?.id || failPayload.id;

        if (!failOrderId) break;

        const supabase = await createClient();
        await supabase
          .from("orders")
          .update({
            payment_status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_order_id", failOrderId);

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

import crypto from "crypto";