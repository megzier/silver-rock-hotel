/* Silver Rock Boutique Resort by MOKAWA — additive room slider controls V1.10 */
(() => {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initRoomSlider(slider, index) {
        const slides = Array.from(slider.querySelectorAll('[data-room-slide]'));
        const dots = Array.from(slider.querySelectorAll('[data-room-dot]'));
        const prev = slider.querySelector('[data-room-prev]');
        const next = slider.querySelector('[data-room-next]');
        const count = slider.querySelector('.room-slider-count b');
        if (slides.length < 2) return;

        let active = Math.max(0, slides.findIndex(slide => slide.classList.contains('is-active')));
        let timer = null;
        let touchStartX = null;
        const delay = 5600 + (index * 350);

        function show(target, fromAuto = false) {
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
            if (!fromAuto) restart();
        }

        function stop() { window.clearInterval(timer); timer = null; }
        function start() {
            stop();
            if (reduceMotion || document.hidden) return;
            timer = window.setInterval(() => show(active + 1, true), delay);
        }
        function restart() { stop(); start(); }

        prev?.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); show(active - 1); });
        next?.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); show(active + 1); });
        dots.forEach(dot => dot.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            show(Number(dot.dataset.roomDot || 0));
        }));

        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);
        slider.addEventListener('focusin', stop);
        slider.addEventListener('focusout', start);
        slider.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') { event.preventDefault(); show(active - 1); }
            if (event.key === 'ArrowRight') { event.preventDefault(); show(active + 1); }
        });
        slider.addEventListener('touchstart', event => {
            touchStartX = event.changedTouches[0]?.clientX ?? null;
            stop();
        }, { passive: true });
        slider.addEventListener('touchend', event => {
            const endX = event.changedTouches[0]?.clientX ?? null;
            if (touchStartX !== null && endX !== null) {
                const delta = endX - touchStartX;
                if (Math.abs(delta) > 45) show(active + (delta < 0 ? 1 : -1));
            }
            touchStartX = null;
            start();
        }, { passive: true });

        start();
    }

    document.addEventListener('visibilitychange', () => {
        document.querySelectorAll('[data-room-slider]').forEach(slider => {
            slider.dispatchEvent(new Event(document.hidden ? 'mouseenter' : 'mouseleave'));
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-room-slider]').forEach(initRoomSlider);
    });
})();
