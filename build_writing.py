import shared_components
import os
import glob
import re

def parse_markdown_entry(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    meta = {}
    body = content
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            fm = parts[1]
            body = parts[2].strip()
            for line in fm.strip().split('\n'):
                if ':' in line:
                    k, v = line.split(':', 1)
                    k = k.strip()
                    v = v.strip().strip('"').strip("'")
                    if k == 'tags':
                        tags = re.findall(r'[\w\-]+', v)
                        meta['tags'] = tags
                    else:
                        meta[k] = v

    sections = {}
    current_sec = None
    sec_content = []

    for line in body.split('\n'):
        if line.startswith('### '):
            if current_sec:
                sections[current_sec] = '\n'.join(sec_content).strip()
            current_sec = line.replace('### ', '').strip()
            sec_content = []
        else:
            sec_content.append(line)
    if current_sec:
        sections[current_sec] = '\n'.join(sec_content).strip()

    meta['sections'] = sections
    if not meta.get('slug'):
        meta['slug'] = os.path.splitext(os.path.basename(filepath))[0]
    meta['raw_body'] = body
    return meta

def clean_em_dashes(text):
    if not text:
        return text
    text = text.replace('&mdash;', ' - ')
    text = text.replace('—', ' - ')
    text = text.replace('&ndash;', ' - ')
    text = text.replace('–', ' - ')
    return text

def format_mon_yyyy(date_str):
    if not date_str:
        return ""
    # Matches YYYY-MM-DD or YYYY-MM
    parts = str(date_str).strip().split('-')
    if len(parts) >= 2:
        months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        try:
            m_idx = int(parts[1])
            if 1 <= m_idx <= 12:
                return f"{months[m_idx]} {parts[0]}"
        except Exception:
            pass
    return date_str

def trim_duplicate_quote(verdict, resonated):
    if not verdict or not resonated:
        return resonated
    v_clean = clean_em_dashes(verdict).strip(' "“”\'')
    r_clean = clean_em_dashes(resonated).strip(' "“”\'')
    prefix_v = v_clean[:min(len(v_clean), 30)].lower()
    if prefix_v and r_clean.lower().startswith(prefix_v):
        dot_idx = r_clean.find('.')
        if dot_idx != -1 and dot_idx < len(v_clean) + 25:
            return r_clean[dot_idx + 1:].strip()
    return resonated

def render_html_content(text):
    text = clean_em_dashes(text)
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'\*(.+?)\*', r'<em>\1</em>', text)
    text = re.sub(r'`(.+?)`', r'<code>\1</code>', text)
    paras = text.split('\n\n')
    html_paras = []
    for p in paras:
        p = p.strip()
        if p:
            html_paras.append(f'<p>{p}</p>')
    return '\n'.join(html_paras)

def build_single_page(entry, all_entries, root_prefix="../"):
    title = clean_em_dashes(entry.get('title', 'Review'))
    author = clean_em_dashes(entry.get('author', 'Unknown'))
    rating = clean_em_dashes(entry.get('rating', ''))
    date_fin = clean_em_dashes(entry.get('date_finished', ''))
    date_formatted = format_mon_yyyy(date_fin)
    slug = entry.get('slug', 'entry')
    sections = entry.get('sections', {})

    raw_verdict = sections.get('One-Line Verdict', '')
    raw_resonated = sections.get('What Resonated Most', '')
    raw_resonated = trim_duplicate_quote(raw_verdict, raw_resonated)

    verdict = render_html_content(raw_verdict)
    about = render_html_content(sections.get("What It's About", ''))
    resonated = render_html_content(raw_resonated)
    reflections = render_html_content(sections.get('Reflections on the Broader Message', ''))
    recommend = render_html_content(sections.get('Would I Recommend It', ''))

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} · Reading Journal · Dhruv Kithany</title>
  <meta name="description" content="Personal reflections on {title} by {author}.">
  <link rel="canonical" href="https://dhruvkithany.github.io/writing/{slug}/">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="{title} · Reading Journal · Dhruv Kithany">
  <meta property="og:description" content="Personal reflections on {title} by {author}.">
  <meta property="og:url" content="https://dhruvkithany.github.io/writing/{slug}/">
  <meta property="og:image" content="https://dhruvkithany.github.io/assets/images/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title} · Reading Journal · Dhruv Kithany">
  <meta name="twitter:description" content="Personal reflections on {title} by {author}.">
  <meta name="twitter:image" content="https://dhruvkithany.github.io/assets/images/og-image.png">

  <link rel="stylesheet" href="{root_prefix}assets/css/style.css?v=7.0">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2246%22 fill=%22%23070709%22 stroke=%22%23F4F3EF%22 stroke-width=%228%22/><text y=%2258%22 x=%2250%22 text-anchor=%22middle%22 font-family=%22monospace%22 font-weight=%22700%22 font-size=%2246%22 fill=%22%23F4F3EF%22>D</text></svg>">
  <style>
    .essay-container {{
      max-width: 1040px;
      margin: 0 auto;
      padding: calc(var(--space-24) + var(--space-8)) var(--space-8) var(--space-24);
      position: relative;
      z-index: 2;
    }}
    .back-nav {{
      font-family: var(--font-sans);
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: var(--space-10);
      display: inline-block;
    }}
    .back-nav:hover {{
      color: var(--pulse-blue);
    }}
    .essay-header {{
      padding-bottom: var(--space-10);
      border-bottom: 1px solid var(--border-hairline);
      margin-bottom: var(--space-10);
    }}
    .essay-meta-kicker {{
      font-family: var(--font-sans);
      font-size: 14px;
      color: var(--pulse-blue);
      margin-bottom: var(--space-2);
    }}
    .essay-title {{
      font-family: var(--font-serif);
      font-size: clamp(2.4rem, 4.5vw, 4.2rem);
      font-weight: 400;
      line-height: 1.05;
      color: var(--text-primary);
      margin-bottom: var(--space-2);
    }}
    .essay-author {{
      font-family: var(--font-sans);
      font-size: 17px;
      color: var(--text-secondary);
      margin-bottom: var(--space-6);
    }}
    .essay-telemetry {{
      display: flex;
      gap: var(--space-6);
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--text-muted);
      border-top: 1px solid var(--border-hairline);
      padding-top: var(--space-4);
    }}
    .essay-telemetry strong {{
      color: var(--text-primary);
      font-weight: 500;
    }}
    .essay-row {{
      display: flex;
      padding: 40px 0;
      border-top: 1px solid var(--border-hairline);
      gap: var(--space-12);
    }}
    .essay-row:first-of-type {{
      border-top: none;
      padding-top: 0;
    }}
    @media (max-width: 800px) {{
      .essay-row {{
        flex-direction: column;
        gap: var(--space-3);
        padding: 30px 0;
      }}
    }}
    .essay-left-col {{
      width: 22%;
      flex-shrink: 0;
      font-family: var(--font-sans);
      font-size: 15px;
      color: var(--text-muted);
    }}
    @media (max-width: 800px) {{
      .essay-left-col {{
        width: 100%;
      }}
    }}
    .essay-right-col {{
      width: 78%;
      flex-grow: 1;
      color: var(--text-secondary);
      font-size: 16.5px;
      line-height: 1.7;
    }}
    @media (max-width: 800px) {{
      .essay-right-col {{
        width: 100%;
      }}
    }}
    .essay-right-col p {{
      margin-bottom: var(--space-4);
    }}
    .essay-right-col p:last-child {{
      margin-bottom: 0;
    }}
    .verdict-quote {{
      font-family: var(--font-serif);
      font-size: var(--text-xl);
      line-height: 1.35;
      color: var(--text-primary);
    }}
    .verdict-attribution {{
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--text-muted);
      margin-top: var(--space-4);
      letter-spacing: 0.02em;
    }}
    .essay-footer-nav {{
      border-top: 1px solid var(--border-hairline);
      padding-top: var(--space-12);
      margin-top: var(--space-16);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--font-sans);
      font-size: 14px;
      color: var(--text-muted);
    }}
    .essay-footer-nav a {{
      color: var(--text-primary);
      border-bottom: 1px solid var(--border-hairline-strong);
      padding-bottom: 1px;
    }}
    .essay-footer-nav a:hover {{
      color: var(--pulse-blue);
      border-color: var(--pulse-blue);
    }}
  </style>
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
{shared_components.get_shared_header(root_prefix)}

  <main id="main-content" class="essay-container">
    <a href="{root_prefix}writing.html" class="back-nav">&larr; Back to Writing</a>

    <header class="essay-header">
      <div class="essay-meta-kicker">Reflection &middot; {date_formatted}</div>
      <h1 class="essay-title">{title}</h1>
      <div class="essay-author">by {author}</div>
      <div class="essay-telemetry">
        <div>Completed: <strong>{date_formatted}</strong></div>
        <div>Rating: <strong>{rating}</strong></div>
        <div>Type: <strong>Personal Reflection</strong></div>
      </div>
    </header>

    <!-- 01 / VERDICT -->
    <section class="essay-row">
      <div class="essay-left-col">01 / Verdict</div>
      <div class="essay-right-col verdict-quote">
        {verdict}
        <div class="verdict-attribution">&mdash; me, {date_formatted}</div>
      </div>
    </section>

    <!-- 02 / WHAT IT'S ABOUT -->
    <section class="essay-row">
      <div class="essay-left-col">02 / Story</div>
      <div class="essay-right-col">
        {about}
      </div>
    </section>

    <!-- 03 / WHAT RESONATED MOST -->
    <section class="essay-row">
      <div class="essay-left-col">03 / Resonance</div>
      <div class="essay-right-col">
        {resonated}
      </div>
    </section>

    <!-- 04 / REFLECTIONS -->
    <section class="essay-row">
      <div class="essay-left-col">04 / Reflection</div>
      <div class="essay-right-col">
        {reflections}
      </div>
    </section>

    <!-- 05 / RECOMMENDATION -->
    <section class="essay-row">
      <div class="essay-left-col">05 / Takeaway</div>
      <div class="essay-right-col">
        {recommend}
      </div>
    </section>

    <!-- Footer Nav -->
    <div class="essay-footer-nav" style="margin-bottom: var(--space-12);">
      <a href="{root_prefix}writing.html">&larr; Back to Writing</a>
      <span>{title} &middot; by {author}</span>
    </div>
  </main>

{shared_components.get_shared_modal(root_prefix)}

{shared_components.get_shared_footer(root_prefix)}
  <script src="{root_prefix}assets/js/main.js"></script>
</body>
</html>
"""
    return html

def build_index_page(entries, root_prefix=""):
    entries_sorted = sorted(entries, key=lambda x: x.get('date_finished', ''), reverse=True)
    latest_date = entries_sorted[0].get('date_finished', '') if entries_sorted else ''
    updated_str = format_mon_yyyy(latest_date)

    rows_html = []
    for idx, e in enumerate(entries_sorted):
        num_str = f"{idx + 1:02d}"
        title = clean_em_dashes(e.get('title', 'Review'))
        author = clean_em_dashes(e.get('author', 'Unknown'))
        rating = clean_em_dashes(e.get('rating', ''))
        date_fin = clean_em_dashes(e.get('date_finished', ''))
        date_formatted = format_mon_yyyy(date_fin)
        slug = e.get('slug', 'entry')
        sections = e.get('sections', {})

        verdict = clean_em_dashes(sections.get('One-Line Verdict', ''))
        resonated = clean_em_dashes(sections.get('What Resonated Most', ''))
        resonated = trim_duplicate_quote(verdict, resonated)

        words = resonated.split()
        if len(words) > 40:
            resonated_excerpt = ' '.join(words[:40]) + '...'
        else:
            resonated_excerpt = resonated

        rows_html.append(f"""
        <article class="writing-row">
          <div class="writing-col-meta" style="white-space: nowrap;">
            <span>{num_str}</span>
            <span>&middot;</span>
            <span>{date_formatted}</span>
            <span>&middot;</span>
            <span>{rating}</span>
          </div>

          <div class="writing-col-title">
            <h2 class="writing-book-title">{title}</h2>
            <div class="writing-book-author">by {author}</div>
            <p class="writing-verdict">&ldquo;{verdict}&rdquo;</p>
            <div class="writing-verdict-author">&mdash; me, {date_formatted}</div>
          </div>

          <div class="writing-col-content">
            <div class="writing-passage">
              {resonated_excerpt}
            </div>
            <a href="{root_prefix}writing/{slug}/" class="writing-read-link">Read reflection &rarr;</a>
          </div>
        </article>
        """)

    rows_content = '\n'.join(rows_html)

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Languages That Don't Compile · Reading Journal · Dhruv Kithany</title>
  <meta name="description" content="Not everything worth reading compiles. A running journal of what's stuck with me over the years, and why it still matters when everything else is a scroll.">
  <link rel="canonical" href="https://dhruvkithany.github.io/writing.html">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="The Languages That Don't Compile · Reading Journal · Dhruv Kithany">
  <meta property="og:description" content="Not everything worth reading compiles. A running journal of what's stuck with me over the years, and why it still matters when everything else is a scroll.">
  <meta property="og:url" content="https://dhruvkithany.github.io/writing.html">
  <meta property="og:image" content="https://dhruvkithany.github.io/assets/images/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="The Languages That Don't Compile · Reading Journal · Dhruv Kithany">
  <meta name="twitter:description" content="Not everything worth reading compiles. A running journal of what's stuck with me over the years, and why it still matters when everything else is a scroll.">
  <meta name="twitter:image" content="https://dhruvkithany.github.io/assets/images/og-image.png">

  <link rel="stylesheet" href="{root_prefix}assets/css/style.css?v=7.0">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2246%22 fill=%22%23070709%22 stroke=%22%23F4F3EF%22 stroke-width=%228%22/><text y=%2258%22 x=%2250%22 text-anchor=%22middle%22 font-family=%22monospace%22 font-weight=%22700%22 font-size=%2246%22 fill=%22%23F4F3EF%22>D</text></svg>">
  <style>
    .writing-hub-wrap {{
      max-width: 1480px;
      margin: 0 auto;
      padding: calc(var(--space-24) + var(--space-8)) var(--space-8) var(--space-24);
      position: relative;
      z-index: 2;
    }}
    .writing-verdict-author {{
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-muted);
      margin-top: var(--space-2);
      letter-spacing: 0.02em;
    }}
    .hub-header {{
      padding-bottom: var(--space-10);
      border-bottom: 1px solid var(--border-hairline);
      margin-bottom: var(--space-8);
    }}
    .hub-kicker {{
      font-family: var(--font-sans);
      font-size: 15px;
      color: var(--pulse-blue);
      margin-bottom: var(--space-3);
    }}
    .hub-title {{
      font-family: var(--font-serif);
      font-size: clamp(2.4rem, 4.5vw, 4rem);
      font-weight: 400;
      line-height: 1.05;
      color: var(--text-primary);
      margin-bottom: var(--space-3);
    }}
    .hub-desc {{
      color: var(--text-secondary);
      font-size: 1.05rem;
      max-width: 68ch;
      line-height: 1.7;
    }}
    .writing-col-meta {{
      white-space: nowrap;
    }}
  </style>
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
{shared_components.get_shared_header(root_prefix)}

  <main id="main-content" class="writing-hub-wrap">
    <header class="hub-header">
      <div class="hub-kicker">Reading Journal · {len(entries_sorted)} entries</div>
      <h1 class="hub-title">The Languages That Don't Compile</h1>
      <p class="hub-desc">
        Not everything worth reading compiles. A running journal of what's stuck with me over the years, and why it still matters when everything else is a scroll.
      </p>
    </header>

    <div class="writing-stream">
      {rows_content}
    </div>
  </main>

{shared_components.get_shared_modal(root_prefix)}

{shared_components.get_shared_footer(root_prefix)}
  <script src="{root_prefix}assets/js/main.js"></script>
</body>
</html>
"""
    return html

def main():
    root = os.path.dirname(os.path.abspath(__file__))
    content_dir = os.path.join(root, 'content', 'writing')
    writing_dir = os.path.join(root, 'writing')
    os.makedirs(writing_dir, exist_ok=True)

    files = glob.glob(os.path.join(content_dir, '*.md'))
    entries = []

    for f in sorted(files):
        filename = os.path.basename(f)
        if filename.upper() == 'TEMPLATE.MD':
            continue
        entry = parse_markdown_entry(f)
        if entry.get('title') and entry.get('slug'):
            entries.append(entry)

    print(f"Loaded {len(entries)} writing entries.")

    for entry in entries:
        slug = entry['slug']

        # Flat: writing/<slug>.html
        html_flat = build_single_page(entry, entries, root_prefix="../")
        flat_path = os.path.join(writing_dir, f"{slug}.html")
        with open(flat_path, 'w', encoding='utf-8') as f:
            f.write(html_flat)

        # Directory: writing/<slug>/index.html
        slug_dir = os.path.join(writing_dir, slug)
        os.makedirs(slug_dir, exist_ok=True)
        html_clean = build_single_page(entry, entries, root_prefix="../../")
        clean_path = os.path.join(slug_dir, "index.html")
        with open(clean_path, 'w', encoding='utf-8') as f:
            f.write(html_clean)

        print(f"Generated single page for: {slug}")

    # Hub: writing/index.html
    index_html = build_index_page(entries, root_prefix="../")
    with open(os.path.join(writing_dir, "index.html"), 'w', encoding='utf-8') as f:
        f.write(index_html)
    print("Generated writing/index.html")

    # Root alias: writing.html
    root_writing_html = build_index_page(entries, root_prefix="")
    with open(os.path.join(root, "writing.html"), 'w', encoding='utf-8') as f:
        f.write(root_writing_html)
    print("Generated root writing.html")
    update_index_html(entries, root)

def update_index_html(entries, root):
    index_path = os.path.join(root, 'index.html')
    if not os.path.exists(index_path):
        return

    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()

    def get_rating_num(e):
        r_str = e.get('rating', '')
        m = re.search(r'([0-9.]+)', r_str)
        return float(m.group(1)) if m else 0.0

    featured_slugs = ['frankenstein', 'mark-twain-advice-to-youth', 'emerson-nature']
    entries_by_slug = {e.get('slug'): e for e in entries}
    top_3 = [entries_by_slug[s] for s in featured_slugs if s in entries_by_slug]
    if len(top_3) < 3:
        entries_sorted = sorted(entries, key=lambda x: (get_rating_num(x), x.get('date_finished', '')), reverse=True)
        for e in entries_sorted:
            if e not in top_3:
                top_3.append(e)
            if len(top_3) == 3:
                break

    rows_html = []
    for idx, e in enumerate(top_3):
        num_str = f"{idx + 1:02d}"
        title = clean_em_dashes(e.get('title', 'Review'))
        author = clean_em_dashes(e.get('author', 'Unknown'))
        rating = clean_em_dashes(e.get('rating', ''))
        date_fin = clean_em_dashes(e.get('date_finished', ''))
        date_formatted = format_mon_yyyy(date_fin)
        slug = e.get('slug', 'entry')
        sections = e.get('sections', {})

        verdict = clean_em_dashes(sections.get('One-Line Verdict', ''))
        resonated = clean_em_dashes(sections.get('What Resonated Most', ''))
        resonated = trim_duplicate_quote(verdict, resonated)

        rows_html.append(f"""          <article class="writing-row">
            <div class="writing-col-meta" style="white-space: nowrap;">
              <span>{num_str}</span>
              <span>&middot;</span>
              <span>{date_formatted}</span>
              <span>&middot;</span>
              <span>{rating}</span>
            </div>

            <div class="writing-col-title">
              <h2 class="writing-book-title">{title}</h2>
              <div class="writing-book-author">by {author}</div>
              <p class="writing-verdict">&ldquo;{verdict}&rdquo;</p>
              <div class="writing-verdict-author">&mdash; me, {date_formatted}</div>
            </div>

            <div class="writing-col-content">
              <div class="writing-passage">
                {resonated}
              </div>
              <a href="writing/{slug}/" class="writing-read-link">Read reflection &rarr;</a>
            </div>
          </article>""")

    rows_content = "\n".join(rows_html)

    new_writing_section = f"""        <!-- ================================================================
             SECTION: WRITING TEASER (MATCHING WRITING HUB ROW COMPONENT)
             ================================================================ -->
        <section id="writing" class="section-wrap" data-section="writing">
          <div class="section-header">
            <h2 class="section-title"><span class="neural-anchor" data-node-id="writing-crossbar" data-layer="5" data-section="limbic"></span>The Languages That Don't Compile</h2>
            <p class="section-desc">Not everything worth reading compiles. A running journal of what's stuck with me over the years, and why it still matters when everything else is a scroll.</p>
          </div>

          <div class="writing-stream">
{rows_content}
          </div>

          <div class="all-reflections-row" style="margin-top: var(--space-8);">
            <a href="writing.html" class="all-reflections-link">All reflections ({len(entries)}) &rarr;</a>
          </div>
        </section>"""

    start_tag = '<section id="writing"'
    start_idx = content.find(start_tag)
    if start_idx != -1:
        end_tag = '</section>'
        end_idx = content.find(end_tag, start_idx) + len(end_tag)
        comment_idx = content.rfind('<!-- ================================================================', 0, start_idx)
        if comment_idx != -1 and ("DON'T COMPILE" in content[comment_idx:start_idx] or "WRITING TEASER" in content[comment_idx:start_idx]):
            replace_start = comment_idx
        else:
            replace_start = start_idx
        content = content[:replace_start] + new_writing_section + content[end_idx:]
        with open(index_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Safely updated Writing teaser in index.html with {len(entries)} total entries!")
    else:
        print("ERROR: Could not find section id='writing' in index.html")

if __name__ == '__main__':
    main()
