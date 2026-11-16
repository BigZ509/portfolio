# MARC'S WORLD — Phase 1 report: rebrand and visual redesign

Date: 2026-11-16. Scope: Phase 1 of
[docs/marcs-world-jjk-integration-plan.md](marcs-world-jjk-integration-plan.md), as revised by the
owner review. Local work only — not committed or pushed.

**Phase 2 was not started. No third-party code was adapted. The Projects carousel was not touched.**

---

## 1. Plan corrections applied first

All six review corrections were written into the plan before any code changed:

1. **Portal (§5.2, criterion 7).** The original image-plate zoom, emergence, and shockwave mechanics
   are now the primary desktop implementation. Plates are pre-generated during development from our
   own homepage and Projects visuals by a manual `scripts/generate-plates.mjs`; runtime DOM
   screenshotting is explicitly prohibited. The transparent seam-only variant is demoted to the
   low-performance/plate-failure fallback.
2. **Permissions (§2).** Rewritten around the owner's stated reuse authorization. A missing public
   `LICENSE` no longer reads as a blocker. `docs/source-permissions.md` was created to record scope
   and provenance per source, and carries the standing rule that third-party code is not published
   beyond what the authorization or licence actually covers.
3. **Identity.** `Marc Alexis` is gone from the plan; the value is `Marc`, brand stays MARC'S WORLD.
4. **Phase 1 (§5.1).** Rescoped from "rebrand and twilight" to a substantial visual redesign.
5. **Phase 5 (§5.4).** Rescoped to a biography and storytelling redesign using real UCF computer
   science, software engineering, AI and robotics details and the actual project records.
6. **Visual fidelity (§5.6).** New section requiring each adapted effect to be compared against its
   upstream demonstration, with deviations recorded in a new `docs/fidelity-notes.md`.

## 2. Rebrand

- `app/layout.tsx` — title `MARC'S WORLD`, description rewritten.
- `components/home-intro.tsx` — the two title lines are now `MARC’S` / `WORLD` (typographic
  apostrophe), keeping the existing two-span structure so all `.title` sizing and the staged
  clip-path reveal continue to apply unchanged.
- `components/navbar.tsx` — wordmark.
- `app/about|experience|resume/page.tsx` — page titles.
- `data/home.ts` — `ownerName: "Marc"` (renders "By Marc" beneath the title) and the portrait alt
  text now names Marc rather than "the portfolio owner".
- Source comments in `home-scene.tsx` and `project-showcase-environment.tsx`.

## 3. Visual redesign

### 3.1 Luminous twilight

The scene moved from near-black navy night to a lit violet twilight. The sky gradient was lifted
(`#29304b → #080b17` became `#6d6194 → #0c1120`), and every architectural plane gained a legible rim
and body value: far `#181d31 → #2c3458`, mid `#12182b → #202749`, tower `#151a2b → #262d4b`, near
`#090e1a → #161d31`, with rim fills and opacities raised to match. Window lights were warmed and
strengthened (`farLights` `.38 → .74` opacity, `midLights #e7b86d → #ffdc9d`), and the lit-group
opacities raised (`litFar .55 → .82`, `litMid .78 → .96`, `litNear .72 → .9`).

The three overlays that were crushing the composition were rebalanced, which was the single largest
brightness lever: `.scrim`'s left-hand black gradient dropped from 80% to 34% alpha, `.veil`'s inset
vignette softened, and `.grain` went from `.13` to `.07`.

A latent bug surfaced and was fixed: `home-scene.tsx` referenced `styles.litClock`, which **did not
exist** in the stylesheet, so the clock-glow wrapper was rendering `class="lit undefined"`. The rule
now exists.

### 3.2 Prominent energy

New original artwork in `home-scene.tsx`, drawn in the same hand as the existing city — shaped
gradients and seeded motes, nothing ported or sampled:

- **Aurora ribbons** — three quadratic bands of violet-to-cyan energy across the sky behind the
  wordmark and tower, on a new depth-7 plane.
- **Horizon rift** — a wide elliptical glow at the skyline with five tapered shafts rising from it,
  presented as the light source the whole city is lit by.
- **Tower corona** — a radial aura behind the clock tower plus two elliptical rings (one solid, one
  dashed), echoing the existing orrery motif so it reads as part of the world rather than bolted on.
- **Rooftop plumes** — seven tapered energy vents between the mid-ground roofs, on a new depth-20
  plane that parallaxes with the mid layer.
- **Ember motes** — 88 seeded glowing particles in three independently drifting sets.

All of it is static CSS/SVG. This is explicitly **not** a CSS approximation of any sourced algorithm;
the real ported particle simulation lands in Phase 4 and replaces the motes.

### 3.3 Stronger composition

- A gilt-to-violet vertical rule (`.copy::before`) now runs down the copy column, giving the eyebrow,
  title, name, lede and actions a shared spine.
- An animated energy bloom (`.copy::after`) sits behind the wordmark, so the title reads as lit from
  within the world rather than placed on top of it.
- The title's text-shadow gained violet and cyan energy halos; `WORLD` keeps a warmer gilt.
- The portrait now overlaps the copy column by `clamp(-4.5rem, -3vw, -1rem)` instead of sitting in a
  separate grid cell, and gained a violet drop-shadow, a brighter gilt frame (`#bc985e → #e2bb7c`,
  brighter inset rings), and a lifted image treatment (`saturate(.75) → .98`, `brightness(1.08)`).
- The primary action, secondary action, footer rule, and the field-note section were all raised to
  match the new key.

### 3.4 Motion integration

The two new depth planes (7 and 20) were added to the intro's staged entrance and to the departure
choreography, so they rise with the rest of the city during the ink reveal and sweep with it on
departure, rather than sitting static while everything else moves.

---

## 4. Verification

### 4.1 Gates

`npx tsc --noEmit`, `npm run lint`, and `npm run build` all pass on the final code.

### 4.2 Measured brightness

Mean luminance and very-dark pixel share, sampled from the captured PNGs:

| View | Before (`af835c7`) | After | Change |
|---|---|---|---|
| Desktop mean luminance | 39.76 / 255 | **73.04 / 255** | **+84%** |
| Desktop very-dark pixels (<32) | 64.6% | **18.6%** | −46 pts |
| Mobile mean luminance | 44.81 / 255 | **57.73 / 255** | **+29%** |
| Mobile very-dark pixels | 57.3% | **28.1%** | −29 pts |

### 4.3 Preserved behaviour (real Chrome over CDP)

- Intro phase machine: `reveal` at 400 ms → `ready` by 4 s. Title clip-path resolves to `inset(0px)`;
  lede opacity 1; portrait loads with `naturalWidth` 403.
- Skip Intro: present during the intro, reaches `ready` immediately on click.
- Departure: clicking the hero's "Explore Projects" sets `data-departing="true"` within 120 ms, plays
  the fog sweep, and lands on `/projects` — the Phase 3 hook is intact.
- Reduced motion: full composition renders immediately with no intro veil and no skip button, and
  navigation completes in 56 ms with no departure delay.
- All five routes render with rebranded titles. No horizontal overflow at 360, 390, 414, 768, 1280 or
  1440 px; the hero CTA is visible at every width.
- The Projects carousel was not modified. Its screenshot shows the known static fallback because the
  headless capture runs with `--disable-gpu`; this is the test environment, not a change.

### 4.4 Silhouette preservation

`git diff components/home-scene.tsx` removes exactly one line — a comment. `buildSkyline`, every
`prng` seed (`20261115`, `1887`, `404`), and the `TOWER`, `CATHEDRAL`, `NEAR` path constants are
byte-identical, so the city's geometry is unchanged and only colour, tone and added atmosphere
differ. This satisfies plan criterion 14.

---

## 5. Screenshots

All in `docs/screenshots/phase-1/`:

| File | What it shows |
|---|---|
| `before-desktop.png` | Baseline `af835c7` at 1440×900, built from a clean worktree |
| `before-mobile.png` | Baseline at 390×844 |
| `desktop-final.png` | Redesigned homepage, 1440×900 |
| `laptop-final.png` | 1280×800 |
| `mobile-final.png` | 390×844 (2× DPR) |
| `mobile-small.png` | 360×740 (2× DPR) |
| `desktop-intro.png` | Mid-intro: the ink aperture opening on the lit city |
| `desktop-departure.png` | Departure fog sweep on the way to Projects |
| `reduced-motion.png` | `prefers-reduced-motion: reduce` |
| `about-unchanged.png`, `projects-unchanged.png` | Untouched routes, rebranded titles only |

---

## 6. Limits

- Captures are headless Chrome with `--disable-gpu`. Real GPU compositing of the new
  `mix-blend-mode: screen` energy layers and the blurred aurora is unverified on actual hardware, as
  is their frame cost on a physical phone.
- Safari and iOS were unavailable; the existing mask fallback path was not re-exercised this phase.
- Mobile brightened less than desktop (+29% vs +84%) because the narrow viewport crops most of the
  sky where the aurora and rift live. It is materially brighter and passes inspection, but if you
  want mobile closer to the desktop key, the lever is the mobile `.scene` gradient and `.scrim`.
- The statement copy, disciplines, and field-note text are unchanged from the baseline; the About
  biography rewrite is Phase 5 work and was deliberately left alone.
