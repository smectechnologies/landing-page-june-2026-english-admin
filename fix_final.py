import os, re

base = r'c:\Users\SMEClLABS\Documents\projects\2026\may\may-landing-mobileapp\src\pages'

pages = [
    'bms', 'civil', 'digitalmarketing', 'embedded', 'fintech',
    'hcm', 'hr', 'instrumentation', 'logistics',
    'mep', 'networking', 'oilandgas', 'shipmaintenance'
]
home = os.path.join(base, 'index.astro')

video_ids = {
    'bms': 'pdkjc_CfYzA', 'civil': 'pdkjc_CfYzA', 'digitalmarketing': 'pdkjc_CfYzA',
    'embedded': 'pdkjc_CfYzA', 'fintech': 'wA_NJ2uZeLo',
    'hcm': 'pdkjc_CfYzA', 'hr': 'pdkjc_CfYzA', 'instrumentation': '-1tR1sn4xjU',
    'logistics': 'pdkjc_CfYzA', 'mep': 'fh42MGyFulI', 'networking': 'pdkjc_CfYzA',
    'oilandgas': 'wA_NJ2uZeLo', 'shipmaintenance': 'wA_NJ2uZeLo',
    'index': 'wA_NJ2uZeLo',
}
titles = {
    'bms': 'BMS', 'civil': 'Civil', 'digitalmarketing': 'Digital Marketing',
    'embedded': 'Embedded', 'fintech': 'Fintech',
    'hcm': 'HCM', 'hr': 'HR', 'instrumentation': 'Instrumentation',
    'logistics': 'Logistics', 'mep': 'MEP', 'networking': 'Networking',
    'oilandgas': 'Oil and Gas', 'shipmaintenance': 'Ship Maintenance',
    'index': 'Industrial Automation',
}
mobile_imgs = {
    'bms': 'bms', 'civil': 'civil', 'digitalmarketing': 'digital-marketing',
    'embedded': 'embedded', 'fintech': 'fintech',
    'hcm': 'hcm', 'hr': 'automation', 'instrumentation': 'instrumentation',
    'logistics': 'logistics', 'mep': 'mep', 'networking': 'networking',
    'oilandgas': 'oilandgas', 'shipmaintenance': 'shipmaintenance',
    'index': 'automation',
}

# Unscoped popup CSS block
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

# CSS anchor (end of the tools CSS block)
CSS_ANCHOR = (
    '@media(prefers-reduced-motion:reduce)'
    '{.tools__track[data-astro-cid-mt6x2bs4]{animation:none;flex-wrap:wrap;justify-content:center;width:100%}'
    '.tools__track-wrap[data-astro-cid-mt6x2bs4]{-webkit-mask-image:none;mask-image:none}}'
)

# Popup HTML (no data-astro-cid attributes)
POPUP_HTML = (
    ' <!-- Video popup — bottom-left corner, appears after 5s on mobile -->'
    ' <div id="vid-popup" class="vid-popup" aria-label="Watch our program video">'
    ' <button id="vid-popup-close" class="vid-popup__close" aria-label="Close video" type="button">'
    ' <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"'
    ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    '<line x1="18" y1="6" x2="6" y2="18"></line>'
    '<line x1="6" y1="6" x2="18" y2="18"></line></svg>'
    ' </button>'
    ' <div id="vid-popup-container" class="vid-popup__container"></div>'
    ' </div>'
)

# Old scoped popup CSS patterns
OLD_CSS_SCOPED = re.compile(
    r'/\* (?:Mobile hero image|Video popup) \*/.*?@media\(min-width:769px\)\{\.vid-popup(?:\[data-astro-cid-\w+\])?\{display:none\}\}',
    re.DOTALL
)

# Old popup JS pattern
OLD_POPUP_JS = re.compile(
    r'\(function\(\)\{const videoId="[^"]+";.*?setTimeout\(openPopup,5000\);\}\)\(\);',
    re.DOTALL
)

# Script forEach pattern
SCRIPT_PAT = re.compile(
    r'(document\.querySelectorAll\("\.hero__video-cover"\)\.forEach\(e=>\{e\.addEventListener\("click",\(\)=>\{.*?\}\)\}\);)',
    re.DOTALL
)

# YouTube video mobile section
VID_PAT = re.compile(
    r'<!-- YouTube video — mobile only --> <div class="hero__video-mobile"[^>]*>.*?</div> </div> </div>',
    re.DOTALL
)

def make_popup_js(vid_id, title):
    return (
        f'(function(){{'
        f'const videoId="{vid_id}";'
        'const popup=document.getElementById("vid-popup");'
        'const closeBtn=document.getElementById("vid-popup-close");'
        'const container=document.getElementById("vid-popup-container");'
        'if(!popup||!closeBtn||!container)return;'
        'function openPopup(){'
        'popup.classList.add("vid-popup--visible");'
        'const iframe=document.createElement("iframe");'
        f'iframe.src=\\`https://www.youtube.com/embed/{vid_id}?rel=0&modestbranding=1&autoplay=1\\`;'
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

def process(fpath, key):
    vid_id = video_ids[key]
    title = titles[key]
    img = mobile_imgs[key]

    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    changed = False

    # 1. Fix/add CSS
    m_css = OLD_CSS_SCOPED.search(content)
    if m_css:
        # Replace old (possibly scoped) CSS with new unscoped CSS
        content = content[:m_css.start()] + POPUP_CSS + content[m_css.end():]
        changed = True
        print(f'  {key}: CSS replaced')
    elif 'vid-popup' not in content or '.vid-popup{' not in content:
        # Add CSS after the tools CSS anchor
        if CSS_ANCHOR in content:
            content = content.replace(CSS_ANCHOR, CSS_ANCHOR + POPUP_CSS, 1)
            changed = True
            print(f'  {key}: CSS added')

    # 2. Replace YouTube video section with mobile hero image
    if '<!-- YouTube video — mobile only -->' in content:
        img_repl = (
            '<!-- Mobile hero image (replaces video on mobile) -->'
            ' <div class="hero__video-mobile" data-astro-cid-7nmnspah>'
            ' <div class="hero__mobile-img-wrap">'
            f' <img src="${{base}}/mobile-hero/{img}.webp"'
            f' alt="{title} at SMECLabs"'
            ' class="hero__mobile-hero-img" width="640" height="360"'
            ' loading="eager" decoding="async">'
            ' </div> </div>'
        )
        new_c = VID_PAT.sub(img_repl, content)
        if new_c != content:
            content = new_c
            changed = True
            print(f'  {key}: video section replaced')

    # 3. Add/fix popup HTML div
    # Remove any existing popup HTML (with or without scoped attrs) and re-add cleanly
    old_popup_html_pat = re.compile(
        r' <!-- Video popup.*?</div> </div>(?= <!-- Fixed bottom nav bar -->)',
        re.DOTALL
    )
    m_html = old_popup_html_pat.search(content)
    if m_html:
        content = content[:m_html.start()] + POPUP_HTML + content[m_html.end():]
        changed = True
        print(f'  {key}: popup HTML refreshed')
    else:
        # Try to insert before "Fixed bottom nav bar" (with or without leading space)
        for anchor in [' <!-- Fixed bottom nav bar -->', '<!-- Fixed bottom nav bar -->']:
            if anchor in content:
                content = content.replace(anchor, POPUP_HTML + anchor, 1)
                changed = True
                print(f'  {key}: popup HTML inserted')
                break

    # 4. Fix/add popup JS
    m_old_js = OLD_POPUP_JS.search(content)
    new_js = make_popup_js(vid_id, title)
    if m_old_js:
        content = content[:m_old_js.start()] + new_js + content[m_old_js.end():]
        changed = True
        print(f'  {key}: popup JS replaced')
    elif 'openPopup' not in content:
        m_script = SCRIPT_PAT.search(content)
        if m_script:
            old_s = m_script.group(1)
            content = content.replace(old_s, old_s + new_js, 1)
            changed = True
            print(f'  {key}: popup JS added')

    if changed:
        with open(fpath, 'w', encoding='utf-8', newline='') as f:
            f.write(content)
        print(f'DONE: {key}')
    else:
        print(f'SKIP: {key}')

for page in pages:
    fpath = os.path.join(base, page, 'index.astro')
    process(fpath, page)

print('\n--- Home page ---')
process(home, 'index')
print('\nAll done.')
