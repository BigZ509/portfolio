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
- **Files covered by the intended use:** `src/engine/particles.ts`;
  `src/engine/renderer.ts` — only `renderPortalDepthTunnel`, `drawImpactFrame`, and
  `drawFractureOverlays`; `src/types.ts` — only the `Particle` and `SlashCut` shapes.
- **Intended use:** adaptation into a personal portfolio website, published publicly, with
  attribution headers per plan §2.1.
- **Outstanding — to be supplied by the owner:**
  - [ ] Grantor identity (the upstream author, or the specific party who granted it)
  - [ ] Date the authorization was obtained
  - [ ] Medium and evidence (email, GitHub issue, direct message — and a link or copy)
  - [ ] Exact scope as granted, in the grantor's own words
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

Accordingly, the product contains no JJK character names, no domain or technique names, no Japanese
technique titles, and no JJK media files. Internal code comments may cite an originating technique
name for attribution and traceability only. All `public/` media is Marc's own photography or artwork
generated for this project.

---

## 5. Status

| Source | Basis | Record complete? |
|---|---|---|
| `jjk-domain-expansion` | Owner-held authorization (asserted 2026-11-16) | No — §1 specifics outstanding |
| `Cursed-Energy` | Owner-held authorization (asserted 2026-11-16) | No — §2 specifics outstanding |
| `Anime-Portfolio` | README MIT grant + owner-held authorization | Partly — canonical notice outstanding |

The outstanding items above do not block Phase 1, which touches no third-party code. They should be
completed before the adapted code from sources 1 and 2 is published.
