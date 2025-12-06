# Hệ Thống Quản Lý Sản Phẩm với QR Code

Hệ thống hoàn chỉnh cho phép admin tạo sản phẩm với QR code tự động, slug tùy chỉnh và hiệu ứng đa dạng.

## Tính Năng Chính

### 1. Admin Dashboard

#### Thêm Sản Phẩm

Admin có thể:

- ✅ **Nhập thông tin cơ bản**: Tên, giá, mô tả sản phẩm
- ✅ **Chọn loại sản phẩm**: Gift hoặc Memory
- ✅ **Upload hình ảnh**:
  - Tải ảnh trực tiếp lên Firebase Storage
  - Hoặc sử dụng URL từ imgbb.com/imgur.com
- ✅ **Chọn hiệu ứng**:
  - Tỏ Tình (Love)
  - Ngày của Mẹ (Mother's Day)
  - Sinh Nhật (Birthday)
  - Kỷ Niệm (Anniversary)
  - Tốt Nghiệp (Graduation)
  - Cảm Ơn (Thank You)
  - Custom Animation 1 & 2
- ✅ **Slug cá nhân hóa**:
  - Tạo URL đẹp (ví dụ: `/p/productId/ten-nguoi-nhan`)
  - Chỉ dùng chữ thường, số và dấu gạch ngang
  - Tối đa 32 ký tự
  - Preview URL realtime khi nhập
- ✅ **QR Code tự động**: Hệ thống tự động tạo QR code khi lưu sản phẩm

#### Quản Lý Sản Phẩm

Admin có thể xem:

- Danh sách tất cả sản phẩm
- Hình ảnh sản phẩm
- Loại (Gift/Memory)
- Giá tiền
- Hiệu ứng đã chọn
- Slug
- URL (click để xem trước)
- QR Code (click để xem full size)
- Nút Sửa và Xóa

### 2. Quản Lý Đơn Hàng

- ✅ Tab **Đơn kỷ niệm**: Hiển thị orders từ collection `memories`
- ✅ Tab **Đơn quà tặng**: Hiển thị orders từ collection `gift_orders`
- ✅ Chuyển đổi dễ dàng giữa hai loại đơn hàng

### 3. Product Pages (/p/:productId/:slug)

Khi người dùng quét QR code hoặc truy cập URL:

1. Hệ thống tự động:
   - Lấy `productId` và `slug` từ URL
   - Load product từ Firestore
   - Kiểm tra slug khớp với productId
   - Render hiệu ứng tương ứng

2. Hiệu ứng được render theo effect đã chọn:
   - **Love**: Background gradient tím hồng với trái tim bay
   - **Mother's Day**: Background gradient cam nhạt với hoa hồng
   - **Birthday**: Background gradient vàng hồng với confetti
   - **Anniversary**: Background tối sang trọng với viền vàng
   - **Graduation**: Background gradient đa sắc với nón tốt nghiệp
   - **Thank You**: Background gradient xanh với icon cảm ơn
   - **Custom 1**: Background đen với hiệu ứng sao lấp lánh
   - **Custom 2**: Background gradient đỏ với thiết kế nghệ thuật

3. Mỗi trang hiển thị:
   - Icon emoji phù hợp
   - Tên sản phẩm
   - Mô tả (nếu có)
   - Giá tiền (định dạng VNĐ)

## Cấu Trúc Firestore

### Collections

```
gifts/
  {productId}/
    name: string
    price: number
    imageUrl: string
    description: string (optional)
    effect: string (love, mothers_day, birthday, etc.)
    slug: string (unique)
    url: string (https://yourdomain.com/p/{productId}/{slug})
    qrUrl: string (QR code image URL)
    templateId: number
    createdAt: timestamp
    updatedAt: timestamp

memories_products/
  {productId}/
    (same structure as gifts)

memories/
  {orderId}/
    (existing order structure)

gift_orders/
  {orderId}/
    (gift order structure)
```

## Cài Đặt và Chạy

### Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Open browser
# http://localhost:5173 - Homepage
# http://localhost:5173/admin - Admin dashboard
```

### Production

```bash
# Build
npm run build

# Run server
npm start

# Server will run on port 3000
# http://localhost:3000
# http://localhost:3000/admin
# http://localhost:3000/p/{productId}/{slug}
```

## Routing

### Express Server Routes

```javascript
// Static files
app.use(express.static('dist'))

// Product pages
GET /p/:productId/:slug → product.html

// Admin
GET /admin → admin.html

// Memory viewer
GET /memory-viewer → memory-viewer.html

// Home
GET / → index.html

// API
POST /api/casso-webhook → Webhook handler
```

## Quy Trình Sử Dụng

### Bước 1: Admin Tạo Sản Phẩm

1. Đăng nhập vào `/admin`
2. Click "Quản lý sản phẩm"
3. Click "+ Thêm sản phẩm"
4. Điền form:
   - Loại sản phẩm: Gift hoặc Memory
   - Tên sản phẩm
   - Giá
   - Upload/URL hình ảnh
   - Mô tả (optional)
   - Chọn hiệu ứng
   - Nhập slug (ví dụ: `ten-nguoi-nhan`)
   - Preview URL sẽ hiện: `https://yourdomain.com/p/{productId}/ten-nguoi-nhan`
5. Click "Lưu"
6. Hệ thống tự động:
   - Kiểm tra slug unique
   - Upload ảnh lên Storage (nếu upload file)
   - Tạo QR code
   - Lưu vào Firestore
   - Hiển thị thông báo thành công

### Bước 2: Xem và Quản Lý

1. Trong bảng products, admin thấy:
   - Thumbnail ảnh
   - Tên sản phẩm
   - Loại (Gift/Memory)
   - Giá
   - Hiệu ứng
   - Slug
   - URL (click để xem)
   - QR Code (click để tải)

2. Admin có thể:
   - **Sửa**: Update thông tin, đổi slug, đổi hiệu ứng
   - **Xóa**: Xóa sản phẩm (cảnh báo không thể hoàn tác)
   - **Copy URL**: Share link cho khách hàng

### Bước 3: Khách Hàng Truy Cập

1. Khách quét QR code hoặc click URL
2. Trình duyệt mở: `https://yourdomain.com/p/{productId}/{slug}`
3. Server route tới `product.html`
4. `product.tsx` chạy:
   - Parse URL để lấy productId và slug
   - Query Firestore tìm product
   - Kiểm tra slug khớp
   - Load effect tương ứng
   - Render trang với animation

### Bước 4: Người Dùng Mua Hàng (Future Enhancement)

*Tính năng này cần implement thêm*

1. Trên product page, thêm nút "Mua ngay"
2. Click "Mua" → Hiển thị popup:
   - QR code thanh toán
   - Thông tin chuyển khoản
   - Link sản phẩm
   - Input để tùy chỉnh slug (optional)
3. User có thể đổi slug → Call Cloud Function `updateSlug`
4. QR regenerate với slug mới

## Client-Side QR Generation

Hiện tại hệ thống dùng **qrcode.js** client-side để generate QR:

### Ưu điểm:
- Không cần Cloud Functions
- Miễn phí
- Nhanh chóng
- Chạy trực tiếp trong browser

### Nhược điểm:
- QR được lưu dạng Data URL (base64)
- File size lớn hơn so với lưu trên Storage
- Không có URL persistent cho QR

## Nâng Cấp với Cloud Functions (Optional)

Nếu muốn QR code được lưu trên Firebase Storage với URL riêng:

1. Xem hướng dẫn chi tiết trong `CLOUD_FUNCTIONS_GUIDE.md`
2. Deploy các functions:
   - `generateQRCode`
   - `createProduct`
   - `updateSlug`
   - `updateEffect`
3. Update admin.tsx để gọi Cloud Functions thay vì generate client-side

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Public read for products
    match /gifts/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /memories_products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Slug must be unique
    match /{collection}/{productId} {
      allow create: if
        (collection == 'gifts' || collection == 'memories_products') &&
        request.auth != null &&
        !exists(/databases/$(database)/documents/$(collection)/$(request.resource.data.slug));
    }

    // Orders
    match /memories/{orderId} {
      allow read: if request.auth != null;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }
  }
}
```

## Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Products images
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // QR codes (if using Cloud Functions)
    match /qrcodes/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Testing

### Test Product Creation

1. Login to `/admin`
2. Tạo sản phẩm mới với slug: `test-product-123`
3. Kiểm tra:
   - URL hiển thị đúng
   - QR code được tạo
   - Product xuất hiện trong bảng

### Test Product Page

1. Copy URL từ bảng products: `http://localhost:3000/p/{productId}/test-product-123`
2. Mở trong browser mới (hoặc incognito)
3. Kiểm tra:
   - Trang load đúng
   - Hiệu ứng hiển thị đúng
   - Thông tin sản phẩm đầy đủ
   - Responsive trên mobile

### Test Slug Uniqueness

1. Tạo product với slug: `unique-slug`
2. Thử tạo product khác với cùng slug
3. Kỳ vọng: Alert "Slug này đã tồn tại!"

### Test Edit Product

1. Click "Sửa" một sản phẩm
2. Đổi effect từ "love" sang "birthday"
3. Đổi slug thành slug mới
4. Lưu
5. Kiểm tra:
   - URL thay đổi
   - QR code regenerate
   - Effect thay đổi khi truy cập URL

## Troubleshooting

### QR Code không hiển thị

```javascript
// Check console for errors
// Verify qrcode.min.js loaded
console.log(window.QRCode); // Should not be undefined
```

### Product Page 404

```javascript
// Verify routing in server.js
// Check productId and slug match
// Check Firestore data exists
```

### Slug validation failed

```javascript
// Slug must match: /^[a-z0-9-]+$/
// Only lowercase letters, numbers, hyphens
// Max 32 characters
```

### Upload ảnh thất bại

```javascript
// Check Firebase Storage rules
// Verify user authenticated
// Check file size < 5MB
// Check file type is image/*
```

## Environment Variables

```env
# .env (không commit vào git)
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_app.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_app.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Deployment

### Deploy to Production

```bash
# Build
npm run build

# Upload dist/ to hosting
# Configure server to handle /p/:productId/:slug routes

# For Netlify/Vercel: Create _redirects file
/p/:productId/:slug /product.html 200
/admin /admin.html 200
/memory-viewer /memory-viewer.html 200
```

### Deploy Cloud Functions (Optional)

```bash
cd functions
npm install
firebase deploy --only functions
```

## Best Practices

1. **Slug Naming**:
   - Dùng slug có ý nghĩa: `nguyen-van-a` thay vì `abc123`
   - Ngắn gọn, dễ nhớ
   - Avoid special characters

2. **Image Optimization**:
   - Compress images trước khi upload
   - Recommend size: 800x800px
   - Format: JPG/PNG

3. **QR Code**:
   - Test QR code trên nhiều thiết bị
   - Print QR với độ phân giải cao
   - Có backup URL text bên dưới QR

4. **Effect Selection**:
   - Chọn effect phù hợp với dịp
   - Test effect trước khi share link
   - Consider user experience on mobile

5. **Admin Access**:
   - Đổi password admin thường xuyên
   - Giới hạn số admin users
   - Monitor admin activities

## Roadmap

### Phase 2 (Future)

- [ ] Purchase popup với QR thanh toán
- [ ] User có thể tùy chỉnh slug khi mua
- [ ] Integration với payment gateway
- [ ] Email notification khi order paid
- [ ] Analytics dashboard
- [ ] Bulk product import
- [ ] Custom templates builder
- [ ] Multi-language support

### Phase 3 (Advanced)

- [ ] Mobile app
- [ ] Social sharing integration
- [ ] Review and rating system
- [ ] Voucher/discount codes
- [ ] Subscription plans
- [ ] API for third-party integration

## Support

Nếu gặp vấn đề, check:

1. `CLOUD_FUNCTIONS_GUIDE.md` - Chi tiết Cloud Functions
2. `HUONG-DAN-TUY-CHINH.md` - Hướng dẫn tùy chỉnh gốc
3. Console logs trong browser
4. Firebase Console → Firestore/Storage/Functions logs

## Credits

- QR Code: qrcode.js library
- Firebase: Authentication, Firestore, Storage
- Vite: Build tool
- Express: Server routing
