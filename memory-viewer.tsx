// Khai báo cho TypeScript biết rằng 'firebase' là một biến toàn cục
declare var firebase: any;

// QUAN TRỌNG: Dán đối tượng firebaseConfig của bạn vào đây
const firebaseConfig = {
    apiKey: "AIzaSyBMXv_8dYkYf9IvClrIRLK5USdJjD66Qf4",
    authDomain: "gift-aa09e.firebaseapp.com",
    projectId: "gift-aa09e",
    storageBucket: "gift-aa09e.firebasestorage.app",
    messagingSenderId: "905741943305",
    appId: "1:905741943305:web:8cd498eda1e3c5ad792ed8",
    measurementId: "G-KT4MWKFZ8V"
};

// Khởi tạo Firebase bằng cú pháp v8
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
const storage = firebase.storage(); // Initialize Firebase Storage

// --- GLOBAL THEME PALETTES (Duplicated for memory-viewer for now) ---
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
        // No hero-specific vars needed for memory-viewer
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

// DOM Elements (Declared as let, assigned in DOMContentLoaded)
let loadingState: HTMLElement | null = null;
let memoryContent: HTMLElement | null = null;
let errorState: HTMLElement | null = null;

let recipientNameEl: HTMLElement | null = null;
let productNameEl: HTMLElement | null = null;
let messageContentEl: HTMLElement | null = null;
let imageFileNameEl: HTMLElement | null = null;
let timestampEl: HTMLElement | null = null;
let imageGallery: HTMLElement | null = null;

// Image Viewer Modal (for memory-viewer) - dynamically created, so no need to query
let imageViewerModalEl: HTMLElement | null = null;
let viewerImageEl: HTMLImageElement | null = null;
let closeViewerBtnEl: HTMLButtonElement | null = null;


async function fetchMemory() {
    // Ensure elements are available before use
    if (!loadingState || !errorState || !recipientNameEl || !productNameEl || !messageContentEl || !imageFileNameEl || !timestampEl || !imageGallery) {
        console.error("DOM elements not found for memory viewer.");
        showError(); // Call showError even if elements are null to try and display something
        return;
    }

    try {
        const params = new URLSearchParams(window.location.search);
        const memoryId = params.get('id');

        if (!memoryId) {
            showError();
            return;
        }

        const memoryDoc = await db.collection('memories').doc(memoryId).get();

        if (memoryDoc.exists) {
            const data = memoryDoc.data();
            displayMemory(data);
        } else {
            showError();
        }
    } catch (err) {
        console.error("Error fetching memory:", err);
        showError();
    }
}

async function displayMemory(data: any) {
    // Ensure elements are available before use
    if (!loadingState || !memoryContent || !recipientNameEl || !productNameEl || !messageContentEl || !imageFileNameEl || !timestampEl || !imageGallery) {
        console.error("DOM elements not found for memory viewer display.");
        return;
    }

    recipientNameEl.textContent = `Gửi đến ${data.recipientName}`;
    productNameEl.textContent = data.productName;
    messageContentEl.textContent = data.message;
    
    // Handle multiple image file names
    if (data.imageFileNames && Array.isArray(data.imageFileNames) && data.imageFileNames.length > 0) {
        imageFileNameEl.textContent = `Ảnh đính kèm: ${data.imageFileNames.join(', ')}`;
        imageGallery.innerHTML = ''; // Clear previous images

        for (const fileName of data.imageFileNames) {
            if (fileName === 'Không có ảnh') continue;
            try {
                // Assuming images are stored in a 'memory_images' folder in Firebase Storage
                const imageRef = storage.ref(`memory_images/${data.accessToken}/${fileName}`);
                const imageUrl = await imageRef.getDownloadURL();
                
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.alt = fileName;
                imgElement.classList.add('gallery-image');
                imgElement.addEventListener('click', () => {
                    if (viewerImageEl) viewerImageEl.src = imageUrl;
                    if (imageViewerModalEl) imageViewerModalEl.classList.add('visible');
                });
                imageGallery.appendChild(imgElement);

            } catch (error) {
                console.warn(`Could not load image ${fileName}:`, error);
                // Optionally display a placeholder or error icon
            }
        }
    } else {
        imageFileNameEl.textContent = 'Không có ảnh đính kèm.';
    }

    if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        const date = data.createdAt.toDate();
        timestampEl.textContent = date.toLocaleString('vi-VN');
    } else {
        timestampEl.textContent = 'Không rõ';
    }

    loadingState.style.display = 'none';
    memoryContent.style.display = 'block';
}

function showError() {
    // Ensure elements are available before use
    if (!loadingState || !errorState) {
        console.error("DOM elements not found for error display.");
        return;
    }
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', async () => { // Made async to await Firestore call
    // Fetch and apply theme FIRST
    try {
        const themeDoc = await db.collection('settings').doc('theme').get();
        let currentTheme = 'spring'; // Default theme
        if (themeDoc.exists) {
            const data = themeDoc.data();
            currentTheme = data?.currentTheme || 'spring';
        }
        applyTheme(currentTheme);
    } catch (error) {
        console.error('Error loading theme from Firestore:', error);
        applyTheme('spring'); // Fallback to default theme
    }

    // Assign DOM elements
    loadingState = document.getElementById('loadingState');
    memoryContent = document.getElementById('memoryContent');
    errorState = document.getElementById('errorState');

    recipientNameEl = document.getElementById('recipientName');
    productNameEl = document.getElementById('productName');
    messageContentEl = document.getElementById('messageContent');
    imageFileNameEl = document.getElementById('imageFileName');
    timestampEl = document.getElementById('timestamp');
    imageGallery = document.getElementById('imageGallery');

    // Dynamically create image viewer modal
    imageViewerModalEl = document.createElement('div');
    imageViewerModalEl.id = 'imageViewerModal';
    imageViewerModalEl.classList.add('modal-overlay');
    document.body.appendChild(imageViewerModalEl);

    const imageViewerContent = document.createElement('div');
    imageViewerContent.classList.add('image-viewer-content');
    imageViewerModalEl.appendChild(imageViewerContent);

    closeViewerBtnEl = document.createElement('button');
    closeViewerBtnEl.id = 'closeViewerBtn';
    closeViewerBtnEl.classList.add('close-viewer-btn');
    closeViewerBtnEl.innerHTML = '&times;';
    imageViewerContent.appendChild(closeViewerBtnEl);

    viewerImageEl = document.createElement('img');
    viewerImageEl.id = 'viewerImage';
    viewerImageEl.alt = 'Xem trước ảnh';
    imageViewerContent.appendChild(viewerImageEl);

    if (closeViewerBtnEl) {
        closeViewerBtnEl.addEventListener('click', () => {
            if (imageViewerModalEl) imageViewerModalEl.classList.remove('visible');
        });
    }
    if (imageViewerModalEl) {
        imageViewerModalEl.addEventListener('click', (e) => {
            if (e.target === imageViewerModalEl) {
                if (imageViewerModalEl) imageViewerModalEl.classList.remove('visible');
            }
        });
    }

    fetchMemory();
});
// FIX: Add an empty export to treat this file as a module and prevent global scope pollution.
export {};
