# PayOS - Quick Start Guide

## 🚀 Kết Nối PayOS Trong 5 Phút

### 1. Lấy API Keys Từ PayOS

Truy cập: **https://pay.payos.vn/** → Đăng nhập → Cài đặt → API & Webhook

Copy 3 keys:
```
Client ID:       abcd1234-5678-90ef-ghij-klmnopqrstuv
API Key:         ak-12345678-90ab-cdef-ghij-klmnopqrstuv
Checksum Key:    ck-12345678-90ab-cdef-ghij-klmnopqrstuv
```

### 2. Tạo File .env

Tạo file `.env` trong thư mục root:

```env
PAYOS_CLIENT_ID=paste-your-client-id-here
PAYOS_API_KEY=paste-your-api-key-here
PAYOS_CHECKSUM_KEY=paste-your-checksum-key-here
```

### 3. Cấu Hình Webhook URL

Trong PayOS Dashboard → Webhook → Nhập URL:

**Production**:
```
https://your-domain.com/api/payos-webhook
```

**Development (ngrok)**:
```bash
# Cài ngrok
npm install -g ngrok

# Chạy ngrok
ngrok http 3000

# Copy URL và dán vào PayOS
https://abc123.ngrok.io/api/payos-webhook
```

### 4. Khởi Động Server

```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

### 5. Test Thanh Toán

1. **Tạo đơn hàng test** tại: `http://localhost:3000`
2. **Lấy mã thanh toán** (VD: "ID 16812345678")
3. **Chuyển khoản** với nội dung chính xác
4. **Kiểm tra Admin** → Đơn hàng tự động chuyển sang **"✓ Đã thanh toán"**

---

## ✅ Xong!

Hệ thống đã sẵn sàng nhận thanh toán tự động qua PayOS.

**Tài liệu chi tiết**: Xem file `PAYOS_INTEGRATION_GUIDE.md`

---

## 🔍 Troubleshooting

### Webhook không hoạt động?

1. **Check server logs**:
   ```bash
   # Xem logs
   tail -f server.log
   ```

2. **Test webhook endpoint**:
   ```bash
   curl https://your-domain.com/api/payos-webhook
   ```

3. **Verify .env**:
   ```bash
   cat .env
   ```

### Đơn hàng không tự động cập nhật?

1. Check `paymentContent` format: **"ID 16812345678"** (phải có "ID " phía trước)
2. Check số tiền >= giá đơn hàng
3. Check server logs có nhận webhook không

---

## 📞 Support

- Xem file: `PAYOS_INTEGRATION_GUIDE.md` để biết chi tiết
- PayOS Support: support@payos.vn
- Hotline: 1900-xxxx

---

**Chúc bạn thành công! 🎉**
