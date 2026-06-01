import os, re

dist = r'c:\Users\SMEClLABS\Documents\projects\2026\may\may-landing-mobileapp\dist'
pages = ['index', 'bms', 'civil', 'digitalmarketing', 'embedded', 'fintech',
         'graphics', 'hcm', 'hr', 'instrumentation', 'logistics', 'mep',
         'networking', 'oilandgas', 'shipmaintenance']

print(f'{"page":22} {"css":5} {"popup":6} {"js":5} {"img":5}')
print('-' * 50)
all_ok = True
for p in pages:
    path = os.path.join(dist, 'index.html') if p == 'index' else os.path.join(dist, p, 'index.html')
    c = open(path, encoding='utf-8').read()
    css   = '.vid-popup.vid-popup--visible' in c
    popup = 'id="vid-popup"' in c
    js    = 'openPopup' in c
    img   = 'mobile-hero/' in c
    ok = css and popup and js and img
    if not ok:
        all_ok = False
    mark = 'OK' if ok else 'FAIL'
    print(f'{p:22} {str(css):5} {str(popup):6} {str(js):5} {str(img):5}  {mark}')

print()
print('ALL PASS' if all_ok else 'SOME FAILURES - check above')
