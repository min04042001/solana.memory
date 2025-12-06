import"./modulepreload-polyfill-B5Qt9EMX.js";const g={apiKey:"AIzaSyBMXv_8dYkYf9IvClrIRLK5USdJjD66Qf4",authDomain:"gift-aa09e.firebaseapp.com",projectId:"gift-aa09e",storageBucket:"gift-aa09e.firebasestorage.app",messagingSenderId:"905741943305",appId:"1:905741943305:web:8cd498eda1e3c5ad792ed8",measurementId:"G-KT4MWKFZ8V"};firebase.apps.length||firebase.initializeApp(g);const m=firebase.firestore(),l=document.getElementById("loadingContainer"),f=document.getElementById("errorContainer"),t=document.getElementById("effectContainer");async function c(){const a=window.location.pathname.match(/^\/p\/([^\/]+)\/([^\/]+)/);if(!a){o();return}const[,s,d]=a;try{let i=null;const n=await m.collection("gifts").doc(s).get();if(n.exists&&n.data().slug===d&&(i={id:n.id,collection:"gifts",...n.data()}),!i){const r=await m.collection("memories_products").doc(s).get();r.exists&&r.data().slug===d&&(i={id:r.id,collection:"memories_products",...r.data()})}if(!i){o();return}document.title=`${i.name} - Solana.Memory`,h(i)}catch(i){console.error("Error loading product:",i),o()}}function o(){l.style.display="none",f.style.display="flex"}function h(e){switch(l.style.display="none",t.style.display="block",e.effect){case"love":p(e);break;case"mothers_day":b(e);break;case"birthday":y(e);break;case"anniversary":v(e);break;case"graduation":x(e);break;case"thank_you":u(e);break;case"custom_1":w(e);break;case"custom_2":z(e);break;default:k(e)}}function p(e){t.innerHTML=`
        <div style="min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; justify-content: center; align-items: center; padding: 2rem; position: relative; overflow: hidden;">
            <div class="hearts-bg"></div>
            <div style="text-align: center; color: white; max-width: 600px; z-index: 1; animation: fadeInUp 1s ease;">
                <h1 style="font-size: 3.5rem; margin-bottom: 1rem; text-shadow: 0 4px 20px rgba(0,0,0,0.3);">💖</h1>
                <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem;">${e.name}</h2>
                <p style="font-size: 1.3rem; line-height: 1.8; margin-bottom: 2rem; opacity: 0.95;">${e.description||"Một món quà đặc biệt dành tặng cho bạn! ❤️"}</p>
                <div style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); padding: 1.5rem; border-radius: 16px; margin-top: 2rem;">
                    <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Giá trị món quà:</p>
                    <p style="font-size: 2rem; font-weight: 700;">${e.price.toLocaleString("vi-VN")}đ</p>
                </div>
            </div>
            <style>
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .hearts-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    pointer-events: none;
                }
                .hearts-bg::before,
                .hearts-bg::after {
                    content: '💖';
                    position: absolute;
                    font-size: 3rem;
                    animation: float 8s infinite;
                    opacity: 0.3;
                }
                .hearts-bg::before {
                    top: 20%;
                    left: 10%;
                    animation-delay: 0s;
                }
                .hearts-bg::after {
                    top: 60%;
                    right: 10%;
                    animation-delay: 4s;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(10deg); }
                }
            </style>
        </div>
    `}function b(e){t.innerHTML=`
        <div style="min-height: 100vh; background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); display: flex; justify-content: center; align-items: center; padding: 2rem;">
            <div style="text-align: center; color: #4a1e1e; max-width: 600px; animation: fadeInUp 1s ease;">
                <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">🌹</h1>
                <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem;">Chúc Mừng Ngày của Mẹ</h2>
                <p style="font-size: 1.5rem; margin-bottom: 1rem; font-weight: 600;">${e.name}</p>
                <p style="font-size: 1.2rem; line-height: 1.8; margin-bottom: 2rem;">${e.description||"Món quà tình yêu dành tặng Mẹ yêu!"}</p>
                <div style="background: rgba(255,255,255,0.7); padding: 1.5rem; border-radius: 16px;">
                    <p style="font-size: 2rem; font-weight: 700; color: #d63384;">${e.price.toLocaleString("vi-VN")}đ</p>
                </div>
            </div>
        </div>
    `}function y(e){t.innerHTML=`
        <div style="min-height: 100vh; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); display: flex; justify-content: center; align-items: center; padding: 2rem; position: relative; overflow: hidden;">
            <div class="confetti"></div>
            <div style="text-align: center; color: white; max-width: 600px; z-index: 1; animation: fadeInUp 1s ease;">
                <h1 style="font-size: 4rem; margin-bottom: 1rem;">🎂🎉</h1>
                <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">Chúc Mừng Sinh Nhật!</h2>
                <p style="font-size: 1.5rem; margin-bottom: 1rem; font-weight: 600;">${e.name}</p>
                <p style="font-size: 1.2rem; line-height: 1.8; margin-bottom: 2rem;">${e.description||"Chúc bạn tuổi mới hạnh phúc, thành công và luôn tươi trẻ! 🎈"}</p>
                <div style="background: rgba(255,255,255,0.9); padding: 1.5rem; border-radius: 16px; color: #333;">
                    <p style="font-size: 2rem; font-weight: 700;">${e.price.toLocaleString("vi-VN")}đ</p>
                </div>
            </div>
            <style>
                .confetti {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }
                .confetti::before,
                .confetti::after {
                    content: '🎊';
                    position: absolute;
                    font-size: 2rem;
                    animation: fall 3s linear infinite;
                }
                .confetti::before {
                    left: 20%;
                    animation-delay: 0s;
                }
                .confetti::after {
                    right: 20%;
                    animation-delay: 1.5s;
                }
                @keyframes fall {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                    }
                }
            </style>
        </div>
    `}function v(e){t.innerHTML=`
        <div style="min-height: 100vh; background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); border: 3px solid #d4af37; display: flex; justify-content: center; align-items: center; padding: 2rem;">
            <div style="text-align: center; color: #d4af37; max-width: 600px; animation: fadeInUp 1s ease;">
                <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">💍✨</h1>
                <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem;">Kỷ Niệm Đáng Nhớ</h2>
                <p style="font-size: 1.5rem; margin-bottom: 1rem; font-weight: 600; color: white;">${e.name}</p>
                <p style="font-size: 1.2rem; line-height: 1.8; margin-bottom: 2rem; color: #ecf0f1;">${e.description||"Món quà kỷ niệm đặc biệt cho những khoảnh khắc đáng nhớ!"}</p>
                <div style="background: rgba(212,175,55,0.2); border: 2px solid #d4af37; padding: 1.5rem; border-radius: 16px;">
                    <p style="font-size: 2rem; font-weight: 700;">${e.price.toLocaleString("vi-VN")}đ</p>
                </div>
            </div>
        </div>
    `}function x(e){t.innerHTML=`
        <div style="min-height: 100vh; background: linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%); display: flex; justify-content: center; align-items: center; padding: 2rem;">
            <div style="text-align: center; color: white; max-width: 600px; animation: fadeInUp 1s ease;">
                <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">🎓🎊</h1>
                <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">Chúc Mừng Tốt Nghiệp!</h2>
                <p style="font-size: 1.5rem; margin-bottom: 1rem; font-weight: 600;">${e.name}</p>
                <p style="font-size: 1.2rem; line-height: 1.8; margin-bottom: 2rem;">${e.description||"Chúc mừng bạn đã hoàn thành chặng đường học tập! Chúc bạn thành công rực rỡ! 🌟"}</p>
                <div style="background: rgba(255,255,255,0.9); padding: 1.5rem; border-radius: 16px; color: #333;">
                    <p style="font-size: 2rem; font-weight: 700;">${e.price.toLocaleString("vi-VN")}đ</p>
                </div>
            </div>
        </div>
    `}function u(e){t.innerHTML=`
        <div style="min-height: 100vh; background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); display: flex; justify-content: center; align-items: center; padding: 2rem;">
            <div style="text-align: center; color: #1a5a6a; max-width: 600px; animation: fadeInUp 1s ease;">
                <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">🙏💚</h1>
                <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem;">Cảm Ơn!</h2>
                <p style="font-size: 1.5rem; margin-bottom: 1rem; font-weight: 600;">${e.name}</p>
                <p style="font-size: 1.2rem; line-height: 1.8; margin-bottom: 2rem;">${e.description||"Lời cảm ơn chân thành từ trái tim!"}</p>
                <div style="background: rgba(255,255,255,0.8); padding: 1.5rem; border-radius: 16px;">
                    <p style="font-size: 2rem; font-weight: 700;">${e.price.toLocaleString("vi-VN")}đ</p>
                </div>
            </div>
        </div>
    `}function w(e){t.innerHTML=`
        <div style="min-height: 100vh; background: #000; display: flex; justify-content: center; align-items: center; padding: 2rem; position: relative; overflow: hidden;">
            <div class="stars"></div>
            <div style="text-align: center; color: #d4af37; max-width: 600px; z-index: 1; animation: fadeInUp 1s ease; border: 2px solid #d4af37; padding: 3rem; border-radius: 16px; background: rgba(0,0,0,0.5); backdrop-filter: blur(10px);">
                <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">✨⭐</h1>
                <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem;">Custom Animation</h2>
                <p style="font-size: 1.5rem; margin-bottom: 1rem; font-weight: 600; color: white;">${e.name}</p>
                <p style="font-size: 1.2rem; line-height: 1.8; margin-bottom: 2rem; color: #e0e0e0;">${e.description||"Hiệu ứng đặc biệt tùy chỉnh!"}</p>
                <div style="background: rgba(212,175,55,0.2); border: 2px solid #d4af37; padding: 1.5rem; border-radius: 16px;">
                    <p style="font-size: 2rem; font-weight: 700;">${e.price.toLocaleString("vi-VN")}đ</p>
                </div>
            </div>
            <style>
                .stars {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                }
                .stars::before,
                .stars::after {
                    content: '✨';
                    position: absolute;
                    font-size: 2rem;
                    animation: twinkle 2s infinite;
                    color: #d4af37;
                }
                .stars::before {
                    top: 20%;
                    left: 15%;
                }
                .stars::after {
                    top: 70%;
                    right: 15%;
                    animation-delay: 1s;
                }
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
            </style>
        </div>
    `}function z(e){t.innerHTML=`
        <div style="min-height: 100vh; background: linear-gradient(45deg, #ff6b6b, #ee5a6f, #c44569); display: flex; justify-content: center; align-items: center; padding: 2rem;">
            <div style="text-align: center; color: white; max-width: 600px; animation: fadeInUp 1s ease; background: rgba(0,0,0,0.3); padding: 3rem; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">🎨🌈</h1>
                <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">Custom Design</h2>
                <p style="font-size: 1.5rem; margin-bottom: 1rem; font-weight: 600;">${e.name}</p>
                <p style="font-size: 1.2rem; line-height: 1.8; margin-bottom: 2rem;">${e.description||"Thiết kế độc đáo chỉ dành riêng cho bạn!"}</p>
                <div style="background: rgba(255,255,255,0.9); padding: 1.5rem; border-radius: 16px; color: #c44569;">
                    <p style="font-size: 2rem; font-weight: 700;">${e.price.toLocaleString("vi-VN")}đ</p>
                </div>
            </div>
        </div>
    `}function k(e){t.innerHTML=`
        <div style="min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; justify-content: center; align-items: center; padding: 2rem;">
            <div style="text-align: center; color: white; max-width: 600px; animation: fadeInUp 1s ease;">
                <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">🎁</h1>
                <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem;">${e.name}</h2>
                <p style="font-size: 1.2rem; line-height: 1.8; margin-bottom: 2rem;">${e.description||"Một món quà đặc biệt dành tặng cho bạn!"}</p>
                <div style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); padding: 1.5rem; border-radius: 16px;">
                    <p style="font-size: 2rem; font-weight: 700;">${e.price.toLocaleString("vi-VN")}đ</p>
                </div>
            </div>
        </div>
    `}c();
