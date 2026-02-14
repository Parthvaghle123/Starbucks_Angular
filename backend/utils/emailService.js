const nodemailer = require("nodemailer");

/**
 * Build HTML body for Starbucks order confirmation (same design as provided).
 */
function buildOrderConfirmationHtml(data) {
  const { customerName, orderId, orderDate, paymentMethod, items, totalAmount, address, contactEmail } = data;

  const itemsList = (items || [])
    .map(
      (item) =>
        `• ${item.title || "Item"} (Qty: ${item.quantity || 1}) - ₹${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`
    )
    .join("<br/>");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Starbucks</title>
</head>
<body style="margin:0; padding:20px; font-family: Arial, sans-serif; background:#f5f5f5;">
  <div style="max-width:600px; margin:0 auto; background:#fff; padding:30px; border:1px solid #e0e0e0; border-radius:8px;">
    <p style="margin:0 0 16px; color:#000; font-size:16px;">Dear <strong>${customerName || "Customer"}</strong>,</p>
    <p style="margin:0 0 16px; color:#000; font-size:16px;">Thank you for shopping with <strong>Starbucks</strong>! 🎉</p>
    <p style="margin:0 0 24px; color:#000; font-size:16px;">We're happy to let you know that your order has been <strong>successfully placed</strong>.</p>

    <p style="margin:0 0 8px; color:#000; font-size:18px; font-weight:bold; text-align:center;">📦 <strong>Order Details</strong></p>
    <hr style="border:none; border-top:2px dashed #ccc; margin:0 0 16px;">
    <p style="margin:0 0 8px; color:#000; font-size:14px;"><strong>Order ID:</strong> ${orderId || "—"}</p>
    <p style="margin:0 0 8px; color:#000; font-size:14px;"><strong>Order Date:</strong> ${orderDate || "—"}</p>
    <p style="margin:0 0 8px; color:#000; font-size:14px;"><strong>Payment Method:</strong> ${paymentMethod || "—"}</p>
    <p style="margin:0 0 8px; color:#000; font-size:14px;">🛍️ <strong>Items Ordered:</strong></p>
    <p style="margin:0 0 12px 16px; color:#000; font-size:14px;">${itemsList || "—"}</p>
    <p style="margin:0 0 24px; color:#000; font-size:14px;">💰 <strong>Total Amount:</strong> <strong style="color:#0a0;">₹${typeof totalAmount === "number" ? totalAmount.toFixed(2) : totalAmount || "0.00"}</strong></p>

    <p style="margin:0 0 8px; color:#000; font-size:18px; font-weight:bold; text-align:center;">🚚 <strong>Delivery Address</strong></p>
    <hr style="border:none; border-top:2px dashed #ccc; margin:0 0 16px;">
    <div style="background:#f5f5f5; padding:12px 16px; border-radius:6px; margin:0 0 24px;">
      <p style="margin:0; color:#333; font-size:14px;">${address || "—"}</p>
    </div>

    <p style="margin:0 0 16px; color:#000; font-size:14px;">Your order is now being processed, and we'll notify you once it has been shipped.</p>
    <p style="margin:0 0 16px; color:#000; font-size:14px;"><strong>Contact Information:</strong> If you have any questions, feel free to contact us at <a href="mailto:${contactEmail || ""}" style="color:#06c; text-decoration:underline;">${contactEmail || "—"}</a>.</p>
    <p style="margin:0 0 8px; color:#000; font-size:14px;">Thank you for choosing <strong>Starbucks</strong>.</p>
    <p style="margin:0; color:#000; font-size:14px;">We look forward to serving you again! 😊</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Send order confirmation email to customer. Uses EMAIL_USER and EMAIL_PASS from env.
 * @param {Object} order - Mongoose order document or plain object (items, orderId, username, email, address, paymentMethod, etc.)
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
async function sendOrderConfirmationEmail(order) {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.warn("EMAIL_USER or EMAIL_PASS not set; skipping order confirmation email.");
    return { success: false, error: "Email not configured" };
  }

  // Convert Mongoose document to plain object so all fields are available
  const orderObj = order && typeof order.toObject === "function" ? order.toObject() : { ...order };
  const toEmail = (orderObj.email || "").trim();

  if (!toEmail) {
    console.warn("Order has no recipient email; skipping order confirmation email.");
    return { success: false, error: "No recipient email" };
  }

  const createdAt = orderObj.createdAt || order?.createdAt;
  const orderDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
    : new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

  const items = orderObj.items || [];
  const totalAmount = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  const html = buildOrderConfirmationHtml({
    customerName: orderObj.username,
    orderId: orderObj.orderId,
    orderDate,
    paymentMethod: orderObj.paymentMethod || "Online Payment",
    items,
    totalAmount,
    address: orderObj.address,
    contactEmail: emailUser,
  });

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: { rejectUnauthorized: false },
    });

    const info = await transporter.sendMail({
      from: `"Starbucks" <${emailUser}>`,
      to: toEmail,
      subject: "Order Confirmation - Starbucks",
      html,
    });

    console.log("Order confirmation email sent to", toEmail, "messageId:", info.messageId);
    return { success: true };
  } catch (err) {
    console.error("Send order confirmation email error:", err.message);
    if (err.response) console.error("SMTP response:", err.response);
    return { success: false, error: err.message };
  }
}

module.exports = { sendOrderConfirmationEmail, buildOrderConfirmationHtml };
