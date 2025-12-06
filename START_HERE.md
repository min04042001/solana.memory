# ⚡ BẮT ĐẦU ĐÂY - WEBHOOK ĐÃ SẴN!

## 🎉 TIN VUI: WEBHOOK ĐÃ HOẠT ĐỘNG!

**Tất cả đã được setup tự động, bạn chỉ cần config PayOS!**

---

## 🔗 WEBHOOK URL

```
https://cnodenlrhwjiduvstjvl.supabase.co/functions/v1/payos-webhook
```

**Copy URL này ngay!**

---

## ✅ VIỆC DUY NHẤT: CẤU HÌNH PAYOS (1 phút)

### Bước 1: Login PayOS
Vào: https://my.payos.vn

### Bước 2: Cài Đặt Webhook
1. **Cài đặt** → **Webhook**
2. Paste URL:
   ```
   https://cnodenlrhwjiduvstjvl.supabase.co/functions/v1/payos-webhook
   ```
3. Chọn events:
   - ✅ payment.success
   - ✅ payment.failed
   - ✅ payment.cancelled
4. Click **"Lưu"**

---

## 🧪 TEST NGAY

Mở browser, truy cập:
```
https://cnodenlrhwjiduvstjvl.supabase.co/functions/v1/payos-webhook
```

**Kết quả mong đợi:**
```json
{"error": 0, "message": "Webhook URL is active"}
```

---

## 📊 XEM ĐƠN HÀNG & LOGS

### Dashboard Supabase:
https://supabase.com/dashboard

1. **Table Editor** → **orders** (xem đơn hàng)
2. **Edge Functions** → **payos-webhook** → **Logs** (xem logs realtime)

---

## 💻 TẠO ĐƠN HÀNG (Frontend)

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://cnodenlrhwjiduvstjvl.supabase.co',
  'YOUR_ANON_KEY' // từ .env: VITE_SUPABASE_ANON_KEY
);

// Tạo order mới
async function createOrder(data) {
  const paymentId = `ID ${Date.now()}${Math.floor(Math.random() * 1000)}`;

  const { data: order } = await supabase
    .from('orders')
    .insert([{
      type: 'memory',
      payment_content: paymentId, // QUAN TRỌNG! Dùng này trong PayOS
      status: 'pending',
      price: 99000,
      customer_name: data.name,
      customer_email: data.email,
      product_name: data.productName
    }])
    .select()
    .single();

  return paymentId; // Dùng làm description trong PayOS
}
```

---

## 🔄 FLOW HOÀN CHỈNH

```
1. User điền form → Frontend
   ↓
2. Frontend tạo order → Supabase
   ↓
3. Nhận payment_content (ví dụ: "ID 168123456")
   ↓
4. Tạo PayOS payment với description = "ID 168123456"
   ↓
5. User thanh toán
   ↓
6. PayOS gửi webhook → Supabase Edge Function
   ↓
7. Tự động cập nhật status = 'paid'
   ↓
8. ✅ DONE!
```

---

## 📚 CHI TIẾT HƠN

Đọc: **`SUPABASE_INSTANT.md`**

---

## 💡 TẠI SAO DỄ?

- ✅ Webhook đã deploy sẵn
- ✅ Database đã setup
- ✅ URL cố định, không đổi
- ✅ Free 500,000 requests/tháng
- ✅ KHÔNG cần cài gì
- ✅ KHÔNG cần Git/Railway/Ngrok
- ✅ KHÔNG cần Firebase

---

🔥 **Done! Giờ config PayOS và test thôi!**
