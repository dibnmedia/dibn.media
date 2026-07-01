document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carousel-track');
    const slides = Array.from(track.children);
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const dotsContainer = document.getElementById('carousel-dots');
    const dots = Array.from(dotsContainer.children);

    let currentIndex = 0;
    const totalSlides = slides.length;

    // 更新輪播位置與點點狀態
    function updateCarousel(index) {
        track.style.transform = `translateX(-${index * 100}%)`;
        
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        
        currentIndex = index;
    }

    // 下一張
    nextBtn.addEventListener('click', () => {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= totalSlides) nextIndex = 0;
        updateCarousel(nextIndex);
    });

    // 上一張
    prevBtn.addEventListener('click', () => {
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) prevIndex = totalSlides - 1;
        updateCarousel(prevIndex);
    });

    // 點擊底部點點直接跳轉
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateCarousel(index);
        });
    });

    // 每 5 秒自動輪播
    let autoPlay = setInterval(() => {
        nextBtn.click();
    }, 5000);

    const carouselWrapper = document.querySelector('.carousel-wrapper');
    carouselWrapper.addEventListener('mouseenter', () => clearInterval(autoPlay));
    carouselWrapper.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => { nextBtn.click(); }, 5000);
    });

    // ==================== Kit 電子報非同步訂閱機制 ====================
    const form = document.getElementById('newsletter-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // 攔截預設表單跳轉，留在原網頁上處理

            const emailInput = form.querySelector('input[name="email_address"]');
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;

            // 鎖定按鈕，防止連續瘋狂點擊
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.innerHTML = '<span class="material-icons-sharp">sync</span> 連線中...';

            const formData = new FormData(form);

            try {
                // 送出跨域非同步請求至 Kit
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // 訂閱成功狀態
                    submitBtn.style.backgroundColor = '#00ded3';
                    submitBtn.style.color = '#1800ae';
                    submitBtn.style.borderColor = '#00ded3';
                    submitBtn.innerHTML = '<span class="material-icons-sharp">done</span> 成功解鎖！';
                    emailInput.value = '';
                    emailInput.placeholder = '請至信箱查收確認信...';
                } else {
                    throw new Error('伺服器回應錯誤');
                }

            } catch (error) {
                // 發生錯誤或連線失敗
                submitBtn.style.backgroundColor = '#ff0055';
                submitBtn.style.borderColor = '#ff0055';
                submitBtn.innerHTML = '<span class="material-icons-sharp">error</span> 發生錯誤，請稍後再試';
                
                // 3 秒後自動將按鈕恢復原狀，允許再次提交
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.borderColor = '';
                    submitBtn.innerHTML = originalBtnContent;
                }, 3000);
            }
        });
    }
});