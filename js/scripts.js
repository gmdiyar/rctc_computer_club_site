// ==============
// CONFIGURATION
// ==============
const API_BASE_URL = 'https://rctc-computer-club-site.vercel.app/';

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
});

// Dropdown functionality
const dropdownHeaders = document.querySelectorAll('.dropdown-header');
dropdownHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const section = header.parentElement;
        section.classList.toggle('active');
    });
});

// Image Slider Functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');

function showSlide(index) {
    // Wrap around
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    
    // Update slides
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === currentSlide) {
            slide.classList.add('active');
        }
    });
    
    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.remove('active');
        if (i === currentSlide) {
            dot.classList.add('active');
        }
    });
}

// Previous slide
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
    });
}

// Next slide
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
    });
}

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

// Auto advance slides every 5 seconds
let autoSlideInterval = setInterval(() => {
    showSlide(currentSlide + 1);
}, 5000);

// Pause auto-advance on hover
const slider = document.getElementById('slider');
if (slider) {
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    slider.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    });
}

// Keyboard navigation for slider
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        showSlide(currentSlide - 1);
    } else if (e.key === 'ArrowRight') {
        showSlide(currentSlide + 1);
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll('.slider-section, .about-section, .activities-section, .cta-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
});

// Animate feature cards on scroll
document.querySelectorAll('.feature-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Animate activity cards on scroll
document.querySelectorAll('.activity-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.9)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Counter animation for stats
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 30);
}

// Trigger counter animation when stats are visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-section');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - (scrolled / 500);
    }
});

// Add hover effect to cards
document.querySelectorAll('.feature-card, .activity-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-cta-primary, .btn-cta-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        const existingRipple = this.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .btn-primary, .btn-secondary, .btn-cta-primary, .btn-cta-secondary {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ================================
// CONTACT MODAL FUNCTIONALITY
// ================================

// Modal Elements
const contactModal = document.getElementById('contactModal');
const closeModalBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

// Open Modal Function
function openModal() {
    if (contactModal) {
        contactModal.classList.add('active');
        document.body.classList.add('modal-open');
        if (formStatus) {
            formStatus.style.display = 'none';
            formStatus.className = 'form-status';
        }
    }
}

// Close Modal Function
function closeModal() {
    if (contactModal) {
        contactModal.classList.remove('active');
        document.body.classList.remove('modal-open');
        if (contactForm) {
            contactForm.reset();
        }
        if (formStatus) {
            formStatus.style.display = 'none';
            formStatus.className = 'form-status';
        }
    }
}

// Initialize contact triggers when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Find all elements with the contact-trigger class
    const contactTriggers = document.querySelectorAll('.contact-trigger');
    
    contactTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    });
});

// Event Listeners for closing modal
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
}

// Close modal when clicking outside (on overlay)
if (contactModal) {
    contactModal.addEventListener('click', function(e) {
        if (e.target === contactModal || e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && contactModal && contactModal.classList.contains('active')) {
        closeModal();
    }
});

// Form Submission Handler with Direct Email Sending
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Disable submit button to prevent double submission
        const submitBtn = contactForm.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Get form data
        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            topic: document.getElementById('contactTopic').value,
            message: document.getElementById('contactMessage').value
        };
        
        try {
            // Show loading state
            if (formStatus) {
                formStatus.textContent = 'Sending your message...';
                formStatus.className = 'form-status';
                formStatus.style.display = 'block';
                formStatus.style.background = '#e3f2fd';
                formStatus.style.color = '#1976d2';
                formStatus.style.border = '2px solid #2196f3';
            }
            
            // Send email using FormSubmit.co (free service, no signup required)
            const response = await fetch('https://formsubmit.co/ajax/rctccsclub@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    subject: `[RCTC CS Club Website] ${formData.topic}`,
                    message: `Topic: ${formData.topic}\n\nMessage:\n${formData.message}`,
                    _captcha: 'false'
                })
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                // Success!
                if (formStatus) {
                    formStatus.textContent = '✓ Message sent successfully! We\'ll get back to you soon.';
                    formStatus.className = 'form-status success';
                }
                
                // Reset form and close modal after 2 seconds
                setTimeout(() => {
                    closeModal();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                }, 2000);
            } else {
                throw new Error('Failed to send message');
            }
            
        } catch (error) {
            console.error('Email send error:', error);
            
            // Show error message
            if (formStatus) {
                formStatus.textContent = '✗ Failed to send message. Please try again or email us directly at rctccsclub@gmail.com';
                formStatus.className = 'form-status error';
            }
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }
    });
}

// ========================================
// ANNOUNCEMENTS FUNCTIONALITY (BACKEND API)
// ========================================

// Load announcements from backend API
async function loadAnnouncements() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/announcements`);
        if (!response.ok) {
            throw new Error('Failed to load announcements');
        }
        const data = await response.json();
        return data.map(announcement => ({
            ...announcement,
            date: new Date(announcement.date)
        }));
    } catch (error) {
        console.error('Error loading announcements:', error);
        return [];
    }
}

// Display announcements on the page
async function displayAnnouncements() {
    const announcements = await loadAnnouncements();
    const container = document.getElementById('announcementsContainer');
    const countElement = document.getElementById('announcementCount');
    
    if (!container) return; // Not on index page
    
    // Update count
    if (countElement) {
        countElement.textContent = announcements.length;
    }
    
    if (announcements.length === 0) {
        container.innerHTML = '<p class="no-announcements">No announcements at this time. Check back later!</p>';
        return;
    }
    
    // Sort by date (newest first)
    announcements.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Display only the 5 most recent
    const recentAnnouncements = announcements.slice(0, 5);
    
    container.innerHTML = recentAnnouncements.map(announcement => `
        <div class="announcement-card ${announcement.type}">
            <div class="announcement-header">
                <h3 class="announcement-title">${announcement.title}</h3>
                <span class="announcement-badge ${announcement.type}">${announcement.type}</span>
            </div>
            <p class="announcement-content">${announcement.content}</p>
            <div class="announcement-footer">
                <div class="announcement-meta">
                    <span><i class="fas fa-calendar"></i> ${formatAnnouncementDate(announcement.date)}</span>
                    <span><i class="fas fa-user"></i> ${announcement.author || 'Admin'}</span>
                </div>
                ${announcement.link ? `<a href="${announcement.link}" class="announcement-link" target="_blank">Read More <i class="fas fa-arrow-right"></i></a>` : ''}
            </div>
        </div>
    `).join('');
}

// Format date for announcements
function formatAnnouncementDate(date) {
    const now = new Date();
    const announcementDate = new Date(date);
    const diffTime = Math.abs(now - announcementDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return announcementDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }
}

// Initialize announcements on page load
document.addEventListener('DOMContentLoaded', () => {
    displayAnnouncements();
    
    // Refresh announcements every 30 seconds
    setInterval(displayAnnouncements, 30000);
});

// Export for admin panel
window.announcementsAPI = {
    loadAnnouncements,
    displayAnnouncements
};

console.log('RCTC CS Club - Website loaded successfully (using backend API)');