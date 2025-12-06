# ⚡ SUPABASE - ĐÃ XONG SẴN! (0 Phút Setup)

## 🎉 TIN VUI: WEBHOOK ĐÃ SẴN SÀNG!

**Tất cả đã được setup tự động:**
- ✅ Database: Bảng `orders` đã có
- ✅ Webhook: Edge Function đã deploy
- ✅ Security: RLS đã bật
- ✅ URL: Cố định, không đổi

---

## 🔗 WEBHOOK URL CỦA BẠN

```
https://cnodenlrhwjiduvstjvl.supabase.co/functions/v1/payos-webhook
```

**Copy và dùng ngay!**

---

## 🎯 CHỈ CÒN 1 VIỆC: CẤU HÌNH PAYOS

### Bước 1: Login PayOS
https://my.payos.vn

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
4. **Lưu**

---

## ✅ TEST NGAY

Mở browser:
```
https://cnodenlrhwjiduvstjvl.supabase.co/functions/v1/payos-webhook
```

**Thấy này là OK:**
```json
{"error": 0, "message": "Webhook URL is active"}
```

---

## 📊 XEM ĐƠN HÀNG

### Dashboard:
https://supabase.com/dashboard

**Table Editor** → **orders**

### Logs:
**Edge Functions** → **payos-webhook** → **Logs**

---

## 🚀 TẠO ĐƠN HÀNG (Frontend)

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://cnodenlrhwjiduvstjvl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // VITE_SUPABASE_ANON_KEY
);

// Tạo order
async function createOrder(data) {
  const paymentId = `ID ${Date.now()}${Math.floor(Math.random() * 1000)}`;

  const { data: order, error } = await supabase
    .from('orders')
    .insert([{
      type: 'memory',
      payment_content: paymentId, // QUAN TRỌNG!
      status: 'pending',
      price: 99000,
      customer_name: data.name,
      customer_email: data.email,
      customer_phone: data.phone,
      product_name: data.productName
    }])
    .select()
    .single();

  // Dùng paymentId này làm description trong PayOS
  return paymentId;
}
```

---

## 🔄 FLOW

```
1. User điền form
   ↓
2. Frontend tạo order → Supabase
   ↓
3. Lấy payment_content (ví dụ: "ID 168123456")
   ↓
4. Tạo PayOS payment với description = "ID 168123456"
   ↓
5. User thanh toán
   ↓
6. PayOS → Webhook → Supabase
   ↓
7. Tự động cập nhật status = 'paid'
   ↓
8. ✅ DONE!
```

---

## 💡 TẠI SAO DỄ?

- ❌ KHÔNG cần Git/GitHub
- ❌ KHÔNG cần Railway
- ❌ KHÔNG cần Ngrok
- ❌ KHÔNG cần Firebase
- ❌ KHÔNG cần cài gì

✅ **Chỉ cần cấu hình PayOS là xong!**

---

## 🏆 SO SÁNH

| | Supabase ⚡ | Railway | Ngrok |
|---|---|---|---|
| Setup | ✅ 0 phút | 5 phút | 2 phút |
| Cài đặt | ❌ Không | ❌ Không | ✅ Cần |
| URL | ✅ Cố định | ✅ Cố định | ❌ Đổi |
| Database | ✅ Tích hợp | ❌ Riêng | ❌ Riêng |
| Free | 500K req | 500h | Giới hạn |
| **Dễ nhất** | 🏆 | ⭐ | ⭐ |

---

## 🐛 TROUBLESHOOT

### Test webhook:
```bash
curl https://cnodenlrhwjiduvstjvl.supabase.co/functions/v1/payos-webhook
```

### Xem orders:
```sql
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;
```

### Tìm order:
```sql
SELECT * FROM orders WHERE payment_content = 'ID 16812345678';
```

---

## 🎉 XONG!

**Giờ chỉ cần:**
1. Config PayOS webhook
2. Tạo đơn test
3. Thanh toán
4. Xem tự động cập nhật!

---

🔥 **Supabase = Giải pháp ĐƠN GIẢN nhất!**
