/**
 * add-limited-seats.js
 * Injects a "Limited Seats" badge on all pages.
 * Badge is placed inside the hero nav, between the logo and the Call Now button.
 * Also adds the required CSS inline.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, '..', 'src', 'pages');

// All page files
const PAGE_FILES = [
  path.join(PAGES_DIR, 'index.astro'),
  ...fs.readdirSync(PAGES_DIR)
    .filter(d => fs.statSync(path.join(PAGES_DIR, d)).isDirectory())
    .map(d => path.join(PAGES_DIR, d, 'index.astro'))
    .filter(f => fs.existsSync(f)),
];

// CSS to inject — added right before </style></head>
const BADGE_CSS = `.limited-seats-badge{display:inline-flex;align-items:center;gap:5px;background:linear-gradient(135deg,#e53e3e,#c53030);color:#fff;font-size:.7rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:5px 10px;border-radius:20px;white-space:nowrap;box-shadow:0 2px 8px rgba(229,62,62,.45);animation:seats-pulse 2s ease-in-out infinite}.limited-seats-badge__dot{width:6px;height:6px;border-radius:50%;background:#fff;flex-shrink:0;animation:dot-blink 1.2s ease-in-out infinite}@keyframes seats-pulse{0%,100%{box-shadow:0 2px 8px rgba(229,62,62,.45)}50%{box-shadow:0 4px 18px rgba(229,62,62,.75)}}@keyframes dot-blink{0%,100%{opacity:1}50%{opacity:.25}}`;

// Badge HTML to inject between logo and Call Now button in the nav
const BADGE_HTML = `<span class="limited-seats-badge" aria-label="Limited seats available"><span class="limited-seats-badge__dot" aria-hidden="true"></span>Limited Seats</span>`;

// The nav currently ends with: </a> <a href="tel:+919656227714" class="hero__enroll-btn"
// We insert the badge between the logo </a> and the Call Now <a>
const NAV_LOGO_END = `</a> <a href="tel:+919656227714" class="hero__enroll-btn"`;
const NAV_WITH_BADGE = `</a> ${BADGE_HTML} <a href="tel:+919656227714" class="hero__enroll-btn"`;

// CSS injection point — right before </style></head>
const CSS_INJECT_BEFORE = `</style></head>`;
const CSS_WITH_BADGE = `.limited-seats-badge{display:inline-flex;align-items:center;gap:5px;background:linear-gradient(135deg,#e53e3e,#c53030);color:#fff;font-size:.7rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:5px 10px;border-radius:20px;white-space:nowrap;box-shadow:0 2px 8px rgba(229,62,62,.45);animation:seats-pulse 2s ease-in-out infinite}.limited-seats-badge__dot{width:6px;height:6px;border-radius:50%;background:#fff;flex-shrink:0;animation:dot-blink 1.2s ease-in-out infinite}@keyframes seats-pulse{0%,100%{box-shadow:0 2px 8px rgba(229,62,62,.45)}50%{box-shadow:0 4px 18px rgba(229,62,62,.75)}}@keyframes dot-blink{0%,100%{opacity:1}50%{opacity:.25}}</style></head>`;

let updated = 0;

for (const filePath of PAGE_FILES) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Inject CSS (only if not already present)
  if (!content.includes('limited-seats-badge') && content.includes(CSS_INJECT_BEFORE)) {
    content = content.replace(CSS_INJECT_BEFORE, CSS_WITH_BADGE);
    changed = true;
  }

  // 2. Inject badge HTML in nav (only if not already present)
  if (!content.includes('limited-seats-badge') && content.includes(NAV_LOGO_END)) {
    content = content.replace(NAV_LOGO_END, NAV_WITH_BADGE);
    changed = true;
  } else if (content.includes('limited-seats-badge') && content.includes(NAV_LOGO_END)) {
    // CSS was added but badge HTML wasn't yet (first pass added CSS, need badge too)
    content = content.replace(NAV_LOGO_END, NAV_WITH_BADGE);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${path.relative(process.cwd(), filePath)}`);
    updated++;
  } else {
    console.log(`⚠️  Already done or pattern not found: ${path.basename(path.dirname(filePath))}`);
  }
}

console.log(`\n✅ Limited Seats badge added to ${updated} pages.`);
