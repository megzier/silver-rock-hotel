/* Silver Rock Boutique Resort by MOKAWA — manual room gallery controls V1.12 */
(() => {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initRoomSlider(slider) {
        const slides = Array.from(slider.querySelectorAll('[data-room-slide]'));
        const dots = Array.from(slider.querySelectorAll('[data-room-dot]'));
        const prev = slider.querySelector('[data-room-prev]');
        const next = slider.querySelector('[data-room-next]');
        const count = slider.querySelector('.room-slider-count b');
        if (slides.length < 2) return;

        let active = Math.max(0, slides.findIndex(slide => slide.classList.contains('is-active')));
        let touchStartX = null;

        function show(target) {
            const nextIndex = (Number(target) + slides.length) % slides.length;
            if (nextIndex === active) return;

            const old = slides[active];
            old.classList.add('is-leaving');
            old.classList.remove('is-active');
            slides[nextIndex].classList.add('is-active');
            window.setTimeout(() => old.classList.remove('is-leaving'), reduceMotion ? 0 : 800);

            dots.forEach((dot, dotIndex) => {
                const selected = dotIndex === nextIndex;
                dot.classList.toggle('is-active', selected);
                dot.setAttribute('aria-current', selected ? 'true' : 'false');
            });

            active = nextIndex;
            if (count) count.textContent = String(active + 1).padStart(2, '0');
        }

        prev?.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            show(active - 1);
        });

        next?.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            show(active + 1);
        });

        dots.forEach(dot => dot.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            show(Number(dot.dataset.roomDot || 0));
        }));

        slider.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                show(active - 1);
            }
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                show(active + 1);
            }
        });

        // A deliberate visitor swipe is treated as manual navigation; no timer is used anywhere.
        slider.addEventListener('touchstart', event => {
            touchStartX = event.changedTouches[0]?.clientX ?? null;
        }, { passive: true });

        slider.addEventListener('touchend', event => {
            const endX = event.changedTouches[0]?.clientX ?? null;
            if (touchStartX !== null && endX !== null) {
                const delta = endX - touchStartX;
                if (Math.abs(delta) > 45) show(active + (delta < 0 ? 1 : -1));
            }
            touchStartX = null;
        }, { passive: true });
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-room-slider]').forEach(initRoomSlider);
    });
})();
