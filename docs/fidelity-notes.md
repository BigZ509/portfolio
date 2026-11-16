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

---

## rishabhaiml/Portfolio @ `411b99a1890562c65f25e3d35b694d3ef8d0f223` — added Phase 6, Stage B

Compared: `SkillsSection.svelte`, idle and with the first card expanded, at 1440×900 and 390×844.
Upstream was built from the pinned SHA (`npm install --ignore-scripts`, `svelte-kit sync`,
`vite dev`) and driven past its "Initialize Chakra" gate. Upstream captures are kept out of the
repository because they render Sharingan franchise imagery; ours are in
`docs/screenshots/phase-6/stageB-*`.

### Measured

| Measure | Upstream | Ours | Note |
|---|---|---|---|
| Grid | 2 columns, 800px max, 1.5rem gap | Identical | |
| Card width, 1440 | 388 px | **388 px** | Exact |
| Card height idle, 1440 | 196 px | **201 px** | +2.5%, residual font metrics (see 4) |
| Expanded card, 1440 | 361 px (5 skills) | 417 px (6 skills) | Content-driven: one more skill |
| Row partner on expand | Stretches to match, stays collapsed, content vertically centred | **Identical** | Reproduced deliberately (see 2) |
| Active-card lift | Masked by `forwards` fill of `cardAppear` | **Identical** | See 3 |
| Columns ≤768 px | 1 | 1 | |
| Energy line, seal pulse, watermark, chevron, diagram | As specified in the audit | Same values, same curves | |

### Deviations, with reasons

1. **Sharingan watermark replaced** by an original animated sigil in the same slot, at the same 120px
   size, with upstream's exact opacity, rotation and hover treatment. *Rights:* Mangekyō designs are
   Naruto franchise imagery, outside the MIT grant.
2. **Markup restructured as an accessible accordion.** Upstream nests an `<h3>` and a `<ul>` inside a
   `<button>` — invalid HTML, and it makes screen readers announce all skills as the button's name.
   Ours is `div > h3 > button[aria-expanded][aria-controls]` plus a sibling `ul` that is `inert` and
   `aria-hidden` while closed. The button is stretched over the card, so any click toggles, as
   upstream. Because upstream's cards *are* buttons, browsers vertically centre their content — which
   is why the stretched row partner sits centred in the demo. `.card` re-creates that with flexbox.
   Verified in the accessibility tree: four buttons named by title and subtitle only, and only the
   open list exposed.
3. **The masked hover lift is faithful, not a bug.** `cardAppear` uses `animation-fill-mode: forwards`,
   and a filled animation outranks normal declarations, so `translateY(-5px)` on hover never applies
   after reveal. The running demo confirms it. An earlier draft of the port added a rule trying to
   force the lift; it could not have worked and was removed.
4. **Line-height pinned to upstream's rendered values.** Upstream's text sits at `line-height: normal`
   because buttons don't inherit the page value; Outfit's "normal" is tighter than Avenir Next's.
   Matching by name rather than by result left our cards 15px taller. The label and subtitle are now
   pinned to the measured upstream boxes (1.19 and 1.12), which brought the gap from 15px to 5px.
5. **Font: Avenir Next instead of Outfit.** Upstream loads Outfit from Google Fonts. The site's existing
   geometric sans avoids a new font dependency.
6. **Muted text #666666 → #8c8c8c.** Measured ~3.0:1 against the card; WCAG AA requires 4.5:1.
7. **Lightning label text #a855f7 → #b57bf9.** 4.4:1 at 0.7rem, just under 4.5:1. Rings, borders,
   glows and the kanji (large text, 3:1) keep the exact upstream colour.
8. **Per-card `max-height`.** Upstream's fixed 200px holds exactly five skills. Two of Marc's groups
   have eight; 200px clips them. Each card now sets `--list-max` from its item count. Verified
   unclipped at all five viewports.
9. **Visible without JavaScript.** Upstream hides cards in CSS and relies on its observer to reveal
   them. Ours only arms the hidden state once JS is running. Verified with script execution disabled.
10. **Reduced motion.** Upstream has no branch. Ours disables reveal, energy line, seal pulse, sigil
    rotation and transitions; expansion still works.
11. **Removed:** the open sound, writes to upstream's global navigation stores, and "Release" naming.

### Not yet compared


The JJK particle and portal sources (`jjk-domain-expansion`, `Cursed-Energy`) are scheduled for
Phase 6 Stage D, after the tarot review. Their entries will be added here when that work lands.
