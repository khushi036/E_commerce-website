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

interface CartRequest {
  session_id: string;
  product_id: string;
  quantity?: number;
  action: "add" | "remove" | "update" | "get";
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
      const sessionId = url.searchParams.get("session_id");

      if (!sessionId) {
        throw new Error("session_id is required");
      }

      const { data, error } = await supabase
        .from("cart_items")
        .select("*, product:products(*, images:product_images(*))")
        .eq("session_id", sessionId);

      if (error) throw error;

      const total = data.reduce(
        (sum, item) =>
          sum +
          (item.product?.discount_price || item.product?.price || 0) *
            item.quantity,
        0
      );

      return new Response(
        JSON.stringify({ success: true, data, total, count: data.length }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (req.method === "POST") {
      const body: CartRequest = await req.json();
      const { session_id, product_id, quantity = 1, action } = body;

      if (!session_id || !product_id || !action) {
        throw new Error("Missing required fields: session_id, product_id, action");
      }

      if (action === "add") {
        const { data: existing } = await supabase
          .from("cart_items")
          .select("id, quantity")
          .eq("session_id", session_id)
          .eq("product_id", product_id)
          .maybeSingle();

        if (existing) {
          const { data, error } = await supabase
            .from("cart_items")
            .update({ quantity: existing.quantity + quantity })
            .eq("id", existing.id)
            .select("*, product:products(*)");

          if (error) throw error;
          return new Response(
            JSON.stringify({ success: true, data: data[0] }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const { data, error } = await supabase
          .from("cart_items")
          .insert({ session_id, product_id, quantity })
          .select("*, product:products(*)");

        if (error) throw error;
        return new Response(
          JSON.stringify({ success: true, data: data[0] }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (action === "remove") {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("session_id", session_id)
          .eq("product_id", product_id);

        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (action === "update") {
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity })
          .eq("session_id", session_id)
          .eq("product_id", product_id);

        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
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