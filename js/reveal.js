/* Muestra cada bloque .rv una sola vez al entrar en pantalla. */
(function () {
  var nodes = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window)) { nodes.forEach(function (n) { n.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  nodes.forEach(function (n) { io.observe(n); });
})();
