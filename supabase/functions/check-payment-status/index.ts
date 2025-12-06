import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    const { paymentContent } = await req.json();
    console.log(`🔍 Checking payment status for: ${paymentContent}`);

    if (!paymentContent) {
      return new Response(
        JSON.stringify({ error: "Missing paymentContent" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get order from database
    const { data: order, error: dbError } = await supabase
      .from("orders")
      .select("*")
      .eq("payment_content", paymentContent)
      .maybeSingle();

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Database error", details: dbError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!order) {
      console.log(`Order not found: ${paymentContent}`);
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`📦 Found order: ${order.id}, status: ${order.status}`);

    // If already paid, return immediately
    if (order.status === "paid") {
      console.log("✅ Order already paid");
      return new Response(
        JSON.stringify({ status: "paid", order }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check PayOS if payos_order_code exists
    if (order.payos_order_code) {
      console.log(`🔍 Checking PayOS for order code: ${order.payos_order_code}`);

      const payosClientId = Deno.env.get("PAYOS_CLIENT_ID");
      const payosApiKey = Deno.env.get("PAYOS_API_KEY");

      if (!payosClientId || !payosApiKey) {
        console.error("Missing PayOS credentials");
        return new Response(
          JSON.stringify({ status: order.status, order }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      try {
        const payosResponse = await fetch(
          `https://api-merchant.payos.vn/v2/payment-requests/${order.payos_order_code}`,
          {
            method: "GET",
            headers: {
              "x-client-id": payosClientId,
              "x-api-key": payosApiKey,
            },
          }
        );

        if (payosResponse.ok) {
          const payosData = await payosResponse.json();
          console.log("PayOS response:", JSON.stringify(payosData));

          // Check if payment is successful
          if (payosData.data && payosData.data.status === "PAID") {
            console.log("✅ PayOS confirms payment is PAID!");

            // Update order in database
            const { error: updateError } = await supabase
              .from("orders")
              .update({
                status: "paid",
                paid_at: new Date().toISOString(),
                payment_method: "payos",
                payos_transaction_ref: payosData.data.transactions?.[0]?.reference || "",
              })
              .eq("id", order.id);

            if (updateError) {
              console.error("Failed to update order:", updateError);
              return new Response(
                JSON.stringify({ error: "Update failed", details: updateError.message }),
                {
                  status: 500,
                  headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
              );
            }

            // Fetch updated order
            const { data: updatedOrder } = await supabase
              .from("orders")
              .select("*")
              .eq("id", order.id)
              .single();

            console.log(`✅ Successfully updated order ${order.id} to paid`);

            return new Response(
              JSON.stringify({ status: "paid", order: updatedOrder, updated: true }),
              {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              }
            );
          } else {
            console.log(`PayOS status: ${payosData.data?.status || "UNKNOWN"}`);
          }
        } else {
          console.error(`PayOS API error: ${payosResponse.status}`);
        }
      } catch (payosError) {
        console.error("PayOS check failed:", payosError);
      }
    } else {
      console.log("⚠️ No PayOS order code found");
    }

    // Return current status
    return new Response(
      JSON.stringify({ status: order.status, order }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Critical error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
