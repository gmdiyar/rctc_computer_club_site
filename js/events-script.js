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

// Filter functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const eventCards = document.querySelectorAll('.event-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        eventCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Simple calendar generation
function generateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Event dates (simplified)
    const eventDates = [8, 10, 12, 15, 17, 22, 25];
    
    calendarGrid.innerHTML = '';
    
    // Add day labels
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(day => {
        const dayLabel = document.createElement('div');
        dayLabel.textContent = day;
        dayLabel.style.fontWeight = '700';
        dayLabel.style.color = 'var(--two)';
        dayLabel.style.fontSize = '12px';
        dayLabel.style.textAlign = 'center';
        calendarGrid.appendChild(dayLabel);
    });
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        calendarGrid.appendChild(emptyCell);
    }
    
    // Add day cells
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.textContent = day;
        dayCell.className = 'calendar-day';
        
        if (day === today.getDate()) {
            dayCell.classList.add('today');
        }
        
        if (eventDates.includes(day)) {
            dayCell.classList.add('has-event');
        }
        
        calendarGrid.appendChild(dayCell);
    }
}

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

generateCalendar();