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
let currentCategory = 'all';
let currentYear = 'all';

const categoryBtns = document.querySelectorAll('.category-btn');
const yearBtns = document.querySelectorAll('.year-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const emptyState = document.getElementById('emptyState');
const visiblePhotosEl = document.getElementById('visiblePhotos');

function filterGallery() {
    let visibleCount = 0;
    
    galleryItems.forEach(item => {
        const itemCategory = item.dataset.category;
        const itemYear = item.dataset.year;
        
        const categoryMatch = currentCategory === 'all' || itemCategory === currentCategory;
        const yearMatch = currentYear === 'all' || itemYear === currentYear;
        
        if (categoryMatch && yearMatch) {
            item.style.display = '';
            item.style.animation = 'fadeIn 0.5s ease';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    visiblePhotosEl.textContent = visibleCount;
    
    if (visibleCount === 0) {
        emptyState.style.display = 'block';
        document.getElementById('galleryGrid').style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        document.getElementById('galleryGrid').style.display = 'grid';
    }
}

// Category filter
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        filterGallery();
    });
});

// Year filter
yearBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        yearBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentYear = btn.dataset.year;
        filterGallery();
    });
});

// View toggle
const viewToggles = document.querySelectorAll('.view-toggle');
const galleryGrid = document.getElementById('galleryGrid');

viewToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        viewToggles.forEach(t => t.classList.remove('active'));
        toggle.classList.add('active');
        
        const view = toggle.dataset.view;
        if (view === 'masonry') {
            galleryGrid.classList.add('masonry');
        } else {
            galleryGrid.classList.remove('masonry');
        }
    });
});

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeLightbox = document.getElementById('closeLightbox');
const prevImage = document.getElementById('prevImage');
const nextImage = document.getElementById('nextImage');

let currentImageIndex = 0;
let visibleImages = [];

function updateVisibleImages() {
    visibleImages = Array.from(galleryItems).filter(item => {
        return item.style.display !== 'none' && item.querySelector('img');
    });
}

function openLightbox(index) {
    updateVisibleImages();
    if (visibleImages.length === 0) return;
    
    currentImageIndex = index;
    const item = visibleImages[currentImageIndex];
    const img = item.querySelector('img');
    const info = item.querySelector('.item-info');
    
    if (img) {
        lightboxImage.src = img.src;
        if (info) {
            lightboxCaption.textContent = `${info.querySelector('h3').textContent} - ${info.querySelector('p').textContent}`;
        }
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightboxFn() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
    openLightbox(currentImageIndex);
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
    openLightbox(currentImageIndex);
}

// Event listeners for lightbox
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        const allVisibleItems = Array.from(galleryItems).filter(i => i.style.display !== 'none');
        const visibleIndex = allVisibleItems.indexOf(item);
        openLightbox(visibleIndex);
    });
});

closeLightbox.addEventListener('click', closeLightboxFn);
prevImage.addEventListener('click', showPrevImage);
nextImage.addEventListener('click', showNextImage);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightboxFn();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightboxFn();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        }
    }
});

// Animate gallery items on load
window.addEventListener('load', () => {
    galleryItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.05}s`;
    });
});

console.log('Gallery loaded successfully!');