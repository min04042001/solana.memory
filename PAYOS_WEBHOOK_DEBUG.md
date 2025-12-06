# PayOS Webhook - Hướng Dẫn Debug & Khắc Phục

## 🔧 Vấn Đề: "Webhook không hoạt động"

Khi cấu hình webhook trong PayOS báo **"Webhook không hoạt động"**, thực hiện các bước sau:

---

## ✅ BƯỚC 1: Kiểm Tra Server Đang Chạy

### 1.1. Khởi động server

```bash
# Trong thư mục project
npm start
```

Server phải hiển thị:
```
Server đang chạy tại port 3000
```

### 1.2. Kiểm tra server có accessible không

**Từ máy local:**
```bash
curl http://localhost:3000/api/payos-webhook
```

**Kết quả mong đợi:**
```json
{
  "error": 0,
  "message": "Webhook URL is active",
  "timestamp": "2024-12-04T..."
}
```

---

## ✅ BƯỚC 2: Kiểm Tra Domain Public

### 2.1. Test từ bên ngoài

**Từ trình duyệt hoặc Postman:**
```
https://solanamemory.io.vn/api/payos-webhook
```

**Kết quả mong đợi:**
- ✅ HTTP Status: 200 OK
- ✅ Response: `{"error": 0, "message": "Webhook URL is active", ...}`

### 2.2. Nếu không truy cập được

**Nguyên nhân có thể:**
1. ❌ Server chưa chạy
2. ❌ Port 3000 chưa mở (firewall)
3. ❌ Nginx/reverse proxy chưa cấu hình
4. ❌ SSL certificate có vấn đề

---

## ✅ BƯỚC 3: Cấu Hình Nginx (nếu dùng)

### 3.1. File cấu hình Nginx

**Vị trí:** `/etc/nginx/sites-available/solanamemory.io.vn`

**Nội dung:**
```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name solanamemory.io.vn www.solanamemory.io.vn;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/solanamemory.io.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/solanamemory.io.vn/privkey.pem;

    # API endpoint - QUAN TRỌNG
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3.2. Test và reload Nginx

```bash
# Test cấu hình
sudo nginx -t

# Reload
sudo systemctl reload nginx

# Restart nếu cần
sudo systemctl restart nginx
```

---

## ✅ BƯỚC 4: Kiểm Tra SSL Certificate

PayOS **YÊU CẦU HTTPS**, không chấp nhận HTTP.

### 4.1. Kiểm tra SSL

```bash
# Test SSL
curl -I https://solanamemory.io.vn

# Hoặc dùng SSL checker online
# https://www.sslshopper.com/ssl-checker.html
```

### 4.2. Cài đặt SSL với Let's Encrypt

```bash
# Cài Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Lấy certificate
sudo certbot --nginx -d solanamemory.io.vn -d www.solanamemory.io.vn

# Auto-renew
sudo certbot renew --dry-run
```

---

## ✅ BƯỚC 5: Kiểm Tra Firewall

### 5.1. Mở port cần thiết

```bash
# Kiểm tra firewall
sudo ufw status

# Mở port 80, 443
sudo ufw allow 80
sudo ufw allow 443

# Reload
sudo ufw reload
```

### 5.2. Kiểm tra port đang listen

```bash
# Kiểm tra port 3000
sudo netstat -tuln | grep 3000

# Hoặc
sudo lsof -i :3000
```

---

## ✅ BƯỚC 6: Test Webhook URL Từ Bên Ngoài

### 6.1. Dùng curl

```bash
# GET request (để verify)
curl -X GET https://solanamemory.io.vn/api/payos-webhook

# POST request (giống PayOS)
curl -X POST https://solanamemory.io.vn/api/payos-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "code": "00",
    "desc": "test",
    "data": {
      "orderCode": 123456,
      "amount": 100000,
      "description": "Test webhook"
    }
  }'
```

### 6.2. Kết quả mong đợi

**GET:**
```json
{
  "error": 0,
  "message": "Webhook URL is active",
  "timestamp": "2024-12-04T..."
}
```

**POST:**
```json
{
  "error": 0,
  "message": "Webhook processed successfully."
}
```

---

## ✅ BƯỚC 7: Cấu Hình Lại PayOS

### 7.1. URL chính xác

Nhập vào PayOS:
```
https://solanamemory.io.vn/api/payos-webhook
```

**LƯU Ý:**
- ✅ Dùng `https://` (KHÔNG dùng `http://`)
- ✅ Không có dấu `/` ở cuối
- ✅ Chính xác: `/api/payos-webhook`

### 7.2. Events cần chọn

Trong PayOS → Webhook Settings:
- ✅ `payment.success`
- ✅ `payment.failed`
- ✅ `payment.cancelled`

### 7.3. Test Webhook

Sau khi nhập URL, PayOS sẽ:
1. Gửi GET request để verify
2. Hiển thị **"✓ Webhook hoạt động"** nếu thành công

---

## ✅ BƯỚC 8: Xem Logs Server

### 8.1. Theo dõi logs realtime

```bash
# Nếu dùng pm2
pm2 logs

# Nếu chạy trực tiếp
# (logs sẽ hiển thị trong terminal)
```

### 8.2. Logs khi PayOS verify

```
PayOS đang verify webhook URL...
```

### 8.3. Logs khi nhận webhook thực

```
---
Đã nhận được Webhook từ PayOS! 2024-12-04T10:30:00.000Z
Headers: {...}
Body: {...}
Đang xử lý giao dịch PayOS - OrderCode: 123456
...
```

---

## 🚀 GIẢI PHÁP NHANH: Dùng Ngrok (Development)

Nếu server của bạn chưa có domain public hoặc SSL:

### 1. Cài đặt ngrok

```bash
npm install -g ngrok
```

### 2. Chạy ngrok

```bash
ngrok http 3000
```

### 3. Copy URL

```
Forwarding: https://abc123.ngrok.io -> http://localhost:3000
```

### 4. Dùng URL ngrok trong PayOS

```
https://abc123.ngrok.io/api/payos-webhook
```

**LƯU Ý:**
- ✅ Ngrok tự động có HTTPS
- ✅ Hoạt động ngay lập tức
- ⚠️ URL thay đổi mỗi lần chạy lại (free plan)
- ⚠️ Chỉ dùng cho development/testing

---

## 🔍 Checklist Debug

- [ ] Server đang chạy ở port 3000
- [ ] `curl http://localhost:3000/api/payos-webhook` trả về 200
- [ ] `curl https://solanamemory.io.vn/api/payos-webhook` trả về 200
- [ ] Domain có SSL certificate hợp lệ
- [ ] Nginx đã cấu hình proxy cho `/api/`
- [ ] Firewall đã mở port 80, 443
- [ ] PayOS webhook URL là: `https://solanamemory.io.vn/api/payos-webhook`
- [ ] Không có dấu `/` ở cuối URL
- [ ] Dùng `https://` không phải `http://`

---

## 📊 Test Commands Summary

```bash
# 1. Test local
curl http://localhost:3000/api/payos-webhook

# 2. Test public domain
curl https://solanamemory.io.vn/api/payos-webhook

# 3. Test POST
curl -X POST https://solanamemory.io.vn/api/payos-webhook \
  -H "Content-Type: application/json" \
  -d '{"code":"00","data":{"orderCode":123456,"amount":100000,"description":"Test"}}'

# 4. Check SSL
curl -I https://solanamemory.io.vn

# 5. Check Nginx
sudo nginx -t
sudo systemctl status nginx

# 6. Check firewall
sudo ufw status

# 7. Check port
sudo netstat -tuln | grep 3000
```

---

## 🆘 Vẫn Không Hoạt Động?

### Giải pháp tạm thời:

1. **Dùng ngrok** (xem phần trên)
2. **Kiểm tra server logs** để biết có nhận request không
3. **Liên hệ PayOS support**: support@payos.vn

### Thông tin cần cung cấp cho support:

- URL webhook: `https://solanamemory.io.vn/api/payos-webhook`
- Kết quả test: `curl https://solanamemory.io.vn/api/payos-webhook`
- Server logs khi PayOS test webhook
- Screenshot lỗi từ PayOS Dashboard

---

## ✅ Sau Khi Webhook Hoạt Động

1. **Enable signature validation** (uncomment trong `server.js`):
   ```javascript
   if (!signature && PAYOS_CHECKSUM_KEY) {
       return res.status(401).json({ error: -1, message: 'Invalid signature' });
   }
   ```

2. **Test thanh toán thật**:
   - Tạo đơn hàng
   - Chuyển khoản với mã `paymentContent`
   - Kiểm tra Admin

3. **Monitor logs** thường xuyên

---

## 🎉 Thành Công!

Khi PayOS hiển thị **"✓ Webhook hoạt động"**, có nghĩa là:
- ✅ URL accessible từ internet
- ✅ SSL certificate hợp lệ
- ✅ Server response đúng format
- ✅ Sẵn sàng nhận webhook thực

**Chúc mừng! Hệ thống đã sẵn sàng. 🚀**
