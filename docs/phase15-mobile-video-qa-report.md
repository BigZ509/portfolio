# Phase 15: fixes from the iPhone recording

**Status:** implemented and verified locally. Not committed, pushed, merged or deployed.
**Date:** 2026-11-18.
**Source:** `MOBILE-VIDEO-QA-AGENT-HANDOFF.md` (iPhone Safari screen recording, about 129 s).

## Starting point

`main` is at `485ebca` (Phase 13). The working tree also held Phase 14's mobile CSS repairs, which were uncommitted: nav touch targets, hero overlap, landscape fixes and 44 px thumbnails. Phase 14 was kept as is. Phase 15 builds on top of it and does not touch Phase 14's files: `app/globals.css`, `components/home.module.css` and `components/resume/resume.module.css`.

Three builds were compared:

| Label | What it is | Why |
| --- | --- | --- |
| `prod` | `485ebca`, exported with `git archive` | What the iPhone recording shows (the deployed site) |
| `before` | The working tree before this phase (Phase 13 + Phase 14) | The direct baseline for these changes |
| `after` | This phase | The result |

## How it was tested

| Environment | What it is | What it was used for |
| --- | --- | --- |
| **Real Mobile Safari** | iOS 26.5 Simulator, iPhone 17, driven by `safaridriver` | The main evidence. Default autoplay policy. Screenshots of both the WebView and the full device screen (with Safari's own UI). |
| Google Chrome, mobile emulation | Touch, 3× DPR | Real CDP touch swipes and taps; network and CPU throttling |
| Playwright WebKit | Safari's engine | Touch taps |
| Desktop Chrome, 1440×900 | Motion reduced, WebGL hidden | Pixel diffs |

Viewports tested:
- 320×568, 375×667, 390×844 and 430×932
- 768×1024 (portrait tablet)
- 844×390 and 667×375 (landscape)

## Fixes

### P0: Jamaica video showed iOS native controls (recording 88–95 s)

File: `components/personal-story/personal-story.tsx` and its CSS.

Before, in Safari: the large pause button, the ±10 s skip buttons and the scrubber covered the face and the water (`compare/01`).

**What changed**
- The video no longer has the `controls` attribute.
- `disablePictureInPicture` and `disableRemotePlayback` are set.
- WebKit's start-playback glyph is hidden, as a guard for Low Power Mode.

**The new control**
- A small gilt play/pause seal in the corner. The visible disc is 36 px; the touch target is 44×44.
- Its label switches between "Pause the Jamaica video" and "Play the Jamaica video".
- If the browser refuses autoplay (iOS Low Power Mode, data saver), it becomes a centred, labelled **PLAY** pill. A tap starts playback; it runs directly from the tap, so it counts as a user gesture.
- With a mouse, the seal only appears on hover or keyboard focus, as the native controls did, so the pinned desktop scene stays clean.

**Playback rules**
- The visitor's choice wins. A tap to pause stays paused through scrolling, and a tap to play works even with reduced motion.
- Scroll only decides whether the chapter is on screen. `currentTime` is never tied to scroll.
- Playback also re-syncs on `pageshow` (returning through back/forward cache) and on `visibilitychange`.

### P0: Project modal had two competing scroll regions, and Close scrolled away (31–75 s)

Files: `project-carousel.tsx/.module.css`, `project-details.tsx/.module.css`.

**Layout:** phones and portrait tablets now use one scrolling column, with media on top and the dossier below.
- The dossier is no longer its own scroll box. It uses `overflow-x: clip`, so its progress thread and chapter rail stick to the top of the screen.
- The dossier's code finds whichever element actually scrolls, so the progress bar, active-chapter tracking, first-sight reveals and rail jumps all work with either layout. It re-attaches when a rotation or resize switches layouts.

**Close:** a persistent Close sits in the top-right safe area (`env(safe-area-inset-top/right)`).
- It is shown on phones, portrait tablets and short landscape screens, where the dossier's own Close is hidden.
- The sticky rail and the masthead leave room for it.
- Initial focus and the Tab loop now skip controls hidden at the current breakpoint.

**Stage height:** set once per project, so the thumbnail strip never moves while flipping through media.
- "Wide" projects (ZBXP): about 387 px at 390 wide, down from 456. Less sword-field filler.
- "Tall" projects (Road Report, Guiding Hands): 80svh, so portrait screenshots and Shorts get more height.
- Landscape phones under 700 px wide: the stage is one screen high.

**Kept as before:** the JJK sword-field stage, the tarot emblem on tablets and desktop, Escape, scroll lock and its restoration, unmounting embeds and videos on close, and desktop geometry.

**Measured**

| | Before | After |
| --- | --- | --- |
| Close on screen after scrolling (12 viewport/project pairs, Chrome; 3 projects, Mobile Safari) | Never. In Mobile Safari it ended at y −1179. | Always. y = 6, 44×44, hit-testable. |
| Scroll lock released on close | Yes | Yes |

### P1: Black frame during quick ZBXP switching (around 49.5 s)

File: `project-media-gallery.tsx/.module.css`.

**Cause:** every switch remounted a fresh `<img>` (`key={src}`). Until the next file arrived, the dark frame background showed through.

**What changed**
- The outgoing screenshot stays painted until the incoming one has loaded *and* `decode()`d. The new one then crossfades in over 220 ms. A failed load is still shown, not hidden behind the old image.
- While the new screenshot loads, a thin gilt shimmer runs along the frame, so the old image isn't mistaken for the new one. It is static under reduced motion.
- The neighbouring screenshots and the project's video posters are preloaded at the same `sizes`, so the browser fetches the same file.

**Measured**
- Chrome, cold cache, 60 KB/s with 450 ms latency: 0 blank samples on every image switch, against 4/14 and 5/23 before.
- Mobile Safari: 0 blank samples out of 100 (`compare/04`).

### P1: ZBXP and Road Report screenshots too small to read (31–52 s)

**Phone sizing:** landscape media now spans the full usable width (about 362 px at 390 wide). Portrait media gets up to 66–68% of the stage height.

**Full-size viewer** (`compare/05`): tap a screenshot to open it. It is a nested native `<dialog>`.
- **Fit** shows the whole screenshot.
- **Actual size** (the button, or a tap on the image) shows the original file pixel for pixel and pans by scrolling. ZBXP opens at 1290 px wide, and the tapped point stays under the finger.
- Native pinch-zoom also works.
- **Close**, **Escape** or a tap outside the image return to the gallery, with focus restored to the screenshot. Safari doesn't focus a tapped button, so the screenshot is passed to the viewer explicitly.
- The viewer's `cancel`, `close` and `keydown` events don't reach the showcase's handlers, so Escape closes only the viewer.
- Touch screens show an **ENLARGE** cue on the image; a mouse gets the zoom-in cursor.

**Thumbnails:** 44×44, and 94×44 for the demo thumbnail.

### P1: Mobile navigation

Phase 14 already fixed this, so nothing new was needed. Mobile Safari measured:

| | Label size | Link height |
| --- | --- | --- |
| `prod` | (small) | 30 px |
| `after` | 12.3 px at 320 wide, 15 px from 390 | 44 px |

All five routes are kept, with no clipping at 320 px (`compare/07`).

### P1 (investigate): Black startup screen (5–8 s)

Not reproduced as an application delay.

| Measurement | First contentful paint |
| --- | --- |
| Mobile Safari, local | 210–405 ms |
| Chrome, throttled (1.6 Mbps, 4× CPU slowdown), 3 cold loads per build | 1.2–1.8 s; same before and after |

**Filmstrip** (`after/coldload-run1-*.png`):

| Time | What is on screen |
| --- | --- |
| 0.5 s | The home intro's designed dark ink veil, with the nav and **Skip Intro** already painted |
| 1.0 s | Text |
| 1.5 s | Title and portrait |

WebGL does not block content. The recording's longer black stretch most plausibly includes the iOS app-switch. Left unchanged, to preserve the intro.

### P2: Story pacing and reveals (86–103 s)

**Reveals:** on phones each aperture starts as soon as a frame's edge enters the viewport, and eases out (power3) instead of `expo.inOut`. The old ease stood still for a long time and then snapped.

**Rapid reverse scroll**
- Before: in-view photos could be left part-clipped. The video was still 33% clipped after 1.6 s, and frames were still 1–3% short of open after 3 s.
- After: all fully open.

**Photo loading:** the story's photos now start loading when the reader is within one screen of the story. Safari's lazy-load margin is small, so photos could pop in mid-reveal.

**Spacing:** phone chapters get more bottom space, so the Style heading no longer arrives while the Fun video is mid-screen.

Natural scrolling is kept: there is no mobile pinning or snapping, and reduced motion is respected.

### P2: Résumé popup

Confirmed working in Mobile Safari, with no change: **Download PDF** (`download`) and **Open PDF** (new tab, full screen with pinch-zoom on iOS) are both present, and Close is visible.

## Regression checks

- **`npm run typecheck`, `npm run lint` and `npm run build`:** all pass (exit 0) on the final tree.
- **Desktop, 1440×900, pixel diff against `before`:**
  - `/projects`, `/experience` and the ZBXP, Guiding Hands and Road Report modals: **0.000%**.
  - Home: 0.02%, text anti-aliasing noise. No home code changed in this phase.
  - `/about` differs only where intended: the native control bar is replaced by the seal, and in this full-page capture the story photos are now loaded rather than still empty under lazy loading.
- **Desktop, full motion:** the About story still pins, the boomerang plays with the seal hidden until hover, and the dossier keeps its own Close.
- **Modal suite at 390×844 (Chrome and WebKit), all five projects:**
  - the page and the showcase each scroll as one surface;
  - Close is reachable at the top and at the end;
  - closing restores scroll lock;
  - no iframe or video is left mounted after close;
  - initial focus is on a visible Close, and Escape closes;
  - the viewer opens, zooms and closes with Escape only;
  - no console errors.
- **Story video (Chrome and WebKit, with touch taps):**
  - autoplays in view and pauses out of view;
  - tap to pause holds across scrolling;
  - autoplay refusal shows **PLAY**, and a tap plays;
  - reduced motion does not autoplay, and a tap plays.
- **Horizontal overflow** in every tested modal viewport: 0.

## Evidence

Folder: `output/playwright/phase15/` (untracked, about 350 MB).

- `compare/`: side-by-side sheets. Start here.
  - `01`: video.
  - `02`: Safari modal, `prod` vs `after`.
  - `03`: Chrome modal, `before` vs `after`.
  - `04`: slow-network switch.
  - `05`: viewer.
  - `06`: landscape and tablet.
  - `07`: nav.
- `prod/`, `before/`, `after/`: raw captures.
  - `ios-*.png`: Safari WebView.
  - `ios-device-*.png`: full device screen, with Safari's own UI.
  - `chrome-*`, `webkit-*` and `desktop-1440-*` captures.
  - JSON measurement files for every run.

## Limitations and open items

1. **No physical iPhone.** "Real Mobile Safari" means the iOS 26.5 Simulator, which has:
   - no Low Power Mode (autoplay refusal was simulated by rejecting `play()` without a gesture, in Chrome; my shim didn't take effect in Playwright WebKit);
   - no network throttling;
   - no real momentum scrolling or finger input.

   In Safari, in-page buttons were activated with DOM `click()`, because `safaridriver` taps registered as long-presses (link previews). Hit-testing of the new controls was verified separately with `elementFromPoint`. Real taps were exercised in Chrome (CDP touch) and Playwright WebKit.
2. **Not checked:** 200% text zoom and Android hardware.
3. **"Tall" stage on video items:** in Road Report the first item is the 16:9 demo video, so about 70% of the stage is sword field until a portrait screenshot is selected. This is the trade-off for a thumbnail strip that never moves.
4. **Browser Back** does not close the screenshot viewer (no history entry was added, to avoid interfering with Next's router). Close, Escape and a tap outside it do.
5. **Throttled home LCP** varies from 5 to 16 s (the hero and background imagery on a slow link). Unchanged by this phase and worth a separate look.
6. **Carried over from Phase 14:** YouTube's player can capture Escape on desktop after Watch Demo; the Close button still works.

## Files changed in this phase

- `components/personal-story/personal-story.tsx`
- `components/personal-story/personal-story.module.css`
- `components/project-carousel.tsx`
- `components/project-carousel.module.css`
- `components/project-details.tsx`
- `components/project-details.module.css`
- `components/project-media-gallery.tsx`
- `components/project-media-gallery.module.css`
- `docs/phase15-mobile-video-qa-report.md` (this report)
