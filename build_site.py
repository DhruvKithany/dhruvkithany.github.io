import os
import re
import json
import shared_components

ROOT = os.path.dirname(os.path.abspath(__file__))

# -------------------------------------------------------------
# SHARED MARKUP BLOCKS (Imported from shared_components.py)
# -------------------------------------------------------------
SHARED_NAV = shared_components.get_shared_nav()
SHARED_CONTROLS = shared_components.get_shared_controls()
SHARED_HEADER = shared_components.get_shared_header()
SHARED_MODAL = shared_components.get_shared_modal()
SHARED_FOOTER = shared_components.get_shared_footer()

def build_home():
    print("Building index.html (Home)...")
    
    # 1. Hero Terminal Block (fit-content, 5 lines, zero empty space)
    hero_terminal_html = """            <div class="hero-terminal-container" id="hero-terminal-block">
              <div class="hero-terminal">
                <div class="hero-terminal-header">
                  <div class="terminal-tab-group">
                    <div class="terminal-tab active">
                      <span class="terminal-tab-icon">&gt;_</span>
                      <span class="terminal-tab-title">PowerShell</span>
                      <span class="terminal-tab-close">&times;</span>
                    </div>
                  </div>
                  <div class="terminal-controls">
                    <span class="term-win-btn term-min" aria-hidden="true">&#x2212;</span>
                    <span class="term-win-btn term-max" aria-hidden="true">&#x25A2;</span>
                    <span class="term-win-btn term-close" aria-hidden="true">&#x2715;</span>
                  </div>
                </div>
                <div class="hero-terminal-body">
                  <div class="term-line"><span class="term-prompt">PS C:\\Users\\dhruv\\systems&gt;</span> <span class="term-cmd">whoami</span></div>
                  <div class="term-output">dhruv_kithany [UW-Madison CS &amp; Statistics '28]</div>
                  <div class="term-line"><span class="term-prompt">PS C:\\Users\\dhruv\\systems&gt;</span> <span class="term-cmd">Get-ResearchStatus</span></div>
                  <div class="term-output">AEPO Lab: LibriSpeech [12 files/s] | IDiA: Stroke MRI [CHTC] | WISCURDS: LLM proxies</div>
                  <div class="term-line"><span class="term-prompt">PS C:\\Users\\dhruv\\systems&gt;</span> <span class="term-cursor" aria-hidden="true">_</span></div>
                </div>
              </div>
            </div>"""

    # 2. Selected Work (Editorial rows with real thumbnails, zero bordered boxes)
    selected_work_html = """        <!-- ================================================================
             SECTION: SELECTED WORK (EDITORIAL ROWS)
             ================================================================ -->
        <section id="work" class="section-wrap" data-section="projects">
          <div id="projects" class="anchor-target"></div>
          <div class="section-header">
            <h2 class="section-title"><span class="neural-anchor" data-node-id="proj-crossbar" data-layer="3" data-section="compute"></span>Selected Work</h2>
            <p class="section-desc">Production multi-agent enterprise systems, high-throughput signal pipelines, and low-level bytecode execution engines.</p>
          </div>

          <div class="editorial-project-list">
            <!-- 01: SIRIS -->
            <a href="siris.html" class="editorial-project-row" aria-label="SIRIS: Production Multi-Agent RAG Assistant case study">
              <div class="editorial-project-main">
                <div class="editorial-project-top">
                  <span class="neural-anchor" data-node-id="proj-siris" data-layer="1" data-section="compute" data-date="2026"></span><span class="editorial-project-num">01</span>
                  <h3 class="editorial-project-title">SIRIS: Production Multi-Agent RAG Assistant</h3>
                  <span class="editorial-project-meta">Federated Hermes · 2026</span>
                </div>
                <p class="editorial-project-outcome">Production intent router and multi-agent system automating governance workflows with user-delegated Microsoft Entra ID scoping.</p>
                <div class="editorial-project-stats">165+ eval cases · 6 specialist agents · 20/20 compliance verified · sub-second classification</div>
                <div class="editorial-project-stack">Python · Azure OpenAI · LangGraph · Microsoft Graph API · Entra ID · FAISS</div>
                <div class="editorial-project-cta">Read case study &rarr;</div>
              </div>
              <div class="editorial-project-media">
                <img src="assets/images/siris_architecture.webp" alt="SIRIS multi-agent router architecture schematic" class="editorial-project-thumb" width="480" height="300" loading="eager">
              </div>
            </a>

            <!-- 02: StackScope -->
            <a href="stackscope.html" class="editorial-project-row" aria-label="StackScope: C0 Bytecode Virtual Machine & Visualizer case study">
              <div class="editorial-project-main">
                <div class="editorial-project-top">
                  <span class="neural-anchor" data-node-id="proj-stackscope" data-layer="3" data-section="compute" data-date="2024"></span><span class="editorial-project-num">02</span>
                  <h3 class="editorial-project-title">StackScope: C0 Bytecode Virtual Machine &amp; Visualizer</h3>
                  <span class="editorial-project-meta">Systems Project · 2024</span>
                </div>
                <p class="editorial-project-outcome">ANSI C99 virtual machine executing C0 bytecode at ~525 MIPS with interactive step-debugging and operand stack visualization.</p>
                <div class="editorial-project-stats">~525 MIPS throughput · 45 opcodes · 96% core coverage · sub-5ms stepping</div>
                <div class="editorial-project-stack">C · Python · JavaScript · ISA Design · Automated Testing · Web Standards</div>
                <div class="editorial-project-cta">Read case study &rarr;</div>
              </div>
              <div class="editorial-project-media">
                <img src="assets/images/stackscope_visualizer.webp" alt="StackScope bytecode runtime visualizer interface" class="editorial-project-thumb" width="480" height="300" loading="eager">
              </div>
            </a>

            <!-- 03: MindMesh -->
            <a href="mindmesh.html" class="editorial-project-row" aria-label="MindMesh: EEG Emotion Decoding Pipeline case study">
              <div class="editorial-project-main">
                <div class="editorial-project-top">
                  <span class="neural-anchor" data-node-id="proj-mindmesh" data-layer="2" data-section="compute" data-date="2024"></span><span class="editorial-project-num">03</span>
                  <h3 class="editorial-project-title">MindMesh: EEG Emotion Decoding Pipeline</h3>
                  <span class="editorial-project-meta">Computational Neuroengineering · 2024</span>
                </div>
                <p class="editorial-project-outcome">End-to-end machine learning pipeline decoding 27 fine-grained emotions from EEG signals across 88 subjects and 11,000+ trials.</p>
                <div class="editorial-project-stats">30.83% Top-1 (8x chance) · 80%+ Top-5 accuracy · 8.8ms inference latency</div>
                <div class="editorial-project-stack">Python · PyTorch · Scikit-learn · Signal Processing · Manifold Geometry</div>
                <div class="editorial-project-cta">Read case study &rarr;</div>
              </div>
              <div class="editorial-project-media">
                <img src="assets/images/mindmesh_manifold.webp" alt="MindMesh high-dimensional EEG manifold geometry visualization" class="editorial-project-thumb" width="480" height="300" loading="eager">
              </div>
            </a>

            <!-- 04: Lumina -->
            <a href="lumina.html" class="editorial-project-row" aria-label="Lumina: Real-Time Presentation Coaching HUD case study">
              <div class="editorial-project-main">
                <div class="editorial-project-top">
                  <span class="neural-anchor" data-node-id="proj-lumina" data-layer="4" data-section="compute" data-date="2024"></span><span class="editorial-project-num">04</span>
                  <h3 class="editorial-project-title">Lumina: Real-Time Presentation Coaching HUD</h3>
                  <span class="editorial-project-meta">Computer Vision · 2024</span>
                </div>
                <p class="editorial-project-outcome">Real-time computer vision pipeline tracking 468 3D facial landmarks and 33 skeletal points delivering unobtrusive HUD feedback.</p>
                <div class="editorial-project-stats">468 face mesh landmarks · 33 skeletal points · 30 FPS transparent HUD · sub-15ms latency</div>
                <div class="editorial-project-stack">Python · OpenCV · MediaPipe · WebRTC · Speech-to-Text · HUD Telemetry</div>
                <div class="editorial-project-cta">Read case study &rarr;</div>
              </div>
              <div class="editorial-project-media">
                <img src="assets/images/lumina_preview.webp" alt="Lumina facial landmark mesh and presenter coaching HUD interface" class="editorial-project-thumb" width="480" height="300" loading="eager">
              </div>
            </a>
          </div>
        </section>"""

    # 3. Compact Experience List (Zero kickers)
    compact_exp_html = """        <!-- ================================================================
             SECTION: EXPERIENCE (COMPACT LIST)
             ================================================================ -->
        <section id="experience" class="section-wrap" data-section="experience">
          <div class="section-header">
            <h2 class="section-title"><span class="neural-anchor" data-node-id="exp-crossbar" data-layer="1" data-section="executive"></span>Experience</h2>
            <p class="section-desc">Enterprise software engineering and academic machine learning research appointments.</p>
          </div>

          <div class="compact-exp-list">
            <!-- 1. Federated Hermes -->
            <div class="compact-exp-item">
              <div class="compact-exp-header">
                <div class="compact-exp-role"><span class="neural-anchor" data-node-id="exp-hermes" data-layer="1" data-section="executive" data-date="May 2026 – Aug 2026"></span>Software Developer Intern, Enterprise Architecture</div>
                <div class="compact-exp-dates">May 2026 – Aug 2026</div>
              </div>
              <div class="compact-exp-org">Federated Hermes · Pittsburgh, PA</div>
              <p class="compact-exp-line">Architected and built SIRIS, a production multi-agent RAG assistant with 6 specialist agents and zero net-new permissions.</p>
            </div>

            <!-- 2. AEPO Lab -->
            <div class="compact-exp-item">
              <div class="compact-exp-header">
                <div class="compact-exp-role"><span class="neural-anchor" data-node-id="exp-aepo" data-layer="2" data-section="executive" data-date="Sept 2026 – Present"></span>Undergraduate ML Researcher</div>
                <div class="compact-exp-dates">Sept 2026 – Present</div>
              </div>
              <div class="compact-exp-org">Auditory Encoding and Processing Optimization (AEPO) Lab, Waisman Center (PI: Dr. Bobby Gibbs) · Madison, WI</div>
              <p class="compact-exp-line">Built a dual-pipeline speech-masking engine in BubbleMixer with asyncio parallelization raising throughput from 1.5 to 12 files/sec.</p>
            </div>

            <!-- 3. IDiA Lab -->
            <div class="compact-exp-item">
              <div class="compact-exp-header">
                <div class="compact-exp-role">Undergraduate ML Researcher</div>
                <div class="compact-exp-dates">Sept 2026 – Present</div>
              </div>
              <div class="compact-exp-org">Integrated Diagnostics and Analytics (IDiA) Lab for Precision Medicine (PI: Dr. Pallavi Tiwari) · Madison, WI</div>
              <p class="compact-exp-line">Developing deep-learning MRI stroke-lesion segmentation pipelines benchmarking nnU-Net v2, SwinUNETR, and SAM on CHTC cluster.</p>
            </div>

            <!-- 4. Farm 2 Facts -->
            <div class="compact-exp-item">
              <div class="compact-exp-header">
                <div class="compact-exp-role">Research Software Engineer</div>
                <div class="compact-exp-dates">June 2026 – Oct 2026</div>
              </div>
              <div class="compact-exp-org">Farm 2 Facts (Advisor: Dr. Morales) · Madison, WI</div>
              <p class="compact-exp-line">Developed backend infrastructure and Wisconsin Mesonet REST APIs for 100+ specialty crop farmers across 5 states.</p>
            </div>

            <!-- 5. WISCURDS -->
            <div class="compact-exp-item">
              <div class="compact-exp-header">
                <div class="compact-exp-role">Undergraduate Researcher</div>
                <div class="compact-exp-dates">Nov 2025 – Present</div>
              </div>
              <div class="compact-exp-org">Wisconsin Undergraduate Research in Data Science (WISCURDS, Advisor: Dr. Adam Ross Nelson) · Madison, WI</div>
              <p class="compact-exp-line">Analyzing 133,000+ data cells across 66+ datasets to evaluate LLMs as synthetic human proxies.</p>
            </div>

            <!-- 6. Federated Hermes Shadow -->
            <div class="compact-exp-item">
              <div class="compact-exp-header">
                <div class="compact-exp-role">Shadow Software Developer</div>
                <div class="compact-exp-dates">May 2023 – Aug 2025</div>
              </div>
              <div class="compact-exp-org">Federated Hermes · Pittsburgh, PA</div>
              <p class="compact-exp-line">Built Python FX trading simulators and LSTM equity-forecasting prototypes in TensorFlow/Keras for portfolio management.</p>
            </div>
          </div>

          <div class="full-exp-link-row">
            <a href="experience.html" class="full-exp-link">Full experience &rarr;</a>
          </div>
        </section>"""

    # 4. Education (Zero kickers, Eagle Scout real date range)
    education_html = """        <!-- ================================================================
             SECTION: EDUCATION
             ================================================================ -->
        <section id="education" class="section-wrap" data-section="education">
          <div class="section-header">
            <h2 class="section-title"><span class="neural-anchor" data-node-id="edu-crossbar" data-layer="2" data-section="associative"></span>Education</h2>
          </div>

          <div class="compact-exp-list">
            <!-- UW-Madison -->
            <div class="compact-exp-item">
              <div class="compact-exp-header">
                <div class="compact-exp-role"><span class="neural-anchor" data-node-id="edu-uw" data-layer="2" data-section="associative" data-date="Aug 2025 – May 2028"></span>University of Wisconsin–Madison</div>
                <div class="compact-exp-dates">Aug 2025 – May 2028</div>
              </div>
              <div class="compact-exp-org">B.S. Computer Science, B.S. Statistics · Madison, WI</div>
              <p class="compact-exp-line" style="margin-top: 0.35rem;"><strong>Minors/Certificates:</strong> Mathematics, Data Science</p>
              <p class="compact-exp-line" style="margin-top: 0.25rem;"><strong>Relevant Coursework:</strong> Data Structures &amp; Algorithms, Intro to Artificial Intelligence, Data Management for Data Science, Data Science Modeling I &amp; II, Theory of Probability, Discrete Mathematics, Multivariable Calculus &amp; Linear Algebra, R for Statistics I &amp; II, Computer Architecture &amp; Computer Engineering, CMU 15-122, CMU 15-112.</p>
            </div>

            <!-- Carnegie Mellon -->
            <div class="compact-exp-item">
              <div class="compact-exp-header">
                <div class="compact-exp-role"><span class="neural-anchor" data-node-id="edu-cmu" data-layer="2" data-section="associative" data-date="May 2024 – Aug 2024"></span>Carnegie Mellon University</div>
                <div class="compact-exp-dates">May 2024 – Aug 2024</div>
              </div>
              <div class="compact-exp-org">School of Computer Science Pre-College Program (non-degree) · Pittsburgh, PA</div>
              <p class="compact-exp-line" style="margin-top: 0.35rem;">15-122: Principles of Imperative Computation, covering contracts, data structures, and algorithm analysis in C0 and C.</p>
            </div>

            <!-- South Fayette High School -->
            <div class="compact-exp-item">
              <div class="compact-exp-header">
                <div class="compact-exp-role"><span class="neural-anchor" data-node-id="edu-sf" data-layer="2" data-section="associative" data-date="2021 – 2025"></span>South Fayette Township High School</div>
                <div class="compact-exp-dates">2021 – 2025</div>
              </div>
              <div class="compact-exp-org">High School Diploma</div>
            </div>

            <!-- Eagle Scout Honor (Real date range from resume) -->
            <div class="compact-exp-item">
              <div class="compact-exp-header">
                <div class="compact-exp-role"><span class="neural-anchor" data-node-id="proj-eaglescout" data-layer="4" data-section="associative" data-date="May 2020 – Feb 2025"></span>Eagle Scout</div>
                <div class="compact-exp-dates">May 2020 – Feb 2025</div>
              </div>
              <div class="compact-exp-org">Boy Scouts of America</div>
              <p class="compact-exp-line" style="margin-top: 0.35rem;">Led 11-person team across 165 hours constructing 10 wildlife rehabilitation shelters for the Humane Animal Rescue of Pittsburgh. <a href="eagle.html" style="color:var(--pulse-blue); text-decoration:none;">Read project case study &rarr;</a></p>
            </div>
          </div>
        </section>"""

    # 5. Skills Section (Zero kickers, plain grouped lists + simple cert list)
    skills_html = """        <!-- ================================================================
             SECTION: TECHNICAL SKILLS & CERTIFICATIONS
             ================================================================ -->
        <section id="skills" class="section-wrap" data-section="skills">
          <div class="section-header">
            <h2 class="section-title"><span class="neural-anchor" data-node-id="skills-crossbar" data-layer="4" data-section="skills"></span>Technical Skills &amp; Certifications</h2>
          </div>

          <div class="skills-simple-container">
            <!-- Left: Plain Grouped Skills from Resume -->
            <div class="skills-plain-col">
              <h3 class="skills-col-title">Technical Skills</h3>
              
              <div class="skills-plain-group">
                <span class="skills-group-label">Languages:</span>
                <span class="skills-group-items">Python, Java, C/C++, SQL, NoSQL, JavaScript/TypeScript, R, Ruby, HTML/CSS</span>
              </div>

              <div class="skills-plain-group">
                <span class="skills-group-label">Frameworks &amp; Libraries:</span>
                <span class="skills-group-items">TensorFlow, Keras, PyTorch, Scikit-learn, Pandas, NumPy, OpenCV, MediaPipe, React, Node.js</span>
              </div>

              <div class="skills-plain-group">
                <span class="skills-group-label">Cloud &amp; Data:</span>
                <span class="skills-group-items">Azure, Azure OpenAI, Databricks, Power BI, Power Automate, MongoDB, MySQL</span>
              </div>

              <div class="skills-plain-group">
                <span class="skills-group-label">Dev Tools:</span>
                <span class="skills-group-items">Git, GitHub Actions, pytest, REST APIs, Microsoft Graph API, Copilot Studio</span>
              </div>
            </div>

            <!-- Right: Certifications Short List -->
            <div class="certs-plain-col">
              <h3 class="skills-col-title">Licenses &amp; Certifications</h3>
              <ul class="certs-simple-list">
                <li class="cert-simple-item">
                  <span class="cert-name">GCP – Social and Behavioral Research Best Practices for Clinical Research</span>
                  <span class="cert-meta">CITI Program · Sep 2026</span>
                </li>
                <li class="cert-simple-item">
                  <span class="cert-name">AI Literacy</span>
                  <span class="cert-meta">IBM · Feb 2026</span>
                </li>
                <li class="cert-simple-item">
                  <span class="cert-name">Digital Transformation with Google Cloud</span>
                  <span class="cert-meta">Google · Feb 2026</span>
                </li>
                <li class="cert-simple-item">
                  <span class="cert-name">Cybersecurity Fundamentals</span>
                  <span class="cert-meta">IBM · Feb 2026</span>
                </li>
                <li class="cert-simple-item">
                  <span class="cert-name">Enterprise Design Thinking Practitioner</span>
                  <span class="cert-meta">IBM · Feb 2026</span>
                </li>
                <li class="cert-simple-item">
                  <span class="cert-name">UW Internet/Records-Based Research Certificate</span>
                  <span class="cert-meta">CITI Program · Jan 2026</span>
                </li>
                <li class="cert-simple-item">
                  <span class="cert-name">UW Human Subjects Protections Research Certificate</span>
                  <span class="cert-meta">CITI Program · Jan 2026</span>
                </li>
              </ul>
            </div>
          </div>
        </section>"""

    # 6. Writing Teaser (Plain list of top 3 entries, zero cards, zero kickers)
    writing_teaser_html = """<!-- ================================================================
             SECTION: WRITING TEASER (MATCHING WRITING HUB ROW COMPONENT)
             ================================================================ -->
        <section id="writing" class="section-wrap" data-section="writing">
          <div class="section-header">
            <h2 class="section-title"><span class="neural-anchor" data-node-id="writing-crossbar" data-layer="5" data-section="limbic"></span>The Languages That Don't Compile</h2>
            <p class="section-desc">Not everything worth reading compiles. A running journal of what's stuck with me over the years, and why it still matters when everything else is a scroll.</p>
          </div>

          <div class="writing-stream">
          <article class="writing-row">
            <div class="writing-col-meta" style="white-space: nowrap;">
              <span>01</span>
              <span>&middot;</span>
              <span>May 2025</span>
              <span>&middot;</span>
              <span>9.5/10</span>
            </div>

            <div class="writing-col-title">
              <h2 class="writing-book-title">Frankenstein</h2>
              <div class="writing-book-author">by Mary Shelley</div>
              <p class="writing-verdict">&ldquo;Similar ambitions can diverge at the precipice of ethical awareness, distinguishing pursuits led by compassionate moderation from those corrupted by destructive isolation.&rdquo;</p>
              <div class="writing-verdict-author">&mdash; me, May 2025</div>
            </div>

            <div class="writing-col-content">
              <div class="writing-passage">
                The Enlightenment's rationalist exaltation of scientific triumphalism, characterized by a rampant objectification of nature and a pathological rejection of the metaphysical, imposed a dogmatic intellectual hegemony that systematically alienated the profound depths of human vulnerability. Shelley employs the foils of Victor Frankenstein and Henry Clerval to highlight the dichotomy between an unrestrained ambition, one that undermines humanity, and an ethically rooted pursuit, one that harmonizes with it.
              </div>
              <a href="writing/frankenstein/" class="writing-read-link">Read reflection &rarr;</a>
            </div>
          </article>
          <article class="writing-row">
            <div class="writing-col-meta" style="white-space: nowrap;">
              <span>02</span>
              <span>&middot;</span>
              <span>Feb 2024</span>
              <span>&middot;</span>
              <span>9.5/10</span>
            </div>

            <div class="writing-col-title">
              <h2 class="writing-book-title">Advice to Youth</h2>
              <div class="writing-book-author">by Mark Twain</div>
              <p class="writing-verdict">&ldquo;The unquestioning, naive acceptance of advice from authority figures promotes conformity over genuine individual growth, impeding the creation of a unique perspective paramount for adaptation and innovation.&rdquo;</p>
              <div class="writing-verdict-author">&mdash; me, Feb 2024</div>
            </div>

            <div class="writing-col-content">
              <div class="writing-passage">
                In his celebrated 1882 satirical address, Mark Twain dismantles the pious didacticism of Victorian parenting and moral instruction. Addressing a young audience, Twain subverts conventional moral cliches with blistering wit, urging young people to think independently rather than inherit prefabricated opinions. Genuine character and lasting intellectual growth stem not from copying authority, but from developing the courage to think for oneself.
              </div>
              <a href="writing/mark-twain-advice-to-youth/" class="writing-read-link">Read reflection &rarr;</a>
            </div>
          </article>
          <article class="writing-row">
            <div class="writing-col-meta" style="white-space: nowrap;">
              <span>03</span>
              <span>&middot;</span>
              <span>Dec 2023</span>
              <span>&middot;</span>
              <span>9.5/10</span>
            </div>

            <div class="writing-col-title">
              <h2 class="writing-book-title">Self-Reliance &amp; Nature</h2>
              <div class="writing-book-author">by Ralph Waldo Emerson</div>
              <p class="writing-verdict">&ldquo;Most of the problems we encounter are not caused by external forces, but derived from our own self-doubt; we cast shadows over our talents, hampering our drive toward success.&rdquo;</p>
              <div class="writing-verdict-author">&mdash; me, Dec 2023</div>
            </div>

            <div class="writing-col-content">
              <div class="writing-passage">
                Ralph Waldo Emerson's foundational essays champion the transcendentalist philosophy of radical individualism, intellectual self-reliance, and deep spiritual attunement with nature, urging humanity to reject social conformity, dogma, and materialistic distraction. His aphorism that most shadows are caused by standing in one's own sunshine contends that obstacles stem primarily from internal self-doubt rather than circumstance.
              </div>
              <a href="writing/emerson-nature/" class="writing-read-link">Read reflection &rarr;</a>
            </div>
          </article>
          </div>

          <div class="all-reflections-row" style="margin-top: var(--space-8);">
            <a href="writing.html" class="all-reflections-link">All reflections (19) &rarr;</a>
          </div>
        </section>"""

    # 7. Contact Section (Plain text + large email link, zero bordered pills, zero kickers)
    contact_html = """        <!-- ================================================================
             SECTION: CONTACT (EDITORIAL PLAIN TEXT)
             ================================================================ -->
        <section id="contact" class="section-wrap" data-section="contact">
          <div class="section-header">
            <h2 class="section-title">Contact</h2>
            <p class="section-desc">Open to conversations on distributed multi-agent systems, biomedical ML pipelines, and systems engineering.</p>
          </div>

          <div class="editorial-contact-block">
            <a href="mailto:kithany@wisc.edu" class="editorial-contact-email">kithany@wisc.edu</a>
            <div class="editorial-contact-links">
              <a href="https://github.com/dhruvkithany" target="_blank" rel="noopener noreferrer" class="editorial-contact-link">GitHub ↗</a>
              <span class="contact-sep">·</span>
              <a href="https://linkedin.com/in/dhruvkithany" target="_blank" rel="noopener noreferrer" class="editorial-contact-link">LinkedIn ↗</a>
              <span class="contact-sep">·</span>
              <a href="experience.html" class="editorial-contact-link">Experience &rarr;</a>
            </div>
          </div>
        </section>"""

    # Assemble full index.html
    index_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dhruv Kithany | Systems &amp; Machine Learning Engineering</title>
  <meta name="description" content="Dhruv Kithany is an Undergraduate Researcher at UW–Madison building multi-agent systems, neural signal processing pipelines, and machine learning architectures.">
  <link rel="canonical" href="https://dhruvkithany.github.io/">

  <!-- Structured Data: Google Schema.org Person Graph -->
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Dhruv Kithany",
    "url": "https://dhruvkithany.github.io/",
    "sameAs": [
      "https://www.linkedin.com/in/dhruvkithany",
      "https://github.com/dhruvkithany"
    ],
    "jobTitle": "Undergraduate Researcher & Machine Learning Engineer",
    "worksFor": {{
      "@type": "Organization",
      "name": "University of Wisconsin-Madison",
      "url": "https://www.wisc.edu"
    }},
    "alumniOf": {{
      "@type": "Organization",
      "name": "University of Wisconsin-Madison"
    }},
    "knowsAbout": [
      "Machine Learning",
      "Multi-Agent Systems",
      "Retrieval-Augmented Generation",
      "Neural Signal Processing",
      "Low-Level Systems",
      "C/C++",
      "Python"
    ]
  }}
  </script>

  <!-- Open Graph / Twitter -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Dhruv Kithany | Systems &amp; Machine Learning Engineering">
  <meta property="og:description" content="Dhruv Kithany is an Undergraduate Researcher at UW–Madison building multi-agent systems, neural signal processing pipelines, and machine learning architectures.">
  <meta property="og:url" content="https://dhruvkithany.github.io/">
  <meta property="og:image" content="https://dhruvkithany.github.io/assets/images/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Dhruv Kithany | Systems &amp; Machine Learning Engineering">
  <meta name="twitter:description" content="Dhruv Kithany is an Undergraduate Researcher at UW–Madison building multi-agent systems, neural signal processing pipelines, and machine learning architectures.">
  <meta name="twitter:image" content="https://dhruvkithany.github.io/assets/images/og-image.png">

  <!-- Typography & Assets -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css?v=9.0">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2246%22 fill=%22%23070709%22 stroke=%22%23F4F3EF%22 stroke-width=%228%22/><text y=%2258%22 x=%2250%22 text-anchor=%22middle%22 font-family=%22monospace%22 font-weight=%22700%22 font-size=%2246%22 fill=%22%23F4F3EF%22>D</text></svg>">
</head>
<body class="theme-dark">
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <!-- Fixed Interactive Neural Spine Canvas -->
  <canvas id="neural-canvas" class="neural-spine-canvas" aria-hidden="true"></canvas>

  <!-- Section Anchor Telemetry HUD -->
  <div id="section-hud" class="section-hud" aria-live="polite" aria-atomic="true">
    <span class="hud-marker" aria-hidden="true">&#9678;</span>
    <span id="hud-label" class="hud-label">Origin</span>
  </div>

{SHARED_HEADER}

  <div class="site-wrapper">
    <div class="open-layout">
      <!-- Left 16% Cerebral Spine Flow Lane on Desktop -->
      <aside class="neural-trunk-lane" aria-hidden="true"></aside>

      <!-- Live Section Readout (Output Layer) - Desktop >=1280px -->
      <nav aria-label="Section readout" id="section-readout" class="section-readout">
        <div class="readout-header" aria-hidden="true">p(section | scroll)</div>
        <div class="readout-rows" role="list">
          <a href="#work" class="readout-row" data-section="work" role="listitem">
            <span class="readout-label">Work</span>
            <span class="readout-bar-track" aria-hidden="true"><span class="readout-bar"></span></span>
            <span class="readout-val" aria-hidden="true">0.00</span>
          </a>
          <a href="#experience" class="readout-row" data-section="experience" role="listitem">
            <span class="readout-label">Experience</span>
            <span class="readout-bar-track" aria-hidden="true"><span class="readout-bar"></span></span>
            <span class="readout-val" aria-hidden="true">0.00</span>
          </a>
          <a href="#education" class="readout-row" data-section="education" role="listitem">
            <span class="readout-label">Background</span>
            <span class="readout-bar-track" aria-hidden="true"><span class="readout-bar"></span></span>
            <span class="readout-val" aria-hidden="true">0.00</span>
          </a>
          <a href="#writing" class="readout-row" data-section="writing" role="listitem">
            <span class="readout-label">Writing</span>
            <span class="readout-bar-track" aria-hidden="true"><span class="readout-bar"></span></span>
            <span class="readout-val" aria-hidden="true">0.00</span>
          </a>
          <a href="#contact" class="readout-row" data-section="contact" role="listitem">
            <span class="readout-label">Contact</span>
            <span class="readout-bar-track" aria-hidden="true"><span class="readout-bar"></span></span>
            <span class="readout-val" aria-hidden="true">0.00</span>
          </a>
        </div>
      </nav>

      <!-- Right 84% Editorial Canvas -->
      <main id="main-content" class="editorial-canvas">

        <!-- ================================================================
             HERO SECTION: "I build multi-agent systems and ML pipelines."
             ================================================================ -->
        <section id="hero" class="hero-section">
          <div class="neural-anchor" data-node-id="hero-anchor" data-layer="0" data-section="global"></div>
          
          <h1 class="hero-headline" id="hero-headline">I build multi-agent systems and ML pipelines.</h1>

          <p class="hero-bio" id="hero-summary">Undergraduate researcher at UW–Madison building multi-agent systems, neural signal processing pipelines, and low-level runtime engines.</p>

          <div class="hero-cta-group" id="hero-cta-group">
            <a href="siris.html" class="hero-btn hero-btn-primary" id="hero-siris-btn">Read the SIRIS case study</a>
            <a href="experience.html" class="hero-btn hero-btn-secondary" id="hero-resume-btn">Experience &rarr;</a>
          </div>

          <div class="stat-strip" id="hero-stat-strip">
            <div class="stat-item"><span class="stat-val">165+</span> <span class="stat-lbl">eval cases</span></div>
            <span class="stat-sep">·</span>
            <div class="stat-item"><span class="stat-val">6</span> <span class="stat-lbl">specialist agents</span></div>
            <span class="stat-sep">·</span>
            <div class="stat-item"><span class="stat-val">20/20</span> <span class="stat-lbl">compliance verified</span></div>
            <span class="stat-sep">·</span>
            <div class="stat-item"><span class="stat-val">~525</span> <span class="stat-lbl">MIPS throughput</span></div>
          </div>

          <p class="hero-now" id="hero-now-line">Now: ML research at AEPO Lab (cochlear implants), IDiA Lab (stroke MRI), and WISCURDS (LLM proxies).</p>

{hero_terminal_html}
        </section>

{selected_work_html}

{compact_exp_html}

{education_html}

{skills_html}

{writing_teaser_html}

{contact_html}

      </main>
    </div>
  </div>

{SHARED_MODAL}

{SHARED_FOOTER}

  <script src="assets/js/hero.js"></script>
  <script src="assets/js/main.js"></script>
</body>
</html>"""

    with open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(index_html)
    print("Generated clean index.html with editorial rows!")

def build_experience_page():
    print("Building experience.html...")
    with open(os.path.join(ROOT, 'tests', 'extracted_experience.html'), 'r', encoding='utf-8') as f:
        exp_inner_content = f.read()

    exp_page_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Experience &amp; Research Appointments · Dhruv Kithany</title>
  <meta name="description" content="Professional enterprise software engineering and academic machine learning research appointments by Dhruv Kithany.">
  <link rel="canonical" href="https://dhruvkithany.github.io/experience.html">

  <!-- Structured Data: Google Schema.org Person Graph -->
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Dhruv Kithany",
    "url": "https://dhruvkithany.github.io/",
    "sameAs": [
      "https://www.linkedin.com/in/dhruvkithany",
      "https://github.com/dhruvkithany"
    ],
    "jobTitle": "Undergraduate Researcher & Machine Learning Engineer",
    "worksFor": {{
      "@type": "Organization",
      "name": "University of Wisconsin-Madison",
      "url": "https://www.wisc.edu"
    }}
  }}
  </script>

  <meta property="og:type" content="website">
  <meta property="og:title" content="Experience &amp; Research Appointments · Dhruv Kithany">
  <meta property="og:description" content="Professional enterprise software engineering and academic machine learning research appointments by Dhruv Kithany.">
  <meta property="og:url" content="https://dhruvkithany.github.io/experience.html">
  <meta property="og:image" content="https://dhruvkithany.github.io/assets/images/og-experience.png">
  <meta name="twitter:image" content="https://dhruvkithany.github.io/assets/images/og-experience.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Experience &amp; Research Appointments · Dhruv Kithany">
  <meta name="twitter:description" content="Professional enterprise software engineering and academic machine learning research appointments by Dhruv Kithany.">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css?v=9.0">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2246%22 fill=%22%23070709%22 stroke=%22%23F4F3EF%22 stroke-width=%228%22/><text y=%2258%22 x=%2250%22 text-anchor=%22middle%22 font-family=%22monospace%22 font-weight=%22700%22 font-size=%2246%22 fill=%22%23F4F3EF%22>D</text></svg>">
</head>
<body class="theme-dark">
  <a href="#main-content" class="skip-link">Skip to main content</a>

{SHARED_HEADER}

  <main id="main-content" class="experience-page-wrap">
    <header class="experience-page-header">
      <div class="experience-page-kicker">Professional Appointments &amp; Labs</div>
      <h1 class="experience-page-title">Experience &amp; Research</h1>
      <p class="experience-page-desc">Complete technical breakdowns, quantitative telemetry, and architectural schematics across enterprise roles and machine learning research labs.</p>
      <div class="experience-page-meta-bar">
        <span>Federated Hermes</span>
        <span class="sep">·</span>
        <span>AEPO Lab (Waisman Center)</span>
        <span class="sep">·</span>
        <span>IDiA Lab (Precision Medicine)</span>
        <span class="sep">·</span>
        <span>Farm 2 Facts</span>
        <span class="sep">·</span>
        <span>WISCURDS</span>
      </div>
    </header>

    <div class="experience-stream" id="experience">
{exp_inner_content}
    </div>
  </main>

{SHARED_MODAL}

{SHARED_FOOTER}

  <script src="assets/js/main.js"></script>
</body>
</html>"""

    with open(os.path.join(ROOT, 'experience.html'), 'w', encoding='utf-8') as f:
        f.write(exp_page_html)
    print("Generated clean experience.html!")

def update_project_pages():
    print("Updating project pages (siris, stackscope, mindmesh, lumina, eagle)...")
    # Project pages update
    for page_name in ['siris', 'stackscope', 'mindmesh', 'lumina', 'eagle']:
        fpath = os.path.join(ROOT, f'{page_name}.html')
        if not os.path.exists(fpath): continue
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()

        content = re.sub(r'<header class="site-header"[^>]*>.*?</header>', SHARED_HEADER, content, count=1, flags=re.DOTALL)
        content = re.sub(r'<footer class="site-footer"[^>]*>.*?</footer>', SHARED_FOOTER, content, count=1, flags=re.DOTALL)
        if 'id="global-index-modal"' not in content:
            content = content.replace(SHARED_FOOTER, SHARED_MODAL + '\n\n' + SHARED_FOOTER)

        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {page_name}.html!")

def update_writing_hub():
    print("Updating writing.html header and modal...")
    writing_path = os.path.join(ROOT, 'writing.html')
    if os.path.exists(writing_path):
        with open(writing_path, 'r', encoding='utf-8') as f:
            w_content = f.read()
        w_content = re.sub(r'<header[^>]*>.*?</header>', SHARED_HEADER, w_content, count=1, flags=re.DOTALL)
        w_content = re.sub(r'<footer[^>]*>.*?</footer>', SHARED_FOOTER, w_content, count=1, flags=re.DOTALL)
        if 'id="global-index-modal"' not in w_content:
            w_content = w_content.replace(SHARED_FOOTER, SHARED_MODAL + '\n\n' + SHARED_FOOTER)
        if 'assets/js/main.js' not in w_content:
            w_content = w_content.replace('</body>', '  <script src="assets/js/main.js"></script>\n</body>')
        with open(writing_path, 'w', encoding='utf-8') as f:
            f.write(w_content)
        print("Updated writing.html!")

if __name__ == '__main__':
    build_home()
    build_experience_page()
    update_project_pages()
    update_writing_hub()
    print("All pages successfully built by build_site.py!")
