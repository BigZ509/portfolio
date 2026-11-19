#!/usr/bin/env node
/*
 * Builds the dossier's manga plates: lavender-gray, screentoned "print" renderings of crops from the
 * five owner-authorized tarot illustrations (see docs/tarot-artwork-manifest.md and
 * docs/project-dossier-manga.md).
 *
 *   node scripts/build-dossier-manga-plates.mjs            # all projects
 *   node scripts/build-dossier-manga-plates.mjs road-report # one project
 *
 * Each plate is drawn like a manga print on dark paper, inverted: the lavender-gray "paper" carries the
 * light, and ink is left transparent so the dossier's indigo shows through as the ink colour.
 *   1. Crop the illustration (inside the card frame), mirror it if asked, and upscale to the plate's
 *      output width.
 *   2. Luminance, contrast-stretched between the 2nd and 98th percentiles.
 *   3. Ink lines: an XDoG (extended difference of Gaussians) edge pass, the usual trick for turning a
 *      painting into pen line work.
 *   4. Tone: highlights become solid paper, mid-tones a 45 degree halftone screen whose dot size
 *      follows the tone, and shadows solid ink.
 *   5. Paper colour: a lavender-gray ramp, written as RGBA WebP.
 *
 * Crops and tuning live in PLATES below. No randomness: the same inputs produce the same files.
 * Uses the `sharp` that ships with Next.js (node_modules/sharp); it is not a direct dependency.
 */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "public/images/tarot");
const OUT = path.join(ROOT, "public/images/dossier-manga");

/** Output size of every plate, in pixels (about 2x its largest on-screen size). */
const SIZE = { upper: [880, 960], lower: [880, 760] };

/*
 * Crop rectangles in the 751 x 1051 source cards, all inside the painted frame. `upper` holds each
 * card's figure (the face, read from the top-right corner of the dossier); `lower` a detail (hands,
 * props, companions), read from the bottom-right corner. Height follows each plate's aspect ratio.
 * `flop` mirrors a crop horizontally, for figures painted on the left of their card, so the face sits
 * toward the dossier's outer edge rather than under the title.
 */
const PLATES = {
  "speaklab-ai": {
    // Mirrored, so the figure faces into the dossier from its outer edge.
    upper: { left: 168, top: 128, width: 440, flop: true },
    lower: { left: 180, top: 420, width: 480 },
  },
  "autonomous-delivery-rover": {
    upper: { left: 66, top: 200, width: 480, flop: true },
    lower: { left: 200, top: 470, width: 420 },
  },
  "guiding-hands": {
    upper: { left: 186, top: 150, width: 500 },
    lower: { left: 70, top: 420, width: 480 },
  },
  "road-report": {
    upper: { left: 250, top: 140, width: 450 },
    lower: { left: 56, top: 430, width: 470 },
  },
  zbxp: {
    upper: { left: 90, top: 150, width: 610 },
    lower: { left: 60, top: 420, width: 420 },
  },
};

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (e0, e1, x) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

async function luminance(file, crop, [w, h]) {
  const height = Math.round((crop.width * h) / w);
  let image = sharp(file).extract({ left: crop.left, top: crop.top, width: crop.width, height });
  if (crop.flop) image = image.flop();
  const { data } = await image
    .resize(w, h, { kernel: "lanczos3" })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return data;
}

async function blur(gray, w, h, sigma) {
  const { data } = await sharp(gray, { raw: { width: w, height: h, channels: 1 } }).blur(sigma).extractChannel(0).raw().toBuffer({ resolveWithObject: true });
  return data;
}

function percentile(buf, p) {
  const hist = new Uint32Array(256);
  for (const v of buf) hist[v]++;
  const target = buf.length * p;
  let acc = 0;
  for (let i = 0; i < 256; i++) {
    acc += hist[i];
    if (acc >= target) return i;
  }
  return 255;
}

async function plate(slug, kind) {
  const [w, h] = SIZE[kind];
  const gray = await luminance(path.join(SRC, `${slug}.webp`), PLATES[slug][kind], [w, h]);
  // Lightly denoise before both passes; the source is a painted WebP.
  const base = await blur(gray, w, h, 0.9);
  const lo = percentile(base, 0.02);
  const hi = percentile(base, 0.98);
  const span = Math.max(1, hi - lo);

  // XDoG line pass.
  const g1 = await blur(base, w, h, 1.5);
  const g2 = await blur(base, w, h, 1.5 * 1.6);
  // Broad tone for the screen, so dots follow forms rather than texture.
  const tone = await blur(base, w, h, 2.2);

  const rgba = Buffer.alloc(w * h * 4);
  const cell = 7; // halftone pitch in output pixels
  const cos = Math.SQRT1_2;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const t = clamp01((tone[i] - lo) / span);
      // Ink lines: XDoG with a soft threshold.
      const d = (g1[i] - 0.985 * g2[i]) / 255;
      const line = 1 - smooth(-0.012, 0.004, d);

      // Tone: solid paper in highlights, halftone in mids, ink in shadows.
      let paper;
      if (t > 0.7) paper = 1;
      else if (t < 0.24) paper = 0;
      else {
        // 45 degree screen: distance to the nearest dot centre.
        const u = (x * cos + y * cos) / cell;
        const v = (-x * cos + y * cos) / cell;
        const du = u - Math.round(u);
        const dv = v - Math.round(v);
        const dist = Math.sqrt(du * du + dv * dv); // 0 at a dot centre, ~0.707 at a cell corner
        const radius = 0.08 + ((t - 0.24) / (0.7 - 0.24)) * 0.62; // dot radius grows with tone
        paper = 1 - smooth(radius - 0.06, radius + 0.06, dist);
      }
      // Lines are ink, cutting through the paper.
      const a = clamp01(paper * (1 - line));
      // Lavender-gray ramp: brighter, warmer paper in the highlights.
      const k = clamp01((t - 0.24) / 0.76);
      const o = i * 4;
      rgba[o] = Math.round(150 + 70 * k);
      rgba[o + 1] = Math.round(142 + 68 * k);
      rgba[o + 2] = Math.round(196 + 44 * k);
      rgba[o + 3] = Math.round(a * 255);
    }
  }
  fs.mkdirSync(OUT, { recursive: true });
  const file = path.join(OUT, `${slug}-${kind}.webp`);
  await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(file);
  return file;
}

const only = process.argv[2];
for (const slug of Object.keys(PLATES)) {
  if (only && only !== slug) continue;
  for (const kind of ["upper", "lower"]) {
    const file = await plate(slug, kind);
    console.log(path.relative(ROOT, file), `${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
  }
}
