// ===================================
// HAMBURGER MENU FUNCTIONALITY
// ===================================
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

// ===================================
// DROPDOWN SECTIONS FUNCTIONALITY
// ===================================
const dropdownHeaders = document.querySelectorAll('.dropdown-header');

dropdownHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const section = header.parentElement;
        section.classList.toggle('active');
    });
});

// ===================================
// EVENT FILTERING FUNCTIONALITY
// ===================================
const filterBtns = document.querySelectorAll('.filter-btn');
const eventCards = document.querySelectorAll('.event-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        // Filter events
        eventCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ===================================
// CONTACT MODAL FUNCTIONALITY
// ===================================
const contactModal = document.getElementById('contactModal');
const contactTriggers = document.querySelectorAll('.contact-trigger');
const closeModalBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

// Open contact modal
contactTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        contactModal.classList.add('active');
        document.body.classList.add('modal-open');
    });
});

// Close contact modal
function closeContactModal() {
    contactModal.classList.remove('active');
    document.body.classList.remove('modal-open');
    formStatus.className = 'form-status';
    formStatus.textContent = '';
}

closeModalBtn.addEventListener('click', closeContactModal);
cancelBtn.addEventListener('click', closeContactModal);

// Close on overlay click
contactModal.querySelector('.modal-overlay').addEventListener('click', closeContactModal);

// Handle form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Show success message
    formStatus.className = 'form-status success';
    formStatus.textContent = '✓ Message sent successfully! We\'ll get back to you soon.';
    
    // Reset form
    contactForm.reset();
    
    // Close modal after 2 seconds
    setTimeout(() => {
        closeContactModal();
    }, 2000);
});

// ===================================
// EVENT DETAILS MODAL FUNCTIONALITY
// ===================================
const eventModal = document.getElementById('eventModal');
const closeEventModalBtn = document.getElementById('closeEventModal');
const eventDetailTriggers = document.querySelectorAll('.event-detail-trigger');

// Event data
const eventData = {
    'pc-refurbishing': {
        title: 'PC Refurbishing Project',
        date: 'Spring Semester 2025',
        time: 'TBD',
        location: 'RCTC Campus',
        description: `
            <h3>About This Event</h3>
            <p>Join us for an exciting opportunity to give back to the community while gaining hands-on experience with computer hardware and cybersecurity!</p>
            
            <h3>What We'll Do</h3>
            <ul>
                <li><strong>Secure Data Wiping:</strong> Learn professional data sanitization techniques to ensure all sensitive information is permanently removed</li>
                <li><strong>Hardware Assessment:</strong> Evaluate and test computer components to determine functionality</li>
                <li><strong>System Restoration:</strong> Reset operating systems and install essential software</li>
                <li><strong>Quality Control:</strong> Perform final testing to ensure devices are ready for their new owners</li>
            </ul>
            
            <h3>Community Impact</h3>
            <p>The refurbished computers will be either sold at affordable prices or donated to students and community members who need them. This project helps bridge the digital divide while keeping electronics out of landfills.</p>
            
            <h3>Skills You'll Gain</h3>
            <ul>
                <li>Cybersecurity fundamentals and data protection</li>
                <li>Computer hardware diagnostics and repair</li>
                <li>Operating system installation and configuration</li>
                <li>Volunteering and community service experience</li>
            </ul>
            
            <h3>Who Should Attend</h3>
            <p>This event is open to all club members and interested students. No prior technical experience is required - we'll teach you everything you need to know!</p>
        `,
        tags: ['Cyber Security', 'Volunteering Opportunity', 'Fund Raising', 'Hands-On Learning']
    }
};

// Open event modal
eventDetailTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const eventId = trigger.getAttribute('data-event');
        const event = eventData[eventId];
        
        if (event) {
            // Populate modal with event data
            document.getElementById('eventModalTitle').textContent = event.title;
            document.getElementById('eventModalDate').textContent = event.date;
            document.getElementById('eventModalTime').textContent = event.time;
            document.getElementById('eventModalLocation').textContent = event.location;
            document.getElementById('eventModalDescription').innerHTML = event.description;
            
            // Add tags
            const tagsContainer = document.getElementById('eventModalTags');
            tagsContainer.innerHTML = '';
            event.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'tag';
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            });
            
            // Show modal
            eventModal.classList.add('active');
            document.body.classList.add('modal-open');
        }
    });
});

// Close event modal
function closeEventModal() {
    eventModal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

closeEventModalBtn.addEventListener('click', closeEventModal);

// Close on overlay click
eventModal.querySelector('.modal-overlay').addEventListener('click', closeEventModal);

// RSVP button functionality
let currentEventTitle = '';

document.getElementById('rsvpBtn').addEventListener('click', () => {
    // Get the current event title
    currentEventTitle = document.getElementById('eventModalTitle').textContent;
    
    // Update RSVP modal title
    document.getElementById('rsvpEventTitle').textContent = currentEventTitle;
    
    // Close event details modal
    closeEventModal();
    
    // Open RSVP modal
    setTimeout(() => {
        openRsvpModal();
    }, 300);
});

// ===================================
// RSVP FORM MODAL FUNCTIONALITY
// ===================================
const rsvpModal = document.getElementById('rsvpModal');
const closeRsvpModalBtn = document.getElementById('closeRsvpModal');
const cancelRsvpBtn = document.getElementById('cancelRsvpBtn');
const rsvpForm = document.getElementById('rsvpForm');
const rsvpFormStatus = document.getElementById('rsvpFormStatus');

// Open RSVP modal
function openRsvpModal() {
    if (rsvpModal) {
        rsvpModal.classList.add('active');
        document.body.classList.add('modal-open');
        if (rsvpFormStatus) {
            rsvpFormStatus.style.display = 'none';
            rsvpFormStatus.className = 'form-status';
        }
    }
}

// Close RSVP modal
function closeRsvpModal() {
    if (rsvpModal) {
        rsvpModal.classList.remove('active');
        document.body.classList.remove('modal-open');
        if (rsvpForm) {
            rsvpForm.reset();
        }
        if (rsvpFormStatus) {
            rsvpFormStatus.style.display = 'none';
            rsvpFormStatus.className = 'form-status';
        }
    }
}

// Event listeners for closing RSVP modal
if (closeRsvpModalBtn) {
    closeRsvpModalBtn.addEventListener('click', closeRsvpModal);
}

if (cancelRsvpBtn) {
    cancelRsvpBtn.addEventListener('click', closeRsvpModal);
}

// Close on overlay click
if (rsvpModal) {
    rsvpModal.querySelector('.modal-overlay').addEventListener('click', closeRsvpModal);
}

// Handle RSVP form submission
if (rsvpForm) {
    rsvpForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Disable submit button to prevent double submission
        const submitBtn = rsvpForm.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Get form data
        const formData = {
            name: document.getElementById('rsvpName').value,
            email: document.getElementById('rsvpEmail').value,
            message: document.getElementById('rsvpMessage').value || 'No additional comments'
        };
        
        try {
            // Show loading state
            if (rsvpFormStatus) {
                rsvpFormStatus.textContent = 'Submitting your RSVP...';
                rsvpFormStatus.className = 'form-status';
                rsvpFormStatus.style.display = 'block';
                rsvpFormStatus.style.background = '#e3f2fd';
                rsvpFormStatus.style.color = '#1976d2';
                rsvpFormStatus.style.border = '2px solid #2196f3';
            }
            
            // Create form body for FormSubmit
            const formBody = new FormData();
            formBody.append('name', formData.name);
            formBody.append('email', formData.email);
            formBody.append('_subject', `[RSVP] ${currentEventTitle}`);
            formBody.append('Event', currentEventTitle);
            formBody.append('Additional Comments', formData.message);
            formBody.append('_captcha', 'false');
            formBody.append('_template', 'table');
            
            // Send email using FormSubmit.co
            const response = await fetch('https://formsubmit.co/rctccsclub@gmail.com', {
                method: 'POST',
                body: formBody,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success!
                if (rsvpFormStatus) {
                    rsvpFormStatus.textContent = '✓ RSVP submitted successfully! We\'ll send you more details via email.';
                    rsvpFormStatus.className = 'form-status success';
                }
                
                // Reset form and close modal after 2 seconds
                setTimeout(() => {
                    closeRsvpModal();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Confirm RSVP';
                }, 2000);
            } else {
                throw new Error('Failed to submit RSVP');
            }
            
        } catch (error) {
            console.error('RSVP submission error:', error);
            
            // Show error message
            if (rsvpFormStatus) {
                rsvpFormStatus.textContent = '✗ Failed to submit RSVP. Please try again or email us directly at rctccsclub@gmail.com';
                rsvpFormStatus.className = 'form-status error';
            }
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Confirm RSVP';
        }
    });
}

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (contactModal && contactModal.classList.contains('active')) {
            closeModal();
        }
        if (eventModal && eventModal.classList.contains('active')) {
            closeEventModal();
        }
        if (rsvpModal && rsvpModal.classList.contains('active')) {
            closeRsvpModal();
        }
    }
});