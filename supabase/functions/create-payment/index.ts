import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
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

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { orderCode, amount, description, returnUrl, cancelUrl } = await req.json();

    // Validate input
    if (!orderCode || !amount || !description) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get PayOS credentials from environment
    const clientId = Deno.env.get("PAYOS_CLIENT_ID");
    const apiKey = Deno.env.get("PAYOS_API_KEY");
    const checksumKey = Deno.env.get("PAYOS_CHECKSUM_KEY");

    if (!clientId || !apiKey || !checksumKey) {
      console.error("Missing PayOS credentials");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create checksum for signature
    const checksumData = `amount=${amount}&cancelUrl=${cancelUrl || ''}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl || ''}`;
    
    // Use Web Crypto API to create HMAC SHA256
    const encoder = new TextEncoder();
    const keyData = encoder.encode(checksumKey);
    const messageData = encoder.encode(checksumData);
    
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signature = await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      messageData
    );
    
    const signatureHex = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Call PayOS API to create payment link
    const payosResponse = await fetch("https://api-merchant.payos.vn/v2/payment-requests", {
      method: "POST",
      headers: {
        "x-client-id": clientId,
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderCode: parseInt(orderCode),
        amount: parseInt(amount),
        description: description,
        returnUrl: returnUrl || `${req.headers.get('origin')}/custom-qr.html`,
        cancelUrl: cancelUrl || `${req.headers.get('origin')}/index.html`,
        signature: signatureHex,
      }),
    });

    const payosData = await payosResponse.json();

    if (!payosResponse.ok || payosData.code !== "00") {
      console.error("PayOS API error:", payosData);
      return new Response(
        JSON.stringify({ 
          error: "Payment creation failed", 
          details: payosData 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("✅ Payment link created successfully:", payosData.data.checkoutUrl);

    return new Response(
      JSON.stringify({
        success: true,
        checkoutUrl: payosData.data.checkoutUrl,
        qrCode: payosData.data.qrCode,
        orderCode: orderCode,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating payment:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});