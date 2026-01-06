// ========================================
// CALENDAR STATE
// ========================================
let currentDate = new Date();
let currentView = 'month';
let events = JSON.parse(localStorage.getItem('calendarEvents')) || []; // Load from localStorage
let filteredCategories = new Set(['workshop', 'hackathon', 'social', 'meeting', 'deadline']);

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initializeEventHandlers();
    renderCalendar();
    updateUpcomingEvents();
});

// ========================================
// MOBILE MENU
// ========================================
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

// ========================================
// EVENT HANDLERS INITIALIZATION
// ========================================
function initializeEventHandlers() {
    // View switcher buttons
    document.querySelectorAll('.view-mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentView = btn.dataset.view;
            document.querySelectorAll('.view-mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            switchView(currentView);
        });
    });

    // Navigation buttons (prev/next)
    document.getElementById('prevPeriod').addEventListener('click', navigatePrevious);
    document.getElementById('nextPeriod').addEventListener('click', navigateNext);
    
    // Today button
    document.querySelector('.today-btn').addEventListener('click', () => {
        currentDate = new Date();
        renderCalendar();
        showToast('Jumped to today!');
    });

    // Category filter checkboxes
    document.querySelectorAll('.category-filter input').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const category = e.target.dataset.category;
            if (e.target.checked) {
                filteredCategories.add(category);
            } else {
                filteredCategories.delete(category);
            }
            renderCalendar();
            updateUpcomingEvents();
        });
    });

    // Search functionality
    let searchTimeout;
    document.getElementById('eventSearch').addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchEvents(e.target.value);
        }, 300);
    });

    // Modal close handlers
    document.getElementById('closeEventModal').addEventListener('click', closeEventModal);
    document.getElementById('eventModal').addEventListener('click', (e) => {
        if (e.target.id === 'eventModal' || e.target.classList.contains('modal-overlay')) {
            closeEventModal();
        }
    });

    // Share and Export buttons
    document.getElementById('shareCalendar').addEventListener('click', shareCalendar);
    document.getElementById('exportCalendar').addEventListener('click', exportCalendar);

    // RSVP button
    document.getElementById('rsvpEventBtn').addEventListener('click', handleRSVP);

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// ========================================
// VIEW SWITCHING
// ========================================
function switchView(view) {
    document.querySelectorAll('.calendar-view').forEach(v => v.classList.remove('active'));
    document.getElementById(`${view}View`).classList.add('active');
    renderCalendar();
}

// ========================================
// NAVIGATION
// ========================================
function navigatePrevious() {
    switch(currentView) {
        case 'month':
            currentDate.setMonth(currentDate.getMonth() - 1);
            break;
        case 'week':
            currentDate.setDate(currentDate.getDate() - 7);
            break;
        case 'day':
            currentDate.setDate(currentDate.getDate() - 1);
            break;
    }
    renderCalendar();
}

function navigateNext() {
    switch(currentView) {
        case 'month':
            currentDate.setMonth(currentDate.getMonth() + 1);
            break;
        case 'week':
            currentDate.setDate(currentDate.getDate() + 7);
            break;
        case 'day':
            currentDate.setDate(currentDate.getDate() + 1);
            break;
    }
    renderCalendar();
}

// ========================================
// CALENDAR RENDERING
// ========================================
function renderCalendar() {
    updatePeriodLabel();
    
    switch(currentView) {
        case 'month':
            renderMonthView();
            break;
        case 'week':
            renderWeekView();
            break;
        case 'day':
            renderDayView();
            break;
    }
}

function updatePeriodLabel() {
    const label = document.getElementById('currentPeriod');
    const options = { year: 'numeric', month: 'long' };
    
    switch(currentView) {
        case 'month':
            label.textContent = currentDate.toLocaleDateString('en-US', options);
            break;
        case 'week':
            const weekStart = getWeekStart(currentDate);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            label.textContent = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
            break;
        case 'day':
            label.textContent = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            break;
    }
}

// ========================================
// MONTH VIEW
// ========================================
function renderMonthView() {
    const grid = document.getElementById('monthGrid');
    grid.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = prevLastDay.getDate();
    
    const cells = [];
    
    // Previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        cells.push(createMonthCell(new Date(year, month - 1, daysInPrevMonth - i), true));
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        cells.push(createMonthCell(new Date(year, month, day), false));
    }
    
    // Next month days to fill grid
    const remainingCells = 42 - cells.length;
    for (let day = 1; day <= remainingCells; day++) {
        cells.push(createMonthCell(new Date(year, month + 1, day), true));
    }
    
    cells.forEach(cell => grid.appendChild(cell));
}

function createMonthCell(date, otherMonth) {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    if (otherMonth) cell.classList.add('other-month');
    if (isToday(date)) cell.classList.add('today');
    
    const dateDiv = document.createElement('div');
    dateDiv.className = 'cell-date';
    dateDiv.textContent = date.getDate();
    cell.appendChild(dateDiv);
    
    const eventsDiv = document.createElement('div');
    eventsDiv.className = 'cell-events';
    
    const dayEvents = getEventsForDate(date);
    const displayEvents = dayEvents.slice(0, 3);
    
    displayEvents.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = `event-item ${event.category}`;
        eventDiv.textContent = event.title;
        eventDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            showEventDetail(event);
        });
        eventsDiv.appendChild(eventDiv);
    });
    
    if (dayEvents.length > 3) {
        const moreDiv = document.createElement('div');
        moreDiv.className = 'event-more';
        moreDiv.textContent = `+${dayEvents.length - 3} more`;
        moreDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            showDayEvents(date);
        });
        eventsDiv.appendChild(moreDiv);
    }
    
    cell.appendChild(eventsDiv);
    
    // Click on cell to view day
    cell.addEventListener('click', () => {
        currentDate = new Date(date);
        currentView = 'day';
        document.querySelectorAll('.view-mode-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-view="day"]').classList.add('active');
        switchView('day');
    });
    
    return cell;
}

// ========================================
// WEEK VIEW
// ========================================
function renderWeekView() {
    const weekStart = getWeekStart(currentDate);
    const header = document.getElementById('weekHeader');
    const grid = document.getElementById('weekGrid');
    
    header.innerHTML = '<div class="week-header-cell time-label">Time</div>';
    grid.innerHTML = '';
    
    // Create header with days
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        const headerCell = document.createElement('div');
        headerCell.className = 'week-header-cell';
        headerCell.textContent = `${date.toLocaleDateString('en-US', { weekday: 'short' })} ${date.getDate()}`;
        header.appendChild(headerCell);
    }
    
    // Create time slots for each hour
    for (let hour = 0; hour < 24; hour++) {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.textContent = formatHour(hour);
        grid.appendChild(timeSlot);
        
        // Create cells for each day of the week
        for (let day = 0; day < 7; day++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + day);
            date.setHours(hour, 0, 0, 0);
            
            const cell = document.createElement('div');
            cell.className = 'week-cell';
            
            const hourEvents = getEventsForHour(date);
            hourEvents.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = `event-item ${event.category}`;
                eventDiv.textContent = event.title;
                eventDiv.addEventListener('click', () => showEventDetail(event));
                cell.appendChild(eventDiv);
            });
            
            grid.appendChild(cell);
        }
    }
}

// ========================================
// DAY VIEW
// ========================================
function renderDayView() {
    const header = document.getElementById('dayHeader');
    const timeline = document.getElementById('dayTimeline');
    
    header.innerHTML = `
        <h3>${currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h3>
    `;
    
    timeline.innerHTML = '';
    
    // Create timeline for each hour
    for (let hour = 0; hour < 24; hour++) {
        const hourDiv = document.createElement('div');
        hourDiv.className = 'timeline-hour';
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'timeline-time';
        timeDiv.textContent = formatHour(hour);
        
        const eventsDiv = document.createElement('div');
        eventsDiv.className = 'timeline-events';
        
        const date = new Date(currentDate);
        date.setHours(hour, 0, 0, 0);
        const hourEvents = getEventsForHour(date);
        
        hourEvents.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = `timeline-event ${event.category}`;
            eventDiv.innerHTML = `
                <strong>${event.title}</strong><br>
                <small>${formatTime(event.start)} - ${formatTime(event.end)}</small>
                ${event.location ? `<br><small><i class="fas fa-map-marker-alt"></i> ${event.location}</small>` : ''}
            `;
            eventDiv.addEventListener('click', () => showEventDetail(event));
            eventsDiv.appendChild(eventDiv);
        });
        
        hourDiv.appendChild(timeDiv);
        hourDiv.appendChild(eventsDiv);
        timeline.appendChild(hourDiv);
    }
}

// ========================================
// HELPER FUNCTIONS
// ========================================
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
}

function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

function isSameDay(d1, d2) {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
}

function getEventsForDate(date) {
    return events.filter(event => {
        return isSameDay(event.start, date) && filteredCategories.has(event.category);
    }).sort((a, b) => a.start - b.start);
}

function getEventsForHour(date) {
    return events.filter(event => {
        const eventHour = event.start.getHours();
        return isSameDay(event.start, date) && 
               eventHour === date.getHours() &&
               filteredCategories.has(event.category);
    }).sort((a, b) => a.start - b.start);
}

function formatHour(hour) {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    return `${h}:00 ${ampm}`;
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

// ========================================
// EVENT DETAIL MODAL
// ========================================
function showEventDetail(event) {
    const modal = document.getElementById('eventModal');
    const header = document.getElementById('eventDetailHeader');
    const body = document.getElementById('eventDetailBody');
    
    header.innerHTML = `
        <h2>${event.title}</h2>
        <span class="color-dot ${event.category}"></span>
    `;
    
    body.innerHTML = `
        <div class="detail-row">
            <i class="fas fa-clock"></i>
            <div class="detail-content">
                <div class="detail-label">Time</div>
                <div class="detail-value">${formatTime(event.start)} - ${formatTime(event.end)}</div>
            </div>
        </div>
        <div class="detail-row">
            <i class="fas fa-calendar"></i>
            <div class="detail-content">
                <div class="detail-label">Date</div>
                <div class="detail-value">${event.start.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
        </div>
        ${event.location ? `
        <div class="detail-row">
            <i class="fas fa-map-marker-alt"></i>
            <div class="detail-content">
                <div class="detail-label">Location</div>
                <div class="detail-value">${event.location}</div>
            </div>
        </div>` : ''}
        ${event.description ? `
        <div class="detail-row">
            <i class="fas fa-align-left"></i>
            <div class="detail-content">
                <div class="detail-label">Description</div>
                <div class="detail-value">${event.description}</div>
            </div>
        </div>` : ''}
        <div class="detail-row">
            <i class="fas fa-tag"></i>
            <div class="detail-content">
                <div class="detail-label">Category</div>
                <div class="detail-value">${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeEventModal() {
    document.getElementById('eventModal').classList.remove('active');
}

// ========================================
// UPCOMING EVENTS LIST
// ========================================
function updateUpcomingEvents() {
    const container = document.getElementById('upcomingEventsList');
    const now = new Date();
    const upcoming = events
        .filter(e => e.start > now && filteredCategories.has(e.category))
        .sort((a, b) => a.start - b.start)
        .slice(0, 5);
    
    if (upcoming.length === 0) {
        container.innerHTML = '<p style="color: #666; font-size: 0.85rem; text-align: center; padding: 20px;">No upcoming events</p>';
        return;
    }
    
    container.innerHTML = upcoming.map(event => `
        <div class="upcoming-event-item" onclick="showEventDetailById(${event.id})">
            <div class="event-date-small">${event.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            <div class="event-title-small">${event.title}</div>
        </div>
    `).join('');
}

function showEventDetailById(eventId) {
    const event = events.find(e => e.id === eventId);
    if (event) {
        showEventDetail(event);
    }
}

// ========================================
// SEARCH FUNCTIONALITY
// ========================================
function searchEvents(query) {
    if (!query) {
        renderCalendar();
        return;
    }
    
    const lowerQuery = query.toLowerCase();
    const results = events.filter(e => 
        e.title.toLowerCase().includes(lowerQuery) ||
        (e.description && e.description.toLowerCase().includes(lowerQuery)) ||
        (e.location && e.location.toLowerCase().includes(lowerQuery))
    );
    
    if (results.length > 0) {
        showToast(`Found ${results.length} event(s) matching "${query}"`);
    } else {
        showToast(`No events found matching "${query}"`);
    }
}

function showDayEvents(date) {
    currentDate = new Date(date);
    currentView = 'day';
    document.querySelectorAll('.view-mode-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-view="day"]').classList.add('active');
    switchView('day');
}

// ========================================
// SHARE CALENDAR
// ========================================
function shareCalendar() {
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'RCTC CS Club Calendar',
            text: 'Check out our upcoming events!',
            url: url
        }).then(() => {
            showToast('Calendar shared successfully!');
        }).catch(() => {
            // Fallback to clipboard
            copyToClipboard(url);
        });
    } else {
        // Use clipboard fallback
        copyToClipboard(url);
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Calendar link copied to clipboard!');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showToast('Calendar link copied to clipboard!');
    } catch (err) {
        showToast('Unable to copy link. Please copy manually.');
    }
    
    document.body.removeChild(textarea);
}

// ========================================
// EXPORT CALENDAR
// ========================================
async function exportCalendar() {
    showToast('Preparing calendar download...');
    
    try {
        // Get visible events for current view
        const visibleEvents = events.filter(e => filteredCategories.has(e.category));
        
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = 1200;
        canvas.height = 800;
        
        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Title
        ctx.fillStyle = '#1b1261';
        ctx.font = 'bold 36px "Space Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('RCTC CS Club Events Calendar', canvas.width / 2, 60);
        
        // Period text
        ctx.font = '24px "Space Mono", monospace';
        ctx.fillStyle = '#4f5bc9';
        let periodText = '';
        
        switch(currentView) {
            case 'month':
                periodText = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
                break;
            case 'week':
                const weekStart = getWeekStart(currentDate);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                periodText = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
                break;
            case 'day':
                periodText = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                break;
        }
        ctx.fillText(periodText, canvas.width / 2, 100);
        
        // Get events to display
        let eventsToShow = [];
        if (currentView === 'month') {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            eventsToShow = visibleEvents.filter(e => e.start >= firstDay && e.start <= lastDay);
        } else if (currentView === 'week') {
            const weekStart = getWeekStart(currentDate);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 7);
            eventsToShow = visibleEvents.filter(e => e.start >= weekStart && e.start < weekEnd);
        } else {
            eventsToShow = getEventsForDate(currentDate);
        }
        
        eventsToShow.sort((a, b) => a.start - b.start);
        
        // Draw events
        ctx.textAlign = 'left';
        ctx.font = '16px "Space Mono", monospace';
        let y = 160;
        const lineHeight = 35;
        const maxEvents = Math.floor((canvas.height - 200) / lineHeight);
        
        if (eventsToShow.length === 0) {
            ctx.fillStyle = '#666';
            ctx.font = 'italic 18px "Space Mono", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('No events scheduled for this period', canvas.width / 2, y + 100);
        } else {
            const colors = {
                workshop: '#2196F3',
                hackathon: '#FF5722',
                social: '#4CAF50',
                meeting: '#9C27B0',
                deadline: '#FF9800'
            };
            
            eventsToShow.slice(0, maxEvents).forEach((event) => {
                // Category dot
                ctx.fillStyle = colors[event.category] || '#666';
                ctx.beginPath();
                ctx.arc(50, y + 8, 8, 0, 2 * Math.PI);
                ctx.fill();
                
                // Event date
                ctx.fillStyle = '#666';
                ctx.font = '14px "Space Mono", monospace';
                const dateStr = event.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                ctx.fillText(dateStr, 80, y + 5);
                
                // Event title
                ctx.fillStyle = '#1b1261';
                ctx.font = 'bold 16px "Space Mono", monospace';
                ctx.fillText(event.title, 80, y + 25);
                
                // Event time and location
                ctx.fillStyle = '#666';
                ctx.font = '14px "Space Mono", monospace';
                const timeStr = `${formatTime(event.start)} - ${formatTime(event.end)}`;
                const locationStr = event.location ? ` • ${event.location}` : '';
                ctx.fillText(timeStr + locationStr, 200, y + 5);
                
                y += lineHeight;
            });
            
            if (eventsToShow.length > maxEvents) {
                ctx.fillStyle = '#4f5bc9';
                ctx.font = 'italic 16px "Space Mono", monospace';
                ctx.fillText(`... and ${eventsToShow.length - maxEvents} more events`, 80, y);
            }
        }
        
        // Footer
        ctx.fillStyle = '#999';
        ctx.font = '14px "Space Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('RCTC Computer Science Club', canvas.width / 2, canvas.height - 30);
        
        // Download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `rctc-cs-calendar-${currentView}-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('Calendar downloaded successfully!');
        }, 'image/png');
        
    } catch (error) {
        console.error('Export error:', error);
        showToast('Failed to export calendar. Please try again.');
    }
}

// ========================================
// RSVP HANDLER
// ========================================
function handleRSVP() {
    // In production, this would send data to a backend
    showToast('RSVP submitted! Check your email for confirmation.');
    closeEventModal();
}

// ========================================
// TOAST NOTIFICATIONS
// ========================================
function showToast(message) {
    const toast = document.getElementById('toast');
    const messageEl = document.getElementById('toastMessage');
    messageEl.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================
function handleKeyboardShortcuts(e) {
    // Don't trigger shortcuts when typing in input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            navigatePrevious();
            break;
        case 'ArrowRight':
            e.preventDefault();
            navigateNext();
            break;
        case 't':
        case 'T':
            e.preventDefault();
            currentDate = new Date();
            renderCalendar();
            showToast('Jumped to today!');
            break;
        case '1':
            e.preventDefault();
            switchToView('month');
            break;
        case '2':
            e.preventDefault();
            switchToView('week');
            break;
        case '3':
            e.preventDefault();
            switchToView('day');
            break;
        case 'Escape':
            closeEventModal();
            break;
    }
}

function switchToView(view) {
    currentView = view;
    document.querySelectorAll('.view-mode-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-view="${view}"]`).classList.add('active');
    switchView(view);
    showToast(`Switched to ${view} view`);
}

// ========================================
// EVENT MANAGEMENT (For Admin Use)
// ========================================
// Function to add events - called from admin panel
function addEvent(eventData) {
    /*
    Example eventData format:
    {
        id: 1,
        title: "Event Name",
        start: new Date(2026, 0, 15, 18, 0),
        end: new Date(2026, 0, 15, 20, 0),
        category: "workshop", // workshop, hackathon, social, meeting, deadline
        location: "Room 301",
        description: "Event description"
    }
    */
    events.push(eventData);
    saveEventsToLocalStorage();
    renderCalendar();
    updateUpcomingEvents();
    showToast('Event added successfully!');
}

// Function to delete event
function deleteEvent(eventId) {
    events = events.filter(e => e.id !== eventId);
    saveEventsToLocalStorage();
    renderCalendar();
    updateUpcomingEvents();
    showToast('Event deleted successfully!');
}

// Save events to localStorage
function saveEventsToLocalStorage() {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
}

// Load events and convert date strings back to Date objects
function loadEventsFromLocalStorage() {
    const stored = localStorage.getItem('calendarEvents');
    if (stored) {
        events = JSON.parse(stored).map(event => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end)
        }));
    }
}

// Call on page load
loadEventsFromLocalStorage();

// Export for potential admin panel integration
window.calendarAPI = {
    addEvent,
    deleteEvent,
    events,
    renderCalendar,
    updateUpcomingEvents,
    saveEventsToLocalStorage
};