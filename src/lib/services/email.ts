const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM || "orders@ecom-store.com";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "ECOM";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!RESEND_API_KEY) {
    console.log(`[Email] Would send to ${to}: ${subject}`);
    return { success: true, mocked: true };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${SITE_NAME} <${FROM_EMAIL}>`,
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    return { success: false, error };
  }
}

// ───────── Order Confirmation ─────────

export async function sendOrderConfirmation(params: {
  to: string;
  orderNumber: string;
  customerName: string;
  items: Array<{ title: string; quantity: number; unitPrice: number; lineTotal: number }>;
  total: number;
  shippingAddress: string;
  estimatedDelivery?: string;
}) {
  const itemsHtml = params.items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #eee;">${item.title} × ${item.quantity}</td>
          <td style="padding:12px;border-bottom:1px solid #eee;text-align:right;">$${item.unitPrice.toFixed(2)}</td>
          <td style="padding:12px;border-bottom:1px solid #eee;text-align:right;">$${item.lineTotal.toFixed(2)}</td>
        </tr>
      `
    )
    .join("");

  return sendEmail({
    to: params.to,
    subject: `Order Confirmed — #${params.orderNumber}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1A1A1A;color:white;padding:32px;text-align:center;">
          <h1 style="margin:0;font-size:24px;font-weight:400;letter-spacing:2px;">${SITE_NAME}</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="margin:0 0 8px;">Thank you, ${params.customerName}!</h2>
          <p style="color:#666;margin:0 0 24px;">Your order <strong>#${params.orderNumber}</strong> has been confirmed.</p>

          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <thead>
              <tr style="background:#f8f8f8;">
                <th style="padding:12px;text-align:left;font-size:14px;">Item</th>
                <th style="padding:12px;text-align:right;font-size:14px;">Price</th>
                <th style="padding:12px;text-align:right;font-size:14px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding:12px;text-align:right;font-weight:600;">Total</td>
                <td style="padding:12px;text-align:right;font-weight:600;font-size:18px;">$${params.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div style="background:#f8f8f8;padding:16px;border-radius:8px;margin-bottom:24px;">
            <h3 style="margin:0 0 8px;font-size:14px;">Shipping To</h3>
            <p style="margin:0;font-size:14px;color:#666;">${params.shippingAddress}</p>
            ${params.estimatedDelivery ? `<p style="margin:8px 0 0;font-size:14px;">Estimated delivery: ${params.estimatedDelivery}</p>` : ""}
          </div>

          <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/account/orders"
             style="display:inline-block;padding:12px 24px;background:#1A1A1A;color:white;text-decoration:none;border-radius:8px;font-size:14px;">
            View Order
          </a>
        </div>
        <div style="padding:24px;text-align:center;color:#999;font-size:12px;border-top:1px solid #eee;">
          <p>${SITE_NAME} — Premium Shopping Experience</p>
        </div>
      </div>
    `,
  });
}

// ───────── Welcome Email ─────────

export async function sendWelcomeEmail(params: { to: string; customerName: string }) {
  return sendEmail({
    to: params.to,
    subject: `Welcome to ${SITE_NAME}!`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1A1A1A;color:white;padding:32px;text-align:center;">
          <h1 style="margin:0;font-size:24px;font-weight:400;letter-spacing:2px;">${SITE_NAME}</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="margin:0 0 8px;">Welcome, ${params.customerName}!</h2>
          <p style="color:#666;margin:0 0 16px;">You're all set. Start exploring our curated collection of premium products.</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/products"
             style="display:inline-block;padding:12px 24px;background:#1A1A1A;color:white;text-decoration:none;border-radius:8px;font-size:14px;">
            Start Shopping
          </a>
        </div>
      </div>
    `,
  });
}

// ───────── Password Reset ─────────

export async function sendPasswordResetEmail(params: { to: string; resetLink: string }) {
  return sendEmail({
    to: params.to,
    subject: `Reset your ${SITE_NAME} password`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1A1A1A;color:white;padding:32px;text-align:center;">
          <h1 style="margin:0;font-size:24px;font-weight:400;letter-spacing:2px;">${SITE_NAME}</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="margin:0 0 8px;">Reset Your Password</h2>
          <p style="color:#666;margin:0 0 16px;">Click the button below to reset your password. This link expires in 1 hour.</p>
          <a href="${params.resetLink}"
             style="display:inline-block;padding:12px 24px;background:#1A1A1A;color:white;text-decoration:none;border-radius:8px;font-size:14px;">
            Reset Password
          </a>
        </div>
      </div>
    `,
  });
}

// ───────── Shipping Update ─────────

export async function sendShippingUpdate(params: {
  to: string;
  customerName: string;
  orderNumber: string;
  status: string;
  trackingNumber?: string;
  trackingCarrier?: string;
}) {
  return sendEmail({
    to: params.to,
    subject: `Order Update — #${params.orderNumber} is ${params.status}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1A1A1A;color:white;padding:32px;text-align:center;">
          <h1 style="margin:0;font-size:24px;font-weight:400;letter-spacing:2px;">${SITE_NAME}</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="margin:0 0 8px;">Hi ${params.customerName},</h2>
          <p style="color:#666;margin:0 0 16px;">
            Your order <strong>#${params.orderNumber}</strong> is now <strong>${params.status}</strong>.
          </p>
          ${params.trackingNumber ? `
            <div style="background:#f8f8f8;padding:16px;border-radius:8px;margin-bottom:16px;">
              <p style="margin:0;font-size:14px;">
                Tracking: <strong>${params.trackingNumber}</strong>
                ${params.trackingCarrier ? `(${params.trackingCarrier})` : ""}
              </p>
            </div>
          ` : ""}
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/account/orders"
             style="display:inline-block;padding:12px 24px;background:#1A1A1A;color:white;text-decoration:none;border-radius:8px;font-size:14px;">
            Track Order
          </a>
        </div>
      </div>
    `,
  });
}

// ───────── Invoice ─────────

export async function sendInvoice(params: {
  to: string;
  customerName: string;
  orderNumber: string;
  invoiceUrl: string;
}) {
  return sendEmail({
    to: params.to,
    subject: `Invoice — #${params.orderNumber}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1A1A1A;color:white;padding:32px;text-align:center;">
          <h1 style="margin:0;font-size:24px;font-weight:400;letter-spacing:2px;">${SITE_NAME}</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="margin:0 0 8px;">Invoice for Order #${params.orderNumber}</h2>
          <p style="color:#666;margin:0 0 16px;">Hi ${params.customerName}, your invoice is ready.</p>
          <a href="${params.invoiceUrl}"
             style="display:inline-block;padding:12px 24px;background:#1A1A1A;color:white;text-decoration:none;border-radius:8px;font-size:14px;">
            Download Invoice (PDF)
          </a>
        </div>
      </div>
    `,
  });
}
