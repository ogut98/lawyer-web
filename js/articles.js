/**
 * Kuncan Hukuk — Articles Runtime
 * Fetches /data/articles.json and renders articles on the site.
 */
(function (global) {
  'use strict';

  var MONTHS_TR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
                   'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];

  var CAT_LABELS = {
    aile:         'Aile Hukuku',
    ceza:         'Ceza Hukuku',
    gayrimenkul:  'Gayrimenkul Hukuku',
    ticaret:      'Ticaret Hukuku',
    idare:        'İdare Hukuku',
    is:           'İş Hukuku'
  };

  /* ── Helpers ── */
  function formatDate(dateStr) {
    try {
      var d = new Date(dateStr + 'T00:00:00');
      return d.getDate() + ' ' + MONTHS_TR[d.getMonth()] + ' ' + d.getFullYear();
    } catch (e) { return dateStr; }
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ── Data ── */
  function fetchArticles() {
    return fetch('/data/articles.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var articles = data.articles || [];
        articles.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
        return articles;
      });
  }

  /* ── Card templates ── */
  function makeListCard(a) {
    var catLabel = CAT_LABELS[a.category] || a.category;
    var url = '/yazilar/makale.html?id=' + encodeURIComponent(a.id);
    return (
      '<article class="blog-card" data-cat="' + esc(a.category) + '" itemscope itemtype="https://schema.org/Article">' +
        '<div class="blog-card-cat">' + esc(catLabel) + '</div>' +
        '<div class="blog-card-body">' +
          '<time class="blog-card-date" datetime="' + esc(a.date) + '" itemprop="datePublished">' + esc(formatDate(a.date)) + '</time>' +
          '<h2 itemprop="headline"><a href="' + esc(url) + '">' + esc(a.title) + '</a></h2>' +
          '<p itemprop="description">' + esc(a.excerpt) + '</p>' +
          '<div class="blog-card-meta">' +
            '<span><i class="fa-solid fa-user" aria-hidden="true"></i> ' + esc(a.author) + '</span>' +
            '<span><i class="fa-regular fa-clock" aria-hidden="true"></i> ' + esc(String(a.readTime)) + ' dk okuma</span>' +
          '</div>' +
          '<a href="' + esc(url) + '" class="article-link">Devamını Oku <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>' +
        '</div>' +
      '</article>'
    );
  }

  function makePreviewCard(a) {
    var catLabel = CAT_LABELS[a.category] || a.category;
    var url = '/yazilar/makale.html?id=' + encodeURIComponent(a.id);
    return (
      '<article class="article-card" itemscope itemtype="https://schema.org/Article">' +
        '<div class="article-category">' + esc(catLabel) + '</div>' +
        '<div class="article-body">' +
          '<time class="article-date" datetime="' + esc(a.date) + '" itemprop="datePublished">' + esc(formatDate(a.date)) + '</time>' +
          '<h3 itemprop="headline"><a href="' + esc(url) + '">' + esc(a.title) + '</a></h3>' +
          '<a href="' + esc(url) + '" class="article-link"><span data-i18n="art_read">Devamını Oku</span> <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>' +
        '</div>' +
      '</article>'
    );
  }

  /* ── Renderers ── */
  function renderBlogList() {
    var container = document.getElementById('blogList');
    if (!container) return;
    fetchArticles().then(function (articles) {
      container.innerHTML = articles.map(makeListCard).join('');
      updateSidebarCounts(articles);
      if (typeof global.initYazilarFilter === 'function') global.initYazilarFilter();
    }).catch(function () {
      container.innerHTML = '<p style="text-align:center;padding:40px;color:#6b7280;">Makaleler yüklenemedi.</p>';
    });
  }

  function updateSidebarCounts(articles) {
    var allEl = document.querySelector('.sidebar-cats a[data-filter="all"] em');
    if (allEl) allEl.textContent = articles.length;
    ['aile', 'ceza', 'gayrimenkul', 'ticaret', 'idare'].forEach(function (cat) {
      var el = document.querySelector('.sidebar-cats a[data-filter="' + cat + '"] em');
      if (el) el.textContent = articles.filter(function (a) { return a.category === cat; }).length;
    });
  }

  function renderArticlesPreview() {
    var container = document.getElementById('articlesGrid');
    if (!container) return;
    fetchArticles().then(function (articles) {
      container.innerHTML = articles.slice(0, 3).map(makePreviewCard).join('');
    }).catch(function () {
      container.innerHTML = '';
    });
  }

  function renderArticleDetail() {
    var container = document.getElementById('articleDetail');
    if (!container) return;
    var params = new URLSearchParams(global.location.search);
    var id = params.get('id');
    if (!id) { container.innerHTML = '<p class="not-found">Makale bulunamadı.</p>'; return; }

    fetchArticles().then(function (articles) {
      var article = null;
      for (var i = 0; i < articles.length; i++) {
        if (articles[i].id === id) { article = articles[i]; break; }
      }
      if (!article) { container.innerHTML = '<p class="not-found">Makale bulunamadı.</p>'; return; }

      document.title = article.title + ' | Kuncan Hukuk & Danışmanlık';
      var pageUrl = 'https://www.kuncanhukuk.com/yazilar/makale.html?id=' + encodeURIComponent(article.id);
      var metaDesc = document.getElementById('metaDesc'); if (metaDesc) metaDesc.setAttribute('content', article.excerpt.slice(0, 160));
      var ogTitle  = document.getElementById('ogTitle');  if (ogTitle)  ogTitle.setAttribute('content', article.title + ' | Kuncan Hukuk & Danışmanlık');
      var ogDesc   = document.getElementById('ogDesc');   if (ogDesc)   ogDesc.setAttribute('content', article.excerpt.slice(0, 160));
      var ogUrl    = document.getElementById('ogUrl');    if (ogUrl)    ogUrl.setAttribute('content', pageUrl);
      var canon    = document.getElementById('canonical'); if (canon)   canon.setAttribute('href', pageUrl);

      var catLabel = CAT_LABELS[article.category] || article.category;

      /* Render markdown content if marked.js is available, sanitize with DOMPurify */
      var contentHtml = '';
      if (article.content) {
        var raw = global.marked
          ? global.marked.parse(article.content)
          : '<p>' + esc(article.content).replace(/\n\n/g, '</p><p>') + '</p>';
        contentHtml = global.DOMPurify ? global.DOMPurify.sanitize(raw) : raw;
      } else {
        contentHtml = '<p>' + esc(article.excerpt) + '</p>';
      }

      container.innerHTML =
        '<div class="article-detail-header">' +
          '<span class="blog-card-cat">' + esc(catLabel) + '</span>' +
          '<h1>' + esc(article.title) + '</h1>' +
          '<div class="blog-card-meta">' +
            '<span><i class="fa-solid fa-user"></i> ' + esc(article.author) + '</span>' +
            '<span><i class="fa-regular fa-calendar"></i> ' + esc(formatDate(article.date)) + '</span>' +
            '<span><i class="fa-regular fa-clock"></i> ' + esc(String(article.readTime)) + ' dk okuma</span>' +
          '</div>' +
        '</div>' +
        '<div class="article-detail-content">' + contentHtml + '</div>';
    }).catch(function () {
      container.innerHTML = '<p class="not-found">Makale yüklenemedi.</p>';
    });
  }

  /* ── Auto-render ── */
  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('blogList'))     renderBlogList();
    if (document.getElementById('articlesGrid')) renderArticlesPreview();
    if (document.getElementById('articleDetail')) renderArticleDetail();
  });

  global.KuncanArticles = {
    fetchArticles:        fetchArticles,
    renderBlogList:       renderBlogList,
    renderArticlesPreview: renderArticlesPreview,
    renderArticleDetail:  renderArticleDetail
  };

})(window);
