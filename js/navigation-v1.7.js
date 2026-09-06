/* Silver Rock Boutique Resort — navigation v1.7 */
(function () {
    'use strict';

    const drawer = document.getElementById('oberDrawer');
    const overlay = document.getElementById('oberDrawerOverlay');
    const openButton = document.getElementById('oberMenuToggle');
    const closeButton = document.getElementById('oberDrawerClose');
    const nav = document.getElementById('navbar');

    if (!drawer || !overlay || !openButton || !closeButton) return;

    let lastFocusedElement = null;

    function setDrawer(open) {
        drawer.classList.toggle('open', open);
        overlay.classList.toggle('open', open);
        drawer.setAttribute('aria-hidden', String(!open));
        openButton.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('sr-drawer-open', open);

        if (open) {
            lastFocusedElement = document.activeElement;
            window.setTimeout(() => closeButton.focus(), 120);
        } else if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    openButton.addEventListener('click', () => setDrawer(true));
    closeButton.addEventListener('click', () => setDrawer(false));
    overlay.addEventListener('click', () => setDrawer(false));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && drawer.classList.contains('open')) {
            setDrawer(false);
        }
    });

    const drawerLinks = drawer.querySelectorAll('a');
    drawerLinks.forEach((link) => {
        link.addEventListener('click', () => setDrawer(false));
    });

    /* Events opens the Conference & Events facility before scrolling there. */
    document.querySelectorAll('[data-facility-index]').forEach((link) => {
        link.addEventListener('click', () => {
            const index = Number(link.getAttribute('data-facility-index'));
            window.setTimeout(() => {
                if (Number.isFinite(index) && typeof window.selectFacility === 'function') {
                    window.selectFacility(index);
                }
            }, 120);
        });
    });

    /* Highlight the section currently in view. */
    const sectionLinks = Array.from(document.querySelectorAll('.ober-link[href^="#"], .ober-drawer-link[href^="#"]'));
    const sectionIds = [...new Set(sectionLinks
        .map((link) => link.getAttribute('href'))
        .filter((href) => href && href.length > 1))];
    const sections = sectionIds
        .map((href) => document.querySelector(href))
        .filter(Boolean);

    function updateActiveNavigation() {
        const navOffset = (nav ? nav.offsetHeight : 90) + 80;
        let currentId = sections.length ? sections[0].id : '';

        sections.forEach((section) => {
            if (window.scrollY >= section.offsetTop - navOffset) {
                currentId = section.id;
            }
        });

        sectionLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${currentId}`;
            link.classList.toggle('active', isActive);
            if (isActive) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
    }

    updateActiveNavigation();
    window.addEventListener('scroll', updateActiveNavigation, { passive: true });
    window.addEventListener('resize', updateActiveNavigation);
})();
