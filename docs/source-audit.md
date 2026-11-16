# AFTERIMAGE reference source audit

Scope: read-only inspection of `reference/daniel-portfolio` at `d452482ab7533678bcbbcc273b067f9075421fd1` on `main` (origin `DanielWLiu07/daniel-w-liu-portfolio-website`). Findings describe source behavior; no browser run or package installation was performed. Paths below are relative to the reference root.

## Rights and dependencies

No root license or COPYING file was found by a depth-two filename search. `package.json:1-36` marks the package private and lists Next 16.3.3, React 19.2, Three 0.185.1, GSAP 3.14, React Three Fiber/Drei, Radix, Tailwind 4, MediaPipe, AWS SDK, and a vendored `blender-to-threejs` tarball. `public/shared/fonts/weddingday-font/info.txt:1` says noncommercial; `public/shared/fonts/weddingday-font/misc/ ! ! ! TERMS OF USE.txt:6-7` says personal use only. `public/draco/README.md:31` points to Draco's separate Apache license. These notices do not license Daniel's application. **Substantial source, shaders, assets, layout artwork, and exact animation expression are not cleared for reuse.** Public visibility and cloning alone grant no reuse permission. Obtain written scope from the owner and check every third-party asset separately; legal conclusion remains uncertain without a full rights review.

## Landing

`app/page.tsx:3-16` imports GSAP, mode/transition hooks, mask, tree, name, social links, and `AlphaVideo`; `app/layout.tsx:53-84` preloads paper/spinner and wraps routes in `PerformanceModeProvider` and `PageTransition`. `contexts/performance-mode-context.tsx:18-77` persists high/low mode in localStorage, showing selector on fresh home loads. `app/page.tsx:169-212` signals ready after video `playing`, error, or 10-second timeout; Lite signals immediately. `app/page.tsx:214-241` starts intro on the transition callback: name falls for 0.6s, settles for 0.4s, mask begins at 0.6s, trees and links enter at 1.5s. `app/page.tsx:67-87` pans a 150%-width backdrop 8s each way under 550px. `app/page.tsx:104-122` drives a radial sun gradient from video time in a perpetual RAF; it is not scroll parallax. `app/page.tsx:124-125` changes mask geometry at 768px. `components/landing/ink-mask-svg.tsx:27-80` uses SVG turbulence/displacement, with Safari simple fade. `app/page.tsx:266-314` layers white paper, painted background, sun/edge gradients, composite video or still, mask, name, trees, links. `components/landing/tree-overlays.tsx:12-65` supplies separate alpha videos or stills. `components/ui/alpha-video.tsx:14-52` chooses WebM vs Safari HEVC MOV by user agent.

For an original LOTM-inspired city: create an original painted city plate, moving fog/light composite with silent WebM and HEVC versions, still frames, original paper/ink texture and foreground silhouette layers; keep the verified layer order and measured timing as behavior targets. Replace name typography and every image/video URL in `app/page.tsx:270-313`, `components/landing/tree-overlays.tsx:20-61`, mask image URLs in `components/landing/ink-mask-svg.tsx:100-190`, and shared transition paper in `components/ui/page-transition/ink-mask-svg.tsx:153-211`. Use original designs evocative of fog, lamplight and occult astronomy without copying protected LOTM character art or insignia. Exact visual similarity is a rights/design decision pending authorization.

## Carousel

`app/projects/page.tsx:22-35` selects a separate `?v3` manga experiment; normal route uses `ProjectsCarousel`. `app/projects/page.tsx:38-126` owns expansion, intro, flash, loading, and a readiness gate requiring intro video plus slider; Lite skips intro. `app/projects/page.tsx:178-233` coordinates flash, carousel reveal, close/swap. Mobile panel height and body scrolling use the 865px threshold (`app/projects/page.tsx:62-103`). `components/projects/project-slider.tsx:325-349` creates a perspective camera (75° FOV, near 0.1, far 20, z=2) and transparent antialiased WebGL renderer at device pixel ratio. `lib/carousel-helpers.ts:11-24` maps camera viewport to plane width and creates geometry; `lib/carousel-helpers.ts:24-105` provides the custom card shader. `data/projects.ts:18-120` defines four Daniel projects, frames, thumbnails, content images, scene options (speed 35, gap 8, curve 8, 1.2×1.6 card), and motion constants. `lib/carousel-animation.ts:7-57` applies dominant-axis wheel impulse, trackpad damping, friction 0.92, max velocity 1.5, auto velocity 0.02, and auto restart after two seconds idle. `components/projects/project-slider.tsx:861-1079` raycasts selection; `components/projects/project-slider.tsx:1148-1211` handles wheel and horizontal touch; `components/projects/project-slider.tsx:138-166` handles keys; `components/projects/project-slider.tsx:1599-1614` updates scene motion; `components/projects/project-slider.tsx:1922-1941` eases and wraps expanded-content strip; `components/projects/project-slider.tsx:2009-2021` adds bob and tilt. Expansion is a state machine (`components/projects/project-slider.tsx:18-20`, `components/projects/project-slider.tsx:201-237`, `components/projects/project-slider.tsx:1730-1808`) with a 90° z rotation, shader crossfade, detail planes, dots and arrows; `components/projects/project-slider.tsx:2210-2268` removes listeners, cancels RAF, disposes meshes/textures/renderer. `components/projects/project-info-panel.tsx:206-395` displays metadata/links and positions the mobile detail panel.

## Navigation and other pages

The actual route transition is `components/ui/page-transition/page-transition.tsx:26-465`, mounted in `app/layout.tsx:82-85`. It intercepts internal anchor clicks (`components/ui/page-transition/page-transition.tsx:422-439`) and is also called by `components/ui/navbar.tsx:8-64`. Cover runs before `router.push`; constants are 930ms navigation delay, 250ms minimum load and 3700ms reveal (`components/ui/page-transition/constants.ts:1-5`). Destination `signalReady()` gates reveal (`components/ui/page-transition/page-transition.tsx:130-198`); no fallback timeout is present there, so a route that never signals can remain covered. Cover/reveal use separate SVGs and `triggerSvgAnimations` (`components/ui/page-transition/page-transition.tsx:320-377`, `components/ui/page-transition/page-transition.tsx:451-463`). Lite skips overlays (`components/ui/page-transition/page-transition.tsx:207-229`, `components/ui/page-transition/page-transition.tsx:389-402`). The project intro flash is a separate effect: `components/projects/intro-video.tsx:9-11` triggers at video time 0.45s with 3s readiness and 8s intro guards; `components/projects/transition-flash.tsx:13-39` renders the flash.

`app/about/page.tsx:3-13` composes background layers, mobile background, tech stack and social images; `app/about/page.tsx:65-70` changes layout below 1038px. `components/about/background-layers.tsx:100-191` uses video/still watercolor and portrait layers; `components/about/mobile-background.tsx:38-119` has distinct phone composition. `app/experience/page.tsx:3-8` composes background video, header, cards and social links; `app/experience/page.tsx:24-78` sets GSAP entrance states/timeline. `data/experience.ts:1-45` contains Daniel's employers/logos. `app/resume/page.tsx:10-42` dynamically chooses `legacy` video page for Lite, casino for capable Cinematic devices, or `stream-session` depending on query/device; `components/resume/casino/preload-casino.ts` and `components/resume/stream/stream-config.ts` are transitive runtime branches. The casino, stream and routes such as `app/shuffle`, `app/roulette`, `app/eye`, `app/blender-scene`, `app/position-editor` are specialized experiments, not required for the four-page portfolio core. `app/projects/page.tsx:22-35`'s `?v3` branch is also experimental.

## Performance and accessibility findings

The carousel runs its own RAF and full-DPR renderer (`components/projects/project-slider.tsx:341-346`, `components/projects/project-slider.tsx:2185-2191`), which risks high GPU load on phones. It has explicit disposal (`components/projects/project-slider.tsx:2210-2268`), but the audited files show no context-loss handler. Texture loading defers content and has an asset safety timer (`components/projects/project-slider.tsx:363-445`); video textures switch only after playback (`components/projects/project-slider.tsx:485-536`). Silent autoplay uses `muted` and `playsInline` on landing (`app/page.tsx:294-305`). Safari gets HEVC alpha and a simpler landing mask (`components/ui/alpha-video.tsx:14-52`, `components/landing/ink-mask-svg.tsx:27-48`). Lite removes many videos/intro effects but retains the WebGL carousel (`app/projects/page.tsx:116-126`, `components/projects/project-slider.tsx:325-346`). A targeted search of landing/projects/ui found no `prefers-reduced-motion` implementation; reduced motion must be designed explicitly. Canvas raycasting and global key handling (`components/projects/project-slider.tsx:138-166`, `components/projects/project-slider.tsx:861-1079`) require semantic card controls, focus states and screen-reader labels in AFTERIMAGE. Verify behavior in Safari/iOS, low-memory Android, keyboard-only, and motion-reduced settings before launch; source inspection alone cannot confirm runtime performance.

---

# MARC'S WORLD — adapted source register

Added in Phase 5. This section tracks files in this repository that adapt third-party source, as
required by `docs/marcs-world-jjk-integration-plan.md` §2.1. Authorization basis for each upstream
project is recorded in `docs/source-permissions.md`; appearance comparisons are in
`docs/fidelity-notes.md`.

## GarunJad/Anime-Portfolio @ `a2700feea9e022a1f95b94d971e9956173265553`

Basis: MIT stated in the upstream README (no `LICENSE` file is present in the repository), together
with the owner-held authorization recorded in `docs/source-permissions.md` §3.

| This repository | Upstream origin | What was taken |
|---|---|---|
| `components/manga-panel.module.css` | `style.css` L1136–1312 | `.manga-grid`, `.manga-panel` and its hover scale, `.panel-img` (120% height, −10% top, 1.05 hover scale), `.panel-overlay` gradient pair, `.panel-content`, `.panel-label`, `.panel-number`, `.panel-title`, `.panel-desc`, `.panel-tech`, `.panel-link` |
| `components/manga-panel.tsx` | `index.html` L330–386 | The `.manga-panel > (.panel-img, .panel-overlay, .panel-content …)` element structure and stacking order |
| `components/mirror-divider.module.css` | `style.css` L703–731 | `.mirror-divider`, `.mirror-text-top`, `.mirror-text-bot` — the `scaleY(-1)` reflection and its `mask-image` fade |
| `components/mirror-divider.tsx` | `index.html` L161–165 | The two-span divider structure |
| `components/about-motion.tsx` | `script.js` L140–153, L195–215, L274–311 | `initHeroAnimations()`, `initMirrorDividers()`, `initMangaPanels()` — all timings, eases, staggers, the panel direction table, the `top 85%` / `toggleActions` trigger and the scrubbed `y: -25` image parallax |

Not taken: every `images/goku-*.jpg` (third-party anime artwork), the Lucide CDN script, the GSAP
CDN script tags, upstream's global stylesheet and CSS variables, and the remaining ~20 `init*`
functions (`initPreloader`, `initCursor`, `initParticles`, `initCounters`, `initSkillBars`,
`initSideDots`, `initParallax`, `initDividerAnimation`, …).

Dependency added: `gsap@3.15.1` (exact pin), which ships ScrollTrigger and its TypeScript types in
the free standard package. Imported as an ES module; no CDN script tags were introduced.

## rishabhaiml/Portfolio @ `411b99a1890562c65f25e3d35b694d3ef8d0f223` — added Phase 6

Basis: MIT stated in the upstream README; code only. See `docs/source-permissions.md` §7.

| This repository | Upstream origin | What was taken |
|---|---|---|
| `components/skills/chakra-skills.tsx` | `src/lib/sections/SkillsSection.svelte` `<script>` and markup | Four-element structure and order, the `toggleElement` single-open logic, the IntersectionObserver reveal at threshold 0.2, per-card colour and glow variables, staggered `index × 0.1s` reveal, the pentagon diagram SVG |
| `components/skills/chakra-skills.module.css` | `SkillsSection.svelte` `<style>` | The full style block: grid, card, `cardAppear`, `chakraFlow`, `symbolPulse`, seal ring, kanji, watermark slot, list expansion, chevron, diagram, and both responsive breakpoints |

Not taken: `SharinganEye.svelte` and every Mangekyō variant, all audio (`effects/`, `quotes/`, `theme/`),
the global stores, `ChakraParticles`, `KamuiTransition`, `RasenganLoader`, and the rest of the site.

Original replacement: `components/skills/element-sigil.tsx` fills the watermark slot.
