declare var firebase: any;
declare var QRCode: any;

const firebaseConfig = {
    apiKey: "AIzaSyBMXv_8dYkYf9IvClrIRLK5USdJjD66Qf4",
    authDomain: "gift-aa09e.firebaseapp.com",
    projectId: "gift-aa09e",
    storageBucket: "gift-aa09e.firebasestorage.app",
    messagingSenderId: "905741943305",
    appId: "1:905741943305:web:8cd498eda1e3c5ad792ed8",
    measurementId: "G-KT4MWKFZ8V"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const storage = firebase.storage();

const form = document.getElementById('customQRForm') as HTMLFormElement;
const orderIdInput = document.getElementById('orderId') as HTMLInputElement;
const slugInput = document.getElementById('slug') as HTMLInputElement;
const messageInput = document.getElementById('message') as HTMLTextAreaElement;
const templateIdInput = document.getElementById('templateId') as HTMLSelectElement;
const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
const loadingDiv = document.getElementById('loadingDiv') as HTMLElement;
const qrResult = document.getElementById('qrResult') as HTMLElement;
const qrImage = document.getElementById('qrImage') as HTMLImageElement;
const productUrlDiv = document.getElementById('productUrl') as HTMLElement;
const alertContainer = document.getElementById('alertContainer') as HTMLElement;

let currentQRDataUrl = '';
let currentProductUrl = '';

function showAlert(message: string, type: 'success' | 'error') {
    alertContainer.innerHTML = `
        <div class="alert alert-${type}">
            ${message}
        </div>
    `;
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
}

function showLoading(show: boolean) {
    if (show) {
        form.style.display = 'none';
        loadingDiv.classList.add('show');
        qrResult.classList.remove('show');
    } else {
        loadingDiv.classList.remove('show');
    }
}

function showResult() {
    form.style.display = 'none';
    loadingDiv.classList.remove('show');
    qrResult.classList.add('show');
}

async function generateQRCode(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const container = document.createElement('div');
        container.style.display = 'none';
        document.body.appendChild(container);

        try {
            const qr = new QRCode(container, {
                text: url,
                width: 512,
                height: 512,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            setTimeout(() => {
                const canvas = container.querySelector('canvas');
                if (canvas) {
                    const dataUrl = canvas.toDataURL('image/png');
                    document.body.removeChild(container);
                    resolve(dataUrl);
                } else {
                    document.body.removeChild(container);
                    reject(new Error('QR Code generation failed'));
                }
            }, 100);
        } catch (error) {
            document.body.removeChild(container);
            reject(error);
        }
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const orderId = orderIdInput.value.trim();
    const slug = slugInput.value.trim().toLowerCase();
    const message = messageInput.value.trim();
    const templateId = parseInt(templateIdInput.value);

    if (!orderId || !slug) {
        showAlert('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
        return;
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
        showAlert('Slug chỉ được chứa chữ thường, số và dấu gạch ngang!', 'error');
        return;
    }

    showLoading(true);

    try {
        const memoriesRef = db.collection('memories').doc(orderId);
        const memoriesDoc = await memoriesRef.get();

        let productId = '';
        let productCollection = '';
        let orderData: any = null;

        if (memoriesDoc.exists) {
            orderData = memoriesDoc.data();
            productId = orderData.productId || '';
            productCollection = 'memories_products';
        } else {
            const giftOrdersRef = db.collection('gift_orders').doc(orderId);
            const giftOrdersDoc = await giftOrdersRef.get();

            if (giftOrdersDoc.exists) {
                orderData = giftOrdersDoc.data();
                productId = orderData.productId || '';
                productCollection = 'gifts';
            }
        }

        if (!orderData) {
            showLoading(false);
            showAlert('Không tìm thấy đơn hàng! Vui lòng kiểm tra lại mã đơn hàng.', 'error');
            return;
        }

        if (orderData.status !== 'paid') {
            showLoading(false);
            showAlert('Đơn hàng chưa được thanh toán! Vui lòng thanh toán trước khi tạo QR code.', 'error');
            return;
        }

        if (!productId) {
            showLoading(false);
            showAlert('Đơn hàng không có thông tin sản phẩm!', 'error');
            return;
        }

        const existingSlugQuery = await db.collection(productCollection)
            .where('slug', '==', slug)
            .limit(1)
            .get();

        if (!existingSlugQuery.empty) {
            const existingDoc = existingSlugQuery.docs[0];
            if (existingDoc.id !== productId) {
                showLoading(false);
                showAlert('Slug này đã được sử dụng! Vui lòng chọn slug khác.', 'error');
                return;
            }
        }

        const productRef = db.collection(productCollection).doc(productId);
        const productDoc = await productRef.get();

        if (!productDoc.exists) {
            showLoading(false);
            showAlert('Không tìm thấy sản phẩm!', 'error');
            return;
        }

        const productUrl = `${window.location.origin}/p/${productId}/${slug}`;

        const qrCodeDataUrl = await generateQRCode(productUrl);

        const updateData: any = {
            slug,
            url: productUrl,
            qrUrl: qrCodeDataUrl,
            updatedAt: new Date().toISOString()
        };

        if (message) {
            updateData.description = message;
        }

        if (productCollection === 'memories_products') {
            updateData.templateId = templateId;
        }

        await productRef.update(updateData);

        const orderUpdateData: any = {
            customQRCreated: true,
            slug,
            productUrl,
            updatedAt: new Date().toISOString()
        };

        if (memoriesDoc.exists) {
            await memoriesRef.update(orderUpdateData);
        } else {
            await db.collection('gift_orders').doc(orderId).update(orderUpdateData);
        }

        currentQRDataUrl = qrCodeDataUrl;
        currentProductUrl = productUrl;
        qrImage.src = qrCodeDataUrl;
        productUrlDiv.textContent = productUrl;

        showResult();
        showAlert('QR Code đã được tạo thành công!', 'success');
    } catch (error) {
        console.error('Error creating QR code:', error);
        showLoading(false);
        showAlert('Không thể tạo QR code. Vui lòng thử lại!', 'error');
    }
});

(window as any).downloadQR = function() {
    if (!currentQRDataUrl) return;

    const link = document.createElement('a');
    link.download = `qrcode-${slugInput.value}.png`;
    link.href = currentQRDataUrl;
    link.click();
};

(window as any).resetForm = function() {
    form.reset();
    form.style.display = 'block';
    qrResult.classList.remove('show');
    currentQRDataUrl = '';
    currentProductUrl = '';
};

export {};
