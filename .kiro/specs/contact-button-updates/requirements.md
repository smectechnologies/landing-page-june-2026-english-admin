# Requirements Document

## Introduction

This feature updates all contact and enrollment call-to-action buttons across the SMECLabs Astro webapp (15 pages: `index.astro` and 14 course pages under `src/pages/`). The changes involve three coordinated updates: replacing the WhatsApp number site-wide, converting the top-nav "Enroll Now" button into a "Call Now" phone button, and replacing the mobile bottom-nav centre enroll button with an animated popup that exposes two sub-actions (Call Now and WhatsApp).

All 15 pages are large single-file `.astro` files containing minified/inlined HTML. Every change must be applied consistently across all pages.

## Glossary

- **Page**: Any of the 15 `.astro` files under `src/pages/` (`index.astro` plus 14 course sub-directories).
- **WhatsApp_Link**: An anchor element whose `href` begins with `https://wa.me/`.
- **Old_WA_Number**: The WhatsApp number `919995879404` (currently used across all pages).
- **New_WA_Number**: The replacement WhatsApp number `918289887322` (+91 82898 87322).
- **Call_Number**: The phone number `+919958873874` (+91 9958873874) used for `tel:` links.
- **Nav_Enroll_Btn**: The top-nav anchor element with class `hero__enroll-btn`.
- **Hero_CTA**: The primary hero section anchor element with class `hero__cta` (excluding the outline variant).
- **Course_Card_Enroll**: Anchor elements with class `mob-course-card__enroll` inside the mobile courses bottom sheet.
- **Placements_Enroll_CTA**: The anchor element with class `mob-sheet__enroll-cta` inside the placements bottom sheet.
- **Bottom_Nav_Enroll_Btn**: The centre button element with class `mob-bottom-nav__enroll` in the mobile bottom navigation bar.
- **Enroll_Popup**: The new animated popup component that replaces the direct WhatsApp link on the Bottom_Nav_Enroll_Btn.
- **Popup_Call_Btn**: The "Call Now" sub-button inside the Enroll_Popup.
- **Popup_WA_Btn**: The "WhatsApp" sub-button inside the Enroll_Popup.

---

## Requirements

### Requirement 1: WhatsApp Number Replacement

**User Story:** As a site administrator, I want all WhatsApp contact links to use the new number, so that prospective students reach the correct WhatsApp account when they tap any enrollment or contact button.

#### Acceptance Criteria

1. THE Page SHALL contain no `href` attribute referencing `wa.me/919995879404` after the update is applied.
2. WHEN a user taps any WhatsApp_Link on a Page, THE WhatsApp_Link SHALL open `https://wa.me/918289887322` with the existing URL-encoded message text preserved.
3. THE Page SHALL update every occurrence of the Old_WA_Number in `href` attributes, including those on the Hero_CTA, Course_Card_Enroll links, Placements_Enroll_CTA, and any other `wa.me` anchor on the page.
4. WHEN the WhatsApp number replacement is applied, THE Page SHALL preserve all other attributes (`class`, `target`, `rel`, `data-*`) on each updated anchor element unchanged.

---

### Requirement 2: Top-Nav Button Change to "Call Now"

**User Story:** As a prospective student viewing the site on any device, I want the top-nav button to let me call SMECLabs directly, so that I can get immediate assistance without opening WhatsApp.

#### Acceptance Criteria

1. THE Nav_Enroll_Btn SHALL have its `href` attribute set to `tel:+919958873874`.
2. THE Nav_Enroll_Btn SHALL display the label "Call Now" as its visible text content.
3. WHEN a user taps or clicks the Nav_Enroll_Btn on a mobile device, THE Nav_Enroll_Btn SHALL initiate a phone call to `+919958873874`.
4. WHEN a user taps or clicks the Nav_Enroll_Btn on a desktop browser, THE Nav_Enroll_Btn SHALL follow the browser's default behaviour for `tel:` links.
5. THE Nav_Enroll_Btn SHALL retain its existing `class="hero__enroll-btn"` attribute and all other non-`href` attributes after the update.
6. THE Nav_Enroll_Btn SHALL NOT contain a `target="_blank"` attribute, regardless of how many pages the button appears on, as phone calls do not open a new tab.
7. IF the Nav_Enroll_Btn previously contained a `rel="noopener noreferrer"` attribute, THEN THE Nav_Enroll_Btn SHALL have that attribute removed regardless of how many pages the button appears on, as it is not applicable to `tel:` links.
8. THE Nav_Enroll_Btn change SHALL be applied to all 15 Pages.

---

### Requirement 3: Bottom-Nav Centre Button — Animated Popup

**User Story:** As a prospective student on a mobile device, I want the centre enroll button in the bottom navigation bar to offer me a choice between calling and messaging on WhatsApp, so that I can pick the contact method that suits me best.

#### Acceptance Criteria

1. WHEN a user taps the Bottom_Nav_Enroll_Btn, THE Enroll_Popup SHALL become visible by animating upward from the bottom of the button with a slide-up and fade-in transition.
2. THE Enroll_Popup SHALL contain exactly two sub-buttons: the Popup_Call_Btn and the Popup_WA_Btn.
3. THE Popup_Call_Btn SHALL display the label "Call Now" and SHALL have an `href` of `tel:+919958873874`.
4. THE Popup_WA_Btn SHALL display the label "WhatsApp" and SHALL open `https://wa.me/918289887322` with the existing enrollment message text in a new tab (`target="_blank"`).
5. WHEN the Enroll_Popup is visible and a user taps anywhere outside the Enroll_Popup and outside the Bottom_Nav_Enroll_Btn, THE Enroll_Popup SHALL close with a slide-down and fade-out transition; any simultaneous tap on a popup sub-button SHALL be ignored and only the close action SHALL be processed.
6. WHEN the Enroll_Popup is visible and a user taps the Bottom_Nav_Enroll_Btn again, THE Enroll_Popup SHALL close with a slide-down and fade-out transition (toggle behaviour).
7. WHILE the Enroll_Popup is open, THE Bottom_Nav_Enroll_Btn SHALL display a visual indicator (such as a changed icon or active state) to communicate that the popup is open.
8. THE Enroll_Popup SHALL be positioned above the Bottom_Nav_Enroll_Btn and SHALL NOT be obscured by other page elements.
9. THE Enroll_Popup animation SHALL complete within 300 milliseconds for both open and close transitions.
10. WHERE the user's device has `prefers-reduced-motion: reduce` set, THE Enroll_Popup SHALL appear and disappear without animation (instant show/hide).
11. THE Bottom_Nav_Enroll_Btn popup behaviour SHALL be implemented using inline JavaScript within each Page's existing `<script>` block, consistent with the existing pattern used for other bottom-sheet interactions on the page.
12. THE Enroll_Popup change SHALL be applied to all 15 Pages.

---

### Requirement 4: Consistency Across All Pages

**User Story:** As a site administrator, I want all contact button changes applied uniformly across every page, so that users have a consistent experience regardless of which course page they visit.

#### Acceptance Criteria

1. THE update SHALL be applied to all 15 Pages: `src/pages/index.astro` and the `index.astro` file inside each of the 14 course sub-directories (`bms`, `civil`, `digitalmarketing`, `embedded`, `fintech`, `graphics`, `hcm`, `hr`, `instrumentation`, `logistics`, `mep`, `networking`, `oilandgas`, `shipmaintenance`).
2. WHEN any Page is inspected after the update, THE Page SHALL contain no remaining references to `wa.me/919995879404`.
3. WHEN any Page is inspected after the update, THE Page SHALL contain no Nav_Enroll_Btn with the text "Enroll Now".
4. WHEN any Page is inspected after the update, THE Page SHALL contain no Bottom_Nav_Enroll_Btn that links directly to a `wa.me` URL.
5. THE update SHALL not alter any HTML structure, CSS classes, or JavaScript behaviour unrelated to the three changes described in Requirements 1, 2, and 3. HTML structure changes that are strictly necessary to implement those three changes are permitted.
