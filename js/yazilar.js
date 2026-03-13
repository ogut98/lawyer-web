/* ===================================================
   YAZILAR PAGE — Filter & UI
   =================================================== */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns  = document.querySelectorAll('.filter-btn, .sidebar-cats a[data-filter]');
  const cards       = document.querySelectorAll('.blog-card');
  const emptyState  = document.getElementById('blogEmpty');

  function filterCards(cat) {
    let visible = 0;

    cards.forEach(card => {
      const matches = cat === 'all' || card.dataset.cat === cat;
      card.style.display = matches ? '' : 'none';
      if (matches) visible++;
    });

    emptyState.classList.toggle('hidden', visible > 0);

    // Sync all filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === cat);
    });
  }

  // Top filter bar
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => filterCards(btn.dataset.cat));
  });

  // Sidebar category links
  document.querySelectorAll('.sidebar-cats a[data-filter]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      filterCards(link.dataset.filter);
      // Scroll to blog list
      document.getElementById('blogList').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});
