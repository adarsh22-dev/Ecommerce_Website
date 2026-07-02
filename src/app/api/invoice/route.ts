import { getInvoiceHtml } from "@/lib/services/invoice";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId parameter" },
        { status: 400 }
      );
    }

    const html = await getInvoiceHtml(orderId);
    if (!html) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (error) {
    console.error("[Invoice] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}
