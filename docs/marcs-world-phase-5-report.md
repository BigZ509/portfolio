# MARC'S WORLD — Phase 5 report: personal storytelling & manga-inspired About redesign

Date: 2026-11-16. Scope: Phase 5 of
[docs/marcs-world-jjk-integration-plan.md](marcs-world-jjk-integration-plan.md).
Local work only — **not committed, not pushed, not deployed.**

**No JJK particle or portal work was started.** The Three.js carousel engine was not modified.

---

## 1. Before / after analysis

| Area | Before | After |
|---|---|---|
| **Homepage copy** | "I build software, intelligent systems, and robots for the real world." Accurate but impersonal, with a redundant "By Marc" under the giant wordmark. | "Hey, I'm Marc. I study computer science at UCF, and I build things that bring software into the real world." Byline removed — the lede now does that job. |
| **Homepage second section** | "Ideas are meant to leave the page," linking to Experience. | "Beyond the editor." — concrete about the move from code to something people use, linking into the redesigned About. |
| **About** | One bordered bio box of generic copy, a flat grid of 21 identical skill badges, three social buttons. Nothing specific to Marc. | Five chapters: the person, what he builds, beyond the screen, tools, and an invitation — with real photographs in an asymmetric manga-panel gallery and sourced GSAP choreography. |
| **Experience** | A single card reading "Software Engineer / To be confirmed / 2024 — Present", plus "Experience details are being finalized". | Six honestly-labelled entries (Project / Hackathon / Workshop) drawn from verified project records, with no employment claim anywhere. |
| **Road Report panel** | "Status to be confirmed" badge; a description ending "…was mentioned in the project brief but was not verified in the inspected repository"; "No public links yet." | No status badge, description carries only supported statements, empty Links section omitted. Carousel, gallery and layout untouched. |
| **Mobile navbar** | On every non-home route the wordmark wrapped to two lines and pushed "Resume" out of sight. | All five destinations fit at 360 and 390 px on all five routes. |

Measured: the About page went from 2,654 px of mostly-empty bordered boxes to a 6,260 px illustrated
narrative on desktop; Experience from one placeholder card to six substantiated entries.

## 2. Upstream files and functions reused

From **GarunJad/Anime-Portfolio @ `a2700feea9e022a1f95b94d971e9956173265553`**, under the README MIT
grant plus the owner-held authorization in [docs/source-permissions.md](source-permissions.md):

| Ours | Upstream | Taken |
|---|---|---|
| `components/about-motion.tsx` | `script.js` L140–153, L195–215, L274–311 | `initHeroAnimations()`, `initMirrorDividers()`, `initMangaPanels()` — every duration, delay, ease and stagger, the four-entry panel direction table, the `top 85%` / `toggleActions: play none none none` trigger, and the scrubbed `y: -25` image parallax |
| `components/manga-panel.module.css` | `style.css` L1136–1312 | `.manga-grid`, `.manga-panel` + hover, `.panel-img` (120% height / −10% top / 1.05 hover), both `.panel-overlay` gradients, `.panel-content`, `.panel-label`, `.panel-number`, `.panel-title`, `.panel-desc`, `.panel-tech`, `.panel-link` |
| `components/manga-panel.tsx` | `index.html` L330–386 | The panel element structure and stacking order |
| `components/mirror-divider.module.css` / `.tsx` | `style.css` L703–731, `index.html` L161–165 | The `scaleY(-1)` reflection and its `mask-image` fade |

`gsap@3.15.1` added as an exact-pinned module dependency (ScrollTrigger and types ship in the free
standard package). **No CDN script tags, no upstream global CSS, no `goku-*.jpg` artwork, and none of
the other ~20 `init*` functions.** Full register in [docs/source-audit.md](source-audit.md).

### Upstream comparison

The upstream project was **checked out at the pinned SHA and run locally**, then captured in the same
headless Chrome at the same viewports. Findings and all eight deviations are recorded in
[docs/fidelity-notes.md](fidelity-notes.md). Two are worth surfacing here:

- **Upstream's own panel variants are dead code.** It declares `.panel-large` / `.panel-tall` /
  `.panel-wide`, then overrides all three with `span 1 !important`. The running demo is three equal
  650 px pillars. We implement the composition the class names describe, as the brief asked.
- **A bug the comparison caught in our own port.** We had added `white-space: nowrap` to the mirror
  divider; upstream's computed value is `normal`. That addition made "BEYOND THE SCREEN" render as
  "'OND THE SCRE" inside the `overflow: hidden` container on a phone. Removing it both fixed the
  clipping and restored upstream behaviour — verified unclipped at 360, 390, 768 and 1440.

## 3. Story and biography changes

**Chapter 01 — The person behind the projects.** Opens on the graduation photograph with the
owner-supplied introduction (UCF computer science; building across software, AI and robotics),
extended with two paragraphs on *how* he works — starting from a question he can't answer yet and
building the smallest honest version. No invented events, roles, awards or history.

**Chapter 02 — What I build.** Five asymmetric cards, one per real project in `data/projects.ts`,
each written as an engineering interest rather than a technology list. The rover is explicitly
flagged "In development" and its copy states the design exists but it has not been assembled or
driven. The Road Report card carries its genuine screenshot.

**Chapter 03 — Beyond the screen.** The manga-panel gallery, using all four of the owner's
photographs at portrait-safe ratios, with captions describing only what is visible.

**Chapter 04 — Tools of the trade.** The skills list regrouped from four taxonomy buckets into four
capability groups, each with a plain-language line about what it is for. No percentages, rankings or
year counts. `data/skills.ts` now records an `evidence` field per skill — either the project slugs
that demonstrate it or `"owner"` for owner-stated skills.

**Chapter 05 — Connect.** A personal invitation, with only verified destinations rendered (see §7).

## 4. Experience placeholder remediation

`data/experience.ts` was rewritten. The `Software Engineer / To be confirmed / 2024 — Present` record
is **no longer rendered anywhere**; it is preserved as `draftEmploymentRecords`, unexported from the
page and marked "INTERNAL DRAFT — NOT FOR DISPLAY", so the intent survives without publishing an
unverified employment claim. The "Experience details are being finalized" note is gone.

The public page is now a record of engineering work, explicitly framed as such: *"I'm a computer
science student, so this is a record of engineering work rather than an employment history."* Six
entries carry a kind badge — Project, Hackathon or Workshop — so Road Report reads as hackathon work,
not a job. **No entry has a date**, because none is established; the `period` field exists and is
simply omitted rather than guessed.

Verified in-browser: the rendered page contains no "To be confirmed", no "Software Engineer", and no
"being finalized".

## 5. Project-detail copy changes

A content and presentation cleanup only — `components/project-carousel.tsx` was not touched.

- `components/project-details.tsx`: `to-confirm` now maps to `null` and the badge is **omitted**
  rather than printing "Status to be confirmed". The internal value is untouched in the data for
  future verification. `in-development` is still shown, because it is a real status.
- The Links section is omitted entirely when a project has no public links, instead of announcing
  "No public links yet."
- `data/projects.ts`: four descriptions rewritten to drop maintainer-facing audit language. The Road
  Report geohash sentence and the ZBXP "completion status … have not been confirmed" sentence moved
  into code comments marked *not shown publicly*, so the caveat survives for maintainers while the
  visitor-facing copy states only what is supported. No demo URLs, GitHub links, features or metrics
  were invented.

## 6. Photographs used — and a correction

All four are the owner's own, already in `public/images/home/`, all 1152×1536 (3:4 portrait).
**Each was opened and inspected before its alt text was written**, which caught a pre-existing error:

> The workshop photograph was captioned repository-wide as *"a student-led cybersecurity workshop"*.
> The screens actually read **"Sebastian's System Design Workshop"** and show system-design diagrams.
> "CTOC" is the room branding on the wall — Cyber Technology Operations Center — not the topic.

Corrected everywhere (homepage figure, About gallery, Experience entry). The photo is taken from the
audience, so the Experience entry records attendance and claims no presenting or organizing role, per
the brief.

| File | Content | Used in |
|---|---|---|
| `graduation.webp` | Marc in cap and gown outside an arena | Homepage portrait, About Ch01 hero, Ch03 panel 04 |
| `workshop-ctoc.webp` | System design workshop at CTOC Labs, viewed from the audience | Homepage field note, Ch03 panel 02 |
| `beach-adventure.webp` | Marc in shallow turquoise water, arms raised, by a red car-shaped watercraft | Ch03 panel 01 |
| `campus-goat.webp` | Marc holding a small goat on a campus lawn | Ch03 panel 03 |

No substitute people were generated and no upstream artwork was used.

## 7. Contact destinations — needs your input

`data/social-links.ts` shipped **template placeholders that looked like working links**:
`https://github.com/`, `https://linkedin.com/in/` and `mailto:contact@example.com`. These send
visitors nowhere, and publishing them is the same class of problem as the Experience placeholder.

Each entry now carries a `verified` flag and only verified links render:

- **GitHub → `https://github.com/BigZ509`** — published. Evidenced by this repository's own origin
  remote. Please confirm it is the profile you want linked.
- **LinkedIn** — withheld. Give me the profile URL and I'll publish it.
- **Email** — withheld. I did not publish the address on your machine's git/account config, because
  putting a personal address on a public page is your call, not mine. Tell me which address you want
  shown and I'll wire it up.

## 8. Responsive and accessibility findings

Verified at **1440×900, 1280×800, 768×1024, 390×844 and 360×740**, across `/`, `/about`,
`/experience` and `/projects`: **zero horizontal overflow in all twenty combinations.**

- **Mobile panel rearrangement.** The gallery goes from the asymmetric 12-column composition to two
  columns at ≤1024 px and a single 3:4 column at ≤700 px, with the offsets removed. Upstream's fixed
  350 px mobile rows were not used — they crop portrait subjects through the head.
- **Navbar defect found and fixed.** Pre-existing from Phase 1: the longer wordmark wrapped on
  phones and pushed "Resume" off-screen on every non-home route. The compact nav rule in
  `app/globals.css` had been scoped to the homepage only; it now applies site-wide. All five links
  verified inside the viewport at 360 and 390 on all five routes.
- **Reduced motion.** With `prefers-reduced-motion: reduce`, `AboutMotion` creates nothing at all —
  no timelines, no ScrollTriggers. Verified: zero inline styles on all nine panels, every opacity 1.
- **Without JavaScript.** The port uses `gsap.from`/`fromTo`, which set the hidden start state at
  runtime, so with no JS every panel, divider and hero element renders in its final visible state.
- **Semantics.** One `h1` per page; heading order `H1 → H2 → H3` throughout; every image has a real
  alt; mirrored divider copies are `aria-hidden` so the text is announced once; all 14 interactive
  elements on About are native links or buttons with visible focus from the global `:focus-visible`.
- **Carousel regression.** `aria-roledescription="carousel"`, the live region, the five select
  buttons, "Open details", the dialog's initial focus on Close, and Escape-to-close all behave
  exactly as before.

## 9. Testing results

| Check | Result |
|---|---|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run build` | Pass — all six routes prerendered static |
| All routes render | `/`, `/about`, `/experience`, `/projects`, `/resume` |
| Homepage intro | Phase machine, Skip Intro and the departure hook unaffected |
| GSAP port runs | 9 panels animate, 4 dividers, hero timeline staged; all panels reach opacity 1 on scroll |
| Carousel unchanged | Verified by interaction (select → open → Escape) |

## 10. Screenshots

In `docs/screenshots/phase-5/`, captured in real Chrome over CDP:

`before-home-desktop` · `before-home-mobile` · `before-about-desktop` · `before-about-mobile` ·
`before-experience-desktop` · `before-experience-mobile` · `before-roadreport-desktop` ·
`before-roadreport-mobile` — and the matching `after-*`, plus `after-about-tablet` (768),
`after-about-mobile-hero`, `after-about-mobile-gallery`, `after-about-mobile-tools`,
`after-about-mobile-divider`, `after-about-reduced-motion` and `after-home-fieldnote`.

All were opened and inspected, not merely generated. That inspection is what caught the mirror-divider
clipping, the navbar overflow and the mis-captioned workshop photograph.

## 11. Remaining unverified information

1. **LinkedIn URL and public email** — withheld pending your input (§7). The GitHub profile is
   inferred from the git remote and should be confirmed.
2. **C and C++** — owner-stated. No project record in this repository demonstrates either; C was
   added at your direction. Marked `evidence: ["owner"]` in `data/skills.ts`.
3. **Three.js, WebGL, Git** — also `evidence: ["owner"]`. Three.js and WebGL are in fact used by this
   portfolio's own carousel, but that is this site, not one of the listed projects.
4. **Workshop role** — the photograph establishes attendance only. If you presented or organized, say
   so and it can be stated; it is not claimed now.
5. **Project statuses** — four projects remain `to-confirm` internally. The badge is hidden rather
   than asserting completion, but the underlying verification is still outstanding.
6. **Hackathon specifics** — which hackathon Road Report was built at, when, and team size are not
   recorded anywhere, so none are stated.
7. **Dates throughout Experience** — none established, so none shown.
8. **MIT copyright line** for `Anime-Portfolio` — upstream ships no `LICENSE` file (§5 of
   source-permissions).
9. **Real-device testing** — all captures are headless Chrome with `--disable-gpu`. Safari, iOS and a
   physical phone remain untested, as does GSAP ScrollTrigger's behaviour under real momentum
   scrolling.
