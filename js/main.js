// Cache DOM references
let cachedNavbar = null;
let cachedHamburger = null;
let cachedNavMenu = null;
let cachedHomeLink = null;
let cachedSections = null;
let prevScrollPos = window.pageYOffset;
let scrollTicking = false;

function getNavbar() { return cachedNavbar || (cachedNavbar = document.querySelector('.navbar')); }

document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements once
    cachedNavbar = document.querySelector('.navbar');
    cachedHamburger = document.querySelector('.hamburger');
    cachedNavMenu = document.querySelector('.nav-menu');
    cachedHomeLink = document.querySelector('.nav-link[data-page="home"]');
    cachedSections = document.querySelectorAll('section[id]');

    // Preloader handling
    const preloader = document.querySelector('.preloader');
    if (preloader && document.readyState === 'complete') {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            document.body.style.overflow = '';
            setTimeout(() => {
                preloader.style.display = 'none';
                reveal();
            }, 300);
        }, 500);
    }

    // Hamburger nav (click + keyboard)
    if (cachedHamburger && cachedNavMenu) {
        const toggleMenu = () => {
            cachedHamburger.classList.toggle('active');
            cachedNavMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        };

        cachedHamburger.addEventListener('click', toggleMenu);
        cachedHamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                cachedHamburger.classList.remove('active');
                cachedNavMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // Set active nav link
    setActiveNavLink();

    // Lazy load images with data-src
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imgObserver.unobserve(img);
                    }
                }
            });
        }, { rootMargin: '200px 0px' });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imgObserver.observe(img);
        });
    }
});

// Single consolidated scroll handler using rAF throttling
window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;

    requestAnimationFrame(() => {
        const navbar = getNavbar();
        const currentScrollPos = window.pageYOffset;

        // Navbar show/hide on scroll (with a small threshold to avoid flicker)
        if (navbar) {
            const delta = currentScrollPos - prevScrollPos;
            if (currentScrollPos <= 100) {
                navbar.style.transform = "translateY(0)";
            } else if (Math.abs(delta) > 6) {
                navbar.style.transform = delta < 0 ? "translateY(0)" : "translateY(-100%)";
            }

            if (currentScrollPos > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Active section highlighting
        const isHomePage = window.location.pathname === '/' || window.location.pathname.includes('index.html');
        if (isHomePage && cachedHomeLink && cachedSections) {
            const scrollPosition = currentScrollPos + 100;
            cachedHomeLink.classList.add('active');

            cachedSections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionId = section.getAttribute('id');
                const sectionLink = document.querySelector(`.nav-link[href*="#${sectionId}"]`);

                if (sectionLink && sectionLink !== cachedHomeLink) {
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + section.offsetHeight) {
                        sectionLink.classList.add('active');
                    } else {
                        sectionLink.classList.remove('active');
                    }
                }
            });
        }

        prevScrollPos = currentScrollPos;
        scrollTicking = false;
    });
}, { passive: true });

// Active Nav Link
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => link.classList.remove('active'));

    const isHomePage = currentPath === '/' || currentPath.includes('index.html');

    if (isHomePage && cachedHomeLink) {
        cachedHomeLink.classList.add('active');

        if (currentHash) {
            const sectionLink = document.querySelector(`.nav-link[href$="${currentHash}"]`);
            if (sectionLink && sectionLink !== cachedHomeLink) {
                sectionLink.classList.add('active');
            }
        }
    } else if (currentPath.includes('about.html')) {
        const aboutLink = document.querySelector('.nav-link[data-page="about"]');
        if (aboutLink) aboutLink.classList.add('active');
    } else if (currentPath.includes('contact.html')) {
        const contactLink = document.querySelector('.nav-link[data-page="contact"]');
        if (contactLink) contactLink.classList.add('active');
    }
}

window.addEventListener('hashchange', setActiveNavLink);

// Slider
(function initSlider() {
    const slider = document.querySelector('.slider');
    if (!slider) return;

    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    if (!slides.length || !dots.length || !nextBtn || !prevBtn) return;

    let currentSlide = 0;
    let slideInterval;
    let touchStartX = 0;
    let isAnimating = false;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50 && !isAnimating) {
            resetAutoSlide();
            showSlide(currentSlide + (diff > 0 ? 1 : -1));
        }
    }, { passive: true });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (isAnimating) return;
        if (e.key === 'ArrowRight') {
            resetAutoSlide();
            showSlide(currentSlide + 1);
        } else if (e.key === 'ArrowLeft') {
            resetAutoSlide();
            showSlide(currentSlide - 1);
        }
    });

    function showSlide(index) {
        if (isAnimating) return;
        isAnimating = true;

        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;

        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');

        currentSlide = index;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');

        setTimeout(() => {
            isAnimating = false;
        }, 600);
    }

    function startAutoSlide() {
        slideInterval = setInterval(() => {
            if (!isAnimating) {
                showSlide(currentSlide + 1);
            }
        }, 6000);
    }

    function resetAutoSlide() {
        clearInterval(slideInterval);
        startAutoSlide();
    }

    nextBtn.addEventListener('click', () => {
        if (!isAnimating) {
            resetAutoSlide();
            showSlide(currentSlide + 1);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (!isAnimating) {
            resetAutoSlide();
            showSlide(currentSlide - 1);
        }
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (!isAnimating && index !== currentSlide) {
                resetAutoSlide();
                showSlide(index);
            }
        });
    });

    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === 0);
    });
    dots[0].classList.add('active');

    startAutoSlide();

    // Pause slider when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(slideInterval);
        } else {
            resetAutoSlide();
        }
    });
})();

// Projects Data
const projectsData = [
    {
        title: "Modern Office Complex",
        category: "Commercial",
        description: "A state-of-the-art office building featuring sustainable design and smart technology integration.",
        image: "/images/moderndesign.jpg",
        technologies: "Sustainable Materials, Smart Systems, Green Building"
    },
    {
        title: "Luxury Residential Tower",
        category: "Residential",
        description: "High-end residential complex with premium amenities and contemporary architecture.",
        image: "/images/qualityconstruction.jpg",
        technologies: "Premium Materials, Modern Design, Smart Home"
    },
    {
        title: "Industrial Facility",
        category: "Industrial",
        description: "Large-scale industrial facility with advanced manufacturing capabilities and efficient logistics.",
        image: "/images/expertteam.jpg",
        technologies: "Industrial Design, Safety Systems, Automation"
    },
    {
        title: "Shopping Center",
        category: "Retail",
        description: "Modern shopping complex with innovative design and sustainable features.",
        image: "/images/safetyfirst.jpg",
        technologies: "Retail Design, Energy Efficiency, Modern Architecture"
    }
];

function displayProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    const fragment = document.createDocumentFragment();

    projectsData.forEach((project, i) => {
        const technologies = project.technologies.split(',').map(tech =>
            `<span>${tech.trim()}</span>`
        ).join('');

        const card = document.createElement('div');
        card.className = `project-card reveal${i > 0 ? ' delay-' + Math.min(i, 3) : ''}`;
        card.innerHTML = `
                <div class="project-media">
                    <span class="project-tag">${project.category}</span>
                    <img src="${project.image}" alt="${project.title}" loading="lazy" width="400" height="300">
                </div>
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-technologies">
                        ${technologies}
                    </div>
                </div>
        `;
        fragment.appendChild(card);
    });

    projectsGrid.appendChild(fragment);
}

// Init projects from DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    displayProjects();
});

// Contact Form
function handleContactSubmit(event) {
    event.preventDefault();
    const form = event.target;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject ? form.subject.value.trim() : '';
    const messageText = form.message.value.trim();

    const showFeedback = (text, isError) => {
        let feedback = form.querySelector('.form-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'form-feedback';
            form.appendChild(feedback);
        }
        feedback.textContent = text;
        feedback.classList.toggle('error', !!isError);
        feedback.classList.add('visible');
    };

    if (!name || !email || !subject || !messageText) {
        showFeedback('Please fill in all required fields.', true);
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFeedback('Please enter a valid email address.', true);
        return false;
    }

    if (name.length < 4) {
        showFeedback('Name must be at least 4 characters long.', true);
        return false;
    }

    if (messageText.length < 10) {
        showFeedback('Message must be at least 10 characters long.', true);
        return false;
    }

    const message = {
        id: Date.now(),
        name: name,
        email: email,
        subject: subject || 'Contact Form Submission',
        message: messageText,
        date: new Date().toISOString(),
        read: false
    };

    try {
        const messages = JSON.parse(localStorage.getItem('messages') || '[]');
        messages.push(message);
        localStorage.setItem('messages', JSON.stringify(messages));
    } catch (e) {
        // Storage unavailable (private mode / quota) — still confirm to the user
    }

    form.reset();
    showFeedback('Thank you! Your message has been sent. We will get back to you shortly.', false);

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        setTimeout(() => { submitBtn.disabled = false; }, 3000);
    }
}

// Reveal Animation — activates just before elements enter the viewport
// so scrolling never waits on queued timeouts (stagger is handled by CSS delays)
function reveal() {
    const reveals = document.querySelectorAll('.reveal:not(.active), .reveal-left:not(.active), .reveal-right:not(.active)');

    if (!('IntersectionObserver' in window)) {
        reveals.forEach(item => item.classList.add('active'));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0, rootMargin: '0px 0px 80px 0px' });

    reveals.forEach(item => {
        observer.observe(item);
    });
}

// Single init for reveal + hover + contact form
(function() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPage);
    } else {
        initPage();
    }

    function initPage() {
        setTimeout(reveal, 100);
        initializeHoverEffects();

        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactSubmit);
        }
    }
})();

function initializeHoverEffects() {
    document.querySelectorAll('.service-box, .member, .project-card')
        .forEach(el => {
            el.addEventListener('mouseenter', function() {
                this.classList.add('hover-active');
            });

            el.addEventListener('mouseleave', function() {
                this.classList.remove('hover-active');
            });
        });
}

// Counter Animation — works anywhere counters appear (home stats band + about page)
(function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length || !('IntersectionObserver' in window)) return;

    function animateCounter(counter) {
        const target = +counter.getAttribute('data-target');
        const duration = 1600;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(easeProgress * target);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
})();

(() => {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        }, false)
    })
})()
