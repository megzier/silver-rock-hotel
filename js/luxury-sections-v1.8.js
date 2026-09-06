/* Silver Rock Boutique Resort — Rooms & Facilities interactions V1.8 */

const luxuryFacilities = [
    {
        kicker: 'The shoreline',
        name: 'Private Beach',
        desc: "Step from the gardens onto Silver Rock's own stretch of white sand. Loungers, shade and attentive service create an unhurried setting beside the warm Indian Ocean.",
        meta: [
            ['bi bi-clock', 'Sunrise to sunset'],
            ['bi bi-shield-check', 'Reserved for resident guests']
        ],
        image: 'images/Silver_Rock-2__2_.jpg',
        alt: 'Silver Rock Boutique Resort private beach in Malindi',
        position: 'center center',
        link: 'https://wa.me/254738014791?text=Hello,%20I%20would%20like%20to%20enquire%20about%20the%20Private%20Beach',
        linkLabel: 'Enquire about this experience',
        external: true
    },
    {
        kicker: 'Water & light',
        name: 'Tropical Pool',
        desc: 'Set among mature trees and white coastal architecture, the pool is a relaxed centrepiece for slow afternoons, refreshing swims and easy moments between the gardens and the sea.',
        meta: [
            ['bi bi-clock', 'Open daily'],
            ['bi bi-cup-straw', 'Poolside refreshments available']
        ],
        image: 'images/Silver_Rock-13-new.jpg',
        alt: 'Tropical swimming pool at Silver Rock Boutique Resort',
        position: 'center center',
        link: 'https://wa.me/254738014791?text=Hello,%20I%20would%20like%20to%20enquire%20about%20the%20Swimming%20Pool',
        linkLabel: 'Ask our team',
        external: true
    },
    {
        kicker: 'Open-air living',
        name: 'Ocean Pavilion',
        desc: 'A breezy, elevated pavilion frames the palms and ocean beyond. It is a natural setting for quiet breakfasts, sunset conversations and private moments in the shade.',
        meta: [
            ['bi bi-water', 'Indian Ocean outlook'],
            ['bi bi-wind', 'Naturally ventilated']
        ],
        image: 'images/Silver_Rock-98__1_.jpg',
        alt: 'Open-air ocean pavilion overlooking the coast at Silver Rock',
        position: 'center center',
        link: '#dining',
        linkLabel: 'Discover dining',
        external: false
    },
    {
        kicker: 'The landscape',
        name: 'Tropical Grounds',
        desc: 'Curved architecture rests within palms, mature shade trees and generous lawns. The grounds create a calm transition between private rooms, gathering places, the pool and the beachfront.',
        meta: [
            ['bi bi-leaf', 'Mature tropical gardens'],
            ['bi bi-camera', 'Quiet corners throughout']
        ],
        image: 'images/Silver_Rock-7.jpg',
        alt: 'Aerial view of Silver Rock Boutique Resort surrounded by tropical gardens',
        position: 'center center',
        link: '#gallery',
        linkLabel: 'View the resort gallery',
        external: false
    },
    {
        kicker: 'Gather beautifully',
        name: 'Conference & Events',
        desc: 'The open-air conference pavilion combines a natural thatched setting with flexible layouts for workshops, training sessions, private functions and corporate retreats.',
        meta: [
            ['bi bi-grid', 'Flexible seating layouts'],
            ['bi bi-briefcase', 'Corporate and private events']
        ],
        image: 'images/conference-3.jpg',
        alt: 'Open-air conference and events pavilion at Silver Rock',
        position: 'center center',
        link: 'https://wa.me/254738014791?text=Hello,%20I%20would%20like%20to%20enquire%20about%20Conference%20%26%20Events',
        linkLabel: 'Plan an event',
        external: true
    },
    {
        kicker: 'Restore & renew',
        name: 'Boutique Spa',
        desc: 'A private wellness setting for massage, aromatherapy and restorative rituals using natural oils. Treatments are designed to slow the pace and complement the calm of the coast.',
        meta: [
            ['bi bi-flower1', 'Private treatments'],
            ['bi bi-flower3', 'Natural locally sourced oils']
        ],
        image: 'images/spa-massage.jpg',
        alt: 'Relaxing massage treatment at the Silver Rock boutique spa',
        position: 'center center',
        link: '#spa',
        linkLabel: 'Explore spa & wellness',
        external: false
    }
];

let activeLuxuryFacility = 0;
let luxuryFacilityTimer = null;
const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function formatFacilityNumber(index) {
    return String(index + 1).padStart(2, '0');
}

function renderFacilityMeta(items) {
    return items.map(([icon, text]) => `<span><i class="${icon}"></i>${text}</span>`).join('');
}

function selectFacility(index, options = {}) {
    const total = luxuryFacilities.length;
    activeLuxuryFacility = ((Number(index) % total) + total) % total;
    const facility = luxuryFacilities[activeLuxuryFacility];

    const stage = document.getElementById('facilityStage');
    const hero = document.getElementById('facilityHero');
    const title = document.getElementById('facilityTitle');
    const desc = document.getElementById('facilityDesc');
    const kicker = document.getElementById('facilityKicker');
    const meta = document.getElementById('facilityMeta');
    const link = document.getElementById('facilityLink');
    const current = document.getElementById('facilityCurrent');
    const progress = document.getElementById('facilityProgress');

    if (!stage || !hero || !title || !desc || !kicker || !meta || !link || !current || !progress) return;

    stage.classList.add('is-changing');
    const reveal = () => {
        stage.classList.remove('is-changing');
        hero.removeEventListener('load', reveal);
    };
    hero.addEventListener('load', reveal);
    hero.src = facility.image;
    hero.alt = facility.alt;
    hero.style.objectPosition = facility.position || 'center center';
    if (hero.complete) window.setTimeout(reveal, reducedMotion ? 0 : 90);

    kicker.textContent = facility.kicker;
    title.textContent = facility.name;
    desc.textContent = facility.desc;
    meta.innerHTML = renderFacilityMeta(facility.meta);
    current.textContent = formatFacilityNumber(activeLuxuryFacility);
    progress.style.transform = `translateX(${activeLuxuryFacility * 100}%)`;

    link.href = facility.link;
    link.innerHTML = `${facility.linkLabel} <i class="bi bi-arrow-right"></i>`;
    if (facility.external) {
        link.target = '_blank';
        link.rel = 'noopener';
    } else {
        link.removeAttribute('target');
        link.removeAttribute('rel');
    }

    document.querySelectorAll('[data-facility-button]').forEach((button, buttonIndex) => {
        const selected = buttonIndex === activeLuxuryFacility;
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-pressed', selected ? 'true' : 'false');
        if (selected && options.scrollTabIntoView) {
            button.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
        }
    });

    if (!options.fromAuto) restartLuxuryFacilityAuto();
}

function stepFacility(delta) {
    selectFacility(activeLuxuryFacility + Number(delta || 0), { scrollTabIntoView: true });
}

function restartLuxuryFacilityAuto() {
    window.clearInterval(luxuryFacilityTimer);
    if (reducedMotion) return;
    luxuryFacilityTimer = window.setInterval(() => {
        selectFacility(activeLuxuryFacility + 1, { fromAuto: true, scrollTabIntoView: true });
    }, 8000);
}

function setupRoomFilters() {
    const filters = document.querySelectorAll('[data-room-filter]');
    const cards = document.querySelectorAll('[data-room-category]');

    filters.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.roomFilter || 'all';
            filters.forEach(item => {
                const selected = item === button;
                item.classList.toggle('is-active', selected);
                item.setAttribute('aria-selected', selected ? 'true' : 'false');
            });

            cards.forEach(card => {
                const categories = (card.dataset.roomCategory || '').split(/\s+/);
                const visible = filter === 'all' || categories.includes(filter);
                card.classList.toggle('is-filtered-out', !visible);
                card.setAttribute('aria-hidden', visible ? 'false' : 'true');
            });
        });
    });
}

function setupRoomImagePreview() {
    document.addEventListener('click', event => {
        if (event.target.closest('.gal-item, .gallery-item-luxury')) {
            document.getElementById('lightbox')?.classList.remove('room-preview');
        }
    }, true);

    document.querySelectorAll('[data-lightbox-room]').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const lightbox = document.getElementById('lightbox');
            const image = document.getElementById('lightbox-img');
            if (!lightbox || !image) {
                window.open(link.href, '_blank', 'noopener');
                return;
            }
            image.src = link.href;
            image.alt = link.dataset.lightboxRoom || 'Room preview';
            lightbox.classList.add('room-preview', 'active');
            document.body.style.overflow = 'hidden';
        });
    });
}

function setupFacilityPause() {
    const stage = document.getElementById('facilityStage');
    if (!stage) return;
    stage.addEventListener('mouseenter', () => window.clearInterval(luxuryFacilityTimer));
    stage.addEventListener('mouseleave', restartLuxuryFacilityAuto);
    stage.addEventListener('focusin', () => window.clearInterval(luxuryFacilityTimer));
    stage.addEventListener('focusout', restartLuxuryFacilityAuto);
}

document.addEventListener('DOMContentLoaded', () => {
    setupRoomFilters();
    setupRoomImagePreview();
    setupFacilityPause();
    selectFacility(0);
});
