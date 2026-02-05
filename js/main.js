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

    // Hamburger nav
    if (cachedHamburger && cachedNavMenu) {
        cachedHamburger.addEventListener('click', () => {
            cachedHamburger.classList.toggle('active');
            cachedNavMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
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
        
        // Navbar show/hide on scroll
        if (navbar) {
            if (currentScrollPos > 100) {
                navbar.style.transform = prevScrollPos > currentScrollPos ? "translateY(0)" : "translateY(-100%)";
            } else {
                navbar.style.transform = "translateY(0)";
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
            showSlide(currentSlide + (diff > 0 ? 1 : -1));
        }
    }, { passive: true });

    function showSlide(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        
        slides[currentSlide].style.opacity = '0';
        dots[currentSlide].classList.remove('active');
        
        setTimeout(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = index;
            
            slides[currentSlide].classList.add('active');
            slides[currentSlide].style.opacity = '1';
            dots[currentSlide].classList.add('active');
            
            setTimeout(() => {
                isAnimating = false;
            }, 200); 
        }, 300); 
    }

    function startAutoSlide() {
        slideInterval = setInterval(() => {
            if (!isAnimating) {
                showSlide(currentSlide + 1);
            }
        }, 5000);
    }

    nextBtn.addEventListener('click', () => {
        if (!isAnimating) {
            clearInterval(slideInterval);
            showSlide(currentSlide + 1);
            startAutoSlide();
        }
    });
    
    prevBtn.addEventListener('click', () => {
        if (!isAnimating) {
            clearInterval(slideInterval);
            showSlide(currentSlide - 1);
            startAutoSlide();
        }
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (!isAnimating && index !== currentSlide) {
                clearInterval(slideInterval);
                showSlide(index);
                startAutoSlide();
            }
        });
    });

    slides.forEach((slide, index) => {
        if (index !== 0) {
            slide.style.opacity = '0';
        }
    });
    
    slides[0].classList.add('active');
    slides[0].style.opacity = '1';
    dots[0].classList.add('active');
    
    startAutoSlide();

    // Pause slider when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(slideInterval);
        } else {
            startAutoSlide();
        }
    });
})();

// Projects Data
const projectsData = [
    {
        title: "Modern Office Complex",
        description: "A state-of-the-art office building featuring sustainable design and smart technology integration.",
        image: "/images/moderndesign.jpg",
        technologies: "Sustainable Materials, Smart Systems, Green Building"
    },
    {
        title: "Luxury Residential Tower",
        description: "High-end residential complex with premium amenities and contemporary architecture.",
        image: "/images/qualityconstruction.jpg",
        technologies: "Premium Materials, Modern Design, Smart Home"
    },
    {
        title: "Industrial Facility",
        description: "Large-scale industrial facility with advanced manufacturing capabilities and efficient logistics.",
        image: "/images/expertteam.jpg",
        technologies: "Industrial Design, Safety Systems, Automation"
    },
    {
        title: "Shopping Center",
        description: "Modern shopping complex with innovative design and sustainable features.",
        image: "/images/safetyfirst.jpg",
        technologies: "Retail Design, Energy Efficiency, Modern Architecture"
    }
];

function displayProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    const fragment = document.createDocumentFragment();
    
    projectsData.forEach(project => {
        const technologies = project.technologies.split(',').map(tech => 
            `<span>${tech.trim()}</span>`
        ).join('');

        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
                <img src="${project.image}" alt="${project.title}" loading="lazy" width="350" height="250">
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

    if (!name || !email || !subject || !messageText) {
        alert('Please fill in all required fields');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }

    if (name.length < 4) {
        alert('Name must be at least 4 characters long');
        return false;
    }

    if (messageText.length < 10) {
        alert('Message must be at least 10 characters long');
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

    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.push(message);
    localStorage.setItem('messages', JSON.stringify(messages));

    form.reset();
    alert('Message sent successfully!');
    
    window.location.href = '../index.html';
}

// Reveal Animation
function reveal() {
    const reveals = document.querySelectorAll('.reveal:not(.active), .reveal-left:not(.active), .reveal-right:not(.active)');
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 50); 
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); 
    
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

// Counter Animation
const counters = document.querySelectorAll('.counter');
const speed = 200;

function animateCounter() {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 1500; 
        const startTime = performance.now();
        const startValue = 0;
        
        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            const currentValue = Math.floor(startValue + easeProgress * (target - startValue));
            
            counter.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        }
        
        requestAnimationFrame(updateCounter);
    });
}

const statisticsSection = document.querySelector('.statistics-section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (statisticsSection) {
    observer.observe(statisticsSection);
}

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