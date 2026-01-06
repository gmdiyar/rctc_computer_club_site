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

// Filter functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const memberCards = document.querySelectorAll('.member-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter cards
        memberCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });

        // Update counts after filtering
        updateStatistics();
    });
});

// Search functionality
const searchInput = document.getElementById('memberSearch');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    memberCards.forEach(card => {
        const name = card.querySelector('.member-name').textContent.toLowerCase();
        const bio = card.querySelector('.member-bio')?.textContent.toLowerCase() || '';
        const role = card.querySelector('.member-role')?.textContent.toLowerCase() || '';
        
        if (name.includes(searchTerm) || bio.includes(searchTerm) || role.includes(searchTerm)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });

    // Update counts after search
    updateStatistics();
});

// Update statistics dynamically
function updateStatistics() {
    const allCards = document.querySelectorAll('.member-card');
    
    // Always count ALL members and leadership (not just visible)
    const totalCount = allCards.length;
    
    // Count leadership from ALL cards (cards with leadership category OR cards with badges)
    const leadershipCount = Array.from(allCards).filter(card => {
        return card.dataset.category === 'leadership' || card.querySelector('.member-badge');
    }).length;
    
    // Count developers from ALL cards
    const developerCount = Array.from(allCards).filter(card => {
        return card.dataset.category === 'developers';
    }).length;
    
    // Animate the count updates
    animateCount('totalMembers', totalCount);
    animateCount('leadershipCount', leadershipCount);
    animateCount('developerCount', developerCount);
}

// Animate number counting
function animateCount(elementId, targetValue) {
    const element = document.getElementById(elementId);
    const currentValue = parseInt(element.textContent) || 0;
    
    if (currentValue === targetValue) return;
    
    const duration = 500; // milliseconds
    const steps = 20;
    const increment = (targetValue - currentValue) / steps;
    const stepDuration = duration / steps;
    
    let current = currentValue;
    let step = 0;
    
    const timer = setInterval(() => {
        step++;
        current += increment;
        
        if (step >= steps) {
            element.textContent = targetValue;
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, stepDuration);
}

// Initialize statistics on page load
document.addEventListener('DOMContentLoaded', () => {
    updateStatistics();
});

// Dropdown functionality (if needed for right column)
document.querySelectorAll('.dropdown-header').forEach(header => {
    header.addEventListener('click', () => {
        header.parentElement.classList.toggle('active');
    });
});