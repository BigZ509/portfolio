# Project dossier: manga-ink atmosphere

The right-hand dossier panel in each expanded project showcase carries a quiet, original manga-ink
layer behind every chapter (Problem / Build / Decision). It gives the flat indigo panel some depth
next to the cinematic purple scene on the left, without touching the masthead, title, CTAs or the
reading column.

## What it looks like

Each chapter (`.folioGroup`) gets one composition, strongest at the folio's **outer right edge** and
dissolving before it reaches the middle of the text column:

- **Ink plume**: a charcoal-violet (`#06051a`, never pure black) brush mass entering from the edge,
  breaking into three tapered tongues, plus two detached wisps and a few dry-brush shards. A wide,
  very faint lavender stroke under the main masses reads as a wet edge bleeding into the paper.
- **Backlight**: a soft violet radial glow behind the plume, so the dark ink reads as a silhouette.
- **Focus lines**: nine hand-ruled ivory scratches with uneven spacing, length and weight, starting
  at the outer edge and converging toward a point far inside the text column. They stop well short of it.
- **Halftone**: a static, graduated dot screen in the outer corner (about 0.03–0.05 perceived).
- **Hatching**: a small gilt cross-hatch patch in the corner.
- **Motif echo**: an abstract gesture derived from the project's tarot motif (see below), drawn in
  the same brush grammar, region, weight and colours.

Placement varies slightly by chapter so the three spreads relate without repeating:
`problem` sits on the bottom edge; `built` is flipped vertically so the ink pours in from the top
edge (keeping the flow diagram below it clear); `decision` sits on the bottom edge with a -2° tilt.

## Architecture

| File | Role |
| --- | --- |
| `components/project-dossier-manga.tsx` | Pure presentational component. Props: `motif`, `chapter`, `active`, optional `className`. No state, effects, IDs, filters, `<image>` tags or randomness. |
| `components/project-dossier-manga-presets.ts` | All geometry in one 600 × 500 canvas: `SHARED` (plume), `MOTIF_INK: Record<CardMotif, InkLayer>`, `FOCUS_LINES`, `HATCH`. Arcs and rays are computed deterministically at module load. |
| `components/project-dossier-manga.module.css` | All decorative styling, masking, intensity tokens and motion. |
| `components/project-details.tsx` | Renders `<ProjectDossierManga motif={project.motif} chapter={chapter.key} active={active === index} />` as the first child of each `.folioGroup`. |
| `components/project-details.module.css` | `.folioGroup { position: relative; isolation: isolate }`, plus a rule that keeps a chapter's ink hidden until its folio has been revealed (`.ink`). |

**Layering.** `.folioGroup` isolates its own stacking context, and the decor root sits at
`z-index: -1` inside it. The ink therefore paints above the panel's paper and below every folio
line, flow node, border, pseudo-element and focus ring. The panel's sticky `.progress` (z 3) and
`.rail` (z 2) are unaffected.

**Scrolling.** The decor is absolutely positioned inside each chapter, so it scrolls with the
chapter in both scroll modes: the panel as scroll root on desktop, and `.dialogLayout` on phones and
portrait tablets. There are no fixed overlays, no `background-attachment: fixed`, no new listeners
and no layout changes. The root clips its own contents (`overflow: hidden` plus a vertical mask),
so the composition never adds horizontal or vertical scroll overflow.

**Data attributes.** The root exposes `data-dossier-manga`, `data-motif`, `data-ink-chapter` and
`data-active`. Do **not** rename `data-ink-chapter` to `data-chapter`: `ProjectDetails` queries
`[data-chapter]` to find the folios for its IntersectionObservers.

## Motif map

Variation comes only from the existing `project.motif` (`CardMotif`). There are no per-project
fields, image URLs or CSS overrides.

| Motif | Project | Ink gesture |
| --- | --- | --- |
| `threshold` | SpeakLab AI | Elongated waveform ribbon with interrupted wave traces and a small loop |
| `orbit` | Autonomous Delivery Rover | Concentric arc cuts with gaps, radial tick scratches, two satellites |
| `spark` | Guiding Hands | Angular branching zig-zag gesture with a four-point spark |
| `balance` | Road Report | Two offset sweeping routes, each a ribbon plus a parallel slash and a dashed centre line |
| `star` | ZBXP | Fragmented starburst (split rays and brush flicks) with a hatch patch |

A new motif needs one entry in `MOTIF_INK` and nothing else. Keep it inside the same region
(x 300–600, y 150–480), with similar total ink area and the same classes.

## Motion

- **Ambient**: the plume layer drifts by about 5 px and 0.6° over 16 s (`alternate`). Each chapter
  starts at a different phase. This is a transform on a composited layer, not an rAF loop.
- **Chapter activation**: when the existing `active` index lands on a chapter, its focus lines are
  re-ruled from the outer edge inward once (440 ms, slightly staggered via `stroke-dashoffset`
  with `pathLength=1`), the scratch layer rises from 42% to full strength, and the backlight
  swells briefly (520 ms). Nothing flashes, inverts, shakes or touches text.
- **First sight**: a chapter's ink fades in with its folio text (`:has()` on the existing
  `data-seen`). Browsers without `:has()` simply show the ink immediately.
- **`prefers-reduced-motion: reduce`**: same static composition, with every keyframe and transition
  disabled (verified: 0 running animations on the decor).
- **`forced-colors` / print**: the decor is not rendered.

## Tuning intensity

All tokens live on `.root` in `project-dossier-manga.module.css`. Change them there, not per path:

- `--ink-strength`: overall opacity of the composition (1 on desktop, 0.82 at ≤700 px).
- `--ink-shadow`, `--ink-line`, `--ink-scratch`, `--ink-gilt`: colours.
- `--ink-glow`: backlight colour and alpha (the main brightness lever behind text).
- `--ink-scratch-rest`: how present the focus lines are on inactive chapters.
- Per-element opacity: `.fill`, `.bleed`, `.line`, `.dash`, `.dot`, `.focus`, `.hatch`.
- Reach into the text column: the radial `mask-image` on `.art`. A larger first ellipse radius
  reaches further left.
- Size: `.art { height: clamp(15rem, 100%, 27rem) }`. The box follows the chapter's height, so a
  short chapter gets the whole composition rather than a crop.

When raising anything, re-run the contrast probe (below). Lavender and ivory line work is what
lowers contrast behind text; the dark ink raises it.

## Rights and assets

All artwork here is original vector work written for this repository. It is inspired by, but not
derived from, the general grammar of manga ink: brush tongues, shūchūsen focus lines and screentone.
No image, panel, character, logo, GIF, video or audio from any franchise or third-party repository
is used, traced or embedded. No new runtime dependencies, fetches or WebGL contexts were added.

The "Liquid Ink Surge" plate (`chimera-shadow/frame_1.jpg`) was a moodboard reference only. It was
not downloaded, embedded, transformed or traced. Behavioural references, consulted for behaviour
only with no code copied: the impact-frame and focus-ray idea in
`Nafiz001/jjk-domain-expansion` (`src/engine/renderer.ts`, `drawImpactFrame`), its film grain in
`src/style.css`, and the manga panel layering in `GarunJad/Anime-Portfolio` (`style.css`).
The owner-held code authorization in `docs/source-permissions.md` does not cover franchise imagery,
and none is used.

## Verification (2026-11-18, branch `feat/manga-dossier-atmosphere`)

Environment: local `next dev` on port 3105, headless Chromium 1248 driven by Playwright 1.65.1
from the local npx cache (not added to `package.json`). In headless Chromium the carousel ran its
non-WebGL card grid. The showcase scene itself rendered.

| Check | Result |
| --- | --- |
| `npm run typecheck` | pass |
| `npm run lint` | pass |
| `npm run build` | pass (all 7 routes static) |
| All 5 projects × 1440×900, 1280×800, 768×1024, 390×844, 360×740, 844×390 | 3 ink layers each; no document or panel horizontal overflow |
| Active ink follows the rail (`aria-current`) | pass in every run |
| Observers still see exactly 3 `[data-chapter]` folios | pass |
| Decor takes no pointer hits (`elementFromPoint`), is `aria-hidden`, and has no focusables | pass |
| Real pointer click on rail → chapter active and focused | pass (Road Report, Guiding Hands, ZBXP; desktop and phone) |
| Dossier "Watch Demo" → embedded player | pass (same set) |
| Live app / GitHub links rendered with original hrefs | pass |
| Escape closes the dialog | pass |
| Page errors | none |
| Reduced motion (1440 and 390; Guiding Hands, ZBXP, SpeakLab) | identical static art, 0 running decor animations |
| Body-text contrast (`#d3d7e6`), text hidden, background sampled behind folios | 99th-percentile background: ≥11.5:1 with ink vs ≈12.3:1 without. Brightest single hairline pixel: ≥4.6:1 (ZBXP desktop), ≥6.0:1 elsewhere. |

Screenshots and the three probe scripts (`shoot.mjs`, `interact.mjs`, `contrast.mjs`) are in
`output/playwright/manga-dossier/` (untracked, like earlier phases' captures):
`before-*` (baseline), `final-*` (desktop and phone, normal and `-rm` reduced motion), `v6-*` (the
other viewports) and `v5p-*` (2× panel crops).

**Not verified:** real Safari or iOS Safari, or Firefox (Chromium only; masks use both `mask-image`
and `-webkit-mask-image`); a physical device; a screen reader (semantics were checked
structurally, not with VoiceOver); GPU cost of the 16 s drift on low-end phones; the deployed Vercel
site (only local).

**Pre-existing, unchanged:** at scroll-top in short dossiers such as SpeakLab, the rail can show
"02" because the Build chapter sits on the 32% reading line. The baseline does the same.
