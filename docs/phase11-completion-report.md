# Phase 11 completion report — Cinematic personality reveal

Status: **implementation complete and verified locally. Not committed, pushed, merged, or deployed.**
Date: 2026-11-17

## 1. Summary

The About page's former MangaGrid ("Away from the Keyboard") is replaced by `PersonalStory`, a scroll-only story. It opens with the question *"What's he like outside of school and coding?"*, followed by three chapters:

| Chapter | Media | Behaviour |
| --- | --- | --- |
| **Fun?** | Jamaica boomerang (MP4) + Jamaica night photo | Video plays at normal speed only while Fun is on screen and pauses everywhere else. Both frames open with the GSAP Vault aperture clip. |
| **Style?** | Trench-coat photo | Image Clip Reveal from the left, reversing on upward scroll. |
| **Adventure?** | Snowboard portrait, then snowboard action | Staggered clip reveals with layered parallax depth. |

- **Desktop (≥901px, motion allowed):** one pinned, scrubbed GSAP timeline.
- **≤900px:** normal vertical flow. Fun's video is driven by an IntersectionObserver.
- **Reduced motion and no-JS:** every chapter and image is visible in flow, with no masks and no autoplay.
- There are no buttons or click-to-reveal controls, and no invented captions.

The Phase 11 work was started by a previous session; this session reviewed it, tested it in browsers, and fixed three verified defects (section 3).

## 2. Files

| File | Status |
| --- | --- |
| `components/personal-story/personal-story.tsx` | new: component, GSAP timeline, video playback control |
| `components/personal-story/personal-story.module.css` | new: layout and responsive and pinned states, existing gold/violet/ivory palette |
| `data/personal-story.ts` | new: question text and media metadata |
| `public/media/personal/*` (6 files, 5.9 MB) | new: optimized media from the kit |
| `app/about/page.tsx` | modified: MangaGrid section replaced with `<PersonalStory />` between the existing mirror dividers |
| `components/about.module.css` | modified: `.page` `overflow: hidden` → `overflow-x: clip`, so the pin has no vertical clipping ancestor |
| `docs/phase11-source-reuse.md` | new: provenance, adaptations, and the full MIT notice (runway figure updated this session) |
| `docs/phase11-completion-report.md` | new: this report |

`data/about.ts` (`photoPanels`) and `components/manga-panel.tsx` are untouched and still available.

## 3. Defects found and fixed in this session

All three fixes are in `personal-story.tsx`. Typecheck, lint, and build were re-run after each one.

1. **Video sometimes stayed paused in Fun (desktop).**
   - *Cause:* playback was decided from `timeline.time()` inside ScrollTrigger's `onUpdate`. With `scrub: 0.45` the timeline lags the scroll, and `onUpdate` stops firing once scrolling stops. Jumping straight into Fun, or scrolling back up from Style, left the video paused (reproduced in Chrome).
   - *Fix:* playback now follows the timeline's own `onUpdate`, which keeps firing while the scrub catches up. It is gated on `scrollTrigger.isActive` and only calls `play()`/`pause()` when the state changes.
2. **Fun and Style never held their finished scene.**
   - *Cause:* the night photo finished opening at t=1.67 but Fun started fading at 1.65, and the coat finished exactly when Style faded. Measured at 1440×900, Fun was fully composed for 100px of scroll and Style for 140px, about one mouse-wheel notch.
   - *Fix:* a 0.5-beat hold (`HOLD`) after each chapter's last reveal. Reveals, easing and directions are unchanged. The runway grew from `min(2.7vh, 2400px)` to `min(3.4vh, 3000px)`, so scroll-per-beat pace is the same as before.
   - *Result:* each chapter is fully composed for 300–380px at every tested desktop size.
3. **Memory leak on client-side navigation.**
   - *Symptom:* each About → other page → About round-trip retained about 508 DOM nodes and 42 listeners.
   - *Attribution:* the pre-Phase-11 HEAD build (built from `git archive` in a scratch directory) is flat, so the leak came from Phase 11.
   - *Cause, from a heap snapshot:* the GSAP cleanup ran in `useEffect`, which runs after React has detached the DOM. Reverting the pin then moved the stage out of `.pin-spacer` and back into the detached tree. That re-registered Chrome's internal `HTMLImageElement::ViewportChangeListener` (for `sizes` media queries) on the live document, which kept the whole old About tree alive.
   - *Fix:* `useLayoutEffect`, the same pattern GSAP's `useGSAP()` uses, so the cleanup runs before React detaches the DOM.
   - *Result:* nodes and listeners are flat over 12 round-trips (639 nodes / 394 listeners).

## 4. Source reuse and licensing

Unchanged from `docs/phase11-source-reuse.md`, which keeps the full MIT notice:

- **GSAP Vault Image Clip Reveal** @ `72bf2f26a306a711c1793222fa982f829099a58b`: `CLOSED_CLIPS`, `OPEN_CLIP`, `IMG_START_SCALE`, and the `addReveal()` clip plus inner-media scale sequence.
- **GSAP Vault Parallax Hero** @ same revision: scoped `gsap.context()` + `gsap.matchMedia()`, a single pinned and scrubbed timeline with `invalidateOnRefresh`, and the data-speed layer model.
- **tahabakri/scroll-reveal** @ `b7a8789…`: downloaded and reviewed but **not used**.
- No Lenis or other smooth-scroll controller. No upstream colors, fonts, layout or global CSS were copied. The attribution header in `personal-story.tsx` is intact.

## 5. Media

All six SHA-256 hashes match the kit's `docs/MEDIA-MANIFEST.json`. Originals were not copied into `public/`.

| File | Size | Notes |
| --- | --- | --- |
| `jamaica-boomerang.mp4` | 5.36 MB | H.264, 720×1280, 11.6 s, ~3.7 Mbps, `moov` before `mdat` (starts streaming before full download) |
| `jamaica-poster.webp` | 29 KB | video poster |
| `jamaica-night.webp` | 84 KB | 1152×1536 |
| `trench-coat.webp` | 286 KB | 1152×1536 |
| `snowboard-portrait.webp` | 315 KB | 1152×1536 |
| `snowboard-action.webp` | 110 KB | 1290×2302 |

Next/Image serves each photo at or above its rendered device-pixel width at every tested size, at both 1× and 2× density.

## 6. Checks

| Command | Result |
| --- | --- |
| `npm run typecheck` | pass |
| `npm run lint` | pass |
| `npm run build` | pass, all 7 routes prerendered static |

## 7. Browser verification

Tooling: Playwright 1.65.1 driving installed Google Chrome against the production build (`next start`). The StrictMode check also ran against the existing dev server on :3300. WebKit 27.2 (Playwright) stands in for Safari (see section 8). Scripts lived in the session scratchpad and are not in the repo.

### Verified, desktop (Chrome): 1920×1080, 1440×900, 1366×768
- Forward scroll goes question → Fun → Style → Adventure → skills. Reverse scroll returns through every chapter to the question.
- Video plays only within Fun. It pauses at Style, Adventure, past the section, and above it.
- Jumping directly into Fun, Style or Adventure shows the right chapter, and Fun plays.
- Rapid wheel scrolling (40×600px down, then 60×600px up) passes through cleanly with no scroll trapping. The video ends paused.
- Exactly one `.pin-spacer` at all times. Horizontal overflow is 0 at every step.
- **Keyboard:** ArrowDown/Up, PageDown/Up, Space and Shift+Space step through all three chapters both ways.
- **Refresh:** inside Style restores Style. Inside Fun restores Fun with the video playing. Below the section keeps the skills heading in view, with the video paused.
- **History and navigation:**
  - Client nav away leaves no pin-spacer and no story video.
  - Back/forward restores a working story with a single pin.
  - Six About↔Experience round-trips still leave one pin.
- **Resize while pinned** (1280 → 1920 → 800 → 390 → 1440): the pin is removed at ≤900px with all chapters visible, then restored on return. Style still works and there's no overflow at any step.
- **Tab visibility:** hidden pauses the video; visible resumes it while in Fun. Simulated by overriding `visibilityState` and dispatching `visibilitychange`.
- **Reduced motion:** no pin, all chapters visible, clip masks removed, video not autoplayed.
- **Autoplay rejected** (`play()` forced to reject): no unhandled errors; poster and native controls shown; Fun still visible.
- **JavaScript disabled:** question, all three chapters, all four photos and the video (with poster) render in normal flow.
- **Layout shift:** CLS is 0 on a fresh load and on a reload inside the pin.
- **Black flashes:** a mid-scrub sweep (117 frames every 30px) found mean luminance between 28.7 and 56.3, at most 3.1% near-black pixels in any frame, and a largest frame-to-frame drop of 5.2/255. No black frames.
- **Slow network** (~1.6 Mbps, 150ms RTT, cache off): all story images were loaded before the load event and the video played in Fun, so there are no empty frames.
- **Dev mode (StrictMode double effects):** one pin, correct playback, **zero** console warnings. The GSAP `force3D` warning is still fixed, and no hydration warning comes from this component.

### Verified, mobile and tablet (Chrome, touch emulation, 2× DPR): 390×844, 768×1024
- Normal flow and no overflow.
- The video plays when Fun is on screen, pauses at Style, and resumes when scrolling back.
- The skills section is reachable, and the photos are framed without clipped heads or faces.

### Verified, WebKit (Safari engine): 1440×900, 390, 768
- The same forward, reverse, jump and rapid-scroll sequence passes.
- H.264 decodes and plays, and the clip reveals render fully open.
- Mobile flow and play/pause behave as in Chrome.

### Rest of the site (regression)
- `/`, `/about`, `/projects`, `/experience` and `/resume` all return 200, with no console errors, no horizontal overflow, and a live WebGL canvas (Infinite Void) on each page.
- The homepage hero renders normally.
- The skill tree's four accordions all expand (`aria-expanded=true`).
- The tarot carousel opens the Guiding Hands dossier, and Escape closes it.
- No unrelated JJK, Naruto or LOTM files were modified.

## 8. Not verified, or limits

- **Real Safari** was not driven. `safaridriver` needs Safari ▸ Settings ▸ Developer ▸ *Allow remote automation*, which is off, and this session did not change your Safari settings. WebKit 27.2 via Playwright was used instead. The previous session's manual Safari pass is recorded in its own notes.
- **Real iOS/Android devices and real touch momentum scrolling** were not tested. Mobile was emulated, and touch scrolling was approximated with wheel events.
- **A real browser tab switch** was not exercised; visibility was simulated as described above.
- The **Grammarly hydration warning** reported earlier came from a browser extension and was not reproduced here (no extensions in the automated browsers). Nothing was changed for it.

## 9. Known issues, all pre-existing

- Every route logs the same Chrome warning that CSS chunk `f5def0ddd4d426b4.css` "was preloaded … but not used". It appears identically on the pre-Phase-11 HEAD build, so it isn't from Phase 11.
- A long-running `next start` on **port 3000** (started 2026-11-16) is serving an older build. Restart it to see Phase 11 there. A dev server on **:3300** (started 2026-11-17 14:47) also belongs to this repo. Neither was stopped.
- The native video controls appear when the cursor hovers over the boomerang. They're kept on purpose as the fallback if autoplay is blocked.

## 10. Evidence

Location: `output/playwright/phase11/`, which is outside `app/`, `components/` and `public/`, so it isn't part of the production bundle.

**Opening question**
- `1920x1080-01-question.png`, `1440x900-01-question.png`, `1366x768-01-question.png`

**Fun** (video and night photo, held)
- `*-02-fun-video-night.png`
- `*-02a-fun-opening.png` (mid-reveal)

**Style:** `*-03-style-coat.png`

**Adventure:** `*-04-adventure-both.png`

**Exit into skills:** `*-05-exit-to-skills.png`

**Mobile**
- Chrome: `390-01…05-*.png`, `768-01…05-*.png`
- WebKit: `webkit-390-02-fun.png`, `webkit-768-02-fun.png`

**WebKit desktop:** `webkit-1440x900-*.png`

**States**
- `1440x900-refresh-in-style.png`, `1440x900-after-resize-style.png`
- `1440x900-reduced-motion-fun.png`, `1440x900-autoplay-blocked-fun.png`, `1440x900-no-js-story-top.png`
- `slow-network-*.png`

**Regression:** `regress-*.png` (each route, skill tree, project dossier)

**Walkthrough:** `phase11-walkthrough-1440x900.webm`. Steady wheel scroll through all three chapters into skills, then a partial reverse.
