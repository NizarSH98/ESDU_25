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
  const svgLocal = document.getElementById('map-local');
  const svgGlobal = document.getElementById('map-global');
  const editBtn = document.getElementById('map-edit-toggle');
  const hint = document.getElementById('coord-hint');
  // Data-driven nodes for easy editing (percentage coordinates relative to viewBox)
  const mapConfig = {
    // Fit rect lets you align where the actual map graphic sits inside the SVG viewBox (in % of viewBox)
    local: {
      bounds: { latMin: 33.05, latMax: 34.69, lonMin: 35.10, lonMax: 36.63 },
      fitRect: { x: 0, y: 0, w: 100, h: 100 },
    },
    global: {
      bounds: { latMin: -60, latMax: 80, lonMin: -180, lonMax: 180 },
      fitRect: { x: 0, y: 0, w: 100, h: 100 },
    }
  };

  // Data with real lat/lon; update and expand freely
  const outreachData = {
    local: {
      hub: { name: 'AUB/Beirut', title: 'ESDU Hub', desc: 'American University of Beirut — ESDU HQ', lat: 33.897, lon: 35.478 },
      nodes: [
        { name: 'Tripoli', title: 'North Lebanon', desc: 'Projects with small producers and markets', lat: 34.438, lon: 35.834 },
        { name: 'Zahle', title: 'Beqaa', desc: 'Agri-food capacity building', lat: 33.846, lon: 35.902 },
        { name: 'Baalbek', title: 'Baalbek-Hermel', desc: 'Livestock and climate resilience', lat: 34.006, lon: 36.208 },
        { name: 'Saida', title: 'South', desc: 'Value chains and women-led MSMEs', lat: 33.559, lon: 35.375 },
        { name: 'Nabatieh', title: 'Nabatieh', desc: 'Community training and outreach', lat: 33.377, lon: 35.483 }
      ]
    },
    global: {
      hub: { name: 'Lebanon', title: 'ESDU Hub', desc: 'Regional linkages from Beirut', lat: 33.897, lon: 35.478 },
      nodes: [
        { name: 'Brussels', title: 'EU Partners', desc: 'Food systems and urban agriculture networks', lat: 50.846, lon: 4.352 },
        { name: 'Ottawa', title: 'IDRC', desc: 'Evaluation and knowledge platforms', lat: 45.421, lon: -75.697 },
        { name: 'Tunis', title: 'MENA Partners', desc: 'Regional capacity and KM', lat: 36.806, lon: 10.181 },
        { name: 'Amman', title: 'Jordan', desc: 'Extension and training programs', lat: 31.956, lon: 35.945 },
        { name: 'Cairo', title: 'Egypt', desc: 'Agrifood value chains', lat: 30.044, lon: 31.236 }
      ]
    }
  };

  function clearLayer(svg) {
    const layer = svg.querySelector('[data-map-layer]');
    if (layer) layer.innerHTML = '';
    return layer;
  }

  function toPx(svg, percentX, percentY) {
    const vb = svg.viewBox.baseVal;
    const x = (percentX / 100) * vb.width + vb.x;
    const y = (percentY / 100) * vb.height + vb.y;
    return { x, y };
  }

  // Map backgrounds are embedded via <image href=...>; no fetch required.

  function project(mapType, svg, lat, lon) {
    const vb = svg.viewBox.baseVal;
    const cfg = mapConfig[mapType];
    const { latMin, latMax, lonMin, lonMax } = cfg.bounds;
    const { x, y, w, h } = cfg.fitRect;
    const px = ((lon - lonMin) / (lonMax - lonMin));
    const py = ((latMax - lat) / (latMax - latMin)); // invert Y for SVG
    const pX = (x + px * w) / 100;
    const pY = (y + py * h) / 100;
    return { X: vb.x + vb.width * pX, Y: vb.y + vb.height * pY };
  }

  function renderMap(panel, data, direction) {
    const svg = panel.querySelector('svg');
    const layer = clearLayer(svg);
    const mapType = panel.id === 'panel-local' ? 'local' : 'global';
    const hub = project(mapType, svg, data.hub.lat, data.hub.lon);

    // Hub
    const hubEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    hubEl.setAttribute('class', 'hub');
    hubEl.setAttribute('cx', String(hub.X));
    hubEl.setAttribute('cy', String(hub.Y));
    hubEl.setAttribute('r', '6');
    layer.appendChild(hubEl);

    data.nodes.forEach(n => {
      const p = project(mapType, svg, n.lat, n.lon);
      // Node
      const nodeEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      nodeEl.setAttribute('class', 'node');
      nodeEl.setAttribute('cx', String(p.X));
      nodeEl.setAttribute('cy', String(p.Y));
      nodeEl.setAttribute('r', '4');
      layer.appendChild(nodeEl);

      nodeEl.addEventListener('click', (ev) => {
        showPopup(svg, p.X, p.Y, n);
        ev.stopPropagation();
      });

      // Curved link
      const link = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      link.setAttribute('class', 'link');
      const c1x = (hub.X + p.X) / 2 + (hub.Y - p.Y) * 0.05;
      const c1y = (hub.Y + p.Y) / 2 + (p.X - hub.X) * 0.05;
      link.setAttribute('d', `M${hub.X},${hub.Y} C${c1x},${c1y} ${c1x},${c1y} ${p.X},${p.Y}`);

      // Reverse animation direction to indicate give/take without arrows
      if (direction === 'in') link.classList.add('alt');
      layer.appendChild(link);

      // Optional labels in edit mode
      if (editMode) {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', String(p.X + 6));
        label.setAttribute('y', String(p.Y - 6));
        label.setAttribute('fill', '#555');
        label.setAttribute('font-size', '10');
        label.textContent = n.name || '';
        layer.appendChild(label);
      }
    });
  }

  const popup = document.getElementById('map-popup');
  function svgXYToClient(svg, X, Y) {
    const pt = svg.createSVGPoint();
    pt.x = X; pt.y = Y;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { left: 0, top: 0 };
    const p = pt.matrixTransform(ctm);
    return { left: p.x, top: p.y };
  }
  function showPopup(svg, X, Y, data) {
    if (!popup) return;
    const pos = svgXYToClient(svg, X, Y);
    const stage = svg.closest('.map-stage');
    const stageRect = stage.getBoundingClientRect();
    popup.innerHTML = `<h4>${data.title || data.name}</h4><p>${data.desc || ''}</p>`;
    popup.style.left = `${pos.left - stageRect.left + 8}px`;
    popup.style.top = `${pos.top - stageRect.top - 6}px`;
    popup.hidden = false;
  }
  document.querySelector('.map-stage')?.addEventListener('click', () => { if (popup) popup.hidden = true; });
  let flowDir = 'out'; // 'out' or 'in'
  function activateMap(which) {
    const local = which === 'local';
    tabLocal?.setAttribute('aria-selected', String(local));
    tabGlobal?.setAttribute('aria-selected', String(!local));
    panelLocal?.classList.toggle('active', local);
    panelGlobal?.classList.toggle('active', !local);
    if (panelLocal && panelGlobal) {
      renderMap(panelLocal, outreachData.local, flowDir);
      renderMap(panelGlobal, outreachData.global, flowDir);
    }
  }
  tabLocal?.addEventListener('click', () => activateMap('local'));
  tabGlobal?.addEventListener('click', () => activateMap('global'));
  // Edit mode: click to get percentage coordinates
  let editMode = false;
  function svgClientToPercent(svg, clientX, clientY) {
    const pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    const vb = svg.viewBox.baseVal;
    const x = ((svgP.x - vb.x) / vb.width) * 100;
    const y = ((svgP.y - vb.y) / vb.height) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  }
  function handleMapClick(e) {
    if (!editMode) return;
    const svg = e.currentTarget;
    const pct = svgClientToPercent(svg, e.clientX, e.clientY);
    const txt = `${svg.id.includes('local') ? 'local' : 'global'}: { x: ${pct.x.toFixed(1)}, y: ${pct.y.toFixed(1)} }`;
    if (hint) hint.textContent = 'Helper (percent of viewBox): ' + txt + ' — use mapConfig.fitRect to align';
    // Draw a temp marker
    const layer = svg.querySelector('[data-map-layer]');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const vb = svg.viewBox.baseVal;
    circle.setAttribute('cx', String(vb.x + (pct.x/100)*vb.width));
    circle.setAttribute('cy', String(vb.y + (pct.y/100)*vb.height));
    circle.setAttribute('r', '4');
    circle.setAttribute('fill', '#888');
    layer.appendChild(circle);
    console.log('Map coordinate:', txt);
  }
  svgLocal?.addEventListener('click', handleMapClick);
  svgGlobal?.addEventListener('click', handleMapClick);
  editBtn?.addEventListener('click', () => {
    editMode = !editMode;
    editBtn.setAttribute('aria-pressed', String(editMode));
    if (hint) hint.textContent = editMode ? 'Edit mode ON — click map to get % coords' : 'Click the map to get % coordinates';
    // Re-render with labels if enabled
    renderMap(panelLocal, outreachData.local, flowDir);
    renderMap(panelGlobal, outreachData.global, flowDir);
  });
  // auto toggle for motion
  if (tabLocal && tabGlobal) {
    let showLocal = true;
    setInterval(() => {
      // flip map panel
      showLocal = !showLocal;
      activateMap(showLocal ? 'local' : 'global');
      // flip flow direction (give/take)
      flowDir = (flowDir === 'out') ? 'in' : 'out';
      if (panelLocal && panelGlobal) {
        renderMap(panelLocal, outreachData.local, flowDir);
        renderMap(panelGlobal, outreachData.global, flowDir);
      }
    }, 6000);
  }
  // Initial render
  if (panelLocal && panelGlobal) {
    renderMap(panelLocal, outreachData.local, flowDir);
    renderMap(panelGlobal, outreachData.global, flowDir);
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
