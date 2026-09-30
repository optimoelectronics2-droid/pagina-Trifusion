/* Actualiza la valoración en vivo si existe la función de Netlify. Si no, queda el valor del HTML. */
(function () {
  if (location.protocol.indexOf('http') !== 0 || /^(localhost|127\.)/.test(location.hostname)) return;
  fetch('/.netlify/functions/reviews')
    .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    .then(function (j) {
      document.getElementById('rating').textContent = j.rating.toFixed(1);
      document.getElementById('review-count').textContent = 'Basado en ' + j.count + ' reseñas';
      document.getElementById('review-status').textContent = 'En vivo desde Google';
      document.querySelectorAll('.star').forEach(function (s, i) {
        s.style.setProperty('--p', Math.max(0, Math.min(1, j.rating - i)) * 100 + '%');
      });
    })
    .catch(function () {});
})();
