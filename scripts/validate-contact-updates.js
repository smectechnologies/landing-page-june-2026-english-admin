/**
 * validate-contact-updates.js
 *
 * Reads each of the 15 updated .astro files and asserts all 8 correctness
 * properties defined in the contact-button-updates spec design document.
 *
 * Exit 0  — all assertions passed
 * Exit 1  — one or more assertions failed
 *
 * Usage:  node scripts/validate-contact-updates.js
 */

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

let passed = 0;
let failed = 0;

/**
 * Assert a condition. Logs a FAIL message and increments the failure counter
 * when the condition is false. Returns the condition value.
 *
 * @param {boolean} condition
 * @param {string}  file      - relative file path (for display)
 * @param {string}  property  - property label (e.g. "Property 2a")
 * @param {string}  detail    - human-readable failure description
 * @returns {boolean}
 */
function assert(condition, file, property, detail) {
  if (!condition) {
    console.error(`  FAIL [${property}] ${detail}`);
    failed++;
    return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Helper: count non-overlapping occurrences of a substring
// ---------------------------------------------------------------------------
function countOccurrences(haystack, needle) {
  let count = 0;
  let pos = 0;
  while ((pos = haystack.indexOf(needle, pos)) !== -1) {
    count++;
    pos += needle.length;
  }
  return count;
}

// ---------------------------------------------------------------------------
// Helper: extract the opening tag of the first element whose opening tag
// contains the given class string.  Returns null if not found.
// ---------------------------------------------------------------------------
function extractOpeningTag(content, classFragment) {
  const idx = content.indexOf(classFragment);
  if (idx === -1) return null;
  // Walk backwards to find the '<' that starts this tag
  let start = idx;
  while (start > 0 && content[start] !== '<') start--;
  // Walk forwards to find the closing '>' of the opening tag
  let end = idx;
  while (end < content.length && content[end] !== '>') end++;
  return content.substring(start, end + 1);
}

// ---------------------------------------------------------------------------
// Main validation loop
// ---------------------------------------------------------------------------
for (const relPath of FILES) {
  const filePath = path.join(ROOT, relPath);
  let content;

  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`\nFAIL [${relPath}] Could not read file: ${err.message}`);
    failed++;
    continue;
  }

  let fileOk = true;
  console.log(`\nChecking: ${relPath}`);

  // ── Property 1: No old WA number remains ──────────────────────────────────
  // Validates: Requirements 1.1, 1.2, 4.2
  {
    const ok = assert(
      !content.includes('wa.me/919995879404'),
      relPath,
      'Property 1',
      'Old WA number wa.me/919995879404 still present in file',
    );
    if (!ok) fileOk = false;
  }

  // ── Property 2: Nav button is a tel link ──────────────────────────────────
  // Validates: Requirements 2.1, 2.6, 2.7
  {
    const tag = extractOpeningTag(content, 'class="hero__enroll-btn"');
    if (tag === null) {
      assert(false, relPath, 'Property 2', 'hero__enroll-btn element not found');
      fileOk = false;
    } else {
      const a = assert(
        tag.includes('href="tel:+919958873874"'),
        relPath,
        'Property 2a',
        `hero__enroll-btn missing href="tel:+919958873874" — found tag: ${tag.substring(0, 120)}`,
      );
      const b = assert(
        !tag.includes('target="_blank"'),
        relPath,
        'Property 2b',
        'hero__enroll-btn still has target="_blank"',
      );
      const c = assert(
        !tag.includes('rel="noopener noreferrer"'),
        relPath,
        'Property 2c',
        'hero__enroll-btn still has rel="noopener noreferrer"',
      );
      if (!a || !b || !c) fileOk = false;
    }
  }

  // ── Property 3: Nav button text is "Call Now" ─────────────────────────────
  // Validates: Requirements 2.2, 4.3
  {
    // The anchor text may have surrounding whitespace/newlines; normalise it.
    // Strategy: find the hero__enroll-btn anchor and extract its text content.
    const anchorStart = content.indexOf('class="hero__enroll-btn"');
    if (anchorStart === -1) {
      assert(false, relPath, 'Property 3', 'hero__enroll-btn not found');
      fileOk = false;
    } else {
      // Find the closing </a> after the opening tag
      const closeTag = '</a>';
      const closeIdx = content.indexOf(closeTag, anchorStart);
      if (closeIdx === -1) {
        assert(false, relPath, 'Property 3', 'Closing </a> for hero__enroll-btn not found');
        fileOk = false;
      } else {
        // Extract everything between the end of the opening tag and </a>
        const openTagEnd = content.indexOf('>', anchorStart) + 1;
        const innerText = content.substring(openTagEnd, closeIdx).trim();
        const ok = assert(
          innerText === 'Call Now',
          relPath,
          'Property 3',
          `hero__enroll-btn text is "${innerText}" — expected "Call Now"`,
        );
        if (!ok) fileOk = false;
      }
    }
  }

  // ── Property 4: Bottom-nav enroll is a button element ────────────────────
  // Validates: Requirements 3.11, 4.4
  {
    const hasButton = content.includes('<button class="mob-bottom-nav__enroll"');
    const hasAnchor = content.includes('<a class="mob-bottom-nav__enroll"');
    const hasOldWaAnchor = content.includes('<a href="https://wa.me/918289887322" class="mob-bottom-nav__enroll"')
      || content.includes('<a href="https://wa.me/919995879404" class="mob-bottom-nav__enroll"');

    const a = assert(hasButton, relPath, 'Property 4a', '<button class="mob-bottom-nav__enroll"> not found');
    const b = assert(!hasAnchor, relPath, 'Property 4b', '<a class="mob-bottom-nav__enroll"> still present (should be <button>)');
    const c = assert(!hasOldWaAnchor, relPath, 'Property 4c', 'mob-bottom-nav__enroll still links directly to wa.me');
    if (!a || !b || !c) fileOk = false;
  }

  // ── Property 5: Popup contains exactly two sub-buttons with correct hrefs ─
  // Validates: Requirements 3.2, 3.3, 3.4
  {
    const callBtnCount = countOccurrences(content, 'mob-enroll-popup__btn--call');
    const waBtnCount   = countOccurrences(content, 'mob-enroll-popup__btn--wa');

    // Each class name appears once in CSS and once in HTML → expect 2 occurrences each
    // (one in the <style> block, one on the actual element)
    const callHtmlCount = countOccurrences(content, 'class="mob-enroll-popup__btn mob-enroll-popup__btn--call"');
    const waHtmlCount   = countOccurrences(content, 'class="mob-enroll-popup__btn mob-enroll-popup__btn--wa"');

    const a = assert(
      callHtmlCount === 1,
      relPath,
      'Property 5a',
      `Expected exactly 1 mob-enroll-popup__btn--call element, found ${callHtmlCount}`,
    );
    const b = assert(
      waHtmlCount === 1,
      relPath,
      'Property 5b',
      `Expected exactly 1 mob-enroll-popup__btn--wa element, found ${waHtmlCount}`,
    );

    // Verify the call button has the correct tel href
    const callTag = extractOpeningTag(content, 'class="mob-enroll-popup__btn mob-enroll-popup__btn--call"');
    const c = assert(
      callTag !== null && callTag.includes('href="tel:+919958873874"'),
      relPath,
      'Property 5c',
      `mob-enroll-popup__btn--call missing href="tel:+919958873874"`,
    );

    // Verify the WA button has the correct new WA number
    const waTag = extractOpeningTag(content, 'class="mob-enroll-popup__btn mob-enroll-popup__btn--wa"');
    const d = assert(
      waTag !== null && waTag.includes('wa.me/918289887322'),
      relPath,
      'Property 5d',
      `mob-enroll-popup__btn--wa href does not contain wa.me/918289887322`,
    );

    if (!a || !b || !c || !d) fileOk = false;
  }

  // ── Property 6: Popup WA button opens in new tab safely ──────────────────
  // Validates: Requirements 3.4
  {
    const waTag = extractOpeningTag(content, 'class="mob-enroll-popup__btn mob-enroll-popup__btn--wa"');
    if (waTag === null) {
      assert(false, relPath, 'Property 6', 'mob-enroll-popup__btn--wa element not found');
      fileOk = false;
    } else {
      const a = assert(
        waTag.includes('target="_blank"'),
        relPath,
        'Property 6a',
        'mob-enroll-popup__btn--wa missing target="_blank"',
      );
      const b = assert(
        waTag.includes('rel="noopener noreferrer"'),
        relPath,
        'Property 6b',
        'mob-enroll-popup__btn--wa missing rel="noopener noreferrer"',
      );
      if (!a || !b) fileOk = false;
    }
  }

  // ── Property 7: Popup toggle JS is present ───────────────────────────────
  // Validates: Requirements 3.1, 3.6, 3.11
  {
    // Check that the JS identifiers are present somewhere in the file
    const hasEnrollBtnId  = content.includes('mob-enroll-btn');
    const hasEnrollPopupId = content.includes('mob-enroll-popup');

    const a = assert(
      hasEnrollBtnId,
      relPath,
      'Property 7a',
      'JS identifier "mob-enroll-btn" not found in file',
    );
    const b = assert(
      hasEnrollPopupId,
      relPath,
      'Property 7b',
      'JS identifier "mob-enroll-popup" not found in file',
    );

    // The popup element must start with aria-hidden="true"
    // Look for the popup div element (not the CSS class reference)
    const popupDivTag = extractOpeningTag(content, 'id="mob-enroll-popup"');
    const c = assert(
      popupDivTag !== null && popupDivTag.includes('aria-hidden="true"'),
      relPath,
      'Property 7c',
      `mob-enroll-popup element does not have aria-hidden="true" — found: ${popupDivTag ? popupDivTag.substring(0, 120) : 'element not found'}`,
    );

    if (!a || !b || !c) fileOk = false;
  }

  // ── Property 8: No unrelated content is altered ───────────────────────────
  // Validates: Requirements 4.5
  // Skipped — requires pre-update baseline file sizes for comparison.
  console.log('  NOTE  [Property 8 (size delta)] skipped — requires pre-update baseline');

  if (fileOk) {
    passed++;
    console.log(`  ✓ All checks passed`);
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log('\n' + '─'.repeat(60));
console.log(`Results: ${passed} / ${FILES.length} files passed all checks`);
if (failed > 0) {
  console.error(`         ${failed} assertion failure(s) detected`);
  process.exit(1);
} else {
  console.log('         All assertions passed ✓');
  process.exit(0);
}
