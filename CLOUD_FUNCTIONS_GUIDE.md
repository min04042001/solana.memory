# Firebase Cloud Functions Guide

Hướng dẫn viết và deploy Firebase Cloud Functions cho hệ thống quản lý sản phẩm với QR Code.

## Cấu Trúc Project

```
functions/
├── index.js            # Main functions file
├── package.json        # Dependencies
└── .env               # Environment variables (không commit)
```

## Cài Đặt

```bash
npm install -g firebase-tools
firebase login
firebase init functions
cd functions
npm install
```

## Cloud Functions Cần Thiết

### 1. generateQRCode Function

Tạo QR code và upload lên Firebase Storage.

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const QRCode = require('qrcode');

admin.initializeApp();

exports.generateQRCode = functions.https.onCall(async (data, context) => {
    // Kiểm tra authentication
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'Người dùng phải đăng nhập để sử dụng chức năng này.'
        );
    }

    const { url } = data;

    if (!url) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'URL là bắt buộc.'
        );
    }

    try {
        // Generate QR code as data URL
        const qrCodeDataUrl = await QRCode.toDataURL(url, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 1,
            margin: 1,
            width: 512,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        // Convert data URL to buffer
        const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Upload to Firebase Storage
        const bucket = admin.storage().bucket();
        const fileName = `qrcodes/${Date.now()}_${Math.random().toString(36).substring(7)}.png`;
        const file = bucket.file(fileName);

        await file.save(buffer, {
            metadata: {
                contentType: 'image/png',
            },
        });

        // Make file publicly accessible
        await file.makePublic();

        // Get public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        return {
            success: true,
            qrUrl: publicUrl
        };
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new functions.https.HttpsError(
            'internal',
            'Không thể tạo QR code.'
        );
    }
});
```

### 2. createProduct Function

Tạo sản phẩm mới với QR code tự động.

```javascript
exports.createProduct = functions.https.onCall(async (data, context) => {
    // Kiểm tra authentication
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'Người dùng phải đăng nhập.'
        );
    }

    const { name, price, description, effect, slug, imageUrl, collection, templateId } = data;

    // Validate required fields
    if (!name || !price || !effect || !slug) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Thiếu thông tin bắt buộc.'
        );
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Slug chỉ được chứa chữ thường, số và dấu gạch ngang.'
        );
    }

    const db = admin.firestore();

    try {
        // Check if slug already exists
        const existingSlug = await db.collection(collection)
            .where('slug', '==', slug)
            .limit(1)
            .get();

        if (!existingSlug.empty) {
            throw new functions.https.HttpsError(
                'already-exists',
                'Slug này đã tồn tại.'
            );
        }

        // Create product document
        const productRef = db.collection(collection).doc();
        const productId = productRef.id;

        // Generate URL
        const productUrl = `https://yourdomain.com/p/${productId}/${slug}`;

        // Generate QR code
        const qrCodeDataUrl = await QRCode.toDataURL(productUrl, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 1,
            margin: 1,
            width: 512
        });

        // Upload QR to Storage
        const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const bucket = admin.storage().bucket();
        const fileName = `qrcodes/${productId}_${slug}.png`;
        const file = bucket.file(fileName);

        await file.save(buffer, {
            metadata: { contentType: 'image/png' }
        });

        await file.makePublic();
        const qrUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        // Save product
        const productData = {
            name,
            price: parseInt(price),
            description: description || '',
            effect,
            slug,
            imageUrl,
            templateId: templateId || 1,
            url: productUrl,
            qrUrl,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        await productRef.set(productData);

        return {
            success: true,
            productId,
            url: productUrl,
            qrUrl
        };
    } catch (error) {
        console.error('Error creating product:', error);
        throw new functions.https.HttpsError(
            'internal',
            error.message || 'Không thể tạo sản phẩm.'
        );
    }
});
```

### 3. updateSlug Function

Cập nhật slug của sản phẩm và regenerate QR code.

```javascript
exports.updateSlug = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'Người dùng phải đăng nhập.'
        );
    }

    const { productId, newSlug, collection } = data;

    if (!productId || !newSlug || !collection) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Thiếu thông tin bắt buộc.'
        );
    }

    if (!/^[a-z0-9-]+$/.test(newSlug) || newSlug.length > 32) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Slug không hợp lệ.'
        );
    }

    const db = admin.firestore();

    try {
        // Check slug uniqueness
        const existingSlug = await db.collection(collection)
            .where('slug', '==', newSlug)
            .limit(1)
            .get();

        if (!existingSlug.empty) {
            const doc = existingSlug.docs[0];
            if (doc.id !== productId) {
                throw new functions.https.HttpsError(
                    'already-exists',
                    'Slug này đã được sử dụng bởi sản phẩm khác.'
                );
            }
        }

        // Get product
        const productRef = db.collection(collection).doc(productId);
        const productDoc = await productRef.get();

        if (!productDoc.exists) {
            throw new functions.https.HttpsError(
                'not-found',
                'Không tìm thấy sản phẩm.'
            );
        }

        // Generate new URL
        const newUrl = `https://yourdomain.com/p/${productId}/${newSlug}`;

        // Generate new QR code
        const qrCodeDataUrl = await QRCode.toDataURL(newUrl, {
            errorCorrectionLevel: 'H',
            width: 512
        });

        const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const bucket = admin.storage().bucket();
        const fileName = `qrcodes/${productId}_${newSlug}.png`;
        const file = bucket.file(fileName);

        await file.save(buffer, {
            metadata: { contentType: 'image/png' }
        });

        await file.makePublic();
        const newQrUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        // Update product
        await productRef.update({
            slug: newSlug,
            url: newUrl,
            qrUrl: newQrUrl,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return {
            success: true,
            url: newUrl,
            qrUrl: newQrUrl
        };
    } catch (error) {
        console.error('Error updating slug:', error);
        throw new functions.https.HttpsError(
            'internal',
            error.message || 'Không thể cập nhật slug.'
        );
    }
});
```

### 4. updateEffect Function

Cập nhật hiệu ứng của sản phẩm.

```javascript
exports.updateEffect = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'Người dùng phải đăng nhập.'
        );
    }

    const { productId, newEffect, collection } = data;

    if (!productId || !newEffect || !collection) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Thiếu thông tin bắt buộc.'
        );
    }

    const validEffects = [
        'love', 'mothers_day', 'birthday', 'anniversary',
        'graduation', 'thank_you', 'custom_1', 'custom_2'
    ];

    if (!validEffects.includes(newEffect)) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Hiệu ứng không hợp lệ.'
        );
    }

    const db = admin.firestore();

    try {
        const productRef = db.collection(collection).doc(productId);
        const productDoc = await productRef.get();

        if (!productDoc.exists) {
            throw new functions.https.HttpsError(
                'not-found',
                'Không tìm thấy sản phẩm.'
            );
        }

        await productRef.update({
            effect: newEffect,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return {
            success: true,
            message: 'Cập nhật hiệu ứng thành công.'
        };
    } catch (error) {
        console.error('Error updating effect:', error);
        throw new functions.https.HttpsError(
            'internal',
            error.message || 'Không thể cập nhật hiệu ứng.'
        );
    }
});
```

## package.json cho Functions

```json
{
  "name": "functions",
  "description": "Cloud Functions for Solana Memory",
  "scripts": {
    "serve": "firebase emulators:start --only functions",
    "shell": "firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "18"
  },
  "dependencies": {
    "firebase-admin": "^11.8.0",
    "firebase-functions": "^4.3.1",
    "qrcode": "^1.5.3"
  },
  "devDependencies": {
    "firebase-functions-test": "^3.1.0"
  },
  "private": true
}
```

## Deploy

```bash
cd functions
npm install
firebase deploy --only functions
```

## Gọi Functions từ Frontend

```javascript
// Example: Call updateSlug from frontend
const functions = firebase.functions();
const updateSlug = functions.httpsCallable('updateSlug');

try {
    const result = await updateSlug({
        productId: 'abc123',
        newSlug: 'new-slug-name',
        collection: 'gifts'
    });

    console.log(result.data); // { success: true, url: ..., qrUrl: ... }
} catch (error) {
    console.error(error.message);
}
```

## Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Products
    match /{collection}/{productId} {
      allow read: if collection == 'gifts' || collection == 'memories_products';
      allow write: if request.auth != null && request.auth.token.admin == true;

      // Slug must be unique
      allow create: if !exists(/databases/$(database)/documents/$(collection)/$(request.resource.data.slug));
    }

    // Memories (Orders)
    match /memories/{memoryId} {
      allow read: if request.auth != null;
      allow create: if true; // Anyone can create orders
      allow update: if request.auth != null && request.auth.token.admin == true;
    }

    // Settings
    match /settings/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /qrcodes/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Testing

```bash
# Test locally
firebase emulators:start

# Test functions
firebase functions:shell
```

## Monitoring

```bash
# View logs
firebase functions:log

# View specific function logs
firebase functions:log --only updateSlug
```

## Lưu Ý Quan Trọng

1. **Domain Configuration**: Thay `https://yourdomain.com` bằng domain thực tế của bạn
2. **Authentication**: Đảm bảo admin users có custom claim `admin: true`
3. **Storage**: Configure CORS cho Firebase Storage nếu cần
4. **Rate Limiting**: Implement rate limiting cho production
5. **Error Handling**: Log errors properly cho debugging
6. **Environment Variables**: Sử dụng `.env` cho sensitive data
7. **Cost**: Monitor Firebase usage để tránh chi phí bất ngờ

## Troubleshooting

### QR Code không generate

```bash
# Check logs
firebase functions:log --only generateQRCode

# Verify qrcode package installed
cd functions && npm list qrcode
```

### Slug đã tồn tại

- Function tự động check slug uniqueness
- User sẽ nhận error message rõ ràng

### Authentication Issues

- Verify user logged in before calling functions
- Check Firebase Auth configuration
- Verify admin custom claims set correctly

## Production Checklist

- [ ] Deploy all functions
- [ ] Test each function endpoint
- [ ] Configure Firestore rules
- [ ] Configure Storage rules
- [ ] Setup monitoring và alerts
- [ ] Document API endpoints
- [ ] Test error scenarios
- [ ] Configure domain properly
- [ ] Enable billing alerts
- [ ] Backup Firestore regularly
