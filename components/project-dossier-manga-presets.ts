import type { CardMotif } from "@/data/projects";

/*
 * Geometry for the dossier's manga-ink atmosphere (see components/project-dossier-manga.tsx and
 * docs/project-dossier-manga.md). Everything here is original, hand-authored vector work in a shared
 * 600 x 500 canvas whose right and bottom edges are the folio's outer edge. Nothing is traced from or
 * derived from franchise artwork.
 *
 * `SHARED` is the one ink composition every project uses. `MOTIF_INK` adds a small, abstract echo of
 * each tarot card's symbol (components/card-motifs.ts) drawn in the same brush grammar, inside the
 * same region, at the same weight, so all five dossiers read as one series.
 */

type Dot = readonly [cx: number, cy: number, r: number];

export type InkLayer = {
  /** Shapes that also get a soft, wet lavender bleed around their edge (drawn beneath the ink). */
  bleed?: readonly string[];
  /** Filled brush shapes in charcoal-violet ink (silhouettes, tapered ribbons, dry-brush shards). */
  fills: readonly string[];
  /** Broad dark brush strokes (stroked, not filled). */
  brush: readonly string[];
  /** Thin lavender line work. */
  lines: readonly string[];
  /** Short dashed line work (route markings and similar). */
  dashed?: readonly string[];
  /** Small ink spatters. */
  dots?: readonly Dot[];
};

const round = (value: number) => Math.round(value * 10) / 10;

/** Point on a circle, angle in degrees, measured counter-clockwise from +x in a y-down canvas. */
function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [round(cx + r * Math.cos(rad)), round(cy - r * Math.sin(rad))];
}

/** An arc cut between two angles (counter-clockwise from `from` to `to`). */
function arc(cx: number, cy: number, r: number, from: number, to: number): string {
  const [x0, y0] = polar(cx, cy, r, from);
  const [x1, y1] = polar(cx, cy, r, to);
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  return `M${x0} ${y0}A${r} ${r} 0 ${large} 0 ${x1} ${y1}`;
}

/** A radial segment from radius r0 to r1 at one angle. */
function ray(cx: number, cy: number, deg: number, r0: number, r1: number): string {
  const [x0, y0] = polar(cx, cy, r0, deg);
  const [x1, y1] = polar(cx, cy, r1, deg);
  return `M${x0} ${y0}L${x1} ${y1}`;
}

/** A tapered sliver along a ray: a filled brush flick, thick at r0 and pointed at r1. */
function flick(cx: number, cy: number, deg: number, r0: number, r1: number, width: number): string {
  const [x0, y0] = polar(cx, cy, r0, deg - width);
  const [x1, y1] = polar(cx, cy, r0, deg + width);
  const [tx, ty] = polar(cx, cy, r1, deg);
  return `M${x0} ${y0}L${tx} ${ty}L${x1} ${y1}Z`;
}

/** The plume's three large masses: main body, upper wisp, low wisp. */
const PLUME_MASSES = [
  // Main mass: rises from the bottom-right corner and breaks into three tongues reaching left.
  "M600 136C582 168 558 178 530 200C500 224 486 250 452 262C420 273 380 268 336 292C372 291 404 296 430 307C402 327 384 350 348 373C392 366 428 361 462 373C440 404 431 441 402 471C438 462 470 474 490 500L600 500Z",
  // Upper detached wisp, tapering to a point on the left.
  "M600 88C562 108 520 128 470 150C430 168 392 176 350 179C396 186 442 177 488 162C532 147 568 128 600 114Z",
  // Low wisp along the floor of the folio.
  "M530 500C490 488 432 481 372 488C340 491 312 486 288 475C316 496 360 500 404 500Z",
] as const;

/** The shared ink plume: a pooled, flame-tongued brush mass entering from the lower right. */
export const SHARED: InkLayer = {
  bleed: PLUME_MASSES,
  fills: [
    ...PLUME_MASSES,
    // Dry-brush shards that fray the tongues' edges.
    "M472 213C442 226 410 232 374 234C408 239 442 235 474 222Z",
    "M432 195C406 203 382 206 356 204C382 211 408 211 434 202Z",
    "M396 330C372 337 346 339 316 336C344 343 372 343 398 337Z",
    "M452 421C426 431 400 435 370 433C398 441 426 439 456 429Z",
    "M560 66C538 76 516 82 492 86C518 88 540 84 562 76Z",
  ],
  brush: [],
  lines: [
    // Lavender rim light along the plume's leading edge, broken into three inked passes.
    "M600 136C582 168 558 178 530 200C500 224 486 250 452 262C420 273 380 268 336 292",
    "M430 307C402 327 384 350 348 373",
    "M462 373C440 404 431 441 402 471",
  ],
  dots: [
    [334, 262, 2.4],
    [318, 302, 1.4],
    [298, 250, 1.1],
    [360, 405, 1.9],
    [284, 441, 1.3],
    [344, 160, 1.6],
    [326, 186, 0.9],
  ],
};

const STAR_CENTER = [520, 296] as const;
const STAR_ANGLES = [8, 37, 61, 98, 131, 152, 176, 203, 229, 262, 291, 333] as const;

/**
 * One abstract ink echo per tarot motif, each confined to the same region (x 300-600, y 150-480).
 * They differ in gesture only; colour, weight, opacity and timing are shared.
 */
export const MOTIF_INK: Record<CardMotif, InkLayer> = {
  // The Fool / SpeakLab AI: elongated waveform loops, interrupted like a voice trace.
  threshold: {
    fills: [
      "M600 318C566 290 536 340 500 312C470 290 448 330 412 308C388 294 366 306 338 300C368 312 390 304 414 318C450 340 474 302 502 326C536 352 566 310 600 334Z",
    ],
    brush: [],
    lines: [
      "M600 284C562 248 526 318 488 282C456 252 430 310 394 284",
      "M380 276C362 266 346 282 328 278",
      "M600 356C570 330 540 378 508 350C484 330 466 360 446 350",
      "M524 236C492 208 452 222 458 250C464 278 508 270 500 240C496 226 480 222 470 230",
    ],
    dots: [[372, 280, 1.4]],
  },
  // The World / Autonomous Delivery Rover: concentric arc cuts and technical orbit scratches.
  orbit: {
    fills: [
      flick(574, 322, 168, 120, 210, 2.2),
      flick(574, 322, 196, 120, 186, 1.6),
    ],
    brush: [arc(574, 322, 150, 118, 152)],
    lines: [
      arc(574, 322, 172, 52, 98),
      arc(574, 322, 172, 106, 168),
      arc(574, 322, 172, 182, 228),
      arc(574, 322, 120, 68, 148),
      arc(574, 322, 120, 160, 214),
      arc(574, 322, 74, 84, 196),
      ray(574, 322, 134, 160, 184),
      ray(574, 322, 174, 160, 184),
      ray(574, 322, 222, 112, 130),
    ],
    dots: [
      [polar(574, 322, 172, 175)[0], polar(574, 322, 172, 175)[1], 2.4],
      [polar(574, 322, 120, 154)[0], polar(574, 322, 120, 154)[1], 2],
    ],
  },
  // The Magician / Guiding Hands: an angular, branching gesture, like a hand flicking a spark.
  spark: {
    fills: [
      "M600 244L546 270L560 290L494 318L510 336L428 368L506 330L490 314L554 286L540 268Z",
      "M466 206L470 222L486 226L470 230L466 246L462 230L446 226L462 222Z",
    ],
    brush: [],
    lines: [
      "M546 270L520 246L484 250",
      "M494 318L468 298L438 304L420 296",
      "M510 336L486 372L460 380",
      "M560 290L576 318L568 348",
      "M398 248L410 254M404 242L404 260",
    ],
    dots: [
      [430, 296, 1.5],
      [456, 384, 1.2],
    ],
  },
  // Justice / Road Report: two offset sweeping routes, each a pair of parallel slashes.
  balance: {
    fills: [
      "M600 186C544 230 476 284 362 328C484 296 552 248 600 212Z",
      "M600 330C560 358 508 394 428 420C514 404 566 378 600 354Z",
    ],
    brush: [],
    lines: [
      "M600 232C548 272 486 320 392 356",
      "M600 372C566 398 522 424 468 440",
    ],
    dashed: [
      "M594 212C548 250 486 298 380 340",
      "M596 352C560 380 514 408 450 428",
    ],
    dots: [
      [366, 342, 1.5],
      [442, 440, 1.2],
    ],
  },
  // The Star / ZBXP: a fragmented starburst with a patch of hatching.
  star: {
    fills: STAR_ANGLES.filter((_, i) => i % 3 === 0).map((deg) => flick(STAR_CENTER[0], STAR_CENTER[1], deg, 24, 104, 3.4)),
    brush: [],
    lines: [
      ...STAR_ANGLES.map((deg, i) => ray(STAR_CENTER[0], STAR_CENTER[1], deg, 30 + (i % 3) * 6, 58 + ((i * 7) % 4) * 12)),
      ...STAR_ANGLES.filter((_, i) => i % 2 === 1).map((deg, i) => ray(STAR_CENTER[0], STAR_CENTER[1], deg + 3, 84 + (i % 2) * 8, 112 + (i % 3) * 10)),
      // Hatching below-left of the burst.
      "M430 372L412 398M440 376L420 404M450 380L430 408M460 386L444 408M418 384L404 404",
    ],
    dots: [
      [STAR_CENTER[0], STAR_CENTER[1], 2.2],
      [454, 252, 1.4],
      [404, 326, 1.2],
    ],
  },
};

/**
 * Focus lines (shūchūsen): hand-ruled scratches converging on a point far to the left, in the text
 * column, but stopping well short of it. Uneven spacing, starts and lengths are deliberate.
 */
export const FOCUS_LINES: readonly { d: string; w: number }[] = [
  { d: "M600 58L472 114", w: 0.9 },
  { d: "M592 118L494 148", w: 1.3 },
  { d: "M600 146L540 160", w: 0.7 },
  { d: "M598 196L442 214", w: 1.1 },
  { d: "M600 238L500 240", w: 0.8 },
  { d: "M596 306L456 290", w: 1.4 },
  { d: "M600 372L506 346", w: 0.9 },
  { d: "M590 446L466 392", w: 1.2 },
  { d: "M600 492L520 450", w: 0.8 },
];

/** Short cross-hatching in the upper-right corner, clear of the folio numeral's stroke. */
export const HATCH = "M580 28L560 56M590 30L570 58M600 32L580 60M574 70L556 94M584 72L566 96";
