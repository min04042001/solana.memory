declare var firebase: any;

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
const auth = firebase.auth();
const storage = firebase.storage();

// --- GLOBAL THEME PALETTES (Duplicated for admin page for now) ---
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

/**
 * Applies the selected theme by updating CSS custom properties.
 * @param themeName The name of the theme to apply (e.g., 'spring', 'summer').
 */
function applyTheme(themeName: string) {
    const palette = globalThemePalettes[themeName] || globalThemePalettes.spring; // Default to spring
    for (const [key, value] of Object.entries(palette)) {
        document.documentElement.style.setProperty(key, value);
    }
}

const loginSection = document.getElementById('loginSection') as HTMLElement;
const adminSection = document.getElementById('adminSection') as HTMLElement;
const loginForm = document.getElementById('loginForm') as HTMLFormElement;
const loginError = document.getElementById('loginError') as HTMLElement;
const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;

const ordersGrid = document.getElementById('ordersGrid') as HTMLElement;
const productsGrid = document.getElementById('productsGrid') as HTMLElement;
const giftOrdersGrid = document.getElementById('giftOrdersGrid') as HTMLElement;
const ordersView = document.getElementById('ordersView') as HTMLElement;
const productsView = document.getElementById('productsView') as HTMLElement;
const giftOrdersView = document.getElementById('giftOrdersView') as HTMLElement;
const revenueView = document.getElementById('revenueView') as HTMLElement;
const themeView = document.getElementById('themeView') as HTMLElement;
const productsTab = document.getElementById('productsTab') as HTMLButtonElement;
const giftOrdersTab = document.getElementById('giftOrdersTab') as HTMLButtonElement;
const revenueTab = document.getElementById('revenueTab') as HTMLButtonElement;
const themeTab = document.getElementById('themeTab') as HTMLButtonElement;
const monthFilter = document.getElementById('monthFilter') as HTMLSelectElement;
const currentMonthStats = document.getElementById('currentMonthStats') as HTMLElement;
const revenueOrdersList = document.getElementById('revenueOrdersList') as HTMLElement;
const monthlyHistory = document.getElementById('monthlyHistory') as HTMLElement;
const tabsContainer = document.querySelector('.tabs-container') as HTMLElement;
const saveThemeBtn = document.getElementById('saveThemeBtn') as HTMLButtonElement;
const currentThemeName = document.getElementById('currentThemeName') as HTMLElement;
const confirmModal = document.getElementById('confirmModal') as HTMLElement;
const deleteOrderModal = document.getElementById('deleteOrderModal') as HTMLElement;
const productModal = document.getElementById('productModal') as HTMLElement;
const deleteProductModal = document.getElementById('deleteProductModal') as HTMLElement;

const addProductBtn = document.getElementById('addProductBtn') as HTMLButtonElement;
const productForm = document.getElementById('productForm') as HTMLFormElement;
const productNameInput = document.getElementById('productName') as HTMLInputElement;
const productPriceInput = document.getElementById('productPrice') as HTMLInputElement;
const productImageInput = document.getElementById('productImage') as HTMLInputElement;
const productModalTitle = document.getElementById('productModalTitle') as HTMLElement;
const cancelProductBtn = document.getElementById('cancelProductBtn') as HTMLButtonElement;

const confirmDeleteOrderBtn = document.getElementById('confirmDeleteOrderBtn') as HTMLButtonElement;
const cancelDeleteOrderBtn = document.getElementById('cancelDeleteOrderBtn') as HTMLButtonElement;
const deleteOrderId = document.getElementById('deleteOrderId') as HTMLElement;

const confirmDeleteProductBtn = document.getElementById('confirmDeleteProductBtn') as HTMLButtonElement;
const cancelDeleteProductBtn = document.getElementById('cancelDeleteProductBtn') as HTMLButtonElement;
const deleteProductName = document.getElementById('deleteProductName') as HTMLElement;

let currentOrderType = 'memory';
let selectedOrderId: string | null = null;
let selectedProductId: string | null = null;
let selectedProductCollection: string | null = null;
let orderToDelete: string | null = null;
let productToDelete: string | null = null;
let unsubscribeSnapshot: (() => void) | null = null;
let isLoggedIn = false;
let currentView: 'orders' | 'products' | 'theme' = 'orders';
let selectedTheme: string = 'spring';

const themeNames: any = {
    spring: 'Xuân 🌸',
    summer: 'Hạ ☀️',
    autumn: 'Thu 🍂',
    winter: 'Đông ❄️'
};

function checkAuth() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            showAdminPanel();
        } else {
            hideAdminPanel();
        }
    });
}

async function showAdminPanel() {
    isLoggedIn = true;
    loginSection.style.display = 'none';
    adminSection.style.display = 'block';
    fetchOrders(currentStatus);
    await loadCurrentTheme(); // Load theme when admin panel shows
}

function hideAdminPanel() {
    isLoggedIn = false;
    loginSection.style.display = 'flex';
    adminSection.style.display = 'none';
    if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
    }
}

async function handleLogin(event: Event) {
    event.preventDefault();

    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const loginBtn = document.getElementById('loginBtn') as HTMLButtonElement;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    loginBtn.disabled = true;
    loginBtn.textContent = 'Đang đăng nhập...';
    loginError.textContent = '';

    try {
        await auth.signInWithEmailAndPassword(email, password);
        loginForm.reset();
    } catch (error: any) {
        console.error('Login error:', error);
        let errorMessage = 'Đăng nhập thất bại!';

        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            errorMessage = 'Email hoặc mật khẩu không đúng!';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Email không hợp lệ!';
        } else if (error.code === 'auth/user-disabled') {
            errorMessage = 'Tài khoản đã bị vô hiệu hóa!';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau!';
        }

        loginError.textContent = errorMessage;
        passwordInput.value = '';
        passwordInput.focus();
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Đăng nhập';
    }
}

async function handleLogout() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Logout error:', error);
    }
}

function toggleModal(show: boolean) {
    if (show) {
        confirmModal.classList.add('active');
    } else {
        confirmModal.classList.remove('active');
    }
}

function formatTimestamp(timestamp: any): string {
    if (!timestamp) return 'Không rõ';
    if (typeof timestamp.toDate === 'function') {
        const date = timestamp.toDate();
        return date.toLocaleString('vi-VN');
    }
    return 'Không rõ';
}

function calculateStats(orders: any[]) {
    let totalRevenue = 0;
    let pendingOrders = 0;
    let paidOrders = 0;

    orders.forEach(order => {
        if (order.status === 'paid') {
            totalRevenue += parseInt(order.price) || 0;
            paidOrders++;
        } else if (order.status === 'awaiting_approval') {
            pendingOrders++;
        }
    });

    return { totalRevenue, pendingOrders, paidOrders, totalOrders: orders.length };
}

function renderStats(stats: any) {
    let statsContainer = document.getElementById('statsContainer');
    if (!statsContainer) {
        statsContainer = document.createElement('div');
        statsContainer.id = 'statsContainer';
        statsContainer.className = 'stats-grid';
        ordersGrid.parentElement?.insertBefore(statsContainer, ordersGrid);
    }

    statsContainer.innerHTML = `
        <div class="stat-card success">
            <div class="stat-label">Tổng doanh thu</div>
            <div class="stat-value">${stats.totalRevenue.toLocaleString('vi-VN')}đ</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Tổng đơn hàng</div>
            <div class="stat-value">${stats.totalOrders}</div>
        </div>
        <div class="stat-card success">
            <div class="stat-label">Đã thanh toán</div>
            <div class="stat-value">${stats.paidOrders}</div>
        </div>
        <div class="stat-card warning">
            <div class="stat-label">Chờ duyệt</div>
            <div class="stat-value">${stats.pendingOrders}</div>
        </div>
    `;
}

function renderOrders(orders: any[]) {
    if (orders.length === 0) {
        ordersGrid.innerHTML = '<p class="loading-text">Không có đơn hàng nào.</p>';
        return;
    }

    let html = '';
    orders.forEach(order => {
        let statusBadge = '';
        let statusText = '';
        let paymentInfo = '';

        if (order.status === 'paid') {
            statusBadge = 'badge-success';
            statusText = '✓ Đã thanh toán';
            if (order.paymentMethod === 'payos') {
                paymentInfo = '<small style="color: var(--text-secondary); display: block; margin-top: 0.25rem;">Thanh toán qua PayOS</small>';
            } else {
                paymentInfo = '<small style="color: var(--text-secondary); display: block; margin-top: 0.25rem;">Thanh toán tự động</small>';
            }
        } else if (order.status === 'awaiting_approval') {
            statusBadge = 'badge-warning';
            statusText = '⏳ Chờ thanh toán';
        } else if (order.status === 'rejected') {
            statusBadge = 'badge-danger';
            statusText = '✗ Đã từ chối';
        } else {
            statusBadge = 'badge-warning';
            statusText = '⏳ Chờ thanh toán';
        }

        html += `
            <div class="order-card">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">${order.productName}</h3>
                        <span class="badge ${statusBadge}">${statusText}</span>
                        ${paymentInfo}
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.25rem; font-weight: 700; color: var(--primary);">
                            ${parseInt(order.price || 0).toLocaleString('vi-VN')}đ
                        </div>
                    </div>
                </div>

                <div style="display: grid; gap: 0.5rem; margin-bottom: 1rem;">
                    <div class="order-detail">
                        <strong>Người nhận:</strong>
                        <span>${order.recipientName}</span>
                    </div>
                    <div class="order-detail">
                        <strong>Lời nhắn:</strong>
                        <span>${order.message ? order.message.substring(0, 80) : ''}${order.message && order.message.length > 80 ? '...' : ''}</span>
                    </div>
                    <div class="order-detail">
                        <strong>Nội dung CK:</strong>
                        <span style="font-family: monospace; font-weight: 600; color: var(--primary);">${order.paymentContent || 'N/A'}</span>
                    </div>
                    <div class="order-detail">
                        <strong>Thời gian:</strong>
                        <span>${formatTimestamp(order.createdAt)}</span>
                    </div>
                    ${order.status === 'paid' && order.paidAt ? `
                    <div class="order-detail">
                        <strong>Thanh toán lúc:</strong>
                        <span>${formatTimestamp(order.paidAt)}</span>
                    </div>
                    ` : ''}
                </div>

                <div class="order-actions" style="display: flex; gap: 0.75rem;">
                    <button class="btn btn-danger delete-order-btn" data-id="${order.id}" style="flex: 1;">Xóa</button>
                </div>
            </div>
        `;
    });

    ordersGrid.innerHTML = html;
}

function renderProducts(products: any[]) {
    if (products.length === 0) {
        productsGrid.innerHTML = '<p class="loading-text" style="padding: 2rem; text-align: center;">Chưa có sản phẩm nào.</p>';
        return;
    }

    products.sort((a, b) => {
        if (a.collection < b.collection) return 1;
        if (a.collection > b.collection) return -1;
        return 0;
    });

    let tableHtml = `
        <table class="products-table">
            <thead>
                <tr>
                    <th>Sản phẩm</th>
                    <th>Loại</th>
                    <th>Giá</th>
                    <th>Hiệu ứng</th>
                    <th class="actions-cell">Hành động</th>
                </tr>
            </thead>
            <tbody>
    `;

    products.forEach(product => {
        const collectionBadge = product.collection === 'gifts' ?
            '<span class="badge badge-success">Gift</span>' :
            '<span class="badge" style="background: #dbeafe; color: #1e40af;">Memory</span>';

        const effectText = product.effect ? product.effect.replace(/_/g, ' ').toUpperCase() : 'N/A';

        tableHtml += `
            <tr>
                <td>
                    <div class="product-name-cell">
                        <img src="${product.imageUrl || product.image}" alt="${product.name}" class="product-thumb">
                        <div>
                            <div class="product-name">${product.name}</div>
                        </div>
                    </div>
                </td>
                <td>${collectionBadge}</td>
                <td>${parseInt(product.price).toLocaleString('vi-VN')}đ</td>
                <td style="font-size: 0.9rem; color: var(--primary); font-weight: 500;">${effectText}</td>
                <td class="actions-cell">
                    <button class="btn btn-primary edit-product-btn" data-id="${product.id}" data-collection="${product.collection}">Sửa</button>
                    <button class="btn btn-danger delete-product-btn" data-id="${product.id}" data-collection="${product.collection}">Xóa</button>
                </td>
            </tr>
        `;
    });

    tableHtml += `
            </tbody>
        </table>
    `;

    productsGrid.innerHTML = tableHtml;
}

function switchToOrdersView() {
    currentView = 'orders';

    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    ordersView.classList.add('active');

    if (themeView) themeView.classList.remove('active');

    fetchOrders(currentOrderType);
}

function switchToProductsView() {
    currentView = 'products';

    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    productsView.classList.add('active');

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    productsTab.classList.add('active');

    fetchProducts();
}

function switchToGiftOrdersView() {
    currentView = 'gift-orders';

    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    if (giftOrdersView) giftOrdersView.classList.add('active');

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    giftOrdersTab.classList.add('active');

    fetchGiftOrders();
}

function switchToRevenueView() {
    currentView = 'revenue';

    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    if (revenueView) revenueView.classList.add('active');

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    revenueTab.classList.add('active');

    loadRevenueData();
}

async function switchToThemeView() {
    currentView = 'theme';

    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    if (themeView) themeView.classList.add('active');

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    themeTab.classList.add('active');

    await loadCurrentTheme(); // Ensure theme is loaded when switching to theme view
    updateThemeSelection();
}

async function loadRevenueData() {
    const selectedMonth = monthFilter?.value || getCurrentMonthKey();

    populateMonthFilter();

    try {
        const snapshot = await db.collection('memories')
            .where('status', '==', 'paid')
            .get();

        const allOrders: any[] = [];
        snapshot.forEach((doc: any) => {
            const data = doc.data();
            allOrders.push({
                id: doc.id,
                ...data
            });
        });

        allOrders.sort((a, b) => {
            if (!a.createdAt || !b.createdAt) return 0;
            const aTime = a.createdAt.toDate ? a.createdAt.toDate().getTime() : 0;
            const bTime = b.createdAt.toDate ? b.createdAt.toDate().getTime() : 0;
            return bTime - aTime;
        });

        const monthlyData = groupOrdersByMonth(allOrders);

        if (selectedMonth === getCurrentMonthKey()) {
            renderCurrentMonthRevenue(monthlyData[selectedMonth] || []);
        } else {
            renderHistoricalMonthRevenue(selectedMonth, monthlyData[selectedMonth] || []);
        }

        renderMonthlyHistory(monthlyData);

    } catch (error) {
        console.error('Lỗi khi tải dữ liệu doanh thu:', error);
        currentMonthStats.innerHTML = '<p style="text-align: center; color: var(--danger);">Không thể tải dữ liệu doanh thu</p>';
    }
}

function getCurrentMonthKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function groupOrdersByMonth(orders: any[]) {
    const grouped: any = {};

    orders.forEach(order => {
        if (order.createdAt && typeof order.createdAt.toDate === 'function') {
            const date = order.createdAt.toDate();
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!grouped[monthKey]) {
                grouped[monthKey] = [];
            }
            grouped[monthKey].push(order);
        }
    });

    return grouped;
}

function populateMonthFilter() {
    if (!monthFilter) return;

    const now = new Date();
    const options: string[] = [];

    for (let i = 0; i < 12; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long' });
        options.push(`<option value="${monthKey}">${monthName}</option>`);
    }

    monthFilter.innerHTML = options.join('');
}

function renderCurrentMonthRevenue(orders: any[]) {
    let totalRevenue = 0;
    let totalOrders = orders.length;

    orders.forEach(order => {
        totalRevenue += parseInt(order.price) || 0;
    });

    currentMonthStats.innerHTML = `
        <div class="stat-card success">
            <div class="stat-label">Doanh thu tháng này</div>
            <div class="stat-value">${totalRevenue.toLocaleString('vi-VN')}đ</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Số đơn hàng</div>
            <div class="stat-value">${totalOrders}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Trung bình/đơn</div>
            <div class="stat-value">${totalOrders > 0 ? Math.round(totalRevenue / totalOrders).toLocaleString('vi-VN') : 0}đ</div>
        </div>
    `;

    renderOrdersList(orders);
}

function renderHistoricalMonthRevenue(monthKey: string, orders: any[]) {
    let totalRevenue = 0;

    orders.forEach(order => {
        totalRevenue += parseInt(order.price) || 0;
    });

    currentMonthStats.innerHTML = `
        <div class="stat-card success">
            <div class="stat-label">Doanh thu tháng</div>
            <div class="stat-value">${totalRevenue.toLocaleString('vi-VN')}đ</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Số đơn hàng</div>
            <div class="stat-value">${orders.length}</div>
        </div>
    `;

    renderOrdersList(orders);
}

function renderOrdersList(orders: any[]) {
    if (orders.length === 0) {
        revenueOrdersList.innerHTML = '<p style="text-align: center; color: var(--text-light);">Không có đơn hàng nào.</p>';
        return;
    }

    let html = '<div style="display: grid; gap: 1rem;">';

    orders.forEach(order => {
        const date = order.createdAt && typeof order.createdAt.toDate === 'function'
            ? order.createdAt.toDate().toLocaleDateString('vi-VN')
            : 'N/A';

        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg); border-radius: 8px;">
                <div>
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">${order.productName}</div>
                    <div style="font-size: 0.875rem; color: var(--text-light);">
                        ${order.recipientName} • ${date}
                    </div>
                </div>
                <div style="font-weight: 700; color: var(--success); font-size: 1.1rem;">
                    ${parseInt(order.price).toLocaleString('vi-VN')}đ
                </div>
            </div>
        `;
    });

    html += '</div>';
    revenueOrdersList.innerHTML = html;
}

function renderMonthlyHistory(monthlyData: any) {
    const months = Object.keys(monthlyData).sort().reverse();

    if (months.length === 0) {
        monthlyHistory.innerHTML = '<p style="text-align: center; color: var(--text-light);">Chưa có dữ liệu.</p>';
        return;
    }

    let html = '<div style="display: grid; gap: 1rem;">';

    months.forEach(monthKey => {
        const orders = monthlyData[monthKey];
        let totalRevenue = 0;

        orders.forEach((order: any) => {
            totalRevenue += parseInt(order.price) || 0;
        });

        const [year, month] = monthKey.split('-');
        const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long'
        });

        const isCurrentMonth = monthKey === getCurrentMonthKey();

        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.25rem; background: ${isCurrentMonth ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg)'}; border-radius: 8px; border: ${isCurrentMonth ? '2px solid var(--primary)' : 'none'};">
                <div>
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">
                        ${monthName} ${isCurrentMonth ? '<span style="color: var(--primary); font-size: 0.875rem;">(Hiện tại)</span>' : ''}
                    </div>
                    <div style="font-size: 0.875rem; color: var(--text-light);">
                        ${orders.length} đơn hàng
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 700; color: var(--success); font-size: 1.25rem;">
                        ${totalRevenue.toLocaleString('vi-VN')}đ
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    monthlyHistory.innerHTML = html;
}

async function fetchGiftOrders() {
    giftOrdersGrid.innerHTML = '<p class="loading-text">Đang tải đơn hàng...</p>';

    try {
        const snapshot = await db.collection('gift_orders')
            .orderBy('createdAt', 'desc')
            .get();

        const orders: any[] = [];
        snapshot.forEach((doc: any) => {
            orders.push({
                id: doc.id,
                ...doc.data()
            });
        });

        renderGiftOrders(orders);
    } catch (error) {
        console.error('Lỗi khi tải đơn hàng gift:', error);
        giftOrdersGrid.innerHTML = '<p class="loading-text">Không thể tải đơn hàng. Vui lòng thử lại.</p>';
    }
}

function renderGiftOrders(orders: any[]) {
    if (orders.length === 0) {
        giftOrdersGrid.innerHTML = '<p class="loading-text">Chưa có đơn hàng nào.</p>';
        return;
    }

    let html = '';
    orders.forEach(order => {
        const date = order.createdAt && typeof order.createdAt.toDate === 'function'
            ? order.createdAt.toDate().toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
            : 'N/A';

        html += `
            <div class="order-card">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">${order.productName || 'Sản phẩm Gift'}</h3>
                        <span class="badge badge-success">Đơn Gift</span>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.25rem; font-weight: 700; color: var(--primary);">
                            ${parseInt(order.price || 0).toLocaleString('vi-VN')}đ
                        </div>
                    </div>
                </div>

                <div style="display: grid; gap: 0.5rem; margin-bottom: 1rem;">
                    <div class="order-detail">
                        <strong>Tên khách hàng:</strong>
                        <span>${order.customerName || 'N/A'}</span>
                    </div>
                    <div class="order-detail">
                        <strong>Số điện thoại:</strong>
                        <span>${order.phoneNumber || 'N/A'}</span>
                    </div>
                    <div class="order-detail">
                        <strong>Địa chỉ:</strong>
                        <span>${order.address || 'N/A'}</span>
                    </div>
                    <div class="order-detail">
                        <strong>Số lượng:</strong>
                        <span>${order.quantity || 1}</span>
                    </div>
                    <div class="order-detail">
                        <strong>Ghi chú:</strong>
                        <span>${order.note ? order.note.substring(0, 100) : 'Không có'}${order.note && order.note.length > 100 ? '...' : ''}</span>
                    </div>
                    <div class="order-detail">
                        <strong>Thời gian đặt:</strong>
                        <span>${date}</span>
                    </div>
                </div>

                <div class="order-actions" style="display: flex; gap: 0.75rem;">
                    <button class="btn btn-danger delete-gift-order-btn" data-id="${order.id}" style="flex: 1;">Xóa</button>
                </div>
            </div>
        `;
    });

    giftOrdersGrid.innerHTML = html;
}

async function fetchProducts() {
    productsGrid.innerHTML = '<p class="loading-text">Đang tải sản phẩm...</p>';

    try {
        const giftsSnapshot = await db.collection('gifts').get();
        const memoriesSnapshot = await db.collection('memories_products').get();

        const products: any[] = [];

        giftsSnapshot.forEach((doc: any) => {
            products.push({
                id: doc.id,
                collection: 'gifts',
                ...doc.data()
            });
        });

        memoriesSnapshot.forEach((doc: any) => {
            products.push({
                id: doc.id,
                collection: 'memories_products',
                ...doc.data()
            });
        });

        renderProducts(products);
    } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
        productsGrid.innerHTML = '<p class="loading-text">Không thể tải sản phẩm.</p>';
    }
}

function fetchOrders(orderType: string) {
    if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
    }

    ordersGrid.innerHTML = '<p class="loading-text">Đang tải đơn hàng...</p>';

    const collection = orderType === 'memory' ? 'memories' : 'gift_orders';
    let query = db.collection(collection).orderBy('createdAt', 'desc');

    unsubscribeSnapshot = query.onSnapshot((snapshot: any) => {
        const orders: any[] = [];
        snapshot.forEach((doc: any) => {
            orders.push({
                id: doc.id,
                ...doc.data()
            });
        });
        renderOrders(orders);
    }, (error: any) => {
        console.error('Lỗi khi tải đơn hàng:', error);
        ordersGrid.innerHTML = '<p class="loading-text">Không thể tải đơn hàng. Vui lòng thử lại.</p>';
    });
}

function handleTabClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('tab-btn')) return;

    const tabType = target.dataset.tab;

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    target.classList.add('active');

    if (tabType === 'orders') {
        switchToOrdersView();
    } else if (tabType === 'products') {
        switchToProductsView();
    } else if (tabType === 'gift-orders') {
        switchToGiftOrdersView();
    } else if (tabType === 'revenue') {
        switchToRevenueView();
    } else if (tabType === 'theme') {
        switchToThemeView();
    }
}

function handleSubTabClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('sub-tab-btn')) return;

    const orderType = target.dataset.orderType;
    if (!orderType) return;

    document.querySelectorAll('.sub-tab-btn').forEach(btn => btn.classList.remove('active'));
    target.classList.add('active');

    currentOrderType = orderType;
    fetchOrders(currentOrderType);
}

function handleOrderClick(event: Event) {
    const target = event.target as HTMLElement;

    if (target.classList.contains('delete-order-btn')) {
        orderToDelete = target.dataset.id as string;
        if (!orderToDelete) return;
        deleteOrderId.textContent = orderToDelete.slice(0, 12) + '...';
        toggleDeleteOrderModal(true);
    }
}

function handleProductsClick(event: Event) {
    const target = event.target as HTMLElement;
    const button = target.closest('.btn');

    if (!button) return;

    if (button.classList.contains('edit-product-btn')) {
        selectedProductId = (button as HTMLElement).dataset.id as string;
        selectedProductCollection = (button as HTMLElement).dataset.collection as string;
        if (!selectedProductId || !selectedProductCollection) return;

        db.collection(selectedProductCollection).doc(selectedProductId).get().then((doc: any) => {
            if (doc.exists) {
                const data = doc.data();
                productModalTitle.textContent = 'Sửa sản phẩm';
                productNameInput.value = data.name;
                productPriceInput.value = data.price;
                productImageInput.value = data.imageUrl || data.image || '';

                const collectionSelect = document.getElementById('productCollection') as HTMLSelectElement;
                const effectInput = document.getElementById('productEffect') as HTMLSelectElement;

                if (collectionSelect) collectionSelect.value = selectedProductCollection;
                if (effectInput) effectInput.value = data.effect || 'love';

                toggleProductModal(true);
            }
        });
    }

    if (button.classList.contains('delete-product-btn')) {
        productToDelete = (button as HTMLElement).dataset.id as string;
        selectedProductCollection = (button as HTMLElement).dataset.collection as string;
        if (!productToDelete || !selectedProductCollection) return;

        db.collection(selectedProductCollection).doc(productToDelete).get().then((doc: any) => {
            if (doc.exists) {
                deleteProductName.textContent = doc.data().name;
                toggleDeleteProductModal(true);
            }
        });
    }
}

function handleGiftOrdersClick(event: Event) {
    const target = event.target as HTMLElement;

    if (target.classList.contains('delete-gift-order-btn')) {
        const orderId = target.dataset.id as string;
        if (!orderId) return;

        if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
            deleteGiftOrder(orderId);
        }
    }
}

async function deleteGiftOrder(orderId: string) {
    try {
        await db.collection('gift_orders').doc(orderId).delete();
        fetchGiftOrders();
    } catch (error) {
        console.error('Lỗi khi xóa đơn hàng:', error);
        alert('Không thể xóa đơn hàng. Vui lòng thử lại.');
    }
}

function toggleDeleteOrderModal(show: boolean) {
    if (show) {
        deleteOrderModal.classList.add('active');
    } else {
        deleteOrderModal.classList.remove('active');
    }
}

function toggleProductModal(show: boolean) {
    if (show) {
        productModal.classList.add('active');
    } else {
        productModal.classList.remove('active');
    }
}

function toggleDeleteProductModal(show: boolean) {
    if (show) {
        deleteProductModal.classList.add('active');
    } else {
        deleteProductModal.classList.remove('active');
    }
}

async function deleteOrder() {
    if (!orderToDelete) return;

    confirmDeleteOrderBtn.disabled = true;
    confirmDeleteOrderBtn.textContent = 'Đang xóa...';

    try {
        await db.collection('memories').doc(orderToDelete).delete();
        toggleDeleteOrderModal(false);
        orderToDelete = null;
        confirmDeleteOrderBtn.disabled = false;
        confirmDeleteOrderBtn.textContent = 'Xóa';
    } catch (error) {
        console.error('Lỗi khi xóa đơn hàng:', error);
        alert('Không thể xóa đơn hàng. Vui lòng thử lại.');
        confirmDeleteOrderBtn.disabled = false;
        confirmDeleteOrderBtn.textContent = 'Xóa';
    }
}

async function generateQRCode(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const container = document.createElement('div');
        container.style.display = 'none';
        document.body.appendChild(container);

        try {
            const qr = new (window as any).QRCode(container, {
                text: url,
                width: 512,
                height: 512,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: (window as any).QRCode.CorrectLevel.H
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

async function saveProduct(event: Event) {
    event.preventDefault();

    const name = productNameInput.value.trim();
    const price = productPriceInput.value;
    const collection = (document.getElementById('productCollection') as HTMLSelectElement)?.value || 'gifts';
    const effect = (document.getElementById('productEffect') as HTMLSelectElement)?.value || 'love';

    const imageInputType = (document.querySelector('input[name="imageInputType"]:checked') as HTMLInputElement)?.value;
    const imageFile = (document.getElementById('productImageFile') as HTMLInputElement)?.files?.[0];
    const imageUrlInput = productImageInput.value.trim();

    if (!name || !price || !effect) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    if (imageInputType === 'upload' && !imageFile && !selectedProductId) {
        alert('Vui lòng chọn hình ảnh!');
        return;
    }

    if (imageInputType === 'url' && !imageUrlInput) {
        alert('Vui lòng nhập URL hình ảnh!');
        return;
    }

    try {
        let imageUrl = imageUrlInput;

        if (imageInputType === 'upload' && imageFile) {
            const timestamp = Date.now();
            const filename = `products/${timestamp}_${imageFile.name}`;
            const storageRef = storage.ref().child(filename);

            await storageRef.put(imageFile);
            imageUrl = await storageRef.getDownloadURL();
        }

        const productData: any = {
            name,
            price: parseInt(price),
            imageUrl,
            effect,
            updatedAt: new Date().toISOString()
        };

        if (!selectedProductId) {
            productData.createdAt = new Date().toISOString();
        }

        if (selectedProductId && selectedProductCollection) {
            await db.collection(selectedProductCollection).doc(selectedProductId).update(productData);
        } else {
            await db.collection(collection).add(productData);
        }

        toggleProductModal(false);
        productForm.reset();
        selectedProductId = null;
        selectedProductCollection = null;

        const imagePreview = document.getElementById('imagePreview');
        if (imagePreview) imagePreview.style.display = 'none';

        fetchProducts();
        alert('Sản phẩm đã được lưu thành công!');
    } catch (error) {
        console.error('Lỗi khi lưu sản phẩm:', error);
        alert('Không thể lưu sản phẩm. Vui lòng thử lại.');
    }
}

async function deleteProduct() {
    if (!productToDelete || !selectedProductCollection) return;

    confirmDeleteProductBtn.disabled = true;
    confirmDeleteProductBtn.textContent = 'Đang xóa...';

    try {
        await db.collection(selectedProductCollection).doc(productToDelete).delete();
        toggleDeleteProductModal(false);
        productToDelete = null;
        selectedProductCollection = null;
        confirmDeleteProductBtn.disabled = false;
        confirmDeleteProductBtn.textContent = 'Xóa';
        fetchProducts();
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        alert('Không thể xóa sản phẩm. Vui lòng thử lại.');
        confirmDeleteProductBtn.disabled = false;
        confirmDeleteProductBtn.textContent = 'Xóa';
    }
}

async function loadCurrentTheme() {
    try {
        const themeDoc = await db.collection('settings').doc('theme').get();
        if (themeDoc.exists) {
            const data = themeDoc.data();
            selectedTheme = data?.currentTheme || 'spring';
        } else {
            selectedTheme = 'spring';
        }
        currentThemeName.textContent = themeNames[selectedTheme];
        applyTheme(selectedTheme); // Apply theme to admin page
        updateThemeSelection();
    } catch (error) {
        console.error('Lỗi khi load theme:', error);
        selectedTheme = 'spring';
        currentThemeName.textContent = themeNames[selectedTheme];
        applyTheme(selectedTheme); // Fallback theme
    }
}

function updateThemeSelection() {
    document.querySelectorAll('.theme-option').forEach(option => {
        const theme = (option as HTMLElement).dataset.theme;
        if (theme === selectedTheme) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

async function saveTheme() {
    saveThemeBtn.disabled = true;
    saveThemeBtn.textContent = 'Đang lưu...';

    try {
        await db.collection('settings').doc('theme').set({
            currentTheme: selectedTheme,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert('Theme đã được lưu thành công!');
        applyTheme(selectedTheme); // Apply theme to admin page immediately
        saveThemeBtn.disabled = false;
        saveThemeBtn.textContent = 'Lưu theme';
    } catch (error) {
        console.error('Lỗi khi lưu theme:', error);
        alert('Không thể lưu theme. Vui lòng thử lại.');
        saveThemeBtn.disabled = false;
        saveThemeBtn.textContent = 'Lưu theme';
    }
}

loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);
tabsContainer.addEventListener('click', handleTabClick);
ordersGrid.addEventListener('click', handleOrderClick);
productsGrid.addEventListener('click', handleProductsClick);
giftOrdersGrid.addEventListener('click', handleGiftOrdersClick);

document.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', () => {
        selectedTheme = (option as HTMLElement).dataset.theme || 'spring';
        currentThemeName.textContent = themeNames[selectedTheme];
        updateThemeSelection();
    });
});

saveThemeBtn.addEventListener('click', saveTheme);

if (monthFilter) {
    monthFilter.addEventListener('change', loadRevenueData);
}

addProductBtn.addEventListener('click', () => {
    selectedProductId = null;
    selectedProductCollection = null;
    productModalTitle.textContent = 'Thêm sản phẩm mới';
    productForm.reset();

    const collectionSelect = document.getElementById('productCollection') as HTMLSelectElement;
    if (collectionSelect) collectionSelect.value = 'gifts';

    toggleProductModal(true);
});

productForm.addEventListener('submit', saveProduct);
cancelProductBtn.addEventListener('click', () => {
    toggleProductModal(false);
    selectedProductId = null;
});

confirmDeleteOrderBtn.addEventListener('click', deleteOrder);
cancelDeleteOrderBtn.addEventListener('click', () => {
    toggleDeleteOrderModal(false);
    orderToDelete = null;
});

confirmDeleteProductBtn.addEventListener('click', deleteProduct);
cancelDeleteProductBtn.addEventListener('click', () => {
    toggleDeleteProductModal(false);
    productToDelete = null;
});

const subTabsContainer = document.querySelector('.sub-tabs-container');
if (subTabsContainer) {
    subTabsContainer.addEventListener('click', handleSubTabClick);
}

const imageInputTypeRadios = document.querySelectorAll('input[name="imageInputType"]');
imageInputTypeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        const uploadContainer = document.getElementById('imageUploadContainer');
        const urlContainer = document.getElementById('imageUrlContainer');

        if (target.value === 'upload') {
            if (uploadContainer) uploadContainer.style.display = 'block';
            if (urlContainer) urlContainer.style.display = 'none';
        } else {
            if (uploadContainer) uploadContainer.style.display = 'none';
            if (urlContainer) urlContainer.style.display = 'block';
        }
    });
});

const productImageFile = document.getElementById('productImageFile') as HTMLInputElement;
if (productImageFile) {
    productImageFile.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const previewImg = document.getElementById('previewImg') as HTMLImageElement;
                const imagePreview = document.getElementById('imagePreview');
                if (previewImg && imagePreview && event.target?.result) {
                    previewImg.src = event.target.result as string;
                    imagePreview.style.display = 'block';
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

export {};
