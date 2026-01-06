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
        header.parentElement.classList.toggle('active');
    });
});

// View switcher functionality
const viewBtns = document.querySelectorAll('.view-btn');
const projectsContainer = document.getElementById('projectsContainer');

viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        
        // Update active button
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update container class
        projectsContainer.className = 'projects-container';
        projectsContainer.classList.add(`${view}-view`);
        
        // Save preference to localStorage
        localStorage.setItem('projectsView', view);
    });
});

// Load saved view preference
const savedView = localStorage.getItem('projectsView');
if (savedView) {
    const savedBtn = document.querySelector(`[data-view="${savedView}"]`);
    if (savedBtn) {
        viewBtns.forEach(b => b.classList.remove('active'));
        savedBtn.classList.add('active');
        projectsContainer.className = 'projects-container';
        projectsContainer.classList.add(`${savedView}-view`);
    }
}

// Filter functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');
const emptyState = document.getElementById('emptyState');

function updateProjects(filterStatus, searchTerm = '') {
    let visibleCount = 0;
    
    projectItems.forEach(item => {
        const status = item.dataset.status;
        const projectName = item.querySelector('.project-name').textContent.toLowerCase();
        const projectDesc = item.querySelector('.project-description').textContent.toLowerCase();
        
        const matchesFilter = filterStatus === 'all' || status === filterStatus;
        const matchesSearch = !searchTerm || 
                             projectName.includes(searchTerm) || 
                             projectDesc.includes(searchTerm);
        
        if (matchesFilter && matchesSearch) {
            item.classList.remove('hidden');
            item.style.display = 'flex';
            visibleCount++;
        } else {
            item.classList.add('hidden');
            item.style.display = 'none';
        }
    });
    
    // Show/hide empty state
    if (visibleCount === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const searchTerm = document.getElementById('projectSearch').value.toLowerCase();
        updateProjects(filter, searchTerm);
    });
});

// Search functionality
const searchInput = document.getElementById('projectSearch');
let searchTimeout;

searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const searchTerm = e.target.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        updateProjects(activeFilter, searchTerm);
    }, 300);
});

// Category filter from sidebar
document.querySelectorAll('.dropdown-item a[data-category]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.dataset.category;
        
        projectItems.forEach(item => {
            if (item.dataset.category === category) {
                item.style.display = 'flex';
                item.classList.remove('hidden');
            } else {
                item.style.display = 'none';
                item.classList.add('hidden');
            }
        });
        
        // Reset filter buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
    });
});

// View Details button functionality
document.querySelectorAll('.btn-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const projectCard = e.target.closest('.project-item');
        const projectName = projectCard.querySelector('.project-name').textContent;
        
        // For now, just alert. You can replace this with a modal or navigation
        alert(`Viewing details for: ${projectName}\n\nThis would typically open a detailed project page or modal.`);
    });
});

// Add smooth animations on load
window.addEventListener('load', () => {
    projectItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 50);
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Esc to clear search
    if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        searchInput.blur();
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        updateProjects(activeFilter, '');
    }
    
    // Number keys 1-4 for view switching
    if (e.key >= '1' && e.key <= '3') {
        const views = ['grid', 'list', 'compact'];
        const viewIndex = parseInt(e.key) - 1;
        if (viewIndex < views.length) {
            const btn = document.querySelector(`[data-view="${views[viewIndex]}"]`);
            if (btn) btn.click();
        }
    }
});