/* Flechas del carrusel. El deslizamiento lo hace el navegador (scroll-snap). */
(function () {
  var rail = document.getElementById('rail');
  var prev = document.getElementById('prev');
  var next = document.getElementById('next');
  if (!rail) return;

  function step() {
    var card = rail.querySelector('.card');
    return (card.offsetWidth + 16) * (innerWidth > 820 ? 2 : 1);
  }
  function update() {
    prev.disabled = rail.scrollLeft < 4;
    next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
  }
  prev.addEventListener('click', function () { rail.scrollBy({ left: -step(), behavior: 'smooth' }); });
  next.addEventListener('click', function () { rail.scrollBy({ left: step(), behavior: 'smooth' }); });
  rail.addEventListener('scroll', update, { passive: true });
  rail.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') next.click();
    if (e.key === 'ArrowLeft') prev.click();
  });
  addEventListener('resize', update);
  update();
})();
