# MARC'S WORLD — JJK Integration Blueprint

Approved source-code integration plan for transforming AFTERIMAGE into **MARC'S WORLD**: authentic
Jujutsu-Kaisen-style particle and portal rendering, Lord-of-Mysteries-inspired luminous architecture,
and Marc's real photography.

This document is the implementation contract.

**Revision history**

- `af835c7` — initial blueprint.
- This revision — owner review corrections applied: image-plate portal as the primary desktop path
  with dev-time generated plates and no runtime DOM screenshots (§5.2, criterion 7); authorization
  recorded as owner-held rather than treated as a blocker (§2); identity value is `Marc` (§5.1);
  Phase 1 scoped as a substantial visual redesign (§5.1); Phase 5 scoped as a biography and
  storytelling redesign using real UCF/engineering/AI/robotics details (§5.4); visual-fidelity
  comparison against upstream demonstrations added (§5.6).

- **Status:** approved with corrections (recorded below). Phase 1 in progress.
- **Target stack (verified installed):** Next.js 16.4.5, React 19.2.0, three 0.187.0, Tailwind 4,
  TypeScript 5, `@types/three` 0.187.0.
- **Baseline:** `npx tsc --noEmit` passes clean on the current tree. Every phase must preserve that.

---

## 1. Upstream sources

All three repositories were cloned and inspected at the exact revisions below. Every file reference,
function name, and line number in this plan was read from these trees, not recalled.

| # | Repository | Pinned commit | Role |
|---|---|---|---|
| 1 | [`Nafiz001/jjk-domain-expansion`](https://github.com/Nafiz001/jjk-domain-expansion) | `69d2b8dca8a2c3f9fdea221dd131ff5722b84c7b` | Canvas 2D Z-tunnel, speed lines, geometry rings, energy particles, portal/impact rendering |
| 2 | [`rajnil9/Cursed-Energy`](https://github.com/rajnil9/Cursed-Energy) | `1bddf052bc39dd5ea3521be9c4606efa04a7465d` | Three.js particle-cloud geometry + bloom, technique shape functions |
| 3 | [`GarunJad/Anime-Portfolio`](https://github.com/GarunJad/Anime-Portfolio) | `a2700feea9e022a1f95b94d971e9956173265553` | Manga-panel layout, mirror dividers, GSAP hero/scroll choreography |

### 1.1 What was found in each

**Source 1 — `jjk-domain-expansion`** (Vite + TypeScript + three 0.186, no framework)

- `src/engine/particles.ts` (550 lines) — a single self-contained `ParticleSystem` class. **No DOM
  access in the constructor and no three.js import**; it is pure canvas-2D math plus a
  `Particle`/`SlashCut` type contract. This is the cleanest reuse target in all three repos.
  - Constructor seeds 14 `TunnelRing`s across `z = 60…1000`, with per-ring `sides` of 6/8/12.
  - `update()` drives rings by `zSpeed = 2.8 + scrollVelocity * 1800`, wrapping at `z < 40` / `z > 1000`.
  - `drawZTunnel()` holds both effects we want: **24 radiating speed lines** from a normalized focal
    point, and the **perspective geometry rings** projected with `scale = fov / max(40, ring.z)`,
    `fov = min(w,h) * 0.65`, faded by a two-sided `depthAlpha`.
  - `draw()` renders particles by discriminated `type` (`spark`, `smoke`, `lightning`, `shadow`, plus
    JJK-character props `talisman`/`katana`/`coin`/`suture`).
  - `triggerBlackFlashBurst()` emits 95 radial particles + 7 slashes.
- `src/engine/renderer.ts` (1108 lines) — `DomainRenderer`, tightly coupled to JJK content. Not
  reusable wholesale (see §6.3). Three private methods are the reuse targets:
  - `renderPortalDepthTunnel()` (L477–642) — the portal effect: outgoing plate zooms past the lens at
    `pow(maxZoom, easeInOut)`, a peripheral ring parallaxes at `maxZoom * 1.28`, the incoming plate
    emerges from the focal vanishing point (`1/maxZoom → 1.0`), an arc-clipped expanding portal of
    radius `easeOut * hypot(w,h) * 0.78`, and a screen-blended radial **seam shockwave** gradient.
  - `drawImpactFrame()` (L1023–1074) — manga 集中線 impact frame: a `saturation`→`difference`/`color`
    composite flicker (`elapsed % 3 !== 1`) plus wedge focus lines converging on the focal point.
  - `drawFractureOverlays()` (L858–889) — 10 kinked radial fracture lines, `intensity = sin(localT * π)`.
- Also present and **explicitly out of scope**: `src/engine/audio.ts`, `src/engine/world3d/*`,
  `src/engine/worldMap.ts`, `src/data/domains.ts`, `index.html`, `src/style.css`, the whole `video/`
  Remotion trailer pipeline, and `public/assets/bridges/*.jpg` JJK imagery.

**Source 2 — `Cursed-Energy`** (Vite + React 18 + React Router + shadcn/ui + three 0.160)

- `src/components/JJKScene.tsx` (765 lines) — one `useEffect` building the whole scene:
  - `COUNT = 20000` particles; `BufferGeometry` with `position`, `color`, and `size` attributes, plus
    parallel `targetPositions`/`targetColors`/`targetSizes` arrays.
  - `EffectComposer` + `RenderPass` + `UnrealBloomPass(new Vector2(w,h), 1.5, 0.4, 0.85)`, with
    `bloomPass.strength` swapped per technique (1.0 neutral → 4.5 Black Flash).
  - Animation loop lerps every attribute toward target at `0.1` per frame and sets `needsUpdate`;
    per-technique rotation rules (`purple`: `rotation.z += 0.2, rotation.y += 0.05`).
  - **Shape functions** — the actual geometry we want: `getVoid(i)` (15% of points on a 26-radius
    bright ring, the rest a 30–120 radius sphere shell in cyan/blue) and `getPurple(i)` (20% diffuse
    100-cube haze, 80% a dense r=20 violet sphere shell). Also `getRed`, `getShrine`, `getMahito`,
    `getHakari`, `getMegumi`.
  - Cleanup already disposes geometry/material/composer/renderer and removes the resize listener.
- `src/lib/techniques/` — reuse candidates:
  - `black-flash.ts` — `getBlackFlash(i, count)`, 5 banded zones: dark core, 12 jagged bolts, an
    expanding `8 + phase * 50` shockwave ring, a dark sphere, outer sparks. `BLACK_FLASH_CONFIG.bloom = 4.5`.
  - `dismantle.ts` — `getDismantle(i, count)`, 7 slash planes + 15 branching cracks + warped sphere.
  - `blood.ts` — `getBlood()` is **parameterized on a live palm origin/direction** from hand tracking.
  - `chimera-shadow-domain.ts` — `createChimeraShadowPlane()` / `createChimeraShadowTendrils()`
    return real `THREE.Mesh`/`THREE.Group` objects.
  - `gesture-detection.ts` — MediaPipe hand-landmark predicates.
- **Explicitly out of scope:** the Vite app shell (`src/App.tsx`, `src/main.tsx`), React Router
  (`src/pages/*`), all 30+ Radix/shadcn UI packages, `@tanstack/react-query`, `sonner`, `src/index.css`
  (551 lines of global Tailwind 3 theme), `tailwind.config.ts`, and the three MediaPipe CDN
  `<script>` tags in `index.html`.

**Source 3 — `Anime-Portfolio`** (static HTML/CSS/JS + GSAP 3.12.2 via CDN)

- `script.js` — the three requested functions, all small and declarative:
  - `initHeroAnimations()` (L140–153) — one `gsap.timeline` with `power3.out`, staggering character
    image, glow, badge, sub, `.name-line` (`y: 100, rotateX: 30`, stagger `0.15`), tagline, desc,
    actions, social icons, scroll hint across a 1.6s score.
  - `initMangaPanels()` (L274–311) — per-panel `gsap.fromTo` from a direction table
    (`[-80,40,-2°]`, `[80,0,2°]`, `[0,80,0°]`, `[60,40,-1°]`) with `ScrollTrigger` at `top 85%` and
    `toggleActions: 'play none none none'`, plus a scrubbed `y: -25` parallax on `.panel-img`.
  - `initMirrorDividers()` (L195–215) — `.mirror-text-top` in from `x: -60`, `.mirror-text-bot` from
    `x: 60`, both triggered at `top 80%`.
- `style.css` — `.mirror-divider` / `.mirror-text-top` / `.mirror-text-bot` (L703–731): the mirror
  effect is `transform: scaleY(-1)` plus a `mask-image: linear-gradient(to bottom, rgba(0,0,0,.6), transparent 80%)`
  fade at opacity `.08` / `.04`. `.manga-grid` / `.manga-panel` at L1136–1252 with
  `panel-large` / `panel-tall` / `panel-wide` size variants and hover image/overlay transitions.
- `index.html` — the `.manga-grid > .manga-panel > (.panel-img, .panel-overlay, .panel-content >
  (.panel-label, .panel-title, .panel-desc, .panel-tech, .panel-link))` structure.
- **Explicitly out of scope:** all `images/goku-*.jpg` (copyrighted anime artwork), the Lucide CDN
  script, and the remaining ~20 `init*` functions (`initPreloader`, `initCursor`, `initParticles`,
  `initCounters`, `initSkillBars`, `initSideDots`, …).

---

## 2. Licensing and permissions

**The repository owner has stated that he holds reuse authorization for these sources.** A missing
public `LICENSE` file does not invalidate a separate, direct authorization, so the absence of one
upstream is recorded here as context rather than treated as a blocker.

What the public repositories show, from inspection at the pinned SHAs:

| Source | License file in repo | README statement |
|---|---|---|
| `jjk-domain-expansion` | None | No licence, copyright, or usage statement anywhere |
| `Cursed-Energy` | None | Only a fan-work disclaimer ("fan-made project inspired by *Jujutsu Kaisen*") |
| `Anime-Portfolio` | None | README §License: "MIT License - free to use and modify", plus an MIT badge |

`docs/source-permissions.md` is the authorization record. It states, per source, the exact scope and
provenance of the authorization being relied on: who granted it, when, through what medium, and which
files and uses it covers. Fields that only the owner can supply are marked as outstanding in that file
rather than assumed here.

**The standing rule, independent of the above:** do not publish third-party code unless the
authorization or applicable licence actually covers that use. Scope is per-source and per-file — an
authorization covering one repository's rendering code does not extend to another's, and nothing here
grants rights over the underlying franchise. Where `Anime-Portfolio`'s README MIT grant is the basis,
MIT's condition that the copyright and permission notice be retained still applies (§2.1).

Separately: **Jujutsu Kaisen itself is Gege Akutami / Shueisha intellectual property.** The names,
characters, and imagery are not ours to ship, and no authorization from these repository owners could
convey them. This project therefore takes only the *rendering algorithms* (particle math, projection,
compositing) and ships them under Marc's own naming and palette. No JJK character names, no domain
names, no Japanese technique titles, and no JJK media files appear in the product. Internal code
comments may cite the originating technique for attribution and traceability.

### 2.1 Attribution requirements

Every adapted file carries a header in this exact form, with no placeholders left unfilled:

```ts
/*
 * Adapted from <repo>/<path> @ <full-40-char-sha>
 * Source: https://github.com/<owner>/<repo>
 * Author: <upstream author>
 * Authorization: <MIT (per README) | owner-held authorization, see docs/source-permissions.md>
 *
 * Changes: <one line per substantive change, e.g. "removed DOMAINS coupling; added teardown()">
 * Deviations: <any departure from upstream appearance, with reason; see docs/fidelity-notes.md>
 */
```

`docs/source-audit.md` already exists in this repo and must gain a row per adapted file.
`docs/source-permissions.md` holds the authorization record. `docs/fidelity-notes.md` holds the
upstream-comparison evidence required by §5.6.

---

## 3. Verified baseline architecture

What exists today, read from the tree. New code must integrate with these, not replace them.

| Area | Files | Notes relevant to integration |
|---|---|---|
| Shell | [app/layout.tsx](app/layout.tsx), [app/globals.css](app/globals.css) | `metadata.title` is `"AFTERIMAGE"`. Globals define the `--color-*` / `--space-*` token set and a global `prefers-reduced-motion` block that clamps all animation to `0.01ms`. |
| Homepage | [app/page.tsx](app/page.tsx), [components/home-intro.tsx](components/home-intro.tsx), [components/home-environment.tsx](components/home-environment.tsx), [components/home-scene.tsx](components/home-scene.tsx), [components/home.module.css](components/home.module.css) (996 lines) | `home-scene.tsx` is a **1920×1080 hand-authored SVG** Victorian-gothic night city, split into depth layers (`FAR`/`MID`/`TOWER`/`CATHEDRAL`/`NEAR`), procedurally generated via a seeded `prng`. No external art. `home-environment.tsx` owns pointer parallax over `[data-depth]` layers, a live clock, an `IntersectionObserver`, and full listener teardown. |
| Home intro | [components/home-intro.tsx](components/home-intro.tsx) | Phase machine `opening → reveal → ready` via `data-phase`; SVG `feDisplacementMap` ink reveal with a Safari/capability fallback (`data-mask-fallback`); a "Skip intro" button; `introSeenInTab` module flag so client nav skips the intro. **`leaveForProjects()` already implements a 620 ms departure delay before `router.push("/projects")` and sets `data-departing="true"`** — this is the exact hook for the Z-tunnel. |
| Projects | [app/projects/page.tsx](app/projects/page.tsx), [components/project-carousel.tsx](components/project-carousel.tsx) (1218 lines) | A full three.js tarot carousel: explicit WebGL1/2 context fallback, `powerPreference: "low-power"`, `maxPixelRatio` clamp, `IntersectionObserver` + `visibilitychange` render gating, `webglcontextlost` recovery, `aria-roledescription="carousel"`, keyboard nav, pointer capture, and exhaustive dispose on unmount. **Must not be modified beyond adding an overlay.** |
| About | [app/about/page.tsx](app/about/page.tsx) | Server component, 120 lines: bio, skills grid from `data/skills.ts`, social links. No animation today. |
| Photography | `public/images/home/` | **All four required photographs already exist**: `graduation.webp`, `workshop-ctoc.webp`, `beach-adventure.webp`, `campus-goat.webp`. `graduation.webp` (1152×1536) is the current portrait; `workshop-ctoc.webp` is already used in the home "field note". |

---

## 4. File-level integration map

### 4.1 New files

| New file | Adapted from | What is taken |
|---|---|---|
| `components/fx/particle-system.ts` | `jjk-domain-expansion/src/engine/particles.ts` @ `69d2b8d` | The `ParticleSystem` class, kept whole: tunnel-ring seeding, `update()`, `drawZTunnel()` (speed lines + geometry rings), `draw()`, `setMaxParticles()`, `getActiveCount()`. JJK-prop particle branches (`talisman`, `katana`, `coin`, `suture`) are dropped; `spark`, `smoke`, `lightning`, `shadow` are kept. `DomainId` is replaced by a local `FxMood` union. |
| `components/fx/fx-types.ts` | `jjk-domain-expansion/src/types.ts` | Only `Particle`, `SlashCut`, and the fields of `RenderPipelineConfig` we honour. Renamed to project vocabulary. |
| `components/fx/portal-transition.ts` | `jjk-domain-expansion/src/engine/renderer.ts` L477–642, L1023–1074, L858–889 | `renderPortalDepthTunnel`, `drawImpactFrame` (+ `focusLineSeeds`), `drawFractureOverlays`, extracted as **standalone pure functions** taking an explicit context/config object instead of reading `DomainRenderer` instance state. |
| `components/fx/z-tunnel-overlay.tsx` | new glue | Client component. Mounts a fixed, `pointer-events: none`, `aria-hidden` 2D canvas; drives `ParticleSystem.drawZTunnel()` + the portal functions for the Home→Projects departure. Owns its own RAF, resize, and teardown. |
| `components/fx/impact-overlay.tsx` | new glue | Client component. Short-lived (~400 ms) canvas impact burst for the Projects page. Self-unmounts. |
| `components/fx/cursed-particle-field.tsx` | `Cursed-Energy/src/components/JJKScene.tsx` | The three.js particle cloud: `BufferGeometry` + `position`/`color`/`size` attributes, the target-array lerp loop, `EffectComposer` + `RenderPass` + `UnrealBloomPass`. **Rebuilt as a lifecycle-correct Next client component** (see §6.2, §6.5). |
| `components/fx/field-shapes.ts` | `Cursed-Energy` `JJKScene.tsx` shape fns + `src/lib/techniques/black-flash.ts`, `dismantle.ts` | `getVoid`, `getPurple` (verbatim math, renamed `shapeLuminousVoid`, `shapeVioletCore`), `getBlackFlash`, `getDismantle` (renamed `shapeImpactBurst`, `shapeFractureSlash`). Each keeps its exact banded-zone constants. |
| `components/fx/use-reduced-motion.ts` | new | Shared `matchMedia("(prefers-reduced-motion: reduce)")` hook with change subscription. Every effect in this plan gates on it. |
| `components/manga-panel.tsx` + `components/manga-panel.module.css` | `Anime-Portfolio` `index.html` + `style.css` L1136–1252 | The `.manga-panel` structure and `panel-large`/`panel-tall`/`panel-wide` grid variants, retokenized to this project's `--color-*` / `--space-*` variables. |
| `components/mirror-divider.tsx` + `components/mirror-divider.module.css` | `Anime-Portfolio` `style.css` L703–731 | The `scaleY(-1)` + `mask-image` mirror text effect. |
| `components/about-motion.tsx` | `Anime-Portfolio` `script.js` `initHeroAnimations`, `initMangaPanels`, `initMirrorDividers` | The three GSAP timelines, ported to a client component with `gsap.context()` scoping and React 19 StrictMode-safe cleanup. |
| `data/about-panels.ts` | new | Panel content pairing each of Marc's four real photographs with its caption and alt text. |
| `scripts/generate-plates.mjs` | new | Dev-time headless-Chrome script that renders `/` and `/projects` into the transition plate set (§5.2.5). Run manually; not part of `next build`. |
| `public/images/transition/*.webp` | new, ours | Pre-generated portal plates from our own visuals. No third-party imagery. |
| `docs/source-permissions.md` | new | The §2 authorization record. |
| `docs/fidelity-notes.md` | new | The §5.6 upstream-comparison record and deviation log. |

### 4.2 Modified files

| File | Change | Risk |
|---|---|---|
| [app/layout.tsx](app/layout.tsx) | `metadata.title`/`description` → MARC'S WORLD. | None |
| [components/home-intro.tsx](components/home-intro.tsx) | Title `AFTER`/`IMAGE` → `MARC'S`/`WORLD`; lazily mount `ZTunnelOverlay` inside the existing `leaveForProjects()` departure window. | Medium — must not break the `introSeenInTab` flag, the skip button, or the reduced-motion early return. |
| [data/home.ts](data/home.ts) | Set `ownerName: "Marc Alexis"`; refresh `statement`. | None |
| [components/home.module.css](components/home.module.css) | Twilight palette shift (§5.2); add a stacking context for the new overlay. | Medium — 996 lines of tuned values; change tokens, not structure. |
| [components/home-scene.tsx](components/home-scene.tsx) | Lighten to luminous twilight by adjusting the sky/rim/glow constants and layer opacities. | Medium — keep the `prng` seeds untouched so the skyline silhouette is unchanged. |
| [app/globals.css](app/globals.css) | Add twilight tokens alongside the existing night tokens. | Low |
| [app/projects/page.tsx](app/projects/page.tsx) | Mount the lazy `ImpactOverlay` beside `ProjectCarousel`. | Low — sibling, not a wrapper. |
| [app/about/page.tsx](app/about/page.tsx) | Add the manga-panel photo section + mirror dividers; keep bio/skills/social intact. | Low |
| [package.json](package.json) | Add `gsap`. | Low |

### 4.3 Explicitly NOT imported

Vite configs and app shells; `react-router-dom`; all Radix/shadcn/`lucide-react`/`@tanstack`/`sonner`
packages; `Cursed-Energy/src/index.css` and `tailwind.config.ts`; `jjk-domain-expansion`'s `audio.ts`,
`world3d/*`, `worldMap.ts`, `data/domains.ts`, `style.css`, and `video/` pipeline; MediaPipe
(`@mediapipe/hands`, `camera_utils`, `drawing_utils`) and `gesture-detection.ts`; `blood.ts` (requires
hand tracking); every `goku-*.jpg` and every JJK image/audio asset; the Lucide CDN script; the ~20
unrequested `init*` functions.

---

## 5. Integration design

### 5.1 Homepage — MARC'S WORLD, a substantial visual redesign

Phase 1 is a **redesign, not a recolour**. The target is a homepage that reads as substantially
brighter and more visually engaging on first load, with the Lord-of-Mysteries architecture preserved
and the JJK-inspired energy already visually prominent — all of it static (CSS/SVG), since the ported
WebGL work lands in Phases 2–4.

- **Rebrand:** title becomes `MARC'S` / `WORLD` across the two existing `<span>`s in `home-intro.tsx`,
  so `home.module.css`'s `.title` sizing continues to apply. `data/home.ts` sets `ownerName: "Marc"`.
- **Luminous twilight, substantially brighter.** The scene moves from near-black night to a true
  twilight: a lifted sky gradient, a visible horizon glow behind the skyline, a brighter and warmer
  moon halo, markedly stronger window lights, and a legible rim light on every architectural plane
  (`farRim`, `midRim`, `towerRim`, `nearRim`). The `scrim`, `veil`, and `grain` overlays are rebalanced
  — today they crush the composition toward black, and they are the single largest brightness lever.
  The `prng` seeds (`buildSkyline` seeds, `STARS` seed `404`) are **not** touched, so the silhouette
  is geometrically identical and the change is chromatic and tonal.
- **Prominent static energy.** New SVG/CSS atmosphere drawn for this project, layered around the
  architecture so the energy reads immediately without WebGL: a cursed-energy aura behind the clock
  tower and cathedral, vertical energy plumes rising off the rooftops, a violet/cyan rift glow on the
  horizon, and ember motes drifting through the mid-ground. This is **original artwork in the idiom**,
  authored in `home-scene.tsx` alongside the existing city — explicitly *not* a CSS re-implementation
  of any sourced algorithm, and it does not pre-empt or substitute for the real ported particle work
  in Phase 4, which replaces the motes with `shapeLuminousVoid` geometry when it lands.
- **Stronger composition.** The hero is recomposed so typography and portrait read as one designed
  unit rather than two columns sharing a row: the title overlaps the portrait frame's edge, an energy
  aura sits behind the title's baseline, the eyebrow/lede/actions column gains a clearer vertical
  rhythm, and the portrait frame is restyled with a brighter gilt treatment and an energy backing so
  it anchors the right side instead of floating. Mobile keeps a single-column order with the portrait
  behind the copy, as today, but at higher contrast.
- **Phase 4 follow-on (not Phase 1):** `CursedParticleField` later mounts behind the city at low
  opacity running `shapeLuminousVoid` in the project's palette, bloom at the neutral end (≈1.2),
  lazily imported, never under reduced motion or on small viewports.

### 5.2 Home → Projects — Z-tunnel and portal

`leaveForProjects()` already pauses 620 ms before `router.push("/projects")`. That window is the
transition, and it already bails out under reduced motion.

1. On click, mount `ZTunnelOverlay` (lazy, `ssr: false`) as a fixed full-viewport 2D canvas above the
   homepage.
2. Drive a synthetic `progress` 0→1 across the 620 ms with an eased ramp, feeding
   `ParticleSystem.update()` a `scrollVelocity` derived from that ramp so the **real** upstream
   `zSpeed = 2.8 + scrollVelocity * 1800` ring motion and the `velMag`-scaled 24 speed lines play as
   authored.
3. `drawZTunnel()` renders with the focal point set to the "Explore Projects" button's centre,
   normalized — the upstream function already takes `focalX`/`focalY`, so the tunnel converges on the
   control the user actually clicked.
4. **The portal runs the full original image-plate mechanics as the primary desktop path**:
   `renderPortalDepthTunnel`'s outgoing-plate zoom (`pow(maxZoom, easeInOut)`), the `maxZoom * 1.28`
   peripheral parallax ring, the incoming plate emerging from the vanishing point
   (`1/maxZoom → 1.0`), the expanding arc-clipped portal, the deep lookahead plate, and the
   screen-blended seam shockwave — all of it, not a reduced subset.
5. **Plates are pre-generated static assets, authored during development from our own final homepage
   and Projects visuals.** No runtime DOM screenshotting: no `html2canvas`, no `getDisplayMedia`, no
   live canvas capture of the page. The pipeline is a dev-time script (`scripts/generate-plates.mjs`,
   run manually, not part of `next build`) that drives headless Chrome over `/` and `/projects` at a
   fixed 1920×1080, writing a small numbered set to `public/images/transition/`:
   - `home-01.webp` … `home-03.webp` — outgoing homepage at successive zoom depths.
   - `projects-01.webp` … `projects-03.webp` — incoming Projects view, the innermost serving as the
     deep lookahead plate (`frameC`).
   These are our own rendered visuals, so they carry no third-party imagery. They are committed as
   ordinary optimized assets, budgeted at ≤150 KB each, preloaded only on the homepage, and
   regenerated whenever the homepage or Projects design changes materially.
6. **The transparent seam-only variant is retained strictly as the low-performance fallback**, chosen
   when the device is on the low capability tier (§6.6), when the plates fail to load, or when the
   first frames miss their timing budget. It is a fallback, never the desktop default.
7. Extend the existing timeout to the measured animation length (target ≤900 ms) rather than adding a
   second timer, so there remains exactly one navigation path.

### 5.3 Projects — overlay only

The 1218-line tarot carousel is not touched. `ImpactOverlay` mounts as a **sibling** of
`ProjectCarousel`, on its own 2D canvas, `pointer-events: none`, `aria-hidden="true"`, fires a single
short burst (`drawImpactFrame` focus lines + `drawFractureOverlays`) on arrival, then unmounts and
releases its canvas. It never shares a context, a RAF, or a resize listener with the carousel. See
§6.4 for the compositing constraint that forces the focus-line-only path.

### 5.4 About — rewritten biography and visual storytelling

Phase 5 is a **redesign of the page's content and narrative**, not an image strip appended to the
existing copy. The current About page is three generic blocks (a two-paragraph bio, a skills grid, a
social row) that say almost nothing specific about Marc.

- **Authentic biography.** Rewritten around real details: computer science studies at UCF, software
  engineering practice, and work across AI and robotics. The narrative is organized as a progression
  — studies → engineering practice → the AI and robotics work — rather than one undifferentiated
  paragraph.
- **Real project storytelling.** The panels tell the story of actual projects already recorded in
  `data/projects.ts`: **SpeakLab AI** (React Native + Whisper speech coaching), **Guiding Hands**
  (OpenCV/MediaPipe hand-tracking rehabilitation on Jetson Orin Nano), the **Autonomous Delivery
  Rover** (Fusion mechanical design, Raspberry Pi/ESP32/LiDAR planned), **Road Report** (hazard
  classification, Next.js + MapLibre), and **ZBXP**. Copy is drawn from those records so the two
  pages cannot drift, and the existing `status` discipline is respected: in-development and
  to-confirm work is described as such, never as shipped.
- **Owner-supplied facts.** UCF and the engineering framing come from the owner directly, not from
  the repository. They are recorded as owner-supplied in `data/about-panels.ts`, consistent with how
  `data/home.ts` and `data/experience.ts` already mark unverified values.
- **Visual storytelling.** The sourced manga-panel layout carries the real photographs, mirror
  dividers separate the narrative movements, and the skills grid is restyled to match rather than
  left as the current bare chip list. Social links are preserved.

Panels carry the four photographs already in `public/images/home/`:

| Panel | Photograph | Variant |
|---|---|---|
| 1 | `graduation.webp` | `panel-large` |
| 2 | `workshop-ctoc.webp` (cybersecurity workshop) | `panel-tall` |
| 3 | `beach-adventure.webp` | `panel-wide` |
| 4 | `campus-goat.webp` | `panel-large` |

All four use `next/image` with explicit `width`/`height` and `sizes`, real alt text written from the
photograph's content, and the existing `--color-*` tokens. `MirrorDivider` separates sections.
`AboutMotion` is a thin client component that runs the three ported GSAP timelines over the
server-rendered markup; with GSAP absent or reduced motion set, the panels are simply visible and
static — the animation is strictly additive.

### 5.6 Visual fidelity to the sources

Preserving the sourced *algorithms* is necessary but not sufficient: the adapted effects must also
look like what upstream produces. Each adapted effect is therefore compared against its upstream
demonstration before its phase is considered done.

- **Reference material.** `jjk-domain-expansion` ships `docs/media/trailer.gif` (25 MB) in-tree, and
  both JJK repos have published demos; `Anime-Portfolio` has a live GitHub Pages demo linked from its
  README. Comparison uses these plus the upstream code's own authored constants as ground truth.
  Reference captures are kept **outside** the repository (scratch only) unless a specific frame is
  needed as evidence and is ours to commit — the trailer GIF and all JJK media stay out of `public/`
  and out of git.
- **Method.** For each effect: run the upstream project locally at the pinned SHA, capture the effect,
  capture ours at the same viewport and progress point, and compare side by side for ring/particle
  density, projection rate, colour ramp, bloom falloff, and timing.
- **Record.** `docs/fidelity-notes.md` gets one entry per adapted effect: what was compared, the
  verdict, and every deviation with its technical reason. Deviations already known and accepted:
  per-vertex point size is rendered rather than silently dropped (§6.2, a fidelity *increase*), and
  the Projects impact overlay omits the blend-mode flicker it cannot composite (§6.4).
- **Rule.** Where upstream's appearance is technically achievable in this stack, match it. Where it is
  not, document precisely why in `docs/fidelity-notes.md` and in the adapted file's `Deviations:`
  header line. "Close enough" is not an acceptable entry; the reason must be technical.

---

## 6. Dependencies and compatibility risks

### 6.1 Dependencies

| Package | Action | Notes |
|---|---|---|
| `three@0.187.0` | already installed | **Verified:** `three/examples/jsm/postprocessing/{EffectComposer,RenderPass,UnrealBloomPass}.js` all exist in `node_modules`, and a probe file importing them plus setting `bloomPass.strength` **typechecks clean** under this project's `moduleResolution: "bundler"` + `@types/three@0.187.0`. Upstream wrote against three 0.160/0.186; these addon APIs are unchanged. |
| `gsap` | **add** | Not currently installed. Pin an exact version. GSAP 3.13+ ships ScrollTrigger in the free standard package — verify the pinned version's licence terms at install time. Import as a module; do **not** reproduce upstream's CDN `<script>` tags. |
| MediaPipe | **never add** | Required only by the excluded webcam path. |
| everything in §4.3 | **never add** | — |

### 6.2 `PointsMaterial` silently ignores the per-vertex `size` attribute

Upstream `JJKScene.tsx` allocates a `size` buffer attribute, writes every shape function's `s` value
into `targetSizes`, lerps it each frame, and sets `needsUpdate` — but renders with
`THREE.PointsMaterial({ size: 0.3, … })`, which has a single uniform size and **no per-point size
support**. The entire `s` channel of `getVoid`, `getPurple`, `getBlackFlash`, and `getDismantle` is
therefore dead code upstream.

This matters because the plan requires preserving sourced algorithms rather than approximating them.
Those `s` values are part of the authored look (e.g. `getVoid`'s bright ring is `s: 2.5` against the
shell's `s: 0.7` — a 3.5× size contrast that upstream never renders).

**Decision:** render with a minimal custom `ShaderMaterial` whose vertex shader does
`gl_PointSize = size * scale / -mvPosition.z` and whose fragment shader applies a soft radial falloff
with `AdditiveBlending`. This is a deliberate, documented **divergence that increases fidelity** to the
source data, and it must be recorded in the adapted file's `Changes:` header.

### 6.3 `DomainRenderer` cannot be imported wholesale

`renderer.ts` is a 1108-line class coupled to `DOMAINS` content data, a six-keyframe-per-domain image
preloader (`preloadAllKeyframes`), a `WorldMap` dependency, and an FPS telemetry HUD. Pulling it in
would drag JJK data and media into the bundle, violating the scope constraint.

Additional specific hazards in that file:

- **Leaked listener:** the constructor runs `window.addEventListener('resize', () => this.handleResize())`
  and the class exposes no teardown. Our extraction must be function-based with the caller owning the
  listener, satisfying the cleanup constraint.
- **DOM at construction:** `featherCanvas = document.createElement('canvas')` is a class-property
  initializer, so it executes on `new`, not at module evaluation. Importing the module server-side is
  therefore safe, but instantiation must still be client-only.
- The three target methods are `private` and read instance state (`this.pointerX`, `this.scrollVelocity`,
  `this.config`, `this.impactTimer`, `this.focusLineSeeds`). Extraction converts each to a pure function
  over an explicit params object.

### 6.4 Canvas blend modes need an opaque backdrop

`drawImpactFrame` builds its manga look from `globalCompositeOperation = 'saturation'`, `'difference'`,
and `'color'`. Upstream's own comment states this is *"Skipped over WebGL (blends need opaque pixels;
the 3D canvas mirrors this with a CSS filter instead)"*, and it passes a `blendCanvas` flag to switch
the path off.

Our Projects overlay sits on a transparent canvas above a transparent-context WebGL carousel
(`canvas.getContext("webgl2", { alpha: true })`). The blend path cannot work there. **The overlay
therefore runs with the equivalent of `blendCanvas = false`: focus lines and fracture overlays only.**
If the monochrome flicker is wanted later, it must come from a CSS `filter` on a wrapper, exactly as
upstream does for its 3D canvas — not from canvas compositing.

### 6.5 React 19 / Next 16 lifecycle

- `next/dynamic` with `ssr: false` is **only valid inside a Client Component** — confirmed in this
  version's own docs at `node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md` ("`ssr: false` is
  not allowed with `next/dynamic` in Server Components"). `app/projects/page.tsx` and `app/about/page.tsx`
  are server components, so each lazy overlay is mounted from a small `"use client"` wrapper, or the
  wrapper itself does the dynamic import.
- React 19 StrictMode mounts effects twice in development. Every WebGL context, RAF, GSAP timeline, and
  `ScrollTrigger` must be created and destroyed inside one `useEffect` with a complete cleanup, or
  development will accumulate contexts. GSAP work is scoped with `gsap.context()` and reverted in
  cleanup; `ScrollTrigger.getAll().forEach(t => t.kill())` for triggers created outside the context.
- Browsers cap live WebGL contexts (~8–16). The carousel already holds one. `CursedParticleField` must
  be homepage-only and must fully `dispose()` on unmount so navigation does not leak contexts.

### 6.6 Performance and mobile

- Upstream `COUNT = 20000` with a 20 k-element lerp loop **per frame** is too heavy for phones. Scale by
  capability: ~12 000 desktop, ~4 000 on `(max-width: 700px)` or `hardwareConcurrency <= 4`; clamp
  `setPixelRatio(Math.min(devicePixelRatio, 2))` as upstream does, and consider 1.5 on mobile to match
  the carousel's existing `maxPixelRatio` discipline.
- `ParticleSystem.setMaxParticles()` already clamps to 30–450; drive it from the same capability tier.
- Gate every RAF on `IntersectionObserver` + `visibilitychange`, following the pattern already proven in
  `project-carousel.tsx` and `home-environment.tsx`.
- `UnrealBloomPass` is multi-pass and the single most expensive item here; skip the composer entirely on
  the low tier and render the scene directly.

### 6.7 Removed behaviours

Upstream `JJKScene.tsx` must be stripped of: `navigator.mediaDevices` / `new window.Camera(...)` webcam
startup, the `window.Hands` MediaPipe pipeline, the `<video>` element and landmark debug canvas,
`DEBUG_MODE = true` and everything it gates, and `renderer.domElement.style.transform` screen shake
(it is a motion effect and must not run under reduced motion — if kept at all, it is gated and
amplitude-reduced). `jjk-domain-expansion`'s `audio.ts` is not imported, so no audio path exists.

### 6.8 Styling

Upstream CSS is global and written for Tailwind 3 with its own `--display`/`--text` variables. All
adapted CSS lands in **CSS Modules** (`manga-panel.module.css`, `mirror-divider.module.css`), matching
the existing convention, with values retokenized onto this project's variables. No upstream global
stylesheet is imported, and `app/globals.css` gains only additive tokens.

### 6.9 Accessibility

- Every effect canvas: `aria-hidden="true"`, `pointer-events: none`, never in the tab order.
- The carousel's keyboard navigation, `aria-roledescription`, and focus-restore behaviour are untouched.
- The homepage "Skip intro" button keeps working, and the Z-tunnel must not delay or swallow keyboard
  activation of the Projects link.
- Reduced motion is honoured at the **mount** level — effects are not mounted at all, rather than
  mounted and visually suppressed — in addition to the existing global CSS clamp.

---

## 7. Phased work

Each phase ends with `npx tsc --noEmit` clean, `npm run lint` clean, `npm run build` passing, and a
manual pass at desktop + mobile widths with reduced motion both on and off.

**Phase 0 — Authorization record.** Create `docs/source-permissions.md` recording the scope and
provenance of the owner-held authorization per source, plus the `Anime-Portfolio` README MIT statement
with its SHA. Outstanding specifics are marked as such rather than assumed.

**Phase 1 — Rebrand and visual redesign.** `layout.tsx` metadata; `MARC'S`/`WORLD` title;
`data/home.ts` `ownerName: "Marc"` and statement; the substantial brightening and recomposition of
§5.1 across `home-scene.tsx`, `home.module.css`, and additive tokens in `globals.css`; prominent
static energy artwork. Verify the skyline silhouette is unchanged (seeds untouched) and that the intro
phase machine, skip button, mask fallback, departure choreography, and reduced-motion behaviour all
still work. Deliverables: desktop and mobile screenshots, typecheck, lint, build, visual inspection.

**Phase 2 — FX foundation.** Port `particles.ts` → `components/fx/particle-system.ts` with attribution
and the JJK-prop branches dropped; add `fx-types.ts` and `use-reduced-motion.ts`. Extract the three
`renderer.ts` methods into `portal-transition.ts` as pure functions with caller-owned listeners. No UI
yet — this phase is pure, testable module work.

**Phase 3 — Home → Projects transition.** Write `scripts/generate-plates.mjs` and generate the plate
set from our own final homepage and Projects visuals (§5.2.5). Build `z-tunnel-overlay.tsx` running the
full image-plate portal mechanics as the desktop default, with the seam-only path wired as the
low-tier/plate-failure fallback. Wire it into the existing `leaveForProjects()` window; tune the eased
`scrollVelocity` ramp and focal point; extend the single navigation timeout to the measured length.
Compare against the upstream demo per §5.6. Verify reduced motion still navigates instantly via the
existing early return, and that no RAF or listener survives unmount.

**Phase 4 — Three.js particle field + Projects impact.** Build `field-shapes.ts` (verbatim shape math)
and `cursed-particle-field.tsx` with the custom `ShaderMaterial` from §6.2, capability-tiered counts, and
full disposal. Mount it on the homepage behind the city. Add `impact-overlay.tsx` as a sibling on the
Projects page, focus-lines-only per §6.4. Confirm the carousel's own context, input handling, and
disposal are untouched.

**Phase 5 — About redesign.** Add `gsap`; rewrite the biography and narrative per §5.4 using the real
UCF/engineering/AI/robotics details and the actual project records; build `manga-panel`,
`mirror-divider`, `data/about-panels.ts`, and `about-motion.tsx` with `gsap.context()` cleanup; wire the
four real photographs into the sourced panel layout; restyle the skills grid; preserve social links.
Confirm panels render correctly with JS disabled and under reduced motion.

**Phase 6 — Hardening and documentation.** Capture before/after screenshots into
`docs/screenshots/marcs-world/`; complete the §5.6 upstream comparison for every adapted effect and
finish `docs/fidelity-notes.md`; run a Lighthouse pass on `/`, `/projects`, `/about`; confirm WebGL
contexts are released across repeated navigation; complete `docs/source-audit.md` rows and every adapted
file's attribution header; write the completion report.

---

## 8. Acceptance criteria

**Provenance**
1. `docs/source-permissions.md` records, per source, the scope and provenance of the authorization
   relied upon, and the `Anime-Portfolio` README MIT statement with its SHA. No third-party code is
   published beyond what that authorization or licence covers.
2. Every adapted file carries the §2.1 header with a real 40-character SHA and a filled `Changes:` list.
3. `docs/source-audit.md` has a row per adapted file.
4. No JJK character, domain, or technique name appears in user-visible text; no JJK or `goku-*` media
   file exists in `public/`.

**Fidelity**
5. The Z-tunnel uses the upstream ring seeding, `zSpeed = 2.8 + scrollVelocity * 1800` wrap behaviour,
   `fov = min(w,h) * 0.65` projection, and 24-ray speed lines — not a CSS approximation.
6. The particle field uses the unmodified banded-zone math of `getVoid`/`getPurple`/`getBlackFlash`/
   `getDismantle`, with each shape's `s` value **actually rendered** per §6.2.
7. On desktop, the portal transition runs the **original image-plate mechanics** — outgoing-plate
   zoom, peripheral parallax ring, incoming-plate emergence from the vanishing point, deep lookahead
   plate, and the seam shockwave — driven by plates pre-generated from our own homepage and Projects
   visuals by `scripts/generate-plates.mjs`. No runtime DOM screenshotting exists anywhere in the
   shipped code. The transparent seam-only path is present only as the low-tier/plate-failure
   fallback and is never taken on a healthy desktop load.
8. The About panels use the upstream direction table, `top 85%` trigger, `toggleActions`, and scrubbed
   `y: -25` image parallax.
9. `docs/fidelity-notes.md` has an entry per adapted effect recording the upstream comparison and every
   deviation with a technical reason (§5.6).

**Redesign**
10. The homepage reads as substantially brighter and more visually engaging than the committed
    `af835c7` baseline, with the LOTM architecture intact, the energy treatment visually prominent,
    and typography and portrait composed as one unit (§5.1) — verified by side-by-side screenshots.
11. The About page presents a rewritten biography and real project storytelling (§5.4), not the prior
    generic copy with panels appended.

**Preservation**
12. The tarot carousel's behaviour is byte-for-byte unchanged apart from a sibling overlay: keyboard nav,
    pointer capture, wheel handling, context-loss recovery, and disposal all intact.
13. Every existing route (`/`, `/projects`, `/about`, `/experience`, `/resume`) renders without
    regression; the home intro phase machine, skip button, Safari mask fallback, and `introSeenInTab`
    behaviour are unchanged.
14. The city silhouette is geometrically identical to the baseline (seeds untouched); only colour,
    tone, and added atmosphere differ.

**Quality gates**
15. `npx tsc --noEmit`, `npm run lint`, and `npm run build` all pass.
16. No dependency from §4.3 appears in `package.json` or the lockfile; the only addition is `gsap`.
17. Under `prefers-reduced-motion: reduce`, no FX component mounts, no RAF runs, and navigation is
    immediate.
18. All effect canvases are `aria-hidden="true"`, `pointer-events: none`, and outside the tab order.
19. Repeated navigation between all routes leaks no WebGL context, RAF, listener, or GSAP trigger
    (verified by instrumented teardown counts in development).
20. No webcam, microphone, audio, or debug overlay code path exists anywhere in the shipped bundle.
21. Every expensive WebGL/FX module is dynamically imported and absent from the initial route payload.
22. On a mobile viewport, particle counts and pixel ratio drop to the low tier and the homepage stays
    interactive during the transition.
23. The committed plate assets in `public/images/transition/` are our own rendered visuals only, each
    ≤150 KB, and no JJK or other third-party media exists anywhere in `public/`.
