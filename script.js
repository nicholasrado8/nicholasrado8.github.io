/**
 * AziendaX – script.js
 * -------------------------------------------------------
 * Funzionalità:
 *  1. Scroll fluido per i link di navigazione
 *  2. Header sticky con cambio stile al scroll
 *  3. Menu hamburger responsive (mobile)
 *  4. Animazioni reveal all'entrata nel viewport (IntersectionObserver)
 *  5. Anno automatico nel footer
 *  6. Effetto parallasse leggero sull'immagine hero (desktop)
 * -------------------------------------------------------
 */

const $ = (selector, ctx = document) => ctx.querySelector(selector);
const $$ = (selector, ctx = document) => ctx.querySelectorAll(selector);

/* 1. SCROLL FLUIDO */
function getHeaderHeight() {
  const header = $('.site-header');
  return header ? header.offsetHeight : 0;
}

function smoothScrollTo(target) {
  const topOffset = target.getBoundingClientRect().top
    + window.scrollY
    - getHeaderHeight()
    - 16;
  window.scrollTo({ top: topOffset, behavior: 'smooth' });
}

function initSmoothScroll() {
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = $(targetId);
      if (!targetEl) return;
      e.preventDefault();
      smoothScrollTo(targetEl);
      closeMobileMenu();
    });
  });
}

/* 2. HEADER STICKY */
function initStickyHeader() {
  const header = $('.site-header');
  if (!header) return;
  const updateHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

/* 3. MENU HAMBURGER */
const hamburger = $('#hamburger');
const navLinks  = $('#nav-links');

function openMobileMenu() {
  if (!hamburger || !navLinks) return;
  hamburger.classList.add('is-open');
  navLinks.classList.add('is-open');
  hamburger.setAttribute('aria-expanded', 'true');
  hamburger.setAttribute('aria-label', 'Chiudi menu');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  if (!hamburger || !navLinks) return;
  hamburger.classList.remove('is-open');
  navLinks.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Apri menu');
  document.body.style.overflow = '';
}

function initHamburger() {
  if (!hamburger) return;
  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('is-open') ? closeMobileMenu() : openMobileMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });
  navLinks && navLinks.addEventListener('click', (e) => {
    if (e.target === navLinks) closeMobileMenu();
  });
}

/* 4. ANIMAZIONI REVEAL */
function initRevealAnimations() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    $$('.reveal').forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  $$('.reveal').forEach((el) => observer.observe(el));
}

/* 5. ANNO NEL FOOTER */
function initCurrentYear() {
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* 6. PARALLASSE HERO */
function initHeroParallax() {
  const heroImg = $('.hero-img');
  if (!heroImg) return;
  const isTouch = window.matchMedia('(hover: none)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isTouch || prefersReduced) return;
  window.addEventListener('scroll', () => {
    heroImg.style.transform = `translateY(${window.scrollY * 0.35}px)`;
  }, { passive: true });
}

/* AVVIO */
document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initStickyHeader();
  initHamburger();
  initRevealAnimations();
  initCurrentYear();
  initHeroParallax();
});