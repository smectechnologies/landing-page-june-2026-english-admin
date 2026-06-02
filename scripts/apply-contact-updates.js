import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');

const FILES = [
  'src/pages/index.astro',
  'src/pages/bms/index.astro',
  'src/pages/civil/index.astro',
  'src/pages/digitalmarketing/index.astro',
  'src/pages/embedded/index.astro',
  'src/pages/fintech/index.astro',
  'src/pages/graphics/index.astro',
  'src/pages/hcm/index.astro',
  'src/pages/hr/index.astro',
  'src/pages/instrumentation/index.astro',
  'src/pages/logistics/index.astro',
  'src/pages/mep/index.astro',
  'src/pages/networking/index.astro',
  'src/pages/oilandgas/index.astro',
  'src/pages/shipmaintenance/index.astro',
];

const POPUP_CSS =
  '.mob-enroll-wrap{position:relative;display:flex;align-items:center;justify-content:center}' +
  '.mob-enroll-popup{position:absolute;bottom:calc(100% + 10px);left:50%;transform:translateX(-50%) translateY(8px);opacity:0;pointer-events:none;display:flex;flex-direction:column;gap:8px;background:#fff;border-radius:14px;padding:10px;box-shadow:0 8px 32px rgba(0,0,0,.18),0 2px 8px rgba(0,0,0,.10);min-width:160px;z-index:10000;transition:opacity 300ms ease,transform 300ms ease}' +
  '.mob-enroll-popup.is-open{opacity:1;transform:translateX(-50%) translateY(0);pointer-events:auto}' +
  '.mob-enroll-popup__btn{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:10px;font-size:.875rem;font-weight:600;text-decoration:none;white-space:nowrap}' +
  '.mob-enroll-popup__btn--call{background:linear-gradient(135deg,#2d318f,#1565c0);color:#fff}' +
  '.mob-enroll-popup__btn--wa{background:#25d366;color:#fff}' +
  '.mob-bottom-nav__enroll[aria-expanded="true"] .mob-bottom-nav__enroll-bubble{background:linear-gradient(135deg,#1565c0,#0d9488)}' +
  '@media (prefers-reduced-motion:reduce){.mob-enroll-popup{transition:none}}';

const POPUP_JS =
  "(function(){var enrollBtn=document.getElementById('mob-enroll-btn');" +
  "var enrollPopup=document.getElementById('mob-enroll-popup');" +
  "if(!enrollBtn||!enrollPopup)return;" +
  "function openPopup(){enrollPopup.classList.add('is-open');enrollPopup.setAttribute('aria-hidden','false');enrollBtn.setAttribute('aria-expanded','true');}" +
  "function closePopup(){enrollPopup.classList.remove('is-open');enrollPopup.setAttribute('aria-hidden','true');enrollBtn.setAttribute('aria-expanded','false');}" +
  "enrollBtn.addEventListener('click',function(e){e.stopPropagation();enrollPopup.classList.contains('is-open')?closePopup():openPopup();});" +
  "document.addEventListener('click',function(e){if(enrollPopup.classList.contains('is-open')&&!enrollPopup.contains(e.target)&&e.target!==enrollBtn){closePopup();}});" +
  "enrollPopup.addEventListener('click',function(e){e.stopPropagation();});})();";

let successCount = 0;
let failCount = 0;

for (const relPath of FILES) {
  const filePath = path.join(ROOT, relPath);
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // ── Change 1: Replace old WA number with new WA number ──────────────────
    content = content.replaceAll('wa.me/919995879404', 'wa.me/918289887322');

    // ── Change 2: Update hero__enroll-btn anchor ─────────────────────────────
    // After Change 1, the href already has the new number. Match the full
    // attribute block (href + class + target + rel) and replace with tel link.
    content = content.replace(
      /href="https:\/\/wa\.me\/918289887322[^"]*" class="hero__enroll-btn" target="_blank" rel="noopener noreferrer"/,
      'href="tel:+919958873874" class="hero__enroll-btn"'
    );
    // Replace inner text "Enroll Now" scoped to the hero__enroll-btn anchor
    content = content.replace(
      /(class="hero__enroll-btn"[^>]*>)Enroll Now</,
      '$1Call Now<'
    );

    // ── Change 3: Replace Centre Enroll CTA block ────────────────────────────
    const ctaRegex = /<!-- Centre Enroll CTA --> ?<a ([^>]*)class="mob-bottom-nav__enroll"([^>]*)>([\s\S]*?)<\/a>/;
    const ctaMatch = content.match(ctaRegex);

    if (!ctaMatch) {
      console.error(`✗ ${relPath}: Could not find Centre Enroll CTA block`);
      failCount++;
      continue;
    }

    const fullAttrsBefore = ctaMatch[1]; // attributes before class=
    const fullAttrsAfter  = ctaMatch[2]; // attributes after class=
    const innerContent    = ctaMatch[3];

    // Extract data-astro-cid-XXXX value from the <a> tag attributes
    const cidMatch = (fullAttrsBefore + fullAttrsAfter).match(/data-astro-cid-(\S+)/);
    if (!cidMatch) {
      console.error(`✗ ${relPath}: Could not extract data-astro-cid value`);
      failCount++;
      continue;
    }
    const cid = 'data-astro-cid-' + cidMatch[1];

    // Extract the ?text=... query string from the href in the matched <a> tag
    const hrefMatch = (fullAttrsBefore + fullAttrsAfter).match(/href="https:\/\/wa\.me\/918289887322(\?[^"]*)"/);
    const waText = hrefMatch ? hrefMatch[1] : '';

    // Extract the bubble span (with its SVG) from the inner content
    const bubbleMatch = innerContent.match(/<span class="mob-bottom-nav__enroll-bubble"[\s\S]*?<\/span>/);
    if (!bubbleMatch) {
      console.error(`✗ ${relPath}: Could not extract bubble span`);
      failCount++;
      continue;
    }
    const bubbleContent = bubbleMatch[0];

    // Build the replacement HTML
    const replacement =
      `<!-- Centre Enroll CTA --> ` +
      `<div class="mob-enroll-wrap" ${cid}>` +
        `<div class="mob-enroll-popup" id="mob-enroll-popup" role="dialog" aria-label="Contact options" aria-hidden="true" ${cid}>` +
          `<a href="tel:+919958873874" class="mob-enroll-popup__btn mob-enroll-popup__btn--call" ${cid}>` +
            `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="18" height="18" ${cid}>` +
              `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.32 6.85 19.79 19.79 0 0 1 .25 -1.82A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" ${cid}></path>` +
            `</svg>` +
            `Call Now` +
          `</a>` +
          `<a href="https://wa.me/918289887322${waText}" class="mob-enroll-popup__btn mob-enroll-popup__btn--wa" target="_blank" rel="noopener noreferrer" ${cid}>` +
            `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="18" height="18" ${cid}>` +
              `<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" ${cid}></path>` +
              `<path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.428a.75.75 0 0 0 .916.916l5.573-1.471A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.504-5.23-1.385l-.374-.217-3.875 1.023 1.023-3.875-.217-.374A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" ${cid}></path>` +
            `</svg>` +
            `WhatsApp` +
          `</a>` +
        `</div>` +
        `<button class="mob-bottom-nav__enroll" id="mob-enroll-btn" aria-label="Contact options" aria-expanded="false" ${cid}>` +
          `${bubbleContent}` +
          `<span ${cid}>Enroll</span>` +
        `</button>` +
      `</div>`;

    content = content.replace(ctaRegex, replacement);

    // ── Popup CSS: insert before last </style> ───────────────────────────────
    const lastStyleClose = content.lastIndexOf('</style>');
    if (lastStyleClose === -1) {
      console.error(`✗ ${relPath}: Could not find </style> tag`);
      failCount++;
      continue;
    }
    content = content.slice(0, lastStyleClose) + POPUP_CSS + content.slice(lastStyleClose);

    // ── Popup JS: insert before </script> of the mob-overlay script block ────
    // Find the script block that contains 'mob-overlay'
    const scriptBlockRegex = /<script[^>]*>[\s\S]*?<\/script>/g;
    let scriptMatch;
    let mobOverlayScriptEnd = -1;
    while ((scriptMatch = scriptBlockRegex.exec(content)) !== null) {
      if (scriptMatch[0].includes('mob-overlay')) {
        // Position of </script> within this match
        mobOverlayScriptEnd = scriptMatch.index + scriptMatch[0].lastIndexOf('</script>');
        break;
      }
    }

    if (mobOverlayScriptEnd === -1) {
      console.error(`✗ ${relPath}: Could not find mob-overlay script block`);
      failCount++;
      continue;
    }

    content =
      content.slice(0, mobOverlayScriptEnd) +
      POPUP_JS +
      content.slice(mobOverlayScriptEnd);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ ${relPath}`);
    successCount++;
  } catch (err) {
    console.error(`✗ ${relPath}: ${err.message}`);
    failCount++;
  }
}

console.log(`\nDone: ${successCount} updated, ${failCount} failed.`);
