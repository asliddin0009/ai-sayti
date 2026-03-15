document.addEventListener('DOMContentLoaded', () => {
    
    // --- Audio Controls ---
    const bgMusic = document.getElementById('bgMusic');
    const clickSound = document.getElementById('clickSound');
    const audioToggle = document.getElementById('audioToggle');
    
    if (bgMusic && clickSound && audioToggle) {
        bgMusic.volume = 0.2; // Background music should be very subtle
        clickSound.volume = 0.5;

        // Check user preference
        let isMusicPlaying = localStorage.getItem('musicPlaying') === 'true';

        const updateAudioIcon = () => {
            if (isMusicPlaying) {
                audioToggle.innerHTML = '<i class="ph-fill ph-speaker-high"></i>';
                audioToggle.style.color = 'var(--primary-neon)';
                audioToggle.style.borderColor = 'var(--primary-neon)';
            } else {
                audioToggle.innerHTML = '<i class="ph-fill ph-speaker-slash"></i>';
                audioToggle.style.color = 'var(--text-main)';
                audioToggle.style.borderColor = 'var(--card-border)';
            }
        };

        const toggleMusic = () => {
            if (isMusicPlaying) {
                bgMusic.pause();
                isMusicPlaying = false;
            } else {
                bgMusic.play().catch(e => console.log("Can't auto-play audio yet"));
                isMusicPlaying = true;
            }
            localStorage.setItem('musicPlaying', isMusicPlaying);
            updateAudioIcon();
        };

        // Try to play if it was previously playing
        if (isMusicPlaying) {
             // Browsers block autoplay until user interaction, so we might need to wait for a click anywhere
             let playAttempt = setInterval(() => {
                 bgMusic.play()
                     .then(() => {
                         clearInterval(playAttempt);
                     })
                     .catch(error => {
                         // Waiting for user interaction
                     });
             }, 1000);
        }
        updateAudioIcon();

        // Mute/Unmute button click
        audioToggle.addEventListener('click', toggleMusic);

        // Click sound for all buttons and links
        const clickableLinks = document.querySelectorAll('a, button');
        clickableLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMusicPlaying) {
                    clickSound.currentTime = 0;
                    clickSound.play().catch(e => {});
                }
            });
        });
    }

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Main Card Floating Animation (if present) ---
    const mainCard = document.querySelector('.main-card');
    if (mainCard) {
        let float = 0;
        setInterval(() => {
            float += 0.05;
            const yOffset = Math.sin(float) * 10;
            if(!mainCard.matches(':hover')) {
                mainCard.style.transform = `perspective(1000px) rotateY(-5deg) rotateX(5deg) translateY(${yOffset}px)`;
            }
        }, 50);
    }
    
    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Mobile Menu Toggle ---
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if(navLinks.classList.contains('active')) {
                icon.classList.replace('ph-list', 'ph-x');
            } else {
                icon.classList.replace('ph-x', 'ph-list');
            }
        });
    }

    // --- Navbar Background on Scroll ---
    const navbar = document.querySelector('.navbar');
    if (navbar && !navbar.classList.contains('solid')) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(5, 13, 9, 0.9)';
            } else {
                navbar.style.background = 'rgba(11, 26, 18, 0.6)';
            }
        });
    }

    // --- Contact Form to Telegram ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            btn.innerHTML = '<i class="ph ph-spinner-gap" style="animation: spin 1s linear infinite"></i> Yuborilmoqda...';
            btn.style.opacity = '0.8';
            btn.style.pointerEvents = 'none';

            // Telegram Bot Ma'lumotlari
            // DIQQAT: Bot Token va Chat ID larni shu yerga yozing
            const botToken = '8058737012:AAGno82otQmkCE0TonT8XYowNDwkULF6mgE'; // Masalan, '123456789:ABCdefGHIjklmNOPqrSTuvwXYZ'
            const chatId = '5620115571';     // Masalan, '123456789'

            // Form elementlarini olish
            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            
            const selectElement = contactForm.querySelector('select');
            const subject = selectElement.options[selectElement.selectedIndex].text;
            
            const messageText = contactForm.querySelector('textarea').value;

            // Xabarni chiroyli qilib tayyorlash
            let text = `🌟 <b>Yangi xabar (Nexus AI Saytidan)</b>\n\n`;
            text += `👤 <b>Ismi:</b> ${name}\n`;
            text += `📧 <b>Email:</b> ${email}\n`;
            text += `📂 <b>Mavzu:</b> ${subject}\n\n`;
            text += `💬 <b>Xabar:</b>\n${messageText}`;

            try {
                if (botToken === 'BOT_TOKEN_SHU_YERGA' || chatId === 'CHAT_ID_SHU_YERGA') {
                    throw new Error("Bot Token yoki Chat ID ulanmagan!");
                }

                const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: text,
                        parse_mode: 'HTML'
                    })
                });

                if (!response.ok) {
                    throw new Error("Xato yuz berdi");
                }

                btn.innerHTML = '<i class="ph-fill ph-check-circle"></i> Muvaffaqiyatli yuborildi!';
                btn.classList.replace('btn-primary', 'btn-outline');
                contactForm.reset();

            } catch (error) {
                console.error('Error:', error);
                if (error.message === "Bot Token yoki Chat ID ulanmagan!") {
                     alert("Xatolik! Dasturchi hali saytga Telegram Bot ma'lumotlarini (Token, ID) ulamagan. Iltimos dasturchiga murojaat qiling.");
                } else {
                     alert("Xatolik yuz berdi, xabar yuborilmadi. Iltimos keyinroq qayta urinib ko'ring.");
                }
                
                btn.innerHTML = '<i class="ph-fill ph-x-circle"></i> Xatolik yuz berdi';
                btn.classList.replace('btn-primary', 'btn-secondary');
            }

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('btn-outline', 'btn-secondary');
                btn.classList.add('btn-primary');
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            }, 4000);
        });
    }

    // Add spin keyframes dynamically if not in css
    if(!document.getElementById('spinKeyframes')) {
        const style = document.createElement('style');
        style.id = 'spinKeyframes';
        style.textContent = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
    }
});
