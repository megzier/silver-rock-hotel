// Silver Rock V1.19 — universal image lightbox for all resort photography
let currentImageIndex = 0;
let galleryImages = [];

function normalizeImageSource(source) {
    if (!source) return '';
    try { return new URL(source, document.baseURI).href; } catch (_) { return source; }
}

function collectViewableImages() {
    const selectors = [
        '.silver-hero-img',
        '.welcome-image-frame img',
        '.lux-rooms-section img',
        '.dining-media img',
        '.spa-media > img',
        '.lux-facility-media img',
        '.gallery-section img',
        '.gal-item img',
        '[data-lightbox-photo]'
    ];
    const nodes = Array.from(document.querySelectorAll(selectors.join(',')));
    const sources = [];
    nodes.forEach(img => {
        if (!img || img.id === 'lightbox-img') return;
        const src = normalizeImageSource(img.currentSrc || img.getAttribute('src'));
        if (src && !sources.includes(src)) sources.push(src);
    });
    return sources;
}

function ensureLightbox() {
    if (document.getElementById('lightbox')) return;
    document.body.insertAdjacentHTML('beforeend', `
        <div id="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
            <button type="button" class="lightbox-close" onclick="closeLightbox()" aria-label="Close image viewer">&times;</button>
            <button type="button" class="lightbox-prev" onclick="changeImage(-1)" aria-label="Previous image">&#10094;</button>
            <img class="lightbox-content" id="lightbox-img" alt="Full-size resort photograph">
            <button type="button" class="lightbox-next" onclick="changeImage(1)" aria-label="Next image">&#10095;</button>
        </div>
    `);
}

function openLightbox(indexOrSource) {
    ensureLightbox();
    galleryImages = collectViewableImages();
    if (typeof indexOrSource === 'string') {
        const target = normalizeImageSource(indexOrSource);
        let index = galleryImages.indexOf(target);
        if (index < 0) {
            galleryImages.push(target);
            index = galleryImages.length - 1;
        }
        currentImageIndex = index;
    } else {
        currentImageIndex = Math.max(0, Math.min(Number(indexOrSource) || 0, galleryImages.length - 1));
    }
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    if (!lb || !img || !galleryImages.length) return;
    img.src = galleryImages[currentImageIndex];
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.querySelector('.lightbox-close')?.focus();
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (lb) lb.classList.remove('active', 'room-preview');
    document.body.style.overflow = '';
}

function changeImage(direction) {
    galleryImages = collectViewableImages();
    if (!galleryImages.length) return;
    currentImageIndex = (currentImageIndex + Number(direction || 0) + galleryImages.length) % galleryImages.length;
    const img = document.getElementById('lightbox-img');
    if (!img) return;
    img.style.opacity = '0';
    window.setTimeout(() => {
        img.src = galleryImages[currentImageIndex];
        img.style.opacity = '1';
    }, 130);
}

function activateImage(img) {
    if (!img || img.dataset.lightboxReady === 'true') return;
    img.dataset.lightboxReady = 'true';
    img.classList.add('image-viewable');
    img.setAttribute('tabindex', '0');
    if (!img.getAttribute('title')) img.setAttribute('title', 'Click to view full image');
    const open = event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        openLightbox(img.currentSrc || img.src);
    };
    img.addEventListener('click', open);
    img.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') open(event);
    });
}

function setupUniversalImages() {
    const selectors = [
        '.silver-hero-img',
        '.welcome-image-frame img',
        '.lux-rooms-section img',
        '.dining-media img',
        '.spa-media > img',
        '.lux-facility-media img',
        '.gallery-section img',
        '.gal-item img',
        '[data-lightbox-photo]'
    ];
    document.querySelectorAll(selectors.join(',')).forEach(activateImage);

    document.querySelectorAll('.gal-item, .gallery-item-luxury, [data-lightbox-room]').forEach(link => {
        if (link.dataset.lightboxLinkReady === 'true') return;
        link.dataset.lightboxLinkReady = 'true';
        link.addEventListener('click', event => {
            event.preventDefault();
            event.stopImmediatePropagation();
            openLightbox(link.getAttribute('href'));
        });
    });

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.target.tagName === 'IMG') activateImage(mutation.target);
            mutation.addedNodes.forEach(node => {
                if (!(node instanceof Element)) return;
                if (node.tagName === 'IMG') activateImage(node);
                node.querySelectorAll?.('img').forEach(activateImage);
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
}

document.addEventListener('DOMContentLoaded', () => {
    ensureLightbox();
    setupUniversalImages();
    document.getElementById('lightbox')?.addEventListener('click', event => {
        if (event.target.id === 'lightbox') closeLightbox();
    });
    document.addEventListener('keydown', event => {
        const lb = document.getElementById('lightbox');
        if (!lb?.classList.contains('active')) return;
        if (event.key === 'Escape') closeLightbox();
        if (event.key === 'ArrowLeft') changeImage(-1);
        if (event.key === 'ArrowRight') changeImage(1);
    });
});
