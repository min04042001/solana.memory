# 🚂 Railway - Deploy Webhook SIÊU DỄ (5 Phút)

## ✨ Tại Sao Chọn Railway?

- ✅ **KHÔNG CẦN CÀI GÌ** - Làm hết trên web
- ✅ **Push GitHub → Auto Deploy** - Tự động 100%
- ✅ **Free 500h/tháng** - Đủ xài cả tháng
- ✅ **Dùng lâu dài** - Production-ready
- ✅ **URL cố định** - Không đổi
- ✅ **Dùng code hiện tại** - Không sửa gì

---

## 🎯 TOÀN BỘ TRÊN WEB - KHÔNG CẦN TERMINAL

---

## BƯỚC 1: Push Code Lên GitHub (2 phút)

### Nếu chưa có Git repo:

1. Vào: https://github.com/new
2. Tạo repo mới: `solana-memory-backend`
3. **Quan trọng:** ✅ Chọn **Private** (vì có Firebase credentials)

### Push code lên:

```bash
cd /path/to/your/project

# Nếu chưa có git
git init
git add .
git commit -m "Initial commit"

# Link với GitHub repo
git remote add origin https://github.com/YOUR_USERNAME/solana-memory-backend.git
git branch -M main
git push -u origin main
```

**LƯU Ý:** File `serviceAccountKey.json` sẽ KHÔNG được push lên (có trong `.gitignore`)

---

## BƯỚC 2: Tạo Project Trên Railway (1 phút)

### 2.1. Đăng ký Railway
- Truy cập: https://railway.app
- Click **"Login with GitHub"**
- Authorize Railway

### 2.2. Tạo Project Mới
1. Click **"New Project"**
2. Chọn **"Deploy from GitHub repo"**
3. Chọn repo: `solana-memory-backend`
4. Click **"Deploy Now"**

**Railway tự động:**
- ✅ Detect Node.js
- ✅ Run `npm install`
- ✅ Run `npm start`
- ✅ Deploy lên production

**Đợi 2-3 phút** để deploy xong

---

## BƯỚC 3: Set Environment Variables (2 phút)

### 3.1. Mở Settings

1. Click vào project vừa tạo
2. Tab **"Variables"**

### 3.2. Add Firebase Credentials

Click **"Raw Editor"** và paste:

```bash
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id",...}
```

**Cách lấy:** Copy toàn bộ nội dung file `serviceAccountKey.json`

**Hoặc add từng dòng:**
- Click **"New Variable"**
- Copy paste từng field từ `serviceAccountKey.json`

### 3.3. (Optional) Add PayOS Keys

Nếu dùng PayOS API:

```bash
PAYOS_CLIENT_ID=your-client-id
PAYOS_API_KEY=your-api-key
PAYOS_CHECKSUM_KEY=your-checksum-key
```

### 3.4. Save

Click **"Save"** → Railway tự động redeploy

---

## BƯỚC 4: Lấy URL Webhook (30 giây)

### 4.1. Generate Domain

1. Tab **"Settings"**
2. Section **"Networking"**
3. Click **"Generate Domain"**

**Nhận URL:**
```
https://your-app-production.up.railway.app
```

### 4.2. Webhook URL Hoàn Chỉnh

```
https://your-app-production.up.railway.app/api/payos-webhook
```

**Copy URL này!**

---

## BƯỚC 5: Cấu Hình PayOS (1 phút)

1. Login: https://my.payos.vn
2. **Cài đặt** → **Webhook**
3. Paste URL:
   ```
   https://your-app-production.up.railway.app/api/payos-webhook
   ```
4. Events:
   - ✅ payment.success
   - ✅ payment.failed
   - ✅ payment.cancelled
5. Click **"Lưu"**

PayOS sẽ gửi GET request test → ✅ **"Webhook đang hoạt động"**

---

## ✅ XONG! TEST NGAY

### Test 1: Kiểm tra server đang chạy

Mở URL trong browser:
```
https://your-app-production.up.railway.app/api/payos-webhook
```

**Kết quả mong đợi:**
```json
{
  "error": 0,
  "message": "Webhook URL is active",
  "timestamp": "2024-12-04T..."
}
```

### Test 2: Tạo đơn hàng thật

1. Vào: `https://solanamemory.io.vn/product.html`
2. Chọn sản phẩm, tạo đơn
3. Thanh toán test
4. Xem logs Railway (realtime)

---

## 📊 Xem Logs Realtime

### Trên Dashboard:

1. Click vào project
2. Tab **"Deployments"**
3. Click deployment mới nhất
4. Tab **"Logs"** → Xem realtime

**Logs mong đợi:**
```
Server running on port 3000
Firebase initialized successfully
Đã nhận được Webhook từ PayOS!
✅ Thành công! Đã cập nhật đơn hàng xxx thành 'paid'
```

---

## 🔄 Update Code (Tự Động 100%)

### Khi sửa code:

```bash
# 1. Edit code
nano server.js

# 2. Commit & Push
git add .
git commit -m "Update webhook logic"
git push

# 3. Railway tự động deploy
# XONG! Không làm gì thêm!
```

**Railway tự động:**
- ✅ Detect push
- ✅ Build lại
- ✅ Deploy mới
- ✅ Zero downtime

---

## 💰 Chi Phí

### Free Tier:
- ✅ **$5 credit/tháng** = ~500 hours
- ✅ **Unlimited requests**
- ✅ **Unlimited bandwidth**

**Tính toán:**
- Server chạy 24/7 = 720 hours/tháng
- Free tier = 500 hours
- **→ Vượt ~220 hours = Khoảng $1-2/tháng**

### Nếu muốn 100% free:

**Option 1:** Sleep khi không dùng (qua Railway API hoặc code)

**Option 2:** Dùng Railway free tier + Supabase Edge Functions backup

**Option 3:** Upgrade Railway $5/mo (đơn giản nhất)

---

## 🎯 So Sánh Railway vs Supabase

| Tính năng | Railway 🚂 | Supabase 🔥 |
|-----------|-----------|------------|
| **Setup** | 5 phút, 100% web | 5 phút, cần CLI |
| **Cài đặt** | ❌ Không cần cài gì | ✅ Cần cài CLI |
| **Deploy** | Push Git → Auto | Chạy CLI command |
| **Free tier** | 500h/mo (~$5) | 500K requests |
| **Serverless** | ❌ | ✅ |
| **URL** | ✅ Cố định | ✅ Cố định |
| **Code** | Dùng hiện tại | Chuyển sang Deno |
| **Logs** | ✅ Realtime | ✅ Realtime |
| **Dễ nhất** | 🏆 **WINNER** | ⭐ Cần CLI |

---

## 🏆 Railway Thắng Vì:

1. ✅ **KHÔNG CẦN CÀI GÌ CẢ** - Làm hết trên web
2. ✅ **Push Git → Auto Deploy** - Không động gì thêm
3. ✅ **Dùng code hiện tại** - Không sửa
4. ✅ **Setup nhanh nhất** - 5 phút
5. ✅ **Dùng lâu dài** - Production-ready

---

## 🔧 Troubleshooting

### Lỗi 1: Deploy failed

**Nguyên nhân:** `npm install` lỗi

**Giải pháp:**
- Check `package.json` có đúng không
- Railway logs sẽ chỉ lỗi cụ thể

### Lỗi 2: Server crash khi start

**Nguyên nhân:** Thiếu environment variables

**Giải pháp:**
- Check tab **"Variables"**
- Đảm bảo có `FIREBASE_SERVICE_ACCOUNT`

### Lỗi 3: Webhook không cập nhật Firestore

**Checklist:**
- [ ] Environment variables đã set?
- [ ] Railway logs có thấy "Đã nhận được Webhook từ PayOS"?
- [ ] Firebase credentials đúng?
- [ ] PayOS webhook URL đúng?

**Debug:**
- Xem Railway logs realtime
- Check Firebase Console

### Lỗi 4: Application failed to respond

**Nguyên nhân:** Port không đúng

**Giải pháp:** Server phải listen trên `process.env.PORT`

**Fix trong `server.js`:**
```javascript
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## 📱 Railway Mobile App

Railway có app mobile để:
- ✅ Xem logs
- ✅ Monitor deployments
- ✅ Restart service

**Download:**
- iOS: App Store
- Android: Google Play

---

## 🎉 Checklist Hoàn Thành

- [ ] Code đã push lên GitHub (Private repo)
- [ ] Railway project đã tạo
- [ ] GitHub repo đã kết nối
- [ ] Environment variables đã set
- [ ] Domain đã generate
- [ ] PayOS webhook đã config
- [ ] Test GET: `https://your-app.railway.app/api/payos-webhook`
- [ ] Test thanh toán thật
- [ ] Logs hiển thị webhook received
- [ ] Firebase order đã update
- [ ] Admin dashboard hiển thị đơn mới

---

## 🚀 Next Steps

### 1. Monitor Usage
- Dashboard → Usage
- Theo dõi hours/tháng
- Nếu gần hết 500h → Upgrade $5/mo

### 2. Setup Notifications
- Settings → Notifications
- Discord/Slack/Email khi deploy xong/lỗi

### 3. Custom Domain (Optional)
- Settings → Domains
- Add custom domain nếu muốn

### 4. Backup Solution
- Có thể setup Supabase Edge Functions làm backup
- Hoặc dùng Railway + Render (2 servers)

---

## 💡 Pro Tips

### Tip 1: Environment per branch

Railway support nhiều environments:
- `main` branch → Production
- `dev` branch → Staging

### Tip 2: Health checks

Thêm endpoint:
```javascript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});
```

### Tip 3: Automatic restart

Railway tự động restart nếu crash. Config trong `railway.json`:
```json
{
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Tip 4: Database connection pooling

Nếu nhiều requests, thêm connection pooling cho Firebase.

---

## 🌟 TÓM TẮT 5 BƯỚC

```
1. Push GitHub (Private repo)
   ↓
2. Railway: New Project → Deploy from GitHub
   ↓
3. Set Environment Variables (FIREBASE_SERVICE_ACCOUNT)
   ↓
4. Generate Domain → Copy webhook URL
   ↓
5. PayOS → Cài đặt Webhook → Paste URL
   ↓
✅ DONE! AUTO DEPLOY MỖI KHI PUSH!
```

---

## 📞 Support

### Railway Docs
```
https://docs.railway.app
```

### Railway Discord
```
https://discord.gg/railway
```

### Railway Status
```
https://status.railway.app
```

---

## 🎯 KẾT LUẬN

**Railway = Giải pháp DỄ NHẤT cho người không thích terminal!**

- ✅ Làm hết trên web
- ✅ Push Git → Tự động deploy
- ✅ Không cần cài CLI
- ✅ Dùng lâu dài
- ✅ Free 500h/tháng
- ✅ Production-ready

**Setup 1 lần → Quên đi → Tự động mãi mãi!**

---

🚂 **Happy Railway Deployment!**
