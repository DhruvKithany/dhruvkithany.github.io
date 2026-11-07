# Dhruv Kithany — Systems & Machine Learning Engineering

Personal portfolio, deep-dive architecture case studies, neural connectome interface, and reading journal.

Built with semantic HTML5, pure CSS3 (custom properties, responsive grid, flexbox), and vanilla JavaScript with procedural HTML5 Canvas. Zero framework dependencies, zero tracking, zero runtime external networks.

---

## Architecture & Routes

- **Home (`index.html`)**: Systems headline, summary, high-contrast actions (Resume, SIRIS case study), stat strip, compact Windows Terminal block (hidden on mobile), hairline-separated editorial project rows with real WebP figure thumbnails (`siris_architecture.webp`, `stackscope_visualizer.webp`, `mindmesh_manifold.webp`, `lumina_preview.webp`), Experience highlights, Education (UW-Madison, CMU 15-122, South Fayette), Technical Skills & Verified Licenses & Certifications, structured 3-column Writing teaser, and plain contact block.
- **Experience (`experience.html`)**: Complete professional and academic engineering history across Federated Hermes, Waisman Center (AEPO Lab), IDiA Lab, Wisconsin Mesonet, WISCURDS Lab, and Alpha Vantage / Quantitative Finance.
- **Flagship Case Studies**:
  - `siris.html`: Production Multi-Agent RAG Assistant (Federated Hermes) with interactive query router simulator.
  - `stackscope.html`: ANSI C99 C0 Bytecode VM & Systems Visualizer.
  - `mindmesh.html`: High-Dimensional EEG Representation Learning & Manifold Geometry.
  - `lumina.html`: Real-Time Multimodal Presenter Intelligence HUD.
  - `eagle.html`: Wildlife Rehabilitation Infrastructure (Eagle Scout Service Project, Boy Scouts of America).
- **Reading Journal (`writing.html` & `writing/`)**: "The Languages That Don't Compile" — dynamic reading journal stream containing 19 curated literary and philosophical reflections.

---

## Neural Connectome & Visual Architecture

- **Procedural Dual-Hemisphere Soma & Spine**: Procedural brain mesh in hero funnels smoothly into the continuous left-lane spinal highway down the page, resting at the bottom-left at full scroll without overlapping DOM elements.
- **Section-Activated Color**: Section hues are gated purely by scroll activation $a \in [0, 1]$ centered at focus line $0.45H$ with strict hysteresis ($\max_{j \ne k} a_j \le 0.20$):
  - Hero: Neutral Overview (`#F4F3EF`)
  - Work: Amber (`#F59E0B`)
  - Experience: Sky Blue (`#38BDF8`)
  - Education / Background: Emerald (`#10B981`)
  - Skills: Sky Blue (`#38BDF8`)
  - Writing: Violet (`#A78BFA`)
  - Contact: Cyan (`#5CE1E6`)
  - Inactive elements: Dormant neutral (`#8E8E93`)
- **Deterministic Polyline Branch Growth**: Seeded RNG polyline branches grow smoothly outward from the spine to headings as scroll advances ($g = \text{smoothstep}((\text{viewportBottom} - \text{anchorY} - 0.15H) / (0.45H))$), sprouting growth cones, side twigs, and synaptic terminal buttons at completion. Completely reversible on upward scroll.
- **Live Section Readout (Output Layer)**: Accessible `<nav aria-label="Section readout">` in left gutter on desktop ($\ge 1280$px, gutter $\ge 220$px) displaying $p(\text{section} \mid \text{scroll})$ via softmax distribution over normalized distance $-d_i / \tau$ ($\tau = 0.38$, $\sum p_i = 1.00 \pm 0.01$). Active row ignites in section hue; clicking smoothly scrolls to target section and sets `aria-current="true"`. Zero bounding-box intersection with text boxes, spine line, or soma.
- **Design Language**: Dark `#070709`, `Instrument Serif` + `Inter` + `JetBrains Mono`, hairlines `rgba(244, 243, 239, 0.12)`.

---

## Build System & Pipeline

```bash
# 1. Compile Reading Journal from Markdown content files
python build_writing.py

# 2. Compile Unified Multi-Page Site (shared header/footer/readout)
python build_site.py

# 3. Serve Locally
python -m http.server 8000
```

---

## Automated Verification Suite

Every phase is strictly validated via automated Playwright and Lighthouse gates:

- `node tests/check_phase1_gate.js`: Test harness verification (`scrollTo`, `canvasEnergy`, `chromaEnergy`, `laneRect`, `sectionRects`, `textBoxes`, `frameMs`).
- `node tests/check_phase2_gate.js`: Home writing teaser 3-column layout match and zero canvas energy under text boxes.
- `node tests/check_phase3_gate.js`: Section-activated color, hysteresis gating, monotonicity, and $< 1.1\%$ scrubbing equivalence.
- `node tests/check_phase4_gate.js`: Deterministic seeded polyline branch growth across 10 anchors with retraction and $< 2.6\%$ scrub diff.
- `node tests/check_phase5_gate.js`: Live section readout softmax distribution, click navigation, accessibility, and zero bounding-box overlap at 1280, 1440, and 1920px.
- `node tests/check_phase6_gate.js`: Soma and spine regression check across 28 desktop and 48 mobile scroll steps.
- `node tests/check_phase7_gate.js`: Performance ($< 0.3$ms/frame scripting), accessibility (Lighthouse A11y 97), reduced motion suppression, and mobile 390x844 ergonomics.
- `node tests/click_everything.spec.js`: Automated interaction verification across 128 controls on all 8 pages and both viewports (0 no-ops, 0 console errors, 0 duplicate IDs).
