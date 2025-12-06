# Hệ Thống Custom QR Code - Hướng Dẫn Sử Dụng

Hệ thống cho phép khách hàng tự tùy chỉnh QR code sau khi thanh toán.

## Quy Trình Hoàn Chỉnh

### 1. Admin Tạo Sản Phẩm

Admin chỉ cần nhập thông tin cơ bản:

- ✅ **Loại sản phẩm**: Gift hoặc Memory
- ✅ **Tên sản phẩm**: Tên hiển thị
- ✅ **Giá**: Giá sản phẩm (VNĐ)
- ✅ **Hình ảnh**: Upload file hoặc nhập URL
- ✅ **Hiệu ứng**: Chọn 1 trong 8 hiệu ứng có sẵn
  - Tỏ Tình (Love)
  - Ngày của Mẹ (Mother's Day)
  - Sinh Nhật (Birthday)
  - Kỷ Niệm (Anniversary)
  - Tốt Nghiệp (Graduation)
  - Cảm Ơn (Thank You)
  - Custom Animation 1
  - Custom Animation 2

**Không cần**:
- ❌ Mô tả sản phẩm (khách hàng tự thêm)
- ❌ Template ID (khách hàng tự chọn)
- ❌ Slug (khách hàng tự tạo)
- ❌ QR Code (tạo sau khi khách thanh toán)

### 2. Khách Hàng Đặt Hàng

Khách hàng:
1. Xem danh sách sản phẩm trên trang chủ
2. Chọn sản phẩm muốn mua
3. Điền thông tin đặt hàng
4. Nhận mã đơn hàng (orderId)
5. Thực hiện thanh toán

### 3. Sau Khi Thanh Toán

Khi thanh toán thành công:
1. Đơn hàng được cập nhật status = 'paid'
2. Khách hàng nhận link: **https://yourdomain.com/custom-qr**
3. Khách hàng truy cập để tùy chỉnh QR code

### 4. Tùy Chỉnh QR Code (Trang /custom-qr)

Khách hàng nhập:

#### Thông Tin Bắt Buộc:
- **Mã Đơn Hàng**: OrderId nhận được sau khi đặt hàng
- **Slug**: URL cá nhân hóa (ví dụ: `ten-nguoi-nhan`)
  - Chỉ dùng chữ thường, số và dấu gạch ngang (-)
  - Tối đa 32 ký tự
  - Phải unique (không trùng với sản phẩm khác)

#### Thông Tin Tùy Chọn:
- **Lời Nhắn**: Mô tả, lời chúc sẽ hiển thị khi quét QR
- **Template**: Chọn giao diện (chỉ cho Memory products)

### 5. Hệ Thống Xử Lý

Khi khách submit form:

1. **Kiểm tra đơn hàng**:
   - Tìm order trong `memories` hoặc `gift_orders`
   - Verify status = 'paid'
   - Lấy productId từ order

2. **Kiểm tra slug**:
   - Validate format (chỉ a-z, 0-9, -)
   - Check uniqueness trong Firestore

3. **Generate QR Code**:
   - Tạo URL: `https://yourdomain.com/p/{productId}/{slug}`
   - Generate QR code (512x512px, high quality)
   - Lưu dạng Data URL

4. **Cập nhật Firestore**:
   - Update product document:
     ```javascript
     {
       slug: "ten-nguoi-nhan",
       url: "https://yourdomain.com/p/abc123/ten-nguoi-nhan",
       qrUrl: "data:image/png;base64,...",
       description: "Lời nhắn của khách",
       templateId: 3, // nếu là memory
       updatedAt: timestamp
     }
     ```
   - Update order document:
     ```javascript
     {
       customQRCreated: true,
       slug: "ten-nguoi-nhan",
       productUrl: "https://yourdomain.com/p/abc123/ten-nguoi-nhan",
       updatedAt: timestamp
     }
     ```

5. **Hiển thị kết quả**:
   - Show QR code image
   - Show product URL
   - Nút "Tải QR Code" (download PNG)
   - Nút "Tạo QR Mới" (reset form)

### 6. Người Nhận Quét QR

Khi quét QR code:
1. Truy cập: `https://yourdomain.com/p/{productId}/{slug}`
2. Load product từ Firestore
3. Hiển thị hiệu ứng tương ứng với effect đã chọn
4. Hiển thị lời nhắn (description)
5. Hiển thị thông tin sản phẩm

## Firestore Structure

### Products (gifts / memories_products)

```javascript
{
  id: "abc123",
  name: "Hoa hồng đỏ",
  price: 500000,
  imageUrl: "https://...",
  effect: "love",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-02T00:00:00.000Z",

  // Thêm sau khi khách tùy chỉnh QR:
  slug: "ten-nguoi-nhan",
  url: "https://yourdomain.com/p/abc123/ten-nguoi-nhan",
  qrUrl: "data:image/png;base64,...",
  description: "Lời nhắn yêu thương",
  templateId: 3 // chỉ cho memory
}
```

### Orders (memories / gift_orders)

```javascript
{
  id: "order123",
  productId: "abc123",
  customerName: "Nguyễn Văn A",
  customerPhone: "0123456789",
  price: 500000,
  status: "paid",
  createdAt: "2024-01-01T00:00:00.000Z",

  // Thêm sau khi khách tùy chỉnh QR:
  customQRCreated: true,
  slug: "ten-nguoi-nhan",
  productUrl: "https://yourdomain.com/p/abc123/ten-nguoi-nhan",
  updatedAt: "2024-01-02T00:00:00.000Z"
}
```

## Routes

### Admin
- `GET /admin` - Admin dashboard
- Quản lý sản phẩm (CRUD)
- Xem đơn hàng

### Customer
- `GET /` - Trang chủ (danh sách sản phẩm)
- `GET /custom-qr` - Tùy chỉnh QR code (sau khi thanh toán)
- `GET /p/:productId/:slug` - Xem sản phẩm/hiệu ứng

### API
- `POST /api/casso-webhook` - Webhook thanh toán

## Validation Rules

### Slug
- Format: `/^[a-z0-9-]+$/`
- Length: 1-32 characters
- Must be unique per product collection
- Case insensitive (tự động lowercase)

### Order ID
- Phải tồn tại trong `memories` hoặc `gift_orders`
- Status phải là `paid`
- Phải có `productId`

## Security

### Client-Side
- Input validation (format, length)
- XSS prevention (sanitize inputs)

### Server-Side (Firestore Rules)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Products - Public read, authenticated write
    match /{collection}/{productId} {
      allow read: if collection == 'gifts' || collection == 'memories_products';
      allow write: if request.auth != null;

      // Slug must be unique
      allow update: if
        !exists(/databases/$(database)/documents/$(collection)/$(request.resource.data.slug)) ||
        request.resource.data.slug == resource.data.slug;
    }

    // Orders - Restricted
    match /memories/{orderId} {
      allow read: if request.auth != null;
      allow create: if true;
      allow update: if request.resource.data.status == resource.data.status; // Don't allow status change via client
    }
  }
}
```

## Error Handling

### Common Errors

1. **"Không tìm thấy đơn hàng"**
   - OrderId không tồn tại
   - Fix: Kiểm tra lại mã đơn hàng

2. **"Đơn hàng chưa được thanh toán"**
   - Status != 'paid'
   - Fix: Hoàn tất thanh toán trước

3. **"Slug này đã được sử dụng"**
   - Slug trùng với product khác
   - Fix: Chọn slug khác

4. **"Slug chỉ được chứa chữ thường, số và dấu gạch ngang"**
   - Format không hợp lệ
   - Fix: Chỉ dùng a-z, 0-9, -

5. **"Đơn hàng không có thông tin sản phẩm"**
   - Order thiếu productId
   - Fix: Liên hệ admin

## Testing

### Test Flow

1. **Admin tạo product**:
   ```
   POST /admin
   {
     name: "Test Product",
     price: 100000,
     imageUrl: "https://...",
     effect: "love"
   }
   ```

2. **Customer đặt hàng**:
   ```
   POST /api/create-order
   {
     productId: "abc123",
     customerName: "Test User",
     customerPhone: "0123456789"
   }
   ```

3. **Simulate payment**:
   ```javascript
   // Manually update order in Firestore
   await db.collection('memories').doc(orderId).update({
     status: 'paid'
   });
   ```

4. **Customer customize QR**:
   ```
   Visit: http://localhost:3000/custom-qr
   Input: orderId, slug, message
   Submit
   ```

5. **Verify QR**:
   ```
   Visit: http://localhost:3000/p/abc123/test-slug
   Should show effect page with message
   ```

## Deployment

### Production Checklist

- [ ] Build project: `npm run build`
- [ ] Test custom-qr page
- [ ] Verify QR generation works
- [ ] Test all effect pages
- [ ] Check Firestore rules
- [ ] Monitor errors in production
- [ ] Setup email notification for new QR created
- [ ] Add analytics tracking

## Best Practices

### For Admin
1. Chọn effect phù hợp với từng dịp
2. Upload ảnh chất lượng cao
3. Giá rõ ràng, chính xác

### For Customers
1. Chọn slug có ý nghĩa, dễ nhớ
2. Viết lời nhắn chân thành
3. Test QR code trước khi gửi
4. Save/print QR chất lượng cao

### For Developers
1. Monitor QR generation errors
2. Track slug collision rate
3. Optimize image loading
4. Cache QR codes if possible
5. Add rate limiting for QR generation

## Future Enhancements

- [ ] Email QR code to customer
- [ ] SMS notification with link
- [ ] QR code templates (colors, logos)
- [ ] Bulk QR generation for admin
- [ ] QR analytics (scan count, location)
- [ ] Edit QR after creation
- [ ] QR expiry date
- [ ] Password-protected QR
- [ ] Multi-language support

## Support

Nếu gặp vấn đề:
1. Check browser console for errors
2. Verify Firebase connection
3. Check Firestore data structure
4. Test with sample data
5. Review server logs

## Links

- Homepage: `/`
- Admin: `/admin`
- Custom QR: `/custom-qr`
- Product View: `/p/:productId/:slug`
- Memory Viewer: `/memory-viewer`
