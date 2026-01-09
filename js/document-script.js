// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
});

// Dropdown functionality
document.querySelectorAll('.dropdown-header').forEach(header => {
    header.addEventListener('click', () => {
        header.parentElement.classList.toggle('active');
    });
});

// Filter functionality
let currentFilter = 'all';
const filterBtns = document.querySelectorAll('.filter-btn');
const docSections = document.querySelectorAll('.docs-section');
const docCards = document.querySelectorAll('.doc-card');
const emptyState = document.getElementById('emptyState');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Get filter value
        currentFilter = btn.dataset.filter;
        
        // Filter content
        filterDocuments();
    });
});

function filterDocuments() {
    let visibleCount = 0;
    
    if (currentFilter === 'all') {
        // Show all sections and cards
        docSections.forEach(section => {
            section.style.display = 'block';
        });
        docCards.forEach(card => {
            card.style.display = 'flex';
            visibleCount++;
        });
    } else {
        // Filter by category
        docSections.forEach(section => {
            if (section.dataset.category === currentFilter) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
        
        docCards.forEach(card => {
            if (card.dataset.category === currentFilter) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Show/hide empty state
    if (visibleCount === 0) {
        emptyState.style.display = 'block';
        docSections.forEach(section => section.style.display = 'none');
    } else {
        emptyState.style.display = 'none';
    }
}

// Search functionality
let searchTimeout;
const searchInput = document.getElementById('docSearch');

searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        searchDocuments(e.target.value);
    }, 300);
});

function searchDocuments(query) {
    if (!query) {
        // Reset to current filter
        filterDocuments();
        return;
    }
    
    const lowerQuery = query.toLowerCase();
    let visibleCount = 0;
    
    docCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.doc-description').textContent.toLowerCase();
        
        if (title.includes(lowerQuery) || description.includes(lowerQuery)) {
            card.style.display = 'flex';
            card.parentElement.parentElement.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Check each section - hide if all cards are hidden
    docSections.forEach(section => {
        const visibleCards = section.querySelectorAll('.doc-card[style*="display: flex"]');
        if (visibleCards.length === 0) {
            section.style.display = 'none';
        }
    });
    
    // Show/hide empty state
    if (visibleCount === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
}

// Document view/download functions
function viewDocument(docId) {
    alert(`Feature in production`);
}

function downloadDocument(docId) {
    alert(`Feature in production`);
}

// Animate cards on load
window.addEventListener('load', () => {
    docCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.05}s`;
    });
});

console.log('Documentation page loaded successfully!');