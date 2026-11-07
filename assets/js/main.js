/**
 * DHRUV KITHANY // CORE INTERACTION & FLAGSHIP DEMO SUITE
 * 
 * Scoped Demos:
 * 1. SIRIS: Intent Router & Entra ID Security Scope Playground (Query 1-4)
 * 2. StackScope: C0 Bytecode VM Stepper (~525 MIPS)
 * 3. MindMesh: 10-20 EEG Multichannel Oscilloscope
 * 4. Lumina: 3D Facial Landmark Mesh & Telemetry HUD
 * 
 * Global Controls:
 * - Header Static View Toggle (#global-static-toggle)
 * - Header Architecture Index Dialog (#global-index-toggle)
 */

(function () {
  'use strict';

  const motionQuery = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReducedMotion = motionQuery ? motionQuery.matches : false;
  let isGlobalStaticView = false;

  // -------------------------------------------------------------
  // 1. STICKY HEADER ELEVATION
  // -------------------------------------------------------------
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 16) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // -------------------------------------------------------------
  // 2. GLOBAL CONTROLS (HEADER STATIC VIEW & INDEX DIALOG)
  // -------------------------------------------------------------
  const globalStaticBtn = document.getElementById('global-static-toggle');
  const globalIndexBtn = document.getElementById('global-index-toggle');
  const globalIndexModal = document.getElementById('global-index-modal');
  const globalIndexClose = document.getElementById('global-index-close');
  const globalIndexBackdrop = document.getElementById('global-index-backdrop');

  function setGlobalStaticView(enable) {
    isGlobalStaticView = enable;
    document.body.classList.toggle('global-static-view', enable);
    document.body.classList.toggle('reduce-motion', enable);
    try {
      localStorage.setItem('reduceMotion', enable ? 'true' : 'false');
    } catch (e) {}
    if (globalStaticBtn) {
      globalStaticBtn.setAttribute('aria-pressed', enable ? 'true' : 'false');
      globalStaticBtn.textContent = 'Reduce motion';
    }
    window.dispatchEvent(new CustomEvent('reducemotionchange', { detail: { reduceMotion: enable } }));
    // Re-render static frames for canvases
    if (typeof window.drawMindMeshFrame === 'function') window.drawMindMeshFrame();
    if (typeof window.drawLuminaFrame === 'function') window.drawLuminaFrame();
  }

  // Restore saved reduce motion preference
  (function () {
    try {
      if (localStorage.getItem('reduceMotion') === 'true') {
        setGlobalStaticView(true);
      }
    } catch (e) {}
  })();

  if (globalStaticBtn) {
    globalStaticBtn.addEventListener('click', function () {
      setGlobalStaticView(!isGlobalStaticView);
    });
  }

  function openIndexModal() {
    if (!globalIndexModal) return;
    globalIndexModal.removeAttribute('hidden');
    if (globalIndexBtn) globalIndexBtn.setAttribute('aria-expanded', 'true');
    if (globalIndexClose) globalIndexClose.focus();
  }

  function closeIndexModal() {
    if (!globalIndexModal) return;
    globalIndexModal.setAttribute('hidden', '');
    if (globalIndexBtn) {
      globalIndexBtn.setAttribute('aria-expanded', 'false');
      globalIndexBtn.focus();
    }
  }

  if (globalIndexBtn) {
    console.log('Attaching listener to globalIndexBtn', !!globalIndexBtn, !!globalIndexModal);
    globalIndexBtn.addEventListener('click', function () {
      console.log('CLICK FIRED ON globalIndexBtn');
      const isHidden = globalIndexModal && globalIndexModal.hasAttribute('hidden');
      if (isHidden) openIndexModal();
      else closeIndexModal();
    });
  }

  if (globalIndexClose) {
    globalIndexClose.addEventListener('click', closeIndexModal);
  }

  if (globalIndexBackdrop) {
    globalIndexBackdrop.addEventListener('click', closeIndexModal);
  }
  if (globalIndexModal) {
    const jumpLinks = globalIndexModal.querySelectorAll('.jump-link');
    jumpLinks.forEach(link => {
      link.addEventListener('click', closeIndexModal);
    });
  }

  window.addEventListener('keydown', function (e) {
    if (e.key === 'i' || e.key === 'I') {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea') return;
      if (globalIndexModal) {
        if (globalIndexModal.hasAttribute('hidden')) openIndexModal();
        else closeIndexModal();
      }
    } else if (e.key === 'Escape') {
      if (globalIndexModal && !globalIndexModal.hasAttribute('hidden')) {
        closeIndexModal();
      }
    }
  });

  // -------------------------------------------------------------
  // 3. FLAGSHIP DEMO 1: SIRIS INTENT ROUTER & SECURITY SCOPE
  // -------------------------------------------------------------
    const sirisRoot = document.querySelector('[data-demo="siris"]');
  if (sirisRoot) {
    const sirisWrapper = document.getElementById('siris-scene-wrapper');
    const elQueryDisplay = document.getElementById('siris-query-display');
    const elProgressPct = document.getElementById('siris-progress-pct');
    const elPhase = document.getElementById('siris-phase-indicator');
    const elStageLatency = document.getElementById('siris-stage-latency');
    const elStageScope = document.getElementById('siris-stage-scope');
    const elStageCompliance = document.getElementById('siris-stage-compliance');
    const elMeshRouter = document.getElementById('siris-mesh-router');
    const elRouterStatus = document.getElementById('siris-router-status');
    const elTokenPacket = document.getElementById('siris-token-packet');
    const specNodes = sirisRoot.querySelectorAll('.siris-mesh-node');

    const sirisBtns = sirisRoot.querySelectorAll('.siris-btn');
    const elAgent = sirisRoot.querySelector('.siris-val-agent');
    const elRepo = sirisRoot.querySelector('.siris-val-repo');
    const elScope = sirisRoot.querySelector('.siris-val-scope');
    const elLatency = sirisRoot.querySelector('.siris-val-latency');
    const elVerdict = sirisRoot.querySelector('.siris-val-verdict');
    const mLatency = sirisRoot.querySelector('.siris-m-latency');
    const mScope = sirisRoot.querySelector('.siris-m-scope');
    const mCompliance = sirisRoot.querySelector('.siris-m-compliance');

    const sirisQueries = {
      'q-standards': {
        query: 'Standard 4.2: Verify TLS 1.3 in-transit cipher requirements for all egress pipelines.',
        targetNode: 'standards',
        agent: 'Standards Specialist Agent',
        repo: 'SharePoint: Approved Standards (Certified 2026)',
        scope: 'OAuth 2.0 User.Delegated | Scope: Read.SharePoint.Standards',
        latency: '240 ms',
        verdict: 'Standard 4.2 requires TLS 1.3 in-transit encryption with AES-256 for all cloud-egress pipelines.',
        metricLatency: '240ms',
        metricScope: 'User.Delegated',
        metricCompliance: '100% (20/20)',
        isRefusal: false
      },
      'q-exceptions': {
        query: 'Does storing client PII in an uncertified AWS region require an architecture exception?',
        targetNode: 'exceptions',
        agent: 'Exceptions & Waivers Agent',
        repo: 'SharePoint: Active Architecture Waivers Register',
        scope: 'OAuth 2.0 User.Delegated | Scope: Read.SharePoint.Exceptions',
        latency: '310 ms',
        verdict: 'Waiver permitted only with 90-day expiration cap and zero production PII ingestion.',
        metricLatency: '310ms',
        metricScope: 'User.Delegated',
        metricCompliance: '100% (20/20)',
        isRefusal: false
      },
      'q-ptb': {
        query: 'Request write clearance for Core Banking distributed ledger integration.',
        targetNode: 'ptb',
        agent: 'Core Banking Intent Guardrail',
        repo: 'Grounding Filter: Core Banking Core Ledger',
        scope: 'OAuth 2.0 User.Delegated | Scope: Read.SharePoint.PtB (Restricted)',
        latency: '190 ms',
        verdict: 'Query rejected by security router: Core banking write transactions exceed SIRIS read-only architecture scope.',
        metricLatency: '190ms',
        metricScope: 'Restricted',
        metricCompliance: 'Blocked (Guardrail)',
        isRefusal: true
      },
      'q-refusal': {
        query: 'Can you recommend vacation spots and flights to Switzerland for next summer?',
        targetNode: null,
        agent: 'Refusal Guardrail (Out of Scope)',
        repo: 'Scope Filter: Uncertified External Domain',
        scope: 'OAuth 2.0 User.Delegated | Scope: None (Access Denied)',
        latency: '120 ms',
        verdict: 'Access Refused: Non-architectural general domain query. SIRIS router bounds responses strictly to verified corporate architecture repositories.',
        metricLatency: '120ms',
        metricScope: 'Denied',
        metricCompliance: 'Refusal Enforced',
        isRefusal: true
      }
    };

    let activeKey = 'q-standards';
    let currentP = 0;

    // Pure function of scroll progress p in [0, 1]
    window.renderSirisScene = function (p) {
      currentP = Math.max(0, Math.min(1, p));
      const data = sirisQueries[activeKey] || sirisQueries['q-standards'];
      const queryStr = data.query;

      if (elProgressPct) {
        elProgressPct.textContent = Math.round(currentP * 100) + '%';
      }

      // Beat 1: Query typing (0 - 0.15)
      const qP = Math.min(1, Math.max(0, currentP / 0.15));
      const charsToShow = Math.round(qP * queryStr.length);
      if (elQueryDisplay) {
        elQueryDisplay.textContent = queryStr.slice(0, charsToShow);
      }

      // Beat 2: Router classification (0.15 - 0.35)
      const rP = Math.min(1, Math.max(0, (currentP - 0.15) / 0.20));

      // Beat 3: Packet travel & node highlight (0.35 - 0.60)
      const pkP = Math.min(1, Math.max(0, (currentP - 0.35) / 0.25));

      // Beat 4: Retrieval (0.60 - 0.80)
      const retP = Math.min(1, Math.max(0, (currentP - 0.60) / 0.20));

      if (currentP < 0.15) {
        if (elPhase) elPhase.textContent = '01 / Query Ingestion';
        if (mLatency) mLatency.textContent = '-- ms';
        if (mScope) mScope.textContent = 'None';
        if (mCompliance) mCompliance.textContent = '--';
        if (elMeshRouter) elMeshRouter.classList.remove('active');
        if (elRouterStatus) elRouterStatus.textContent = 'STANDBY';
        if (elTokenPacket) elTokenPacket.style.display = 'none';
        specNodes.forEach(n => n.classList.remove('active-node'));

        if (elAgent) elAgent.textContent = '--';
        if (elLatency) elLatency.textContent = '-- ms';
        if (elRepo) elRepo.textContent = '--';
        if (elScope) elScope.textContent = '--';
        if (elVerdict) elVerdict.textContent = 'Awaiting query ingestion completion...';
      } else if (currentP < 0.35) {
        if (elPhase) elPhase.textContent = '02 / Intent Classification';
        const lat = Math.round(40 + rP * 50) + ' ms';
        if (mLatency) mLatency.textContent = lat;
        if (mScope) mScope.textContent = 'User.Delegated';
        if (mCompliance) mCompliance.textContent = '--';
        if (elMeshRouter) elMeshRouter.classList.add('active');
        if (elRouterStatus) elRouterStatus.textContent = 'CLASSIFYING (' + Math.round(rP * 100) + '%)';
        if (elTokenPacket) elTokenPacket.style.display = 'none';
        specNodes.forEach(n => n.classList.remove('active-node'));

        if (elAgent) elAgent.textContent = 'Router evaluating ontology...';
        if (elLatency) elLatency.textContent = lat;
        if (elRepo) elRepo.textContent = 'Matching federated vector indexes...';
        if (elScope) elScope.textContent = 'Resolving Entra ID claims...';
        if (elVerdict) elVerdict.textContent = 'Evaluating query intent vector...';
      } else if (currentP < 0.60) {
        if (elPhase) elPhase.textContent = '03 / Sub-Agent Dispatch';
        const lat = Math.round(90 + pkP * 60) + ' ms';
        if (mLatency) mLatency.textContent = lat;
        if (mScope) mScope.textContent = data.metricScope;
        if (mCompliance) mCompliance.textContent = '--';
        if (elMeshRouter) elMeshRouter.classList.remove('active');
        if (elRouterStatus) elRouterStatus.textContent = 'DISPATCHED';

        specNodes.forEach(n => {
          const match = data.targetNode && n.getAttribute('data-agent-node') === data.targetNode;
          n.classList.toggle('active-node', match);
        });

        if (elTokenPacket) {
          if (data.targetNode) {
            elTokenPacket.style.display = 'block';
            elTokenPacket.style.left = Math.round(20 + pkP * 60) + '%';
            elTokenPacket.style.top = Math.round(30 + pkP * 35) + '%';
          } else {
            elTokenPacket.style.display = 'none';
          }
        }

        if (elAgent) elAgent.textContent = data.agent;
        if (elLatency) elLatency.textContent = lat;
        if (elRepo) elRepo.textContent = data.repo;
        if (elScope) elScope.textContent = data.scope;
        if (elVerdict) elVerdict.textContent = 'Specialist agent receiving token scope...';
      } else if (currentP < 0.80) {
        if (elPhase) elPhase.textContent = '04 / Scoped Vector Retrieval';
        const lat = Math.round(150 + retP * 60) + ' ms';
        if (mLatency) mLatency.textContent = lat;
        if (mScope) mScope.textContent = data.metricScope;
        if (mCompliance) mCompliance.textContent = 'Verifying rules...';
        if (elMeshRouter) elMeshRouter.classList.remove('active');
        if (elRouterStatus) elRouterStatus.textContent = 'COMPLETED';
        if (elTokenPacket) elTokenPacket.style.display = 'none';

        specNodes.forEach(n => {
          const match = data.targetNode && n.getAttribute('data-agent-node') === data.targetNode;
          n.classList.toggle('active-node', match);
        });

        if (elAgent) elAgent.textContent = data.agent;
        if (elLatency) elLatency.textContent = lat;
        if (elRepo) elRepo.textContent = data.repo;
        if (elScope) elScope.textContent = data.scope;
        if (elVerdict) elVerdict.textContent = 'Retrieved top-k grounded passages. Validating policy compliance...';
      } else {
        // 0.80 - 1.00: Full Verdict Synthesis Complete
        if (elPhase) elPhase.textContent = '05 / Verdict & Citations Complete';
        if (mLatency) mLatency.textContent = data.metricLatency;
        if (mScope) mScope.textContent = data.metricScope;
        if (mCompliance) mCompliance.textContent = data.metricCompliance;
        if (elMeshRouter) elMeshRouter.classList.remove('active');
        if (elRouterStatus) elRouterStatus.textContent = 'IDLE';
        if (elTokenPacket) elTokenPacket.style.display = 'none';

        specNodes.forEach(n => {
          const match = data.targetNode && n.getAttribute('data-agent-node') === data.targetNode;
          n.classList.toggle('active-node', match);
        });

        if (elAgent) {
          elAgent.textContent = data.agent;
          elAgent.style.color = data.isRefusal ? 'var(--accent-rose, #FB7185)' : 'var(--accent-amber)';
        }
        if (elLatency) elLatency.textContent = data.latency;
        if (elRepo) elRepo.textContent = data.repo;
        if (elScope) {
          elScope.textContent = data.scope;
          elScope.style.color = data.isRefusal ? 'var(--accent-rose, #FB7185)' : 'var(--accent-emerald)';
        }
        if (elVerdict) {
          elVerdict.textContent = data.verdict;
          elVerdict.style.color = data.isRefusal ? 'var(--accent-rose, #FB7185)' : 'var(--text-primary)';
        }
      }
    };

    function selectSirisQuery(key) {
      activeKey = key;
      sirisBtns.forEach(btn => {
        const match = btn.getAttribute('data-siris-key') === key;
        btn.classList.toggle('active', match);
        btn.setAttribute('aria-pressed', match ? 'true' : 'false');
      });
      window.renderSirisScene(currentP);
    }

    sirisBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const key = btn.getAttribute('data-siris-key');
        selectSirisQuery(key);
      });
    });

    // Single Scroll Listener + single rAF
    if (sirisWrapper) {
      let ticking = false;
      window.addEventListener('scroll', function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            const rect = sirisWrapper.getBoundingClientRect();
            const scrollableDist = sirisWrapper.offsetHeight - window.innerHeight;
            if (scrollableDist > 0) {
              const scrolled = -rect.top;
              const p = Math.max(0, Math.min(1, scrolled / scrollableDist));
              window.renderSirisScene(p);
            }
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }

    // Initial render at p = 0
    window.renderSirisScene(0);
  }

  // 4. FLAGSHIP DEMO 2: STACKSCOPE C0 BYTECODE VM STEPPER
  // -------------------------------------------------------------
  const stackRoot = document.querySelector('[data-demo="stackscope"]');
  if (stackRoot) {
    const vmProgram = [
      { pc: '0x0000', op: 'BIPUSH 4', desc: 'Push immediate integer 4 onto operand stack', stack: [4], frame: 'main() (depth: 1)', heap: '0x1000 [alloc 32B]', trap: 'TRAP_NONE (0x00)' },
      { pc: '0x0002', op: 'BIPUSH 3', desc: 'Push immediate integer 3 onto operand stack', stack: [4, 3], frame: 'main() (depth: 1)', heap: '0x1000 [alloc 32B]', trap: 'TRAP_NONE (0x00)' },
      { pc: '0x0004', op: 'IMUL', desc: 'Pop 3 and 4, multiply (3*4), push 12', stack: [12], frame: 'main() (depth: 1)', heap: '0x1000 [alloc 32B]', trap: 'TRAP_NONE (0x00)' },
      { pc: '0x0005', op: 'BIPUSH 2', desc: 'Push immediate integer 2 onto operand stack', stack: [12, 2], frame: 'main() (depth: 1)', heap: '0x1000 [alloc 32B]', trap: 'TRAP_NONE (0x00)' },
      { pc: '0x0007', op: 'IMUL', desc: 'Pop 2 and 12, multiply (2*12), push 24', stack: [24], frame: 'main() (depth: 1)', heap: '0x1000 [alloc 32B]', trap: 'TRAP_NONE (0x00)' },
      { pc: '0x0008', op: 'DUP', desc: 'Duplicate top operand (24) on stack', stack: [24, 24], frame: 'main() (depth: 1)', heap: '0x1000 [alloc 32B]', trap: 'TRAP_NONE (0x00)' },
      { pc: '0x0009', op: 'POP', desc: 'Discard duplicated operand from stack', stack: [24], frame: 'main() (depth: 1)', heap: '0x1000 [alloc 32B]', trap: 'TRAP_NONE (0x00)' },
      { pc: '0x000A', op: 'RETURN', desc: 'Return integer 24 from frame and exit', stack: [24], frame: 'exit (depth: 0)', heap: '0x1000 [freed]', trap: 'TRAP_NONE (0x00)' }
    ];

    let vmIdx = 0;
    const elPc = stackRoot.querySelector('.vm-val-pc');
    const elOp = stackRoot.querySelector('.vm-val-op');
    const elDesc = stackRoot.querySelector('.vm-val-desc');
    const elStack = stackRoot.querySelector('.vm-val-stack');
    const elFrame = stackRoot.querySelector('.vm-val-frame');
    const elHeap = stackRoot.querySelector('.vm-val-heap');
    const elTrap = stackRoot.querySelector('.vm-val-trap');
    const elProgress = stackRoot.querySelector('.vm-val-progress');
    const btnStep = stackRoot.querySelector('.vm-step-btn');
    const btnReset = stackRoot.querySelector('.vm-reset-btn');
    const presetBtns = stackRoot.querySelectorAll('.vm-preset-btn');

    function renderVmStep(idx) {
      vmIdx = Math.max(0, Math.min(vmProgram.length - 1, idx));
      const cur = vmProgram[vmIdx];

      if (elPc) elPc.textContent = cur.pc;
      if (elOp) elOp.textContent = cur.op;
      if (elDesc) elDesc.textContent = cur.desc;
      if (elFrame) elFrame.textContent = cur.frame;
      if (elHeap) elHeap.textContent = cur.heap;
      if (elTrap) elTrap.textContent = cur.trap;

      if (elStack) {
        elStack.innerHTML = '';
        cur.stack.forEach((val, i) => {
          const chip = document.createElement('span');
          chip.className = 'vm-stack-chip';
          chip.textContent = `[${i}]: ${val}`;
          elStack.appendChild(chip);
        });
      }

      if (elProgress) {
        const pct = ((vmIdx + 1) / vmProgram.length) * 100;
        elProgress.style.width = pct.toFixed(1) + '%';
      }

      presetBtns.forEach(b => {
        const pStep = parseInt(b.getAttribute('data-vm-step'), 10);
        b.classList.toggle('active', pStep === vmIdx);
        b.setAttribute('aria-pressed', pStep === vmIdx ? 'true' : 'false');
      });
    }

    if (btnStep) {
      btnStep.addEventListener('click', function () {
        renderVmStep((vmIdx + 1) % vmProgram.length);
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', function () {
        renderVmStep(0);
      });
    }

    presetBtns.forEach(b => {
      b.addEventListener('click', function () {
        const target = parseInt(b.getAttribute('data-vm-step'), 10);
        renderVmStep(target);
      });
    });

    // Initial render
    renderVmStep(0);
  }

  // -------------------------------------------------------------
  // 5. FLAGSHIP DEMO 3: MINDMESH 10-20 EEG OSCILLOSCOPE
  // -------------------------------------------------------------
  const mindmeshRoot = document.querySelector('[data-demo="mindmesh"]');
  if (mindmeshRoot) {
    const canvas = mindmeshRoot.querySelector('.mindmesh-eeg-canvas');
    let ctx = canvas ? canvas.getContext('2d') : null;
    let activeBand = 'alpha';
    let eegPhase = 0;
    let animId = null;
    let isIntersecting = false;

    const bandConfigs = {
      alpha: { label: 'Alpha (8–12 Hz)', freqMultiplier: 1.0, ampMultiplier: 1.0, neutral: 78, valence: 64, arousal: 38, faa: '+0.42' },
      beta:  { label: 'Beta (13–30 Hz)', freqMultiplier: 2.2, ampMultiplier: 0.7, neutral: 45, valence: 82, arousal: 85, faa: '+0.68' },
      theta: { label: 'Theta (4–7 Hz)',  freqMultiplier: 0.5, ampMultiplier: 1.4, neutral: 88, valence: 32, arousal: 22, faa: '-0.15' },
      gamma: { label: 'Gamma (31–45 Hz)',freqMultiplier: 3.5, ampMultiplier: 0.5, neutral: 35, valence: 75, arousal: 92, faa: '+0.54' }
    };

    const bandBtns = mindmeshRoot.querySelectorAll('.eeg-band-btn');
    const elFaa = mindmeshRoot.querySelector('.eeg-val-faa');
    const elBandLabel = mindmeshRoot.querySelector('.eeg-val-band');
    const elNeutralBar = mindmeshRoot.querySelector('.eeg-bar-neutral');
    const elValenceBar = mindmeshRoot.querySelector('.eeg-bar-valence');
    const elArousalBar = mindmeshRoot.querySelector('.eeg-bar-arousal');
    const elNeutralVal = mindmeshRoot.querySelector('.eeg-num-neutral');
    const elValenceVal = mindmeshRoot.querySelector('.eeg-num-valence');
    const elArousalVal = mindmeshRoot.querySelector('.eeg-num-arousal');

    function drawEegStaticFrame() {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      const cfg = bandConfigs[activeBand] || bandConfigs.alpha;

      // Ensure crisp background
      ctx.fillStyle = '#0B0B0E';
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = '#1E1E24';
      ctx.lineWidth = 1;
      for (let y = 30; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 4 Channels with high visibility
      const channels = [
        { label: 'AF3 (Frontal L)', freq: 10 * cfg.freqMultiplier, amp: 14 * cfg.ampMultiplier, y: h * 0.22, color: '#38BDF8' },
        { label: 'AF4 (Frontal R)', freq: 10.4 * cfg.freqMultiplier, amp: 16 * cfg.ampMultiplier, y: h * 0.44, color: '#F59E0B' },
        { label: 'T7 (Temporal L)', freq: 18 * cfg.freqMultiplier, amp: 10 * cfg.ampMultiplier, y: h * 0.66, color: '#E2E8F0' },
        { label: 'O1 (Occipital L)', freq: 6 * cfg.freqMultiplier, amp: 15 * cfg.ampMultiplier, y: h * 0.86, color: '#10B981' }
      ];

      channels.forEach(ch => {
        // Channel Label
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = ch.color;
        ctx.fillText(`${ch.label}: ~${Math.round(ch.amp * (1 + Math.sin(eegPhase * 0.5) * 0.15))} µV`, 8, ch.y - 7);

        // Waveform
        ctx.beginPath();
        ctx.strokeStyle = ch.color;
        ctx.lineWidth = 1.3;
        ctx.globalAlpha = 0.9;

        const startX = 130;
        for (let x = startX; x < w; x += 3) {
          const t = ((x - startX) / (w - startX)) * Math.PI * 6;
          const val = Math.sin(t * ch.freq * 0.12 - eegPhase) * ch.amp +
                      Math.cos(t * 2.8 + eegPhase * 0.6) * (ch.amp * 0.3);
          const py = ch.y + val;
          if (x === startX) ctx.moveTo(x, py);
          else ctx.lineTo(x, py);
        }
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      });
    }

    window.drawMindMeshFrame = drawEegStaticFrame;

    function renderEegLoop() {
      if (!isIntersecting || prefersReducedMotion || document.hidden || isGlobalStaticView) {
        animId = null;
        return;
      }
      eegPhase += 0.06;
      drawEegStaticFrame();
      animId = requestAnimationFrame(renderEegLoop);
    }

    function setEegBand(bandKey) {
      if (!bandConfigs[bandKey]) return;
      activeBand = bandKey;
      const cfg = bandConfigs[bandKey];

      bandBtns.forEach(btn => {
        const match = btn.getAttribute('data-band') === bandKey;
        btn.classList.toggle('active', match);
        btn.setAttribute('aria-pressed', match ? 'true' : 'false');
      });

      if (elFaa) elFaa.textContent = cfg.faa;
      if (elBandLabel) elBandLabel.textContent = cfg.label;

      if (elNeutralBar) elNeutralBar.style.width = cfg.neutral + '%';
      if (elValenceBar) elValenceBar.style.width = cfg.valence + '%';
      if (elArousalBar) elArousalBar.style.width = cfg.arousal + '%';

      if (elNeutralVal) elNeutralVal.textContent = cfg.neutral + '%';
      if (elValenceVal) elValenceVal.textContent = cfg.valence + '%';
      if (elArousalVal) elArousalVal.textContent = cfg.arousal + '%';

      // Always draw static frame immediately upon band change
      drawEegStaticFrame();
    }

    bandBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const bandKey = btn.getAttribute('data-band');
        setEegBand(bandKey);
      });
    });

    // Setup intersection observer
    if (typeof IntersectionObserver !== 'undefined' && canvas) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting && !prefersReducedMotion && !document.hidden && !isGlobalStaticView) {
            if (!animId) animId = requestAnimationFrame(renderEegLoop);
          } else {
            if (animId) cancelAnimationFrame(animId);
            animId = null;
          }
        });
      }, { threshold: 0.05 });
      observer.observe(canvas);
    }

    // DRAW IMMEDIATELY ON LOAD
    setEegBand('alpha');
    drawEegStaticFrame();
  }

  // -------------------------------------------------------------
  // 6. FLAGSHIP DEMO 4: LUMINA 3D LANDMARK MESH & TELEMETRY HUD
  // -------------------------------------------------------------
  const luminaRoot = document.querySelector('[data-demo="lumina"]');
  if (luminaRoot) {
    const canvas = luminaRoot.querySelector('.lumina-cv-canvas');
    let ctx = canvas ? canvas.getContext('2d') : null;
    let curYawDeg = 0;
    let lumTime = 0;
    let animId = null;
    let isIntersecting = false;

    const angleConfigs = {
      0:   { label: 'Frontal (0°)', gaze: '1.2° [PASS]', ear: '0.33', status: 'Gaze Locked', color: '#10B981' },
      45:  { label: 'Quarter (45°)', gaze: '3.4° [PASS]', ear: '0.31', status: 'Tracking Mesh', color: '#38BDF8' },
      90:  { label: 'Profile (90°)', gaze: '8.7° [ATTN]', ear: '0.27', status: 'Side Profile', color: '#F59E0B' },
      180: { label: 'Inverted (180°)', gaze: '14.2° [FAIL]', ear: '0.19', status: 'Occluded', color: '#FB7185' }
    };

    const angleBtns = luminaRoot.querySelectorAll('.lumina-angle-btn');
    const elGaze = luminaRoot.querySelector('.lumina-val-gaze');
    const elEar = luminaRoot.querySelector('.lumina-val-ear');
    const elStatus = luminaRoot.querySelector('.lumina-val-status');

    // 28 geometric face mesh landmarks
    const landmarks = [];
    for (let i = 0; i < 28; i++) {
      const u = (i / 28) * Math.PI * 2;
      const v = Math.sin(i * 0.4) * Math.PI * 0.4;
      const r = 52;
      landmarks.push({
        ox: r * Math.cos(v) * Math.cos(u),
        oy: r * Math.sin(v) * 1.3,
        oz: r * Math.sin(u) * 0.6
      });
    }

    function drawLuminaStaticFrame() {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.5;
      const cy = h * 0.5;

      ctx.fillStyle = '#0B0B0E';
      ctx.fillRect(0, 0, w, h);

      const rotY = (curYawDeg * Math.PI) / 180;
      const rotX = 0.15 + Math.sin(lumTime * 0.4) * 0.08;

      const proj = landmarks.map(pt => {
        const y1 = pt.oy * Math.cos(rotX) - pt.oz * Math.sin(rotX);
        const z1 = pt.oy * Math.sin(rotX) + pt.oz * Math.cos(rotX);
        const x2 = pt.ox * Math.cos(rotY) + z1 * Math.sin(rotY);
        const z2 = -pt.ox * Math.sin(rotY) + z1 * Math.cos(rotY);
        const scale = 160 / (160 + z2 + 80);
        return {
          x: cx + x2 * scale,
          y: cy + y1 * scale
        };
      });

      // Triangulation lines
      for (let i = 0; i < proj.length; i++) {
        for (let j = i + 1; j < proj.length; j++) {
          const d = Math.hypot(proj[i].x - proj[j].x, proj[i].y - proj[j].y);
          if (d < 40) {
            ctx.beginPath();
            ctx.moveTo(proj[i].x, proj[i].y);
            ctx.lineTo(proj[j].x, proj[j].y);
            ctx.strokeStyle = '#38BDF8';
            ctx.lineWidth = 0.9;
            ctx.globalAlpha = Math.max(0.15, 0.7 - d / 40);
            ctx.stroke();
          }
        }
        // Vertex points
        ctx.beginPath();
        ctx.arc(proj[i].x, proj[i].y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = 0.85;
        ctx.fill();
      }

      // HUD Reticle & Crosshairs
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;
      ctx.strokeRect(cx - 75, cy - 55, 150, 110);

      ctx.beginPath();
      ctx.moveTo(cx - 8, cy); ctx.lineTo(cx + 8, cy);
      ctx.moveTo(cx, cy - 8); ctx.lineTo(cx, cy + 8);
      ctx.stroke();

      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#38BDF8';
      ctx.globalAlpha = 0.9;
      ctx.fillText(`YAW: ${curYawDeg}°`, cx - 70, cy - 42);
      const curCfg = angleConfigs[curYawDeg] || angleConfigs[0];
      ctx.fillText(`GAZE: ${curCfg.gaze}`, cx - 70, cy + 48);
      ctx.globalAlpha = 1.0;
    }

    window.drawLuminaFrame = drawLuminaStaticFrame;

    function renderLuminaLoop() {
      if (!isIntersecting || prefersReducedMotion || document.hidden || isGlobalStaticView) {
        animId = null;
        return;
      }
      lumTime += 0.03;
      drawLuminaStaticFrame();
      animId = requestAnimationFrame(renderLuminaLoop);
    }

    function setLuminaAngle(yaw) {
      curYawDeg = yaw;
      const cfg = angleConfigs[yaw] || angleConfigs[0];

      angleBtns.forEach(btn => {
        const match = parseInt(btn.getAttribute('data-yaw'), 10) === yaw;
        btn.classList.toggle('active', match);
        btn.setAttribute('aria-pressed', match ? 'true' : 'false');
      });

      if (elGaze) elGaze.textContent = cfg.gaze;
      if (elEar) elEar.textContent = cfg.ear;
      if (elStatus) {
        elStatus.textContent = cfg.status;
        elStatus.style.color = cfg.color;
      }

      // Always draw static frame immediately upon angle change
      drawLuminaStaticFrame();
    }

    angleBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const yaw = parseInt(btn.getAttribute('data-yaw'), 10);
        setLuminaAngle(yaw);
      });
    });

    // Setup intersection observer
    if (typeof IntersectionObserver !== 'undefined' && canvas) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting && !prefersReducedMotion && !document.hidden && !isGlobalStaticView) {
            if (!animId) animId = requestAnimationFrame(renderLuminaLoop);
          } else {
            if (animId) cancelAnimationFrame(animId);
            animId = null;
          }
        });
      }, { threshold: 0.05 });
      observer.observe(canvas);
    }

    // DRAW IMMEDIATELY ON LOAD
    setLuminaAngle(0);
    drawLuminaStaticFrame();

    // Centralized visibilitychange listener to pause/resume canvas animations
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (animId) cancelAnimationFrame(animId);
        animId = null;
      } else {
        if (isIntersecting && !prefersReducedMotion && !isGlobalStaticView) {
          if (!animId) animId = requestAnimationFrame(renderLuminaLoop);
        } else {
          drawLuminaStaticFrame();
        }
      }
    });
  }

  // -------------------------------------------------------------
  // 7. HERO TERMINAL TYPING SEQUENCE (WINDOWS POWERSHELL)
  // -------------------------------------------------------------
  const termBody = document.getElementById('hero-terminal-body');
  const termContainer = document.getElementById('hero-terminal');

  if (termBody) {
    const PROMPT_STR = 'PS C:\\Users\\dhruv\\systems> ';
    const BANNER_HTML = '<div class="term-banner">Windows PowerShell<br>Copyright (C) Microsoft Corporation. All rights reserved.</div>';

    const termScript = [
      { cmd: 'whoami', out: 'madison\\dhruv  [CS + Statistics · UW-Madison]' },
      { cmd: 'Get-ChildItem .\\systems', out: 'Mode   Name:  d----  siris\\   d----  stackscope\\   d----  mindmesh\\   d----  lumina-presenter\\' },
      { cmd: 'Get-Content .\\siris.stack', out: '-> multi-agent RAG · copilot studio · azure openai · entra id' },
      { cmd: 'Get-Content .\\research.focus', out: '-> llm psychometrics · medical imaging · speech / asr' },
      { cmd: '.\\status.ps1', out: '-> building distributed ML systems · open to opportunities' }
    ];

    function renderTermComplete() {
      termBody.innerHTML = BANNER_HTML + 
        termScript.map(item => 
          '<div class="term-cmd-line"><span class="term-prompt">' + PROMPT_STR + '</span><span class="term-cmd">' + item.cmd + '</span></div>' +
          '<div class="term-out">' + item.out + '</div>'
        ).join('') +
        '<div class="term-cmd-line"><span class="term-prompt">' + PROMPT_STR + '</span><span class="term-cursor"></span></div>';
    }

    if (prefersReducedMotion) {
      renderTermComplete();
    } else {
      let itemIdx = 0;
      let charIdx = 0;
      let phase = 'typing';
      let lastTime = 0;
      let curCmdSpan = null;
      let curCursor = null;

      termBody.innerHTML = BANNER_HTML;

      function startLine() {
        const line = document.createElement('div');
        line.className = 'term-cmd-line';
        line.innerHTML = '<span class="term-prompt">' + PROMPT_STR + '</span><span class="term-cmd"></span>';
        curCmdSpan = line.querySelector('.term-cmd');
        curCursor = document.createElement('span');
        curCursor.className = 'term-cursor';
        line.appendChild(curCursor);
        termBody.appendChild(line);
      }

      function stepTerminal(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const dt = timestamp - lastTime;

        if (phase === 'typing') {
          const item = termScript[itemIdx];
          const jitter = Math.random() * 8;
          if (dt >= 14 + jitter) {
            charIdx++;
            curCmdSpan.textContent = item.cmd.slice(0, charIdx);
            lastTime = timestamp;
            if (charIdx >= item.cmd.length) {
              phase = 'pause_cmd';
            }
          }
        } else if (phase === 'pause_cmd') {
          if (dt >= 180) {
            if (curCursor && curCursor.parentNode) {
              curCursor.parentNode.removeChild(curCursor);
            }
            const outLine = document.createElement('div');
            outLine.className = 'term-out';
            outLine.textContent = termScript[itemIdx].out;
            termBody.appendChild(outLine);
            phase = 'pause_next';
            lastTime = timestamp;
          }
        } else if (phase === 'pause_next') {
          if (dt >= 280) {
            itemIdx++;
            if (itemIdx < termScript.length) {
              charIdx = 0;
              phase = 'typing';
              startLine();
              lastTime = timestamp;
            } else {
              phase = 'done';
              const endLine = document.createElement('div');
              endLine.className = 'term-cmd-line';
              endLine.innerHTML = '<span class="term-prompt">' + PROMPT_STR + '</span><span class="term-cursor"></span>';
              termBody.appendChild(endLine);
              return;
            }
          }
        }

        if (phase !== 'done') {
          requestAnimationFrame(stepTerminal);
        }
      }

      startLine();
      requestAnimationFrame(stepTerminal);

      if (termContainer) {
        termContainer.addEventListener('click', () => {
          phase = 'done';
          renderTermComplete();
        }, { once: true });
      }
    }
  }

  // -------------------------------------------------------------
  // 8. WINDOW RESIZE HANDLING
  // -------------------------------------------------------------
  window.addEventListener('resize', function () {
    if (typeof window.drawMindMeshFrame === 'function') window.drawMindMeshFrame();
    if (typeof window.drawLuminaFrame === 'function') window.drawLuminaFrame();
  }, { passive: true });

  // -------------------------------------------------------------
  // 9. DETAILS/SUMMARY ACCESSIBLE KEYBOARD TOGGLE
  // -------------------------------------------------------------
  document.querySelectorAll('details.role-details summary').forEach(summary => {
    summary.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        const details = summary.closest('details');
        if (details) details.open = !details.open;
      }
    });
  });
  // -------------------------------------------------------------
  // 10. SIRIS CASE STUDY ARCHITECTURE DIAGRAM INSPECTOR
  // -------------------------------------------------------------
  const archNodes = document.querySelectorAll('.arch-agent-node');
  const inspName = document.getElementById('inspector-name');
  const inspDesc = document.getElementById('inspector-desc');

  const agentDescriptions = {
    standards: {
      name: 'ARB-Standards',
      desc: 'Evaluates cloud encryption, egress protocols, and enterprise infrastructure baselines against certified standards.'
    },
    principles: {
      name: 'ARB-Principles',
      desc: 'Assesses strategic architectural alignment, multi-cloud direction, and long-term tech stack guidelines.'
    },
    exceptions: {
      name: 'ARB-Exceptions',
      desc: 'Reviews and records architecture waivers, sunset deadlines, and risk remediation covenants.'
    },
    ptbs: {
      name: 'ARB-PtBs',
      desc: 'Evaluates Permit-to-Build submission documents and non-functional production readiness criteria.'
    },
    roadmaps: {
      name: 'ARB-Roadmaps',
      desc: 'Analyzes technology lifecycle milestones, deprecation horizons, and planned platform upgrades.'
    },
    ppds: {
      name: 'ARB-PPDs',
      desc: 'Cross-references Product & Platform Decision records and designated canonical systems.'
    }
  };

  archNodes.forEach(node => {
    function activateNode() {
      const ag = node.getAttribute('data-agent');
      const data = agentDescriptions[ag];
      if (!data) return;

      archNodes.forEach(n => {
        const match = n === node;
        n.classList.toggle('active', match);
        n.setAttribute('aria-pressed', match ? 'true' : 'false');
        const rect = n.querySelector('rect');
        if (rect) {
          rect.setAttribute('stroke', match ? '#F59E0B' : '#1B1E24');
          rect.setAttribute('fill', match ? 'rgba(245, 158, 11, 0.12)' : '#07080A');
        }
      });

      if (inspName) inspName.textContent = data.name;
      if (inspDesc) inspDesc.textContent = data.desc;
    }

    node.addEventListener('click', activateNode);
    node.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateNode();
      }
    });
  });

  // -------------------------------------------------------------
  // 12. INTERACTIVE SYSTEMS COMPETENCY MATRIX (SKILLS INSPECTOR)
  // -------------------------------------------------------------
  const skillsMatrixRoot = document.querySelector('.skills-col-left');
  if (skillsMatrixRoot) {
    const SKILLS_DATA = {
      'c-cpp': {
        domain: 'LANGUAGES · CORE SYSTEMS & RUNTIMES',
        title: 'C / C++ (ANSI C99 & C++)',
        desc: 'Authored a 45-opcode ANSI C99 bytecode virtual machine (StackScope) with direct-threaded dispatch delivering ~525 MIPS with disassembler and step debugger. Built real-time video processing pipelines in Lumina smart glasses in C++.',
        chips: ['StackScope VM', 'ANSI C99 Runtime', 'Lumina Vision', '~525 MIPS'],
        linkText: 'Inspect StackScope Case Study →',
        linkHref: 'stackscope.html'
      },
      'c0': {
        domain: 'LANGUAGES · FORMAL CONTRACTS & VERIFICATION',
        title: 'C0 (Algorithmic Verification & Invariants)',
        desc: 'Formally specified and verified algorithmic preconditions, postconditions, and loop invariants in C0 (safe C dialect developed at CMU) in CMU 15-122 (Principles of Imperative Computation), proving pointer safety, dynamic array bounds, and AVL tree balances.',
        chips: ['CMU 15-122', 'Formal Contracts', 'Dynamic Bounds', 'AVL Trees'],
        linkText: 'View Academic Credentials →',
        linkHref: 'index.html#education'
      },
      'python': {
        domain: 'LANGUAGES · MACHINE LEARNING & SYSTEMS',
        title: 'Python (Scientific & Production ML)',
        desc: 'Built asynchronous speech synthesis pipelines (BubbleMixer) at AEPO Lab, trained 3D UNet and SwinUNETR neuroimaging models at IDiA Lab, engineered psychometric LLM evaluation engines at WISCURDS, and prototyped quantitative FX models at Federated Hermes.',
        chips: ['AEPO Lab', 'IDiA Lab', 'WISCURDS', 'Federated Hermes'],
        linkText: 'View Experience Deployments →',
        linkHref: 'index.html#experience'
      },
      'java': {
        domain: 'LANGUAGES · OBJECT-ORIENTED SYSTEMS',
        title: 'Java (Data Structures & Algorithms)',
        desc: 'Engineered core data structures, graph search algorithms, memory-efficient collection abstractions, concurrency primitives, and algorithmic problem-solving in UW–Madison computer science coursework.',
        chips: ['Data Structures', 'Graph Algorithms', 'UW-Madison'],
        linkText: 'View Academic Credentials →',
        linkHref: 'index.html#education'
      },
      'typescript-js': {
        domain: 'LANGUAGES · WEB PLATFORMS & RUNTIMES',
        title: 'TypeScript & JavaScript (Modern ES6+)',
        desc: 'Engineered the StackScope time-travel bytecode visualizer (zero external frameworks, sub-5ms stepping), responsive psychometric visualization engines at WISCURDS, and accessible, high-density DOM web platforms.',
        chips: ['StackScope Web', 'DOM Performance', 'Sub-5ms Stepping'],
        linkText: 'Open Live StackScope Tool →',
        linkHref: 'https://dhruvkithany.github.io/StackScope/'
      },
      'r': {
        domain: 'LANGUAGES · STATISTICAL COMPUTING',
        title: 'R (Statistical Modeling & Biostatistics)',
        desc: 'Fitted linear mixed-effects models (lme4) and built a 10-figure clinical analytical deck for Dr. Gibbs at AEPO Lab across 16 human subjects, demonstrating broad cochlear-implant current spread requires ~3.3x more bubbles/second and cuts d-prime sensitivity by 13.6%.',
        chips: ['AEPO Lab', 'Mixed-Effects Models', 'lme4', 'Cochlear Implants'],
        linkText: 'View AEPO Lab Research →',
        linkHref: 'index.html#experience'
      },
      'sql': {
        domain: 'LANGUAGES · QUERY ENGINES & STORAGE',
        title: 'SQL (Relational Schemas & Window Queries)',
        desc: 'Architected complex relational schemas, indexed analytical tables, wrote multi-table window queries, and optimized query execution plans across MySQL, PostgreSQL, and Dataverse enterprise stores.',
        chips: ['Relational Schemas', 'Query Plans', 'Window Functions', 'ACID Storage'],
        linkText: 'View Enterprise Experience →',
        linkHref: 'index.html#experience'
      },
      'assembly': {
        domain: 'LANGUAGES · COMPUTER ARCHITECTURE & ISA',
        title: 'x86-64 & MIPS Assembly (ISA & Microarchitecture)',
        desc: 'Emulated 8 general-purpose 32-bit registers (R0–R7), program counter, and condition flags in StackScope VM. Studied MIPS/RISC-V pipeline hazards, cache hierarchies, and instruction-level parallelism in UW-Madison computer architecture.',
        chips: ['StackScope VM', 'Register Emulation', 'MIPS Pipelines', 'UW-Madison'],
        linkText: 'Inspect StackScope Architecture →',
        linkHref: 'stackscope.html'
      },
      'ruby': {
        domain: 'LANGUAGES · BACKEND & WEB INFRASTRUCTURE',
        title: 'Ruby & Ruby on Rails',
        desc: 'Engineered backend infrastructure for Farm 2 Facts open-source platform, supporting 100+ specialty crop farmers across 5 states in an NSF/USDA consortium for automated grant reporting and Wisconsin Mesonet meteorological data ingestion.',
        chips: ['Farm 2 Facts', 'USDA Reporting', 'Mesonet API', 'Open Source'],
        linkText: 'View Farm 2 Facts Project →',
        linkHref: 'index.html#experience'
      },
      'html-css': {
        domain: 'LANGUAGES · ACCESSIBILITY & DESIGN SYSTEMS',
        title: 'Semantic HTML5 & Modern CSS',
        desc: 'Engineered zero-layout-shift tabular reveals, WCAG 2.1 AA compliant contrast ratios (>= 4.5:1), >= 44px mobile touch targets, responsive fluid typography, and hardware-accelerated canvas backings.',
        chips: ['WCAG 2.1 AA A11y', 'Zero Layout Shift', 'Responsive Grids', 'Hardware Canvas'],
        linkText: 'View Architecture Case Studies →',
        linkHref: 'index.html#projects'
      },
      'pytorch': {
        domain: 'FRAMEWORKS & ML · DEEP LEARNING',
        title: 'PyTorch (Custom DataLoaders & Neural Training)',
        desc: 'Engineered custom PyTorch Dataset-compatible speech-masking workers in the AEPO Lab BubbleMixer library; trained SwinUNETR and nnU-Net v2 for stroke-lesion MRI segmentation on open datasets (ISLES 2022, SOOP) with Docker containerized training on the UW CHTC cluster.',
        chips: ['AEPO BubbleMixer', 'IDiA Lab MRI', 'UW CHTC Cluster', 'Custom DataLoaders'],
        linkText: 'View Research Laboratories →',
        linkHref: 'index.html#experience'
      },
      'monai-cv': {
        domain: 'FRAMEWORKS & ML · MEDICAL COMPUTER VISION',
        title: 'MONAI & 3D Medical Vision (3D UNet / SwinUNETR)',
        desc: 'Implemented 3D medical image segmentation pipelines in PyTorch and MONAI at IDiA Lab (UW Radiology) for acute ischemic stroke lesion volumetric analysis; optimized Dice loss and surface distance metrics on multi-parametric MRI sequences.',
        chips: ['IDiA Lab', 'MONAI', '3D UNet', 'Ischemic Stroke MRI'],
        linkText: 'View IDiA Lab Research →',
        linkHref: 'index.html#experience'
      },
      'tensorflow-keras': {
        domain: 'FRAMEWORKS & ML · PREDICTIVE MODELING',
        title: 'TensorFlow / Keras (Time-Series & Prediction)',
        desc: 'Built LSTM equity forecasting prototypes and FX carry-trade backtesting simulators at Federated Hermes, evaluating multi-day forward return distributions and risk parity bounds.',
        chips: ['Federated Hermes', 'LSTM Networks', 'Time-Series Modeling', 'FX Carry'],
        linkText: 'View Quantitative Modeling →',
        linkHref: 'index.html#experience'
      },
      'scikit-learn': {
        domain: 'FRAMEWORKS & ML · STATISTICAL LEARNING',
        title: 'Scikit-learn (Statistical Machine Learning)',
        desc: 'Trained regularized generalized linear models, random forests, and SVM classifiers; computed cross-validation benchmarks and feature importances for clinical trials and empirical psychometric studies.',
        chips: ['Model Evaluation', 'Feature Pipelines', 'Cross-Validation', 'Statistical ML'],
        linkText: 'View Experience Overview →',
        linkHref: 'index.html#experience'
      },
      'opencv': {
        domain: 'FRAMEWORKS & ML · REAL-TIME VISION',
        title: 'OpenCV (Real-Time Vision & Spatial Transforms)',
        desc: 'Architected decoupled video device IO pipeline in Lumina presentation coach, capturing high-framerate webcam streams and executing real-time image normalization without GUI stutter.',
        chips: ['Lumina HUD', 'Device IO Streaming', 'Camera Calibration', 'Frame Transforms'],
        linkText: 'Read Lumina HUD Case Study →',
        linkHref: 'lumina.html'
      },
      'mediapipe': {
        domain: 'FRAMEWORKS & ML · FACIAL & POSE GEOMETRY',
        title: 'MediaPipe (Facial Geometry & Pose Estimation)',
        desc: 'Constructed real-time landmark extraction pipeline in Lumina, computing 468-point 3D facial mesh, head yaw/pitch, and 33-point upper-body kinesic coordinates for presentation coaching.',
        chips: ['468-pt Face Mesh', 'Kinesic Analysis', 'Affective AI', 'Real-Time 3D'],
        linkText: 'Explore Lumina Landmark Telemetry →',
        linkHref: 'lumina.html'
      },
      'numpy-scipy': {
        domain: 'FRAMEWORKS & ML · NUMERICAL COMPUTATION',
        title: 'NumPy & SciPy (Numerical & Matrix Computation)',
        desc: 'Vectorized high-throughput audio tensor manipulation in BubbleMixer (12 files/sec throughput) and processed 133,000+ data cells across 66+ datasets for psychometric synthetic human proxy analysis at WISCURDS.',
        chips: ['High-Throughput IO', 'Data Wrangling', '133k+ Data Cells', 'Vectorized Tensors'],
        linkText: 'View WISCURDS Research →',
        linkHref: 'index.html#experience'
      },
      'dsp-fft': {
        domain: 'FRAMEWORKS & ML · DIGITAL SIGNAL PROCESSING',
        title: 'DSP & Time-Frequency Analysis (FFT / Filtering)',
        desc: 'Implemented discrete Fourier transforms, continuous spectrogram waterfalls, and 4-30 Hz bandpass FIR/IIR filtering in MindMesh EEG processor; designed polyphase resampling and raised-cosine ramps for speech acoustics in AEPO Lab.',
        chips: ['MindMesh EEG', 'FFT Spectrograms', 'Bandpass Filters', 'Polyphase Resampling'],
        linkText: 'Read MindMesh Architecture →',
        linkHref: 'mindmesh.html'
      },
      'pandas': {
        domain: 'FRAMEWORKS & ML · DATA PIPELINES',
        title: 'Pandas (DataFrames & Tabular ETL Pipelines)',
        desc: 'Engineered high-throughput tabular data manipulation, feature extraction, missing-data imputation, and multi-index aggregation pipelines across clinical research datasets and financial market time series.',
        chips: ['ETL Pipelines', 'Multi-Index Groupby', 'Imputation', 'Feature Engineering'],
        linkText: 'View Research Laboratories →',
        linkHref: 'index.html#experience'
      },
      'react': {
        domain: 'FRAMEWORKS & ML · APPLICATION PLATFORMS',
        title: 'React (Declarative Web Applications)',
        desc: 'Constructed modular component hierarchies, reactive state management trees, and responsive data exploration interfaces for distributed research tools and editorial systems.',
        chips: ['Component Trees', 'State Hooks', 'Virtual DOM', 'Modern Frontend'],
        linkText: 'View Systems Experience →',
        linkHref: 'index.html#projects'
      },
      'nodejs': {
        domain: 'FRAMEWORKS & ML · SERVER RUNTIMES',
        title: 'Node.js & Express (Asynchronous Backend Services)',
        desc: 'Architected non-blocking REST API gateways, event-driven worker services, and JSON data endpoints with robust error propagation and zero-downtime health probes.',
        chips: ['Event Loop', 'REST Gateways', 'Middleware Pipelines', 'Async Workers'],
        linkText: 'View Systems Experience →',
        linkHref: 'index.html#projects'
      },
      'azure-openai': {
        domain: 'CLOUD & DATA · ENTERPRISE LLM SYSTEMS',
        title: 'Azure OpenAI & GPT-4o/5.5 (Enterprise RAG)',
        desc: 'Architected SIRIS company-wide production multi-agent RAG assistant with an intent router directing to 6 independently-grounded specialist agents; evaluated on 165+ rubric cases and 20/20 compliance cases.',
        chips: ['SIRIS Hub', 'GPT-4o Router', 'Enterprise RAG', '165+ Eval Cases'],
        linkText: 'Read SIRIS Architecture Case Study →',
        linkHref: 'siris.html'
      },
      'azure': {
        domain: 'CLOUD & DATA · CLOUD INFRASTRUCTURE',
        title: 'Microsoft Azure (Enterprise Cloud Infrastructure)',
        desc: 'Deployed enterprise micro-agent endpoints, API management gateways, Azure Key Vaults, and managed container instances under corporate compliance and governance policies.',
        chips: ['Enterprise Clouds', 'API Gateways', 'Zero-Trust Security', 'Key Vaults'],
        linkText: 'Read SIRIS Case Study →',
        linkHref: 'siris.html'
      },
      'gcp': {
        domain: 'CLOUD & DATA · CLOUD PLATFORMS & AI',
        title: 'Google Cloud Platform (GCP Certification)',
        desc: 'Certified in Digital Transformation with Google Cloud (Credential ID: 21941245). Hands-on knowledge of GCP infrastructure, IAM policies, BigQuery analytical storage, Cloud Storage, and Google Cloud AI services.',
        chips: ['GCP Certified', 'BigQuery', 'Cloud Storage', 'Google Cloud AI'],
        linkText: 'Verify on Google Skills Registry →',
        linkHref: 'https://www.skills.google/public_profiles/d308b8e5-ade3-4184-b35d-52d6c4291ad9/badges/21941245'
      },
      'databricks': {
        domain: 'CLOUD & DATA · LAKEHOUSE PLATFORMS',
        title: 'Databricks (Lakehouse Architecture & Spark)',
        desc: 'Engineered OneView governance reporting system at Federated Hermes, creating a semantic model over live Databricks HRView enterprise data and consolidating 2,500+ artifacts across 6 categories.',
        chips: ['OneView HRView', 'Databricks Lakehouse', 'Governance Pipelines', 'Spark ETL'],
        linkText: 'View Enterprise Architecture →',
        linkHref: 'index.html#experience'
      },
      'power-bi': {
        domain: 'CLOUD & DATA · BUSINESS INTELLIGENCE',
        title: 'Power BI (Enterprise Semantic Modeling & DAX)',
        desc: 'Built OneView executive report consolidating 2,500+ governance artifacts onto a single page via DAX calculations and tabular data models linked to live Azure data feeds.',
        chips: ['OneView Dashboard', 'DAX Measures', 'Executive Reporting', 'Tabular Models'],
        linkText: 'View Enterprise Architecture →',
        linkHref: 'index.html#experience'
      },
      'power-automate': {
        domain: 'CLOUD & DATA · IDENTITY & WORKFLOW SYNC',
        title: 'Power Automate (Enterprise Orchestration)',
        desc: 'Engineered AzureGraphIngest identity-sync pipeline over Microsoft Graph API across ~4,000 employees, ensuring real-time governance attribute updates in enterprise storage.',
        chips: ['AzureGraphIngest', '~4,000 Employees', 'Automated Workflows', 'Scheduled Triggers'],
        linkText: 'View Enterprise Architecture →',
        linkHref: 'index.html#experience'
      },
      'relational-db': {
        domain: 'CLOUD & DATA · ACID STORAGE & INDEXING',
        title: 'PostgreSQL & MySQL (ACID Relational Storage)',
        desc: 'Designed normalized relational schemas, managed foreign-key constraints, index tuning, and transactional query consistency for full-stack and research data storage.',
        chips: ['Normalized Schemas', 'Index Tuning', 'ACID Compliance', 'Query Optimization'],
        linkText: 'View Systems Experience →',
        linkHref: 'index.html#experience'
      },
      'mongodb-dataverse': {
        domain: 'CLOUD & DATA · NOSQL & ENTERPRISE ENTITIES',
        title: 'MongoDB & Microsoft Dataverse (NoSQL & Entities)',
        desc: 'Configured flexible document stores in MongoDB and indexed entity tables in Microsoft Dataverse with role-based access control, security trimming, and automated metadata synchronization.',
        chips: ['Dataverse Indexing', 'MongoDB Documents', 'Security Trimming', 'Entity Models'],
        linkText: 'View Enterprise Systems →',
        linkHref: 'index.html#experience'
      },
      'graph-api': {
        domain: 'CLOUD & DATA · IDENTITY & DIRECTORY INGEST',
        title: 'Microsoft Graph API (Organizational Ingestion)',
        desc: 'Integrated Microsoft Graph REST endpoints to query organizational hierarchies, user delegation claims, and automated directory synchronization across 4,000 corporate seats.',
        chips: ['Graph Ingestion', 'Entra ID Sync', 'Corporate Directories', 'Delegated Claims'],
        linkText: 'View Enterprise Architecture →',
        linkHref: 'index.html#experience'
      },
      'copilot-studio': {
        domain: 'DEVOPS & TOOLS · MULTI-AGENT ORCHESTRATION',
        title: 'Copilot Studio (Multi-Agent Orchestration)',
        desc: 'Designed 2-level hub-and-spoke connected agent architecture in SIRIS, resolving 5+ platform defects including chaining ceilings and grounding boundaries, verified with 165+ evaluation cases.',
        chips: ['Connected Agents', 'Hub-and-Spoke', '165+ Rubric Cases', 'SIRIS Platform'],
        linkText: 'Read SIRIS Multi-Agent Study →',
        linkHref: 'siris.html'
      },
      'git-actions': {
        domain: 'DEVOPS & TOOLS · VERSION CONTROL & CI/CD',
        title: 'Git & GitHub Actions (Automated Pipelines)',
        desc: 'Authored automated CI/CD validation workflows, Playwright headless regression suites, multi-platform build matrices, branch protection policies, and automated artifact publishing.',
        chips: ['GitHub Actions', 'Automated QA', 'Branch Workflows', 'CI/CD Pipelines'],
        linkText: 'View Code on GitHub →',
        linkHref: 'https://github.com/dhruvkithany'
      },
      'valgrind-asan': {
        domain: 'DEVOPS & TOOLS · MEMORY SAFETY & PROFILING',
        title: 'Valgrind & AddressSanitizer (Memory Profiling)',
        desc: 'Profiled ANSI C bytecode virtual machine and data structure libraries for memory leaks, invalid heap reads/writes, use-after-free conditions, and memory alignment bugs; verified 0 memory leaks under Valgrind Memcheck.',
        chips: ['Memcheck Zero Leaks', 'AddressSanitizer', 'Heap Bounds', 'StackScope Debug'],
        linkText: 'Inspect StackScope Virtual Machine →',
        linkHref: 'stackscope.html'
      },
      'gdb-lldb': {
        domain: 'DEVOPS & TOOLS · BINARY & INSTRUCTION DEBUGGING',
        title: 'GDB & LLDB (Low-Level Systems Debugging)',
        desc: 'Debugged C programs at the machine level using GNU Debugger: set conditional watchpoints, inspected register states, analyzed core dump backtraces, and stepped through disassembled machine instructions.',
        chips: ['GNU Debugger', 'Register Inspection', 'Core Dumps', 'Disassembly Stepping'],
        linkText: 'View StackScope Case Study →',
        linkHref: 'stackscope.html'
      },
      'make-gcc': {
        domain: 'DEVOPS & TOOLS · COMPILATION TOOLCHAINS',
        title: 'GNU Make & GCC/Clang (Compilation Toolchains)',
        desc: 'Authored multi-target Makefiles with automatic dependency generation, aggressive compiler optimization flags (-O3, -march=native), strict diagnostic flags (-Wall -Wextra -Werror -pedantic), and automated test targets.',
        chips: ['GNU Make', 'GCC / Clang', 'Optimization -O3', 'Strict Diagnostics'],
        linkText: 'Inspect StackScope Build System →',
        linkHref: 'stackscope.html'
      },
      'pytest': {
        domain: 'DEVOPS & TOOLS · AUTOMATED TEST HARNESSES',
        title: 'pytest (Automated Test Harnesses)',
        desc: 'Authored comprehensive test fixtures, parameterized regression suites, and memory profiling assertions across machine learning and systems repositories.',
        chips: ['Unit Testing', 'Regression Suites', 'Fixtures & Mocks', 'Parameterized Tests'],
        linkText: 'View Experience Overview →',
        linkHref: 'index.html#experience'
      },
      'docker': {
        domain: 'DEVOPS & TOOLS · REPRODUCIBLE CONTAINERS',
        title: 'Docker (Containerized ML Environments)',
        desc: 'Containerized deep learning training workflows (nnU-Net, PyTorch) into deterministic Docker containers executed on the UW-Madison Center for High Throughput Computing (CHTC) cluster.',
        chips: ['Docker Containers', 'UW CHTC Cluster', 'Reproducible ML', 'GPU Execution'],
        linkText: 'View IDiA Lab Research →',
        linkHref: 'index.html#experience'
      },
      'linux-cli': {
        domain: 'DEVOPS & TOOLS · POSIX & SYSTEMS AUTOMATION',
        title: 'Linux CLI & Bash (Systems Automation)',
        desc: 'Proficient in Unix/Linux shell scripting, POSIX pipelines, process management, SSH remote server administration, cluster job submission (HTCondor / SLURM), and terminal workflow automation.',
        chips: ['POSIX Shell', 'Cluster Jobs', 'Remote Server Admin', 'Automation'],
        linkText: 'View Research Laboratories →',
        linkHref: 'index.html#experience'
      },
      'entra-id': {
        domain: 'DEVOPS & TOOLS · ZERO-TRUST & IDENTITY',
        title: 'Microsoft Entra ID & RBAC (Zero-Trust Security)',
        desc: 'Configured conditional access policies, role-based security groups, security trimming, and OAuth2 token scopes to enforce zero-trust boundary isolation across enterprise multi-agent RAG endpoints.',
        chips: ['Zero-Trust Security', 'RBAC Policies', 'Security Trimming', 'Token Scopes'],
        linkText: 'Read SIRIS Security Specs →',
        linkHref: 'siris.html'
      },
      'rest-apis': {
        domain: 'DEVOPS & TOOLS · INTEGRATION PROTOCOLS',
        title: 'REST APIs & JSON-RPC (Microservices Protocols)',
        desc: 'Designed and consumed stateless RESTful interfaces for Wisconsin Mesonet meteorological data ingestion, LLM inference endpoints, and enterprise webhooks.',
        chips: ['Stateless Endpoints', 'Data Normalization', 'Mesonet REST', 'JSON-RPC'],
        linkText: 'View Farm 2 Facts Role →',
        linkHref: 'index.html#experience'
      }
    };

    const filterBtns = skillsMatrixRoot.querySelectorAll('.skills-filter-btn');
    const skillNodes = skillsMatrixRoot.querySelectorAll('.skill-node');
    const elDomainTag = document.getElementById('prov-domain-tag');
    const elSkillName = document.getElementById('prov-skill-name');
    const elSkillDesc = document.getElementById('prov-skill-desc');
    const elChipsGroup = document.getElementById('prov-chips-group');
    const elActionLink = document.getElementById('prov-action-link');

    function renderSkillProvenance(skillKey) {
      const data = SKILLS_DATA[skillKey];
      if (!data) return;

      skillNodes.forEach(node => {
        const match = node.getAttribute('data-skill') === skillKey;
        node.classList.toggle('active', match);
        node.setAttribute('aria-pressed', match ? 'true' : 'false');
      });

      if (elDomainTag) elDomainTag.textContent = data.domain;
      if (elSkillName) elSkillName.textContent = data.title;
      if (elSkillDesc) elSkillDesc.textContent = data.desc;

      if (elChipsGroup) {
        elChipsGroup.innerHTML = '';
        data.chips.forEach(chipText => {
          const chipEl = document.createElement('span');
          chipEl.className = 'prov-chip';
          chipEl.textContent = chipText;
          elChipsGroup.appendChild(chipEl);
        });
      }

      if (elActionLink) {
        elActionLink.textContent = data.linkText;
        elActionLink.setAttribute('href', data.linkHref);
        if (data.linkHref.startsWith('http')) {
          elActionLink.setAttribute('target', '_blank');
          elActionLink.setAttribute('rel', 'noopener noreferrer');
        } else {
          elActionLink.removeAttribute('target');
          elActionLink.removeAttribute('rel');
        }
      }
    }

    // Filter bar click handling
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const domain = btn.getAttribute('data-domain');
        filterBtns.forEach(b => {
          const match = b === btn;
          b.classList.toggle('active', match);
          b.setAttribute('aria-selected', match ? 'true' : 'false');
        });

        skillNodes.forEach(node => {
          const nodeDomain = node.getAttribute('data-domain');
          const visible = (domain === 'all' || nodeDomain === domain);
          node.classList.toggle('is-hidden', !visible);
        });
      });
    });

    // Skill node click & keyboard handling
    skillNodes.forEach(node => {
      function activate() {
        const skillKey = node.getAttribute('data-skill');
        renderSkillProvenance(skillKey);
      }
      node.addEventListener('click', activate);
      node.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      });
    });

    // Initial render
    renderSkillProvenance('c-cpp');
  }

  // -------------------------------------------------------------
  // 13. INTERACTIVE VERIFIED CREDENTIAL LEDGER & AUDIT CONSOLE
  // -------------------------------------------------------------
  const certLedgerRoot = document.querySelector('.skills-col-right');
  if (certLedgerRoot) {
    const CERTS_DATA = {
      'citi-gcp': {
        title: 'GCP – Social and Behavioral Research Best Practices for Clinical Research',
        issuer: 'CITI Program (Collaborative Institutional Training Initiative) · Sep 2026 – Sep 2029',
        id: 'CREDENTIAL ID: 79651206',
        status: 'AUDITED & ACTIVE · HTTP 200 VERIFIED',
        desc: 'Good Clinical Practice standards for clinical trials and human behavioral research protocols, ensuring research participant protection, informed consent ethics, and data integrity.',
        btnText: 'Verify on Official CITI Registry',
        btnHref: 'https://www.citiprogram.org/verify/?w62825a83-fd00-43e9-80de-ab209a2f8a85-79651206',
        stamp: 'Verified via CITI Program Secure Registry'
      },
      'eagle-scout': {
        title: 'Eagle Scout Rank (National Leadership Honor)',
        issuer: 'Boy Scouts of America (National Council) · Issued Feb 2025',
        id: 'RANK: EAGLE SCOUT',
        status: 'PERMANENT NATIONAL HONOR',
        desc: 'Highest rank in Scouting. directed 11-person team across 165 hours constructing 10 wildlife rehabilitation shelters for HARP with 70% supply-chain lumber savings.',
        btnText: 'Read Eagle Scout Project Case Study',
        btnHref: 'eagle.html',
        stamp: 'National Court of Honor · Boy Scouts of America'
      },
      'google-cloud': {
        title: 'Digital Transformation with Google Cloud',
        issuer: 'Google Cloud Skills Boost · Issued Feb 2026',
        id: 'CREDENTIAL ID: 21941245',
        status: 'AUDITED & ACTIVE · SKILL: ARTIFICIAL INTELLIGENCE',
        desc: 'Cloud architecture modernization, distributed computing paradigms, infrastructure scaling, and enterprise artificial intelligence transformation on Google Cloud Platform.',
        btnText: 'Verify on Google Skills Public Profile',
        btnHref: 'https://www.skills.google/public_profiles/d308b8e5-ade3-4184-b35d-52d6c4291ad9/badges/21941245',
        stamp: 'Verified via Google Cloud Skills Registry'
      },
      'ibm-ai': {
        title: 'AI Literacy Certification',
        issuer: 'IBM · Issued Feb 2026',
        id: 'ISSUER: IBM CREDLY REGISTRY',
        status: 'AUDITED & ACTIVE · HTTP 200 VERIFIED',
        desc: 'Foundational principles of artificial intelligence, machine learning model families, neural representations, generative AI workflows, and ethical safety frameworks.',
        btnText: 'Verify on Credly Official Registry',
        btnHref: 'https://www.credly.com/badges/af00d53f-59e1-471c-98bb-88190e933f55/linked_in_profile',
        stamp: 'Verified via Credly Digital Badge Standard'
      },
      'ibm-cyber': {
        title: 'Cybersecurity Fundamentals',
        issuer: 'IBM · Issued Feb 2026',
        id: 'ISSUER: IBM CREDLY REGISTRY',
        status: 'AUDITED & ACTIVE · HTTP 200 VERIFIED',
        desc: 'Enterprise security architecture, threat vector modeling, cryptographic primitives, public-key infrastructure, identity governance, and incident defense protocols.',
        btnText: 'Verify on Credly Official Registry',
        btnHref: 'https://www.credly.com/badges/4b36bf4a-98d0-4f52-931c-60f5e6945a82/linked_in_profile',
        stamp: 'Verified via Credly Digital Badge Standard'
      },
      'ibm-design': {
        title: 'Enterprise Design Thinking Practitioner',
        issuer: 'IBM · Issued Feb 2026',
        id: 'ISSUER: IBM CREDLY REGISTRY',
        status: 'AUDITED & ACTIVE · HTTP 200 VERIFIED',
        desc: 'Human-centered design loops, user persona archetypes, hills and playbacks, stakeholder alignment, and agile cross-functional prototype iteration.',
        btnText: 'Verify on Credly Official Registry',
        btnHref: 'https://www.credly.com/badges/16a66a61-328b-4931-89ec-a8771f467a54/linked_in_profile',
        stamp: 'Verified via Credly Digital Badge Standard'
      },
      'citi-records': {
        title: 'UW Internet & Records-Based Research Certificate',
        issuer: 'CITI Program · University of Wisconsin–Madison · Issued Jan 2026',
        id: 'CREDENTIAL ID: 74949261',
        status: 'AUDITED & ACTIVE · INSTITUTIONAL RECORD',
        desc: 'Institutional privacy governance, secure records aggregation, digital dataset de-identification, and compliance with federal research ethics standards at UW–Madison.',
        btnText: 'Verify on Official CITI Registry',
        btnHref: 'https://www.citiprogram.org/verify/?wd56fa2aa-d1cd-4b02-8780-429dc17c7136-74949261',
        stamp: 'University of Wisconsin–Madison · CITI Protocol'
      },
      'citi-human': {
        title: 'UW Human Subjects Protections (Biomedical & Behavioral IRB)',
        issuer: 'CITI Program · University of Wisconsin–Madison · Jan 2026 – Jan 2029',
        id: 'CREDENTIAL ID: 74914430',
        status: 'AUDITED & ACTIVE · BIOMEDICAL & BEHAVIORAL IRB',
        desc: 'Ethical principles in human subject experimentation, Belmont Report mandates, risk-benefit minimization, vulnerable population safeguards, and institutional IRB protocol execution.',
        btnText: 'Verify on Official CITI Registry',
        btnHref: 'https://www.citiprogram.org/verify/?wb101862d-33af-40a7-a1cc-e1fa7096f985-74914430',
        stamp: 'UW–Madison Biomedical & Behavioral IRB Registry'
      }
    };

    const ledgerRows = certLedgerRoot.querySelectorAll('.ledger-row');
    const elStatusText = document.getElementById('audit-status-text');
    const elIdTag = document.getElementById('audit-id-tag');
    const elTitle = document.getElementById('audit-title');
    const elIssuerInfo = document.getElementById('audit-issuer-info');
    const elDesc = document.getElementById('audit-desc');
    const elVerifyBtn = document.getElementById('audit-verify-btn');
    const elBtnText = document.getElementById('audit-btn-text');
    const elStamp = document.getElementById('audit-stamp');

    function renderCertAudit(certKey) {
      const data = CERTS_DATA[certKey];
      if (!data) return;

      ledgerRows.forEach(row => {
        const match = row.getAttribute('data-cert') === certKey;
        row.classList.toggle('active', match);
        row.setAttribute('aria-selected', match ? 'true' : 'false');
      });

      if (elStatusText) elStatusText.textContent = data.status;
      if (elIdTag) elIdTag.textContent = data.id;
      if (elTitle) elTitle.textContent = data.title;
      if (elIssuerInfo) elIssuerInfo.textContent = data.issuer;
      if (elDesc) elDesc.textContent = data.desc;
      if (elStamp) elStamp.textContent = data.stamp;

      if (elVerifyBtn) {
        elVerifyBtn.setAttribute('href', data.btnHref);
        if (data.btnHref.startsWith('http')) {
          elVerifyBtn.setAttribute('target', '_blank');
          elVerifyBtn.setAttribute('rel', 'noopener noreferrer');
        } else {
          elVerifyBtn.removeAttribute('target');
          elVerifyBtn.removeAttribute('rel');
        }
      }
      if (elBtnText) elBtnText.textContent = data.btnText;
    }

    ledgerRows.forEach(row => {
      function activate() {
        const certKey = row.getAttribute('data-cert');
        renderCertAudit(certKey);
      }
      row.addEventListener('click', activate);
      row.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      });
    });

    // Initial render
    renderCertAudit('citi-gcp');
  }


  // -------------------------------------------------------------
  // FLAGSHIP DEMO 5: EAGLE SCOUT WILDLIFE SHELTER SPECS
  // -------------------------------------------------------------
  const eagleRoot = document.querySelector('[data-demo="eagle"]');
  if (eagleRoot) {
    const eagleData = {
      specs: {
        target: '10 outdoor mammal rehabilitation enclosures for HARP',
        dimensions: '36" x 24" x 24" with slanted rain-shed roof and removable cleanout floor',
        fasteners: 'Ceramic-coated exterior deck screws (zero zinc/galvanized toxicity)'
      },
      materials: {
        target: 'Dimensional Rough-Cut Western Red Cedar',
        dimensions: 'Natural rot & fungal resistance without chemical pressure-treating CCA/ACQ',
        fasteners: '100% pet-safe wood fibers; avoided plywood delamination under freeze-thaw'
      },
      thermal: {
        target: 'Internal 2-Chamber Wind Baffle & Air Lock',
        dimensions: 'Maintains 8-12°F thermal delta above ambient sub-zero winter temperatures',
        fasteners: 'Offset internal partition prevents direct predator line-of-sight'
      },
      budget: {
        target: 'Commercial Lumber Partnership & Supply Chain',
        dimensions: '70% commercial discount negotiated with local lumber supplier',
        fasteners: 'Total spend $380 against $1,200 standard retail budget ($820 savings)'
      }
    };
    const readout = eagleRoot.querySelector('#eagle-spec-readout');
    const btns = eagleRoot.querySelectorAll('[data-eagle-tab]');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        const tab = btn.getAttribute('data-eagle-tab');
        const data = eagleData[tab] || eagleData.specs;
        if (readout) {
          readout.innerHTML = `
            <div class="verdict-row"><strong>Target:</strong> ${data.target}</div>
            <div class="verdict-row"><strong>Dimensions:</strong> ${data.dimensions}</div>
            <div class="verdict-row"><strong>Fasteners:</strong> ${data.fasteners}</div>
          `;
        }
      });
    });
  }

})();
