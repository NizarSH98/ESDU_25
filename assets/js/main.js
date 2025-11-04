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

  // Header shrink on scroll
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

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

  // Enhanced reveal on scroll for all animated elements
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-reveal], .kpi, .card, .slide, .goal-card, .initiative-item, .mvv .card, .hero-ctas .btn, .ecosystem-card, .donor-card').forEach(el => io.observe(el));
  
  // Additional observers for sections and map
  const sectionIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible-fade-up'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.section, .map-stage, .timeline .year, .kotl-card, .logo-tile').forEach(el => sectionIo.observe(el));
  
  // Footer observer
  const footerIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.3 });
  const footer = document.querySelector('.site-footer');
  if (footer) footerIo.observe(footer);

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
      { year: 1996, text: 'IDRC support bails out community-based research: Arsaal project begins' },
      { year: 2001, text: 'ESDU established as interdisciplinary R&D unit at AUB/FAFS — Arsal case study ($750K)' },
      { year: 2002, text: 'First regional window: UNCCD collaboration begins' },
      { year: 2003, text: 'Healthy Basket launches: organic agriculture and farmer livelihoods' },
      { year: 2005, text: 'IFAD-NEMTA program: Agricultural management training across MENA' },
      { year: 2006, text: 'ESDU becomes 7th Center of RUAF (Resource Centres on Urban Agriculture)' },
      { year: 2007, text: 'Technology transfer: Yammouneh/Deir el Ahmar extension project' },
      { year: 2012, text: 'First AUB university budget allocation; 5,000+ actors trained to date' },
      { year: 2013, text: 'Food Heritage Foundation (FHF) established to conserve traditional food heritage' },
      { year: 2014, text: 'RCODE master\'s program hosting; EvalMENA third general assembly in Amman' },
      { year: 2015, text: 'Keepers of the Land Research Fund launched' },
      { year: 2017, text: 'KariaNet knowledge-sharing platform officially hosted by ESDU' },
      { year: 2018, text: 'REEF pilot: Rural Empowerment & Entrepreneurship Forum' },
      { year: 2019, text: 'Selected by Food Tank as initiative redefining food & agriculture in Middle East' },
      { year: 2020, text: 'CLIMAT wins Khalifa Date Palm Award; Ardi Ardak featured by FAO' },
      { year: 2021, text: 'Ardi Ardak national food security initiative; Urban Oasis renovation begins' },
      { year: 2023, text: 'Urban Oasis engagement center launched; wins PRIMA S1 Nexus Award — First Place' },
      { year: 2024, text: 'AFESD Small Green Innovative Project secured; Champion of Plastic Pollution Prevention' },
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
    
    // Observe timeline items for animations after they're created
    setTimeout(() => {
      const years = timeline.querySelectorAll('.year');
      years.forEach(year => sectionIo.observe(year));
    }, 100);
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

  // ESDU Outreach Map with Leaflet and Carto Light
  const mapContainer = document.getElementById('esdu-map-container');
  const tabLocal = document.getElementById('tab-local');
  const tabRegional = document.getElementById('tab-regional');
  const tabGlobal = document.getElementById('tab-global');
  
  if (mapContainer && window.L) {
    // Initialize Leaflet map with Carto Light basemap
    const map = L.map('esdu-map-container', {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      touchZoom: true,
      dragging: true
    }).setView([33.897, 35.478], 8); // Start at Lebanon view

    // Add Carto Light basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Use esduLocations data from imported script
    // Filter out RUAF-related locations
    function filterRUAF(locations) {
      if (!locations) return [];
      return locations.filter(loc => {
        const str = JSON.stringify(loc).toLowerCase();
        return !str.includes('ruaf');
      });
    }
    
    // Initialize data structure with RUAF locations filtered out
    let esduData = { 
      hub: typeof esduLocations !== 'undefined' ? esduLocations.hub : null, 
      local: typeof esduLocations !== 'undefined' ? filterRUAF(esduLocations.local) : [],
      regional: typeof esduLocations !== 'undefined' ? filterRUAF(esduLocations.regional) : [],
      global: typeof esduLocations !== 'undefined' ? filterRUAF(esduLocations.global) : []
    };

    // Render outreach map with connections
    function renderOutreachMap(map, data) {
      // Clear existing markers
      map.eachLayer(layer => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          map.removeLayer(layer);
        }
      });

      if (!data.hub) return;

      // Add hub marker (ESDU)
      const hubIcon = L.divIcon({
        className: 'esdu-hub-marker',
        html: `<div class="hub-pulse"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      
      const hubMarker = L.marker([data.hub.lat, data.hub.lon], { icon: hubIcon });
      hubMarker.bindPopup(
        `<div class="map-popup-content">
          <h4>${data.hub.title}</h4>
          <p>${data.hub.desc}</p>
        </div>`
      );
      hubMarker.addTo(map);

      // Store markers and connections for animation
      const markersAndConnections = [];
      
      // CRITICAL FIX: Create markers but DON'T add to map yet
      // This prevents Leaflet from calculating positions before view is set
      data.nodes.forEach((node, index) => {
        // Create node marker with wrapper div for animation (transform wrapper, not marker element)
        const nodeIcon = L.divIcon({
          className: 'esdu-node-marker',
          html: `<div class="marker-animation-wrapper" style="opacity: 0; transform: scale(0); transition: opacity 0.5s ease, transform 0.5s ease;"><div class="node-pulse"></div></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });
        
        const nodeMarker = L.marker([node.lat, node.lon], { icon: nodeIcon });
        
        // Build popup content
        let popupContent = `<div class="map-popup-content">`;
        if (node.logo) {
          popupContent += `<img src="${node.logo}" alt="${node.name}" class="popup-logo" />`;
        }
        popupContent += `<h4>${node.title}</h4><p>${node.desc}</p>`;
        if (node.website) {
          popupContent += `<a href="${node.website}" target="_blank" rel="noopener" class="popup-link">Visit Website →</a>`;
        }
        popupContent += `</div>`;
        
        nodeMarker.bindPopup(popupContent);

        // Create bidirectional animated curved connection line with great circle arc
        const points = [];
        const steps = 50;
        
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          // Great circle interpolation for smooth curve
          const lat1 = data.hub.lat * Math.PI / 180;
          const lon1 = data.hub.lon * Math.PI / 180;
          const lat2 = node.lat * Math.PI / 180;
          const lon2 = node.lon * Math.PI / 180;
          
          const d = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));
          
          if (d < 0.001) {
            points.push([data.hub.lat, data.hub.lon]);
            continue;
          }
          
          const A = Math.sin((1 - t) * d) / Math.sin(d);
          const B = Math.sin(t * d) / Math.sin(d);
          const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
          const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
          const z = A * Math.sin(lat1) + B * Math.sin(lat2);
          
          const finalLat = Math.atan2(z, Math.sqrt(x * x + y * y)) * 180 / Math.PI;
          const finalLon = Math.atan2(y, x) * 180 / Math.PI;
          
          points.push([finalLat, finalLon]);
        }
        
        const connectionLine = L.polyline(points, {
          color: '#840132',
          weight: 2,
          opacity: 0,
          dashArray: '10, 10',
          className: 'animated-connection-line bidirectional'
        });
        
        // Store for animation - markers NOT added to map yet
        markersAndConnections.push({
          marker: nodeMarker,
          connection: connectionLine,
          node: node,
          index: index
        });
      });
      
      // Calculate delay to fit all markers within 4 seconds max
      const totalMarkers = markersAndConnections.length;
      const maxAnimationTime = 4000; // 4 seconds in milliseconds
      const minDelay = 50; // Minimum delay between markers (50ms for smooth sequential effect)
      const maxDelay = totalMarkers > 1 ? Math.min(maxAnimationTime / (totalMarkers - 1), 200) : 0;
      const delayPerMarker = Math.max(minDelay, maxDelay);
      
      // NOW add markers to map one by one with calculated delay - they're already properly positioned
      markersAndConnections.forEach((item, index) => {
        const delay = index * delayPerMarker;
        
        setTimeout(() => {
          // Add marker to map - Leaflet will position it correctly NOW
          item.marker.addTo(map);
          
          // Add connection line
          item.connection.addTo(map);
          
          // Animate marker appearance using the wrapper div inside the icon
          const markerElement = item.marker.getElement();
          if (markerElement) {
            const wrapper = markerElement.querySelector('.marker-animation-wrapper');
            if (wrapper) {
              // Trigger animation by changing wrapper styles
              requestAnimationFrame(() => {
                wrapper.style.opacity = '1';
                wrapper.style.transform = 'scale(1)';
              });
            }
          }
          
          // Show connection line with animation
          const connectionElement = item.connection.getElement();
          if (connectionElement) {
            item.connection.setStyle({ opacity: 0.6 });
            // Add staggered delay to each line for wave effect (existing animation)
            const waveDelay = index * 0.3;
            connectionElement.style.animationDelay = `${waveDelay}s`;
          }
        }, delay);
      });
    }

    // Tab switching for local/regional/global views
    let currentView = 'local';
    
    function switchView(view) {
      currentView = view;
      
      // Filter nodes based on view
      let filteredNodes = [];
      if (view === 'local') {
        filteredNodes = esduData.local;
      } else if (view === 'regional') {
        filteredNodes = esduData.regional;
      } else if (view === 'global') {
        filteredNodes = esduData.global;
      }
      const filteredData = { hub: esduData.hub, nodes: filteredNodes };
      
      // Update UI
      tabLocal.setAttribute('aria-selected', view === 'local');
      tabRegional.setAttribute('aria-selected', view === 'regional');
      tabGlobal.setAttribute('aria-selected', view === 'global');
      
      // CRITICAL: Set map view FIRST before rendering markers
      // This ensures markers are positioned correctly from the start
      const setViewAndRender = () => {
        if (view === 'local') {
          // Local view: Show only Lebanon
          map.setView([33.897, 35.478], 8, { animate: false }); // No animation to ensure immediate positioning
        } else if (view === 'regional') {
          // Regional view: Show MENA region
          if (filteredNodes.length > 0) {
            const bounds = L.latLngBounds([esduData.hub.lat, esduData.hub.lon]);
            filteredNodes.forEach(node => {
              bounds.extend([node.lat, node.lon]);
            });
            map.fitBounds(bounds, { padding: [80, 80], maxZoom: 5, animate: false });
          } else {
            // Default MENA view if no nodes
            map.setView([28.0, 35.0], 5, { animate: false });
          }
        } else if (view === 'global') {
          // Global view: Show world map with all global connections
          if (filteredNodes.length > 0) {
            const bounds = L.latLngBounds([esduData.hub.lat, esduData.hub.lon]);
            filteredNodes.forEach(node => {
              bounds.extend([node.lat, node.lon]);
            });
            map.fitBounds(bounds, { padding: [90, 90], maxZoom: 2, animate: false });
          } else {
            // Default world view
            map.setView([20.0, 0.0], 2, { animate: false });
          }
        }
        
        // Wait for map to update, then render markers
        setTimeout(() => {
          map.invalidateSize();
          renderOutreachMap(map, filteredData);
        }, 10);
      };
      
      setViewAndRender();
    }

    tabLocal.addEventListener('click', () => switchView('local'));
    tabRegional.addEventListener('click', () => switchView('regional'));
    tabGlobal.addEventListener('click', () => switchView('global'));
    
  // Initial render
    switchView('local');
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
