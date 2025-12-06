declare var firebase: any;
declare var QRCode: any;

import { createOrder, subscribeToOrderStatus, startPollingOrderStatus, updateOrderWithPayOSCode, type Order } from './supabase-client';

const firebaseConfig = {
    apiKey: "AIzaSyBMXv_8dYkYf9IvClrIRLK5USdJjD66Qf4",
    authDomain: "gift-aa09e.firebaseapp.com",
    projectId: "gift-aa09e",
    storageBucket: "gift-aa09e.firebasestorage.app",
    messagingSenderId: "905741943305",
    appId: "1:905741943305:web:8cd498eda1e3c5ad792ed8",
    measurementId: "G-KT4MWKFZ8V"
};

if (!firebase.apps || !firebase.apps.length) {
    try {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase initialized successfully");
    } catch (error) {
        console.error("Firebase initialization error:", error);
    }
} else {
    console.log("Firebase already initialized");
}
const db = firebase.firestore();

// --- GLOBAL THEME PALETTES ---
const globalThemePalettes: { [key: string]: { [key: string]: string } } = {
    spring: {
        '--primary-color': '#9E7FFF', // Purple
        '--secondary-color': '#38bdf8', // Light Blue
        '--accent-color': '#f472b6', // Pink
        '--background-color': '#171717', // Dark Grey
        '--surface-color': '#262626', // Slightly Lighter Dark Grey
        '--text-color': '#FFFFFF', // White
        '--text-secondary-color': '#A3A3A3', // Light Grey
        '--border-color': '#2F2F2F', // Darker Grey
        '--success-color': '#10b981', // Green
        '--warning-color': '#f59e0b', // Orange
        '--error-color': '#ef4444', // Red
        '--hero-bg-image': 'url("https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
        '--hero-gradient': 'radial-gradient(circle at center, rgba(23, 23, 23, 0.05) 0%, rgba(23, 23, 23, 0.5) 70%)',
        '--hero-scroll-btn-bg': 'linear-gradient(45deg, #ffb6c1, #ffecb3)',
        '--hero-scroll-btn-hover-bg': 'linear-gradient(45deg, #ffecb3, #ffb6c1)',
        '--hero-scroll-btn-hover-shadow': '0 12px 30px rgba(0, 0, 0, 0.3), 0 0 25px rgba(255, 182, 193, 0.7)',
        '--tab-active-bg': 'linear-gradient(45deg, var(--primary-color), var(--accent-color))',
        '--product-card-hover-shadow': '0 20px 45px rgba(0, 0, 0, 0.4), 0 0 25px rgba(244, 114, 182, 0.7)',
        '--success-message-bg-color': 'rgba(158, 127, 255, 0.12)',
        '--success-message-border-color': 'var(--accent-color)',
        '--success-message-heart-fill': '#f472b6',
    },
    summer: {
        '--primary-color': '#FFD700', // Gold
        '--secondary-color': '#FFA500', // Orange
        '--accent-color': '#FF6347', // Tomato
        '--background-color': '#1A1A1A',
        '--surface-color': '#2C2C2C',
        '--text-color': '#FFFFFF',
        '--text-secondary-color': '#B0B0B0',
        '--border-color': '#3A3A3A',
        '--success-color': '#32CD32', // Lime Green
        '--warning-color': '#FFD700',
        '--error-color': '#FF4500', // Orange Red
        '--hero-bg-image': 'url("https://images.pexels.com/photos/1078981/pexels-photo-1078981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")', // Summer image
        '--hero-gradient': 'radial-gradient(circle at center, rgba(26, 26, 26, 0.05) 0%, rgba(26, 26, 26, 0.5) 70%)',
        '--hero-scroll-btn-bg': 'linear-gradient(45deg, #FFD700, #FFA500)',
        '--hero-scroll-btn-hover-bg': 'linear-gradient(45deg, #FFA500, #FFD700)',
        '--hero-scroll-btn-hover-shadow': '0 12px 30px rgba(0, 0, 0, 0.3), 0 0 25px rgba(255, 215, 0, 0.7)',
        '--tab-active-bg': 'linear-gradient(45deg, var(--primary-color), var(--accent-color))',
        '--product-card-hover-shadow': '0 20px 45px rgba(0, 0, 0, 0.4), 0 0 25px rgba(255, 99, 71, 0.7)',
        '--success-message-bg-color': 'rgba(255, 215, 0, 0.12)',
        '--success-message-border-color': 'var(--accent-color)',
        '--success-message-heart-fill': '#FF6347',
    },
    autumn: {
        '--primary-color': '#D2691E', // Chocolate
        '--secondary-color': '#CD853F', // Peru
        '--accent-color': '#B8860B', // Dark Goldenrod
        '--background-color': '#1C1C1C',
        '--surface-color': '#333333',
        '--text-color': '#F5F5DC', // Beige
        '--text-secondary-color': '#D3D3D3',
        '--border-color': '#444444',
        '--success-color': '#6B8E23', // Olive Drab
        '--warning-color': '#DAA520', // Goldenrod
        '--error-color': '#DC143C', // Crimson
        '--hero-bg-image': 'url("https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")', // Autumn image
        '--hero-gradient': 'radial-gradient(circle at center, rgba(28, 28, 28, 0.05) 0%, rgba(28, 28, 28, 0.5) 70%)',
        '--hero-scroll-btn-bg': 'linear-gradient(45deg, #CD853F, #B8860B)',
        '--hero-scroll-btn-hover-bg': 'linear-gradient(45deg, #B8860B, #CD853F)',
        '--hero-scroll-btn-hover-shadow': '0 12px 30px rgba(0, 0, 0, 0.3), 0 0 25px rgba(205, 133, 63, 0.7)',
        '--tab-active-bg': 'linear-gradient(45deg, var(--primary-color), var(--accent-color))',
        '--product-card-hover-shadow': '0 20px 45px rgba(0, 0, 0, 0.4), 0 0 25px rgba(184, 134, 11, 0.7)',
        '--success-message-bg-color': 'rgba(210, 105, 30, 0.12)',
        '--success-message-border-color': 'var(--accent-color)',
        '--success-message-heart-fill': '#B8860B',
    },
    winter: {
        '--primary-color': '#ADD8E6', // Light Blue
        '--secondary-color': '#87CEEB', // Sky Blue
        '--accent-color': '#B0E0E6', // Powder Blue
        '--background-color': '#1F1F1F',
        '--surface-color': '#363636',
        '--text-color': '#E0FFFF', // Light Cyan
        '--text-secondary-color': '#C0C0C0',
        '--border-color': '#4A4A4A',
        '--success-color': '#4682B4', // Steel Blue
        '--warning-color': '#6A5ACD', // Slate Blue
        '--error-color': '#FF6347', // Tomato
        '--hero-bg-image': 'url("https://images.pexels.com/photos/1570610/pexels-photo-1570610.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")', // Winter image
        '--hero-gradient': 'radial-gradient(circle at center, rgba(31, 31, 31, 0.05) 0%, rgba(31, 31, 31, 0.5) 70%)',
        '--hero-scroll-btn-bg': 'linear-gradient(45deg, #87CEEB, #B0E0E6)',
        '--hero-scroll-btn-hover-bg': 'linear-gradient(45deg, #B0E0E6, #87CEEB)',
        '--hero-scroll-btn-hover-shadow': '0 12px 30px rgba(0, 0, 0, 0.3), 0 0 25px rgba(135, 206, 235, 0.7)',
        '--tab-active-bg': 'linear-gradient(45deg, var(--primary-color), var(--accent-color))',
        '--product-card-hover-shadow': '0 20px 45px rgba(0, 0, 0, 0.4), 0 0 25px rgba(176, 224, 230, 0.7)',
        '--success-message-bg-color': 'rgba(173, 216, 230, 0.12)',
        '--success-message-border-color': 'var(--accent-color)',
        '--success-message-heart-fill': '#B0E0E6',
    }
};

// Copy to clipboard function
function copyToClipboard(text: string, button: HTMLButtonElement) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = '✓ Đã sao chép';
        button.classList.add('copied');

        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Không thể sao chép. Vui lòng thử lại.');
    });
}

// Make copyToClipboard available globally
(window as any).copyToClipboard = copyToClipboard;

/**
 * Applies the selected theme by updating CSS custom properties.
 * @param themeName The name of the theme to apply (e.g., 'spring', 'summer').
 */
function applyTheme(themeName: string) {
    const palette = globalThemePalettes[themeName] || globalThemePalettes.spring; // Default to spring
    for (const [key, value] of Object.entries(palette)) {
        document.documentElement.style.setProperty(key, value);
    }

    // Update the success message SVG heart fill color dynamically
    const successMessage = document.querySelector('.success-message') as HTMLElement;
    if (successMessage) {
        const heartFillColor = encodeURIComponent(palette['--success-message-heart-fill'].replace('#', '%23'));
        successMessage.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 15 C55 5 65 5 70 15 C80 35 70 50 50 70 C30 50 20 35 30 15 C35 5 45 5 50 15 Z" fill="${heartFillColor}" opacity="0.05"/></svg>')`;
    }
}

const qrThemePresets: any = {
    classic: { colorDark: globalThemePalettes.spring['--primary-color'], colorLight: globalThemePalettes.spring['--surface-color'] },
    modern: { colorDark: '#FFFFFF', colorLight: globalThemePalettes.spring['--background-color'] },
    romantic: { colorDark: globalThemePalettes.spring['--accent-color'], colorLight: '#FFF0F5' }
};


// --- STATE MANAGEMENT ---
let currentTab = 'gift'; // 'gift' hoặc 'memory'
let selectedProduct: any = null; // Lưu thông tin sản phẩm đang được chọn
let temporaryMemoryData: any = null; // Lưu tạm dữ liệu form kỷ niệm chờ thanh toán
let selectedFiles: File[] = []; // Mảng để quản lý các tệp đã chọn

// --- DOM ELEMENTS (Declared as let, assigned in DOMContentLoaded) ---
let tabsContainer: HTMLElement | null = null;
let productGrid: HTMLElement | null = null;

// Gift Form
let giftOrderSection: HTMLElement | null = null;
let giftOrderForm: HTMLFormElement | null = null;
let giftOrderProductName: HTMLElement | null = null;
let cancelGiftOrderBtn: HTMLButtonElement | null = null;
let giftOrderSuccessMessage: HTMLElement | null = null;

// Memory Form
let memorySection: HTMLElement | null = null;
let memoryForm: HTMLFormElement | null = null;
let memoryProductName: HTMLElement | null = null;
let imageUploadInput: HTMLInputElement | null = null;
let fileNameDisplay: HTMLElement | null = null;
let imagePreviewContainer: HTMLElement | null = null;
let cancelMemoryBtn: HTMLButtonElement | null = null;

// Payment Modal
let paymentModal: HTMLElement | null = null;
let vietQrImage: HTMLImageElement | null = null;
let paymentProductName: HTMLElement | null = null;
let paymentAmount: HTMLElement | null = null;
let paymentContent: HTMLElement | null = null;
let confirmPaidBtn: HTMLButtonElement | null = null;
let cancelPaymentBtn: HTMLButtonElement | null = null;

// Waiting Approval Modal
let waitingApprovalModal: HTMLElement | null = null;

// QR Customization Modal
let qrCustomModal: HTMLElement | null = null;
let qrPreview: HTMLElement | null = null;
let applyQrCustomBtn: HTMLButtonElement | null = null;

// Payment Rejected Modal
let paymentRejectedModal: HTMLElement | null = null;
let closeRejectedBtn: HTMLButtonElement | null = null;

// Final QR Modal
let finalQrModal: HTMLElement | null = null;
let finalQrCodeDiv: HTMLElement | null = null;
let saveQrBtn: HTMLButtonElement | null = null;
let closeFinalQrBtn: HTMLButtonElement | null = null;

let currentMemoryId: string | null = null;
let currentCustomUrl: string | null = null;
let currentAdminQrConfig: any = null;

// Image Viewer Modal
let imageViewerModal: HTMLElement | null = null;
let viewerImage: HTMLImageElement | null = null;
let closeViewerBtn: HTMLButtonElement | null = null;

// Hero Scroll Button
let heroScrollBtn: HTMLButtonElement | null = null;


// --- FUNCTIONS ---

/**
 * Hiển thị hoặc ẩn một modal
 * @param modal - Element của modal
 * @param show - true để hiển thị, false để ẩn
 */
function toggleModal(modal: HTMLElement, show: boolean) {
    if (show) {
        modal.classList.add('visible');
    } else {
        modal.classList.remove('visible');
    }
}

/**
 * Hiển thị một section (form) và cuộn tới nó
 * @param section - Element của section
 */
function showOrderSection(section: HTMLElement) {
    giftOrderSection?.classList.remove('visible');
    memorySection?.classList.remove('visible');
    section.classList.add('visible');
    section.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Ẩn tất cả các section đặt hàng
 */
function hideAllOrderSections() {
    giftOrderSection?.classList.remove('visible');
    memorySection?.classList.remove('visible');
}

/**
 * Tải và hiển thị sản phẩm từ Firestore dựa trên danh mục
 * @param category - Tên collection trong Firestore ('gifts' hoặc 'memories_products')
 */
async function fetchAndRenderProducts(category: string) {
    if (!productGrid) return;
    productGrid.innerHTML = `<p class="loading-text">Đang tải sản phẩm...</p>`;
    try {
        const snapshot = await db.collection(category).get();
        if (snapshot.empty) {
            productGrid.innerHTML = `<p class="loading-text">Chưa có sản phẩm nào trong mục này.</p>`;
            return;
        }

        let productsHtml = '';
        snapshot.forEach((doc: any) => {
            const product = doc.data();
            const rotation = Math.random() * 5 - 2.5;
            productsHtml += `
                <div class="product-card" style="--rotation: ${rotation}deg" data-id="${doc.id}" data-name="${product.name}" data-price="${product.price}" data-template-id="${product.templateId || 1}">
                    <div class="product-image-container">
                        <img src="${product.imageUrl}" alt="${product.name}" class="product-image" loading="lazy">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-price">${product.price.toLocaleString('vi-VN')}đ</p>
                    </div>
                    <button class="order-btn" aria-label="Đặt hàng ${product.name}">💖</button>
                </div>
            `;
        });
        productGrid.innerHTML = productsHtml;

    } catch (error) {
        console.error("Lỗi khi tải sản phẩm: ", error);
        productGrid.innerHTML = `<p class="loading-text error">Không thể tải sản phẩm. Vui lòng thử lại sau.</p>`;
    }
}

/**
 * Xử lý khi người dùng nhấn vào một sản phẩm
 * @param event - Sự kiện click
 */
function handleProductClick(event: Event) {
    const card = (event.target as HTMLElement).closest('.product-card') as HTMLElement;
    if (!card) return;

    selectedProduct = { ...card.dataset }; // Sao chép dữ liệu từ data attributes

    if (currentTab === 'gift') { // Tab "Kỷ Niệm" sẽ hiển thị form tạo kỷ niệm
        if (memoryProductName) memoryProductName.textContent = selectedProduct.name;
        if (memorySection) showOrderSection(memorySection);
    } else { // currentTab === 'memory', tab "Quà Tặng" sẽ hiển thị form đặt quà
        if (giftOrderProductName) giftOrderProductName.textContent = selectedProduct.name;
        if (giftOrderSection) showOrderSection(giftOrderSection);
    }
}

/**
 * Xử lý khi người dùng nhấn vào một tab
 * @param event - Sự kiện click
 */
function handleTabClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('tab-btn')) return;

    // Cập nhật trạng thái active cho tab
    tabsContainer?.querySelector('.active')?.classList.remove('active');
    target.classList.add('active');

    currentTab = target.dataset.tab as string;
    
    // Đổi tên collection tương ứng với tab
    const category = currentTab === 'gift' ? 'gifts' : 'memories_products';
    fetchAndRenderProducts(category);
    hideAllOrderSections();
}

/**
 * Xử lý submit form quà tặng
 */
async function handleGiftFormSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const order = {
        productName: selectedProduct.name,
        productPrice: selectedProduct.price,
        customerName: formData.get('customerName'),
        customerPhone: formData.get('customerPhone'),
        customerAddress: formData.get('customerAddress'),
        status: 'pending',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        await db.collection('orders').add(order);
        if (form) form.style.display = 'none';
        if (giftOrderSuccessMessage) giftOrderSuccessMessage.style.display = 'block';
        setTimeout(() => {
            hideAllOrderSections();
            if (form) form.reset();
            if (form) form.style.display = 'block';
            if (giftOrderSuccessMessage) giftOrderSuccessMessage.style.display = 'none';
        }, 5000);
    } catch (error) {
        console.error("Lỗi khi đặt hàng: ", error);
        alert("Đã có lỗi xảy ra, vui lòng thử lại.");
    }
}

/**
 * Xử lý submit form kỷ niệm (bắt đầu quy trình thanh toán)
 */
async function handleMemoryFormSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // --- Thông tin tài khoản PayOS ---
    const amount = parseInt(selectedProduct.price, 10);
    const paymentId = `ID ${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Lưu tạm dữ liệu để tạo đơn hàng
    temporaryMemoryData = {
        productName: selectedProduct.name,
        price: amount,
        recipientName: formData.get('recipientName'),
        message: formData.get('message'),
        imageFileNames: selectedFiles.length > 0 ? selectedFiles.map(f => f.name) : ['Không có ảnh'],
        paymentContent: paymentId,
        templateId: selectedProduct.templateId || 1,
    };

    try {
        // Tạo order trong Supabase
        const order = await createOrder({
            type: 'memory',
            payment_content: paymentId,
            price: amount,
            customer_name: formData.get('recipientName') as string,
            product_name: selectedProduct.name,
            memory_content: {
                message: formData.get('message'),
                imageFileNames: selectedFiles.length > 0 ? selectedFiles.map(f => f.name) : [],
                templateId: selectedProduct.templateId || 1,
            },
        });

        console.log('Order created:', order);

        // Tạo PayOS payment link (ngầm - để nhận webhook)
        const orderCode = Date.now();
        console.log('Creating silent PayOS payment for webhook...');

        try {
            const payosResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({
                    orderCode: orderCode.toString(),
                    amount: amount,
                    description: paymentId,
                    returnUrl: `${window.location.origin}/custom-qr.html`,
                    cancelUrl: `${window.location.origin}/index.html`,
                }),
            });

            const payosData = await payosResponse.json();
            console.log('PayOS payment created:', payosData);

            if (payosData.success) {
                await updateOrderWithPayOSCode(order.id, orderCode.toString());
                console.log('✅ PayOS order code saved to database');
            }
        } catch (err) {
            console.warn('PayOS payment creation failed (non-critical):', err);
        }

        // VietQR setup
        const bankBin = '970422';
        const accountNumber = '9666989889';
        const accountName = 'DO VAN DOAN';
        const vietQrApiUrl = `https://api.vietqr.io/image/${bankBin}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${paymentId}&accountName=${accountName}`;

        // Hiển thị modal thanh toán
        if (paymentAmount) paymentAmount.textContent = `${amount.toLocaleString('vi-VN')} vnđ`;
        if (paymentContent) paymentContent.textContent = paymentId;
        if (vietQrImage) vietQrImage.src = vietQrApiUrl;

        // Populate paymentAmountNote
        const paymentAmountNote = document.getElementById('paymentAmountNote');
        if (paymentAmountNote) paymentAmountNote.textContent = `${amount.toLocaleString('vi-VN')} vnđ`;

        // Setup copy buttons
        const copyAmountBtn = document.getElementById('copyAmountBtn') as HTMLButtonElement;
        const copyContentBtn = document.getElementById('copyContentBtn') as HTMLButtonElement;

        if (copyAmountBtn) {
            copyAmountBtn.onclick = () => copyToClipboard(amount.toString(), copyAmountBtn);
        }

        if (copyContentBtn) {
            copyContentBtn.onclick = () => copyToClipboard(paymentId, copyContentBtn);
        }

        if (paymentModal) toggleModal(paymentModal, true);

        // Shared callback for both realtime and polling
        let isRedirecting = false;
        const handlePaymentConfirmed = (updatedOrder: Order) => {
            if (isRedirecting) {
                console.log('⏭️ Already redirecting, skipping duplicate...');
                return;
            }

            if (updatedOrder.status === 'paid') {
                console.log('✅ Payment confirmed! Preparing redirect...');
                isRedirecting = true;

                // Cleanup
                if (channel) channel.unsubscribe();
                if (stopPolling) stopPolling();

                // Redirect to custom-qr.html with order data
                const params = new URLSearchParams({
                    orderId: updatedOrder.id,
                    productName: updatedOrder.product_name,
                    message: updatedOrder.memory_content?.message || '',
                    templateId: updatedOrder.memory_content?.templateId || '1',
                });

                console.log('🚀 Redirecting to custom QR page...');
                setTimeout(() => {
                    window.location.href = `/custom-qr.html?${params.toString()}`;
                }, 500);
            }
        };

        // Method 1: Realtime subscription (fast but may miss updates)
        console.log('🔌 Setting up realtime subscription...');
        const channel = subscribeToOrderStatus(paymentId, handlePaymentConfirmed);

        // Method 2: Polling (reliable fallback, checks every 3 seconds)
        console.log('🔄 Starting automatic polling...');
        const stopPolling = startPollingOrderStatus(paymentId, handlePaymentConfirmed, 3000);

        // Cleanup on cancel
        const cancelBtn = document.getElementById('cancelPaymentBtn');
        if (cancelBtn) {
            cancelBtn.onclick = () => {
                console.log('🛑 Payment cancelled by user');
                if (channel) channel.unsubscribe();
                if (stopPolling) stopPolling();
                if (paymentModal) toggleModal(paymentModal, false);
            };
        }

    } catch (error) {
        console.error('Error creating order:', error);
        alert('Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
    }
}

/**
 * DEPRECATED: Không còn cần nút "Tôi đã thanh toán" nữa
 * Hệ thống tự động phát hiện thanh toán qua PayOS webhook
 */
// async function handleCustomerConfirmPaid() { ... }

function showQrCustomization() {
    if (waitingApprovalModal) toggleModal(waitingApprovalModal, false);
    if (qrCustomModal) toggleModal(qrCustomModal, true);

    const qrCustomMessage = document.getElementById('qrCustomMessage') as HTMLInputElement;
    if (qrCustomMessage) qrCustomMessage.value = '';

    const classicPreset = document.querySelector('input[name="qrThemePreset"][value="classic"]') as HTMLInputElement;
    if (classicPreset) {
        classicPreset.checked = true;
        const event = new Event('change');
        classicPreset.dispatchEvent(event);
    }

    updateQrPreview();
}

function updateQrPreview() {
    const themePresetRadio = document.querySelector('input[name="qrThemePreset"]:checked') as HTMLInputElement;
    const themeStyle = themePresetRadio ? themePresetRadio.value : 'classic';
    const selectedPreset = qrThemePresets[themeStyle] || qrThemePresets.classic;
    const customMessage = (document.getElementById('qrCustomMessage') as HTMLInputElement)?.value;
    const customDomain = (document.getElementById('qrCustomDomain') as HTMLInputElement)?.value.trim();

    const baseDomain = customDomain || window.location.origin;
    const qrUrl = currentCustomUrl || `${baseDomain}/memory-viewer.html?id=${currentMemoryId}`;

    if (!qrPreview) return;
    qrPreview.innerHTML = '';
    const previewQr = new QRCode(qrPreview, {
        text: qrUrl,
        width: 200,
        height: 200,
        colorDark: selectedPreset.colorDark,
        colorLight: selectedPreset.colorLight,
        correctLevel: QRCode.CorrectLevel.H
    });

    const messagePreview = document.getElementById('qrMessagePreview') as HTMLElement;
    if (messagePreview) messagePreview.textContent = customMessage || '';
}

function applyFrameShape(shape: string, colorDark: string, colorLight: string) {
    if (!qrPreview) return;
    const qrCanvas = qrPreview.querySelector('canvas');
    if (!qrCanvas) return;

    qrCanvas.style.borderRadius = '0'; // Reset
    qrCanvas.style.padding = '0'; // Reset
    qrCanvas.style.border = 'none'; // Reset
    qrCanvas.style.boxShadow = 'none'; // Reset

    const frameColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(); // Use primary color from CSS

    switch(shape) {
        case 'circle':
            qrCanvas.style.borderRadius = '50%';
            qrCanvas.style.padding = '10px';
            qrCanvas.style.border = `4px solid ${frameColor}`;
            break;
        case 'heart':
            qrCanvas.style.borderRadius = '10px';
            qrCanvas.style.padding = '15px';
            qrCanvas.style.border = `4px solid ${getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim()}`;
            qrCanvas.style.boxShadow = `0 0 20px ${getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim()}80`; // 80 for opacity
            break;
        case 'rounded':
            qrCanvas.style.borderRadius = '20px';
            qrCanvas.style.padding = '10px';
            qrCanvas.style.border = `3px solid ${frameColor}`;
            break;
        default: // square
            qrCanvas.style.borderRadius = '8px'; // Default rounded corners for square
            qrCanvas.style.padding = '10px';
            qrCanvas.style.border = `3px solid ${frameColor}`;
    }
}

async function applyCustomQr() {
    if (!currentMemoryId) return;

    const themePresetRadio = document.querySelector('input[name="qrThemePreset"]:checked') as HTMLInputElement;
    const themeStyle = themePresetRadio ? themePresetRadio.value : 'classic';
    const customMessage = (document.getElementById('qrCustomMessage') as HTMLInputElement)?.value;
    const customDomain = (document.getElementById('qrCustomDomain') as HTMLInputElement)?.value.trim();

    const selectedPreset = qrThemePresets[themeStyle] || qrThemePresets.classic;

    const finalQrConfig = {
        colorDark: selectedPreset.colorDark,
        colorLight: selectedPreset.colorLight,
        size: 250,
        correctLevel: "H",
        themeStyle: themeStyle,
        customMessage: customMessage,
        customDomain: customDomain
    };

    processPaidOrder(currentMemoryId, currentCustomUrl, finalQrConfig);
}

/**
 * Xử lý sau khi đơn hàng đã được xác nhận thanh toán
 * @param memoryId - ID của document kỷ niệm trong Firestore
 * @param customQrUrl - URL tùy chỉnh từ admin (nếu có)
 * @param qrCustomization - Cấu hình tùy chỉnh QR từ người dùng
 */
async function processPaidOrder(memoryId: string, customQrUrl?: string, qrCustomization?: any) {
    if (qrCustomModal) toggleModal(qrCustomModal, false);

    try {
        const memoryDoc = await db.collection('memories').doc(memoryId).get();
        const memoryData = memoryDoc.data();
        const accessToken = memoryData?.accessToken || '';
        const templateId = memoryData?.templateId || 1;

        const baseDomain = qrCustomization?.customDomain || window.location.origin;
        const qrUrl = customQrUrl || `${baseDomain}/secure-memory.html?id=${memoryId}&t=${accessToken}&tid=${templateId}`;

        const qrConfig = qrCustomization || {
            colorDark: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
            colorLight: getComputedStyle(document.documentElement).getPropertyValue('--surface-color').trim(),
            size: 250,
            correctLevel: "H",
            style: "square",
            frameShape: "square"
        };

        const correctLevelMap: any = {
            'L': QRCode.CorrectLevel.L,
            'M': QRCode.CorrectLevel.M,
            'Q': QRCode.CorrectLevel.Q,
            'H': QRCode.CorrectLevel.H
        };

        if (!finalQrCodeDiv) return;
        finalQrCodeDiv.innerHTML = '';

        const qrCodeOptions: any = {
            text: qrUrl,
            width: qrConfig.size || 250,
            height: qrConfig.size || 250,
            colorDark: qrConfig.colorDark || getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
            colorLight: qrConfig.colorLight || getComputedStyle(document.documentElement).getPropertyValue('--surface-color').trim(),
            correctLevel: correctLevelMap[qrConfig.correctLevel] || QRCode.CorrectLevel.H
        };

        const qrCode = new QRCode(finalQrCodeDiv, qrCodeOptions);

        if (qrConfig.style === 'dots' || qrConfig.style === 'rounded') {
            setTimeout(() => {
                if (finalQrCodeDiv) applyQrStyle(finalQrCodeDiv, qrConfig.style);
                applyFinalFrameShape(qrConfig.frameShape, qrConfig.colorDark, qrConfig.colorLight);
            }, 100);
        } else {
            setTimeout(() => {
                applyFinalFrameShape(qrConfig.frameShape, qrConfig.colorDark, qrConfig.colorLight);
            }, 100);
        }

        if (qrConfig.customMessage) {
            const messageEl = document.createElement('p');
            messageEl.textContent = qrConfig.customMessage;
            messageEl.style.marginTop = '1rem';
            messageEl.style.fontSize = '0.95rem';
            messageEl.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary-color').trim();
            messageEl.style.fontStyle = 'italic';
            messageEl.style.wordWrap = 'break-word';
            messageEl.style.maxWidth = '250px';
            messageEl.style.marginLeft = 'auto';
            messageEl.style.marginRight = 'auto';
            finalQrCodeDiv.appendChild(messageEl);
        }

        if (finalQrModal) toggleModal(finalQrModal, true);

        if (memoryForm) memoryForm.reset();
        if (imagePreviewContainer) imagePreviewContainer.innerHTML = '';
        selectedFiles = [];
        if (fileNameDisplay) fileNameDisplay.textContent = 'Chưa có ảnh nào được chọn';
        hideAllOrderSections();

        if (confirmPaidBtn) {
            confirmPaidBtn.disabled = false;
            confirmPaidBtn.textContent = 'Tôi đã thanh toán';
        }

    } catch (error) {
        console.error("Lỗi khi tạo QR: ", error);
        alert("Đã có lỗi xảy ra.");
    } finally {
        temporaryMemoryData = null;
    }
}

function applyFinalFrameShape(shape: string, colorDark: string, colorLight: string) {
    if (!finalQrCodeDiv) return;
    const qrCanvas = finalQrCodeDiv.querySelector('canvas');
    if (!qrCanvas) return;

    qrCanvas.style.borderRadius = '0'; // Reset
    qrCanvas.style.padding = '0'; // Reset
    qrCanvas.style.border = 'none'; // Reset
    qrCanvas.style.boxShadow = 'none'; // Reset

    const frameColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(); // Use primary color from CSS

    switch(shape) {
        case 'circle':
            qrCanvas.style.borderRadius = '50%';
            qrCanvas.style.padding = '10px';
            qrCanvas.style.border = `4px solid ${frameColor}`;
            break;
        case 'heart':
            qrCanvas.style.borderRadius = '10px';
            qrCanvas.style.padding = '15px';
            qrCanvas.style.border = `4px solid ${getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim()}`;
            qrCanvas.style.boxShadow = `0 0 20px ${getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim()}80`;
            break;
        case 'rounded':
            qrCanvas.style.borderRadius = '20px';
            qrCanvas.style.padding = '10px';
            qrCanvas.style.border = `3px solid ${frameColor}`;
            break;
        default: // square
            qrCanvas.style.borderRadius = '8px'; // Default rounded corners for square
            qrCanvas.style.padding = '10px';
            qrCanvas.style.border = `3px solid ${frameColor}`;
    }
}

function applyQrStyle(container: HTMLElement, style: string) {
    const canvas = container.querySelector('canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    const newCanvas = document.createElement('canvas');
    newCanvas.width = width;
    newCanvas.height = height;
    const newCtx = newCanvas.getContext('2d');
    if (!newCtx) return;

    // Use the actual light color from the QR config for the background
    const qrConfigLightColor = (document.getElementById('userQrColorLight') as HTMLInputElement)?.value || getComputedStyle(document.documentElement).getPropertyValue('--surface-color').trim();
    newCtx.fillStyle = qrConfigLightColor;
    newCtx.fillRect(0, 0, width, height);

    const moduleSize = Math.floor(width / 33);

    for (let y = 0; y < height; y += moduleSize) {
        for (let x = 0; x < width; x += moduleSize) {
            const pixelIndex = (y * width + x) * 4;
            // Check if the pixel is dark (part of the QR code pattern)
            if (data[pixelIndex] < 128) {
                // Use the actual dark color from the QR config
                const qrConfigDarkColor = (document.getElementById('userQrColorDark') as HTMLInputElement)?.value || getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
                newCtx.fillStyle = qrConfigDarkColor;

                if (style === 'dots') {
                    newCtx.beginPath();
                    newCtx.arc(x + moduleSize / 2, y + moduleSize / 2, moduleSize / 2.5, 0, Math.PI * 2);
                    newCtx.fill();
                } else if (style === 'rounded') {
                    const radius = moduleSize / 4;
                    newCtx.beginPath();
                    newCtx.moveTo(x + radius, y);
                    newCtx.lineTo(x + moduleSize - radius, y);
                    newCtx.quadraticCurveTo(x + moduleSize, y, x + moduleSize, y + radius);
                    newCtx.lineTo(x + moduleSize, y + moduleSize - radius);
                    newCtx.quadraticCurveTo(x + moduleSize, y + moduleSize, x + moduleSize - radius, y + moduleSize);
                    newCtx.lineTo(x + radius, y + moduleSize);
                    newCtx.quadraticCurveTo(x, y + moduleSize, x, y + moduleSize - radius);
                    newCtx.lineTo(x, y + radius);
                    newCtx.quadraticCurveTo(x, y, x + radius, y);
                    newCtx.closePath();
                    newCtx.fill();
                }
            }
        }
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(newCanvas, 0, 0);
}

/**
 * Render lại các ảnh xem trước từ mảng selectedFiles
 */
function renderImagePreviews() {
    if (!imagePreviewContainer || !fileNameDisplay) return;

    imagePreviewContainer.innerHTML = ''; // Xóa các ảnh xem trước cũ

    if (selectedFiles.length > 0) {
        fileNameDisplay.textContent = `Đã chọn ${selectedFiles.length} ảnh.`;
        
        selectedFiles.forEach((file, index) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                if (e.target?.result) {
                    const wrapper = document.createElement('div');
                    wrapper.classList.add('preview-image-wrapper');
                    wrapper.dataset.index = index.toString();

                    const img = document.createElement('img');
                    img.src = e.target.result as string;
                    img.alt = file.name;
                    img.classList.add('preview-image');

                    const deleteBtn = document.createElement('button');
                    deleteBtn.type = 'button';
                    deleteBtn.classList.add('delete-image-btn');
                    deleteBtn.innerHTML = '&times;';
                    
                    wrapper.appendChild(img);
                    wrapper.appendChild(deleteBtn);
                    imagePreviewContainer.appendChild(wrapper);
                }
            };
            
            reader.readAsDataURL(file);
        });
    } else {
        fileNameDisplay.textContent = 'Chưa có ảnh nào được chọn';
    }
}


// --- EVENT LISTENERS ---

// Khởi tạo khi trang tải xong
let isInitialized = false;
document.addEventListener('DOMContentLoaded', async () => { // Made async to await Firestore call
    if (isInitialized) {
        console.warn("Đã khởi tạo rồi, bỏ qua");
        return;
    }
    isInitialized = true;

    // Fetch and apply theme FIRST
    try {
        const themeDoc = await db.collection('settings').doc('theme').get();
        let currentTheme = 'spring'; // Default theme
        if (themeDoc.exists) {
            const data = themeDoc.data();
            currentTheme = data?.currentTheme || 'spring';
        }
        applyTheme(currentTheme);
        // Update QR theme presets based on the applied theme
        qrThemePresets.classic.colorDark = globalThemePalettes[currentTheme]['--primary-color'];
        qrThemePresets.classic.colorLight = globalThemePalettes[currentTheme]['--surface-color'];
        qrThemePresets.classic.frameColor = globalThemePalettes[currentTheme]['--accent-color'];
        qrThemePresets.modern.colorLight = globalThemePalettes[currentTheme]['--background-color'];
        qrThemePresets.modern.frameColor = globalThemePalettes[currentTheme]['--secondary-color'];
        qrThemePresets.romantic.colorDark = globalThemePalettes[currentTheme]['--accent-color'];
        qrThemePresets.romantic.colorLight = '#FFF0F5'; // Keep light pink for romantic
        qrThemePresets.romantic.frameColor = globalThemePalettes[currentTheme]['--primary-color'];
        qrThemePresets.playful.colorDark = globalThemePalettes[currentTheme]['--secondary-color'];
        qrThemePresets.playful.colorLight = globalThemePalettes[currentTheme]['--background-color'];
        qrThemePresets.playful.frameColor = globalThemePalettes[currentTheme]['--accent-color'];
        qrThemePresets.elegant.colorDark = globalThemePalettes[currentTheme]['--text-secondary-color'];
        qrThemePresets.elegant.colorLight = globalThemePalettes[currentTheme]['--background-color'];
        qrThemePresets.elegant.frameColor = globalThemePalettes[currentTheme]['--primary-color'];

    } catch (error) {
        console.error('Error loading theme from Firestore:', error);
        applyTheme('spring'); // Fallback to default theme
    }


    // Assign DOM elements
    tabsContainer = document.querySelector('.tabs-container');
    productGrid = document.querySelector('.product-grid');

    giftOrderSection = document.getElementById('giftOrderSection');
    giftOrderForm = document.getElementById('giftOrderForm') as HTMLFormElement;
    giftOrderProductName = document.getElementById('giftOrderProductName');
    cancelGiftOrderBtn = document.getElementById('cancelGiftOrderBtn') as HTMLButtonElement;
    giftOrderSuccessMessage = document.getElementById('giftOrderSuccessMessage');

    memorySection = document.getElementById('memorySection');
    memoryForm = document.getElementById('memoryForm') as HTMLFormElement;
    memoryProductName = document.getElementById('memoryProductName');
    imageUploadInput = document.getElementById('imageUpload') as HTMLInputElement;
    fileNameDisplay = document.getElementById('fileName');
    imagePreviewContainer = document.getElementById('imagePreviewContainer');
    cancelMemoryBtn = document.getElementById('cancelMemoryBtn') as HTMLButtonElement;

    paymentModal = document.getElementById('paymentModal');
    vietQrImage = document.getElementById('vietQrImage') as HTMLImageElement;
    paymentProductName = document.getElementById('paymentProductName');
    paymentAmount = document.getElementById('paymentAmount');
    paymentContent = document.getElementById('paymentContent');
    confirmPaidBtn = document.getElementById('confirmPaidBtn') as HTMLButtonElement;
    cancelPaymentBtn = document.getElementById('cancelPaymentBtn') as HTMLButtonElement;

    waitingApprovalModal = document.getElementById('waitingApprovalModal');

    qrCustomModal = document.getElementById('qrCustomModal');
    qrPreview = document.getElementById('qrPreview');
    applyQrCustomBtn = document.getElementById('applyQrCustomBtn') as HTMLButtonElement;

    paymentRejectedModal = document.getElementById('paymentRejectedModal');
    closeRejectedBtn = document.getElementById('closeRejectedBtn') as HTMLButtonElement;

    finalQrModal = document.getElementById('finalQrModal');
    finalQrCodeDiv = document.getElementById('finalQrCode');
    saveQrBtn = document.getElementById('saveQrBtn') as HTMLButtonElement;
    closeFinalQrBtn = document.getElementById('closeFinalQrBtn') as HTMLButtonElement;

    imageViewerModal = document.getElementById('imageViewerModal');
    viewerImage = document.getElementById('viewerImage') as HTMLImageElement;
    closeViewerBtn = document.getElementById('closeViewerBtn') as HTMLButtonElement;

    heroScrollBtn = document.querySelector('.hero-scroll-btn');

    // Mặc định tải sản phẩm của tab đầu tiên
    const initialCategory = (document.querySelector('.tab-btn.active') as HTMLElement)?.dataset.tab === 'gift' ? 'gifts' : 'memories_products';
    fetchAndRenderProducts(initialCategory);

    // Attach event listeners
    if (tabsContainer) tabsContainer.addEventListener('click', handleTabClick);
    if (productGrid) productGrid.addEventListener('click', handleProductClick);
    if (giftOrderForm) giftOrderForm.addEventListener('submit', handleGiftFormSubmit);
    if (memoryForm) memoryForm.addEventListener('submit', handleMemoryFormSubmit);
    if (cancelGiftOrderBtn) cancelGiftOrderBtn.addEventListener('click', hideAllOrderSections);
    if (cancelMemoryBtn) cancelMemoryBtn.addEventListener('click', hideAllOrderSections);
    // REMOVED: confirmPaidBtn event listener - không còn cần nút "Tôi đã thanh toán"
    if (cancelPaymentBtn) cancelPaymentBtn.addEventListener('click', () => {
        if (paymentModal) toggleModal(paymentModal, false);
        // Remove loading message if exists
        const loadingMsg = document.getElementById('paymentLoadingMsg');
        if (loadingMsg) loadingMsg.remove();
        if (confirmPaidBtn) {
            confirmPaidBtn.style.display = 'block';
        }
    });
    if (closeFinalQrBtn) closeFinalQrBtn.addEventListener('click', () => {
        if (finalQrModal) toggleModal(finalQrModal, false);
    });
    if (closeViewerBtn) closeViewerBtn.addEventListener('click', () => {
        if (imageViewerModal) toggleModal(imageViewerModal, false);
    });
    if (saveQrBtn) saveQrBtn.addEventListener('click', () => {
        if (finalQrCodeDiv) {
            const canvas = finalQrCodeDiv.querySelector('canvas');
            if (canvas) {
                const link = document.createElement('a');
                link.download = `solana-memory-qr.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        }
    });
    if (imageUploadInput) imageUploadInput.addEventListener('change', () => {
        const files = imageUploadInput?.files; // Use optional chaining here
        if (files) {
            selectedFiles = Array.from(files);
            renderImagePreviews();
        }
    });
    if (imagePreviewContainer) imagePreviewContainer.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains('delete-image-btn')) {
            const wrapper = target.closest('.preview-image-wrapper') as HTMLElement;
            if (wrapper && wrapper.dataset.index) {
                const indexToRemove = parseInt(wrapper.dataset.index, 10);
                selectedFiles.splice(indexToRemove, 1);
                const dataTransfer = new DataTransfer();
                selectedFiles.forEach(file => dataTransfer.items.add(file));
                if (imageUploadInput) imageUploadInput.files = dataTransfer.files;
                renderImagePreviews();
            }
        }
        if (target.classList.contains('preview-image')) {
            if (viewerImage) viewerImage.src = (target as HTMLImageElement).src;
            if (imageViewerModal) toggleModal(imageViewerModal, true);
        }
    });

    // QR customization listeners
    const qrCustomMessage = document.getElementById('qrCustomMessage') as HTMLInputElement;
    if (qrCustomMessage) qrCustomMessage.addEventListener('input', updateQrPreview);

    const qrCustomDomain = document.getElementById('qrCustomDomain') as HTMLInputElement;
    if (qrCustomDomain) qrCustomDomain.addEventListener('input', updateQrPreview);

    document.querySelectorAll('input[name="qrThemePreset"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.querySelectorAll('.theme-preset-option').forEach(option => {
                option.classList.remove('active');
            });
            const selectedLabel = (e.target as HTMLInputElement).closest('.theme-preset-option') as HTMLElement;
            if (selectedLabel) {
                selectedLabel.classList.add('active');
            }
            updateQrPreview();
        });
    });

    if (applyQrCustomBtn) applyQrCustomBtn.addEventListener('click', applyCustomQr);

    // Listener for payment rejected
    if (closeRejectedBtn) closeRejectedBtn.addEventListener('click', () => {
        if (paymentRejectedModal) toggleModal(paymentRejectedModal, false);
        hideAllOrderSections();
        if (confirmPaidBtn) {
            confirmPaidBtn.disabled = false;
            confirmPaidBtn.textContent = 'Tôi đã thanh toán';
        }
    });

    // Listener for admin dot
    const adminDot = document.getElementById('adminDot');
    let clickCount = 0;
    let clickTimeout: number | null = null;

    if (adminDot) {
        adminDot.addEventListener('click', () => {
            clickCount++;
            if (clickTimeout) {
                clearTimeout(clickTimeout);
            }
            if (clickCount >= 3) {
                window.location.href = '/admin.html';
                clickCount = 0;
            } else {
                clickTimeout = window.setTimeout(() => {
                    clickCount = 0;
                }, 1000);
            }
        });
    }

    // Scroll to main content when hero button is clicked
    if (heroScrollBtn) {
        heroScrollBtn.addEventListener('click', () => {
            const mainElement = document.querySelector('main');
            if (mainElement) {
                mainElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Listener for the dot in "Solana.Memory" title
    const dotAdmin = document.querySelector('.dot-admin');
    if (dotAdmin) {
        dotAdmin.addEventListener('click', () => {
            window.location.href = '/admin.html';
        });
    }
});
