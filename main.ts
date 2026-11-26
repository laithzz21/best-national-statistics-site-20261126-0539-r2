// Jordan in Numbers — national statistics site for Jordan, shipped as plain
// static files under app/ (an index.html shell, CSS, ES modules and the
// figures in data.js; no build step, no network requests, no framework).
// This program is the handover: it stages app/ and screenshots/ from beside
// this file into the output directory and writes /output/dossier.json using
// the vendored make.fun library, which is the summary the judge reads
// (screenshots, first-load files and bytes, and the site's source).
//
// Do not edit vendor/makefun-frontend.ts: the scorer rebuilds the dossier
// with its own copy of that file and requires a byte-for-byte match.
//
// Run locally with:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoDir = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const appDir = join(repoDir, 'app');
const shotsDir = join(repoDir, 'screenshots');

// Fail loudly instead of handing in an empty site: the entry point must exist.
if (!existsSync(join(appDir, 'index.html'))) {
  throw new Error('app/index.html is missing — nothing to hand in');
}

// Stage the site first, then the screenshots, into the output directory.
// The screenshots folder is created up front so the layout is stable even
// if the source folder is ever missing.
mkdirSync(outDir, { recursive: true });
cpSync(appDir, join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });
}

// The scorer's own caps: only text_max_bytes shapes the bytes; the rest
// refuse an entry the scorer would refuse (more than 4 screenshots or one
// over 256 KiB; more than 993 files and directories in app/ or 16 MiB of
// app files: app/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);

// Total size in bytes of every file inside one directory (non-recursive;
// screenshots/ is flat).
function dirBytes(dir: string): number {
  return readdirSync(dir)
    .sort()
    .reduce((sum, name) => sum + statSync(join(dir, name)).size, 0);
}

// A short, deterministic summary on stdout: the same input always prints
// the same lines, so two runs can be compared byte for byte.
const shotNames = readdirSync(join(outDir, 'screenshots')).sort();
const shotBytes = dirBytes(join(outDir, 'screenshots'));
const indexBytes = statSync(join(outDir, 'app', 'index.html')).size;
const dossierBytes = statSync(join(outDir, 'dossier.json')).size;
console.log(`jordan-in-numbers: app/index.html=${indexBytes} bytes`);
console.log(`jordan-in-numbers: screenshots=${shotNames.length} files, ${shotBytes} bytes`);
console.log(`jordan-in-numbers: dossier.json=${dossierBytes} bytes`);
