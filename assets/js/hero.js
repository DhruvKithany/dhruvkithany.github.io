/**
 * NEURAL SCROLL ENGINE // DHRUV KITHANY PORTFOLIO
 * High-performance, single-canvas, scroll-scrubbed neural trace.
 * Stabilized and trimmed: 0 layout thrashing, procedural visible spine, batched DOM writes,
 * safe layer isolation, and pure transform/opacity arrival reveals.
 */

(function () {
  'use strict';

  // -------------------------------------------------------------
  // 1. PALETTE & THEME
  // -------------------------------------------------------------
  const THEME = {
    bg: '#070709',
    coreWhite: '#F4F3EF',
    neutralRgb: { r: 142, g: 142, b: 142 }, // Pure neutral gray (0 chroma)
    neutralSolid: '#8E8E93',
    hairline: 'rgba(244, 243, 239, 0.12)',
    dormantNode: 'rgba(244, 243, 239, 0.28)'
  };

  const SECTIONS = {
    hero: { id: 'hero', name: 'Overview', color: '#F4F3EF', rgb: { r: 244, g: 243, b: 239 }, token: '--lobe-overview' },
    work: { id: 'work', name: 'Projects', color: '#F59E0B', rgb: { r: 245, g: 158, b: 11 }, token: '--lobe-work' },
    experience: { id: 'experience', name: 'Experience', color: '#38BDF8', rgb: { r: 56, g: 189, b: 248 }, token: '--lobe-experience' },
    education: { id: 'education', name: 'Education', color: '#10B981', rgb: { r: 16, g: 185, b: 129 }, token: '--lobe-education' },
    skills: { id: 'skills', name: 'Skills', color: '#38BDF8', rgb: { r: 56, g: 189, b: 248 }, token: '--lobe-skills' },
    writing: { id: 'writing', name: 'Writing', color: '#A78BFA', rgb: { r: 167, g: 139, b: 250 }, token: '--lobe-writing' },
    contact: { id: 'contact', name: 'Contact', color: '#5CE1E6', rgb: { r: 92, g: 225, b: 230 }, token: '--lobe-contact' }
  };

  function normalizeSectionKey(key) {
    if (!key) return 'hero';
    const k = String(key).toLowerCase();
    if (k === 'compute' || k === 'motor' || k === 'work' || k === 'projects') return 'work';
    if (k === 'executive' || k === 'experience') return 'experience';
    if (k === 'associative' || k === 'sensory' || k === 'education') return 'education';
    if (k === 'skills') return 'skills';
    if (k === 'limbic' || k === 'writing') return 'writing';
    if (k === 'contact') return 'contact';
    if (k === 'global' || k === 'hero') return 'hero';
    return SECTIONS[k] ? k : 'hero';
  }

  function getSectionData(key) {
    const norm = normalizeSectionKey(key);
    return SECTIONS[norm] || SECTIONS.hero;
  }

  function mixRgb(c1, c2, t) {
    const cl = Math.max(0, Math.min(1, t));
    const r = Math.round(c1.r * (1 - cl) + c2.r * cl);
    const g = Math.round(c1.g * (1 - cl) + c2.g * cl);
    const b = Math.round(c1.b * (1 - cl) + c2.b * cl);
    return `rgb(${r}, ${g}, ${b})`;
  }

  // -------------------------------------------------------------
  // 2. CANVAS & RESIZE HYGIENE
  // -------------------------------------------------------------
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });

  let width = 0;
  let height = 0;
  let dpr = 1;
  let totalDocHeight = 0;
  let trunkScreenX = 140;

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReducedMotion = motionQuery.matches;
  if (motionQuery.addEventListener) {
    motionQuery.addEventListener('change', (e) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        renderStaticFrame();
      } else if (isPageVisible) {
        lastTime = performance.now();
        requestAnimationFrame(render);
      }
    });
  // Listen for global reduce motion toggle
  window.addEventListener('reducemotionchange', (e) => {
    prefersReducedMotion = e.detail.reduceMotion || motionQuery.matches;
    if (prefersReducedMotion) {
      renderStaticFrame();
    } else if (isPageVisible) {
      lastTime = performance.now();
      requestAnimationFrame(renderLoop);
    }
  });

  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    measureTrunkPosition();
    measureAnchors();
    measureSectionBounds();
  }

  function measureTrunkPosition() {
    const lane = document.querySelector('.neural-trunk-lane');
    if (lane && window.getComputedStyle(lane).display !== 'none') {
      const rect = lane.getBoundingClientRect();
      trunkScreenX = Math.round(rect.left + rect.width * 0.72);
    } else {
      trunkScreenX = 18;
    }
  }

  // -------------------------------------------------------------
  // STAT COUNTERS & TABULAR FIGURES VIA --reach (PHASE 6)
  // -------------------------------------------------------------
  function initStatCounters() {
    const cards = document.querySelectorAll('.role-entry, .system-spread');
    cards.forEach(card => {
      const statEls = card.querySelectorAll('.stat-row strong, .role-telemetry strong');
      statEls.forEach(el => {
        if (el.hasAttribute('data-stat-target')) return;
        const text = el.textContent.trim();
        const match = text.match(/^([^0-9]*)([\d,]+(?:\.\d+)?)(.*)$/);
        if (match) {
          const prefix = match[1];
          const rawNum = match[2];
          const suffix = match[3];
          const numVal = parseFloat(rawNum.replace(/,/g, ''));
          if (!isNaN(numVal)) {
            el.setAttribute('data-stat-target', text);
            el.setAttribute('data-stat-num', numVal.toString());
            el.setAttribute('data-stat-prefix', prefix);
            el.setAttribute('data-stat-suffix', suffix);
            el.setAttribute('data-stat-has-comma', rawNum.includes(',') ? 'true' : 'false');
            el.setAttribute('data-stat-decimals', rawNum.includes('.') ? String(rawNum.split('.')[1].length) : '0');
          }
        }
      });
    });
  }

  function updateCardStats(card, reach) {
    if (!card) return;
    const statEls = card.querySelectorAll('strong[data-stat-target]');
    if (reach >= 0.95 || card.getAttribute('data-reached') === 'true') {
      statEls.forEach(el => {
        const targetText = el.getAttribute('data-stat-target');
        if (el.textContent !== targetText) {
          el.textContent = targetText;
        }
      });
      return;
    }

    statEls.forEach(el => {
      const numTarget = parseFloat(el.getAttribute('data-stat-num'));
      const prefix = el.getAttribute('data-stat-prefix') || '';
      const suffix = el.getAttribute('data-stat-suffix') || '';
      const hasComma = el.getAttribute('data-stat-has-comma') === 'true';
      const decimals = parseInt(el.getAttribute('data-stat-decimals') || '0', 10);

      const curVal = numTarget * reach;
      let formattedNum = decimals > 0 ? curVal.toFixed(decimals) : Math.round(curVal);
      if (hasComma) {
        formattedNum = Number(formattedNum).toLocaleString();
      }
      const newText = prefix + formattedNum + suffix;
      if (el.textContent !== newText) {
        el.textContent = newText;
      }
    });
  }

  // -------------------------------------------------------------
  // 3. ANCHOR MANAGEMENT (UPDATE IN-PLACE, NO WIPING)
  // -------------------------------------------------------------
  const domAnchors = [];
  const anchorMap = new Map(); // id -> anchor object

  function measureAnchors() {
    initStatCounters();
    const scroll = window.scrollY;
    totalDocHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      window.innerHeight
    );

    const els = document.querySelectorAll('.neural-anchor');
    els.forEach((el, idx) => {
      const id = el.getAttribute('data-node-id') || `anchor-${idx}`;
      const section = el.getAttribute('data-section') || el.getAttribute('data-section') || 'executive';
      const date = el.getAttribute('data-date') || '';
      const rect = el.getBoundingClientRect();
      const parent = el.closest('.role-entry, .system-spread, .writing-row, .hero-section, .section-wrap');

      let entryLeft = rect.left;
      let entryRight = rect.left + 500;
      let entryWidth = 500;
      let entryBottom = rect.top + scroll + 300;

      if (parent) {
        const pr = parent.getBoundingClientRect();
        entryLeft = pr.left;
        entryRight = pr.right;
        entryWidth = pr.width;
        entryBottom = pr.top + scroll + pr.height;
      }

      const worldX = rect.left + rect.width * 0.5;
      const worldY = rect.top + scroll + rect.height * 0.5;

      if (anchorMap.has(id)) {
        // UPDATE existing object in place without resetting dynamic scroll state
        const a = anchorMap.get(id);
        a.section = section;
        a.date = date;
        a.el = el;
        a.parent = parent;
        a.worldX = worldX;
        a.worldY = worldY;
        a.entryLeft = entryLeft;
        a.entryRight = entryRight;
        a.entryWidth = entryWidth;
        a.entryBottom = entryBottom;
        a.color = getSectionData(section).color;
        a.glow = getSectionData(section).glow;
      } else {
        // Create new anchor object
        const newAnchor = {
          id,
          section,
          el,
          parent,
          date,
          worldX,
          worldY,
          targetWidth: rect.width,
          entryLeft,
          entryRight,
          entryWidth,
          entryBottom,
          color: getSectionData(section).color,
          glow: getSectionData(section).glow,
          activation: 0,
          reach: 0,
          branchGrowth: 0,
          branchProgress: 0,
          prevReach: 0,
          prevReached: false,
          pulses: []
        };
        anchorMap.set(id, newAnchor);
        domAnchors.push(newAnchor);
      }

      // Generate deterministic polyline branch (regenerated only on remeasure)
      const trunkY = worldY - 24;
      const srcX = trunkScreenX + Math.sin(trunkY * 0.0035) * 6;
      const anchorObj = anchorMap.get(id);
      anchorObj.branchData = generateBranchPolyline(id, { x: srcX, y: trunkY }, { x: worldX, y: worldY });
    });

    domAnchors.sort((a, b) => a.worldY - b.worldY);
  }


  // -------------------------------------------------------------
  // 3B. SECTION BOUNDS & SCROLL-DRIVEN ACTIVATION (PHASE 3)
  // -------------------------------------------------------------
  const trackedSectionIds = ['hero', 'work', 'experience', 'education', 'skills', 'writing', 'contact'];
  const sectionBounds = [];
  let currentActivations = {};

  function measureSectionBounds() {
    sectionBounds.length = 0;
    const scroll = window.scrollY;
    for (let i = 0; i < trackedSectionIds.length; i++) {
      const id = trackedSectionIds[i];
      const el = document.getElementById(id);
      if (el) {
        const r = el.getBoundingClientRect();
        const headingEl = el.querySelector('.section-title') || el;
        const hr = headingEl.getBoundingClientRect();
        sectionBounds.push({
          id,
          el,
          worldTop: r.top + scroll,
          worldBottom: r.bottom + scroll,
          worldHeadingY: hr.top + scroll + hr.height * 0.5,
          height: r.height,
          data: SECTIONS[id] || SECTIONS.hero
        });
      }
    }
  }

  function getSectionAtWorldY(wy) {
    for (let i = 0; i < sectionBounds.length; i++) {
      const s = sectionBounds[i];
      if (wy >= s.worldTop && wy <= s.worldBottom) {
        return s.id;
      }
    }
    if (sectionBounds.length > 0) {
      if (wy < sectionBounds[0].worldTop) return sectionBounds[0].id;
      for (let i = 0; i < sectionBounds.length - 1; i++) {
        if (wy >= sectionBounds[i].worldTop && wy < sectionBounds[i + 1].worldTop) {
          return sectionBounds[i].id;
        }
      }
      return sectionBounds[sectionBounds.length - 1].id;
    }
    return 'hero';
  }

  function computeSectionActivations(scroll) {
    const H = height || window.innerHeight;
    const focusY = 0.45 * H;

    const rawActivations = [];
    for (let i = 0; i < sectionBounds.length; i++) {
      const sec = sectionBounds[i];
      const headingScreenY = sec.worldHeadingY - scroll;
      const dist = Math.abs(headingScreenY - focusY);
      const u = Math.max(0, 1.0 - (dist / (0.45 * H)));
      // smoothstep
      const rawA = u * u * (3.0 - 2.0 * u);
      rawActivations.push({ id: sec.id, rawA, dist, index: i });
    }

    // Find section with maximum activation
    let maxIdx = 0;
    let maxVal = -1;
    for (let i = 0; i < rawActivations.length; i++) {
      if (rawActivations[i].rawA > maxVal) {
        maxVal = rawActivations[i].rawA;
        maxIdx = i;
      }
    }

    const activations = {};
    const dominant = rawActivations[maxIdx];
    const dominantA = dominant ? dominant.rawA : 0;

    for (let i = 0; i < rawActivations.length; i++) {
      const item = rawActivations[i];
      if (i === maxIdx) {
        activations[item.id] = dominantA;
      } else {
        // Hysteresis: ensure no other section has a > 0.5 at any time
        const maxAllowed = Math.min(0.20, Math.max(0, 1.0 - dominantA) * 0.20);
        activations[item.id] = Math.min(item.rawA, maxAllowed);
      }
    }

    return activations;
  }

  function updateActivations(scroll) {
    currentActivations = computeSectionActivations(scroll);
    for (let i = 0; i < sectionBounds.length; i++) {
      const sec = sectionBounds[i];
      const a = currentActivations[sec.id] || 0;
      const isActive = a > 0.5;
      if (sec.el) {
        const curActive = sec.el.getAttribute('data-active') === 'true';
        if (isActive !== curActive) {
          pendingDomUpdates.push({
            type: 'attr',
            el: sec.el,
            name: 'data-active',
            val: isActive ? 'true' : 'false'
          });
        }
        pendingDomUpdates.push({
          type: 'style',
          el: sec.el,
          name: '--section-activation',
          val: a.toFixed(3)
        });
      }
    }
  }

  function getActiveSectionKey() {
    let maxA = 0;
    let bestKey = 'hero';
    for (const key in currentActivations) {
      if (currentActivations[key] > maxA) {
        maxA = currentActivations[key];
        bestKey = key;
      }
    }
    return bestKey;
  }

  // -------------------------------------------------------------
  // 4. HERO BRAIN MESH (3D DUAL-HEMISPHERE MESH)
  // -------------------------------------------------------------
  const HERO_NODES_COUNT = 120;
  const heroNodes = [];
  const heroEdges = [];

  function initHeroBrain() {
    heroNodes.length = 0;
    heroEdges.length = 0;

    for (let i = 0; i < HERO_NODES_COUNT; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 0.95;

      const hemi = (i % 2 === 0) ? 1 : -1;
      const x = r * Math.sin(phi) * Math.cos(theta) * 1.25 + (hemi * 0.32);
      const y = r * Math.cos(phi) * 0.95;
      const z = r * Math.sin(phi) * Math.sin(theta) * 1.05;

      heroNodes.push({
        bx: x,
        by: y,
        bz: z,
        hemi,
        radius: 1.8 + Math.random() * 2.2,
        color: hemi > 0 ? THEME.axonCyan : THEME.coreWhite,
        phase: Math.random() * Math.PI * 2
      });
    }

    for (let i = 0; i < heroNodes.length; i++) {
      for (let j = i + 1; j < heroNodes.length; j++) {
        const dx = heroNodes[i].bx - heroNodes[j].bx;
        const dy = heroNodes[i].by - heroNodes[j].by;
        const dz = heroNodes[i].bz - heroNodes[j].bz;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 0.44 && (heroNodes[i].hemi === heroNodes[j].hemi || Math.random() < 0.18)) {
          heroEdges.push({ a: i, b: j, dist });
        }
      }
    }
  }

  function drawHeroMeshHandoff(timeSec) {
    const heroScreenY = height * 0.34;
    const heroCenterX = width >= 1024 ? trunkScreenX + 320 : width * 0.5;
    const trunkTargetY = height * 0.90;

    // Funnel progress: p = clamp(camY / (innerHeight * 0.9), 0, 1)
    const pullT = Math.max(0, Math.min(1, camY / (window.innerHeight * 0.9)));
    const rotY = timeSec * 0.28 * (1.0 - pullT * 0.5);
    const rotX = Math.sin(timeSec * 0.15) * 0.12;

    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

    const projected = [];
    for (let i = 0; i < heroNodes.length; i++) {
      const n = heroNodes[i];
      let x1 = n.bx * cosY + n.bz * sinY;
      let z1 = -n.bx * sinY + n.bz * cosY;
      let y1 = n.by * cosX - z1 * sinX;
      let z2 = n.by * sinX + z1 * cosX;

      const curScale = 1.0 - pullT * 0.82;
      const curCenterX = heroCenterX + (trunkScreenX - heroCenterX) * pullT;
      const curCenterY = heroScreenY + (trunkTargetY - heroScreenY) * pullT;

      const fov = 380;
      const pScale = fov / (fov + z2 + 80);
      const px = curCenterX + x1 * pScale * curScale * 140;
      const py = curCenterY + y1 * pScale * curScale * 140;

      projected.push({ x: px, y: py, z: z2, alpha: 1.0 - pullT * 0.85, color: n.color, r: n.radius });
    }

    // Draw Edges
    if (pullT < 0.92) {
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = THEME.axonCyan;
      ctx.globalAlpha = (1.0 - pullT) * 0.22;
      ctx.beginPath();
      for (let i = 0; i < heroEdges.length; i++) {
        const e = heroEdges[i];
        const p1 = projected[e.a];
        const p2 = projected[e.b];
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
      }
      ctx.stroke();
    }

    // Draw Nodes
    for (let i = 0; i < projected.length; i++) {
      const p = projected[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (1.0 - pullT * 0.4), 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    }

    // Funnel tendrils into spine
    if (pullT > 0.08 && pullT < 0.98) {
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = THEME.axonCyan;
      ctx.globalAlpha = Math.sin(pullT * Math.PI) * 0.45;
      const offsets = [-36, -18, 0, 18, 36];
      for (let k = 0; k < offsets.length; k++) {
        const off = offsets[k];
        ctx.beginPath();
        ctx.moveTo(heroCenterX + off * (1 - pullT), heroScreenY + 40);
        ctx.bezierCurveTo(
          heroCenterX + off * 0.5,
          heroScreenY + (trunkTargetY - heroScreenY) * 0.5,
          trunkScreenX + off * 0.2,
          trunkTargetY - 20,
          trunkScreenX,
          trunkTargetY + 50
        );
        ctx.stroke();
      }
    }
  }

  // -------------------------------------------------------------
  // 5. PROCEDURAL SPINAL HIGHWAY & DATE STAMPS (NO FIXED ARRAY)
  // -------------------------------------------------------------
// getSectionAtWorldY defined in section 3B above

  function drawProceduralSpineWithDates(timeSec) {
    const startY = Math.max(0, Math.floor((camY - 300) / 40) * 40);
    const endY = Math.ceil((camY + height + 300) / 40) * 40;

    // 1. Dynamic Section-Colored Sheath & Core Filament Segments
    for (let wy = startY; wy < endY; wy += 40) {
      const wyNext = wy + 40;
      const sy1 = wy - camY;
      const sy2 = wyNext - camY;
      const wave1 = Math.sin(wy * 0.0035) * 6;
      const wave2 = Math.sin(wyNext * 0.0035) * 6;
      const x1 = trunkScreenX + wave1;
      const x2 = trunkScreenX + wave2;

      const secKey = getSectionAtWorldY(wy);
      const sec = SECTIONS[secKey] || SECTIONS.hero;
      const a = currentActivations[secKey] || 0;
      const segColor = mixRgb(THEME.neutralRgb, sec.rgb, a);

      // Outer Glowing Sheath in gated color
      ctx.beginPath();
      ctx.moveTo(x1, sy1);
      ctx.lineTo(x2, sy2);
      ctx.strokeStyle = segColor;
      ctx.lineWidth = 1.4 + 2.8 * a;
      ctx.globalAlpha = 0.10 + 0.35 * a;
      ctx.stroke();

      // High-Voltage Core
      ctx.beginPath();
      ctx.moveTo(x1, sy1);
      ctx.lineTo(x2, sy2);
      ctx.strokeStyle = a > 0.85 ? THEME.coreWhite : segColor;
      ctx.lineWidth = 1.0 + 0.6 * a;
      ctx.globalAlpha = 0.35 + 0.60 * a;
      ctx.stroke();
    }

    // 2. Spinal Nodes with Glowing Section Colors
    for (let wy = startY; wy <= endY; wy += 80) {
      const sy = wy - camY;
      if (sy < -40 || sy > height + 40) continue;

      const wave = Math.sin(wy * 0.0035) * 6;
      const x = trunkScreenX + wave;
      const isActive = Math.abs(wy - traceWorldY) < 140;
      const secKey = getSectionAtWorldY(wy);
      const sec = SECTIONS[secKey] || SECTIONS.hero;
      const a = currentActivations[secKey] || 0;
      const nodeColor = mixRgb(THEME.neutralRgb, sec.rgb, a);

      // Halo
      ctx.beginPath();
      ctx.arc(x, sy, isActive ? (5.0 + 2.0 * a) : (3.5 + 2.0 * a), 0, Math.PI * 2);
      ctx.fillStyle = nodeColor;
      ctx.globalAlpha = isActive ? (0.25 + 0.25 * a) : (0.10 + 0.20 * a);
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(x, sy, isActive ? 4.0 : (2.0 + 1.5 * a), 0, Math.PI * 2);
      ctx.fillStyle = isActive ? THEME.coreWhite : nodeColor;
      ctx.globalAlpha = isActive ? 1.0 : (0.45 + 0.50 * a);
      ctx.fill();
    }

    // 4. Date Stamps on the Spine (Resume dates next to anchors)
    for (let i = 0; i < domAnchors.length; i++) {
      const anchor = domAnchors[i];
      if (!anchor.date) continue;
      const screenY = anchor.worldY - camY;
      if (screenY < -60 || screenY > height + 60) continue;

      const wave = Math.sin(anchor.worldY * 0.0035) * 6;
      const x = trunkScreenX + wave;
      const isPassed = traceWorldY >= anchor.worldY - 20;
      const secKey = normalizeSectionKey(anchor.section);
      const sec = SECTIONS[secKey] || SECTIONS.hero;
      const a = currentActivations[secKey] || 0;
      const dateColor = mixRgb(THEME.neutralRgb, sec.rgb, a);

      // Node Terminal Tick
      ctx.beginPath();
      ctx.moveTo(x - 8, screenY);
      ctx.lineTo(x + 8, screenY);
      ctx.strokeStyle = isPassed ? (a > 0.5 ? dateColor : THEME.coreWhite) : THEME.dormantNode;
      ctx.lineWidth = isPassed ? 1.8 : 1.0;
      ctx.globalAlpha = isPassed ? 0.95 : 0.35;
      ctx.stroke();

      // Spine Node Circle
      ctx.beginPath();
      ctx.arc(x, screenY, isPassed ? 4.5 : 2.8, 0, Math.PI * 2);
      ctx.fillStyle = isPassed ? dateColor : THEME.dormantNode;
      ctx.globalAlpha = isPassed ? 0.95 : 0.45;
      ctx.fill();

      // Date Stamp Label on Desktop
      if (width >= 1024) {
        ctx.font = '500 10px "JetBrains Mono", monospace';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isPassed ? (a > 0.5 ? dateColor : THEME.coreWhite) : THEME.dormantNode;
        ctx.globalAlpha = isPassed ? 0.95 : 0.40;

        let displayDate = anchor.date;
        if (displayDate.includes(' - ')) {
          displayDate = displayDate.split(' - ')[0].trim();
        } else if (displayDate.includes('·')) {
          displayDate = displayDate.split('·')[0].trim();
        }

        const tw = ctx.measureText(displayDate).width;
        if (x - tw - 14 >= 10) {
          ctx.textAlign = 'right';
          ctx.fillText(displayDate, x - 14, screenY);
        } else {
          ctx.textAlign = 'left';
          ctx.fillText(displayDate, x + 14, screenY);
        }
      }
    }
  }


  // -------------------------------------------------------------
  // 6A. DETERMINISTIC SEEDED POLYLINE GENERATOR (PHASE 4)
  // -------------------------------------------------------------
  function hashString(str) {
    let hash = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }
    return hash >>> 0;
  }

  function createSeededRng(seed) {
    let s = seed >>> 0;
    return function() {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function generateBranchPolyline(anchorId, p0, p3) {
    const seed = hashString(anchorId);
    const rng = createSeededRng(seed);

    const dx = p3.x - p0.x;
    const dy = p3.y - p0.y;

    const p1 = {
      x: p0.x + dx * (0.32 + rng() * 0.10),
      y: p0.y + dy * 0.15 + (rng() - 0.5) * 10
    };
    const p2 = {
      x: p0.x + dx * (0.68 + rng() * 0.10),
      y: p0.y + dy * 0.85 + (rng() - 0.5) * 10
    };

    const polyline = [];
    const SAMPLES = 20;
    let prev = p0;
    let totalLength = 0;
    const cumLengths = [0];
    polyline.push({ x: p0.x, y: p0.y });

    for (let i = 1; i <= SAMPLES; i++) {
      const t = i / SAMPLES;
      const it = 1 - t;
      const x = it*it*it*p0.x + 3*it*it*t*p1.x + 3*it*t*t*p2.x + t*t*t*p3.x;
      const y = it*it*it*p0.y + 3*it*it*t*p1.y + 3*it*t*t*p2.y + t*t*t*p3.y;
      const d = Math.hypot(x - prev.x, y - prev.y);
      totalLength += d;
      cumLengths.push(totalLength);
      polyline.push({ x, y });
      prev = { x, y };
    }

    const numTwigs = 1 + Math.floor(rng() * 2);
    const twigs = [];
    for (let k = 0; k < numTwigs; k++) {
      const forkT = 0.35 + rng() * 0.35;
      const forkLen = totalLength * forkT;
      const forkIdx = Math.max(1, Math.min(SAMPLES - 1, Math.floor(forkT * SAMPLES)));
      const origin = polyline[forkIdx];
      const sign = (k % 2 === 0) ? 1 : -1;
      const twigAngle = Math.atan2(dy, dx) + sign * (0.45 + rng() * 0.3);
      const twigLen = 14 + rng() * 14;
      twigs.push({
        forkLen,
        origin,
        end: {
          x: origin.x + Math.cos(twigAngle) * twigLen,
          y: origin.y + Math.sin(twigAngle) * twigLen
        },
        len: twigLen
      });
    }

    const numDendrites = 3 + Math.floor(rng() * 3);
    const dendrites = [];
    for (let k = 0; k < numDendrites; k++) {
      const spread = (k / (numDendrites - 1) - 0.5) * 1.1;
      const angle = Math.atan2(dy, dx) + spread;
      const len = 8 + rng() * 10;
      dendrites.push({
        origin: p3,
        end: {
          x: p3.x + Math.cos(angle) * len,
          y: p3.y + Math.sin(angle) * len
        },
        len
      });
    }

    return { polyline, cumLengths, totalLength, twigs, dendrites };
  }

  // -------------------------------------------------------------
  // 6. SCRUBBED AXON BRANCHES & BATCHED DOM REVEALS
  // -------------------------------------------------------------
  const pendingDomUpdates = [];

    function drawScrubbedBranches(timeSec) {
    if (width < 420) return; // Mobile (<420px): no branches, clean 1px spine
    const H = height || window.innerHeight;
    const vpBottom = camY + H;

    for (let i = 0; i < domAnchors.length; i++) {
      const anchor = domAnchors[i];
      const screenTargetY = anchor.worldY - camY;
      if (screenTargetY < -140 || screenTargetY > H + 140) continue;

      // Pure scroll-driven deterministic growth g in [0, 1]
      // Starts at 0.95H from top (enters lower viewport) and completes at 0.40H from top
      const rawG = (vpBottom - anchor.worldY - 0.15 * H) / (0.45 * H);
      const clampedG = Math.max(0, Math.min(1, rawG));
      const g = clampedG * clampedG * (3.0 - 2.0 * clampedG);

      anchor.reach = g;
      anchor.branchGrowth = g;
      anchor.branchProgress = g;
      anchor.activation = g;

      // Queue DOM updates (batched at end of frame, no layout changes)
      if (anchor.parent) {
        if (g >= 0.5 && !anchor.prevReached) {
          anchor.prevReached = true;
          pendingDomUpdates.push({ type: 'attr', el: anchor.parent, name: 'data-reached', val: 'true' });
        } else if (g <= 0.2 && anchor.prevReached) {
          anchor.prevReached = false;
          pendingDomUpdates.push({ type: 'attr', el: anchor.parent, name: 'data-reached', val: 'false' });
        }

        if (Math.abs(g - anchor.prevReach) > 0.015) {
          anchor.prevReach = g;
          pendingDomUpdates.push({ type: 'style', el: anchor.parent, name: '--reach', val: g.toFixed(3) });
          pendingDomUpdates.push({ type: 'stats', el: anchor.parent, val: g });
        }
      }

      if (g <= 0.005) continue;

      if (!anchor.branchData) {
        const trunkY = anchor.worldY - 24;
        const srcX = trunkScreenX + Math.sin(trunkY * 0.0035) * 6;
        anchor.branchData = generateBranchPolyline(anchor.id, { x: srcX, y: trunkY }, { x: anchor.worldX, y: anchor.worldY });
      }

      const branch = anchor.branchData;
      const targetL = g * branch.totalLength;
      const pts = branch.polyline;
      const lens = branch.cumLengths;

      const secKey = normalizeSectionKey(anchor.section);
      const sec = SECTIONS[secKey] || SECTIONS.hero;
      const a = currentActivations[secKey] || 0;
      const branchColor = mixRgb(THEME.neutralRgb, sec.rgb, a);

      // 1. Draw Main Polyline Prefix
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y - camY);

      let tipX = pts[0].x;
      let tipY = pts[0].y - camY;
      let tipAngle = 0;

      for (let p = 1; p < pts.length; p++) {
        const curY = pts[p].y - camY;
        if (lens[p] <= targetL) {
          ctx.lineTo(pts[p].x, curY);
          tipX = pts[p].x;
          tipY = curY;
          tipAngle = Math.atan2(curY - (pts[p-1].y - camY), pts[p].x - pts[p-1].x);
        } else {
          const segL = lens[p] - lens[p - 1];
          const frac = segL > 0 ? (targetL - lens[p - 1]) / segL : 0;
          const prevY = pts[p - 1].y - camY;
          tipX = pts[p - 1].x + (pts[p].x - pts[p - 1].x) * frac;
          tipY = prevY + (curY - prevY) * frac;
          ctx.lineTo(tipX, tipY);
          tipAngle = Math.atan2(curY - prevY, pts[p].x - pts[p - 1].x);
          break;
        }
      }

      // Outer sheath
      ctx.strokeStyle = branchColor;
      ctx.lineWidth = Math.max(1.4, 3.2 * g);
      ctx.globalAlpha = Math.max(0.10, 0.45 * (0.3 + 0.7 * a));
      ctx.stroke();

      // Core filament
      ctx.strokeStyle = (g > 0.85 && a > 0.8) ? THEME.coreWhite : branchColor;
      ctx.lineWidth = Math.max(0.8, 1.6 * g);
      ctx.globalAlpha = Math.max(0.20, 0.90 * (0.4 + 0.6 * a));
      ctx.stroke();

      // 2. Growth Cone (Tip of growing axon when g < 0.98)
      if (g < 0.98) {
        const coneLen = 6.0;
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(tipX + Math.cos(tipAngle) * coneLen, tipY + Math.sin(tipAngle) * coneLen);
        ctx.strokeStyle = (a > 0.5) ? THEME.coreWhite : branchColor;
        ctx.lineWidth = 1.4;
        ctx.globalAlpha = 0.85;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(tipX, tipY, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = branchColor;
        ctx.globalAlpha = 0.95;
        ctx.fill();
      }

      // 3. Side Twigs (start only once fork point is reached)
      for (let k = 0; k < branch.twigs.length; k++) {
        const twig = branch.twigs[k];
        if (targetL > twig.forkLen) {
          const twigProg = Math.min(1.0, (targetL - twig.forkLen) / (twig.len * 1.1));
          const ox = twig.origin.x;
          const oy = twig.origin.y - camY;
          const ex = ox + (twig.end.x - twig.origin.x) * twigProg;
          const ey = oy + (twig.end.y - twig.origin.y) * twigProg;

          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(ex, ey);
          ctx.strokeStyle = branchColor;
          ctx.lineWidth = Math.max(0.8, 1.3 * twigProg);
          ctx.globalAlpha = 0.45 * (0.3 + 0.7 * a) * twigProg;
          ctx.stroke();
        }
      }

      // 4. Dendritic Twigs into heading (drawn progressively when g > 0.85)
      if (g > 0.85) {
        const dendProg = (g - 0.85) / 0.15;
        for (let d = 0; d < branch.dendrites.length; d++) {
          const dend = branch.dendrites[d];
          const ox = dend.origin.x;
          const oy = dend.origin.y - camY;
          const ex = ox + (dend.end.x - dend.origin.x) * dendProg;
          const ey = oy + (dend.end.y - dend.origin.y) * dendProg;

          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(ex, ey);
          ctx.strokeStyle = branchColor;
          ctx.lineWidth = 0.9;
          ctx.globalAlpha = 0.55 * (0.3 + 0.7 * a) * dendProg;
          ctx.stroke();
        }
      }

      // 5. Synapse Terminal (when g >= 0.98, holds with halo and bouton)
      if (g >= 0.98) {
        const termX = pts[pts.length - 1].x;
        const termY = pts[pts.length - 1].y - camY;

        ctx.beginPath();
        ctx.arc(termX, termY, 6.0, 0, Math.PI * 2);
        ctx.fillStyle = branchColor;
        ctx.globalAlpha = 0.25 * (0.3 + 0.7 * a);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(termX, termY, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = (a > 0.6) ? THEME.coreWhite : branchColor;
        ctx.globalAlpha = 0.95;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(termX - 6, termY);
        ctx.lineTo(termX + 6, termY);
        ctx.moveTo(termX, termY - 6);
        ctx.lineTo(termX, termY + 6);
        ctx.strokeStyle = branchColor;
        ctx.lineWidth = 1.0;
        ctx.globalAlpha = 0.75 * (0.3 + 0.7 * a);
        ctx.stroke();
      }
    }
  }

  // -------------------------------------------------------------
  // 7. ACTION POTENTIALS (SPINE & BRANCHES)
  // -------------------------------------------------------------
  const spinalPulses = [];
  const branchPulses = [];
  let pulseTimer = 0;

  class SpinalPulse {
    constructor(startY, targetY, speed, color) {
      this.worldY = startY;
      this.targetY = targetY;
      this.speed = speed;
      this.color = color;
      this.history = [];
      this.dead = false;
    }
    update(dt) {
      this.history.unshift(this.worldY);
      if (this.history.length > 8) this.history.pop();
      this.worldY += this.speed * (dt * 0.06);
      if (this.worldY >= this.targetY) this.dead = true;
    }
  }

  class BranchPulse {
    constructor(anchor, speed) {
      this.anchor = anchor;
      this.progress = 0;
      this.speed = speed;
      this.dead = false;
    }
    update(dt) {
      this.progress += this.speed * (dt * 0.06);
      if (this.progress >= 1.0) this.dead = true;
    }
  }

  function updateAndDrawActionPotentials(dt, timeSec) {
    if (prefersReducedMotion) return;

    // Spawn pulses tied to scroll velocity (zero when stopped, max 6 concurrent)
    const scrollVel = Math.abs(targetScrollY - lastCamY);
    lastCamY = camY;

    if (scrollVel > 1.5 && (spinalPulses.length + branchPulses.length) < 6) {
      pulseTimer += dt;
      if (pulseTimer > 60) {
        pulseTimer = 0;
        const activeSec = getActiveSectionKey();
        const sec = SECTIONS[activeSec] || SECTIONS.hero;
        const a = currentActivations[activeSec] || 0;
        if (a > 0.3) {
          const startY = Math.max(0, traceWorldY - window.innerHeight * 0.8);
          const targetY = traceWorldY + 60;
          spinalPulses.push(new SpinalPulse(startY, targetY, 12.0, mixRgb(THEME.neutralRgb, sec.rgb, a)));
        }
      }
    } else if (scrollVel <= 1.0) {
      // When scrolling stops, zero pulses immediately (Phase 4 requirement: zero when stopped)
      pulseTimer = 0;
      spinalPulses.length = 0;
      branchPulses.length = 0;
    }

    // Draw Spinal Pulses
    for (let i = spinalPulses.length - 1; i >= 0; i--) {
      const pulse = spinalPulses[i];
      pulse.update(dt);
      if (pulse.dead) { spinalPulses.splice(i, 1); continue; }

      const screenY = pulse.worldY - camY;
      if (screenY < -40 || screenY > height + 40) continue;

      const wave = Math.sin(pulse.worldY * 0.0035) * 6;
      const px = trunkScreenX + wave;

      ctx.beginPath();
      ctx.moveTo(px, screenY);
      for (let h = 0; h < pulse.history.length; h++) {
        const hy = pulse.history[h] - camY;
        const hx = trunkScreenX + Math.sin(pulse.history[h] * 0.0035) * 6;
        ctx.lineTo(hx, hy);
      }
      ctx.strokeStyle = pulse.color;
      ctx.lineWidth = 2.4;
      ctx.globalAlpha = 0.7;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(px, screenY, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = THEME.coreWhite;
      ctx.globalAlpha = 1.0;
      ctx.fill();
    }

    // Draw Branch Pulses
    for (let i = branchPulses.length - 1; i >= 0; i--) {
      const bp = branchPulses[i];
      bp.update(dt);
      if (bp.dead) { branchPulses.splice(i, 1); continue; }

      const anchor = bp.anchor;
      const screenTargetY = anchor.worldY - camY;
      if (screenTargetY < -50 || screenTargetY > height + 50) continue;

      const trunkWorldY = anchor.worldY - 24;
      const trunkScreenY = trunkWorldY - camY;
      const sourceX = trunkScreenX + Math.sin(trunkWorldY * 0.0035) * 6;
      const sourceY = trunkScreenY;

      const dx = anchor.worldX - sourceX;
      const p0 = { x: sourceX, y: sourceY };
      const p1 = { x: sourceX + dx * 0.38, y: sourceY + (screenTargetY - sourceY) * 0.05 };
      const p2 = { x: sourceX + dx * 0.72, y: screenTargetY - (screenTargetY - sourceY) * 0.12 };
      const p3 = { x: anchor.worldX, y: screenTargetY };

      const sub = splitCubicBezier(p0, p1, p2, p3, bp.progress);
      ctx.beginPath();
      ctx.arc(sub.p3.x, sub.p3.y, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = THEME.coreWhite;
      ctx.globalAlpha = 0.95;
      ctx.fill();
    }
  }

  // -------------------------------------------------------------
  // 8. LEADING SCROLL-TRACE SPARK (The Wavefront)
  // -------------------------------------------------------------
  function drawTraceWavefront(timeSec) {
    const screenSparkY = traceWorldY - camY;
    if (screenSparkY < -80 || screenSparkY > height + 80) return;

    const wave = Math.sin(traceWorldY * 0.0035) * 6;
    const sparkX = Math.max(18, Math.min(width - 18, trunkScreenX + wave));
    const activeSection = getSectionAtWorldY(traceWorldY);
    const sectionData = getSectionData(activeSection);

    const pulseRing = (Math.sin(traceWorldY * 0.015) + 1) * 0.5;
    ctx.beginPath();
    ctx.arc(sparkX, screenSparkY, 14 + pulseRing * 12, 0, Math.PI * 2);
    ctx.strokeStyle = sectionData.color;
    ctx.lineWidth = 1.0;
    ctx.globalAlpha = 0.45 * (1 - pulseRing * 0.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(sparkX, screenSparkY, 7.5, 0, Math.PI * 2);
    ctx.fillStyle = sectionData.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(sparkX, screenSparkY, 2.8, 0, Math.PI * 2);
    ctx.fillStyle = THEME.coreWhite;
    ctx.globalAlpha = 1.0;
    ctx.fill();

    for (let k = 0; k < 4; k++) {
      const angle = (k / 4) * Math.PI * 2 + traceWorldY * 0.01;
      const len = 16 + (k * 2);
      ctx.beginPath();
      ctx.moveTo(sparkX, screenSparkY);
      ctx.lineTo(sparkX + Math.cos(angle) * len, screenSparkY + Math.sin(angle) * len);
      ctx.strokeStyle = THEME.coreWhite;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.75;
      ctx.stroke();
    }
  }

  // -------------------------------------------------------------
  // 9. SECTION HUD (Plain Words)
  // -------------------------------------------------------------
  function drawSectionHUD() {
    // Replaced by live section readout on desktop (>=1280px)
    if (width >= 1280) return;
    if (width < 768) return;

    const activeSecKey = getActiveSectionKey();
    const sec = SECTIONS[activeSecKey] || SECTIONS.hero;
    const a = currentActivations[activeSecKey] || 0;
    if (a < 0.1) return;

    const hudX = 32;
    const hudY = height - 72; // Lifted >64px off bottom edge

    ctx.font = '500 13px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = mixRgb(THEME.neutralRgb, sec.rgb, a);
    ctx.globalAlpha = 0.35 + 0.65 * a;
    ctx.fillText(sec.name, hudX, hudY);
  }


  // -------------------------------------------------------------
  // 9B. LIVE SECTION READOUT (PHASE 5)
  // -------------------------------------------------------------
  const readoutNav = typeof document !== 'undefined' ? document.getElementById('section-readout') : null;
  const readoutRows = readoutNav ? Array.from(readoutNav.querySelectorAll('.readout-row')) : [];
  let lastReadoutTime = 0;

  const READOUT_SECTIONS = [
    { key: 'work', selector: '#work', targetId: 'work' },
    { key: 'experience', selector: '#experience', targetId: 'experience' },
    { key: 'education', selector: '#education', fallbackSelector: '#skills', targetId: 'education' },
    { key: 'writing', selector: '#writing', targetId: 'writing' },
    { key: 'contact', selector: '#contact', targetId: 'contact' }
  ];

  function getSectionCenter(secDef) {
    const el = document.querySelector(secDef.selector);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const scroll = window.scrollY;
    let top = r.top + scroll;
    let bottom = r.bottom + scroll;

    // For background (education + skills), span through skills if present
    if (secDef.key === 'education') {
      const skillsEl = document.querySelector('#skills');
      if (skillsEl) {
        const sr = skillsEl.getBoundingClientRect();
        bottom = sr.bottom + scroll;
      }
    }
    return (top + bottom) * 0.5;
  }

  function updateLiveReadout(scrollYNow, force = false) {
    if (!readoutNav) return;
    
    if (window.innerWidth < 1280) {
      readoutNav.style.display = 'none';
      return;
    }

    const lane = document.querySelector('.neural-trunk-lane');
    const mainCanvas = document.querySelector('.editorial-canvas');
    const gutterW = mainCanvas ? mainCanvas.getBoundingClientRect().left : (lane ? lane.getBoundingClientRect().right : 0);
    if (gutterW < 220) {
      readoutNav.style.display = 'none';
      return;
    } else {
      readoutNav.style.display = '';
    }

    const now = performance.now();
    if (!force && (now - lastReadoutTime < 50)) { // 20 times per second max (50ms interval)
      return;
    }
    lastReadoutTime = now;

    const H = window.innerHeight;
    const focusY = scrollYNow + H * 0.45;

    // Compute centers
    const centers = READOUT_SECTIONS.map(s => getSectionCenter(s));
    
    // Normalize distances: d_i = |focusY - center_i| / H
    const tau = 0.38;
    const d = centers.map(c => c !== null ? Math.abs(focusY - c) / H : 999);
    const z = d.map(dist => -dist / tau);
    const maxZ = Math.max(...z);
    const exp = z.map(val => Math.exp(val - maxZ));
    const sumExp = exp.reduce((a, b) => a + b, 0);
    const p = exp.map(v => v / sumExp);

    // Format to 2 decimals, ensure sum is exactly 1.00
    let rounded = p.map(v => Math.round(v * 100) / 100);
    let rSum = rounded.reduce((a, b) => a + b, 0);
    let diff = Math.round((1.00 - rSum) * 100) / 100;
    if (diff !== 0) {
      let maxIdx = 0;
      for (let i = 1; i < rounded.length; i++) {
        if (rounded[i] > rounded[maxIdx]) maxIdx = i;
      }
      rounded[maxIdx] = Math.round((rounded[maxIdx] + diff) * 100) / 100;
    }

    // Identify active row (max value)
    let maxIdx = 0;
    for (let i = 1; i < rounded.length; i++) {
      if (rounded[i] > rounded[maxIdx]) maxIdx = i;
    }

    for (let i = 0; i < readoutRows.length; i++) {
      const row = readoutRows[i];
      const valEl = row.querySelector('.readout-val');
      const barEl = row.querySelector('.readout-bar');
      const isActive = (i === maxIdx);

      const valStr = rounded[i].toFixed(2);
      if (valEl && valEl.textContent !== valStr) {
        valEl.textContent = valStr;
      }
      if (barEl) {
        barEl.style.width = Math.min(100, Math.round(rounded[i] * 100)) + '%';
      }

      if (isActive) {
        row.setAttribute('data-active', 'true');
        row.setAttribute('aria-current', 'true');
      } else {
        row.setAttribute('data-active', 'false');
        row.removeAttribute('aria-current');
      }
    }
  }

  // Smooth scroll handler on readout click
  if (readoutNav) {
    readoutRows.forEach(row => {
      row.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = row.getAttribute('href').replace('#', '');
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;
        const isReduced = prefersReducedMotion || document.documentElement.getAttribute('data-reduce-motion') === 'true';
        targetEl.scrollIntoView({ behavior: isReduced ? 'instant' : 'smooth' });

        readoutRows.forEach(r => {
          r.setAttribute('data-active', 'false');
          r.removeAttribute('aria-current');
          r.removeAttribute('data-clicked');
        });
        row.setAttribute('data-active', 'true');
        row.setAttribute('aria-current', 'true');
        row.setAttribute('data-clicked', String(Date.now()));
        window.location.hash = '#' + targetId;
      });
    });
  }

  // -------------------------------------------------------------
  // 10. DEBUG OVERLAY & SAFE LAYER WRAPPER
  // -------------------------------------------------------------
  const isDebug = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1';
  const layerStats = {};
  const loggedErrors = new Set();
  let debugOverlayEl = null;

  if (isDebug && typeof document !== 'undefined') {
    debugOverlayEl = document.createElement('div');
    debugOverlayEl.id = 'system-debug-overlay';
    debugOverlayEl.style.cssText = 'position:fixed;bottom:12px;right:12px;background:rgba(7,7,9,0.92);border:1px solid #38BDF8;color:#F4F3EF;font-family:monospace;font-size:11px;line-height:1.4;padding:10px 14px;z-index:99999;max-width:440px;pointer-events:none;border-radius:4px;box-shadow:0 4px 16px rgba(0,0,0,0.6);';
    document.body.appendChild(debugOverlayEl);
  }

  function safe(name, fn) {
    if (!layerStats[name]) {
      layerStats[name] = { lastMs: 0, errorCount: 0, lastError: null };
    }
    const t0 = performance.now();
    ctx.save();
    try {
      fn();
    } catch (err) {
      layerStats[name].errorCount++;
      layerStats[name].lastError = err.message || String(err);
      const errKey = name + ':' + err.message;
      if (!loggedErrors.has(errKey)) {
        loggedErrors.add(errKey);
        console.error(`[hero.js layer error in ${name} at camY=${Math.round(camY)}]:`, err);
      }
    } finally {
      ctx.restore();
      layerStats[name].lastMs = performance.now() - t0;
    }
  }

  function updateDebugOverlay() {
    if (!isDebug || !debugOverlayEl) return;
    const thrown = Object.entries(layerStats).filter(([_, s]) => s.errorCount > 0);
    const thrownHtml = thrown.length === 0
      ? '<span style="color:#10B981;">0 errors</span>'
      : thrown.map(([n, s]) => `<div style="color:#EF4444;">${n}: ${s.lastError} (${s.errorCount}x)</div>`).join('');

    const curDocH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    const layerMsList = Object.entries(layerStats).map(([n, s]) => `${n}: ${s.lastMs.toFixed(2)}ms`).join(' | ');

    debugOverlayEl.innerHTML = `
      <div style="font-weight:700;color:#38BDF8;margin-bottom:4px;">SYSTEM DEBUGGER (?debug=1)</div>
      <div><strong>Errors:</strong> ${thrownHtml}</div>
      <div><strong>camY:</strong> ${Math.round(camY)}px | <strong>traceWorldY:</strong> ${Math.round(traceWorldY)}px</div>
      <div><strong>DocHeight:</strong> ${curDocH}px vs totalDocHeight: ${Math.round(totalDocHeight)}px</div>
      <div><strong>Anchors:</strong> ${domAnchors.length} | <strong>trunkScreenX:</strong> ${trunkScreenX}px</div>
      <div style="margin-top:4px;color:#A1A1AA;font-size:10px;word-break:break-all;"><strong>Layers:</strong> ${layerMsList}</div>
    `;
  }

  // -------------------------------------------------------------
  // 11. MAIN RENDER LOOP
  // -------------------------------------------------------------
  let targetScrollY = window.scrollY;
  let camY = window.scrollY;
  let lastCamY = window.scrollY;
  let targetTraceWorldY = window.scrollY + window.innerHeight * 0.45;
  let traceWorldY = targetTraceWorldY;

  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
    targetTraceWorldY = window.scrollY + window.innerHeight * 0.45;
    updateLiveReadout(targetScrollY);
  }, { passive: true });

  let lastTime = performance.now();
  let isPageVisible = !document.hidden;

  function renderStaticFrame() {
    targetScrollY = window.scrollY;
    camY = targetScrollY;
    traceWorldY = targetScrollY + window.innerHeight * 0.45;
    updateActivations(camY);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1.0;
    ctx.clearRect(0, 0, width, height);

    if (camY < window.innerHeight * 1.3) {
      safe('heroMeshHandoff', () => drawHeroMeshHandoff(0));
    }
    safe('proceduralSpine', () => drawProceduralSpineWithDates(0));
    safe('scrubbedBranches', () => drawScrubbedBranches(0));
    safe('traceWavefront', () => drawTraceWavefront(0));
    safe('sectionHUD', () => drawSectionHUD());

    if (pendingDomUpdates.length > 0) {
      for (let i = 0; i < pendingDomUpdates.length; i++) {
        const u = pendingDomUpdates[i];
        if (u.type === 'attr') {
          u.el.setAttribute(u.name, u.val);
        } else if (u.type === 'style') {
          u.el.style.setProperty(u.name, u.val);
        } else if (u.type === 'stats') {
          updateCardStats(u.el, u.val);
        }
      }
      pendingDomUpdates.length = 0;
    }

    updateLiveReadout(camY, true);
    if (isDebug) updateDebugOverlay();
  }

  function render(now) {
    if (!isPageVisible) return;
    if (prefersReducedMotion) {
      renderStaticFrame();
      return;
    }

    requestAnimationFrame(render);

    const dt = Math.min(now - lastTime, 40);
    lastTime = now;
    const timeSec = now * 0.001;

    // Camera damping with snap
    if (Math.abs(targetScrollY - camY) < 0.5) {
      camY = targetScrollY;
    } else {
      camY += (targetScrollY - camY) * 0.22;
    }
    if (Math.abs(targetTraceWorldY - traceWorldY) < 0.5) {
      traceWorldY = targetTraceWorldY;
    } else {
      traceWorldY += (targetTraceWorldY - traceWorldY) * 0.24;
    }
    updateActivations(camY);

    // Reset canvas transform & alpha
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1.0;
    ctx.clearRect(0, 0, width, height);

    // 1. HERO MESH HANDOFF (FIRST 100VH)
    if (camY < window.innerHeight * 1.3) {
      safe('heroMeshHandoff', () => drawHeroMeshHandoff(timeSec));
    }

    // 2. PROCEDURAL SPINAL HIGHWAY & RESUME DATE STAMPS
    safe('proceduralSpine', () => drawProceduralSpineWithDates(timeSec));

    // 3. SCRUBBED AXON BRANCHES & ARRIVAL REVEALS
    safe('scrubbedBranches', () => drawScrubbedBranches(timeSec));

    // 4. ACTION POTENTIAL COMETS (SPINE & BRANCHES)
    safe('actionPotentials', () => updateAndDrawActionPotentials(dt, timeSec));

    // 5. LEADING SCROLL SPARK (WAVEFRONT)
    safe('traceWavefront', () => drawTraceWavefront(timeSec));

    // 6. SECTION HUD
    safe('sectionHUD', () => drawSectionHUD());

    // Flush batched DOM updates at end of frame
    if (pendingDomUpdates.length > 0) {
      for (let i = 0; i < pendingDomUpdates.length; i++) {
        const u = pendingDomUpdates[i];
        if (u.type === 'attr') {
          u.el.setAttribute(u.name, u.val);
        } else if (u.type === 'style') {
          u.el.style.setProperty(u.name, u.val);
        } else if (u.type === 'stats') {
          updateCardStats(u.el, u.val);
        }
      }
      pendingDomUpdates.length = 0;
    }

    if (isDebug) updateDebugOverlay();
  }

  // -------------------------------------------------------------
  // 12. INITIALIZATION & ROBUST RESIZEOBSERVER
  // -------------------------------------------------------------
  initHeroBrain();
  resize();

  window.addEventListener('resize', () => {
    resize();
  }, { passive: true });

  let remeasureDebounce = null;
  let lastBodyHeight = document.body.scrollHeight;

  function triggerRemeasure() {
    if (remeasureDebounce) clearTimeout(remeasureDebounce);
    remeasureDebounce = setTimeout(() => {
      measureTrunkPosition();
      measureAnchors();
      measureSectionBounds();
    }, 250); // Throttled to once per 250ms
  }

  window.remeasureConnectome = triggerRemeasure;
  window.heroLayerStats = layerStats;
  window.heroTrunkScreenX = () => trunkScreenX;

  if (typeof ResizeObserver !== 'undefined') {
    const bodyRo = new ResizeObserver((entries) => {
      const curHeight = document.body.scrollHeight;
      // Only fire when body height changes by more than 2px
      if (Math.abs(curHeight - lastBodyHeight) > 2) {
        lastBodyHeight = curHeight;
        triggerRemeasure();
      }
    });
    bodyRo.observe(document.body);
  }

  // Visibility Change Listener
  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    if (isPageVisible && !prefersReducedMotion) {
      lastTime = performance.now();
      requestAnimationFrame(render);
    }
  });

  // Reduced motion single static frame re-render on scroll
  let reducedScrollScheduled = false;
  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
    targetTraceWorldY = window.scrollY + window.innerHeight * 0.45;

    if (prefersReducedMotion) {
      if (!reducedScrollScheduled) {
        reducedScrollScheduled = true;
        requestAnimationFrame(() => {
          renderStaticFrame();
          reducedScrollScheduled = false;
        });
      }
    }
  }, { passive: true });

  updateLiveReadout(window.scrollY, true);
  if (prefersReducedMotion) {
    renderStaticFrame();
  } else {
    requestAnimationFrame(render);
  }

})();
