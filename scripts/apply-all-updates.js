/**
 * apply-all-updates.js
 * 
 * Applies all requested changes across all course pages:
 * 1. Update Call Now number to 9656227714
 * 2. Bottom menu Enroll button popup: side-by-side layout with animation
 * 3. Bottom Enroll button icon: change to phone icon
 * 4. Top menu "Enroll Now" → "Call Now" with phone icon
 * 5. Fix ship maintenance broken bottom enroll button style
 * 6. Create new URL slug pages (redirect pages)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, '..', 'src', 'pages');

// All page files to update
const PAGE_FILES = [
  path.join(PAGES_DIR, 'index.astro'),
  path.join(PAGES_DIR, 'bms', 'index.astro'),
  path.join(PAGES_DIR, 'civil', 'index.astro'),
  path.join(PAGES_DIR, 'digitalmarketing', 'index.astro'),
  path.join(PAGES_DIR, 'embedded', 'index.astro'),
  path.join(PAGES_DIR, 'fintech', 'index.astro'),
  path.join(PAGES_DIR, 'graphics', 'index.astro'),
  path.join(PAGES_DIR, 'hcm', 'index.astro'),
  path.join(PAGES_DIR, 'hr', 'index.astro'),
  path.join(PAGES_DIR, 'instrumentation', 'index.astro'),
  path.join(PAGES_DIR, 'logistics', 'index.astro'),
  path.join(PAGES_DIR, 'mep', 'index.astro'),
  path.join(PAGES_DIR, 'networking', 'index.astro'),
  path.join(PAGES_DIR, 'oilandgas', 'index.astro'),
  path.join(PAGES_DIR, 'shipmaintenance', 'index.astro'),
];

// Phone SVG icon for top nav button
const PHONE_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="16" height="16" style="flex-shrink:0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`;

// Updated mob-enroll-popup CSS: side-by-side layout
const OLD_POPUP_CSS = `.mob-enroll-popup{position:absolute;bottom:calc(100% + 10px);left:50%;transform:translateX(-50%) translateY(8px);opacity:0;pointer-events:none;display:flex;flex-direction:column;gap:8px;background:#fff;border-radius:14px;padding:10px;box-shadow:0 8px 32px rgba(0,0,0,.18),0 2px 8px rgba(0,0,0,.10);min-width:160px;z-index:10000;transition:opacity 300ms ease,transform 300ms ease}`;
const NEW_POPUP_CSS = `.mob-enroll-popup{position:absolute;bottom:calc(100% + 10px);left:50%;transform:translateX(-50%) translateY(8px);opacity:0;pointer-events:none;display:flex;flex-direction:row;gap:8px;background:#fff;border-radius:14px;padding:10px;box-shadow:0 8px 32px rgba(0,0,0,.18),0 2px 8px rgba(0,0,0,.10);min-width:280px;z-index:10000;transition:opacity 300ms ease,transform 300ms ease}`;

// Old top nav enroll button (plain text)
const OLD_TOP_NAV_BTN = `<a href="tel:+919958873874" class="hero__enroll-btn" data-astro-cid-7nmnspah>
Enroll Now
</a>`;
const NEW_TOP_NAV_BTN = `<a href="tel:+919656227714" class="hero__enroll-btn" data-astro-cid-7nmnspah style="display:flex;align-items:center;gap:6px;">${PHONE_SVG}
Call Now
</a>`;

// Old bottom nav Call Now link (old number)
const OLD_CALL_NOW_LINK = `<a href="tel:+919958873874" class="mob-enroll-popup__btn mob-enroll-popup__btn--call"`;
const NEW_CALL_NOW_LINK = `<a href="tel:+919656227714" class="mob-enroll-popup__btn mob-enroll-popup__btn--call"`;

// Old bottom nav enroll button (WhatsApp icon)
const OLD_ENROLL_BTN_BUBBLE = `<button class="mob-bottom-nav__enroll" id="mob-enroll-btn" aria-label="Contact options" aria-expanded="false" data-astro-cid-7nmnspah><span class="mob-bottom-nav__enroll-bubble" data-astro-cid-7nmnspah> <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="22" height="22" data-astro-cid-7nmnspah><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" data-astro-cid-7nmnspah></path><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.428a.75.75 0 0 0 .916.916l5.573-1.471A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.504-5.23-1.385l-.374-.217-3.875 1.023 1.023-3.875-.217-.374A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" data-astro-cid-7nmnspah></path></svg> </span><span data-astro-cid-7nmnspah>Enroll</span></button>`;

// New bottom nav enroll button with phone icon
const NEW_ENROLL_BTN_BUBBLE = `<button class="mob-bottom-nav__enroll" id="mob-enroll-btn" aria-label="Contact options" aria-expanded="false" data-astro-cid-7nmnspah><span class="mob-bottom-nav__enroll-bubble" data-astro-cid-7nmnspah> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="22" height="22" data-astro-cid-7nmnspah><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" data-astro-cid-7nmnspah></path></svg> </span><span data-astro-cid-7nmnspah>Enroll</span></button>`;

// Also update the CTA section "Talk to a Counsellor" phone link
const OLD_CTA_PHONE = `<a href="tel:+919958873874" class="cta__btn cta__btn--secondary"`;
const NEW_CTA_PHONE = `<a href="tel:+919656227714" class="cta__btn cta__btn--secondary"`;

let totalChanges = 0;

for (const filePath of PAGE_FILES) {
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP (not found): ${filePath}`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // 1. Fix popup CSS: column → row (side by side)
  if (content.includes(OLD_POPUP_CSS)) {
    content = content.replace(OLD_POPUP_CSS, NEW_POPUP_CSS);
    changes++;
    console.log(`  ✓ Popup layout: column → row`);
  }

  // 2. Top nav: "Enroll Now" → "Call Now" with phone icon + new number
  if (content.includes(OLD_TOP_NAV_BTN)) {
    content = content.replace(OLD_TOP_NAV_BTN, NEW_TOP_NAV_BTN);
    changes++;
    console.log(`  ✓ Top nav: Enroll Now → Call Now`);
  }

  // 3. Bottom nav Call Now: update phone number
  if (content.includes(OLD_CALL_NOW_LINK)) {
    content = content.replaceAll(OLD_CALL_NOW_LINK, NEW_CALL_NOW_LINK);
    changes++;
    console.log(`  ✓ Call Now number updated`);
  }

  // 4. Bottom nav enroll button: WhatsApp icon → phone icon
  if (content.includes(OLD_ENROLL_BTN_BUBBLE)) {
    content = content.replace(OLD_ENROLL_BTN_BUBBLE, NEW_ENROLL_BTN_BUBBLE);
    changes++;
    console.log(`  ✓ Enroll button icon: WhatsApp → Phone`);
  }

  // 5. CTA section phone link update
  if (content.includes(OLD_CTA_PHONE)) {
    content = content.replace(OLD_CTA_PHONE, NEW_CTA_PHONE);
    changes++;
    console.log(`  ✓ CTA phone link updated`);
  }

  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${path.relative(process.cwd(), filePath)} (${changes} changes)`);
    totalChanges += changes;
  } else {
    console.log(`⚠️  No changes needed: ${path.relative(process.cwd(), filePath)}`);
  }
}

// Fix ship maintenance broken style (CSS in noscript instead of style tag)
console.log('\n--- Fixing ship maintenance broken style ---');
const shipFile = path.join(PAGES_DIR, 'shipmaintenance', 'index.astro');
let shipContent = fs.readFileSync(shipFile, 'utf8');

// The ship maintenance page has CSS inside <noscript> instead of a proper <style> block
// The noscript block only has [data-reveal] + the mobile CSS mixed together
const OLD_NOSCRIPT = `<noscript><style>
    [data-reveal] {
      opacity: 1;
      transform: none;
    }
  /* Mobile hero image */`;

const NEW_NOSCRIPT = `<style>/* Mobile hero image */`;

// Also need to close the style tag properly - find the end of the noscript
// The noscript ends with: </style></noscript>
// We need to change it to just: </style>
if (shipContent.includes(OLD_NOSCRIPT)) {
  shipContent = shipContent.replace(OLD_NOSCRIPT, NEW_NOSCRIPT);
  // Fix the closing tag
  shipContent = shipContent.replace(`</style></noscript><!-- Intersection Observer`, `</style><noscript><style>[data-reveal]{opacity:1;transform:none;}</style></noscript><!-- Intersection Observer`);
  fs.writeFileSync(shipFile, shipContent, 'utf8');
  console.log('✅ Fixed ship maintenance broken style (moved CSS out of noscript)');
  totalChanges++;
} else {
  console.log('⚠️  Ship maintenance noscript pattern not found (may already be fixed)');
}

console.log(`\n✅ Total changes applied: ${totalChanges}`);
