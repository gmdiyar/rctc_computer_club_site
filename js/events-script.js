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

generateCalendar();