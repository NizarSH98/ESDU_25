// Basic site interactions, sliders, timeline, counters, outreach dots

// Utility: on DOM ready
function ready(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}

ready(() => {
  // Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  if (nav && toggle) {
    toggle.addEventListener('click', () => {
      const expanded = nav.getAttribute('aria-expanded') === 'true';
      nav.setAttribute('aria-expanded', String(!expanded));
      toggle.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-reveal], .kpi, .card, .slide').forEach(el => io.observe(el));

  // Mission/Vision/Values – slider controls (mobile)
  const slider = document.querySelector('.mvv .card-slider');
  if (slider) {
    const cards = Array.from(slider.children);
    const dotsWrap = document.querySelector('.slider-dots');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const dots = cards.map((_, i) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', `Go to slide ${i+1}`);
      dotsWrap.appendChild(b);
      b.addEventListener('click', () => goTo(i));
      return b;
    });
    function goTo(i) {
      const card = cards[i];
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      dots.forEach(d => d.removeAttribute('aria-current'));
      dots[i].setAttribute('aria-current', 'true');
    }
    prevBtn?.addEventListener('click', () => {
      const i = Math.max(0, activeIndex(cards));
      goTo(Math.max(0, i - 1));
    });
    nextBtn?.addEventListener('click', () => {
      const i = Math.max(0, activeIndex(cards));
      goTo(Math.min(cards.length - 1, i + 1));
    });
    // init
    if (dots[0]) dots[0].setAttribute('aria-current', 'true');
  }

  // ESDU at Work – simple carousel
  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const prev = carousel.querySelector('.carousel-prev');
    const next = carousel.querySelector('.carousel-next');
    const dotsWrap = carousel.querySelector('.carousel-dots');
    let index = 0;

    // Dots
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.addEventListener('click', () => { index = i; render(); });
      dotsWrap.appendChild(b);
    });

    // Coverflow neighbor classing
    function applyCoverflow() {
      slides.forEach((s, i) => {
        s.classList.remove('is-prev','is-next','is-active');
        if (i === index) s.classList.add('is-active');
        if (i === ((index - 1 + slides.length) % slides.length)) s.classList.add('is-prev');
        if (i === ((index + 1) % slides.length)) s.classList.add('is-next');
      });
    }

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dotsWrap.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-current', i === index));
      applyCoverflow();
    }

    prev.addEventListener('click', () => { index = (index - 1 + slides.length) % slides.length; render(); });
    next.addEventListener('click', () => { index = (index + 1) % slides.length; render(); });

    // Keyboard and swipe
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prev.click();
      if (e.key === 'ArrowRight') next.click();
    });
    let startX = 0;
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (dx > 40) prev.click(); else if (dx < -40) next.click();
    });

    render();
    // auto-advance
    setInterval(() => { index = (index + 1) % slides.length; render(); }, 4500);
  }

  // Timeline – curated milestones from extracted PDFs
  const timeline = document.querySelector('[data-timeline]');
  if (timeline) {
    const milestones = [
      { year: 1999, text: 'Community-based research momentum builds at FAFS' },
      { year: 2001, text: 'ESDU established as interdisciplinary R&D unit (AUB/FAFS)' },
      { year: 2003, text: 'Healthy Basket: organic agriculture and farmer livelihoods' },
      { year: 2006, text: 'RUAF MENA center: urban agriculture & food security' },
      { year: 2007, text: 'Technology transfer and extension — Yammouneh/Deir el Ahmar' },
      { year: 2012, text: 'First university budget allocation; 5,000 actors trained to date' },
      { year: 2014, text: 'RCODE master’s program hosting and evaluation leadership' },
      { year: 2015, text: 'Keepers of the Land — research fund launched' },
      { year: 2017, text: 'KariaNet knowledge-sharing platform hosted by ESDU' },
      { year: 2018, text: 'REEF: Rural Empowerment & Entrepreneurship Forum (pilot)' },
      { year: 2021, text: 'Ardi Ardak national food security initiative' },
      { year: 2023, text: 'Urban Oasis soft launch; living lab and engagement hub' },
      { year: 2024, text: 'AFESD Small Green Innovative Project secured' },
      { year: 2025, text: 'Strategy 2025–2030 and Portfolio 2025 published' },
    ];
    milestones.forEach(m => {
      const year = document.createElement('div');
      year.className = 'year';
      const h = document.createElement('h4');
      h.textContent = String(m.year);
      const p = document.createElement('p');
      p.textContent = m.text;
      year.append(h, p);
      timeline.appendChild(year);
    });

    const rail = timeline.querySelector('.rail');
    const progress = timeline.querySelector('.progress');
    const items = Array.from(timeline.querySelectorAll('.year'));
    let ti = 0;

    function setActive(i) {
      items.forEach((el, idx) => el.classList.toggle('active', idx === i));
      const pct = (i + 1) / items.length;
      const railWidth = rail.getBoundingClientRect().width;
      progress.style.width = `${Math.max(0, Math.floor(railWidth * pct))}px`;
      // Smoothly scroll the timeline container horizontally without affecting page scroll
      const container = timeline; // .timeline-track element
      const item = items[i];
      const targetLeft = item.offsetLeft - (container.clientWidth / 2) + (item.clientWidth / 2);
      container.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
    }

    setActive(0);
    setInterval(() => {
      ti = (ti + 1) % items.length;
      setActive(ti);
    }, 2600);
  }

  // Impact counters
  const counters = document.querySelectorAll('.kpi-value[data-count]');
  const cIo = new IntersectionObserver((entries, obs) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      const end = parseInt(target.getAttribute('data-count') || '0', 10);
      animateCount(target, end, 1200);
      obs.unobserve(target);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cIo.observe(c));

  function animateCount(el, end, duration) {
    const start = 0;
    const startTime = performance.now();
    function frame(now) {
      const p = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(start + (end - start) * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // Outreach maps – toggle Local/Global panels
  const tabLocal = document.getElementById('tab-local');
  const tabGlobal = document.getElementById('tab-global');
  const panelLocal = document.getElementById('panel-local');
  const panelGlobal = document.getElementById('panel-global');
  function activateMap(which) {
    const local = which === 'local';
    tabLocal?.setAttribute('aria-selected', String(local));
    tabGlobal?.setAttribute('aria-selected', String(!local));
    panelLocal?.classList.toggle('active', local);
    panelGlobal?.classList.toggle('active', !local);
  }
  tabLocal?.addEventListener('click', () => activateMap('local'));
  tabGlobal?.addEventListener('click', () => activateMap('global'));
  // auto toggle for motion
  if (tabLocal && tabGlobal) {
    let showLocal = true;
    setInterval(() => { showLocal = !showLocal; activateMap(showLocal ? 'local' : 'global'); }, 6000);
  }
});

// Helper: find active index from scroll position
function activeIndex(nodes) {
  let idx = 0, min = Infinity;
  const rect = nodes[0].parentElement.getBoundingClientRect();
  nodes.forEach((n, i) => {
    const r = n.getBoundingClientRect();
    const d = Math.abs((r.left + r.right) / 2 - (rect.left + rect.right) / 2);
    if (d < min) { min = d; idx = i; }
  });
  return idx;
}
