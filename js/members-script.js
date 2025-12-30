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

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Initialize counters
const statNumbers = document.querySelectorAll('.stat-number');

statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    animateCounter(stat, target);
});

// Filter functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const memberCards = document.querySelectorAll('.member-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        memberCards.forEach(card => {
            const categories = card.getAttribute('data-category');
            
            if (filter === 'all' || categories.includes(filter)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Search functionality
const searchInput = document.getElementById('memberSearch');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        memberCards.forEach(card => {
            const name = card.querySelector('.member-name').textContent.toLowerCase();
            const role = card.querySelector('.member-role').textContent.toLowerCase();
            const bio = card.querySelector('.member-bio').textContent.toLowerCase();
            const skills = Array.from(card.querySelectorAll('.skill-tag'))
                .map(skill => skill.textContent.toLowerCase())
                .join(' ');
            
            const searchableText = `${name} ${role} ${bio} ${skills}`;
            
            if (searchableText.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press '/' to focus search
    if (e.key === '/' && searchInput) {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Press 'Escape' to clear search
    if (e.key === 'Escape' && searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.blur();
    }
});

// Smooth animations on scroll
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

// Observe member cards for fade-in effect
memberCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `all 0.5s ease ${index * 0.05}s`;
    observer.observe(card);
});