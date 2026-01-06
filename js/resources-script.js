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

document.querySelectorAll('.dropdown-header').forEach(header => {
    header.addEventListener('click', () => {
        header.parentElement.classList.toggle('active');
    });
});

// Smooth scroll for navigation
document.querySelectorAll('.resource-nav .nav-item').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Highlight active section in navigation
const observerOptions = {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            
            // Remove active class from all nav items
            document.querySelectorAll('.resource-nav .nav-item').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to current nav item
            const activeLink = document.querySelector(`.resource-nav .nav-item[href="#${id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.resource-section[id]').forEach(section => {
    observer.observe(section);
});

// Set initial active state on page load
document.addEventListener('DOMContentLoaded', () => {
    const firstLink = document.querySelector('.resource-nav .nav-item[href="#programming"]');
    if (firstLink) {
        firstLink.classList.add('active');
    }
});