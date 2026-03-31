/**
 * Interactive Features Script for OpenRise
 * Adds Premium SaaS-like visual interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    init3DTilt();
    initCardGlow();
    initScrollReveal();
    initReels();
    initLogoDraggable();
});

// 1. Interactive Reels Module for Hero
function initReels() {
    const reels = document.querySelectorAll('.reel-card');
    if (!reels.length) return;
    
    let currentIndex = 0;
    const updateReels = () => {
        reels.forEach((reel, i) => {
            reel.classList.remove('active', 'next', 'prev', 'hidden');
            if (i === currentIndex) {
                reel.classList.add('active');
            } else if (i === (currentIndex + 1) % reels.length) {
                reel.classList.add('next');
            } else if (i === (currentIndex - 1 + reels.length) % reels.length) {
                reel.classList.add('prev');
            } else {
                reel.classList.add('hidden');
            }
        });
    };
    
    document.querySelector('.reel-next')?.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % reels.length;
        updateReels();
    });
    
    document.querySelector('.reel-prev')?.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + reels.length) % reels.length;
        updateReels();
    });
    
    // Auto play
    setInterval(() => {
        currentIndex = (currentIndex + 1) % reels.length;
        updateReels();
    }, 4000);
    
    updateReels();
}

// 2. Scroll Progress Bar
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrollPercentage + '%';
    });
}

// 3. Lightweight 3D Tilt Effect
function init3DTilt() {
    const tiltElements = document.querySelectorAll('.card, .problem-card, .why-image, .bento-item, .premium-solution-card, .interactive-card, .mock-ui-card');
    
    if (window.matchMedia("(pointer: coarse)").matches) return; // Disable on mobile/touch

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Adjust divisor to change rotation intensity (higher = less tilt)
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            el.style.zIndex = '10';
            el.style.transition = 'none'; // remove generic transition during move
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            el.style.zIndex = '1';
            el.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
        
        el.addEventListener('mouseenter', () => {
            el.style.transition = 'all 0.1s ease';
        });
    });
}

// 4. Dynamic Glow Hover (Glassmorphism effect)
function initCardGlow() {
    const cards = document.querySelectorAll('.card, .problem-card, .bento-item, .premium-solution-card, .interactive-card, .mock-ui-card');
    
    if (window.matchMedia("(pointer: coarse)").matches) return;

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// 5. Scroll Reveal for Animations
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.classList.contains('solutions-premium-grid')) {
                    const cards = entry.target.querySelectorAll('.premium-solution-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => card.classList.add('active'), index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .animate-on-scroll, .solutions-premium-grid, .timeline-spine').forEach(el => {
        observer.observe(el);
    });
}

// 6. Draggable Logo Slider (Grab to scroll)
function initLogoDraggable() {
    const slider = document.getElementById('logo-slider');
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        slider.style.scrollBehavior = 'auto'; // Disable smooth scroll while dragging
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
        slider.style.scrollBehavior = 'smooth';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed
        slider.scrollLeft = scrollLeft - walk;
    });
}
