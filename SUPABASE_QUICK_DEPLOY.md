# ⚡ Supabase Edge Function - Deploy Nhanh 5 Phút

## 🎯 Tóm Tắt

Deploy PayOS webhook lên Supabase Edge Functions mà **vẫn dùng Firebase** để lưu data.

**Time:** 5-10 phút
**Cost:** Free (500K requests/tháng)

---

## ⚡ 3 BƯỚC NHANH

### BƯỚC 1: Setup Supabase (2 phút)

```bash
# Cài CLI
npm install -g supabase

# Login
supabase login

# Tạo project trên https://supabase.com
# Sau đó link:
supabase link --project-ref YOUR_PROJECT_ID
```

### BƯỚC 2: Set Firebase Credentials (1 phút)

**Cách 1: Qua Dashboard (Dễ nhất)**
1. Mở: https://supabase.com/dashboard
2. **Project Settings** → **Edge Functions** → **Secrets**
3. Add secret:
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: Copy toàn bộ nội dung `serviceAccountKey.json`

**Cách 2: Qua CLI**
```bash
supabase secrets set FIREBASE_SERVICE_ACCOUNT="$(cat serviceAccountKey.json)"
```

### BƯỚC 3: Deploy (1 phút)

```bash
# Deploy function
supabase functions deploy payos-webhook

# Lấy URL
# Output: https://xxxxx.supabase.co/functions/v1/payos-webhook
```

**✅ XONG!**

---

## 🔗 Cấu Hình PayOS

**Webhook URL:**
```
https://xxxxx.supabase.co/functions/v1/payos-webhook
```

Nhập vào: PayOS Dashboard → Cài đặt → Webhook

---

## ✅ Test Ngay

### Test GET (verification):
```bash
curl https://xxxxx.supabase.co/functions/v1/payos-webhook
```

### Xem logs:
```bash
supabase functions logs payos-webhook --tail
```

---

## 📊 So Sánh Với Các Giải Pháp Khác

| Tính năng | Supabase | Railway | Ngrok |
|-----------|----------|---------|-------|
| **Setup** | 5 phút | 10 phút | 2 phút |
| **Free tier** | 500K req | ✅ | ✅ |
| **URL cố định** | ✅ | ✅ | ❌ |
| **Serverless** | ✅ | ❌ | ❌ |
| **Production** | ✅ | ✅ | ❌ Test only |
| **Maintain** | ⚡ Zero | 🔧 Cần update | 🔧 Phải chạy local |

---

## 🎯 Khi Nào Dùng Supabase?

✅ **DÙNG khi:**
- Muốn serverless (không maintain server)
- Cần production-ready ngay
- Đã có Supabase project
- Muốn free tier tốt (500K/tháng)

❌ **KHÔNG DÙNG khi:**
- Cần full control backend server
- Đã có infrastructure sẵn (VPS/Railway)
- Cần runtime lâu (>10 phút/request)

---

## 🔄 Workflow Hàng Ngày

### Update code:
```bash
# 1. Edit
nano supabase/functions/payos-webhook/index.ts

# 2. Deploy
supabase functions deploy payos-webhook

# 3. Check logs
supabase functions logs payos-webhook --tail
```

### Monitor:
- Dashboard: https://supabase.com/dashboard
- Tab "Edge Functions" → "payos-webhook" → "Logs"

---

## 🎉 Kết Quả

**Bạn có:**
- ✅ Webhook URL HTTPS cố định
- ✅ Serverless - không cần server
- ✅ Firebase integration hoàn chỉnh
- ✅ Free 500K requests/tháng
- ✅ Production-ready

**Architecture:**
```
PayOS → Supabase Edge Function → Firebase Firestore
```

---

## 📚 Docs Đầy Đủ

Chi tiết hơn: Đọc `SUPABASE_EDGE_FUNCTION_FIREBASE.md`

---

🚀 **Done! Giờ test thôi!**
