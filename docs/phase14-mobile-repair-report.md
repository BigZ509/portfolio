# Phase 14 — Mobile repair report

Status: **implemented and verified locally. Not committed, pushed, merged or deployed.**
Date: 2026-11-18. Baseline: `main` at `485ebca` (Phase 13), clean working tree apart from untracked kit files.

Scope was mobile-only. No content, copy, art, features or desktop layouts were changed. All fixes are CSS, scoped to phone, tablet-portrait or short-landscape media queries.

## 1. Issues found before any change

Method: a production build (`next build` + `next start`) audited at **320×568, 360×740, 375×667, 390×844, 430×932, 768×1024, 844×390 and 1440×900**:
- every route in Chrome (mobile emulation: touch, `isMobile`, 2× DPR);
- all five project modals and the résumé popup at 320, 375, 390, 430, 768 and 844×390;
- in-page measurements of overflow, overlaps, text glyph boxes outside the viewport, small text, and tap-target sizes.

Screenshots are in `output/playwright/phase14/before/`.

| # | Severity | URL / viewport | Component / selector | Observed symptom |
| --- | --- | --- | --- | --- |
| 1 | High | `/` at 320×568, 360×740, 375×667 | `components/home.module.css` `.portrait` (absolute, `bottom:5rem`) | The graduation photo overlapped the lede and the actions. At 320×568 it covered "Explore Projects" (photo y 251–488 over button y 361–413). At 375×667 "About Me →" was drawn on top of the photo. See `before/chrome-home-320x568.png` and `before/chrome-home-375x667.png`. |
| 2 | High | `/` at 844×390 (phone landscape) | `.footerRule` (`top: calc(100svh − 3rem)`) and `.hero` (`min-height: 730px`) | The "EST. IN CURIOSITY ✦ SCROLL TO EXPLORE" rule ran through the word "WORLD". The title and actions sat below the first screen (CTA y 495–547 in a 390px-high viewport). |
| 3 | High | `/about` at 844×390 | `personal-story.module.css` ≤900px frames (`width:54%` etc.) | Story media sized only by width: the 9:16 boomerang was about 455×810px, more than twice the screen height. The photos were similarly oversized. |
| 4 | High | Résumé popup at 844×390 | `resume.module.css` `.document { min-height:18rem }` | The PDF frame ended at y 453 in a dialog ending at y 374. The frame and its gilt corner were clipped by the dialog. |
| 5 | Medium | All routes ≤700px | `app/globals.css` mobile nav rule | Nav links were 28–31px tall, under the 44px target, with labels at 11px (320) to 13px (390–430). |
| 6 | Medium | `/about` at 320×568 | `.adventure h3` (`clamp(4.5rem,15vw,7rem)` = 72px) | "Adventure?" glyphs reached x=342 in a 320px viewport; the page's `overflow-x: clip` cut off the "?". |
| 7 | Medium | Project modals at 768×1024 | `project-carousel.module.css` `.dialogLayout` (desktop split above 700px) | The gallery got a ~384px column: the screenshot was 238×134, and the caption broke as "Trial Scrolls quest / board" with "1 / / 6". |
| 8 | Low | Project modals ≤700px | `project-media-gallery.module.css` `.thumb` | Thumbnails were 36×44px, narrower than 44px. |

**Checked and not defects:**
- No horizontal page overflow at any size.
- Experience and résumé pages fine at 320.
- Skill tree expands and fits at 320.
- Landscape project modals use a workable side-by-side layout.
- Desktop unaffected.
- The mobile nav hides the "MARC'S WORLD" wordmark on purpose (documented in `globals.css`); left as designed.

## 2. Fixes

| # | File | Change (all inside mobile, tablet or short-landscape queries) |
| --- | --- | --- |
| 1 | `components/home.module.css` | ≤700px: the portrait joins the hero column in normal flow (`position:relative`, `align-self:flex-end`, `margin-top:auto`). Tall phones still settle it bottom-right; short phones place it below the actions. The copy keeps a 1.75rem gap. CTA labels go 0.65rem → 0.72rem and the eyebrow 0.58rem → 0.66rem (about 9–10px up to about 11.5px). |
| 2 | `components/home.module.css` | ≤700px and short landscape (≤500px tall, ≥701px wide): `.footerRule` sits in flow just under the hero, so it can never cross content. Short landscape also gets a compact hero (`min-height:100svh`, title `clamp(3.4rem,7.5vw,4.8rem)`, smaller lede margin, portrait `max-width:44svh`). |
| 3 | `components/personal-story/personal-story.module.css` | ≤900px: frames are capped by viewport height (video `78svh×9/16`, night `62svh×3/4`, coat `80svh×3/4`, snowboard pair `66svh×3/4`). Portrait phones are unaffected, because their width percentages are the smaller limit. |
| 4 | `components/resume/resume.module.css` | ≤500px tall: the eyebrow and seal are hidden, the title is smaller and spacing tighter, and `min-height:0` on the in-dialog PDF/fallback lets the viewer take the remaining height. |
| 5 | `app/globals.css` | ≤700px nav: each link is `inline-flex` with a 44px minimum height, labels `clamp(12px, 3.85vw, 15px)`, and container padding 4px/10px (the bar stays 52px tall). All five destinations kept; the Resume popup is unchanged. |
| 6 | `components/personal-story/personal-story.module.css` | ≤900px: `.adventure h3 { font-size: min(clamp(4.5rem,15vw,7rem), 19vw) }`. Unchanged from 360px upward (72px); about 61px at 320. |
| 7 | `components/project-carousel.module.css` | Portrait tablets 701–900px wide: a stacked modal (`50dvh` stage over the Fieldbook) like phones, keeping the tarot emblem. Landscape tablets and desktop keep the split. |
| 8 | `components/project-media-gallery.module.css` | ≤700px: thumbnails 44×44px. |

No TypeScript, data, copy, media or desktop rules changed. No `!important` was added. GSAP, the Infinite Void, the WebGL carousel, the video encode and the Phase 13 noise tile are untouched.

## 3. After: verification matrix

Chrome = installed Google Chrome with mobile emulation. WebKit = Playwright WebKit 27.2 (Safari's engine). **No real iOS or Android device was used.**

| Route / view | 320×568 | 390×844 | 430×932 | 768×1024 | 844×390 | 1440×900 |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | ✅ no overlap (photo below CTAs) | ✅ | ✅ | ✅ unchanged | ✅ title and CTAs in first screen; rule under hero | ✅ pixel-identical |
| `/projects` | ✅ | ✅ | ✅ | ✅ | ✅ (cards begin low; scroll) | ✅ pixel-identical |
| `/about` | ✅ "Adventure?" fits | ✅ | ✅ | ✅ | ✅ media within viewport height | ✅ pixel-identical |
| `/experience` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ pixel-identical |
| `/resume` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (PDF render noise only) |
| Modal: Guiding Hands (portrait video) | ✅ 44px thumbs | ✅ | ✅ | ✅ stacked, media 254×339 | ✅ split | ✅ pixel-identical (ZBXP checked) |
| Modal: ZBXP / Road Report (16:9 video) | ✅ | ✅ | ✅ | ✅ stacked, media 477×266 (was 238×134) | ✅ | ✅ |
| Résumé popup | ✅ | ✅ | ✅ | ✅ | ✅ PDF inside dialog (y 134–363 of 8–382) | ✅ pixel-identical |

Measured after the fixes, Chrome and WebKit:
- **Horizontal overflow:** 0 on every route and viewport.
- **Clipped text:** none, apart from `sr-only` text and the mirror divider's pre-animation offset, which settles in bounds.
- **Hero overlaps:** none at any size.
- **Nav links ≤700px:** all 44px tall; labels 12.3px (320), 13.9px (360), 14.4px (375), 15px (390+).
- **WebKit audit:** 32 route views and 30 modal views, 0 flags.

### Desktop regression

The committed baseline (`485ebca`, built separately) and the current build were screenshotted with WebGL hidden and motion off, then pixel-diffed:
- 1440×900: `/`, `/projects`, `/about`, `/experience`, `/resume`, the ZBXP modal and the résumé popup all show **0% changed pixels** (home 0.005%: anti-aliasing).
- 1920×1080: 0% on all routes except `/resume`. That differs between runs even baseline against baseline (Chrome's PDF viewer render timing), so it is not a regression.
- The desktop pinned About story is unchanged: Fun/Style/Adventure, video play/pause, one pin, rapid scroll.

### Functional and touch tests (Chrome, synthesized touch input)

- **Touch flows at 390×844 and 320×568: 22/22.**
  - A vertical swipe over the carousel scrolls the page (no trap), and a horizontal swipe turns the carousel (30% of the card area changes vs 0% idle).
  - Tapping the centred card opens its dossier. Swiping the dossier scrolls it while the page behind stays locked.
  - Tapping a thumbnail selects it, and tapping Close closes and unlocks the page.
  - Touch-scrolling to Fun plays the boomerang (`currentTime` advances), and continuing to Style pauses it.
  - Tapping Resume opens the popup with Close, actions and an in-bounds viewer; tapping Close dismisses it. No console errors.
- **Project modals (Fieldbook suite) at 390, 768 (now stacked) and 1440: 51/51 at each size.**
  - Covered: focus on Close; chapter rail; flow diagrams; reading progress; no clipping; Tab containment; Escape closing; ZBXP's 6 media items with loaded pixels; Watch Demo mounting `c4OYbEZnBus`; unmount on media switch and on close; reopening; Live/Source links; the Guiding Hands and Road Report demos.
  - Steps that close *during YouTube playback* use the Close button, because of Known issue #1 (pre-existing). Escape-closing is still tested before any embed is mounted.
  - The first run, which used Escape, stopped at that step on both the current build and the untouched baseline.
- **Résumé and LinkedIn: 34/35.** The failure is a transient focus sample during Chrome's hand-off to its PDF viewer, also seen in Phase 13. A settled trace shows focus stays in the dialog.
- **Mobile story reveal (Chrome and WebKit, 390 and 768, plus reduced motion):** frames masked below the fold, open on entry, video plays in view, re-mask on scroll-up. Reduced motion: all unmasked, no autoplay.
- **Regression:** all routes 200 with no console errors; Infinite Void canvas live; the skill tree's 4 sections expand; the tarot carousel and dossier open and close.
- **Checks:** `npm run typecheck`, `npm run lint` and `npm run build` all pass (exit 0).

### Evidence

- **Before** (`output/playwright/phase14/before/`) and **after** (`output/playwright/phase14/after/`) at identical viewports:
  - `chrome-<route>-<WxH>.png`, plus full-page `-full.png` ≤430.
  - `chrome-modal-<project>-<WxH>.png`.
  - `chrome-resume-popup-<WxH>.png`.
  - `chrome-about-story-<chapter>-<WxH>.png`.
  - `after/` also has `webkit-*` equivalents.
- **Key pairs:**
  - `chrome-home-320x568.png`, `chrome-home-375x667.png`, `chrome-home-844x390.png`;
  - `chrome-about-story-adventure-320x568.png`, `chrome-about-story-fun-844x390.png`;
  - `chrome-modal-zbxp-768x1024.png`;
  - `chrome-resume-popup-844x390.png`.
- **Recording:** `after/phase14-mobile-touch-flow-390x844.webm` (home → Projects by tap → carousel swipe → open dossier → scroll it → tap a thumbnail → Close → About story by touch scrolling).
- **Measurement data:** `before/chrome-routes-findings.json`, `before/chrome-modals-findings.json`, and the `after/` equivalents.

## 4. Known remaining issues

1. **Medium, pre-existing, third party (desktop/keyboard).** About a second after Watch Demo, YouTube's autoplaying player takes keyboard focus; Escape then goes to the cross-origin iframe and doesn't close the project dialog. The Close button still closes it and removes the iframe. It reproduces identically on the committed baseline, and our code only focuses the player wrapper. It does not affect touch use. To reproduce: desktop → `/projects` → ZBXP → Watch Demo → wait 2 s → Escape.
2. **Medium, untested.** Playwright's WebKit closes the page when it instantiates the `<object type="application/pdf">` used on `/resume` and in the popup. This happens on the baseline too, even with the PDF request blocked, so `/resume` and the popup were checked in Chrome only. Real Safari, iOS (inline first-page rendering) and Android Chrome (in-theme Open/Download fallback) still need checking on a device.
3. **Low.** Phone landscape `/projects`: the WebGL card row starts in the lower part of the first screen, so the cards need a short scroll. They remain selectable; left unchanged to avoid reworking the carousel stage.
4. **Low.** Short phones (≤375×667): the project dossier gets about 260–307px under the media stage. It scrolls normally with a sticky chapter rail; the split was kept so screenshots and video aren't shrunk.
5. **Low, design.** Some decorative uppercase labels stay around 10px on phones ("Origins", "Fig. I", experience tags), matching their desktop styling.
6. **Not tested.** No real iOS or Android devices, no real browser-chrome resizing (dynamic toolbars), and no real momentum scrolling. Touch was synthesized through Chrome DevTools.

## 5. Files changed

- `app/globals.css`
- `components/home.module.css`
- `components/personal-story/personal-story.module.css`
- `components/project-carousel.module.css`
- `components/project-media-gallery.module.css`
- `components/resume/resume.module.css`
- `docs/phase14-mobile-repair-report.md` (this report)

Evidence lives under the untracked `output/playwright/phase14/` (before about 121 MB, after about 298 MB, including full-page and WebKit captures).
