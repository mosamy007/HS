document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const header = document.querySelector('.header');
    const languageToggle = document.getElementById('languageToggle');
    
    let currentLang = localStorage.getItem('language') || 'en';
    
    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('language', lang);
        
        document.documentElement.lang = lang;
        document.body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        
        const elementsWithLang = document.querySelectorAll('[data-en][data-ar]:not(.no-translate)');
        elementsWithLang.forEach(element => {
            if (element.classList.contains('no-translate')) return;
            
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = text;
                } else {
                    const hasNestedTranslation = element.querySelector('[data-en][data-ar]');
                    if (!hasNestedTranslation) {
                        element.textContent = text;
                    } else {
                        const childNodes = Array.from(element.childNodes);
                        childNodes.forEach(node => {
                            if (node.nodeType === Node.TEXT_NODE) {
                                node.textContent = text;
                            }
                        });
                    }
                }
            }
        });
        
        const placeholderElements = document.querySelectorAll('[data-placeholder-en][data-placeholder-ar]');
        placeholderElements.forEach(element => {
            const placeholder = element.getAttribute(`data-placeholder-${lang}`);
            if (placeholder) {
                element.placeholder = placeholder;
            }
        });
        
        const langText = languageToggle.querySelector('.lang-text');
        langText.textContent = lang === 'en' ? 'العربية' : 'English';
    }
    
    setLanguage(currentLang);
    
    languageToggle.addEventListener('click', function(e) {
        e.preventDefault();
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        setLanguage(newLang);

        if (window.innerWidth <= 768) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    prevBtn.addEventListener('click', function() {
        prevSlide();
        stopSlideshow();
        startSlideshow();
    });

    nextBtn.addEventListener('click', function() {
        nextSlide();
        stopSlideshow();
        startSlideshow();
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            currentSlide = index;
            showSlide(currentSlide);
            stopSlideshow();
            startSlideshow();
        });
    });

    document.querySelector('.hero').addEventListener('mouseenter', stopSlideshow);
    document.querySelector('.hero').addEventListener('mouseleave', startSlideshow);

    startSlideshow();

    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        const spans = menuToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = '#ffffff';
            header.style.backdropFilter = 'none';
        }
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .client-logo');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    const smoothScroll = function(target) {
        const element = document.querySelector(target);
        if (element) {
            const offsetTop = element.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                smoothScroll(href);
            }
        });
    });

    const parallaxHero = function() {
        if (window.innerWidth <= 768) return;
        const hero = document.querySelector('.hero');
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;

        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    };

    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                parallaxHero();
                ticking = false;
            });
            ticking = true;
        }
    });

    const navItems = document.querySelectorAll('.nav-menu a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');

    const highlightNav = function() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav);

    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    document.addEventListener('mousemove', function(e) {
        const cards = document.querySelectorAll('.service-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            }
        });
    });

    document.addEventListener('mouseleave', function() {
        const cards = document.querySelectorAll('.service-card');
        cards.forEach(card => {
            card.style.transform = '';
        });
    });

    const loadMoreBtn = document.querySelector('.load-more');
    const portfolioGrid = document.querySelector('.portfolio-grid');
    
    const additionalImages = [
        'assets/Portfolio/WhatsApp Image 2026-04-09 at 11.18.51 AM (1).jpeg',
        'assets/Portfolio/WhatsApp Image 2026-04-09 at 11.18.52 AM (1).jpeg',
        'assets/Portfolio/WhatsApp Image 2026-04-09 at 11.18.52 AM (2).jpeg',
        'assets/Portfolio/WhatsApp Image 2026-04-09 at 11.18.52 AM (3).jpeg',
        'assets/Portfolio/WhatsApp Image 2026-04-09 at 11.18.52 AM.jpeg',
        'assets/Portfolio/WhatsApp Image 2026-04-09 at 11.18.53 AM (1).jpeg',
        'assets/Portfolio/WhatsApp Image 2026-04-09 at 11.18.53 AM.jpeg',
        'assets/Portfolio/WhatsApp Image 2026-04-09 at 11.18.54 AM.jpeg',
        'assets/Portfolio/WhatsApp Image 2026-04-09 at 11.18.55 AM (1).jpeg',
        'assets/Portfolio/WhatsApp Image 2026-04-09 at 11.18.55 AM.jpeg'
    ];

    let imagesLoaded = false;

    loadMoreBtn.addEventListener('click', function() {
        if (!imagesLoaded) {
            additionalImages.forEach((imgSrc, index) => {
                const portfolioItem = document.createElement('div');
                portfolioItem.className = 'portfolio-item';
                portfolioItem.style.opacity = '0';
                portfolioItem.style.transform = 'translateY(30px)';
                
                const img = document.createElement('img');
                img.src = imgSrc;
                img.alt = `Project ${index + 7}`;
                img.loading = 'lazy';
                
                portfolioItem.appendChild(img);
                portfolioGrid.appendChild(portfolioItem);
                
                setTimeout(() => {
                    portfolioItem.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    portfolioItem.style.opacity = '1';
                    portfolioItem.style.transform = 'translateY(0)';
                }, index * 100);
            });
            
            imagesLoaded = true;
            loadMoreBtn.textContent = currentLang === 'en' ? 'Show Less' : 'عرض أقل';
            loadMoreBtn.setAttribute('data-en', 'Show Less');
            loadMoreBtn.setAttribute('data-ar', 'عرض أقل');
        } else {
            const items = portfolioGrid.querySelectorAll('.portfolio-item');
            for (let i = 6; i < items.length; i++) {
                items[i].remove();
            }
            imagesLoaded = false;
            loadMoreBtn.textContent = currentLang === 'en' ? 'Load More' : 'عرض المزيد';
            loadMoreBtn.setAttribute('data-en', 'Load More');
            loadMoreBtn.setAttribute('data-ar', 'عرض المزيد');
        }
    });

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let allPortfolioImages = [];
    let currentImageIndex = 0;

    function updatePortfolioImages() {
        allPortfolioImages = Array.from(document.querySelectorAll('.portfolio-item img')).map(img => img.src);
    }

    function openLightbox(index) {
        updatePortfolioImages();
        currentImageIndex = index;
        lightboxImg.src = allPortfolioImages[currentImageIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % allPortfolioImages.length;
        lightboxImg.src = allPortfolioImages[currentImageIndex];
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + allPortfolioImages.length) % allPortfolioImages.length;
        lightboxImg.src = allPortfolioImages[currentImageIndex];
    }

    document.addEventListener('click', function(e) {
        if (e.target.closest('.portfolio-item img')) {
            const portfolioItems = Array.from(document.querySelectorAll('.portfolio-item img'));
            const clickedIndex = portfolioItems.indexOf(e.target);
            openLightbox(clickedIndex);
        }
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });

    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                showNextImage();
            } else {
                showPrevImage();
            }
        }
    }, { passive: true });

    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            const hero = document.querySelector('.hero');
            if (hero) hero.style.transform = '';
        }
    });
});

