import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  try {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    // GET endpoint for PayOS webhook verification
    if (req.method === "GET") {
      console.log("PayOS đang verify webhook URL...");
      return new Response(
        JSON.stringify({
          error: 0,
          message: "Webhook URL is active",
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // POST endpoint for webhook
    if (req.method === "POST") {
      console.log("---");
      console.log("Đã nhận được Webhook từ PayOS!", new Date().toISOString());

      const webhookData = await req.json();
      console.log("Webhook data:", JSON.stringify(webhookData));

      // Validate webhook data
      if (!webhookData || !webhookData.data) {
        console.log("Webhook không có dữ liệu. Bỏ qua.");
        return new Response(
          JSON.stringify({ error: 0, message: "No transaction data" }),
          {
            status: 200,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const transaction = webhookData.data;
      const code = webhookData.code || transaction.code;

      // Check transaction success
      if (code !== "00") {
        console.log(
          `Giao dịch không thành công. Code: ${code}, Desc: ${
            webhookData.desc || transaction.desc
          }`
        );
        return new Response(
          JSON.stringify({ error: 0, message: "Transaction not successful" }),
          {
            status: 200,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const description = transaction.description || "";
      const amount = transaction.amount || 0;
      const orderCode = transaction.orderCode;

      console.log(
        `Xử lý giao dịch - OrderCode: ${orderCode}, Description: "${description}", Amount: ${amount}đ`
      );

      // Extract payment ID from description (format: "ID 16812345678")
      const match = description.match(/ID \d+/);

      if (!match) {
        console.log(
          `Không tìm thấy mã định danh trong description: "${description}"`
        );
        return new Response(
          JSON.stringify({ error: 0, message: "No payment ID found" }),
          {
            status: 200,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const paymentId = match[0];
      console.log(`Đã trích xuất mã thanh toán: "${paymentId}"`);

      // Initialize Supabase client
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Find order by payment_content
      const { data: order, error: findError } = await supabase
        .from("orders")
        .select("*")
        .eq("payment_content", paymentId)
        .maybeSingle();

      if (findError) {
        console.error("Lỗi tìm kiếm đơn hàng:", findError);
        return new Response(
          JSON.stringify({ error: -1, message: "Database error" }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (!order) {
        console.log(
          `Không tìm thấy đơn hàng với mã thanh toán: "${paymentId}"`
        );
        return new Response(
          JSON.stringify({ error: 0, message: "Order not found" }),
          {
            status: 200,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      console.log(`Đã tìm thấy đơn hàng: ${order.id}`);

      // Check status and amount
      if (
        order.status === "pending" ||
        order.status === "awaiting_approval"
      ) {
        if (amount >= order.price) {
          // Update order to paid
          const { error: updateError } = await supabase
            .from("orders")
            .update({
              status: "paid",
              paid_at: new Date().toISOString(),
              payment_method: "payos",
              payos_order_code: orderCode,
              payos_transaction_ref: transaction.reference || "",
            })
            .eq("id", order.id);

          if (updateError) {
            console.error("Lỗi cập nhật đơn hàng:", updateError);
            return new Response(
              JSON.stringify({ error: -1, message: "Update failed" }),
              {
                status: 500,
                headers: {
                  ...corsHeaders,
                  "Content-Type": "application/json",
                },
              }
            );
          }

          console.log(
            `✅ Thành công! Đã cập nhật đơn hàng ${order.id} thành 'paid'.`
          );

          return new Response(
            JSON.stringify({
              error: 0,
              message: "Order updated successfully",
              orderId: order.id,
            }),
            {
              status: 200,
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
              },
            }
          );
        } else {
          console.warn(
            `Số tiền không đủ. Cần ${order.price}đ, nhận được ${amount}đ.`
          );
          return new Response(
            JSON.stringify({ error: 0, message: "Insufficient amount" }),
            {
              status: 200,
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
              },
            }
          );
        }
      } else {
        console.log(
          `Đơn hàng ${order.id} đã có trạng thái '${order.status}'. Bỏ qua.`
        );
        return new Response(
          JSON.stringify({ error: 0, message: "Order already processed" }),
          {
            status: 200,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    // Method not allowed
    return new Response(
      JSON.stringify({ error: -1, message: "Method not allowed" }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Lỗi nghiêm trọng:", error);
    return new Response(
      JSON.stringify({
        error: -1,
        message: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});