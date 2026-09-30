/* Resalta la fila del horario de hoy. */
(function () {
  var today = String(new Date().getDay());
  document.querySelectorAll('#hours tr').forEach(function (tr) {
    if (tr.dataset.days.split(',').indexOf(today) > -1) tr.className = 'today';
  });
})();
