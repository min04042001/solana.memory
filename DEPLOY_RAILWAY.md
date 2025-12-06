# 🚀 Deploy Backend Lên Railway - Hướng Dẫn Chi Tiết

## Tại Sao Cần Deploy Backend Riêng?

**Vấn đề hiện tại:**
- ❌ `solanamemory.io.vn` host trên **Netlify** (chỉ serve static files)
- ❌ Node.js backend (`server.js`) **không chạy** trên Netlify
- ❌ PayOS webhook cần **API endpoint động**, không phải static file

**Giải pháp:**
- ✅ Deploy backend Node.js lên **Railway** (free)
- ✅ Railway cho domain HTTPS: `https://your-app.railway.app`
- ✅ PayOS webhook dùng domain Railway

---

## 📋 Yêu Cầu

- ✅ Tài khoản GitHub
- ✅ Code backend đã push lên GitHub repository
- ✅ Firebase Service Account Key (`serviceAccountKey.json`)

---

## 🚀 BƯỚC 1: Chuẩn Bị Code

### 1.1. Push code lên GitHub

Nếu chưa có repository:

```bash
# Khởi tạo git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Solana Memory Backend"

# Tạo repo trên GitHub rồi push
git remote add origin https://github.com/YOUR_USERNAME/solana-memory-backend.git
git branch -M main
git push -u origin main
```

### 1.2. Tạo file `.gitignore`

```
node_modules/
.env
serviceAccountKey.json
dist/
.DS_Store
```

**⚠️ QUAN TRỌNG:** Không push `serviceAccountKey.json` lên GitHub!

---

## 🚀 BƯỚC 2: Deploy Lên Railway

### 2.1. Tạo tài khoản Railway

1. Truy cập: https://railway.app
2. Click **"Login with GitHub"**
3. Authorize Railway truy cập GitHub

### 2.2. Tạo project mới

1. Click **"New Project"**
2. Chọn **"Deploy from GitHub repo"**
3. Chọn repository: `solana-memory-backend`
4. Click **"Deploy Now"**

Railway sẽ tự động:
- ✅ Detect Node.js project
- ✅ Chạy `npm install`
- ✅ Chạy `npm start`
- ✅ Tạo domain: `https://your-app.railway.app`

### 2.3. Đợi deploy xong

**Thời gian:** 2-3 phút

**Status:** Xem tab "Deployments"
- 🟡 Building...
- 🟢 Active (thành công!)

---

## 🚀 BƯỚC 3: Cấu Hình Environment Variables

### 3.1. Mở Settings

1. Click vào project
2. Tab **"Variables"**
3. Click **"New Variable"**

### 3.2. Thêm các biến

**PORT** (Railway tự động set, không cần thêm)

**PAYOS_CLIENT_ID**
```
Paste Client ID từ PayOS
```

**PAYOS_API_KEY**
```
Paste API Key từ PayOS
```

**PAYOS_CHECKSUM_KEY**
```
Paste Checksum Key từ PayOS
```

**FIREBASE_SERVICE_ACCOUNT**
```json
Paste toàn bộ nội dung file serviceAccountKey.json
```

### 3.3. Redeploy

Sau khi thêm variables:
1. Tab **"Deployments"**
2. Click **"Redeploy"** ở deployment mới nhất

---

## 🚀 BƯỚC 4: Lấy Domain Railway

### 4.1. Copy domain public

1. Tab **"Settings"**
2. Phần **"Domains"**
3. Railway tự tạo domain: `https://solana-memory-production.up.railway.app`

**VÍ DỤ:**
```
https://solana-memory-production.up.railway.app
```

### 4.2. (Optional) Custom domain

Nếu muốn dùng subdomain riêng:

1. Click **"Generate Domain"** hoặc **"Custom Domain"**
2. Add subdomain: `api.solanamemory.io.vn`
3. Cấu hình DNS (CNAME record) trỏ về Railway

---

## 🚀 BƯỚC 5: Test Backend

### 5.1. Test webhook endpoint

**URL Railway:**
```
https://your-app.railway.app/api/payos-webhook
```

**Test trong browser hoặc curl:**
```bash
curl https://your-app.railway.app/api/payos-webhook
```

**Kết quả mong đợi:**
```json
{
  "error": 0,
  "message": "Webhook URL is active",
  "timestamp": "2024-12-04T..."
}
```

### 5.2. Test trang admin

```
https://your-app.railway.app/admin.html
```

### 5.3. Test tạo đơn

```
https://your-app.railway.app/product.html
```

---

## 🚀 BƯỚC 6: Cấu Hình PayOS

### 6.1. Nhập webhook URL

**Truy cập:** PayOS Dashboard → Settings → Webhook

**Webhook URL:**
```
https://your-app.railway.app/api/payos-webhook
```

**Events:**
- ✅ payment.success
- ✅ payment.failed
- ✅ payment.cancelled

### 6.2. Test webhook

PayOS sẽ gửi GET request để verify.

**Kết quả:** ✅ "Webhook hoạt động"

---

## 🚀 BƯỚC 7: Cập Nhật Frontend

### 7.1. Update API base URL

Trong các file `.tsx`:

**File: `product.tsx`**
```typescript
const API_BASE_URL = "https://your-app.railway.app";
```

**File: `admin.tsx`**
```typescript
const API_BASE_URL = "https://your-app.railway.app";
```

**File: `memory-viewer.tsx`**
```typescript
const API_BASE_URL = "https://your-app.railway.app";
```

### 7.2. Rebuild frontend

```bash
npm run build
```

### 7.3. Deploy frontend lên Netlify

Frontend (static files) vẫn host trên Netlify:
- `solanamemory.io.vn` → Netlify (frontend)
- `solanamemory-production.railway.app` → Railway (backend API)

**Upload thư mục `dist/` lên Netlify.**

---

## 🚀 BƯỚC 8: Test Toàn Bộ Hệ Thống

### 8.1. Test flow mua hàng

1. Truy cập: `https://solanamemory.io.vn/product.html`
2. Chọn sản phẩm, nhập thông tin
3. Tạo đơn hàng → Nhận QR code
4. Chuyển khoản với nội dung `DH123456`
5. Sau 30s-2 phút, webhook nhận thông báo
6. Kiểm tra Admin: `https://solanamemory.io.vn/admin.html`

### 8.2. Xem logs Railway

1. Tab **"Logs"** trong Railway project
2. Theo dõi realtime:
   ```
   PayOS đang verify webhook URL...
   Đã nhận được Webhook từ PayOS!
   Đang xử lý giao dịch...
   ```

---

## 📊 So Sánh: 2 Giải Pháp

| Tính năng | Ngrok | Railway |
|-----------|-------|---------|
| **Tốc độ setup** | ⚡ 2 phút | 🟢 10 phút |
| **HTTPS** | ✅ Tự động | ✅ Tự động |
| **Permanent** | ❌ URL thay đổi | ✅ URL cố định |
| **Free** | ✅ | ✅ |
| **Production** | ❌ Chỉ test | ✅ Dùng production |
| **Uptime** | ⚠️ Phải chạy local | ✅ 24/7 |

---

## 🎯 Khuyến Nghị

### Development (Test PayOS):
- ✅ Dùng **ngrok** - nhanh, đơn giản

### Production (Thật):
- ✅ Dùng **Railway** - stable, permanent URL

---

## 🔧 Troubleshooting

### Lỗi 1: Railway build failed

**Nguyên nhân:** Thiếu dependencies

**Giải pháp:**
```bash
# Local: Đảm bảo package.json đúng
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Lỗi 2: Application failed to start

**Nguyên nhân:** PORT không đúng

**Giải pháp:** Railway tự set PORT, đảm bảo `server.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

### Lỗi 3: Firebase authentication failed

**Nguyên nhân:** Thiếu `FIREBASE_SERVICE_ACCOUNT`

**Giải pháp:**
1. Railway Variables → Add `FIREBASE_SERVICE_ACCOUNT`
2. Paste toàn bộ nội dung `serviceAccountKey.json`
3. Redeploy

### Lỗi 4: Webhook vẫn không hoạt động

**Checklist:**
- [ ] Railway deployment status: Active (green)
- [ ] Test URL: `curl https://your-app.railway.app/api/payos-webhook`
- [ ] Response: `{"error": 0, "message": "Webhook URL is active"}`
- [ ] PayOS webhook URL không có dấu `/` cuối
- [ ] Environment variables đã set đầy đủ

---

## 📞 Hỗ Trợ

### Railway Logs
```
Tab "Logs" → Theo dõi realtime
```

### Railway Discord
```
https://discord.gg/railway
```

### PayOS Support
```
support@payos.vn
```

---

## ✅ Checklist Hoàn Thành

- [ ] Code đã push lên GitHub
- [ ] Railway project đã tạo
- [ ] Environment variables đã set
- [ ] Railway deployment: Active
- [ ] Test webhook: `curl https://your-app.railway.app/api/payos-webhook`
- [ ] PayOS webhook configured
- [ ] Frontend API_BASE_URL đã update
- [ ] Frontend rebuilt & deployed to Netlify
- [ ] Test flow mua hàng end-to-end

---

## 🎉 Thành Công!

**Architecture:**
```
User Browser
    ↓
Frontend (Netlify): solanamemory.io.vn
    ↓
Backend API (Railway): your-app.railway.app
    ↓
Firebase, PayOS
```

**Webhook Flow:**
```
User thanh toán
    ↓
PayOS nhận tiền
    ↓
PayOS gửi webhook → Railway backend
    ↓
Backend lưu Firebase
    ↓
Admin dashboard hiển thị đơn mới
```

🚀 **Hệ thống đã production-ready!**
