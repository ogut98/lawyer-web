/* ===================================================
   KUNCAN HUKUK & DANIŞMANLIK
   Main JavaScript
   =================================================== */

'use strict';

// === NAVBAR SCROLL ===
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// === HAMBURGER MENU ===
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

function openMenu() {
  hamburger.classList.add('open');
  navLinks.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  if (hamburger.classList.contains('open')) closeMenu();
  else openMenu();
});

// Close menu on nav link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// === SMOOTH SCROLL + ACTIVE NAV ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// === SCROLL REVEAL ===
const revealElements = document.querySelectorAll(
  '.service-card, .team-card, .why-item, .why-card, .about-content, .about-visual, .contact-info, .contact-form-wrap'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80 * i);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => revealObserver.observe(el));

// === TESTIMONIALS SLIDER ===
const track = document.getElementById('testimonialTrack');
const dotsContainer = document.getElementById('sliderDots');
const cards = track ? track.querySelectorAll('.testimonial-card') : [];
let current = 0;
let autoplay;

function initSlider() {
  if (!track || cards.length === 0) return;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Yorum ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  document.getElementById('prevBtn').addEventListener('click', () => {
    goTo((current - 1 + cards.length) % cards.length);
    resetAutoplay();
  });

  document.getElementById('nextBtn').addEventListener('click', () => {
    goTo((current + 1) % cards.length);
    resetAutoplay();
  });

  startAutoplay();
}

function goTo(index) {
  current = index;
  track.style.transform = `translateX(-${current * 100}%)`;
  document.querySelectorAll('.slider-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === current);
  });
}

function startAutoplay() {
  autoplay = setInterval(() => {
    goTo((current + 1) % cards.length);
  }, 5000);
}

function resetAutoplay() {
  clearInterval(autoplay);
  startAutoplay();
}

// Touch support for slider
let touchStartX = 0;
if (track) {
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo((current + 1) % cards.length);
      else goTo((current - 1 + cards.length) % cards.length);
      resetAutoplay();
    }
  });
}

initSlider();

// === CONTACT FORM ===
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Gönderiliyor…';

    const data = new FormData(form);

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString()
    })
      .then(() => {
        form.reset();
        formSuccess.classList.add('show');
        btn.disabled = false;
        btn.querySelector('span').textContent = 'Mesaj Gönder';
        setTimeout(() => formSuccess.classList.remove('show'), 6000);
      })
      .catch(() => {
        btn.disabled = false;
        btn.querySelector('span').textContent = 'Mesaj Gönder';
        alert('Bir hata oluştu. Lütfen doğrudan bilgi@kuncanhukuk.com adresine e-posta gönderin.');
      });
  });
}

// === STAT COUNTER ANIMATION ===
function animateCounter(el) {
  const target = el.textContent.replace(/\D/g, '');
  const suffix = el.textContent.replace(/[\d]/g, '');
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * parseInt(target)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObserver.observe(heroStats);
