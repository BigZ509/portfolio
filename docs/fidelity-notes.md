# Fidelity notes — adapted effects vs. upstream

Required by `docs/marcs-world-jjk-integration-plan.md` §5.6: every adapted effect is compared
against the upstream demonstration, and each deviation is recorded with a technical reason.

Method used in Phase 5: the upstream repository was checked out at its pinned SHA and **served and
run locally** (`python3 -m http.server`), then captured in the same headless Chrome, at the same
viewports, as our pages. Upstream captures were kept in the session scratchpad only — the upstream
demo renders third-party anime artwork (`images/goku-*.jpg`), which must not enter this repository.

---

## GarunJad/Anime-Portfolio @ `a2700feea9e022a1f95b94d971e9956173265553`

Compared: the `#projects` manga-panel grid and the `.mirror-divider` elements, at 1440×900 and
390×844.

### Verified as matching

| Behaviour | Upstream | Ours |
|---|---|---|
| Panel hover | `transform: scale(.985)`, border shifts to accent | Same values |
| Panel image | `height: 120%`, `top: -10%`, `object-fit: cover`, `transform: scale(1.05)` on hover over `0.6s` | Same |
| Overlay | Two-stop gradient to transparent at 60%, moving to 80% on hover | Same stops, recoloured to our near-black |
| Content block | Bottom-anchored, label → title → description → tech chips → link | Same order and roles |
| Panel entrance | `fromTo` opacity 0 → 1, direction table `[-80,40,-2°] [80,0,2°] [0,80,0°] [60,40,-1°]`, `scale .92 → 1`, `duration 1`, `power3.out`, ScrollTrigger `top 85%`, `toggleActions: play none none none` | Identical values, verified playing in-browser: all 9 panels reach opacity 1 as the page is scrolled |
| Image parallax | `y: -25`, `ease: none`, scrub `1.5`, `top bottom` → `bottom top` | Identical |
| Hero timeline | Staged offsets `0 / 0.3 / 0.3 / 0.4 / 0.5 / 0.9 / 1.0 / 1.15 / 1.3`, `power3.out`, heading stagger `0.15` with `y: 100, rotateX: 30` | Identical values, mapped to our elements |
| Mirror divider | `scaleY(-1)` reflection with `mask-image: linear-gradient(to bottom, rgba(0,0,0,.6), transparent 80%)`, paired low opacities | Same technique, violet-tinted reflection |

### Deviations, with reasons

1. **Asymmetric panel grid restored.** Upstream declares `.panel-large`, `.panel-tall` and
   `.panel-wide`, then immediately neutralizes all three with
   `grid-column: span 1 !important; grid-row: span 1 !important`. Running the demo confirms the
   result: three equal 650px pillars, with the variants dead. We implement the composition those
   class names describe. *Reason:* the brief asks for the original composition idea, and upstream's
   own override contradicts its own declarations.

2. **`aspect-ratio` instead of `grid-auto-rows: 650px`.** Upstream fixes row height at 650px desktop
   and 350px mobile. All four of our photographs are 1152×1536 (3:4 portrait), which those fixed
   heights crop to a letterbox through the heads. Our slots carry portrait-safe ratios instead.
   *Reason:* upstream's rows are tuned for its own landscape artwork.

3. **`.panel-number` is actually used.** Upstream styles `.panel-number` (a 6rem faint numeral that
   lifts on hover) but renders no element with that class, so it never appears in the demo. We
   render it. *Reason:* the style is part of the sourced design and the markup slot is free; this
   adds upstream's intent rather than departing from it.

4. **Mobile divider type is responsive.** Upstream drops to a flat `font-size: 3rem`, which suits
   its short labels ("SUBJECT FILE" measures 310px inside a 390px divider). Ours run to 18
   characters, so the size is responsive.
   **Correction to an earlier draft of our port:** we had added `white-space: nowrap`, which upstream
   does *not* set — its computed value is `normal`, verified against the running demo. That addition
   made "BEYOND THE SCREEN" render as "'OND THE SCRE" inside the `overflow: hidden` container on a
   phone. The `nowrap` was removed, which both fixes the clipping and restores upstream behaviour.
   Verified unclipped at 360, 390, 768 and 1440.

5. **`cursor: none` dropped.** Upstream hides the system cursor over panels because it renders a
   custom cursor via `initCursor()`, which we do not port. Keeping it would leave visitors with no
   pointer at all.

6. **Reduced-motion branch added.** Upstream has none. With `prefers-reduced-motion: reduce`, we
   create no GSAP timelines or ScrollTriggers at all and the page renders in its final state —
   verified: zero inline styles on panels, all opacities 1.

7. **Module imports instead of CDN.** Upstream loads GSAP and ScrollTrigger from cdnjs script tags.
   We import `gsap@3.15.1` as a module, per the plan's constraint against CDN tags.

8. **Scoped selectors and context cleanup.** Upstream queries global classes once on
   `DOMContentLoaded`. We resolve `data-*` hooks inside a scoped root and wrap everything in
   `gsap.context()`, reverted on unmount, so React 19 StrictMode's double effect cannot duplicate
   timelines. *Reason:* framework requirement, no visual effect.

### Not yet compared

Nothing outstanding for Phase 5. The JJK particle and portal work (Phases 2–4) has not begun; its
entries will be added here when it does.
