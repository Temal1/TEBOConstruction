let prevScrollPos = window.pageYOffset;

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScrollPos = window.pageYOffset;
    
    if (currentScrollPos > 100) { 
        if (prevScrollPos > currentScrollPos) {
            navbar.style.transform = "translateY(0)";
        } else {
            navbar.style.transform = "translateY(-100%)";
        }
    } else {
        navbar.style.transform = "translateY(0)";
    }
    
    if (currentScrollPos > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    prevScrollPos = currentScrollPos;
});

//Nav
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
});

// Set active nav link based on current page
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    const navLinks = document.querySelectorAll('.nav-link');
    const homeLink = document.querySelector('.nav-link[data-page="home"]');

    navLinks.forEach(link => link.classList.remove('active'));

    const isHomePage = currentPath === '/' || currentPath.includes('index.html');

    if (isHomePage) {
        homeLink.classList.add('active');
        
        if (currentHash) {
            const sectionLink = document.querySelector(`.nav-link[href$="${currentHash}"]`);
            if (sectionLink && sectionLink !== homeLink) {
                sectionLink.classList.add('active');
            }
        }
    } else if (currentPath.includes('about.html')) {
        document.querySelector('.nav-link[data-page="about"]').classList.add('active');
    } else if (currentPath.includes('contact.html')) {
        document.querySelector('.nav-link[data-page="contact"]').classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', setActiveNavLink);
window.addEventListener('hashchange', setActiveNavLink);

window.addEventListener('scroll', () => {
    if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
        const homeLink = document.querySelector('.nav-link[data-page="home"]');
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 100;

        homeLink.classList.add('active');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const sectionLink = document.querySelector(`.nav-link[href*="#${sectionId}"]`);
                if (sectionLink && sectionLink !== homeLink) {
                    sectionLink.classList.add('active');
                }
            } else {
                const sectionLink = document.querySelector(`.nav-link[href*="#${sectionId}"]`);
                if (sectionLink && sectionLink !== homeLink) {
                    sectionLink.classList.remove('active');
                }
            }
        });
    }
});

//Slider with improved faster transitions
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    let currentSlide = 0;
    let slideInterval;
    let touchStartX = 0;
    let touchEndX = 0;
    let isAnimating = false;

    // Touch Events
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold && !isAnimating) {
            if (diff > 0) {
                showSlide(currentSlide + 1);
            } else {
                showSlide(currentSlide - 1);
            }
        }
    }

    function showSlide(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        
        // Faster fade transition
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
            }, 200); // Reduced from 300ms
        }, 300); // Reduced from 500ms
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

    // Initialize first slide
    slides.forEach((slide, index) => {
        if (index !== 0) {
            slide.style.opacity = '0';
        }
    });
    
    slides[0].classList.add('active');
    slides[0].style.opacity = '1';
    dots[0].classList.add('active');
    
    startAutoSlide();
});

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
    
    projectsGrid.innerHTML = '';
    
    projectsData.forEach(project => {
        const technologies = project.technologies.split(',').map(tech => 
            `<span>${tech.trim()}</span>`
        ).join('');

        const projectCard = `
            <div class="project-card">
                <img src="${project.image}" alt="${project.title}">
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-technologies">
                        ${technologies}
                    </div>
                </div>
            </div>
        `;
        projectsGrid.innerHTML += projectCard;
    });
}

document.addEventListener('DOMContentLoaded', displayProjects);

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

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});

// Fast and optimized Reveal Function
function reveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Faster activation with shorter delay between elements
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 50); // Reduced from 100ms
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); // Lower threshold for earlier activation
    
    reveals.forEach(item => {
        observer.observe(item);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Run reveal faster on page load
    setTimeout(reveal, 100); // Reduced from 300ms
    
    // Use a more efficient approach for hover effects
    initializeHoverEffects();
});

// Initialize hover effects for interactive elements - optimized version
function initializeHoverEffects() {
    // Apply hover classes through CSS for better performance
    // instead of inline styles through JS
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

// Improved Counter Animation with faster duration
const counters = document.querySelectorAll('.counter');
const speed = 200; // Lower for smoother animation

function animateCounter() {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 1500; // Reduced from 2000ms
        const startTime = performance.now();
        const startValue = 0;
        
        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Use easeOutQuad easing function for natural counting feel
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
            // Only trigger once
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