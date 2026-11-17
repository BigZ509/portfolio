# Source authorization record

Authorization basis for the third-party code adapted under
[docs/marcs-world-jjk-integration-plan.md](marcs-world-jjk-integration-plan.md).

**Standing rule:** do not publish third-party code unless the authorization or applicable licence
actually covers that use. Scope is per-source and per-file. An authorization covering one
repository's rendering code does not extend to another repository, and no authorization from these
owners conveys rights over the underlying franchise (see §4).

---

## 1. Nafiz001/jjk-domain-expansion

- **Commit relied upon:** `69d2b8dca8a2c3f9fdea221dd131ff5722b84c7b`
- **Public licence in repository:** none. No `LICENSE` file; no copyright or usage statement in
  `README.md` or any source file (verified by inspection at the above SHA).
- **Basis relied upon:** reuse authorization held by the repository owner (Marc).
- **Provenance:** stated by Marc to Claude Code in the working session of **2026-11-16**, in the
  review of this plan, as: *"I have stated that I have reuse authorization."* Recorded as asserted by
  the owner; not independently verified against upstream by Claude.
- **Files now adapted for the Infinite Void background:**
  `src/engine/world3d/shared.ts` (scene utilities),
  `src/engine/world3d/zones.ts` (Infinite Void scene and helpers), and
  `src/engine/world3d/index.ts` (the `World3D` renderer). The local adaptations are
  `components/infinite-void/shared.ts`, `build-infinite-void.ts`, and `void-renderer.ts`;
  each header records the specific portions used and the changes made. The earlier plan's
  proposed `src/engine/particles.ts`, `renderer.ts`, and `types.ts` portions are not the
  source of this implementation.
- **Phase 7 modal realm:** the same pinned `src/engine/world3d/zones.ts`
  `buildAuthenticMutualLove()` builder and `src/engine/world3d/shared.ts` field/particle helpers
  were adapted into `components/mutual-love/build-mutual-love.ts` and
  `components/mutual-love/mutual-love-renderer.ts`. The latter holds the source's opening camera
  composition as a project-detail backdrop. This remains covered only by the owner's asserted
  authorization; the upstream repository has no public licence grant.
- **Intended use:** adaptation into a personal portfolio website, published publicly, with
  attribution headers per plan §2.1.
- **Outstanding — to be supplied by the owner:**
  - [ ] Grantor identity (the upstream author, or the specific party who granted it)
  - [ ] Date the authorization was obtained
  - [ ] Medium and evidence (email, GitHub issue, direct message — and a link or copy)
  - [ ] Exact scope as granted, in the grantor's own words
  - [ ] Confirm that the grant covers the three `world3d/` files now adapted
  - [ ] Whether public redistribution of the adapted code is covered

## 2. rajnil9/Cursed-Energy

- **Commit relied upon:** `1bddf052bc39dd5ea3521be9c4606efa04a7465d`
- **Public licence in repository:** none. No `LICENSE` file. `README.md` carries only a fan-work
  disclaimer: *"This is a fan-made project inspired by Jujutsu Kaisen."*
- **Basis relied upon:** reuse authorization held by the repository owner (Marc).
- **Provenance:** as recorded in §1 — same statement, same session, 2026-11-16. Recorded as asserted
  by the owner; not independently verified against upstream by Claude.
- **Files covered by the intended use:** `src/components/JJKScene.tsx` — the particle-geometry,
  buffer-attribute, lerp-loop and bloom setup, and the `getVoid` / `getPurple` shape functions;
  `src/lib/techniques/black-flash.ts`; `src/lib/techniques/dismantle.ts`.
- **Not used:** `blood.ts`, `gesture-detection.ts`, `chimera-shadow-domain.ts`, the Vite app shell,
  the React Router pages, the shadcn/Radix UI layer, and `src/index.css`.
- **Intended use:** adaptation into a personal portfolio website, published publicly, with
  attribution headers per plan §2.1.
- **Outstanding — to be supplied by the owner:** same five items as §1.

## 3. GarunJad/Anime-Portfolio

- **Commit relied upon:** `a2700feea9e022a1f95b94d971e9956173265553`
- **Public licence in repository:** no `LICENSE` file, but `README.md` states a licence. Verbatim,
  from `README.md` §License at the above SHA:

  > ## 📜 License
  > MIT License - free to use and modify.

  The README also carries an MIT badge: `![License](https://img.shields.io/badge/License-MIT-purple.svg)`.
- **Basis relied upon:** the above MIT grant as published in the repository README, together with the
  owner-held authorization recorded in §1.
- **Files covered by the intended use:** `script.js` — `initHeroAnimations`, `initMangaPanels`,
  `initMirrorDividers`; `style.css` — the `.mirror-divider` / `.mirror-text-*` rules (L703–731) and
  the `.manga-grid` / `.manga-panel` rules (L1136–1252); `index.html` — the manga-panel markup
  structure.
- **MIT condition:** the copyright and permission notice must be retained. Because the repository
  ships no `LICENSE` file and no copyright line, the adapted files' attribution headers name
  `GarunJad` as the copyright holder and cite the README grant and SHA as the source of the licence
  term. **If a full MIT notice is needed, request the canonical text and copyright line from the
  author.**
- **Not used:** every `images/goku-*.jpg` (third-party anime artwork), the Lucide CDN script, and the
  remaining `init*` functions.
- **Outstanding — courtesy requests:**
  - [ ] Ask the author to add an actual `LICENSE` file with the copyright line
  - [ ] Confirm the README MIT statement covers the files listed above

---

## 4. Franchise intellectual property

Jujutsu Kaisen is the intellectual property of Gege Akutami and Shueisha. None of the authorizations
above can convey any right in it, and none is claimed. This project ships **only rendering algorithms**
— particle math, perspective projection, canvas compositing — under Marc's own naming, palette, and
artwork.

Accordingly, the product contains no JJK character names, no visible domain or technique names, no
Japanese technique titles, and no JJK media files. Internal code comments may cite an originating
technique name for attribution and traceability only. Phase 7 adds third-party LOTM tarot card
illustrations with owner-asserted permission; see §8 and the artwork manifest.

---

## 5. Status

| Source | Basis | In use? | Record complete? |
|---|---|---|---|
| `jjk-domain-expansion` | Owner-held authorization (asserted 2026-11-16 and reiterated in Phase 7) | **Yes, Infinite Void background and Phase 7 project modal realm** | No — §1 specifics outstanding |
| `Cursed-Energy` | Owner-held authorization (asserted 2026-11-16) | Not yet — Phases 2–4 | No — §2 specifics outstanding |
| `Anime-Portfolio` | README MIT grant + owner-held authorization | **Yes, since Phase 5** | Partly — canonical notice outstanding |
| `rishabhaiml/Portfolio` | README MIT grant ("for your own portfolio") | **Yes, since Phase 6** | Partly — canonical notice outstanding (§7) |

The outstanding items for sources 1 and 2 do not block Phases 1 or 5, neither of which uses their
code. They should be completed before any adapted code from those two sources is published.

## 6. Phase 5 usage record (`Anime-Portfolio`)

As of Phase 5 this repository ships code adapted from `Anime-Portfolio`, relying on the README MIT
grant quoted in §3. The adapted files are listed in `docs/source-audit.md` under "MARC'S WORLD —
adapted source register", each carrying the attribution header required by the plan's §2.1:

- `components/manga-panel.module.css`, `components/manga-panel.tsx`
- `components/mirror-divider.module.css`, `components/mirror-divider.tsx`
- `components/about-motion.tsx`

No upstream media, fonts, CDN scripts or global stylesheets were copied. The upstream demo was run
locally for the appearance comparison recorded in `docs/fidelity-notes.md`; those captures were kept
outside this repository because the demo renders third-party anime artwork.

**Still outstanding for this source:** the canonical MIT copyright line. The upstream repository has
no `LICENSE` file and no copyright notice, so our headers name `GarunJad` as the holder and cite the
README grant plus the pinned SHA as the licence's source. Ask the author to add a `LICENSE` file, or
supply the copyright line, so the notice can be reproduced exactly as MIT requires.

---

## 7. rishabhaiml/Portfolio (Naruto skills section) — added Phase 6

- **Commit relied upon:** `411b99a1890562c65f25e3d35b694d3ef8d0f223`
- **Public licence in repository:** no `LICENSE` file. `README.md` §License states, verbatim:

  > ## 📄 License
  >
  > MIT License - Feel free to use for your own portfolio!

- **Basis relied upon:** the README MIT grant above. Its own wording ("for your own portfolio")
  matches this use exactly.
- **Files covered by the intended use:** `src/lib/sections/SkillsSection.svelte` — its markup
  structure, reactive toggle logic, IntersectionObserver reveal and the full `<style>` block.
- **Adapted into:** `components/skills/chakra-skills.tsx`, `components/skills/chakra-skills.module.css`.
  Both carry the plan's §2.1 attribution header.
- **MIT condition:** the copyright and permission notice must be retained. As with `Anime-Portfolio`,
  upstream ships no `LICENSE` file or copyright line, so the headers name `rishabhaiml` as holder and
  cite the README grant and SHA. **Outstanding:** request the canonical copyright line or a `LICENSE`
  file from the author.

### What this grant does not cover

The MIT grant is Rishabh's, over Rishabh's code. It conveys nothing over **Naruto**, which is the
intellectual property of Masashi Kishimoto and Shueisha. The upstream code depicts franchise material
that is therefore **not** used here:

| Upstream material | Status |
|---|---|
| `SharinganEye.svelte` — Mangekyō Sharingan designs tied to specific characters (Sasuke, Itachi, Madara, Shisui, Obito) | **Not used.** Replaced by an original sigil, `components/skills/element-sigil.tsx` |
| `src/lib/assets/effects/*.mp3`, `quotes/*.opus`, `theme/*.opus` — character voice lines and themes | **Not used.** Plan constraint: no audio; also franchise audio |
| "Lightning Release", "Chakra Nature", "Jutsu" naming | **Not used** in visible text |
| Rishabh's own skill claims | **Not used.** Cards are built from `data/skills.ts` |

The kanji 雷 火 土 水 are ordinary Japanese characters for the classical elements and are retained.
The sigil's inner glyphs are the classical alchemical element symbols, which are public domain.

---

## 8. Selected LOTM tarot card illustrations — added Phase 7

The owner explicitly asserted permission to use the five exact card images specified in the Phase 7
brief. This is not an independently verified public licence, and the grantor, terms and evidence of
the permission are not in this repository. The source page and exact file URLs are recorded in
[`docs/tarot-artwork-manifest.md`](tarot-artwork-manifest.md). The images were converted without
cropping or resizing and are used in the card carousel, expanded project view and static fallback.
This assertion does not imply general rights to other LOTM artwork or franchise material.
