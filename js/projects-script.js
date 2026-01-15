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

// In-memory storage for view preference
let currentView = 'grid';

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
        
        // Save preference in memory
        currentView = view;
    });
});

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
        alert(`Viewing details for: ${projectName}\n`);
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
    
    // Number keys 1-3 for view switching
    if (e.key >= '1' && e.key <= '3') {
        const views = ['grid', 'list', 'compact'];
        const viewIndex = parseInt(e.key) - 1;
        if (viewIndex < views.length) {
            const btn = document.querySelector(`[data-view="${views[viewIndex]}"]`);
            if (btn) btn.click();
        }
    }
});

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

// Use event delegation on document for contact triggers
document.addEventListener('click', function(e) {
    // Check if clicked element or its parent has contact-trigger class
    const trigger = e.target.closest('.contact-trigger');
    if (trigger) {
        e.preventDefault();
        e.stopPropagation();
        openModal();
    }
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

// Form Submission Handler
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Disable submit button to prevent double submission
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalButtonHTML = submitBtn.innerHTML;
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
                formStatus.className = 'form-status loading';
                formStatus.style.display = 'block';
            }
            
            // Send email using FormSubmit.co
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
                    message: `From: ${formData.name} (${formData.email})\nTopic: ${formData.topic}\n\nMessage:\n${formData.message}`,
                    _captcha: 'false'
                })
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                // Success!
                if (formStatus) {
                    formStatus.textContent = 'Message sent successfully! We\'ll get back to you soon.';
                    formStatus.className = 'form-status success';
                }
                
                // Reset form and close modal after 2 seconds
                setTimeout(() => {
                    closeModal();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalButtonHTML;
                }, 2000);
            } else {
                throw new Error('Failed to send message');
            }
            
        } catch (error) {
            console.error('Email send error:', error);
            
            // Show error message
            if (formStatus) {
                formStatus.textContent = 'Failed to send message. Please try emailing us directly at rctccsclub@gmail.com';
                formStatus.className = 'form-status error';
            }
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalButtonHTML;
        }
    });
}