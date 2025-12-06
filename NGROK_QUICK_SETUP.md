# ⚡ Ngrok - Giải Pháp Nhanh Để Test PayOS Webhook

## 🎯 Khi Nào Dùng Ngrok?

- ✅ Bạn muốn **test PayOS webhook ngay lập tức** (2 phút)
- ✅ Backend đang chạy **local** (localhost:3000)
- ✅ Domain production chưa sẵn sàng
- ✅ Cần **HTTPS public URL** để PayOS verify

---

## ⚡ 3 BƯỚC - 2 PHÚT

### BƯỚC 1: Cài Ngrok

**Option A: NPM (Khuyến nghị)**
```bash
npm install -g ngrok
```

**Option B: Download**
- Truy cập: https://ngrok.com/download
- Download, giải nén, chạy

### BƯỚC 2: Chạy Server + Ngrok

**Terminal 1 - Chạy backend:**
```bash
npm start
```

Thấy:
```
Server đang chạy tại port 3000
```

**Terminal 2 - Chạy ngrok:**
```bash
ngrok http 3000
```

Thấy:
```
Session Status                online
Region                        Asia Pacific (ap)
Forwarding                    https://1234-abcd-5678.ngrok-free.app -> http://localhost:3000
```

### BƯỚC 3: Copy URL Vào PayOS

**Copy URL từ ngrok:**
```
https://1234-abcd-5678.ngrok-free.app
```

**Webhook URL trong PayOS:**
```
https://1234-abcd-5678.ngrok-free.app/api/payos-webhook
```

**✅ XONG! PayOS sẽ verify thành công ngay!**

---

## 🔍 Test Ngrok URL

### Test trong browser:
```
https://1234-abcd-5678.ngrok-free.app/api/payos-webhook
```

### Test bằng curl:
```bash
curl https://1234-abcd-5678.ngrok-free.app/api/payos-webhook
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

## 📊 Ngrok Dashboard

**Xem requests realtime:**

1. Mở browser: http://localhost:4040
2. Thấy tất cả requests PayOS gửi đến
3. Inspect request/response details

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. URL Thay Đổi Mỗi Lần Chạy

**Free plan:** URL ngrok thay đổi mỗi lần restart

```bash
# Lần 1
https://1234-abcd-5678.ngrok-free.app

# Lần 2 (sau khi tắt/mở lại)
https://9876-wxyz-4321.ngrok-free.app
```

**Giải pháp:**
- Update URL mới trong PayOS mỗi lần chạy ngrok
- Hoặc upgrade lên **Ngrok Pro** (có fixed domain)

### 2. Ngrok Warning Page

Lần đầu truy cập ngrok URL, có thể thấy:

```
You are about to visit: your-app
This tunnel serves content from localhost:3000

[Visit Site]
```

→ Click **"Visit Site"** để continue

**Tắt warning:** Upgrade ngrok plan hoặc bỏ qua (không ảnh hưởng PayOS webhook)

### 3. Giữ Ngrok Chạy

Ngrok cần chạy **liên tục** để nhận webhook:

- ✅ Giữ terminal ngrok mở
- ❌ Đóng terminal = ngrok dừng = webhook fail

### 4. Chỉ Dùng Cho Development

- ✅ Test, development, demo
- ❌ **KHÔNG DÙNG cho production**
- 🎯 Production → Dùng Railway/Render/VPS

---

## 🚀 Ngrok Pro (Optional)

### Tính năng thêm:

- ✅ **Fixed domain:** Không đổi URL
- ✅ **No warning page:** Truy cập trực tiếp
- ✅ **Custom domains:** Dùng domain riêng
- ✅ **More tunnels:** Chạy nhiều ngrok cùng lúc

### Giá:
- $8/month (hobby)
- $20/month (pro)

### Setup fixed domain:

```bash
ngrok http 3000 --domain=my-app.ngrok.io
```

URL cố định:
```
https://my-app.ngrok.io/api/payos-webhook
```

---

## 🔧 Troubleshooting

### Lỗi 1: "command not found: ngrok"

**Nguyên nhân:** Chưa cài ngrok

**Giải pháp:**
```bash
npm install -g ngrok
```

### Lỗi 2: "Failed to start tunnel"

**Nguyên nhân:** Port 3000 chưa chạy

**Giải pháp:**
```bash
# Terminal 1: Start server TRƯỚC
npm start

# Terminal 2: Sau đó mới chạy ngrok
ngrok http 3000
```

### Lỗi 3: "Account limit reached"

**Nguyên nhân:** Free plan chỉ cho 1 tunnel

**Giải pháp:**
- Tắt ngrok cũ (Ctrl+C)
- Chạy ngrok mới
- Hoặc upgrade plan

### Lỗi 4: PayOS báo "Webhook không hoạt động"

**Checklist:**
- [ ] Server đang chạy: `npm start`
- [ ] Ngrok đang chạy: `ngrok http 3000`
- [ ] URL chính xác: `https://xxx.ngrok-free.app/api/payos-webhook`
- [ ] Test URL: Mở trong browser, thấy JSON response
- [ ] Không có dấu `/` ở cuối URL

---

## 📋 Workflow Hoàn Chỉnh

### 1. Mỗi ngày làm việc:

```bash
# Terminal 1
cd /path/to/project
npm start

# Terminal 2
ngrok http 3000
```

### 2. Copy URL ngrok:
```
https://1234-abcd-5678.ngrok-free.app
```

### 3. Update PayOS webhook (nếu URL đổi):
```
https://1234-abcd-5678.ngrok-free.app/api/payos-webhook
```

### 4. Test đơn hàng:
- Tạo đơn trên website
- Chuyển khoản
- Xem logs trong ngrok dashboard: http://localhost:4040
- Xem logs trong terminal server
- Kiểm tra admin dashboard

### 5. Khi xong:
```bash
# Tắt ngrok: Ctrl+C trong terminal ngrok
# Tắt server: Ctrl+C trong terminal server
```

---

## 🎯 Next Steps

### Khi sẵn sàng production:

1. **Deploy backend** lên Railway/Render
   - Đọc: `DEPLOY_RAILWAY.md`

2. **Update frontend** với backend URL mới

3. **Update PayOS webhook** với URL production

4. **Ngừng dùng ngrok** cho production

---

## ✅ Checklist

- [ ] Ngrok đã cài: `ngrok version`
- [ ] Server chạy: `npm start`
- [ ] Ngrok chạy: `ngrok http 3000`
- [ ] Copy URL: `https://xxx.ngrok-free.app`
- [ ] Test URL: Mở trong browser
- [ ] Thấy JSON: `{"error": 0, "message": "Webhook URL is active"}`
- [ ] PayOS webhook configured
- [ ] PayOS hiển thị: "✓ Webhook hoạt động"
- [ ] Test thanh toán thực tế

---

## 💡 Tips

### 1. Lưu URL trong note

Mỗi lần chạy ngrok, copy URL và lưu lại để dễ reference.

### 2. Dùng ngrok dashboard

http://localhost:4040 - Cực kỳ hữu ích để debug webhook requests!

### 3. Check logs

Theo dõi cả:
- ✅ Terminal server (logs backend)
- ✅ Ngrok dashboard (logs HTTP requests)
- ✅ PayOS dashboard (webhook status)

### 4. Share URL với team

Ngrok URL có thể share với đồng nghiệp để họ test backend của bạn.

---

## 🎉 Thành Công!

Bây giờ bạn có:
- ✅ Public HTTPS URL
- ✅ Webhook hoạt động với PayOS
- ✅ Test thanh toán realtime
- ✅ Debug requests trong ngrok dashboard

**Happy Testing! 🚀**
