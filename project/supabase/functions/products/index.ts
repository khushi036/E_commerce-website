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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];

    if (lastSegment === "products") {
      if (req.method === "GET") {
        const searchParams = url.searchParams;
        const categoryId = searchParams.get("category_id");
        const featured = searchParams.get("featured");
        const bestseller = searchParams.get("bestseller");
        const limit = searchParams.get("limit") || "50";

        let query = supabase
          .from("products")
          .select("*, images:product_images(*), category:categories(*)");

        if (categoryId) {
          query = query.eq("category_id", categoryId);
        }

        if (featured === "true") {
          query = query.eq("is_featured", true);
        }

        if (bestseller === "true") {
          query = query.eq("is_bestseller", true);
        }

        query = query.limit(parseInt(limit));

        const { data, error } = await query;

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (lastSegment && !isNaN(Number(lastSegment))) {
      const productId = lastSegment;

      if (req.method === "GET") {
        const { data, error } = await supabase
          .from("products")
          .select("*, images:product_images(*), category:categories(*)")
          .eq("id", productId)
          .maybeSingle();

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(
      JSON.stringify({ success: false, error: "Endpoint not found" }),
      {
        status: 404,
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