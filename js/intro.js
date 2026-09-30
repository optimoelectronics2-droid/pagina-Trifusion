/* Entrada eléctrica: click la salta, si no se retira sola con barrido. Sin JS el CSS la oculta. */
(function () {
  function enter() {
    document.documentElement.classList.remove('pre');
    document.body.classList.add('entered');
    var el = document.getElementById('intro');
    if (el) el.classList.add('done');
  }
  document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('intro');
    if (el) el.addEventListener('click', enter);
    setTimeout(enter, 4700);
  });
})();
