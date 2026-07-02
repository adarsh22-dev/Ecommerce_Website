import { createClient } from "@/lib/supabase/server";

interface InvoiceData {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  billingAddress: string;
  shippingAddress: string;
  items: Array<{
    title: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingCost: number;
  total: number;
  paymentMethod: string;
}

async function fetchInvoiceData(orderId: string): Promise<InvoiceData | null> {
  try {
    const supabase = await createClient();
    const { data: order } = await supabase
      .from("orders")
      .select("*, order_items(*), profiles(full_name, email)")
      .eq("id", orderId)
      .single();

    if (!order) return null;

    return {
      orderNumber: order.order_number,
      orderDate: new Date(order.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      customerName: (order as any).profiles?.full_name || "Customer",
      customerEmail: order.email,
      billingAddress: formatAddress(order.billing_address || order.shipping_address),
      shippingAddress: formatAddress(order.shipping_address),
      items: (order.order_items || []).map((item: any) => ({
        title: item.title,
        sku: item.product_id?.slice(0, 8) || "N/A",
        quantity: item.quantity,
        unitPrice: Number(item.unit_price),
        lineTotal: Number(item.line_total),
      })),
      subtotal: Number(order.subtotal),
      discountAmount: Number(order.discount_amount),
      taxAmount: Number(order.tax_amount),
      shippingCost: Number(order.shipping_cost),
      total: Number(order.total),
      paymentMethod: order.razorpay_payment_id ? "Razorpay" : "Pending",
    };
  } catch {
    return null;
  }
}

function formatAddress(addr: Record<string, unknown> | string | null): string {
  if (!addr) return "N/A";
  if (typeof addr === "string") return addr;
  const a = addr as Record<string, string>;
  return [a.full_name, a.address_line1, a.address_line2, a.city, a.state, a.zip, a.country]
    .filter(Boolean)
    .join(", ");
}

function generateInvoiceHtml(data: InvoiceData): string {
  const itemsHtml = data.items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #ddd;font-size:13px;">
            <div>${item.title}</div>
            <div style="color:#999;font-size:11px;">SKU: ${item.sku}</div>
          </td>
          <td style="padding:10px;border-bottom:1px solid #ddd;text-align:center;font-size:13px;">${item.quantity}</td>
          <td style="padding:10px;border-bottom:1px solid #ddd;text-align:right;font-size:13px;">$${item.unitPrice.toFixed(2)}</td>
          <td style="padding:10px;border-bottom:1px solid #ddd;text-align:right;font-size:13px;">$${item.lineTotal.toFixed(2)}</td>
        </tr>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /></head>
    <body style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;margin:0;padding:40px;color:#333;">
      <div style="max-width:800px;margin:0 auto;border:1px solid #eee;border-radius:12px;overflow:hidden;">

        <!-- Header -->
        <div style="background:#1A1A1A;color:white;padding:40px;display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <h1 style="margin:0;font-size:28px;font-weight:400;letter-spacing:3px;">ECOM</h1>
            <p style="margin:4px 0 0;opacity:0.7;font-size:13px;">Premium Shopping Experience</p>
          </div>
          <div style="text-align:right;">
            <h2 style="margin:0;font-size:13px;font-weight:400;text-transform:uppercase;letter-spacing:2px;opacity:0.7;">Invoice</h2>
            <p style="margin:4px 0 0;font-size:18px;font-weight:600;">#${data.orderNumber}</p>
          </div>
        </div>

        <!-- Date & Payment -->
        <div style="padding:30px 40px;display:flex;justify-content:space-between;border-bottom:1px solid #eee;">
          <div>
            <p style="margin:0;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;">Date</p>
            <p style="margin:4px 0 0;font-size:14px;">${data.orderDate}</p>
          </div>
          <div style="text-align:right;">
            <p style="margin:0;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;">Payment</p>
            <p style="margin:4px 0 0;font-size:14px;">${data.paymentMethod}</p>
          </div>
        </div>

        <!-- Addresses -->
        <div style="padding:30px 40px;display:flex;gap:40px;border-bottom:1px solid #eee;">
          <div style="flex:1;">
            <p style="margin:0;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;">Bill To</p>
            <p style="margin:8px 0 0;font-size:14px;line-height:1.6;">${data.customerName}<br/>${data.billingAddress}</p>
          </div>
          <div style="flex:1;">
            <p style="margin:0;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;">Ship To</p>
            <p style="margin:8px 0 0;font-size:14px;line-height:1.6;">${data.shippingAddress}</p>
          </div>
        </div>

        <!-- Items -->
        <div style="padding:30px 40px;">
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#f8f8f8;">
                <th style="padding:10px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#999;">Item</th>
                <th style="padding:10px;text-align:center;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#999;">Qty</th>
                <th style="padding:10px;text-align:right;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#999;">Price</th>
                <th style="padding:10px;text-align:right;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#999;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <!-- Totals -->
          <div style="margin-top:20px;border-top:2px solid #1A1A1A;padding-top:16px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:6px;font-size:14px;">Subtotal</td>
                <td style="padding:6px;text-align:right;font-size:14px;">$${data.subtotal.toFixed(2)}</td>
              </tr>
              ${data.discountAmount > 0 ? `
                <tr>
                  <td style="padding:6px;font-size:14px;color:#16A34A;">Discount</td>
                  <td style="padding:6px;text-align:right;font-size:14px;color:#16A34A;">-$${data.discountAmount.toFixed(2)}</td>
                </tr>
              ` : ""}
              <tr>
                <td style="padding:6px;font-size:14px;">Shipping</td>
                <td style="padding:6px;text-align:right;font-size:14px;">${data.shippingCost > 0 ? `$${data.shippingCost.toFixed(2)}` : "FREE"}</td>
              </tr>
              <tr>
                <td style="padding:6px;font-size:14px;">Tax</td>
                <td style="padding:6px;text-align:right;font-size:14px;">$${data.taxAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding:8px 6px 6px;font-size:18px;font-weight:700;">Total</td>
                <td style="padding:8px 6px 6px;text-align:right;font-size:22px;font-weight:700;">$${data.total.toFixed(2)}</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding:20px 40px;text-align:center;border-top:1px solid #eee;color:#999;font-size:12px;">
          <p style="margin:0;">Thank you for your business!</p>
          <p style="margin:4px 0 0;">${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function generateInvoicePdf(orderId: string): Promise<{ html: string; filename: string } | null> {
  const data = await fetchInvoiceData(orderId);
  if (!data) return null;

  const html = generateInvoiceHtml(data);
  const filename = `invoice-${data.orderNumber}.pdf`;

  return { html, filename };
}

export async function getInvoiceHtml(orderId: string): Promise<string | null> {
  const data = await fetchInvoiceData(orderId);
  if (!data) return null;
  return generateInvoiceHtml(data);
}
