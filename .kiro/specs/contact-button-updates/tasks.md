# Implementation Plan: contact-button-updates

## Overview

Apply three coordinated string-replacement edits uniformly across all 15 `.astro` pages under `src/pages/`. Changes are applied in order per file: (1) WhatsApp number replacement, (2) top-nav "Call Now" conversion, (3) bottom-nav popup replacement with inline CSS and JS. A Node.js script drives all replacements; a separate validation script asserts the correctness properties afterwards.

## Tasks

- [x] 1. Create the per-file replacement script
  - [x] 1.1 Write `scripts/apply-contact-updates.js`
    - Create a Node.js script that reads each of the 15 target `.astro` files, applies the three changes in order, and writes the result back
    - Define the list of 15 file paths: `src/pages/index.astro` and `src/pages/{bms,civil,digitalmarketing,embedded,fintech,graphics,hcm,hr,instrumentation,logistics,mep,networking,oilandgas,shipmaintenance}/index.astro`
    - Implement Change 1: global replace `wa.me/919995879404` → `wa.me/918289887322` using `String.prototype.replaceAll`
    - Implement Change 2: replace the `hero__enroll-btn` anchor's full attribute block (after Change 1 has updated the number) — match `href="https://wa.me/918289887322?text=..." class="hero__enroll-btn" target="_blank" rel="noopener noreferrer"` and replace with `href="tel:+919656227714" class="hero__enroll-btn"`; then replace the inner text `Enroll Now` → `Call Now` scoped to that anchor
    - Implement Change 3: replace the entire `<!-- Centre Enroll CTA --> <a ... </a>` block with the new `<div class="mob-enroll-wrap">` wrapper containing the popup HTML and the `<button class="mob-bottom-nav__enroll">` element (preserving the original WhatsApp SVG bubble and `data-astro-cid-*` attributes)
    - Append the popup CSS before the closing `</style>` tag of the last inline style block in each file
    - Append the popup JS IIFE before the closing `</script>` tag of the bottom-nav script block (identified by the presence of `mob-overlay`)
    - Log a per-file success/failure summary to stdout
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.6, 2.7, 2.8, 3.1–3.12, 4.1_

- [ ] 2. Write the validation script
  - [ ] 2.1 Write `scripts/validate-contact-updates.js`
    - Create a Node.js script that reads each of the 15 updated `.astro` files and asserts all correctness properties
    - Exit with code 1 and a descriptive message if any assertion fails; exit 0 on full pass
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 2.2 Write property test for Property 1 — no old WA number remains
    - **Property 1: No old WA number remains**
    - Assert `!content.includes('wa.me/919995879404')` for all 15 files
    - **Validates: Requirements 1.1, 1.2, 4.2**

  - [ ]* 2.3 Write property test for Property 2 — nav button is a tel link
    - **Property 2: Nav button is a tel link**
    - Assert `hero__enroll-btn` element has `href="tel:+919958873874"` and does not contain `target="_blank"` or `rel="noopener noreferrer"` for all 15 files
    - **Validates: Requirements 2.1, 2.6, 2.7**

  - [ ]* 2.4 Write property test for Property 3 — nav button text is "Call Now"
    - **Property 3: Nav button text is "Call Now"**
    - Assert the text node inside `hero__enroll-btn` is `Call Now` (not `Enroll Now`) for all 15 files
    - **Validates: Requirements 2.2, 4.3**

  - [ ]* 2.5 Write property test for Property 4 — bottom-nav enroll is a button element
    - **Property 4: Bottom-nav enroll is a button element**
    - Assert `mob-bottom-nav__enroll` is a `<button>` tag (not `<a>`) and has no `href` attribute for all 15 files
    - **Validates: Requirements 3.11, 4.4**

  - [ ]* 2.6 Write property test for Property 5 — popup contains exactly two sub-buttons with correct hrefs
    - **Property 5: Popup contains exactly two sub-buttons with correct hrefs**
    - Assert `#mob-enroll-popup` contains exactly one `.mob-enroll-popup__btn--call` with `href="tel:+919958873874"` and exactly one `.mob-enroll-popup__btn--wa` with href containing `wa.me/918289887322` for all 15 files
    - **Validates: Requirements 3.2, 3.3, 3.4**

  - [ ]* 2.7 Write property test for Property 6 — popup WA button opens in new tab safely
    - **Property 6: Popup WA button opens in new tab safely**
    - Assert `.mob-enroll-popup__btn--wa` has both `target="_blank"` and `rel="noopener noreferrer"` for all 15 files
    - **Validates: Requirements 3.4**

  - [ ]* 2.8 Write property test for Property 7 — popup toggle JS is present
    - **Property 7: Popup toggle behaviour is correct**
    - Assert the script block contains `mob-enroll-btn` and `mob-enroll-popup` identifiers, and the popup element starts with `aria-hidden="true"` for all 15 files
    - **Validates: Requirements 3.1, 3.6, 3.11**

  - [ ]* 2.9 Write property test for Property 8 — no unrelated content is altered
    - **Property 8: No unrelated content is altered**
    - Capture original file sizes before running the replacement script; after applying changes, assert that the character-count delta for each file falls within the expected range (added popup HTML + CSS + JS minus removed old anchor)
    - **Validates: Requirements 4.5**

- [ ] 3. Checkpoint — run the replacement script and validate
  - Run `node scripts/apply-contact-updates.js` and confirm all 15 files are reported as updated
  - Run `node scripts/validate-contact-updates.js` and confirm all property assertions pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- The replacement script must apply changes in the documented order per file: Change 1 → Change 2 → Change 3 (CSS + JS appended as part of Change 3)
- Because the `.astro` files are minified single-line files, all find patterns must match exact substrings without relying on newlines
- The `data-astro-cid-*` attribute value differs per page; the replacement patterns must preserve whatever value is already present
- Property tests in task 2 are assertions inside the validation script — they do not require a separate test framework

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8", "2.9"] }
  ]
}
```
