# MARC'S WORLD — Phase 6 report

**Status: paused at the first review gate, after Stage B.** Local work only — not committed, not
pushed, not deployed.

Sequence agreed with the owner: **Audit → Naruto skills → review → LOTM cards → review → JJK
effects → final visual polish.** This report covers the first two and will be extended at each
later gate.

| Stage | Status |
|---|---|
| A — Audit and visual targets | **Complete** → [`marcs-world-phase-6-audit.md`](marcs-world-phase-6-audit.md) |
| B — Naruto skills integration | **Complete and verified** — awaiting review |
| C — LOTM tarot artwork | **Not started. Blocked on an artwork-rights decision** (§3) |
| D — JJK particle and portal effects | Not started. Precondition outstanding (§4) |
| E — Art direction and writing | Not started. `marcs-world-phase-6-art-direction.md` will be written here |

---

## 1. Stage A — audit

Ten defects, ranked and individually verified, are in the audit. The ones that drive the remaining
stages:

1. The Projects archive renders five near-identical geometric fallback cards — an asset problem; the
   pipeline is complete.
2. Tools of the Trade was a static grid of identical boxes — **fixed in Stage B**.
3. About and Experience grounds differ by one RGB step (`#2a3163` vs `#29305f`).
4. Ten identical "…in the showcase" CTAs all land on `/projects` with nothing selected; the carousel
   has no deep-link support.
5. The same five projects are described three times across About, Experience and Projects.

## 2. Stage B — Naruto skills

### What was built

The static Chapter 04 grid on About is replaced by a port of the four-element skills section from
`rishabhaiml/Portfolio` @ `411b99a`, built from the actual source and compared against it running.

| File | Role |
|---|---|
| `components/skills/chakra-skills.tsx` | Client component. Svelte reactive state → `useState`; `onMount` → `useEffect` with observer teardown |
| `components/skills/chakra-skills.module.css` | The upstream `<style>` block, ported in full |
| `components/skills/element-sigil.tsx` | Original sigil filling the Sharingan watermark slot |
| `data/skills.ts` | Groups renamed and reordered to the brief's four categories |

Marc's skills map onto upstream's elements in upstream's order:

| Element | Kanji | Group | Skills |
|---|---|---|---|
| Lightning | 雷 | AI, vision & real-time systems | OpenCV, MediaPipe, Whisper, WebSockets, UDP, MapLibre GL |
| Fire | 火 | Software engineering & APIs | React, Next.js, React Native, Expo, Node.js, Express, PostgreSQL, Firebase |
| Earth | 土 | Robotics, hardware & CAD | Autodesk Fusion, Jetson Orin Nano, Raspberry Pi, ESP32 |
| Water | 水 | Languages & development tools | TypeScript, JavaScript, Python, C, C++, Three.js, WebGL, Git |

None of Rishabh's skill claims were copied.

### Preserved from the source

Four interactive cards in a 2×2, 800px grid; coloured seal rings with kanji; the watermark slot and
its animation; click-to-expand with one card open at a time; the active border, glow and radial tint;
the energy line travelling along the top edge; the rotating chevron; the staggered reveal; the
pentagon diagram; both responsive breakpoints; and every duration and the
`cubic-bezier(.16, 1, .3, 1)` curve.

### Fidelity, measured against the running upstream

- Card width **388px — exact**. Idle height **201px vs 196px** (+2.5%, font metrics).
- The expanded card's row partner **stretches and centres its content**, as in upstream.
- The hover lift is **masked after reveal**, as in upstream — a cascade quirk of the `forwards` fill,
  reproduced deliberately.

Eleven deviations are recorded in [`fidelity-notes.md`](fidelity-notes.md), each with a reason. The
ones you would notice:

- **No Sharingan.** The watermark slot holds an original sigil — the classical alchemical sign for
  each element inside a slowly turning tick ring. The MIT grant covers Rishabh's code, not Kishimoto's
  designs.
- **No sound** on open, and no "Lightning Release" naming.
- **Accessible accordion markup** instead of upstream's list-inside-a-button.

### Verification

| Check | Result |
|---|---|
| `npm run typecheck` / `lint` / `build` | Pass / pass / pass |
| Keyboard | Enter and Space toggle; Tab moves between cards; visible element-coloured focus ring |
| Single-open | Opening card 2 closes card 1; a second press closes card 2 |
| Accessibility tree | Four buttons, named by title + subtitle only; only the open list exposed |
| Reduced motion | No reveal, energy line, pulse or sigil rotation; expansion still works |
| JavaScript disabled | All four cards visible and readable |
| Overflow | **0 px** at 1440, 1280, 768, 390 and 360; no clipped lists at any width |
| Teardown | Three client-side round trips About ↔ Experience: no errors, no duplicate observers |
| Audio | No `<audio>` elements |

Screenshots: `docs/screenshots/phase-6/stageB-skills-desktop-idle.png`,
`stageB-skills-desktop-open.png`, `stageB-skills-mobile-open.png`,
`stageB-skills-keyboard-focus.png`, alongside `baseline-about-tools-desktop.png` and
`baseline-about-tools-mobile.png` for the before state.

### Known visual differences from upstream

- 5px taller idle cards, from Avenir Next vs Outfit.
- The sigils read as finer line work than upstream's solid eyes at the same 5% opacity.
- Our cards sit on the About page's mid-navy ground rather than upstream's near-black, so they read
  as dark panels on a lit page rather than slightly lighter panels on a dark one. Stage E's
  colour work for About is where that relationship should be settled.

---

## 3. Decision needed before Stage C — tarot artwork rights

**The five card illustrations cannot come from the referenced LOTM decks.** The two links are
merchandise storefronts; a shop selling physical cards grants no right to publish their artwork,
which belongs to its illustrators and the *Lord of Mysteries* rights holders. The reuse authorization
on file covers the code repositories — not this art. Full reasoning in audit §3.2.

The pipeline is ready for any of these; nothing in the code needs to change:

1. **You obtain a licence** or licensed files from the rights holder, with web-publication terms.
2. **Commission** original LOTM-idiom illustrations with a written grant.
3. **I author five original full-card illustrations** in code (SVG → WebP), as the homepage city was
   drawn — ornate frames, illustrated scenes, per-card palettes, integrated numeral and identity.
   Legally clean and immediate, but original work *inspired by* the LOTM tarot, labelled as such.
4. **You supply images** from a tool whose terms give you publication rights.

My recommendation is **3 now**, swappable for 1 or 2 later with no code change.

## 4. Precondition before Stage D

`docs/source-permissions.md` §1 and §2 — `jjk-domain-expansion` and `Cursed-Energy` — still have
blank provenance: grantor, date, medium, scope in the grantor's words, and whether public
redistribution is covered. Both the plan and this brief require that before the adapted code is
published. If you can supply those five items for each, Stage D can ship when it's done.
