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
    rootMargin: '-100px 0px -50% 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            document.querySelectorAll('.resource-nav .nav-item').forEach(link => {
                link.style.borderLeftColor = 'transparent';
                link.style.background = 'transparent';
                link.style.paddingLeft = '15px';
            });
            const activeLink = document.querySelector(`.resource-nav .nav-item[href="#${id}"]`);
            if (activeLink) {
                activeLink.style.borderLeftColor = 'var(--two)';
                activeLink.style.background = 'rgba(79, 91, 201, 0.1)';
                activeLink.style.paddingLeft = '20px';
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.resource-section[id]').forEach(section => {
    observer.observe(section);
});