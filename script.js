(function () {
  const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const DURATION = 1000;
  const Y_OFFSET = 20;
  const BASE_DELAY = 150;

  const selectors = [
    '.section-title',
    '.section-desc',
    '.section-label',
    '.feature-card',
    '.step-card',
    '.color-card',
    '.dark-card',
    '.image-row img',
    '.quote-box blockquote',
    '.note',
    '.consultant-photo-wrap',
    '.consultant-block h4',
    '.consultant-block p',
    '.consultant-block .btn',
    '.hero-content > *',
    '.hero-image',
  ];

  function setupReveal() {
    const seen = new Set();
    const elements = [];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        el.classList.add('reveal');
        elements.push(el);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          const parent = el.closest('.feature-grid, .steps-grid, .final-grid, .btn-group, .hero-content, .consultant-block');
          let delay = BASE_DELAY;

          if (parent) {
            const siblings = [...parent.querySelectorAll('.reveal')];
            const index = siblings.indexOf(el);
            if (index >= 0) delay += index * 100;
          }

          el.style.transitionDelay = `${delay}ms`;
          el.classList.add('revealed');
          observer.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
  }

  function setupParallax() {
    const heroWrap = document.querySelector('.hero-image');
    const heroBg = document.querySelector('.hero-bg');
    if (!heroWrap && !heroBg) return;

    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (heroWrap) heroWrap.style.transform = `translateY(${y * 0.06}px)`;
          if (heroBg) heroBg.style.transform = `translateY(${y * 0.04}px) scale(1.05)`;
          ticking = false;
        });
      },
      { passive: true }
    );
  }

  document.documentElement.style.setProperty('--anim-easing', EASING);
  document.documentElement.style.setProperty('--anim-duration', `${DURATION}ms`);
  document.documentElement.style.setProperty('--anim-y-offset', `${Y_OFFSET}px`);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupReveal();
      setupParallax();
    });
  } else {
    setupReveal();
    setupParallax();
  }
})();
