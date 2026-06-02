/**
 * create-url-slugs.js
 * Creates new URL slug pages by copying existing page content.
 * The new URLs requested:
 *   /industrial-automation-course-2026  → copy of /
 *   /ship-maintenance-engineering-course-2026 → copy of /shipmaintenance/
 *   /civil-engineering-course-2026 → copy of /civil/
 *   /networking-course-2026 → copy of /networking/
 *   /bms-course-2026 → copy of /bms/
 *   /embedded-systems-course-2026 → copy of /embedded/
 *   /instrumentation-course-2026 → copy of /instrumentation/
 *   /oil-gas-course-2026 → copy of /oilandgas/
 *   /mep-course-2026 → copy of /mep/
 *   /digital-marketing-course-2026 → copy of /digitalmarketing/
 *   /hr-course-2026 → copy of /hr/
 *   /hcm-course-2026 → copy of /hcm/
 *   /fintech-course-2026 → copy of /fintech/
 *   /graphics-course-2026 → copy of /graphics/
 *   /logistics-course-2026 → copy of /logistics/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, '..', 'src', 'pages');

const SLUG_MAP = [
  { source: 'index.astro', slug: 'industrial-automation-course-2026' },
  { source: path.join('shipmaintenance', 'index.astro'), slug: 'ship-maintenance-engineering-course-2026' },
  { source: path.join('civil', 'index.astro'), slug: 'civil-engineering-course-2026' },
  { source: path.join('networking', 'index.astro'), slug: 'networking-course-2026' },
  { source: path.join('bms', 'index.astro'), slug: 'bms-course-2026' },
  { source: path.join('embedded', 'index.astro'), slug: 'embedded-systems-course-2026' },
  { source: path.join('instrumentation', 'index.astro'), slug: 'instrumentation-course-2026' },
  { source: path.join('oilandgas', 'index.astro'), slug: 'oil-gas-course-2026' },
  { source: path.join('mep', 'index.astro'), slug: 'mep-course-2026' },
  { source: path.join('digitalmarketing', 'index.astro'), slug: 'digital-marketing-course-2026' },
  { source: path.join('hr', 'index.astro'), slug: 'hr-course-2026' },
  { source: path.join('hcm', 'index.astro'), slug: 'hcm-course-2026' },
  { source: path.join('fintech', 'index.astro'), slug: 'fintech-course-2026' },
  { source: path.join('graphics', 'index.astro'), slug: 'graphics-course-2026' },
  { source: path.join('logistics', 'index.astro'), slug: 'logistics-course-2026' },
];

for (const { source, slug } of SLUG_MAP) {
  const sourcePath = path.join(PAGES_DIR, source);
  const destDir = path.join(PAGES_DIR, slug);
  const destPath = path.join(destDir, 'index.astro');

  if (!fs.existsSync(sourcePath)) {
    console.log(`SKIP (source not found): ${sourcePath}`);
    continue;
  }

  // Create destination directory
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Copy the file
  fs.copyFileSync(sourcePath, destPath);
  console.log(`✅ Created: /${slug}/ → copied from ${source}`);
}

console.log('\n✅ All URL slug pages created!');
console.log('\nNew URLs available:');
for (const { slug } of SLUG_MAP) {
  console.log(`  /maylandingpages/${slug}/`);
}
