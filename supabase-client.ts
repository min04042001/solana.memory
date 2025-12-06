import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase Config:', {
  url: supabaseUrl ? '✅ Found' : '❌ Missing',
  key: supabaseKey ? '✅ Found' : '❌ Missing',
});

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Order {
  id: string;
  type: 'memory' | 'gift';
  payment_content: string;
  status: 'pending' | 'awaiting_approval' | 'paid' | 'cancelled';
  price: number;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  product_id?: string;
  product_name: string;
  qr_code_url?: string;
  memory_content?: any;
  gift_details?: any;
  paid_at?: string;
  payment_method?: string;
  payos_order_code?: string;
  payos_transaction_ref?: string;
  created_at: string;
  updated_at: string;
}

export async function createOrder(orderData: {
  type: 'memory' | 'gift';
  payment_content: string;
  price: number;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  product_name: string;
  memory_content?: any;
  gift_details?: any;
}) {
  console.log('Creating order with data:', orderData);

  const { data, error } = await supabase
    .from('orders')
    .insert([{
      ...orderData,
      status: 'pending',
    }])
    .select()
    .single();

  if (error) {
    console.error('❌ Error creating order:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error(`Không thể tạo đơn hàng: ${error.message}`);
  }

  console.log('✅ Order created successfully:', data);
  return data as Order;
}

export async function updateOrderWithPayOSCode(orderId: string, orderCode: string) {
  const { error } = await supabase
    .from('orders')
    .update({ payos_order_code: orderCode })
    .eq('id', orderId);

  if (error) {
    console.error('❌ Error updating order with PayOS code:', error);
    throw error;
  }

  console.log('✅ Order updated with PayOS code:', orderCode);
}

export async function getOrderByPaymentContent(paymentContent: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('payment_content', paymentContent)
    .maybeSingle();

  if (error) {
    console.error('Error fetching order:', error);
    throw error;
  }

  return data as Order | null;
}

export function subscribeToOrderStatus(
  paymentContent: string,
  callback: (order: Order) => void
) {
  const channel = supabase
    .channel(`order-${paymentContent}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `payment_content=eq.${paymentContent}`,
      },
      (payload) => {
        console.log('🔔 Realtime update received:', payload.new);
        callback(payload.new as Order);
      }
    )
    .subscribe((status) => {
      console.log('🔌 Realtime subscription status:', status);
    });

  return channel;
}

export async function checkPaymentStatus(paymentContent: string): Promise<Order | null> {
  try {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-payment-status`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentContent }),
    });

    if (!response.ok) {
      console.error('Payment check failed:', response.status);
      return null;
    }

    const result = await response.json();

    if (result.updated) {
      console.log('💰 Payment status updated by checker!');
    }

    return result.order as Order;
  } catch (error) {
    console.error('Error checking payment status:', error);
    return null;
  }
}

export function startPollingOrderStatus(
  paymentContent: string,
  callback: (order: Order) => void,
  intervalMs: number = 3000
): () => void {
  console.log(`🔄 Starting smart polling for payment: ${paymentContent} every ${intervalMs}ms`);

  let pollCount = 0;
  const maxPolls = 200;

  const intervalId = setInterval(async () => {
    pollCount++;
    console.log(`📡 Polling attempt ${pollCount}/${maxPolls} for payment: ${paymentContent}`);

    try {
      // Call edge function to check payment status (checks both DB and PayOS)
      const order = await checkPaymentStatus(paymentContent);

      if (order) {
        console.log(`📦 Order status: ${order.status}`);

        if (order.status === 'paid') {
          console.log('✅ Payment confirmed via smart polling!');
          clearInterval(intervalId);
          callback(order);
        } else if (order.status === 'cancelled') {
          console.log('❌ Payment cancelled');
          clearInterval(intervalId);
        }
      } else {
        console.warn('⚠️ Order not found or check failed');
      }

      if (pollCount >= maxPolls) {
        console.log('⏱️ Max polling attempts reached');
        clearInterval(intervalId);
      }
    } catch (error) {
      console.error('❌ Polling error:', error);
    }
  }, intervalMs);

  return () => {
    console.log('🛑 Stopping polling');
    clearInterval(intervalId);
  };
}
