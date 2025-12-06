import"./modulepreload-polyfill-B5Qt9EMX.js";const fe={apiKey:"AIzaSyBMXv_8dYkYf9IvClrIRLK5USdJjD66Qf4",authDomain:"gift-aa09e.firebaseapp.com",projectId:"gift-aa09e",storageBucket:"gift-aa09e.firebasestorage.app",messagingSenderId:"905741943305",appId:"1:905741943305:web:8cd498eda1e3c5ad792ed8",measurementId:"G-KT4MWKFZ8V"};firebase.apps.length||firebase.initializeApp(fe);const l=firebase.firestore(),M=firebase.auth(),ve=firebase.storage(),U={spring:{"--primary-color":"#9E7FFF","--secondary-color":"#38bdf8","--accent-color":"#f472b6","--background-color":"#171717","--surface-color":"#262626","--text-color":"#FFFFFF","--text-secondary-color":"#A3A3A3","--border-color":"#2F2F2F","--success-color":"#10b981","--warning-color":"#f59e0b","--error-color":"#ef4444","--hero-bg-image":'url("https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',"--hero-gradient":"radial-gradient(circle at center, rgba(23, 23, 23, 0.05) 0%, rgba(23, 23, 23, 0.5) 70%)","--hero-scroll-btn-bg":"linear-gradient(45deg, #ffb6c1, #ffecb3)","--hero-scroll-btn-hover-bg":"linear-gradient(45deg, #ffecb3, #ffb6c1)","--hero-scroll-btn-hover-shadow":"0 12px 30px rgba(0, 0, 0, 0.3), 0 0 25px rgba(255, 182, 193, 0.7)","--tab-active-bg":"linear-gradient(45deg, var(--primary-color), var(--accent-color))","--product-card-hover-shadow":"0 20px 45px rgba(0, 0, 0, 0.4), 0 0 25px rgba(244, 114, 182, 0.7)","--success-message-bg-color":"rgba(158, 127, 255, 0.12)","--success-message-border-color":"var(--accent-color)","--success-message-heart-fill":"#f472b6"},summer:{"--primary-color":"#FFD700","--secondary-color":"#FFA500","--accent-color":"#FF6347","--background-color":"#1A1A1A","--surface-color":"#2C2C2C","--text-color":"#FFFFFF","--text-secondary-color":"#B0B0B0","--border-color":"#3A3A3A","--success-color":"#32CD32","--warning-color":"#FFD700","--error-color":"#FF4500","--hero-bg-image":'url("https://images.pexels.com/photos/1078981/pexels-photo-1078981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',"--hero-gradient":"radial-gradient(circle at center, rgba(26, 26, 26, 0.05) 0%, rgba(26, 26, 26, 0.5) 70%)","--hero-scroll-btn-bg":"linear-gradient(45deg, #FFD700, #FFA500)","--hero-scroll-btn-hover-bg":"linear-gradient(45deg, #FFA500, #FFD700)","--hero-scroll-btn-hover-shadow":"0 12px 30px rgba(0, 0, 0, 0.3), 0 0 25px rgba(255, 215, 0, 0.7)","--tab-active-bg":"linear-gradient(45deg, var(--primary-color), var(--accent-color))","--product-card-hover-shadow":"0 20px 45px rgba(0, 0, 0, 0.4), 0 0 25px rgba(255, 99, 71, 0.7)","--success-message-bg-color":"rgba(255, 215, 0, 0.12)","--success-message-border-color":"var(--accent-color)","--success-message-heart-fill":"#FF6347"},autumn:{"--primary-color":"#D2691E","--secondary-color":"#CD853F","--accent-color":"#B8860B","--background-color":"#1C1C1C","--surface-color":"#333333","--text-color":"#F5F5DC","--text-secondary-color":"#D3D3D3","--border-color":"#444444","--success-color":"#6B8E23","--warning-color":"#DAA520","--error-color":"#DC143C","--hero-bg-image":'url("https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',"--hero-gradient":"radial-gradient(circle at center, rgba(28, 28, 28, 0.05) 0%, rgba(28, 28, 28, 0.5) 70%)","--hero-scroll-btn-bg":"linear-gradient(45deg, #CD853F, #B8860B)","--hero-scroll-btn-hover-bg":"linear-gradient(45deg, #B8860B, #CD853F)","--hero-scroll-btn-hover-shadow":"0 12px 30px rgba(0, 0, 0, 0.3), 0 0 25px rgba(205, 133, 63, 0.7)","--tab-active-bg":"linear-gradient(45deg, var(--primary-color), var(--accent-color))","--product-card-hover-shadow":"0 20px 45px rgba(0, 0, 0, 0.4), 0 0 25px rgba(184, 134, 11, 0.7)","--success-message-bg-color":"rgba(210, 105, 30, 0.12)","--success-message-border-color":"var(--accent-color)","--success-message-heart-fill":"#B8860B"},winter:{"--primary-color":"#ADD8E6","--secondary-color":"#87CEEB","--accent-color":"#B0E0E6","--background-color":"#1F1F1F","--surface-color":"#363636","--text-color":"#E0FFFF","--text-secondary-color":"#C0C0C0","--border-color":"#4A4A4A","--success-color":"#4682B4","--warning-color":"#6A5ACD","--error-color":"#FF6347","--hero-bg-image":'url("https://images.pexels.com/photos/1570610/pexels-photo-1570610.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',"--hero-gradient":"radial-gradient(circle at center, rgba(31, 31, 31, 0.05) 0%, rgba(31, 31, 31, 0.5) 70%)","--hero-scroll-btn-bg":"linear-gradient(45deg, #87CEEB, #B0E0E6)","--hero-scroll-btn-hover-bg":"linear-gradient(45deg, #B0E0E6, #87CEEB)","--hero-scroll-btn-hover-shadow":"0 12px 30px rgba(0, 0, 0, 0.3), 0 0 25px rgba(135, 206, 235, 0.7)","--tab-active-bg":"linear-gradient(45deg, var(--primary-color), var(--accent-color))","--product-card-hover-shadow":"0 20px 45px rgba(0, 0, 0, 0.4), 0 0 25px rgba(176, 224, 230, 0.7)","--success-message-bg-color":"rgba(173, 216, 230, 0.12)","--success-message-border-color":"var(--accent-color)","--success-message-heart-fill":"#B0E0E6"}};function S(t){const n=U[t]||U.spring;for(const[e,a]of Object.entries(n))document.documentElement.style.setProperty(e,a)}const oe=document.getElementById("loginSection"),re=document.getElementById("adminSection"),ce=document.getElementById("loginForm"),X=document.getElementById("loginError"),ye=document.getElementById("logoutBtn"),L=document.getElementById("ordersGrid"),x=document.getElementById("productsGrid"),B=document.getElementById("giftOrdersGrid"),be=document.getElementById("ordersView"),Ee=document.getElementById("productsView"),_=document.getElementById("giftOrdersView"),Y=document.getElementById("revenueView"),T=document.getElementById("themeView"),Le=document.getElementById("productsTab"),xe=document.getElementById("giftOrdersTab"),Be=document.getElementById("revenueTab"),Ie=document.getElementById("themeTab"),f=document.getElementById("monthFilter"),V=document.getElementById("currentMonthStats"),Q=document.getElementById("revenueOrdersList"),W=document.getElementById("monthlyHistory"),we=document.querySelector(".tabs-container"),m=document.getElementById("saveThemeBtn"),F=document.getElementById("currentThemeName");document.getElementById("confirmModal");const J=document.getElementById("deleteOrderModal"),Z=document.getElementById("productModal"),ee=document.getElementById("deleteProductModal"),Te=document.getElementById("addProductBtn"),O=document.getElementById("productForm"),se=document.getElementById("productName"),ie=document.getElementById("productPrice"),le=document.getElementById("productImage"),de=document.getElementById("productModalTitle"),Ae=document.getElementById("cancelProductBtn"),h=document.getElementById("confirmDeleteOrderBtn"),Ce=document.getElementById("cancelDeleteOrderBtn"),Se=document.getElementById("deleteOrderId"),p=document.getElementById("confirmDeleteProductBtn"),Fe=document.getElementById("cancelDeleteProductBtn"),De=document.getElementById("deleteProductName");let D="memory",g=null,i=null,v=null,y=null,E=null,d="spring";const $={spring:"Xuân 🌸",summer:"Hạ ☀️",autumn:"Thu 🍂",winter:"Đông ❄️"};function $e(){M.onAuthStateChanged(t=>{t?ke():Me()})}async function ke(){oe.style.display="none",re.style.display="block",P(currentStatus),await he()}function Me(){oe.style.display="flex",re.style.display="none",E&&E()}async function Ve(t){t.preventDefault();const n=document.getElementById("email"),e=document.getElementById("password"),a=document.getElementById("loginBtn"),o=n.value.trim(),r=e.value;a.disabled=!0,a.textContent="Đang đăng nhập...",X.textContent="";try{await M.signInWithEmailAndPassword(o,r),ce.reset()}catch(c){console.error("Login error:",c);let s="Đăng nhập thất bại!";c.code==="auth/user-not-found"||c.code==="auth/wrong-password"?s="Email hoặc mật khẩu không đúng!":c.code==="auth/invalid-email"?s="Email không hợp lệ!":c.code==="auth/user-disabled"?s="Tài khoản đã bị vô hiệu hóa!":c.code==="auth/too-many-requests"&&(s="Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau!"),X.textContent=s,e.value="",e.focus()}finally{a.disabled=!1,a.textContent="Đăng nhập"}}async function Oe(){try{await M.signOut()}catch(t){console.error("Logout error:",t)}}function te(t){return t&&typeof t.toDate=="function"?t.toDate().toLocaleString("vi-VN"):"Không rõ"}function Ne(t){if(t.length===0){L.innerHTML='<p class="loading-text">Không có đơn hàng nào.</p>';return}let n="";t.forEach(e=>{let a="",o="",r="";e.status==="paid"?(a="badge-success",o="✓ Đã thanh toán",e.paymentMethod==="payos"?r='<small style="color: var(--text-secondary); display: block; margin-top: 0.25rem;">Thanh toán qua PayOS</small>':r='<small style="color: var(--text-secondary); display: block; margin-top: 0.25rem;">Thanh toán tự động</small>'):e.status==="awaiting_approval"?(a="badge-warning",o="⏳ Chờ thanh toán"):e.status==="rejected"?(a="badge-danger",o="✗ Đã từ chối"):(a="badge-warning",o="⏳ Chờ thanh toán"),n+=`
            <div class="order-card">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">${e.productName}</h3>
                        <span class="badge ${a}">${o}</span>
                        ${r}
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.25rem; font-weight: 700; color: var(--primary);">
                            ${parseInt(e.price||0).toLocaleString("vi-VN")}đ
                        </div>
                    </div>
                </div>

                <div style="display: grid; gap: 0.5rem; margin-bottom: 1rem;">
                    <div class="order-detail">
                        <strong>Người nhận:</strong>
                        <span>${e.recipientName}</span>
                    </div>
                    <div class="order-detail">
                        <strong>Lời nhắn:</strong>
                        <span>${e.message?e.message.substring(0,80):""}${e.message&&e.message.length>80?"...":""}</span>
                    </div>
                    <div class="order-detail">
                        <strong>Nội dung CK:</strong>
                        <span style="font-family: monospace; font-weight: 600; color: var(--primary);">${e.paymentContent||"N/A"}</span>
                    </div>
                    <div class="order-detail">
                        <strong>Thời gian:</strong>
                        <span>${te(e.createdAt)}</span>
                    </div>
                    ${e.status==="paid"&&e.paidAt?`
                    <div class="order-detail">
                        <strong>Thanh toán lúc:</strong>
                        <span>${te(e.paidAt)}</span>
                    </div>
                    `:""}
                </div>

                <div class="order-actions" style="display: flex; gap: 0.75rem;">
                    <button class="btn btn-danger delete-order-btn" data-id="${e.id}" style="flex: 1;">Xóa</button>
                </div>
            </div>
        `}),L.innerHTML=n}function Pe(t){if(t.length===0){x.innerHTML='<p class="loading-text" style="padding: 2rem; text-align: center;">Chưa có sản phẩm nào.</p>';return}t.sort((e,a)=>e.collection<a.collection?1:e.collection>a.collection?-1:0);let n=`
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
    `;t.forEach(e=>{const a=e.collection==="gifts"?'<span class="badge badge-success">Gift</span>':'<span class="badge" style="background: #dbeafe; color: #1e40af;">Memory</span>',o=e.effect?e.effect.replace(/_/g," ").toUpperCase():"N/A";n+=`
            <tr>
                <td>
                    <div class="product-name-cell">
                        <img src="${e.imageUrl||e.image}" alt="${e.name}" class="product-thumb">
                        <div>
                            <div class="product-name">${e.name}</div>
                        </div>
                    </div>
                </td>
                <td>${a}</td>
                <td>${parseInt(e.price).toLocaleString("vi-VN")}đ</td>
                <td style="font-size: 0.9rem; color: var(--primary); font-weight: 500;">${o}</td>
                <td class="actions-cell">
                    <button class="btn btn-primary edit-product-btn" data-id="${e.id}" data-collection="${e.collection}">Sửa</button>
                    <button class="btn btn-danger delete-product-btn" data-id="${e.id}" data-collection="${e.collection}">Xóa</button>
                </td>
            </tr>
        `}),n+=`
            </tbody>
        </table>
    `,x.innerHTML=n}function He(){document.querySelectorAll(".tab-content").forEach(t=>t.classList.remove("active")),be.classList.add("active"),T&&T.classList.remove("active"),P(D)}function qe(){document.querySelectorAll(".tab-content").forEach(t=>t.classList.remove("active")),Ee.classList.add("active"),document.querySelectorAll(".tab-btn").forEach(t=>t.classList.remove("active")),Le.classList.add("active"),N()}function Ke(){document.querySelectorAll(".tab-content").forEach(t=>t.classList.remove("active")),_&&_.classList.add("active"),document.querySelectorAll(".tab-btn").forEach(t=>t.classList.remove("active")),xe.classList.add("active"),me()}function Ge(){document.querySelectorAll(".tab-content").forEach(t=>t.classList.remove("active")),Y&&Y.classList.add("active"),document.querySelectorAll(".tab-btn").forEach(t=>t.classList.remove("active")),Be.classList.add("active"),ge()}async function je(){document.querySelectorAll(".tab-content").forEach(t=>t.classList.remove("active")),T&&T.classList.add("active"),document.querySelectorAll(".tab-btn").forEach(t=>t.classList.remove("active")),Ie.classList.add("active"),await he(),K()}async function ge(){const t=(f==null?void 0:f.value)||k();ze();try{const n=await l.collection("memories").where("status","==","paid").get(),e=[];n.forEach(o=>{const r=o.data();e.push({id:o.id,...r})}),e.sort((o,r)=>{if(!o.createdAt||!r.createdAt)return 0;const c=o.createdAt.toDate?o.createdAt.toDate().getTime():0;return(r.createdAt.toDate?r.createdAt.toDate().getTime():0)-c});const a=Re(e);t===k()?Ue(a[t]||[]):Xe(t,a[t]||[]),_e(a)}catch(n){console.error("Lỗi khi tải dữ liệu doanh thu:",n),V.innerHTML='<p style="text-align: center; color: var(--danger);">Không thể tải dữ liệu doanh thu</p>'}}function k(){const t=new Date;return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}`}function Re(t){const n={};return t.forEach(e=>{if(e.createdAt&&typeof e.createdAt.toDate=="function"){const a=e.createdAt.toDate(),o=`${a.getFullYear()}-${String(a.getMonth()+1).padStart(2,"0")}`;n[o]||(n[o]=[]),n[o].push(e)}}),n}function ze(){if(!f)return;const t=new Date,n=[];for(let e=0;e<12;e++){const a=new Date(t.getFullYear(),t.getMonth()-e,1),o=`${a.getFullYear()}-${String(a.getMonth()+1).padStart(2,"0")}`,r=a.toLocaleDateString("vi-VN",{year:"numeric",month:"long"});n.push(`<option value="${o}">${r}</option>`)}f.innerHTML=n.join("")}function Ue(t){let n=0,e=t.length;t.forEach(a=>{n+=parseInt(a.price)||0}),V.innerHTML=`
        <div class="stat-card success">
            <div class="stat-label">Doanh thu tháng này</div>
            <div class="stat-value">${n.toLocaleString("vi-VN")}đ</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Số đơn hàng</div>
            <div class="stat-value">${e}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Trung bình/đơn</div>
            <div class="stat-value">${e>0?Math.round(n/e).toLocaleString("vi-VN"):0}đ</div>
        </div>
    `,ue(t)}function Xe(t,n){let e=0;n.forEach(a=>{e+=parseInt(a.price)||0}),V.innerHTML=`
        <div class="stat-card success">
            <div class="stat-label">Doanh thu tháng</div>
            <div class="stat-value">${e.toLocaleString("vi-VN")}đ</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Số đơn hàng</div>
            <div class="stat-value">${n.length}</div>
        </div>
    `,ue(n)}function ue(t){if(t.length===0){Q.innerHTML='<p style="text-align: center; color: var(--text-light);">Không có đơn hàng nào.</p>';return}let n='<div style="display: grid; gap: 1rem;">';t.forEach(e=>{const a=e.createdAt&&typeof e.createdAt.toDate=="function"?e.createdAt.toDate().toLocaleDateString("vi-VN"):"N/A";n+=`
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg); border-radius: 8px;">
                <div>
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">${e.productName}</div>
                    <div style="font-size: 0.875rem; color: var(--text-light);">
                        ${e.recipientName} • ${a}
                    </div>
                </div>
                <div style="font-weight: 700; color: var(--success); font-size: 1.1rem;">
                    ${parseInt(e.price).toLocaleString("vi-VN")}đ
                </div>
            </div>
        `}),n+="</div>",Q.innerHTML=n}function _e(t){const n=Object.keys(t).sort().reverse();if(n.length===0){W.innerHTML='<p style="text-align: center; color: var(--text-light);">Chưa có dữ liệu.</p>';return}let e='<div style="display: grid; gap: 1rem;">';n.forEach(a=>{const o=t[a];let r=0;o.forEach(I=>{r+=parseInt(I.price)||0});const[c,s]=a.split("-"),u=new Date(parseInt(c),parseInt(s)-1).toLocaleDateString("vi-VN",{year:"numeric",month:"long"}),b=a===k();e+=`
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.25rem; background: ${b?"rgba(99, 102, 241, 0.1)":"var(--bg)"}; border-radius: 8px; border: ${b?"2px solid var(--primary)":"none"};">
                <div>
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">
                        ${u} ${b?'<span style="color: var(--primary); font-size: 0.875rem;">(Hiện tại)</span>':""}
                    </div>
                    <div style="font-size: 0.875rem; color: var(--text-light);">
                        ${o.length} đơn hàng
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 700; color: var(--success); font-size: 1.25rem;">
                        ${r.toLocaleString("vi-VN")}đ
                    </div>
                </div>
            </div>
        `}),e+="</div>",W.innerHTML=e}async function me(){B.innerHTML='<p class="loading-text">Đang tải đơn hàng...</p>';try{const t=await l.collection("gift_orders").orderBy("createdAt","desc").get(),n=[];t.forEach(e=>{n.push({id:e.id,...e.data()})}),Ye(n)}catch(t){console.error("Lỗi khi tải đơn hàng gift:",t),B.innerHTML='<p class="loading-text">Không thể tải đơn hàng. Vui lòng thử lại.</p>'}}function Ye(t){if(t.length===0){B.innerHTML='<p class="loading-text">Chưa có đơn hàng nào.</p>';return}let n="";t.forEach(e=>{const a=e.createdAt&&typeof e.createdAt.toDate=="function"?e.createdAt.toDate().toLocaleDateString("vi-VN",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}):"N/A";n+=`
            <div class="order-card">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">${e.productName||"Sản phẩm Gift"}</h3>
                        <span class="badge badge-success">Đơn Gift</span>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.25rem; font-weight: 700; color: var(--primary);">
                            ${parseInt(e.price||0).toLocaleString("vi-VN")}đ
                        </div>
                    </div>
                </div>

                <div style="display: grid; gap: 0.5rem; margin-bottom: 1rem;">
                    <div class="order-detail">
                        <strong>Tên khách hàng:</strong>
                        <span>${e.customerName||"N/A"}</span>
                    </div>
                    <div class="order-detail">
                        <strong>Số điện thoại:</strong>
                        <span>${e.phoneNumber||"N/A"}</span>
                    </div>
                    <div class="order-detail">
                        <strong>Địa chỉ:</strong>
                        <span>${e.address||"N/A"}</span>
                    </div>
                    <div class="order-detail">
                        <strong>Số lượng:</strong>
                        <span>${e.quantity||1}</span>
                    </div>
                    <div class="order-detail">
                        <strong>Ghi chú:</strong>
                        <span>${e.note?e.note.substring(0,100):"Không có"}${e.note&&e.note.length>100?"...":""}</span>
                    </div>
                    <div class="order-detail">
                        <strong>Thời gian đặt:</strong>
                        <span>${a}</span>
                    </div>
                </div>

                <div class="order-actions" style="display: flex; gap: 0.75rem;">
                    <button class="btn btn-danger delete-gift-order-btn" data-id="${e.id}" style="flex: 1;">Xóa</button>
                </div>
            </div>
        `}),B.innerHTML=n}async function N(){x.innerHTML='<p class="loading-text">Đang tải sản phẩm...</p>';try{const t=await l.collection("gifts").get(),n=await l.collection("memories_products").get(),e=[];t.forEach(a=>{e.push({id:a.id,collection:"gifts",...a.data()})}),n.forEach(a=>{e.push({id:a.id,collection:"memories_products",...a.data()})}),Pe(e)}catch(t){console.error("Lỗi khi tải sản phẩm:",t),x.innerHTML='<p class="loading-text">Không thể tải sản phẩm.</p>'}}function P(t){E&&E(),L.innerHTML='<p class="loading-text">Đang tải đơn hàng...</p>';const n=t==="memory"?"memories":"gift_orders";E=l.collection(n).orderBy("createdAt","desc").onSnapshot(a=>{const o=[];a.forEach(r=>{o.push({id:r.id,...r.data()})}),Ne(o)},a=>{console.error("Lỗi khi tải đơn hàng:",a),L.innerHTML='<p class="loading-text">Không thể tải đơn hàng. Vui lòng thử lại.</p>'})}function Qe(t){const n=t.target;if(!n.classList.contains("tab-btn"))return;const e=n.dataset.tab;document.querySelectorAll(".tab-btn").forEach(a=>a.classList.remove("active")),n.classList.add("active"),e==="orders"?He():e==="products"?qe():e==="gift-orders"?Ke():e==="revenue"?Ge():e==="theme"&&je()}function We(t){const n=t.target;if(!n.classList.contains("sub-tab-btn"))return;const e=n.dataset.orderType;e&&(document.querySelectorAll(".sub-tab-btn").forEach(a=>a.classList.remove("active")),n.classList.add("active"),D=e,P(D))}function Je(t){const n=t.target;if(n.classList.contains("delete-order-btn")){if(v=n.dataset.id,!v)return;Se.textContent=v.slice(0,12)+"...",H(!0)}}function Ze(t){const e=t.target.closest(".btn");if(e){if(e.classList.contains("edit-product-btn")){if(g=e.dataset.id,i=e.dataset.collection,!g||!i)return;l.collection(i).doc(g).get().then(a=>{if(a.exists){const o=a.data();de.textContent="Sửa sản phẩm",se.value=o.name,ie.value=o.price,le.value=o.imageUrl||o.image||"";const r=document.getElementById("productCollection"),c=document.getElementById("productEffect");r&&(r.value=i),c&&(c.value=o.effect||"love"),A(!0)}})}if(e.classList.contains("delete-product-btn")){if(y=e.dataset.id,i=e.dataset.collection,!y||!i)return;l.collection(i).doc(y).get().then(a=>{a.exists&&(De.textContent=a.data().name,q(!0))})}}}function et(t){const n=t.target;if(n.classList.contains("delete-gift-order-btn")){const e=n.dataset.id;if(!e)return;confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")&&tt(e)}}async function tt(t){try{await l.collection("gift_orders").doc(t).delete(),me()}catch(n){console.error("Lỗi khi xóa đơn hàng:",n),alert("Không thể xóa đơn hàng. Vui lòng thử lại.")}}function H(t){t?J.classList.add("active"):J.classList.remove("active")}function A(t){t?Z.classList.add("active"):Z.classList.remove("active")}function q(t){t?ee.classList.add("active"):ee.classList.remove("active")}async function nt(){if(v){h.disabled=!0,h.textContent="Đang xóa...";try{await l.collection("memories").doc(v).delete(),H(!1),v=null,h.disabled=!1,h.textContent="Xóa"}catch(t){console.error("Lỗi khi xóa đơn hàng:",t),alert("Không thể xóa đơn hàng. Vui lòng thử lại."),h.disabled=!1,h.textContent="Xóa"}}}async function at(t){var u,b,I,G,j;t.preventDefault();const n=se.value.trim(),e=ie.value,a=((u=document.getElementById("productCollection"))==null?void 0:u.value)||"gifts",o=((b=document.getElementById("productEffect"))==null?void 0:b.value)||"love",r=(I=document.querySelector('input[name="imageInputType"]:checked'))==null?void 0:I.value,c=(j=(G=document.getElementById("productImageFile"))==null?void 0:G.files)==null?void 0:j[0],s=le.value.trim();if(!n||!e||!o){alert("Vui lòng điền đầy đủ thông tin!");return}if(r==="upload"&&!c&&!g){alert("Vui lòng chọn hình ảnh!");return}if(r==="url"&&!s){alert("Vui lòng nhập URL hình ảnh!");return}try{let w=s;if(r==="upload"&&c){const pe=`products/${Date.now()}_${c.name}`,z=ve.ref().child(pe);await z.put(c),w=await z.getDownloadURL()}const C={name:n,price:parseInt(e),imageUrl:w,effect:o,updatedAt:new Date().toISOString()};g||(C.createdAt=new Date().toISOString()),g&&i?await l.collection(i).doc(g).update(C):await l.collection(a).add(C),A(!1),O.reset(),g=null,i=null;const R=document.getElementById("imagePreview");R&&(R.style.display="none"),N(),alert("Sản phẩm đã được lưu thành công!")}catch(w){console.error("Lỗi khi lưu sản phẩm:",w),alert("Không thể lưu sản phẩm. Vui lòng thử lại.")}}async function ot(){if(!(!y||!i)){p.disabled=!0,p.textContent="Đang xóa...";try{await l.collection(i).doc(y).delete(),q(!1),y=null,i=null,p.disabled=!1,p.textContent="Xóa",N()}catch(t){console.error("Lỗi khi xóa sản phẩm:",t),alert("Không thể xóa sản phẩm. Vui lòng thử lại."),p.disabled=!1,p.textContent="Xóa"}}}async function he(){try{const t=await l.collection("settings").doc("theme").get();if(t.exists){const n=t.data();d=(n==null?void 0:n.currentTheme)||"spring"}else d="spring";F.textContent=$[d],S(d),K()}catch(t){console.error("Lỗi khi load theme:",t),d="spring",F.textContent=$[d],S(d)}}function K(){document.querySelectorAll(".theme-option").forEach(t=>{t.dataset.theme===d?t.classList.add("selected"):t.classList.remove("selected")})}async function rt(){m.disabled=!0,m.textContent="Đang lưu...";try{await l.collection("settings").doc("theme").set({currentTheme:d,updatedAt:firebase.firestore.FieldValue.serverTimestamp()}),alert("Theme đã được lưu thành công!"),S(d),m.disabled=!1,m.textContent="Lưu theme"}catch(t){console.error("Lỗi khi lưu theme:",t),alert("Không thể lưu theme. Vui lòng thử lại."),m.disabled=!1,m.textContent="Lưu theme"}}ce.addEventListener("submit",Ve);ye.addEventListener("click",Oe);we.addEventListener("click",Qe);L.addEventListener("click",Je);x.addEventListener("click",Ze);B.addEventListener("click",et);document.querySelectorAll(".theme-option").forEach(t=>{t.addEventListener("click",()=>{d=t.dataset.theme||"spring",F.textContent=$[d],K()})});m.addEventListener("click",rt);f&&f.addEventListener("change",ge);Te.addEventListener("click",()=>{g=null,i=null,de.textContent="Thêm sản phẩm mới",O.reset();const t=document.getElementById("productCollection");t&&(t.value="gifts"),A(!0)});O.addEventListener("submit",at);Ae.addEventListener("click",()=>{A(!1),g=null});h.addEventListener("click",nt);Ce.addEventListener("click",()=>{H(!1),v=null});p.addEventListener("click",ot);Fe.addEventListener("click",()=>{q(!1),y=null});const ne=document.querySelector(".sub-tabs-container");ne&&ne.addEventListener("click",We);const ct=document.querySelectorAll('input[name="imageInputType"]');ct.forEach(t=>{t.addEventListener("change",n=>{const e=n.target,a=document.getElementById("imageUploadContainer"),o=document.getElementById("imageUrlContainer");e.value==="upload"?(a&&(a.style.display="block"),o&&(o.style.display="none")):(a&&(a.style.display="none"),o&&(o.style.display="block"))})});const ae=document.getElementById("productImageFile");ae&&ae.addEventListener("change",t=>{var a;const e=(a=t.target.files)==null?void 0:a[0];if(e){const o=new FileReader;o.onload=r=>{var u;const c=document.getElementById("previewImg"),s=document.getElementById("imagePreview");c&&s&&((u=r.target)!=null&&u.result)&&(c.src=r.target.result,s.style.display="block")},o.readAsDataURL(e)}});document.addEventListener("DOMContentLoaded",()=>{$e()});
