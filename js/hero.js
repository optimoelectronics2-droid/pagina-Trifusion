/* Rotación de imágenes de portada (fundido cruzado). Se pausa si la pestaña no está visible. */
(function () {
  var slides = document.querySelectorAll('.hero-slide');
  var ticks = document.querySelectorAll('#hero-ticks i');
  var label = document.getElementById('hero-label');
  if (slides.length < 2) return;

  var i = 0;
  setInterval(function () {
    if (document.hidden) return;
    slides[i].classList.remove('on');
    ticks[i].classList.remove('on');
    i = (i + 1) % slides.length;
    slides[i].classList.add('on');
    ticks[i].classList.add('on');
    label.textContent = slides[i].dataset.label;
  }, 5000);
})();
