// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
});

// Dropdown sections in right column
const dropdownHeaders = document.querySelectorAll('.dropdown-header');

dropdownHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const section = header.parentElement;
        section.classList.toggle('active');
    });
});

// Close mobile menu when clicking a link
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// Auto-advance slideshow
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slider img');
const navLinks = document.querySelectorAll('.slider-nav a');
let currentSlide = 0;
let autoSlideInterval;

function goToSlide(index) {
    currentSlide = index;
    const slideWidth = slides[0].clientWidth;
    slider.scrollLeft = slideWidth * currentSlide;
    
    // Update active nav indicator
    navLinks.forEach((link, i) => {
        if (i === currentSlide) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    goToSlide(currentSlide);
}

function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Initialize slideshow
if (slides.length > 0) {
    goToSlide(0);
    startAutoSlide();

    // Manual navigation
    navLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            stopAutoSlide();
            goToSlide(index);
            startAutoSlide(); // Restart auto-advance after manual click
        });
    });

    // Pause auto-advance on hover
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    // Handle manual scrolling
    slider.addEventListener('scroll', () => {
        const slideWidth = slides[0].clientWidth;
        const newIndex = Math.round(slider.scrollLeft / slideWidth);
        if (newIndex !== currentSlide) {
            currentSlide = newIndex;
            navLinks.forEach((link, i) => {
                if (i === currentSlide) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    });
}