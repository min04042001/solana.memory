# Hướng Dẫn Kết Nối PayOS - Tự Động Xác Nhận Thanh Toán

Hệ thống hiện đã tích hợp **PayOS Webhook** để tự động xác nhận thanh toán. Khi khách hàng thanh toán qua PayOS, hệ thống sẽ tự động cập nhật trạng thái đơn hàng từ `pending` → `paid`.

---

## 📋 Mục Lục

1. [Tổng Quan PayOS](#tổng-quan-payos)
2. [Đăng Ký PayOS](#đăng-ký-payos)
3. [Lấy Thông Tin API](#lấy-thông-tin-api)
4. [Cấu Hình Webhook](#cấu-hình-webhook)
5. [Cấu Hình Server](#cấu-hình-server)
6. [Test Webhook](#test-webhook)
7. [Quy Trình Thanh Toán](#quy-trình-thanh-toán)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Tổng Quan PayOS

**PayOS** là cổng thanh toán của Casso, hỗ trợ:
- ✅ Chuyển khoản ngân hàng tức thì
- ✅ QR Code thanh toán
- ✅ Webhook tự động
- ✅ Quản lý giao dịch
- ✅ Hỗ trợ đa ngân hàng

### Ưu Điểm
- Tự động xác nhận thanh toán (không cần admin duyệt thủ công)
- Webhook realtime (giao dịch được cập nhật ngay lập tức)
- Tích hợp đơn giản
- Phí thấp

---

## 📝 Đăng Ký PayOS

### Bước 1: Truy cập PayOS

1. Truy cập: **https://pay.payos.vn/**
2. Click **"Đăng ký"** hoặc **"Tạo tài khoản"**

### Bước 2: Điền Thông Tin

1. **Thông tin doanh nghiệp**:
   - Tên doanh nghiệp
   - Mã số thuế (nếu có)
   - Địa chỉ
   - Số điện thoại

2. **Thông tin người đại diện**:
   - Họ tên
   - Email
   - CMND/CCCD

3. **Thông tin ngân hàng**:
   - Tên ngân hàng
   - Số tài khoản
   - Tên chủ tài khoản

### Bước 3: Xác Thực

1. Xác thực email
2. Xác thực số điện thoại
3. Xác thực tài khoản ngân hàng (chuyển 1,000đ để xác thực)

### Bước 4: Chờ Duyệt

- Thời gian duyệt: 1-3 ngày làm việc
- PayOS sẽ thông báo qua email khi tài khoản được kích hoạt

---

## 🔑 Lấy Thông Tin API

Sau khi tài khoản được duyệt:

### Bước 1: Đăng Nhập PayOS

1. Truy cập: **https://pay.payos.vn/**
2. Đăng nhập với tài khoản đã đăng ký

### Bước 2: Vào Phần Cài Đặt

1. Click vào **"Cài đặt"** hoặc **"Settings"**
2. Chọn **"API & Webhook"**

### Bước 3: Lấy API Keys

Bạn sẽ thấy 3 thông tin quan trọng:

```
Client ID:          abcd1234-5678-90ef-ghij-klmnopqrstuv
API Key:            ak-12345678-90ab-cdef-ghij-klmnopqrstuv
Checksum Key:       ck-12345678-90ab-cdef-ghij-klmnopqrstuv
```

**LƯU Ý**:
- ⚠️ **KHÔNG CHIA SẺ** các key này với bất kỳ ai
- ⚠️ Lưu vào nơi an toàn (file .env)
- ⚠️ Không commit vào Git

---

## ⚙️ Cấu Hình Webhook

### Bước 1: Lấy Webhook URL

Webhook URL của bạn sẽ là:

```
https://your-domain.com/api/payos-webhook
```

**Ví dụ**:
- Production: `https://solana-memory.com/api/payos-webhook`
- Development (với ngrok): `https://abc123.ngrok.io/api/payos-webhook`

### Bước 2: Cấu Hình Trong PayOS

1. Vào **"Cài đặt"** → **"Webhook"**
2. Nhập **Webhook URL**: `https://your-domain.com/api/payos-webhook`
3. Chọn **Events** muốn nhận:
   - ✅ `payment.success` (Thanh toán thành công)
   - ✅ `payment.failed` (Thanh toán thất bại)
   - ✅ `payment.cancelled` (Thanh toán bị hủy)
4. Click **"Lưu"**

### Bước 3: Test Webhook

PayOS sẽ gửi 1 request test đến webhook URL của bạn. Nếu thành công, bạn sẽ thấy:

```
✅ Webhook connected successfully
```

---

## 🖥️ Cấu Hình Server

### Bước 1: Cập Nhật File .env

Tạo file `.env` trong thư mục root:

```env
# PayOS Configuration
PAYOS_CLIENT_ID=abcd1234-5678-90ef-ghij-klmnopqrstuv
PAYOS_API_KEY=ak-12345678-90ab-cdef-ghij-klmnopqrstuv
PAYOS_CHECKSUM_KEY=ck-12345678-90ab-cdef-ghij-klmnopqrstuv
```

### Bước 2: Load Environment Variables

Server đã được cấu hình để tự động load `.env`. Nếu chưa, thêm vào `server.js`:

```javascript
require('dotenv').config();
```

### Bước 3: Cài Đặt dotenv (nếu chưa có)

```bash
npm install dotenv
```

### Bước 4: Khởi Động Lại Server

```bash
npm start
```

### Bước 5: Kiểm Tra Logs

Server sẽ in ra:

```
Server đang chạy tại port 3000
PayOS Webhook endpoint: /api/payos-webhook
```

---

## 🧪 Test Webhook

### Sử dụng ngrok (Development)

Nếu đang develop trên localhost, dùng **ngrok** để expose server:

1. **Cài đặt ngrok**:
   ```bash
   npm install -g ngrok
   ```

2. **Chạy ngrok**:
   ```bash
   ngrok http 3000
   ```

3. **Lấy URL**:
   ```
   Forwarding: https://abc123.ngrok.io -> http://localhost:3000
   ```

4. **Cập nhật webhook URL** trong PayOS:
   ```
   https://abc123.ngrok.io/api/payos-webhook
   ```

### Test Webhook Từ PayOS

1. Vào PayOS Dashboard
2. Chọn **"Webhook"** → **"Test Webhook"**
3. Click **"Send Test"**
4. Kiểm tra logs server:

```
---
Đã nhận được Webhook từ PayOS! 2024-12-04T10:30:00.000Z
Headers: {...}
Body: {
  "code": "00",
  "desc": "success",
  "data": {
    "orderCode": 123456,
    "amount": 100000,
    "description": "Test webhook"
  }
}
```

### Test Với Giao Dịch Thực

1. Tạo 1 đơn hàng test trong app
2. Lấy `paymentContent` (VD: "ID 16812345678")
3. Chuyển khoản với nội dung chính xác
4. Kiểm tra logs:

```
Đang xử lý giao dịch PayOS - OrderCode: 123456
Đã trích xuất mã thanh toán: "ID 16812345678"
Đã tìm thấy đơn hàng abc123 trong collection memories
✅ Thành công! Đã cập nhật đơn hàng abc123 thành 'paid'
```

5. Vào Admin, xem đơn hàng đã chuyển sang **"✓ Đã thanh toán"**

---

## 💳 Quy Trình Thanh Toán

### 1. Khách Hàng Đặt Hàng

```
Customer → Điền form → Submit
              ↓
         [Tạo Order]
              ↓
    status: 'pending'
    paymentContent: 'ID 16812345678'
```

### 2. Khách Hàng Thanh Toán

```
Customer → Chuyển khoản ngân hàng
              ↓
    Nội dung: "ID 16812345678"
    Số tiền: 500,000đ
              ↓
         [PayOS nhận CK]
```

### 3. PayOS Gửi Webhook

```
PayOS → POST /api/payos-webhook
              ↓
    {
      "code": "00",
      "data": {
        "orderCode": 123456,
        "amount": 500000,
        "description": "ID 16812345678"
      }
    }
```

### 4. Server Xử Lý

```
Server:
  1. Validate signature ✓
  2. Check code === '00' ✓
  3. Extract paymentId: "ID 16812345678" ✓
  4. Find order in Firestore ✓
  5. Check amount >= order.price ✓
  6. Update status → 'paid' ✓
```

### 5. Admin Xem Kết Quả

```
Admin Dashboard:
  Order #abc123
  Status: ✓ Đã thanh toán
  Payment Method: PayOS
  Paid At: 04/12/2024 10:30
```

---

## 🛠️ Troubleshooting

### Webhook Không Nhận Được

**Nguyên nhân**:
1. URL sai
2. Server không chạy
3. Firewall/Port bị chặn
4. SSL certificate không hợp lệ (HTTPS required)

**Giải pháp**:
```bash
# Check server đang chạy
curl https://your-domain.com/api/payos-webhook

# Check với ngrok (development)
curl https://abc123.ngrok.io/api/payos-webhook

# Xem logs server
tail -f server.log
```

### Đơn Hàng Không Tự Động Cập Nhật

**Nguyên nhân**:
1. `paymentContent` không khớp
2. Số tiền không đủ
3. Order đã ở trạng thái `paid`

**Giải pháp**:
```javascript
// Check logs server
console.log("Tìm kiếm order với paymentContent:", paymentId);
console.log("Số tiền cần:", order.price);
console.log("Số tiền nhận:", amount);

// Verify trong Firestore
// Collection: memories or gift_orders
// Field: paymentContent === "ID 16812345678"
```

### Signature Không Hợp Lệ

**Nguyên nhân**:
- `PAYOS_CHECKSUM_KEY` sai

**Giải pháp**:
```bash
# Kiểm tra .env
cat .env | grep PAYOS_CHECKSUM_KEY

# Update lại từ PayOS Dashboard
```

### Đơn Hàng Không Tìm Thấy

**Nguyên nhân**:
- `paymentContent` format sai
- Order chưa tồn tại trong Firestore

**Giải pháp**:
```javascript
// paymentContent phải có format: "ID 16812345678"
// Regex: /ID \d+/

// Check trong Firestore:
db.collection('memories')
  .where('paymentContent', '==', 'ID 16812345678')
  .get()
```

---

## 📊 Webhook Data Structure

### PayOS Webhook Request

```json
{
  "code": "00",
  "desc": "success",
  "data": {
    "orderCode": 123456,
    "amount": 500000,
    "description": "ID 16812345678",
    "accountNumber": "1234567890",
    "reference": "FT21234567890",
    "transactionDateTime": "2024-12-04 10:30:00",
    "currency": "VND",
    "paymentLinkId": "abc123",
    "code": "00",
    "desc": "Thành công",
    "counterAccountBankId": "970422",
    "counterAccountBankName": "MB Bank",
    "counterAccountName": "NGUYEN VAN A",
    "counterAccountNumber": "0987654321"
  },
  "signature": "..."
}
```

### Server Response

```json
{
  "error": 0,
  "message": "Webhook processed successfully."
}
```

---

## 🔐 Security

### Best Practices

1. **Luôn validate signature**:
   ```javascript
   if (!signature && PAYOS_CHECKSUM_KEY) {
     return res.status(401).json({ error: -1, message: 'Invalid signature' });
   }
   ```

2. **Check code status**:
   ```javascript
   if (code !== '00') {
     return res.status(200).json({ error: 0, message: 'Transaction not successful' });
   }
   ```

3. **Verify amount**:
   ```javascript
   if (amount < orderData.price) {
     console.warn('Amount not enough');
     return;
   }
   ```

4. **Check order status**:
   ```javascript
   if (orderData.status !== 'pending') {
     console.log('Order already processed');
     return;
   }
   ```

5. **Use HTTPS**:
   - PayOS yêu cầu webhook URL phải dùng HTTPS
   - Không dùng HTTP trong production

---

## 📈 Monitoring

### Logs Cần Theo Dõi

```javascript
// Webhook received
console.log("Đã nhận được Webhook từ PayOS!");

// Transaction processing
console.log(`Đang xử lý giao dịch - OrderCode: ${orderCode}`);

// Order found
console.log(`Đã tìm thấy đơn hàng ${orderDoc.id}`);

// Update success
console.log(`✅ Thành công! Đã cập nhật đơn hàng ${orderDoc.id} thành 'paid'`);

// Errors
console.error("Lỗi nghiêm trọng khi xử lý webhook PayOS:", error);
```

### Metrics Cần Track

- Total webhooks received
- Success rate
- Failed transactions
- Average processing time
- Orders auto-confirmed

---

## 🎓 Additional Resources

### Documentation
- PayOS Docs: https://docs.payos.vn/
- PayOS API: https://api-docs.payos.vn/

### Support
- Email: support@payos.vn
- Hotline: 1900-xxxx
- Facebook: fb.com/payos.vn

### FAQ
- https://payos.vn/faq

---

## ✅ Checklist Hoàn Thành

- [ ] Đăng ký tài khoản PayOS
- [ ] Xác thực tài khoản
- [ ] Lấy API Keys (Client ID, API Key, Checksum Key)
- [ ] Tạo file `.env` với keys
- [ ] Cấu hình Webhook URL trong PayOS
- [ ] Test webhook với PayOS Dashboard
- [ ] Test webhook với giao dịch thực
- [ ] Kiểm tra đơn hàng tự động cập nhật trong Admin
- [ ] Deploy lên production
- [ ] Monitor logs và metrics

---

## 🎉 Kết Luận

Sau khi hoàn thành các bước trên:

✅ **Khách hàng** có thể thanh toán qua PayOS
✅ **Hệ thống** tự động xác nhận thanh toán
✅ **Admin** không cần duyệt thủ công
✅ **Trạng thái** cập nhật realtime
✅ **Đơn hàng** hiển thị đầy đủ trong Admin

**Lưu ý cuối cùng**:
- Luôn test trên môi trường development trước
- Monitor logs thường xuyên
- Backup database định kỳ
- Keep API keys secure

Good luck! 🚀
