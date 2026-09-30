/* Parallax + expansión suave con GSAP ScrollTrigger.
   NO toca elementos con .rv ni .rise (reveal.js / motion.css los controlan).
   Solo anima medios internos: hero-slides, fotos de tarjetas y videos.
   Si GSAP falla o hay movimiento reducido, todo queda visible. */
(function () {
  function ready(fn) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') setTimeout(fn, 0);
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero: parallax leve en las fotos internas (las controla hero.js para el fundido)
    gsap.utils.toArray('.hero-slide').forEach(function (img) {
      gsap.fromTo(img, { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    });

    // Expansión suave de fotos al entrar en pantalla (sin tocar .rv/.card externos)
    gsap.utils.toArray('.cat .pic img, .card .plate img').forEach(function (img) {
      gsap.fromTo(img, { scale: 0.86 }, {
        scale: 1, ease: 'power2.out', duration: 1,
        scrollTrigger: { trigger: img, start: 'top 94%', toggleActions: 'play none none reverse' }
      });
    });

    // Videos: el <video> se expande suave al entrar
    gsap.utils.toArray('.video-card video').forEach(function (vid) {
      gsap.fromTo(vid, { scale: 0.9 }, {
        scale: 1, ease: 'power2.out', duration: 0.9,
        scrollTrigger: { trigger: vid, start: 'top 90%', toggleActions: 'play none none reverse' }
      });
    });
  });
})();
