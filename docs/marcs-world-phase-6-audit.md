# MARC'S WORLD — Phase 6 audit (Stage A)

Date: 2026-11-16. Baseline: commit `b3b8823` (Phase 5), working tree clean.
Method: the committed source was read, the production build was run locally and captured in real
Chrome over CDP, and the upstream Naruto skills section was **checked out at its pinned SHA, built,
and run** for side-by-side comparison. Baseline captures are in `docs/screenshots/phase-6/baseline-*`.

Passing typecheck, lint and build at `b3b8823` says nothing about the defects below — every one of
them ships green.

---

## 1. The ten most impactful defects

Ranked by how much each one undermines the site's intent. Each is verified, not inferred.

### 1. The Projects archive is five near-identical geometric cards
`data/tarot-artwork.ts` → `authorizedArtwork = {}`. With no entries, every card falls through to
`CardSymbol` — a thin gold line motif on the same dark gradient. The page that is supposed to be the
site's centrepiece (`baseline-projects-desktop.png`) is the least illustrated page on it. The
artwork pipeline itself is complete and correct (`full-card` and `panel` layouts, 2:3 texture
generation, load-failure fallback) — **this is entirely an asset and rights problem**, not code.
See §3.2 for why it cannot simply be filled from the referenced LOTM decks.

### 2. Tools of the Trade is a static template
`app/about/page.tsx` Ch04 renders four identical bordered boxes of underlined chips
(`baseline-about-tools-desktop.png`). No interaction, no per-group identity, no hierarchy — the
exact "ordinary skills cards with coloured borders" the owner asked to replace. The Naruto source
it should reuse has never been integrated.

### 3. About and Experience are colour-identical
About's ground is `linear-gradient(176deg, #2a3163 → #1b2142)`; Experience's is
`linear-gradient(178deg, #29305f → #1a2040)` — a one-step difference in a single channel. Both use
the same `rgb(32 36 70)` card fill, the same `#e2bb7c`-family gold border, the same `#d6dae6` body
text. Projects uses a third near-navy (`.atmospheric-background`). Navigating between pages produces
no change of place.

### 4. Ten identical CTAs promise a specific project and deliver a generic page
"See it in the showcase" renders five times on About and "Open it in the showcase" five times on
Experience. All ten point at `/projects`, which opens with **nothing selected** — the carousel has no
deep-link support at all (no `useSearchParams`, `location.hash` or `hashchange` handling in
`components/project-carousel.tsx`). The link text says "it"; the destination doesn't know which "it".

### 5. The same five projects are told three times
About Ch02, Experience, and the Projects details panel each describe all five projects, with largely
overlapping sentences. Experience in particular is About Ch02 restated as a timeline with bullet
points added. The pages should divide the work: About = the person, Experience = events and
decisions, Projects = technical evidence.

### 6. Defensive and process-oriented copy
- About Ch04: *"No percentages — a bar chart of my own ability would be a guess, and you can judge
  the work instead."*
- Experience: *"I'm a computer science student, so this is a record of engineering work rather than
  an employment history."*
- About Ch02: *"Five things I wanted to find out"* / *"Some are further along than others, and the
  ones that aren't say so."*

Each explains what the page *isn't* rather than showing what Marc did. They read as the site
apologising for itself. (Written in Phase 5 to avoid overclaiming; the instinct was right, the
phrasing exposes the process.)

### 7. The JJK integration plan is entirely unimplemented
The homepage energy is the Phase 1 static SVG/CSS layer (aurora, rift, motes). The Home → Projects
departure is still the CSS fog sweep. None of `particles.ts`, the portal methods from `renderer.ts`,
or the `JJKScene.tsx` particle field exists in the repository. Scheduled for after the tarot review.

### 8. Mirror dividers are dead space at desktop
Four dividers on About at `opacity: .1` (top) / `.06` (reflection) on a mid-navy ground. They
occupy roughly 200 px each and read as near-empty bands, contributing to a 6,260 px desktop page.
The effect is faithful to upstream's opacity, but upstream sits on near-black `#0a0a0a`, where the
same values read; on our lighter ground they vanish.

### 9. Experience has no visual evidence
Six text cards, zero images, though the repository holds two Road Report screenshots and the CTOC
Labs workshop photograph. It is the only content page with no photography or product imagery.

### 10. The Projects page has no framing
A centred "Projects" `h1` over the shared atmospheric gradient, then the carousel. No sense of an
archive, no lighting, nothing tying it to the Tarot conceit the cards carry. Combined with #1, the
page reads as an unstyled grid.

Minor, noted for Stage E: the About hero heading wraps to three lines at 1440; the
`CHAPTER 0N` pill + `MARC'S WORLD` kicker + heading stack repeats identically on every chapter.

---

## 2. Upstream reference: Naruto skills (Rishabh)

**Repository:** `rishabhaiml/Portfolio` @ `411b99a1890562c65f25e3d35b694d3ef8d0f223`
(SvelteKit, Svelte 5, Vite 7). Dependencies installed with `--ignore-scripts`; run with `vite dev`.
The site gates everything behind an "Initialize Chakra" button (its audio-unlock loader), which the
capture clicks through. Captures kept in scratch only — they render Sharingan franchise imagery.

### Measured behaviour (1440×900 and 390×844)

| Property | Upstream value |
|---|---|
| Grid | `repeat(2, 1fr)`, `gap: 1.5rem`, `max-width: 800px`; single column at ≤768 px |
| Card, idle | **388 × 196 px** at 1440; 362 × 144 px at 390 |
| Card, expanded | 388 × 361 px; its **grid-row partner stretches to 361 px but stays collapsed** (default `align-items: stretch`) |
| Partner content | Vertically centred — the cards are `<button>` elements, and browsers centre button content |
| Seal ring | 60 px, `2px solid` element colour, 44 px dark inner disc, serif kanji at `1.5rem / 900` |
| Watermark | 120 px Mangekyō eye, top-right `-20px`, `opacity .05`, `rotate(15deg)` → hover `opacity .15`, `rotate(0) scale(1.1)` over `.5s` |
| Active state | border → element colour, `box-shadow: 0 0 30px glow`, `translateY(-5px)`, radial card tint at `.3`, extra bottom padding |
| Energy line | 2 px gradient bar **along the top edge**, `200%` wide from `left: -100%`, `translateX(0 → 50%)` over `2s linear infinite` |
| Seal pulse | `scale(1 → 1.05 → 1)` over `1.5s ease-in-out infinite` on hover/active |
| Expansion | `max-height: 0 → 200px`, `opacity 0 → 1`, `.4s cubic-bezier(.16, 1, .3, 1)` |
| Chevron | bottom-right, `.5` opacity → element colour; `rotate(180deg)` when active |
| Entry | `cardAppear .5s ease forwards`, staggered `index × 0.1s`, on `IntersectionObserver` at `threshold .2` |
| Diagram | 120 px pentagon of five element dots, bottom-right, fades in `.8s` after `.5s`; hidden ≤768 px |

### What the MIT licence does and does not cover

The README states *"MIT License — Feel free to use for your own portfolio!"* (no `LICENSE` file).
That covers **Rishabh's code**. It does not and cannot cover Masashi Kishimoto / Shueisha's Naruto
designs, which the code depicts. Accordingly:

| Upstream element | Decision | Reason |
|---|---|---|
| Card structure, CSS, timings, curves, interactions | **Port faithfully** | Rishabh's code, MIT |
| Kanji 雷 火 土 水 | **Keep** | Ordinary Japanese characters for the classical elements |
| Element colours | **Keep** | Part of the code's design |
| `SharinganEye` watermark (Mangekyō variants: Sasuke, Itachi, Madara, Shisui) | **Replace** with an original animated sigil in the same slot, size, opacity and motion | Distinctive franchise character designs, not covered by the MIT grant |
| "Lightning Release" / "Chakra Nature" naming | **Drop** | Franchise terminology |
| `chakra-nature.mp3` on open | **Drop** | Plan constraint: no audio |
| Rishabh's skill claims | **Never copied** | Replaced with Marc's skills from `data/skills.ts` |

---

## 3. Asset and source map

### 3.1 Sources to adapt

| Source | SHA | Stage | Authorization status |
|---|---|---|---|
| `rishabhaiml/Portfolio` | `411b99a…` | **B (this stage)** | README MIT; code only, franchise imagery excluded (§2) |
| `GarunJad/Anime-Portfolio` | `a2700fe…` | In use since Phase 5 | README MIT + owner authorization |
| `Nafiz001/jjk-domain-expansion` | `69d2b8d…` | D | Owner-asserted; **provenance fields still blank** in `source-permissions.md` §1 |
| `rajnil9/Cursed-Energy` | `1bddf05…` | D | Owner-asserted; **provenance fields still blank** in `source-permissions.md` §2 |

Stage D cannot be published until §1 and §2 of `docs/source-permissions.md` record who granted the
authorization, when, through what medium, and whether public redistribution is covered. The plan
and the brief both make this a precondition.

### 3.2 Tarot artwork — a rights blocker that needs your decision at review

| Card | Slug | Required file |
|---|---|---|
| The Fool — 0 | `speaklab-ai` | `public/images/tarot/speaklab-ai.webp` |
| The World — XXI | `autonomous-delivery-rover` | `public/images/tarot/autonomous-delivery-rover.webp` |
| The Magician — I | `guiding-hands` | `public/images/tarot/guiding-hands.webp` |
| Justice — XI | `road-report` | `public/images/tarot/road-report.webp` |
| The Star — XVII | `zbxp` | `public/images/tarot/zbxp.webp` |

**None of these files exists, and the referenced decks cannot be the source.**

- `lordofmysteries.store/pages/tarot-club-cards` — checked: a Shopify storefront titled
  *"Tarot Club Cards – Lord of Mysteries Cards and Collectibles"*, with add-to-cart. No licensing
  statement was found on the page, either claiming official licence or disclaiming it.
- `lordofthemysteriesmerch.com/…/the-fool-collectors` — returned HTTP 429 (rate-limited) and was not
  retried.

A storefront selling physical cards confers no right to publish their artwork. The card designs are
copyrighted by their illustrators and the *Lord of Mysteries* rights holders (Cuttlefish That Loves
Diving / China Literature, and any merchandise licensees). The reuse authorization you hold covers
the **code repositories** above; it does not reach this artwork. Publishing it on a public portfolio
would require a licence from the rights holder — not the shop.

The brief anticipates exactly this: *"If the original artwork cannot be legally published, document
that blocker explicitly. Do not quietly replace it with generic symbols and declare success."*
Options for the review:

1. **You obtain a licence or licensed digital files** from the rights holder, with written terms
   covering web publication. They drop straight into the pipeline as `layout: "full-card"`.
2. **Commission original illustrations** in the LOTM idiom from an artist, with a written grant.
3. **I author five original full-card illustrations in code** — SVG rendered to WebP, the same way
   the homepage city was drawn — with ornate borders, illustrated scenes, distinct palettes, and the
   numeral and identity integrated. Legally clean and doable immediately, but it is *original work
   inspired by* the LOTM tarot, not LOTM artwork, and will be labelled as such.
4. **You supply images** made with a generation tool whose terms grant you publication rights.

Option 3 unblocks the visual deliverable now and can be swapped for 1 or 2 later with no code
change. That is my recommendation, but it is your call — which is why the sequence pauses here.

### 3.3 Photography and evidence available for Stage E

`public/images/home/`: `graduation`, `workshop-ctoc`, `beach-adventure`, `campus-goat`.
`public/images/projects/road-report/`: `route-comparison`, `hazard-details`.
No other project imagery exists. Guiding Hands, SpeakLab AI, the rover and ZBXP have no screenshots
in the repository.
