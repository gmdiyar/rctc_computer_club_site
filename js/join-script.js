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
document.querySelectorAll('.dropdown-header').forEach(header => {
    header.addEventListener('click', () => {
        header.parentElement.classList.toggle('active');
    });
});

// FAQ accordion functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        question.parentElement.classList.toggle('active');
    });
});

// ================================
// JOIN FORM SUBMISSION WITH EMAIL
// ================================

const signupForm = document.getElementById('signupForm');
const formStatus = document.getElementById('formStatus');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get submit button
    const submitBtn = signupForm.querySelector('.submit-btn');
    const originalBtnContent = submitBtn.innerHTML;
    
    // Disable submit button to prevent double submission
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    // Collect form data
    const formData = new FormData(signupForm);
    
    // Get all checked interests
    const interests = Array.from(formData.getAll('interests')).join(', ');
    
    // Build form data object
    const applicationData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        studentId: formData.get('studentId') || 'Not provided',
        major: formData.get('major') || 'Not provided',
        experience: formData.get('experience'),
        interests: interests || 'None selected',
        reason: formData.get('reason') || 'Not provided'
    };
    
    // Show loading state
    if (formStatus) {
        formStatus.textContent = 'Submitting your application...';
        formStatus.className = 'form-status loading';
        formStatus.style.display = 'block';
    }
    
    try {
        // Create formatted message for email
        const emailMessage = `
NEW CLUB MEMBERSHIP APPLICATION
================================

Personal Information:
- Name: ${applicationData.firstName} ${applicationData.lastName}
- Email: ${applicationData.email}
- Student ID: ${applicationData.studentId}
- Program/Major: ${applicationData.major}

Experience & Interests:
- Experience Level: ${applicationData.experience}
- Areas of Interest: ${applicationData.interests}

Why They Want to Join:
${applicationData.reason}

================================
Application submitted via website join form
        `.trim();
        
        // Send email using FormSubmit.co
        const response = await fetch('https://formsubmit.co/ajax/rctccsclub@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: `${applicationData.firstName} ${applicationData.lastName}`,
                email: applicationData.email,
                subject: `[RCTC CS Club] New Membership Application - ${applicationData.firstName} ${applicationData.lastName}`,
                message: emailMessage,
                _captcha: 'false',
                _template: 'table'
            })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            // Success!
            if (formStatus) {
                formStatus.innerHTML = `
                    <i class="fas fa-check-circle"></i> 
                    Application submitted successfully! We'll contact you at ${applicationData.email} soon.
                `;
                formStatus.className = 'form-status success';
            }
            
            // Reset form
            signupForm.reset();
            
            // Scroll to success message
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Re-enable button after delay
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }, 3000);
            
        } else {
            throw new Error('Failed to submit application');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        
        // Show error message
        if (formStatus) {
            formStatus.innerHTML = `
                <i class="fas fa-exclamation-circle"></i> 
                Failed to submit application. Please try again or email us directly at rctccsclub@gmail.com
            `;
            formStatus.className = 'form-status error';
        }
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
        
        // Scroll to error message
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

// Form validation feedback
const requiredInputs = signupForm.querySelectorAll('[required]');
requiredInputs.forEach(input => {
    input.addEventListener('invalid', (e) => {
        e.preventDefault();
        input.style.borderColor = '#f44336';
        
        setTimeout(() => {
            input.style.borderColor = '';
        }, 3000);
    });
    
    input.addEventListener('input', () => {
        input.style.borderColor = '';
    });
});

console.log('RCTC CS Club - Join page loaded successfully');