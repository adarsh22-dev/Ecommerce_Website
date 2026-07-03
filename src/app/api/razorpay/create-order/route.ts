import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, receipt } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const key = process.env.RAZORPAY_SECRET_KEY;
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_PUBLISHABLE_KEY;

    if (!key || !keyId) {
      return NextResponse.json(
        { error: "Razorpay not configured. Set RAZORPAY_SECRET_KEY and NEXT_PUBLIC_RAZORPAY_PUBLISHABLE_KEY in .env" },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${keyId}:${key}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: currency || "INR",
        receipt: receipt || `receipt_${Date.now()}`,
        payment_capture: 1,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Razorpay API error:", data);
      return NextResponse.json(
        { error: data.error?.description || "Failed to create Razorpay order" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      razorpay_order_id: data.id,
      amount: data.amount,
      currency: data.currency,
    });
  } catch (error) {
    console.error("create-order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}