import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("razorpay-signature");

    // In production, verify the webhook signature
    // const crypto = require("crypto");
    // const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    //   .update(body).digest("hex");
    // if (signature !== expectedSignature) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    // }

    const event = JSON.parse(body);

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const supabase = await createClient();

        // Update order payment status
        await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            razorpay_payment_id: paymentIntent.id,
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_payment_id", paymentIntent.id);

        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const supabase = await createClient();

        await supabase
          .from("orders")
          .update({
            payment_status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_payment_id", paymentIntent.id);

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
