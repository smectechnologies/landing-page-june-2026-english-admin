"""
Clean patch script for all 15 pages.
For each page:
  1. Ensure popup CSS is inside the <style> block (unscoped, no data-astro-cid)
  2. Replace YouTube video-mobile section with mobile-hero image
  3. Ensure popup HTML div is present (before Fixed bottom nav bar)
  4. Ensure popup JS is present in the script block
"""
import os, re

ROOT = r'c:\Users\SMEClLABS\Documents\projects\2026\may\may-landing-mobileapp\src\pages'

PAGES = {
    'index':           {'vid': 'wA_NJ2uZeLo', 'img': 'automation',       'title': 'Industrial Automation', 'file': r'c:\Users\SMEClLABS\Documents\projects\2026\may\may-landing-mobileapp\src\pages\index.astro'},
    'bms':             {'vid': 'pdkjc_CfYzA', 'img': 'bms',              'title': 'BMS'},
    'civil':           {'vid': 'pdkjc_CfYzA', 'img': 'civil',            'title': 'Civil'},
    'digitalmarketing':{'vid': 'pdkjc_CfYzA', 'img': 'digital-marketing','title': 'Digital Marketing'},
    'embedded':        {'vid': 'pdkjc_CfYzA', 'img': 'embedded',         'title': 'Embedded'},
    'fintech':         {'vid': 'wA_NJ2uZeLo', 'img': 'fintech',          'title': 'Fintech'},
    'graphics':        {'vid': 'pdkjc_CfYzA', 'img': 'graphics',         'title': 'Graphic Design'},
    'hcm':             {'vid': 'pdkjc_CfYzA', 'img': 'hcm',              'title': 'HCM'},
    'hr':              {'vid': 'pdkjc_CfYzA', 'img': 'automation',       'title': 'HR'},
    'instrumentation': {'vid': '-1tR1sn4xjU', 'img': 'instrumentation',  'title': 'Instrumentation'},
    'logistics':       {'vid': 'pdkjc_CfYzA', 'img': 'logistics',        'title': 'Logistics'},
    'mep':             {'vid': 'fh42MGyFulI', 'img': 'mep',              'title': 'MEP'},
    'networking':      {'vid': 'pdkjc_CfYzA', 'img': 'networking',       'title': 'Networking'},
    'oilandgas':       {'vid': 'wA_NJ2uZeLo', 'img': 'oilandgas',        'title': 'Oil and Gas'},
    'shipmaintenance': {'vid': 'wA_NJ2uZeLo', 'img': 'shipmaintenance',  'title': 'Ship Maintenance'},
}

# ── CSS to inject (unscoped — no [data-astro-cid] attributes) ──────────────
POPUP_CSS = (
    '/* Mobile hero image */'
    '.hero__mobile-img-wrap{width:100%;border-radius:14px;overflow:hidden;'
    'box-shadow:0 12px 40px #2d318f40,0 4px 12px #00000026;border:2px solid rgba(255,255,255,.3)}'
    '.hero__mobile-hero-img{width:100%;height:auto;display:block;object-fit:cover}'
    '/* Video popup */'
    '.vid-popup{position:fixed;bottom:80px;left:16px;width:240px;border-radius:12px;'
    'overflow:hidden;box-shadow:0 8px 32px #00000040,0 2px 8px #00000030;z-index:9999;opacity:0;'
    'transform:translateY(20px) scale(.95);pointer-events:none;'
    'transition:opacity .35s ease,transform .35s ease;background:#000}'
    '.vid-popup.vid-popup--visible{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}'
    '.vid-popup__container{position:relative;width:100%;aspect-ratio:16/9}'
    '.vid-popup__close{position:absolute;top:6px;right:6px;z-index:10;width:26px;height:26px;'
    'border-radius:50%;background:rgba(0,0,0,.7);border:none;cursor:pointer;display:flex;'
    'align-items:center;justify-content:center;color:#fff;padding:0;transition:background .2s}'
    '.vid-popup__close:hover{background:rgba(0,0,0,.9)}'
    '@media(min-width:769px){.vid-popup{display:none}}'
)

# ── Popup HTML (no data-astro-cid attributes) ──────────────────────────────
POPUP_HTML = (
    ' <!-- Video popup — bottom-left, appears after 5s on mobile -->'
    ' <div id="vid-popup" class="vid-popup" aria-label="Watch our program video">'
    ' <button id="vid-popup-close" class="vid-popup__close" aria-label="Close video" type="button">'
    ' <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
    ' stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    '<line x1="18" y1="6" x2="6" y2="18"></line>'
    '<line x1="6" y1="6" x2="18" y2="18"></line></svg>'
    ' </button>'
    ' <div id="vid-popup-container" class="vid-popup__container"></div>'
    ' </div>'
)

def make_popup_js(vid, title):
    # Use \` so backtick is escaped inside the Astro template string
    return (
        f'(function(){{'
        f'const videoId="{vid}";'
        'const popup=document.getElementById("vid-popup");'
        'const closeBtn=document.getElementById("vid-popup-close");'
        'const container=document.getElementById("vid-popup-container");'
        'if(!popup||!closeBtn||!container)return;'
        'function openPopup(){'
        'popup.classList.add("vid-popup--visible");'
        'const iframe=document.createElement("iframe");'
        f'iframe.src=\\`https://www.youtube.com/embed/{vid}?rel=0&modestbranding=1&autoplay=1\\`;'
        f'iframe.title="SMECLabs {title} Program";'
        'iframe.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";'
        'iframe.allowFullscreen=true;'
        'iframe.style.cssText="position:absolute;inset:0;width:100%;height:100%;border:none;";'
        'container.appendChild(iframe);}'
        'function closePopup(){'
        'popup.classList.remove("vid-popup--visible");'
        'container.innerHTML="";}'
        'closeBtn.addEventListener("click",closePopup);'
        'setTimeout(openPopup,5000);})()'
        ';'
    )

# ── Regex patterns ─────────────────────────────────────────────────────────

# The </style> closing tag — we inject CSS just before it
STYLE_CLOSE = '</style>'

# Any existing popup CSS block (scoped or unscoped) — remove and re-add
OLD_POPUP_CSS_PAT = re.compile(
    r'/\* (?:Mobile hero image|Video popup) \*/.*?@media\(min-width:769px\)\{\.vid-popup[^}]*\{display:none\}\}',
    re.DOTALL
)

# YouTube video-mobile section to replace
YT_VID_PAT = re.compile(
    r'<!-- YouTube video — mobile only -->.*?</div> </div> </div>',
    re.DOTALL
)

# Any existing popup HTML block — remove and re-add
OLD_POPUP_HTML_PAT = re.compile(
    r' <!-- Video popup[^<]*-->.*?</div> </div>(?=\s*<!-- Fixed bottom nav bar -->)',
    re.DOTALL
)

# Existing popup JS — remove and re-add
OLD_POPUP_JS_PAT = re.compile(
    r'\(function\(\)\{const videoId="[^"]*";.*?setTimeout\(openPopup,5000\);\}\)\(\);',
    re.DOTALL
)

# The forEach script block (to append popup JS after it)
FOREACH_PAT = re.compile(
    r'(document\.querySelectorAll\("\.hero__video-cover"\)\.forEach\(e=>\{.*?\}\)\}\);)',
    re.DOTALL
)

def patch(fpath, info):
    vid   = info['vid']
    img   = info['img']
    title = info['title']

    with open(fpath, 'r', encoding='utf-8') as f:
        c = f.read()

    ops = []

    # ── 1. CSS ──────────────────────────────────────────────────────────────
    # Remove any old popup CSS first
    m = OLD_POPUP_CSS_PAT.search(c)
    if m:
        c = c[:m.start()] + c[m.end():]
        ops.append('removed old CSS')

    # Now inject fresh CSS just before </style>
    if '.vid-popup{' not in c:
        # Find the LAST </style> before <body> to inject into the right style block
        body_pos = c.find('<body>')
        style_close_pos = c.rfind(STYLE_CLOSE, 0, body_pos)
        if style_close_pos >= 0:
            c = c[:style_close_pos] + POPUP_CSS + STYLE_CLOSE + c[style_close_pos + len(STYLE_CLOSE):]
            ops.append('CSS injected into <style>')
        else:
            ops.append('WARNING: could not find </style>')

    # ── 2. Mobile hero image (replace YouTube video section) ────────────────
    if '<!-- YouTube video — mobile only -->' in c:
        img_html = (
            '<!-- Mobile hero image (replaces video on mobile) -->'
            ' <div class="hero__video-mobile" data-astro-cid-7nmnspah>'
            ' <div class="hero__mobile-img-wrap">'
            f' <img src="${{base}}/mobile-hero/{img}.webp"'
            f' alt="{title} at SMECLabs"'
            ' class="hero__mobile-hero-img" width="640" height="360"'
            ' loading="eager" decoding="async">'
            ' </div> </div>'
        )
        new_c = YT_VID_PAT.sub(img_html, c)
        if new_c != c:
            c = new_c
            ops.append('video → mobile image')

    # ── 3. Popup HTML div ───────────────────────────────────────────────────
    # Remove old popup HTML if present
    m2 = OLD_POPUP_HTML_PAT.search(c)
    if m2:
        c = c[:m2.start()] + c[m2.end():]
        ops.append('removed old popup HTML')

    # Insert popup HTML before "Fixed bottom nav bar"
    if 'id="vid-popup"' not in c:
        for anchor in ['<!-- Fixed bottom nav bar -->', ' <!-- Fixed bottom nav bar -->']:
            if anchor in c:
                c = c.replace(anchor, POPUP_HTML + ' ' + anchor.lstrip(), 1)
                ops.append('popup HTML inserted')
                break

    # ── 4. Popup JS ─────────────────────────────────────────────────────────
    new_js = make_popup_js(vid, title)

    # Remove old popup JS
    m3 = OLD_POPUP_JS_PAT.search(c)
    if m3:
        c = c[:m3.start()] + c[m3.end():]
        ops.append('removed old popup JS')

    # Append new popup JS after the forEach block
    if 'openPopup' not in c:
        m4 = FOREACH_PAT.search(c)
        if m4:
            old_s = m4.group(1)
            c = c.replace(old_s, old_s + new_js, 1)
            ops.append('popup JS added')
        else:
            ops.append('WARNING: forEach not found')

    with open(fpath, 'w', encoding='utf-8', newline='') as f:
        f.write(c)

    print(f'  {os.path.basename(os.path.dirname(fpath)) or "index":20} | {", ".join(ops) if ops else "no changes"}')

print('Patching all pages...\n')
for name, info in PAGES.items():
    if 'file' in info:
        fpath = info['file']
    else:
        fpath = os.path.join(ROOT, name, 'index.astro')
    patch(fpath, info)

print('\nDone.')
