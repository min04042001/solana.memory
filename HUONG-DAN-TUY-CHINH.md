# 📖 Hướng Dẫn Tùy Chỉnh Giao Diện Kỷ Niệm

## 🎨 Tổng Quan

Bạn có thể tùy chỉnh **10 giao diện khác nhau** cho sản phẩm kỷ niệm. Mỗi giao diện có:
- **Màu sắc riêng** (gradient background)
- **Animation riêng** (hiệu ứng chuyển động)
- **Template ID** từ 1-10

---

## 📂 File Cần Chỉnh Sửa

### **File: `secure-memory.html`** (Dòng 33-44)

Tìm object `TEMPLATES` trong code:

```javascript
const TEMPLATES={
    1:{name:'Purple Dream',bg:'linear-gradient(...)',primary:'#667eea',secondary:'#764ba2',animation:'fadeInUp'},
    2:{name:'Ocean Breeze',bg:'linear-gradient(...)',primary:'#4facfe',secondary:'#00f2fe',animation:'slideInLeft'},
    // ... 8 templates còn lại
};
```

---

## 🎯 Các Thông Số Có Thể Tùy Chỉnh

### **1. Tên Template (`name`)**
- Tên hiển thị của template
- **VD:** `'Purple Dream'`, `'Ocean Breeze'`

### **2. Background Gradient (`bg`)**
- Màu nền gradient
- **Format:** `'linear-gradient(135deg, MÀU_1 0%, MÀU_2 100%)'`
- **VD:** `'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'`

### **3. Màu Chính (`primary`)**
- Màu chủ đạo cho tiêu đề, icon
- **Format:** Mã màu HEX
- **VD:** `'#667eea'`

### **4. Màu Phụ (`secondary`)**
- Màu phụ (tùy chọn, có thể dùng cho hiệu ứng)
- **Format:** Mã màu HEX
- **VD:** `'#764ba2'`

### **5. Animation (`animation`)**
- Hiệu ứng chuyển động khi trang load
- **Các animation có sẵn:**

| Animation | Mô tả |
|-----------|-------|
| `fadeInUp` | Trượt từ dưới lên + mờ dần rõ |
| `fadeInDown` | Trượt từ trên xuống + mờ dần rõ |
| `slideInLeft` | Trượt từ trái sang phải |
| `slideInRight` | Trượt từ phải sang trái |
| `zoomIn` | Phóng to từ nhỏ |
| `bounceIn` | Nảy vào (elastic) |
| `rotateIn` | Xoay vào |
| `flipInX` | Lật 3D theo trục X |
| `heartBeat` | Nhịp đập tim |
| `pulse` | Đập nhẹ liên tục |

---

## 💡 Ví Dụ Tùy Chỉnh

### **Ví dụ 1: Thay đổi màu sắc Template 1**

**Trước:**
```javascript
1:{name:'Purple Dream',bg:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',primary:'#667eea',secondary:'#764ba2',animation:'fadeInUp'},
```

**Sau:**
```javascript
1:{name:'Red Passion',bg:'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',primary:'#ff0844',secondary:'#ffb199',animation:'fadeInUp'},
```

### **Ví dụ 2: Thay đổi animation Template 3**

**Trước:**
```javascript
3:{name:'Sunset Glow',bg:'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',primary:'#fa709a',secondary:'#fee140',animation:'zoomIn'},
```

**Sau:**
```javascript
3:{name:'Sunset Glow',bg:'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',primary:'#fa709a',secondary:'#fee140',animation:'heartBeat'},
```

### **Ví dụ 3: Tạo theme hoàn toàn mới cho Template 5**

**Trước:**
```javascript
5:{name:'Rose Gold',bg:'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',primary:'#f093fb',secondary:'#f5576c',animation:'rotateIn'},
```

**Sau (Theme xanh đen cyberpunk):**
```javascript
5:{name:'Cyber Night',bg:'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',primary:'#00ffff',secondary:'#ff00ff',animation:'flipInX'},
```

---

## 🔧 Quy Trình Tùy Chỉnh

### **Bước 1: Mở file**
```bash
nano secure-memory.html
# hoặc dùng text editor bất kỳ
```

### **Bước 2: Tìm object TEMPLATES**
- Dòng **33-44** trong file
- Tìm template ID tương ứng với sản phẩm

### **Bước 3: Chỉnh sửa**
- Thay đổi `bg`, `primary`, `secondary`, `animation`
- Lưu file

### **Bước 4: Copy sang thư mục dist**
```bash
cp secure-memory.html dist/
```

### **Bước 5: Test**
- Tạo đơn hàng mới với sản phẩm có template ID đã sửa
- Scan QR code để xem kết quả

---

## 🎨 Công Cụ Hỗ Trợ

### **1. Tạo Gradient**
- **Website:** https://cssgradient.io/
- Copy code `linear-gradient(...)` và paste vào `bg`

### **2. Chọn Màu**
- **Website:** https://coolors.co/
- Copy mã HEX và paste vào `primary`/`secondary`

### **3. Preview Animation**
- **Website:** https://animate.style/
- Xem trước các animation trước khi áp dụng

---

## 🗂️ Gán Template ID Cho Sản Phẩm

### **Trong Firebase Console:**

1. Vào **Firestore Database**
2. Chọn collection `memories_products` hoặc `gifts`
3. Chọn document của sản phẩm
4. Thêm/sửa field:
   - **Field name:** `templateId`
   - **Type:** `number`
   - **Value:** `1` đến `10`
5. Lưu

### **Ví dụ cấu trúc sản phẩm:**
```javascript
{
  name: "Hộp ảnh vintage",
  price: 150000,
  imageUrl: "https://...",
  templateId: 3  // ← Template ID (1-10)
}
```

---

## 📝 Lưu Ý Quan Trọng

### ✅ **Nên làm:**
- Backup file `secure-memory.html` trước khi sửa
- Test kỹ sau mỗi thay đổi
- Giữ format code đúng (dấu ngoặc, dấu phẩy)

### ❌ **Không nên:**
- Xóa hoặc thay đổi tên các key (`name`, `bg`, `primary`, ...)
- Xóa animation đã được định nghĩa ở phía dưới
- Thay đổi cấu trúc object TEMPLATES

---

## 🆘 Troubleshooting

### **Vấn đề: Trang trắng xóa sau khi sửa**
- **Nguyên nhân:** Lỗi syntax JavaScript
- **Giải pháp:** Kiểm tra dấu ngoặc, dấu phẩy, dấu nháy

### **Vấn đề: Màu không đổi**
- **Nguyên nhân:** Chưa copy file sang `dist/`
- **Giải pháp:** Chạy `cp secure-memory.html dist/`

### **Vấn đề: Animation không chạy**
- **Nguyên nhân:** Tên animation sai
- **Giải pháp:** Dùng đúng tên trong danh sách bên trên

---

## 📞 Liên Hệ Support

Nếu cần hỗ trợ thêm, vui lòng liên hệ admin dự án.

---

**Chúc bạn tùy chỉnh thành công! 🎉**
