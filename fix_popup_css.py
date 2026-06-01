import os, re

base = r'c:\Users\SMEClLABS\Documents\projects\2026\may\may-landing-mobileapp\src\pages'

pages = [
    'bms', 'civil', 'digitalmarketing', 'embedded', 'fintech',
    'graphics', 'hcm', 'hr', 'instrumentation', 'logistics',
    'mep', 'networking', 'oilandgas', 'shipmaintenance'
]

# The home page
home = r'c:\Users\SMEClLABS\Documents\projects\2026\may\may-landing-mobileapp\src\pages\index.astro'

# Video IDs per page
video_ids = {
    'bms': 'pdkjc_CfYzA', 'civil': 'pdkjc_CfYzA', 'digitalmarketing': 'pdkjc_CfYzA',
    'embedded': 'pdkjc_CfYzA', 'fintech': 'wA_NJ2uZeLo', 'graphics': 'pdkjc_CfYzA',
    'hcm': 'pdkjc_CfYzA', 'hr': 'pdkjc_CfYzA', 'instrumentation': '-1tR1sn4xjU',
    'logistics': 'pdkjc_CfYzA', 'mep': 'fh42MGyFulI', 'networking': 'pdkjc_CfYzA',
    'oilandgas': 'wA_NJ2uZeLo', 'shipmaintenance': 'wA_NJ2uZeLo',
    'index': 'wA_NJ2uZeLo',
}

# Mobile hero images per page
mobile_imgs = {
    'bms': 'bms', 'civil': 'civil', 'digitalmarketing': 'digital-marketing',
    'embedded': 'embedded', 'fintech': 'fintech', 'graphics': 'graphics',
    'hcm': 'hcm', 'hr': 'automation', 'instrumentation': 'instrumentation',
    'logistics': 'logistics', 'mep': 'mep', 'networking': 'networking',
    'oilandgas': 'oilandgas', 'shipmaintenance': 'shipmaintenance',
    'index': 'automation',
}

# Page titles
titles = {
    'bms': 'BMS', 'civil': 'Civil', 'digitalmarketing': 'Digital Marketing',
    'embedded': 'Embedded', 'fintech': 'Fintech', 'graphics': 'Graphic Design',
    'hcm': 'HCM', 'hr': 'HR', 'instrumentation': 'Instrumentation',
    'logistics': 'Logistics', 'mep': 'MEP', 'networking': 'Networking',
    'oilandgas': 'Oil and Gas', 'shipmaintenance': 'Ship Maintenance',
    'index': 'Industrial Automation',
}

# NEW unscoped CSS for popup (no [data-astro-cid-...] attribute selectors)
NEW_POPUP_CSS = (
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

# Old scoped CSS patterns to replace
OLD_CSS_PAT = re.compile(
    r'/\* Mobile hero image \*/.*?@media\(min-width:769px\)\{\.vid-popup\[data-astro-cid-\w+\]\{display:none\}\}',
    re.DOTALL
)

# Also handle old scoped version without the mobile hero comment
OLD_CSS_PAT2 = re.compile(
    r'/\* Video popup \*/.*?@media\(min-width:769px\)\{\.vid-popup\[data-astro-cid-\w+\]\{display:none\}\}',
    re.DOTALL
)

CSS_ANCHOR = (
    '@media(prefers-reduced-motion:reduce)'
    '{.tools__track[data-astro-cid-mt6x2bs4]{animation:none;flex-wrap:wrap;justify-content:center;width:100%}'
    '.tools__track-wrap[data-astro-cid-mt6x2bs4]{-webkit-mask-image:none;mask-image:none}}'
)

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
    ' <!-- Fixed bottom nav bar -->'
)

VID_PAT = re.compile(
    r'<!-- YouTube video — mobile only --> <div class="hero__video-mobile" data-astro-cid-7nmnspah>.*?</div> </div> </div>',
    re.DOTALL
)

SCRIPT_PAT = re.compile(
    r'(document\.querySelectorAll\("\.hero__video-cover"\)\.forEach\(e=>\{e\.addEventListener\("click",\(\)=>\{.*?\}\)\}\);)',
    re.DOTALL
)

# Old popup JS pattern to remove (will be replaced)
OLD_POPUP_JS_PAT = re.compile(
    r'\(function\(\)\{const videoId="[^"]+";.*?setTimeout\(openPopup,5000\);\}\)\(\);',
    re.DOTALL
)

BT = chr(96)

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

def process_file(fpath, page_key):
    vid_id = video_ids[page_key]
    title = titles[page_key]
    img = mobile_imgs[page_key]

    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    changed = False

    # 1. Fix CSS: replace old scoped CSS with new unscoped CSS
    m = OLD_CSS_PAT.search(content)
    if m:
        content = content[:m.start()] + NEW_POPUP_CSS + content[m.end():]
        changed = True
        print(f'  {page_key}: CSS replaced (with mobile hero comment)')
    else:
        m2 = OLD_CSS_PAT2.search(content)
        if m2:
            content = content[:m2.start()] + NEW_POPUP_CSS + content[m2.end():]
            changed = True
            print(f'  {page_key}: CSS replaced (video popup only)')
        elif 'vid-popup' not in content:
            # Add CSS fresh
            if CSS_ANCHOR in content:
                content = content.replace(CSS_ANCHOR, CSS_ANCHOR + NEW_POPUP_CSS)
                changed = True
                print(f'  {page_key}: CSS added fresh')

    # 2. Replace YouTube video-mobile section with mobile hero image (if not done)
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
        new_content = VID_PAT.sub(img_repl, content)
        if new_content != content:
            content = new_content
            changed = True
            print(f'  {page_key}: video section replaced')

    # 3. Fix popup HTML: remove old scoped data-astro-cid attributes from popup elements
    old_popup_html = (
        ' <!-- Video popup — bottom-left corner, appears after 5s on mobile -->'
        ' <div id="vid-popup" class="vid-popup" aria-label="Watch our program video" data-astro-cid-7nmnspah>'
    )
    if old_popup_html in content:
        # Replace the whole old popup HTML block with clean version
        old_full = re.search(
            r' <!-- Video popup.*?</div> </div> <!-- Fixed bottom nav bar -->',
            content, re.DOTALL
        )
        if old_full:
            content = content[:old_full.start()] + POPUP_HTML + content[old_full.end():]
            changed = True
            print(f'  {page_key}: popup HTML cleaned (removed scoped attrs)')
    elif ' <!-- Fixed bottom nav bar -->' in content and 'vid-popup' not in content:
        content = content.replace(' <!-- Fixed bottom nav bar -->', POPUP_HTML)
        changed = True
        print(f'  {page_key}: popup HTML added fresh')

    # 4. Fix/replace popup JS
    # First remove old popup JS if present
    m_old_js = OLD_POPUP_JS_PAT.search(content)
    new_js = make_popup_js(vid_id, title)
    if m_old_js:
        content = content[:m_old_js.start()] + new_js + content[m_old_js.end():]
        changed = True
        print(f'  {page_key}: popup JS replaced')
    elif 'openPopup' not in content:
        m_script = SCRIPT_PAT.search(content)
        if m_script:
            old_script = m_script.group(1)
            content = content.replace(old_script, old_script + new_js, 1)
            changed = True
            print(f'  {page_key}: popup JS added')

    if changed:
        with open(fpath, 'w', encoding='utf-8', newline='') as f:
            f.write(content)
        print(f'DONE: {page_key}')
    else:
        print(f'SKIP (no changes): {page_key}')

# Process all course pages
for page in pages:
    fpath = os.path.join(base, page, 'index.astro')
    if os.path.exists(fpath):
        process_file(fpath, page)
    else:
        print(f'MISSING: {page}')

# Process home page
print('\n--- Home page ---')
process_file(home, 'index')

print('\nAll done.')
