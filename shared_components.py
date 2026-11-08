"""
shared_components.py
Single Source of Truth for shared navigation header, jump modal, and footer.
Used by build_site.py and build_writing.py.
"""

def get_shared_nav(prefix=""):
    return f"""    <nav class="nav-links" aria-label="Main Navigation">
      <a href="{prefix}index.html#work" class="nav-link">Work</a>
      <a href="{prefix}experience.html" class="nav-link">Experience</a>
      <a href="{prefix}writing.html" class="nav-link">Writing</a>
      <a href="{prefix}experience.html" class="nav-resume">Resume ↗</a>
    </nav>"""

def get_shared_controls():
    return """    <div class="header-controls">
      <button type="button" class="header-btn" id="global-static-toggle" aria-pressed="false" title="Reduce motion and disable continuous animation loops">Reduce motion</button>
      <button type="button" class="header-btn" id="global-index-toggle" aria-expanded="false" aria-controls="global-index-modal" title="Jump to section or project">Jump to</button>
    </div>"""

def get_shared_header(prefix=""):
    return f"""  <header class="site-header" id="site-header" role="banner">
    <div class="nav-container">
      <a href="{prefix}index.html" class="site-logo" aria-label="Dhruv Kithany Home">
        dhruv_kithany
      </a>

{get_shared_nav(prefix)}

{get_shared_controls()}
    </div>
  </header>"""

def get_shared_modal(prefix=""):
    return f"""  <div id="global-index-modal" class="global-index-modal" role="dialog" aria-modal="true" aria-labelledby="index-modal-title" hidden>
    <div id="global-index-backdrop" class="modal-backdrop"></div>
    <div class="modal-dialog-panel">
      <div class="modal-header">
        <h2 id="index-modal-title" class="modal-title">Jump to</h2>
        <button type="button" id="global-index-close" class="modal-close-btn" aria-label="Close jump modal">&times;</button>
      </div>
      <div class="modal-body">
        <div class="jump-group">
          <div class="jump-group-title">Sections</div>
          <div class="jump-links-grid">
            <a href="{prefix}index.html#work" class="jump-link">Work / Projects</a>
            <a href="{prefix}experience.html" class="jump-link">Full Experience</a>
            <a href="{prefix}index.html#education" class="jump-link">Education</a>
            <a href="{prefix}index.html#skills" class="jump-link">Technical Skills</a>
            <a href="{prefix}writing.html" class="jump-link">Writing Hub</a>
            <a href="{prefix}index.html#contact" class="jump-link">Contact</a>
            <a href="{prefix}experience.html" class="jump-link">Resume &rarr;</a>
          </div>
        </div>
        <div class="jump-group" style="margin-top: 1.5rem;">
          <div class="jump-group-title">Flagship Projects</div>
          <div class="jump-links-grid">
            <a href="{prefix}siris.html" class="jump-link">SIRIS: Multi-Agent Enterprise RAG</a>
            <a href="{prefix}stackscope.html" class="jump-link">StackScope: C0 Bytecode VM &amp; Visualizer</a>
            <a href="{prefix}mindmesh.html" class="jump-link">MindMesh: High-Dimensional EEG Decoding</a>
            <a href="{prefix}lumina.html" class="jump-link">Lumina: Affective HUD Coaching</a>
            <a href="{prefix}eagle.html" class="jump-link">Eagle Scout: Wildlife Shelter Architecture</a>
          </div>
        </div>
      </div>
    </div>
  </div>"""

def get_shared_footer(prefix=""):
    return f"""  <footer class="site-footer" role="contentinfo">
    <div class="footer-inner">
      <div class="footer-left">
        <span class="footer-copy">Dhruv Kithany &copy; 2026</span>
        <span class="footer-sep">·</span>
        <span class="footer-tagline">Systems &amp; Machine Learning</span>
      </div>
      <div class="footer-links">
        <a href="{prefix}index.html#work" class="footer-link">Work</a>
        <a href="{prefix}experience.html" class="footer-link">Experience</a>
        <a href="{prefix}writing.html" class="footer-link">Writing</a>
        <a href="{prefix}experience.html" class="footer-link">Resume</a>
        <a href="mailto:kithany@wisc.edu" class="footer-link">Email</a>
        <a href="https://github.com/dhruvkithany" class="footer-link" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        <a href="https://linkedin.com/in/dhruvkithany" class="footer-link" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
      </div>
    </div>
  </footer>"""
