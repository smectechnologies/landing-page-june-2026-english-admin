/**
 * restore-videos.js
 * Restores the correct YouTube video IDs for each course page.
 * Ship maintenance (ZB6SQXg1TYg) is left untouched.
 *
 * Original video IDs from source:
 *   Industrial Automation (index) → wA_NJ2uZeLo
 *   Embedded Systems              → pdkjc_CfYzA
 *   BMS                           → pdkjc_CfYzA
 *   All others                    → wA_NJ2uZeLo
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, '..', 'src', 'pages');

// Map: folder slug → correct video ID
const VIDEO_MAP = {
  // root index
  'index':                                  'wA_NJ2uZeLo',
  // course-2026 slugs
  'industrial-automation-course-2026':      'wA_NJ2uZeLo',
  'embedded-systems-course-2026':           'pdkjc_CfYzA',
  'bms-course-2026':                        'pdkjc_CfYzA',
  'civil-engineering-course-2026':          'wA_NJ2uZeLo',
  'networking-course-2026':                 'wA_NJ2uZeLo',
  'mep-course-2026':                        'wA_NJ2uZeLo',
  'instrumentation-course-2026':            'wA_NJ2uZeLo',
  'oil-gas-course-2026':                    'wA_NJ2uZeLo',
  'digital-marketing-course-2026':          'wA_NJ2uZeLo',
  'hr-course-2026':                         'wA_NJ2uZeLo',
  'hcm-course-2026':                        'wA_NJ2uZeLo',
  'fintech-course-2026':                    'wA_NJ2uZeLo',
  'graphics-course-2026':                   'wA_NJ2uZeLo',
  'logistics-course-2026':                  'wA_NJ2uZeLo',
  // ship maintenance is intentionally excluded — keep ZB6SQXg1TYg
};

for (const [slug, videoId] of Object.entries(VIDEO_MAP)) {
  const filePath = slug === 'index'
    ? path.join(PAGES_DIR, 'index.astro')
    : path.join(PAGES_DIR, slug, 'index.astro');

  if (!fs.existsSync(filePath)) {
    console.log(`SKIP (not found): ${filePath}`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace all occurrences of the wrong video ID (ZB6SQXg1TYg) with the correct one
  // Only if it's not already correct
  if (!content.includes(`const videoId="${videoId}"`)) {
    // Replace videoId declaration
    content = content.replace(
      /const videoId="[^"]+"/g,
      `const videoId="${videoId}"`
    );
    // Replace all embed URLs that use the old ID
    content = content.replace(
      /youtube\.com\/embed\/[A-Za-z0-9_-]+\?/g,
      `youtube.com/embed/${videoId}?`
    );
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${slug}: set videoId → ${videoId}`);
  } else {
    console.log(`✓  ${slug}: already correct (${videoId})`);
  }
}

console.log('\n✅ Done. Ship maintenance (ZB6SQXg1TYg) was not touched.');
