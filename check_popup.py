content = open(r'c:\Users\SMEClLABS\Documents\projects\2026\may\may-landing-mobileapp\dist\graphics\index.html', encoding='utf-8').read()

import re

# Find ALL CSS rules mentioning vid-popup
for m in re.finditer(r'[^}]*vid-popup[^{]*\{[^}]*\}', content):
    print(m.group())
    print('---')
