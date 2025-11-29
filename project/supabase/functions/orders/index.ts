import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@^2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

interface OrderRequest {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: {
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  payment_method: string;
  session_id: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method === "GET") {
      const url = new URL(req.url);
      const orderNumber = url.searchParams.get("order_number");
      const email = url.searchParams.get("email");

      let query = supabase.from("orders").select("*, order_items(*)")

      if (orderNumber) {
        query = query.eq("order_number", orderNumber);
      } else if (email) {
        query = query.eq("customer_email", email);
      } else {
        throw new Error("Provide order_number or email");
      }

      const { data, error } = await query;

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST") {
      const body: OrderRequest = await req.json();
      const {
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        items,
        total_amount,
        payment_method,
        session_id,
      } = body;

      if (
        !customer_name ||
        !customer_email ||
        !customer_phone ||
        !items?.length ||
        !total_amount
      ) {
        throw new Error("Missing required fields");
      }

      const orderNumber = `ORD${Date.now()}`;

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          customer_name,
          customer_email,
          customer_phone,
          shipping_address,
          total_amount,
          payment_method,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      await supabase
        .from("cart_items")
        .delete()
        .eq("session_id", session_id);

      return new Response(
        JSON.stringify({
          success: true,
          data: { ...orderData, items: orderItems },
          message: `Order ${orderNumber} created successfully`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (req.method === "PUT") {
      const url = new URL(req.url);
      const orderId = url.searchParams.get("order_id");
      const body = await req.json();
      const { status } = body;

      if (!orderId || !status) {
        throw new Error("order_id and status are required");
      }

      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, data }), {
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