// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const body = document.body;
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        // You can add mobile menu functionality here
    });
    
    // Gallery item click handlers
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            const img = this.querySelector('img');
            
            // Create modal or lightbox effect
            showLightbox(img.src, title);
        });
        
        // Add keyboard navigation
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Make items focusable
        item.setAttribute('tabindex', '0');
    });
    
    // Smooth scroll effect for page load
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // Lazy loading for images
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
});

// Lightbox functionality
function showLightbox(imageSrc, title) {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            <img src="${imageSrc}" alt="${title}">
            <h3>${title}</h3>
        </div>
        <div class="lightbox-backdrop"></div>
    `;
    
    // Add lightbox styles
    const lightboxStyles = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }
        
        .lightbox-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: scaleIn 0.3s ease;
        }
        
        .lightbox-content img {
            width: 100%;
            height: auto;
            max-height: 70vh;
            object-fit: contain;
            border-radius: 8px;
        }
        
        .lightbox-content h3 {
            margin-top: 15px;
            text-align: center;
            color: #333;
            font-size: 1.2rem;
            font-weight: 400;
        }
        
        .lightbox-close {
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            font-size: 2rem;
            color: #666;
            cursor: pointer;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
        }
        
        .lightbox-close:hover {
            background: #f0f0f0;
            color: #333;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
    `;
    
    // Add styles to head if not already present
    if (!document.querySelector('#lightbox-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'lightbox-styles';
        styleSheet.textContent = lightboxStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Add to body
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Close functionality
    const closeLightbox = () => {
        lightbox.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            document.body.removeChild(lightbox);
            document.body.style.overflow = '';
        }, 300);
    };
    
    // Add fadeOut animation
    if (!document.querySelector('#fadeout-animation')) {
        const fadeOutStyle = document.createElement('style');
        fadeOutStyle.id = 'fadeout-animation';
        fadeOutStyle.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(fadeOutStyle);
    }
    
    // Event listeners
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
    
    // Keyboard navigation
    document.addEventListener('keydown', function handleKeyDown(e) {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', handleKeyDown);
        }
    });
}

// Place this after your renderGallery function, before </script>
let currentImages = [];
let currentIndex = 0;

function openLightbox(images, index) {
    currentImages = images;
    currentIndex = index;
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    img.src = images[index].src;
    img.alt = images[index].alt;
    caption.textContent = images[index].title;
    lightbox.classList.remove('hidden');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.add('hidden');
}

function showLightboxImage(index) {
    if (!currentImages.length) return;
    currentIndex = (index + currentImages.length) % currentImages.length;
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    img.src = currentImages[currentIndex].src;
    img.alt = currentImages[currentIndex].alt;
    caption.textContent = currentImages[currentIndex].title;
}

// Add click events to gallery items after rendering
function addGalleryItemListeners(images) {
    document.querySelectorAll('.gallery-item img').forEach((img, idx) => {
        img.addEventListener('click', () => openLightbox(images, idx));
    });
}

// Update renderGallery to add listeners
function renderGallery(category) {
    const grid = document.getElementById('gallery-grid');
    grid.innerHTML = '';
    const images = galleryData[category];
    images.forEach(item => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `
            <img src="${item.src}" alt="${item.alt}">
            <div class="gallery-overlay">
                <h3>${item.title}</h3>
            </div>
        `;
        grid.appendChild(div);
    });
    addGalleryItemListeners(images);
}

// Lightbox controls
document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('gallery-category');
    renderGallery(select.value);
    select.addEventListener('change', e => renderGallery(e.target.value));

    document.getElementById('lightbox-close').onclick = closeLightbox;
    document.getElementById('lightbox-prev').onclick = () => showLightboxImage(currentIndex - 1);
    document.getElementById('lightbox-next').onclick = () => showLightboxImage(currentIndex + 1);

    // Close on overlay click or ESC
    document.getElementById('lightbox').addEventListener('click', e => {
        if (e.target === e.currentTarget) closeLightbox();
    });
    document.addEventListener('keydown', e => {
        if (document.getElementById('lightbox').classList.contains('hidden')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showLightboxImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showLightboxImage(currentIndex + 1);
    });
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.classList.add('loaded');
    });
    
    img.addEventListener('error', function() {
        this.classList.add('error');
        // You could add a placeholder image here
    });
});

// Schema.org JSON-LD structured data
document.addEventListener('DOMContentLoaded', () => {
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "PM Global Solutions (Pty) Ltd",
        "url": "https://www.pmglobalsolutions.co.za",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.pmglobalsolutions.co.za/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    const script = document.createElement('script');
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schemaData);
    document.head.appendChild(script);
});