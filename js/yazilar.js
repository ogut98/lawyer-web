/* ===================================================
   YAZILAR PAGE — Filter & UI
   Works with dynamically rendered articles (articles.js).
   =================================================== */
'use strict';

function initYazilarFilter() {
  var emptyState = document.getElementById('blogEmpty');

  function filterCards(cat) {
    var cards = document.querySelectorAll('.blog-card');
    var visible = 0;
    cards.forEach(function (card) {
      var matches = cat === 'all' || card.dataset.cat === cat;
      card.style.display = matches ? '' : 'none';
      if (matches) visible++;
    });
    if (emptyState) emptyState.classList.toggle('hidden', visible > 0);
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.cat === cat);
    });
  }

  /* Clone buttons to clear any stale listeners */
  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    var clone = btn.cloneNode(true);
    btn.parentNode.replaceChild(clone, btn);
    clone.addEventListener('click', function () { filterCards(clone.dataset.cat); });
  });

  document.querySelectorAll('.sidebar-cats a[data-filter]').forEach(function (link) {
    var clone = link.cloneNode(true);
    link.parentNode.replaceChild(clone, link);
    clone.addEventListener('click', function (e) {
      e.preventDefault();
      filterCards(clone.dataset.filter);
      var blogList = document.getElementById('blogList');
      if (blogList) blogList.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

window.initYazilarFilter = initYazilarFilter;
