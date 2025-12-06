# 🔥 Supabase Edge Functions + Firebase - Hướng Dẫn Hoàn Chỉnh

## 🎯 Tổng Quan

**Giải pháp này kết hợp:**
- ✅ **Supabase Edge Functions** - Serverless runtime để chạy code
- ✅ **Firebase Firestore** - Database để lưu data (như hiện tại)
- ✅ **PayOS Webhook** - Nhận thông báo thanh toán

**Ưu điểm:**
- ⚡ Serverless - không cần maintain server
- ✅ Free tier 500K requests/tháng
- ✅ HTTPS + Domain tự động
- ✅ Vẫn dùng Firebase database như hiện tại
- ✅ URL cố định, production-ready

---

## 📋 Yêu Cầu

- ✅ Tài khoản Supabase (free): https://supabase.com
- ✅ Supabase CLI đã cài đặt
- ✅ File `serviceAccountKey.json` (Firebase credentials)
- ✅ PayOS API keys

---

## 🚀 BƯỚC 1: Cài Đặt Supabase CLI

### Cài trên macOS/Linux:
```bash
brew install supabase/tap/supabase
```

### Cài trên Windows:
```bash
npm install -g supabase
```

### Kiểm tra cài đặt:
```bash
supabase --version
```

---

## 🚀 BƯỚC 2: Tạo Project Trên Supabase

### 2.1. Đăng ký/Đăng nhập
- Truy cập: https://supabase.com
- Đăng ký/Đăng nhập (dùng GitHub hoặc email)

### 2.2. Tạo project mới
1. Click **"New Project"**
2. **Organization:** Chọn hoặc tạo mới
3. **Project name:** `solana-memory` (hoặc tên bạn thích)
4. **Database password:** Tạo password mạnh (lưu lại)
5. **Region:** `Southeast Asia (Singapore)` - gần VN nhất
6. Click **"Create new project"**

**Thời gian:** 2-3 phút để khởi tạo

### 2.3. Lấy thông tin project
Sau khi project sẵn sàng:

1. Vào **Project Settings** → **API**
2. Note lại:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **Project ID:** (ở phần General)
   - **anon public key:** (dùng cho frontend nếu cần)

---

## 🚀 BƯỚC 3: Link Project Local Với Supabase

### 3.1. Login vào Supabase CLI
```bash
supabase login
```

→ Mở browser, authorize CLI

### 3.2. Link project
```bash
cd /path/to/your/project
supabase link --project-ref YOUR_PROJECT_ID
```

**YOUR_PROJECT_ID:** Lấy từ Project Settings → General

**Ví dụ:**
```bash
supabase link --project-ref abcdefghijklmnop
```

---

## 🚀 BƯỚC 4: Thiết Lập Environment Variables

Edge Function cần Firebase credentials để kết nối database.

### 4.1. Mở file serviceAccountKey.json

```bash
cat serviceAccountKey.json
```

→ Copy toàn bộ nội dung (JSON object)

### 4.2. Set secret trong Supabase

```bash
supabase secrets set FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"xxx",...}'
```

**CHÚ Ý:**
- Bọc toàn bộ JSON trong dấu ngoặc đơn `'...'`
- Hoặc dùng dashboard Supabase để set (dễ hơn)

### 4.3. Set secret qua Dashboard (KHUYẾN NGHỊ)

1. Truy cập: **Project Settings** → **Edge Functions** → **Secrets**
2. Click **"Add new secret"**
3. **Name:** `FIREBASE_SERVICE_ACCOUNT`
4. **Value:** Paste toàn bộ nội dung `serviceAccountKey.json`
5. Click **"Save"**

### 4.4. (Optional) Set PayOS keys

Nếu cần dùng PayOS API trong edge function:

```bash
supabase secrets set PAYOS_CLIENT_ID='your-client-id'
supabase secrets set PAYOS_API_KEY='your-api-key'
supabase secrets set PAYOS_CHECKSUM_KEY='your-checksum-key'
```

---

## 🚀 BƯỚC 5: Deploy Edge Function

### 5.1. Kiểm tra cấu trúc folder

```
project/
  supabase/
    functions/
      payos-webhook/
        index.ts  ← File đã tạo sẵn
```

### 5.2. Deploy function

```bash
supabase functions deploy payos-webhook
```

**Output:**
```
Deploying function...
✓ Function deployed successfully
Function URL: https://xxxxx.supabase.co/functions/v1/payos-webhook
```

### 5.3. Lưu URL

Copy URL vừa nhận được:
```
https://xxxxx.supabase.co/functions/v1/payos-webhook
```

---

## 🚀 BƯỚC 6: Test Edge Function

### 6.1. Test GET request (PayOS verification)

```bash
curl https://xxxxx.supabase.co/functions/v1/payos-webhook
```

**Kết quả mong đợi:**
```json
{
  "error": 0,
  "message": "Webhook URL is active",
  "timestamp": "2024-12-04T..."
}
```

### 6.2. Test qua browser

Mở URL trong browser:
```
https://xxxxx.supabase.co/functions/v1/payos-webhook
```

Thấy JSON response → ✅ Thành công!

---

## 🚀 BƯỚC 7: Cấu Hình PayOS Webhook

### 7.1. Truy cập PayOS Dashboard
- Login: https://my.payos.vn
- Vào **Cài đặt** → **Webhook**

### 7.2. Nhập webhook URL

**Webhook URL:**
```
https://xxxxx.supabase.co/functions/v1/payos-webhook
```

**Events chọn:**
- ✅ payment.success
- ✅ payment.failed
- ✅ payment.cancelled

### 7.3. Test webhook

PayOS sẽ gửi GET request để verify.

**Kết quả:** ✅ "Webhook đang hoạt động"

---

## 🚀 BƯỚC 8: Test Flow Thanh Toán

### 8.1. Tạo đơn hàng test

1. Truy cập: `https://solanamemory.io.vn/product.html`
2. Chọn sản phẩm, nhập thông tin
3. Click **"Tạo đơn hàng"**
4. Nhận QR code với nội dung `ID 1234567890`

### 8.2. Thanh toán thử

**Option 1:** Dùng test card PayOS (nếu có sandbox)

**Option 2:** Chuyển khoản thật (số tiền nhỏ để test)

### 8.3. Kiểm tra logs

**Xem logs realtime:**
```bash
supabase functions logs payos-webhook --tail
```

**Hoặc qua Dashboard:**
- **Edge Functions** → **payos-webhook** → **Logs**

**Logs mong đợi:**
```
Đã nhận được Webhook từ PayOS! 2024-12-04T...
Đang xử lý giao dịch PayOS - OrderCode: 123456
Đã trích xuất mã thanh toán: "ID 1234567890"
Đã tìm thấy đơn hàng xxx trong collection memories
✅ Thành công! Đã cập nhật đơn hàng xxx thành 'paid'
```

### 8.4. Kiểm tra Admin Dashboard

```
https://solanamemory.io.vn/admin.html
```

→ Đơn hàng đã chuyển sang **"paid"** ✅

---

## 📊 Xem Logs & Debug

### Realtime logs (terminal)
```bash
supabase functions logs payos-webhook --tail
```

### Logs trong Dashboard
1. **Edge Functions** → **payos-webhook**
2. Tab **"Logs"**
3. Filter by date, level, etc.

### Test local (trước khi deploy)
```bash
supabase functions serve payos-webhook
```

→ Function chạy local tại `http://localhost:54321/functions/v1/payos-webhook`

---

## 🔧 Troubleshooting

### Lỗi 1: Deploy failed - Firebase credentials not found

**Nguyên nhân:** Chưa set `FIREBASE_SERVICE_ACCOUNT`

**Giải pháp:**
```bash
# Dashboard: Project Settings → Edge Functions → Secrets
# Add secret: FIREBASE_SERVICE_ACCOUNT
```

### Lỗi 2: Function deployed but returning 500

**Nguyên nhân:** Firebase credentials không hợp lệ

**Giải pháp:**
1. Kiểm tra `serviceAccountKey.json` còn valid không
2. Re-set secret với nội dung đúng
3. Redeploy function

### Lỗi 3: Webhook không cập nhật Firestore

**Checklist:**
- [ ] Logs có thấy "Đã nhận được Webhook từ PayOS"?
- [ ] PaymentContent trong Firestore khớp với description PayOS?
- [ ] Firebase credentials đúng?
- [ ] Collection name đúng? (`memories` hoặc `gift_orders`)

**Debug:**
```bash
# Xem logs chi tiết
supabase functions logs payos-webhook --tail
```

### Lỗi 4: CORS error khi call từ frontend

**Nguyên nhân:** Frontend call trực tiếp edge function

**Giải pháp:** Edge function đã có CORS headers. Nếu vẫn lỗi:
1. Check request headers
2. Đảm bảo dùng đúng method (GET/POST)

---

## 🔄 Cập Nhật Edge Function

### Sau khi sửa code

```bash
# 1. Edit file
nano supabase/functions/payos-webhook/index.ts

# 2. Redeploy
supabase functions deploy payos-webhook

# 3. Xem logs
supabase functions logs payos-webhook --tail
```

---

## 💰 Chi Phí

### Supabase Free Tier:
- ✅ **500,000 requests/tháng** (500K invocations)
- ✅ **500MB database** (nếu dùng Supabase DB, không áp dụng cho Firebase)
- ✅ **Unlimited egress** cho edge functions
- ✅ **2GB bandwidth**

**Nếu vượt quá:**
- Requests thêm: $2/1M requests
- Khá rẻ cho production!

### Firebase Free Tier:
- ✅ Vẫn dùng Firebase free tier như hiện tại
- ✅ Edge function chỉ read/write Firestore, không ảnh hưởng quota nhiều

---

## 🎯 Architecture Hoàn Chỉnh

```
Frontend (Netlify)
    ↓
solanamemory.io.vn
    ↓
Supabase Edge Functions
    ↓
https://xxxxx.supabase.co/functions/v1/payos-webhook
    ↓
Firebase Firestore
    ↓
Collections: memories, gift_orders
```

**Webhook Flow:**
```
User thanh toán PayOS
    ↓
PayOS nhận tiền
    ↓
PayOS gửi webhook → Supabase Edge Function
    ↓
Edge Function xử lý & gọi Firebase
    ↓
Firebase cập nhật order status
    ↓
Admin dashboard hiển thị đơn mới
```

---

## 📚 Commands Cheat Sheet

```bash
# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_ID

# Set secrets
supabase secrets set KEY='value'

# List secrets
supabase secrets list

# Deploy function
supabase functions deploy payos-webhook

# Serve local
supabase functions serve payos-webhook

# View logs
supabase functions logs payos-webhook --tail

# List functions
supabase functions list

# Delete function
supabase functions delete payos-webhook
```

---

## 🔐 Security Best Practices

### 1. Không commit secrets vào Git

```bash
# .gitignore
serviceAccountKey.json
.env
supabase/.env
```

### 2. Sử dụng Supabase secrets

Lưu credentials trong Supabase secrets, không hardcode trong code.

### 3. Validate webhook signature

Hiện tại đã comment, sau này nên enable:
```typescript
const signature = req.headers.get('x-payos-signature');
// Validate signature với PAYOS_CHECKSUM_KEY
```

### 4. Rate limiting

Supabase có rate limiting mặc định. Nếu cần custom:
- Dashboard → Settings → API → Rate Limiting

---

## ✅ Checklist Hoàn Thành

- [ ] Supabase CLI đã cài
- [ ] Supabase project đã tạo
- [ ] Project đã linked: `supabase link`
- [ ] Secret đã set: `FIREBASE_SERVICE_ACCOUNT`
- [ ] Edge function đã deploy
- [ ] Test GET: `curl https://xxx.supabase.co/functions/v1/payos-webhook`
- [ ] PayOS webhook configured
- [ ] Test thanh toán thật
- [ ] Logs hiển thị webhook received
- [ ] Firebase order updated
- [ ] Admin dashboard hiển thị đơn mới

---

## 🎉 Thành Công!

**Bạn đã có:**
- ✅ Serverless webhook handler (không cần maintain server!)
- ✅ URL HTTPS cố định
- ✅ Tích hợp Firebase hoàn chỉnh
- ✅ Production-ready
- ✅ Free tier 500K requests/tháng

**Next Steps:**
1. Monitor logs thường xuyên
2. Enable webhook signature validation
3. Thêm error notifications (email/Slack)
4. Setup monitoring/alerts

---

## 📞 Hỗ Trợ

### Supabase Docs
- Edge Functions: https://supabase.com/docs/guides/functions
- Secrets: https://supabase.com/docs/guides/functions/secrets

### Supabase Discord
```
https://discord.supabase.com
```

### Firebase Admin SDK
```
https://firebase.google.com/docs/admin/setup
```

### PayOS Support
```
support@payos.vn
```

---

## 💡 Tips

### 1. Local development

Serve function local để test nhanh:
```bash
supabase functions serve payos-webhook
```

URL: `http://localhost:54321/functions/v1/payos-webhook`

### 2. Environment-specific logic

```typescript
const isProduction = Deno.env.get("SUPABASE_ENV") === "production";
if (!isProduction) {
  console.log("Development mode - extra logging");
}
```

### 3. Reuse Firebase connection

Edge function đã cache Firebase app initialization để tối ưu performance.

### 4. Monitor usage

Dashboard → Settings → Usage

Theo dõi:
- Function invocations
- Execution time
- Errors

---

🚀 **Happy Coding!**
