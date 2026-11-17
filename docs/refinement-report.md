# Post-Phase 7 Refinement Report

Baseline: `c67fe78` (Phase 7). This refinement was started by one agent and verified and finished by a second after the first hit its usage limit.

## Changes

**Homepage**
- Clock tower moved right (`TOWER_X` 1040 → 1160), and its glow, aura and clock face were dimmed so they no longer compete with the heading.
- Removed the extra layers around the portrait: the rotated double frames, the "PORTRAIT / 01" crown, the "FIG. I" caption prefix and the inner vignette. The caption now reads "Graduation day".
- Reduced the glow around the title. The aura behind the reading column is now a dark, still backdrop. Buttons are tightened to a consistent 3.25rem height.
- The intro sentence is unchanged.
- Beyond the Editor uses the approved paragraph. The CTA is still "Read my story" → `/about`.

**Workshop accuracy:** the copy now describes attending the workshop, not hosting it.
- The public heading and captions read "Attending a System Design Workshop" on Home, About and Experience.
- CTOC Labs is removed from all public headings, captions, descriptions and alt text.

**Experience**
- Entries focus on hackathon participation and attending the workshop.
- Removed the unused `draftEmploymentRecords` placeholder, which was never rendered.

**About:** the "Outside the Screen" heading is now "Away from the Keyboard".

**Project modal**
- The emblem card uses the artwork's own aspect ratio, with no padding, border or dark backing.
- The details panel has more readable type and measure, and descriptions render as separate paragraphs.

**Project copy**
- Descriptions are rewritten around purpose and engineering work, and each claim was checked against the project's repository.
- The rover's hardware stays explicitly planned.
- Jetson Orin Nano is labelled "(target)".

**Links**

| Project | Source | Demo |
| --- | --- | --- |
| SpeakLab AI | github.com/BigZ509/speaklab | — |
| Guiding Hands | github.com/BigZ509/guiding-hands | — |
| Road Report | github.com/Lockop1/Road-Report | hazard-identifier.vercel.app |
| ZBXP | github.com/BigZ509/Productivity-WebApp | zbxp.vercel.app |
| Delivery Rover | none verified | — |

- All URLs returned HTTP 200.
- GitHub lists both demos as their repositories' homepage URLs.

**Cleanup:** removed the now-unused `titleAura` keyframes.

## Verification

- `npm run typecheck`, `npm run lint` and `npm run build` all pass.
- Production server (`next start`) was driven with Playwright and system Chrome at 1440×900 and 390×844.
- **Cards:** all five tarot cards render in the WebGL carousel.
- **Dialogs:** every project opens its dialog. Each one closes with Escape and with the Close button. Focus returns to the project's own control, and a second Escape deselects.
- **Keyboard:** arrow keys and the previous/next buttons rotate the carousel. Enter on a project control opens it.
- **Emblem:** on desktop it fills its frame (194×268, transparent, 0 padding). On phones it is intentionally hidden so screenshots get the whole stage.
- **Gallery:** the Road Report gallery steps forward and back (1/2 ↔ 2/2). Projects without media show the existing empty state, with no play control.
- **Layout:** no horizontal overflow on any page at either size. The About skills accordion toggles.
- **Console:**
  - No errors, page errors, failed requests or 404s.
  - Warnings were limited to the GPU "ReadPixels" performance notices from headless software WebGL.
  - Also seen: the Next.js CSS-preload timing warning already recorded in the Phase 7 report.

Curated screenshots are in `output/playwright/refinement/`.

## Limitations

- No project videos exist. `VideoPlayer` is still implemented but could not be tested end to end with real content.
- The workshop photo itself shows a "CTOC" sign on the wall, and the asset file is named `workshop-ctoc.webp`. Neither is public copy, so both are unchanged.
- WebGL was exercised with software rendering (SwiftShader). Card centering before the dialog opens took about 4–5 s there and should be faster on real GPUs.
