document.addEventListener('DOMContentLoaded', () => {
    // ==================== 輪播圖 (Carousel) 邏輯 ====================
    const track = document.getElementById('carousel-track');
    const slides = Array.from(track.children);
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const dotsContainer = document.getElementById('carousel-dots');
    const dots = Array.from(dotsContainer.children);

    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateCarousel(index) {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        currentIndex = index;
    }

    nextBtn.addEventListener('click', () => {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= totalSlides) nextIndex = 0;
        updateCarousel(nextIndex);
    });

    prevBtn.addEventListener('click', () => {
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) prevIndex = totalSlides - 1;
        updateCarousel(prevIndex);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateCarousel(index);
        });
    });

    let autoPlay = setInterval(() => { nextBtn.click(); }, 5000);

    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
        carouselWrapper.addEventListener('mouseenter', () => clearInterval(autoPlay));
        carouselWrapper.addEventListener('mouseleave', () => {
            autoPlay = setInterval(() => { nextBtn.click(); }, 5000);
        });
    }

    // ==================== Kit 電子報訂閱 (隱形 iFrame 動態特效版) ====================
const form = document.getElementById('newsletter-form');
const iframe = document.getElementById('hidden-iframe');

if (form && iframe) {
    form.addEventListener('submit', () => {
        const emailInput = form.querySelector('input[name="email_address"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // 1. 觸發送出時，立刻播放「連線中...」動畫
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.innerHTML = '<span class="material-icons-sharp">sync</span> 連線中...';

        // 2. 監聽隱形視窗載入完成的事件（代表 Kit 已經在後台成功處理完 Email 資料）
        iframe.onload = () => {
            // 3. 顯示成功解鎖動畫
            submitBtn.style.backgroundColor = '#00ded3';
            submitBtn.style.color = '#1800ae';
            submitBtn.style.borderColor = '#00ded3';
            submitBtn.style.opacity = '1';
            submitBtn.innerHTML = '<span class="material-icons-sharp">done</span> 成功解鎖！';
            
            emailInput.value = '';
            emailInput.placeholder = '請至信箱查收確認信...';
            
            // 解除 iframe 監聽，防止重複觸發
            iframe.onload = null;
        };
    });
}
});
