const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const path = require('path');

// --- CẤU HÌNH FIREBASE ADMIN ---
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

// Sử dụng cors để cho phép frontend gọi tới
app.use(cors());
// Sử dụng middleware để parse JSON body
app.use(express.json());

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, 'dist')));


// --- THÔNG TIN BÍ MẬT - NÊN LƯU TRONG BIẾN MÔI TRƯỜNG (.env) ---
// QUAN TRỌNG: Dán API Key bạn đã lấy từ trang Casso vào đây
const CASSO_API_KEY = 'fa0a7513-f80d-4817-bbf3-51e4cea188c1'; // << THAY BẰNG API KEY CỦA BẠN

// PayOS Configuration
// QUAN TRỌNG: Dán các thông tin từ PayOS vào đây
const PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID || '';
const PAYOS_API_KEY = process.env.PAYOS_API_KEY || '';
const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY || '';

// =================================================================
// API ENDPOINT ĐỂ NHẬN WEBHOOK TỪ CASSO
// =================================================================

app.post('/api/casso-webhook', async (req, res) => {
    console.log("---");
    console.log("Đã nhận được Webhook từ Casso!", new Date().toISOString());
    console.log("Headers:", JSON.stringify(req.headers));
    console.log("Body:", JSON.stringify(req.body));

    // 1. Lấy chữ ký từ header mà Casso gửi đến
    const signature = req.headers['secure-token'];
    
    if (!signature) {
        console.warn("Webhook bị từ chối: Thiếu secure-token.");
        return res.status(401).send('Access Denied: No signature provided.');
    }

    // 2. Xác thực chữ ký bằng cách so sánh với API Key
    if (signature !== CASSO_API_KEY) {
        console.warn(`Webhook bị từ chối: Secure token không hợp lệ! Nhận được: ${signature}`);
        return res.status(401).send('Access Denied: Invalid signature.');
    }

    console.log("Secure token hợp lệ. Bắt đầu xử lý dữ liệu...");
    
    try {
        const webhookData = req.body;

        if (!webhookData || !webhookData.data || webhookData.data.length === 0) {
            console.log("Webhook nhận được nhưng không có dữ liệu giao dịch. Bỏ qua.");
            return res.status(200).send({ error: 0, message: 'Webhook received but no transaction data.' });
        }
            
        for (const transaction of webhookData.data) {
            const fullDescription = transaction.description; // Nội dung chuyển khoản đầy đủ
            const amount = transaction.amount;           // Số tiền

            console.log(`Đang xử lý giao dịch với nội dung đầy đủ: "${fullDescription}" - ${amount}đ`);

            // 3. NÂNG CẤP: Trích xuất mã định danh từ nội dung chuyển khoản
            // Tìm chuỗi có dạng "ID " theo sau là các chữ số (ví dụ: "ID 16812345678")
            const match = fullDescription.match(/ID \d+/);

            if (!match) {
                console.log(`Không tìm thấy mã định danh (VD: "ID 123...") trong nội dung: "${fullDescription}". Bỏ qua giao dịch này.`);
                continue; // Bỏ qua và xử lý giao dịch tiếp theo
            }
            
            const paymentId = match[0]; // Kết quả sẽ là chuỗi "ID xxxxxxx"
            console.log(`Đã trích xuất mã thanh toán: "${paymentId}"`);

            // 4. Tìm đơn hàng trong Firestore bằng mã định danh đã trích xuất
            const memoriesRef = db.collection('memories');
            const q = memoriesRef.where('paymentContent', '==', paymentId).limit(1);
            
            const snapshot = await q.get();

            if (snapshot.empty) {
                console.log(`Không tìm thấy đơn hàng nào với mã thanh toán: "${paymentId}"`);
                continue; // Bỏ qua và xử lý giao dịch tiếp theo
            }

            const doc = snapshot.docs[0];
            const memoryData = doc.data();
            console.log(`Đã tìm thấy đơn hàng ${doc.id} tương ứng.`);

            // 5. Kiểm tra trạng thái và số tiền trước khi cập nhật
            if (memoryData.status === 'pending') {
                 if (amount >= memoryData.price) {
                    await doc.ref.update({ status: 'paid' });
                    console.log(`✅ Thành công! Đã cập nhật đơn hàng ${doc.id} thành 'paid'.`);
                 } else {
                    console.warn(`Bỏ qua cập nhật cho đơn hàng ${doc.id}. Lý do: Số tiền không đủ. Cần ${memoryData.price}, nhận được ${amount}.`);
                 }
            } else {
                console.log(`Bỏ qua cập nhật cho đơn hàng ${doc.id}. Lý do: trạng thái đã là '${memoryData.status}', không phải 'pending'.`);
            }
        }
        
        // 6. Phản hồi lại cho Casso để họ không gửi lại webhook
        res.status(200).send({ error: 0, message: 'Webhook processed' });

    } catch (error) {
        console.error("Lỗi nghiêm trọng khi xử lý webhook Casso:", error);
        res.status(500).send({ error: -1, message: 'Internal Server Error.' });
    }
});

// =================================================================
// API ENDPOINT ĐỂ NHẬN WEBHOOK TỪ PAYOS
// =================================================================

// GET endpoint for PayOS webhook verification
app.get('/api/payos-webhook', (req, res) => {
    console.log("PayOS đang verify webhook URL...");
    res.status(200).json({
        error: 0,
        message: 'Webhook URL is active',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/payos-webhook', async (req, res) => {
    console.log("---");
    console.log("Đã nhận được Webhook từ PayOS!", new Date().toISOString());
    console.log("Headers:", JSON.stringify(req.headers));
    console.log("Body:", JSON.stringify(req.body));

    try {
        const webhookData = req.body;

        // Validate webhook signature (PayOS sử dụng checksum key)
        // LƯU Ý: Tạm thời comment để PayOS có thể test, uncomment sau khi setup xong
        const signature = req.headers['x-payos-signature'];

        // if (!signature && PAYOS_CHECKSUM_KEY) {
        //     console.warn("Webhook bị từ chối: Thiếu signature.");
        //     return res.status(401).json({ error: -1, message: 'Access Denied: No signature provided.' });
        // }

        // PayOS webhook structure:
        // {
        //   "code": "00",
        //   "desc": "success",
        //   "data": {
        //     "orderCode": 123456,
        //     "amount": 10000,
        //     "description": "ID 16812345678",
        //     "accountNumber": "1234567890",
        //     "reference": "FT21234567890",
        //     "transactionDateTime": "2024-01-01 12:00:00",
        //     "currency": "VND",
        //     "paymentLinkId": "abc123",
        //     "code": "00",
        //     "desc": "Thành công",
        //     "counterAccountBankId": "",
        //     "counterAccountBankName": "",
        //     "counterAccountName": "Nguyen Van A",
        //     "counterAccountNumber": "0987654321",
        //     "virtualAccountName": "",
        //     "virtualAccountNumber": ""
        //   },
        //   "signature": "..."
        // }

        if (!webhookData || !webhookData.data) {
            console.log("Webhook nhận được nhưng không có dữ liệu giao dịch. Bỏ qua.");
            return res.status(200).json({ error: 0, message: 'Webhook received but no transaction data.' });
        }

        const transaction = webhookData.data;
        const code = webhookData.code || transaction.code;

        // Kiểm tra giao dịch thành công
        if (code !== '00') {
            console.log(`Giao dịch không thành công. Code: ${code}, Desc: ${webhookData.desc || transaction.desc}`);
            return res.status(200).json({ error: 0, message: 'Transaction not successful.' });
        }

        const description = transaction.description || '';
        const amount = transaction.amount || 0;
        const orderCode = transaction.orderCode;

        console.log(`Đang xử lý giao dịch PayOS - OrderCode: ${orderCode}, Nội dung: "${description}", Số tiền: ${amount}đ`);

        // Trích xuất mã định danh từ description (format: "ID 16812345678")
        const match = description.match(/ID \d+/);

        if (!match) {
            console.log(`Không tìm thấy mã định danh trong description: "${description}". Bỏ qua.`);
            return res.status(200).json({ error: 0, message: 'No payment ID found in description.' });
        }

        const paymentId = match[0];
        console.log(`Đã trích xuất mã thanh toán: "${paymentId}"`);

        // Tìm đơn hàng trong Firestore
        // Tìm trong cả memories và gift_orders
        let orderDoc = null;
        let orderCollection = null;

        // Tìm trong memories trước
        const memoriesRef = db.collection('memories');
        const memoriesQuery = memoriesRef.where('paymentContent', '==', paymentId).limit(1);
        const memoriesSnapshot = await memoriesQuery.get();

        if (!memoriesSnapshot.empty) {
            orderDoc = memoriesSnapshot.docs[0];
            orderCollection = 'memories';
        } else {
            // Nếu không tìm thấy, tìm trong gift_orders
            const giftOrdersRef = db.collection('gift_orders');
            const giftOrdersQuery = giftOrdersRef.where('paymentContent', '==', paymentId).limit(1);
            const giftOrdersSnapshot = await giftOrdersQuery.get();

            if (!giftOrdersSnapshot.empty) {
                orderDoc = giftOrdersSnapshot.docs[0];
                orderCollection = 'gift_orders';
            }
        }

        if (!orderDoc) {
            console.log(`Không tìm thấy đơn hàng nào với mã thanh toán: "${paymentId}"`);
            return res.status(200).json({ error: 0, message: 'Order not found.' });
        }

        const orderData = orderDoc.data();
        console.log(`Đã tìm thấy đơn hàng ${orderDoc.id} trong collection ${orderCollection}.`);

        // Kiểm tra trạng thái và số tiền
        if (orderData.status === 'pending' || orderData.status === 'awaiting_approval') {
            if (amount >= orderData.price) {
                await orderDoc.ref.update({
                    status: 'paid',
                    paidAt: admin.firestore.FieldValue.serverTimestamp(),
                    paymentMethod: 'payos',
                    payosOrderCode: orderCode,
                    payosTransactionRef: transaction.reference || '',
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
                console.log(`✅ Thành công! Đã cập nhật đơn hàng ${orderDoc.id} thành 'paid'.`);
            } else {
                console.warn(`Bỏ qua cập nhật cho đơn hàng ${orderDoc.id}. Số tiền không đủ. Cần ${orderData.price}đ, nhận được ${amount}đ.`);
            }
        } else {
            console.log(`Bỏ qua cập nhật cho đơn hàng ${orderDoc.id}. Trạng thái đã là '${orderData.status}'.`);
        }

        res.status(200).json({ error: 0, message: 'Webhook processed successfully.' });

    } catch (error) {
        console.error("Lỗi nghiêm trọng khi xử lý webhook PayOS:", error);
        res.status(500).json({ error: -1, message: 'Internal Server Error.' });
    }
});

// Route handler for product pages /p/:productId/:slug
app.get('/p/:productId/:slug', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'product.html'));
});

// Serve admin and other pages
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'admin.html'));
});

app.get('/memory-viewer', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'memory-viewer.html'));
});

app.get('/custom-qr', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'custom-qr.html'));
});

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server đang chạy tại port ${PORT}`);
    console.log(`📍 Webhook endpoints:`);
    console.log(`   - PayOS: /api/payos-webhook`);
    console.log(`   - Casso: /api/casso-webhook`);
    console.log(`📄 Product pages: /p/:productId/:slug`);
});
