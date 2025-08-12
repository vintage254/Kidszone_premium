import { Resend } from "resend";

export async function sendTrackingEmail({
  to,
  orderId,
  productTitle,
  trackingNumber,
}: {
  to: string;
  orderId: string;
  productTitle?: string | null;
  trackingNumber: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.error("Missing RESEND_API_KEY or RESEND_FROM_EMAIL env vars");
    return { success: false, message: "Email not configured" };
  }

  const resend = new Resend(apiKey);
  const subject = "Your KidsZone Premium Tracking Number";

  const shortOrder = orderId?.slice(0, 8) ?? orderId;
  const safeTitle = productTitle ?? "your product";

  const text = `Hi there,\n\nYour order (${shortOrder}) for ${safeTitle} has a tracking number: ${trackingNumber}.\n\nYou can use this number on the courier's website to track your shipment.\n\nThank you for shopping with KidsZone Premium!`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin: 0 0 12px; color: #111827;">KidsZone Premium</h2>
      <p style="margin: 0 0 12px;">Your order <strong>${shortOrder}</strong> (${safeTitle}) has a tracking number:</p>
      <p style="font-size: 18px; margin: 8px 0;">
        <strong>${trackingNumber}</strong>
      </p>
      <p style="margin: 12px 0;">Use this number on the courier's website to track your shipment.</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />
      <p style="margin: 0; color:#6b7280;">Thanks for shopping with KidsZone Premium.</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
    });
    return { success: true };
  } catch (error) {
    console.error("Resend Error:", error);
    return { success: false, message: "Failed to send tracking email" };
  }
}
