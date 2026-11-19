// Leonida Trophy Guide: the hand-in program (Node 22, standard library only).
// The guide itself is plain static files: app/index.html and its modules, styles and data,
// with app/data/trophies.json holding the 55 official trophies and their guides.
// This program copies app/ and screenshots/ from beside this file into the output
// directory and writes output/dossier.json with the vendored make.fun library,
// which is the summary the judge reads (screenshots, first-load files and bytes,
// and the guide's source). Keep vendor/makefun-frontend.ts untouched: the sealed
// scorer rebuilds the dossier with its own copy of that library and expects the
// same bytes. Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The scorer's own caps: text at most 163,840 bytes; at most 4 screenshots, each at
// most 256 KiB; app/ at most 993 files and directories and 48 MiB in all. The output
// as a whole shares the platform's cap of 1,000 entries and 64 MiB, so app/,
// screenshots/ and dossier.json together must leave room under it.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
