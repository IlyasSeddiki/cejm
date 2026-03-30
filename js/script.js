/* ============================================================
   CEJM SISR — Main Script
   ============================================================ */

/* ——— Accordion ——— */
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const acc = header.closest('.accordion');
      const isOpen = acc.classList.contains('open');

      // Optional: close others in same group
      const group = acc.closest('.accordion-group');
      if (group) {
        group.querySelectorAll('.accordion.open').forEach(other => {
          if (other !== acc) other.classList.remove('open');
        });
      }

      acc.classList.toggle('open', !isOpen);
    });
  });
}

/* ——— Open accordion from hash ——— */
function openFromHash() {
  const hash = window.location.hash;
  if (!hash) return;
  const target = document.querySelector(hash);
  if (!target) return;
  const acc = target.closest('.accordion');
  if (acc) acc.classList.add('open');
  setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

/* ——— Search ——— */
function initSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    const accordions = document.querySelectorAll('.accordion');

    if (!query) {
      accordions.forEach(acc => {
        acc.classList.remove('hidden');
        // Remove existing highlights
        removeHighlights(acc);
      });
      return;
    }

    accordions.forEach(acc => {
      removeHighlights(acc);
      const text = acc.textContent.toLowerCase();
      if (text.includes(query)) {
        acc.classList.remove('hidden');
        acc.classList.add('open');
        highlightText(acc.querySelector('.accordion-content'), query);
      } else {
        acc.classList.add('hidden');
      }
    });
  });
}

function highlightText(el, query) {
  if (!el) return;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  const nodes = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node);

  nodes.forEach(textNode => {
    const parent = textNode.parentNode;
    if (parent.tagName === 'MARK' || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') return;
    const text = textNode.textContent;
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    if (regex.test(text)) {
      const span = document.createElement('span');
      span.innerHTML = text.replace(regex, '<mark>$1</mark>');
      parent.replaceChild(span, textNode);
    }
  });
}

function removeHighlights(el) {
  el.querySelectorAll('mark').forEach(mark => {
    const parent = mark.parentNode;
    parent.replaceChild(document.createTextNode(mark.textContent), mark);
    parent.normalize();
  });
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ——— Active Nav ——— */
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
}

/* ——— Scroll to Top ——— */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ——— Intersection Observer (fade-up) ——— */
function initFadeUp() {
  const elements = document.querySelectorAll('.home-card, .theme-header');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

/* ——— Expand All / Collapse All ——— */
function expandAll() {
  document.querySelectorAll('.accordion').forEach(acc => acc.classList.add('open'));
}

function collapseAll() {
  document.querySelectorAll('.accordion').forEach(acc => acc.classList.remove('open'));
}

/* ——— Init ——— */
document.addEventListener('DOMContentLoaded', () => {
  initAccordions();
  initSearch();
  setActiveNav();
  initScrollTop();
  initFadeUp();
  openFromHash();
});
