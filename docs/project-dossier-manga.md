# Project dossier: illustrated manga backdrop

The right-hand dossier panel in each expanded project showcase is backed by a **manga illustration**:
two screentoned manga panels drawn from the project's own tarot card, bleeding off the dossier's
upper-right and lower-right corners, split by a slanted antique-gold gutter. It replaces the earlier
procedural "ink plume" (commit `edf9a7d`), which was too faint to notice.

## Why the earlier version failed, and what changed

| Earlier (`edf9a7d`) | Now |
| --- | --- |
| One small SVG composition per chapter, scrolled away with its chapter | One stage for the whole dossier, sticky and one screen tall, so the art is always in frame |
| Charcoal ink (`#06051a`) on an indigo panel: dark on dark | Lavender-gray paper tones that carry the light; ink is the panel's own indigo |
| Two stacked masks, low opacity on every layer | One wash per panel and one scrim; plates at 68% / 46% opacity |
| Pushed against the right edge | Upper panel is 76% × 56% of the dossier, lower panel 82% × 50% |
| Thin procedural scratches | Real illustration: figures, faces, hands, props, rendered as a manga print |

## What it looks like

- **Upper panel (top right):** the card's figure, face toward the dossier's outer edge, framed by
  faint focus lines (shūchūsen) converging on the face.
- **Lower panel (bottom right):** a detail from the same card: hands, props or a companion.
- **Gutter:** each panel's inner edges are cut on a slant and drawn as a dark gutter with a thin
  antique-gold rule, like a manga page layout.
- **Plates:** lavender-gray manga prints of the illustrations, with ink line work, a 45° halftone
  screen in the mid-tones, and solid ink in the shadows. The ink is transparent, so the panel's
  indigo shows through as the ink colour.
- **Readability:** each panel fades toward the reading column, and a stage-wide scrim darkens the left
  of the dossier. Every glyph in the dossier also carries a soft paper-coloured halo (`text-shadow`
  on `.panel`), and the outline buttons, flow nodes and stack plates have near-opaque fills.

The dossier's paper, gold borders, ivory type, seals, chapter rail, demo buttons and content are
unchanged.

## Architecture

| File | Role |
| --- | --- |
| `components/project-dossier-manga.tsx` | Shared component. Props: `motif`, `chapter`, optional `className`. Renders the stage, the two panels (`next/image`, `alt=""`), gutter SVGs, focus lines and scrim. No state or effects. |
| `components/project-dossier-manga-presets.ts` | `DOSSIER_MANGA_PRESETS: Record<CardMotif, DossierMangaPreset>`. A preset is only the two plate paths, their `object-position` focus, and the focus-line centre. |
| `components/project-dossier-manga.module.css` | All shared geometry, palette, gradients, motion and responsive rules, as custom properties on `.root`. |
| `components/project-details.tsx` | Renders `<ProjectDossierManga motif={project.motif} chapter={chapters[active].key} />` once, as the panel's first child. |
| `components/project-details.module.css` | `.panel { isolation: isolate }` plus the inherited text halo. Halos are turned off on the gold primary buttons and on the outlined chapter numerals. |
| `scripts/build-dossier-manga-plates.mjs` | Builds the ten plates in `public/images/dossier-manga/` from `public/images/tarot/*.webp`. |

**Layering.** `.panel` is an isolated stacking context, and the backdrop sits inside it at
`z-index: -1`. It paints above the panel's paper and below every line of content. The sticky
progress thread (z 3) and chapter rail (z 2) are unaffected.

**Scrolling.** `.root` is `position: sticky; top: 0`, one screen tall (`100dvh`, falling back to
`100vh`), with an equal negative bottom margin, so it takes no space in the flow. On desktop and short
landscape screens the panel is the scroll root. On phones and portrait tablets `.dialogLayout` is
the scroll root. Sticky follows whichever box scrolls, so one rule covers both, with no listeners and
no layout change. At the very end of a dossier, the stage rises by the panel's bottom padding
(about 2.5rem). That is how sticky works, and it is not noticeable.

**Data attributes.** `data-dossier-manga`, `data-motif` and `data-ink-chapter`. Do **not** rename
`data-ink-chapter` to `data-chapter`: `ProjectDetails` queries `[data-chapter]` for its
IntersectionObservers.

## Presets

| Motif | Project | Upper plate | Lower plate |
| --- | --- | --- | --- |
| `threshold` | SpeakLab AI | The Fool: gentleman in the top hat (mirrored) | Cape and waistcoat |
| `orbit` | Autonomous Delivery Rover | The World: sleeper among mushrooms (mirrored) | Folded hands |
| `spark` | Guiding Hands | The Magician: face under the hat brim | Hands, pen and lace |
| `balance` | Road Report | Justice: woman with the umbrella | The golden retriever |
| `star` | ZBXP | The Star: writer under the lamp | Typewriter and gloved hands |

To add a project: add crops for its card to `PLATES` in the build script, run it, and add one
`DOSSIER_MANGA_PRESETS` entry. Do not add per-project CSS.

## Regenerating the plates

```sh
node scripts/build-dossier-manga-plates.mjs              # all ten plates
node scripts/build-dossier-manga-plates.mjs road-report  # one project
```

The script uses the `sharp` that ships with Next.js. It is deterministic. Crops are in source-card
pixels (751 × 1051), inside the painted frame. Output: upper 880 × 960 and lower 880 × 760 RGBA WebP,
76–235 KB each. Each dossier loads two plates.

## Motion

- **Entrance:** each panel slides in from the outer edge as the dossier opens (900 ms; upper at
  380 ms, lower at 520 ms), and the gold gutter rule draws in (1.1 s).
- **Ambient:** a slow camera drift on each plate (scale 1 → 1.04 and about 1% translate, over 30 s,
  `alternate`).
- **Chapter:** when the rail's active chapter changes, both plates pan vertically by 2.5% or 5% over
  1.6 s.
- **`prefers-reduced-motion: reduce`:** the same static composition. No keyframes, and no pan
  transition.
- **`forced-colors` / print:** not rendered.

## Tuning

On `.root` in `project-dossier-manga.module.css`:

- `--upper-strength` / `--lower-strength`: plate opacity (desktop 0.68 / 0.46; phones 0.62 / 0.44).
- `--upper-w`, `--upper-h`, `--lower-w`, `--lower-h`: panel sizes (overridden for portrait tablets and
  phones).
- `.scrim` and `.shade`: the readability gradients.
- Panel shapes: the `clip-path` polygons on `.upper .cut` and `.lower .cut`, kept in step with
  `UPPER_EDGE` and `LOWER_EDGE` in the component.

When raising strengths, re-run the contrast probe (see Verification).

## Rights and assets

The plates are **derivatives of the five tarot illustrations** in `public/images/tarot/` (Cards of
Blasphemy, Lord of the Mysteries). They are cropped, in two cases mirrored, converted to greyscale and
re-rendered as screentone. The owner's permission for those exact images is recorded in
`docs/tarot-artwork-manifest.md`. It is an owner assertion, not an independently verified licence,
and it was given for displaying the cards. **Outstanding:** the owner should confirm that it also
covers these cropped and stylized derivatives.

Everything else is original: panel geometry, gutters, focus lines, gradients and the plate
treatment. No JJK or other franchise imagery is used. From the reference projects, only ideas were
taken, not code or assets:

- the manga panel grid with slanted gutters and image panels under gradient overlays
  (`GarunJad/Anime-Portfolio`, already adapted in `components/manga-panel.tsx`);
- the impact-frame and focus-line idea (`Nafiz001/jjk-domain-expansion`).
