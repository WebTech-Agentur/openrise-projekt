document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if(menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if(navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
        
        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if(menuToggle.querySelector('i')) {
                    menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
                }
            });
        });
    }

    const themeToggle = document.querySelector('#checkbox');
    const currentTheme = localStorage.getItem('theme');

    // Initialize theme
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeToggle.checked = true;
        }
    }

    // Theme toggle logic
    themeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    // Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px 50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section, .card, .team-row, .timeline-spine, .fade-in').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // Number Counter Animation for Statistics
    const countItems = document.querySelectorAll('.stat-number');
    const lang = document.documentElement.lang || 'de';
    
    const persianToLatin = (str) => {
        const persianDigits = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
        for (let i = 0; i < 10; i++) {
            str = str.replace(persianDigits[i], i);
        }
        return str;
    };

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const target = entry.target;
                const rawText = persianToLatin(target.innerText.replace(/[\.,]/g, ''));
                const finalValue = parseInt(rawText);
                
                if (isNaN(finalValue)) return;

                let current = 0;
                const duration = 2000;
                const startTime = performance.now();

                const animate = (now) => {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const val = Math.floor(eased * finalValue);
                    
                    target.innerText = val.toLocaleString(lang === 'fa' ? 'fa-IR' : (lang === 'en' ? 'en-US' : 'de-DE'));

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        target.innerText = finalValue.toLocaleString(lang === 'fa' ? 'fa-IR' : (lang === 'en' ? 'en-US' : 'de-DE'));
                        target.classList.add('counted');
                    }
                };

                requestAnimationFrame(animate);
                countObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    // Scroll Progress Bar
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const h = document.documentElement,
                  b = document.body,
                  st = 'scrollTop',
                  sh = 'scrollHeight';
            const percent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
            progressBar.style.width = percent + '%';
        });
    }

    countItems.forEach(item => countObserver.observe(item));

    // --- Cookie Consent System ---
    initCookieConsent();

    // --- Highlight Active Nav Link ---
    function highlightActiveNav() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        
        // Target only main nav links (Features, Blog, Preise/Pricing, Demo)
        // We use a selector that targets the top-level links in nav-links
        const navLinks = document.querySelectorAll('.nav-links > a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Remove active class first to be sure
            link.classList.remove('active');

            // 1. Exact match for current filename
            if (href === filename) {
                link.classList.add('active');
            }
            
            // 2. Special case for Home (index.html)
            if ((filename === 'index.html' || filename === '') && (href === 'index.html' || href === './')) {
                // Usually we don't highlight the logo, and "Home" is often only in footer.
                // But if there's a Home link in header, this would catch it.
            }

            // 3. Special case for Blog (all blog-*.html pages should highlight the Blog link)
            if (filename.includes('blog') && href.includes('blog')) {
                link.classList.add('active');
            }
        });
    }
    highlightActiveNav();
});

function initCookieConsent() {
    const lang = document.documentElement.lang || 'de';
    
    const text = {
        de: {
            title: "Datenschutz & Cookies",
            desc: "Wir verwenden Cookies und ähnliche Technologien, um Ihre Erfahrung auf unserer Website zu verbessern, den Datenverkehr zu analysieren und Ihnen personalisierte Inhalte anzubieten. Durch Klicken auf 'Alle akzeptieren' stimmen Sie der Speicherung von Cookies auf Ihrem Gerät zu.",
            acceptAll: "Alle akzeptieren",
            reject: "Nur essenzielle",
            settings: "Einstellungen",
            modalTitle: "Cookie-Einstellungen",
            essentialTitle: "Essenzielle Cookies",
            essentialDesc: "Diese Cookies sind für die grundlegende Funktionalität der Website unbedingt erforderlich und können nicht deaktiviert werden.",
            analyticsTitle: "Analyse-Cookies",
            analyticsDesc: "Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren, indem Informationen anonym gesammelt und gemeldet werden.",
            marketingTitle: "Marketing-Cookies",
            marketingDesc: "Diese Cookies werden verwendet, um Besuchern webseitenübergreifend zu folgen. Die Absicht ist, Anzeigen zu zeigen, die relevant und ansprechend für den einzelnen Benutzer sind.",
            save: "Einstellungen speichern",
            close: "Schließen"
        },
        en: {
            title: "Privacy & Cookies",
            desc: "We use cookies and similar technologies to enhance your experience on our website, analyze traffic, and offer personalized content. By clicking 'Accept All', you consent to the storage of cookies on your device.",
            acceptAll: "Accept All",
            reject: "Essential Only",
            settings: "Settings",
            modalTitle: "Cookie Settings",
            essentialTitle: "Essential Cookies",
            essentialDesc: "These cookies are strictly necessary for the basic functionality of the website and cannot be disabled.",
            analyticsTitle: "Analytics Cookies",
            analyticsDesc: "These cookies help us to understand how visitors interact with the website by collecting and reporting information anonymously.",
            marketingTitle: "Marketing Cookies",
            marketingDesc: "These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.",
            save: "Save Settings",
            close: "Close"
        },
        fa: {
            title: "حریم خصوصی و کوکی‌ها",
            desc: "ما از کوکی‌ها و فناوری‌های مشابه برای بهبود تجربه شما در وب‌سایت، تجزیه و تحلیل ترافیک و ارائه محتوای شخصی‌سازی‌شده استفاده می‌کنیم. با کلیک بر روی 'پذیرش همه'، با ذخیره کوکی‌ها در دستگاه خود موافقت می‌کنید.",
            acceptAll: "پذیرش همه",
            reject: "فقط ضروری",
            settings: "تنظیمات",
            modalTitle: "تنظیمات کوکی",
            essentialTitle: "کوکی‌های ضروری",
            essentialDesc: "این کوکی‌ها برای عملکرد اساسی وب‌سایت کاملاً ضروری هستند و نمی‌توانند غیرفعال شوند.",
            analyticsTitle: "کوکی‌های تحلیلی",
            analyticsDesc: "این کوکی‌ها به ما کمک می‌کنند تا با جمع‌آوری و گزارش اطلاعات به صورت ناشناس، درک کنیم که بازدیدکنندگان چگونه با وب‌سایت تعامل دارند.",
            marketingTitle: "کوکی‌های بازاریابی",
            marketingDesc: "این کوکی‌ها برای ردیابی بازدیدکنندگان در سراسر وب‌سایت‌ها استفاده می‌شوند. هدف، نمایش تبلیغاتی است که برای کاربر جذاب و مرتبط باشد.",
            save: "ذخیره تنظیمات",
            close: "بستن"
        }
    };
    
    const t = text[lang] || text['en'];

    // Create Banner HTML
    const bannerHtml = `
    <div class="cookie-banner-overlay" id="cookie-banner-overlay">
        <div class="cookie-banner" id="cookie-banner">
            <div class="cookie-header">
                <i class="fas fa-cookie-bite cookie-icon"></i>
                <h3 class="cookie-title">${t.title}</h3>
            </div>
            <p class="cookie-text">${t.desc}</p>
            <div class="cookie-buttons">
                <button class="btn btn-primary" id="btn-accept-all" style="width: 100%;">${t.acceptAll}</button>
                <div class="cookie-row">
                    <button class="btn btn-outline" id="btn-reject-all">${t.reject}</button>
                    <button class="btn cookie-settings" id="btn-cookie-settings">${t.settings}</button>
                </div>
            </div>
        </div>
    </div>
    `;

    // Create Modal HTML
    const modalHtml = `
    <div class="cookie-modal-overlay" id="cookie-modal-overlay">
        <div class="cookie-modal">
            <div class="cookie-modal-header">
                <h3 class="cookie-modal-title">${t.modalTitle}</h3>
                <button class="cookie-modal-close" id="btn-modal-close">&times;</button>
            </div>
            
            <div class="cookie-category">
                <div class="cookie-category-header">
                    <h4 class="cookie-category-title">${t.essentialTitle}</h4>
                    <label class="cookie-toggle">
                        <input type="checkbox" checked disabled>
                        <span class="cookie-toggle-slider"></span>
                    </label>
                </div>
                <p class="cookie-category-desc">${t.essentialDesc}</p>
            </div>
            
            <div class="cookie-category">
                <div class="cookie-category-header">
                    <h4 class="cookie-category-title">${t.analyticsTitle}</h4>
                    <label class="cookie-toggle">
                        <input type="checkbox" id="toggle-analytics">
                        <span class="cookie-toggle-slider"></span>
                    </label>
                </div>
                <p class="cookie-category-desc">${t.analyticsDesc}</p>
            </div>
            
            <div class="cookie-category">
                <div class="cookie-category-header">
                    <h4 class="cookie-category-title">${t.marketingTitle}</h4>
                    <label class="cookie-toggle">
                        <input type="checkbox" id="toggle-marketing">
                        <span class="cookie-toggle-slider"></span>
                    </label>
                </div>
                <p class="cookie-category-desc">${t.marketingDesc}</p>
            </div>
            
            <div class="cookie-modal-footer">
                <button class="btn btn-primary" id="btn-save-settings">${t.save}</button>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', bannerHtml + modalHtml);

    const bannerOverlay = document.getElementById('cookie-banner-overlay');
    const overlay = document.getElementById('cookie-modal-overlay');
    const cbAnalytics = document.getElementById('toggle-analytics');
    const cbMarketing = document.getElementById('toggle-marketing');
    
    // Check local storage
    const consent = localStorage.getItem('cookieConsent');
    
    if (!consent) {
        setTimeout(() => {
            bannerOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }, 10);
    } else {
        const parsed = JSON.parse(consent);
        cbAnalytics.checked = parsed.analytics;
        cbMarketing.checked = parsed.marketing;
    }
    
    const saveConsent = (analytics, marketing) => {
        localStorage.setItem('cookieConsent', JSON.stringify({
            essential: true,
            analytics: analytics,
            marketing: marketing,
            timestamp: new Date().toISOString()
        }));
        bannerOverlay.classList.remove('show');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    };

    document.getElementById('btn-accept-all').addEventListener('click', () => {
        saveConsent(true, true);
        cbAnalytics.checked = true;
        cbMarketing.checked = true;
    });

    document.getElementById('btn-reject-all').addEventListener('click', () => {
        saveConsent(false, false);
        cbAnalytics.checked = false;
        cbMarketing.checked = false;
    });

    document.getElementById('btn-cookie-settings').addEventListener('click', () => {
        overlay.classList.add('show');
    });

    document.getElementById('btn-modal-close').addEventListener('click', () => {
        overlay.classList.remove('show');
    });
    
    // When clicking outside the modal content
    overlay.addEventListener('click', (e) => {
        if(e.target === overlay) overlay.classList.remove('show');
    });

    document.getElementById('btn-save-settings').addEventListener('click', () => {
        saveConsent(cbAnalytics.checked, cbMarketing.checked);
    });
    
    // Make settings function globally available for footer links
    window.openCookieSettings = () => {
        overlay.classList.add('show');
    };
    
    // Bind to any element with the trigger class
    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('cookie-settings-trigger')) {
            e.preventDefault();
            window.openCookieSettings();
        }
    });
}

