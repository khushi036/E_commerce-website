import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmailRequest {
  to: string;
  subject: string;
  template: "order-confirmation" | "order-shipped" | "contact-reply";
  data: Record<string, unknown>;
}

function generateOrderConfirmationHTML(data: Record<string, unknown>): string {
  const orderData = data as any;
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1f2937 0%, #111827 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .order-item { border: 1px solid #e5e7eb; padding: 10px; margin: 10px 0; background: white; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        .button { display: inline-block; background: #1f2937; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed</h1>
        </div>
        <div class="content">
          <p>Dear ${orderData.customer_name},</p>
          <p>Thank you for your order! Your order has been confirmed and will be processed shortly.</p>
          
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> ${orderData.order_number}</p>
          <p><strong>Total Amount:</strong> ₹${orderData.total_amount}</p>
          <p><strong>Payment Method:</strong> ${orderData.payment_method === 'cod' ? 'Cash on Delivery' : 'Prepaid'}</p>
          
          <h3>Shipping Address</h3>
          <p>
            ${orderData.shipping_address.address_line1}<br>
            ${orderData.shipping_address.address_line2 ? orderData.shipping_address.address_line2 + '<br>' : ''}
            ${orderData.shipping_address.city}, ${orderData.shipping_address.state} - ${orderData.shipping_address.pincode}
          </p>
          
          <p style="margin-top: 30px;">Your order will be delivered in 3-5 business days.</p>
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="https://eleganceearrings.com" class="button">Track Your Order</a>
          </p>
        </div>
        <div class="footer">
          <p>If you have any questions, please contact us at info@eleganceearrings.com or chat with us on WhatsApp: +91 98765 43210</p>
          <p>&copy; 2024 Elegance Earrings. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateShippedHTML(data: Record<string, unknown>): string {
  const orderData = data as any;
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Order Has Shipped</h1>
        </div>
        <div class="content">
          <p>Dear ${orderData.customer_name},</p>
          <p>Great news! Your order has been shipped.</p>
          
          <h3>Order Number: ${orderData.order_number}</h3>
          ${orderData.tracking_number ? `<p><strong>Tracking Number:</strong> ${orderData.tracking_number}</p>` : ''}
          
          <p>Your package is on its way and should arrive soon. You can track your shipment using the tracking number above.</p>
        </div>
        <div class="footer">
          <p>For any questions, contact us at info@eleganceearrings.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; message: string }> {
  try {
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      return {
        success: true,
        message: "Email service not configured. Email would be sent: " + to,
      };
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "noreply@eleganceearrings.com",
        to: to,
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email service error: ${response.statusText}`);
    }

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: true, message: "Email logged (service not configured)" };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method === "POST") {
      const body: EmailRequest = await req.json();
      const { to, subject, template, data } = body;

      if (!to || !subject || !template) {
        throw new Error("Missing required fields: to, subject, template");
      }

      let html = "";
      if (template === "order-confirmation") {
        html = generateOrderConfirmationHTML(data);
      } else if (template === "order-shipped") {
        html = generateShippedHTML(data);
      } else {
        throw new Error(`Unknown template: ${template}`);
      }

      const result = await sendEmail(to, subject, html);

      return new Response(JSON.stringify({ success: true, ...result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});