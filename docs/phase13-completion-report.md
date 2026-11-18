# Phase 13 completion report — smooth story, résumé viewer, LinkedIn, ZBXP gallery, Arcana Fieldbook

Status: **implemented and verified locally. Nothing committed, pushed, merged or deployed.**
Date: 2026-11-17. Starting point: `main` at `9269142` (Phase 11), with a clean tree apart from untracked kit zips.

## Summary

| Task | Outcome |
| --- | --- |
| 1. Unsmooth scroll / video | Root causes measured and fixed: a page-wide CPU noise filter stalling Safari, an over-bitrate video stalling on slow connections, a late video buffer start, and invisible box-shadows repainted during clip reveals. Phones gained the aperture reveal without pinning. |
| 2. Résumé | The exact supplied PDF is at `public/resume/Marc-Alexis-Resume.pdf`, with the same SHA-256. Navbar **Resume** opens an accessible in-page popup. `/resume` is a full direct page with an embedded viewer, **Download PDF** (a real download) and **Open PDF**. |
| 3. LinkedIn | `https://www.linkedin.com/in/marc-alexis-6714b6191/` is published and verified. The dummy `mailto:contact@example.com` and the `linkedin.com/in/` placeholder are removed from source, and `/resume` no longer renders unverified links. |
| 4. ZBXP gallery | Six media items in the required order: five real screenshots plus the YouTube demo `c4OYbEZnBus` with a local poster. Watch Demo, Live and Source work, and the iframe unmounts on media switch and on close. |
| 5. Dossier | `ProjectDetails` is rebuilt as the **Interactive Arcana Fieldbook** for all five projects. It has a new structure, not restyled paragraphs. |

TypeScript, ESLint and the production build all pass (exit 0).

## 1. Scroll and video smoothness

### Diagnosis, measured before changing code

Tooling was Playwright 1.65.1 driving installed Chrome (ANGLE/Metal GPU, Apple M5) and Playwright WebKit 27.2, the Safari engine. Frame intervals were recorded with `requestAnimationFrame` during a steady wheel scroll through the pinned story, forward then reverse. Chrome traces gave long tasks plus style, layout, paint and raster totals. Scripts are in the session scratchpad, not the repo.

- **Chrome, unthrottled:** essentially 16.7 ms frames. The only long task was a tracing-startup artifact, so this fast machine does not reproduce main-thread jank in Chrome.
- **Chrome, 4–6× CPU throttling:** slow frames concentrated in Fun, where video start and two clip reveals overlap.
- **WebKit, unthrottled:** 34–45 frames over 25 ms per pass, with hitches up to 430 ms. Bucketing by pin position showed the pin itself was mostly smooth. The jank sat **at and after the pin exit**: 29 of 42 frames slow, worst 187 ms.
- **Ruled out by A/B CSS injection:**
  - Hiding the story stage, its clip-paths, its shadows or the mirror divider barely changed anything.
  - Pre-decoding images (`img.decode()`) changed nothing.
  - Hiding the Infinite Void canvas or the page veil changed nothing.
- **Cause found:** hiding `.ground::after` took that region from 27 slow frames (worst 166 ms) to 2 (worst 27 ms). It is an inline `feTurbulence` SVG with only a `viewBox`, so each tile is drawn at full page width, and WebKit runs the filter on the CPU for every tile that scrolls in. The same slowdown exists in the pre-Phase-11 build, but Phase 11's tall pin makes far more of the page scroll through it.
- **Video:** H.264 at 3.7 Mbps with keyframes about 4 s apart, `preload="metadata"`. At a throttled 3 Mbps on a phone viewport it **stalled 7–8 times in 10 s and dropped 8–9 frames**.

### Changes

| Change | File | Why |
| --- | --- | --- |
| The noise is rendered once from the identical SVG to a 360 px tile (`public/images/about/ground-noise.webp`, 133,504 B) and drawn with `background-size: 100% auto`, which is the same page-width square tiling as before. | `components/about.module.css` | Removes per-tile CPU filtering. Visual parity: mean pixel difference 0.35/255 (max 4) in the skills area with the void hidden. |
| Boomerang re-encoded: H.264 High, CRF 27 capped at 1.5 Mbps, 1 s keyframes, faststart, no audio, same 720×1280 / 30 fps / 11.6 s / 348 frames. | `public/media/personal/jamaica-boomerang.mp4` (5,356,471 → 2,239,096 B, −58%) | Fits ordinary mobile bandwidth. SSIM 0.980 against the kit file, and frame comparison shows the face and ocean detail unchanged. |
| Video `preload` is switched to `auto` once the story is within one viewport. | `components/personal-story/personal-story.tsx` | Fun starts from buffered data. `currentTime` is never tied to scroll; play and pause still happen only on state changes. |
| Media-frame `box-shadow` is removed while pinned. | `components/personal-story/personal-story.module.css` | While pinned, `clip-path` already hides the shadow completely, so it was a wasted blurred repaint on each reveal frame. |
| Phones and tablets (≤900 px, motion allowed): each photo and the video open with the same GSAP Vault aperture `addReveal()` as they enter, and close again on the way back up. No pin. | `personal-story.tsx` | Keeps the visual storytelling on mobile, as the brief requires. |

No new libraries, no smooth-scroll controller, no second WebGL scene. The timeline, pin, video play/pause logic and the layout-effect cleanup from Phase 11 are unchanged.

### After: A/B against the committed baseline build, same session, alternating runs

**WebKit 1440×900 (Safari engine), 3 runs each**

| Build | Frames over 25 ms | Over 50 ms | p95 | Slow frames after pin | Frames delivered |
| --- | --- | --- | --- | --- | --- |
| Baseline | 34–41 | 10–14 | 23–26 ms | 20–25 | 776–803 |
| Current | 4–18 | 2–11 | 7–14 ms | 1–12 | 914–957 |

**Chrome 1440×900 at 6× CPU throttling.** The control is noisy run-to-run: baseline 10/45/130 frames over 25 ms, current 23/30/13. Frames over 50 ms went from 2–7 to 0–3. The current build is never worse than the baseline's worst run.

**Video at 3 Mbps, 390×844**

| Build | Stalls in 10 s | Dropped frames | Buffered before Fun | Position at 10 s |
| --- | --- | --- | --- | --- |
| Baseline | 7–8 | 8–9 | 0.4 s | 8.3 s |
| Current | 0 | 0 | ~11 s | 10.6 s |

At 10 Mbps on desktop: 0 stalls and 0 drops on 3 of 4 runs; one run logged a single transient stall.

**Limitation.** These numbers come from an M5 Mac plus CPU emulation and WebKit-in-Playwright. Smooth 60 fps on every device is not guaranteed. Real Safari and real phones were not driven (see Limitations).

## 2. Résumé viewer

- **PDF:** `public/resume/Marc-Alexis-Resume.pdf`, 133,234 B. SHA-256 `87c24c11…2b21` matches `ASSET-MANIFEST.md`. Served as `200 application/pdf`, starts `%PDF-`, single page. Not altered or regenerated.
- **Shared pieces** in `components/resume/resume-document.tsx`:
  - `ResumeDocument`: an `<object type="application/pdf">` with `#navpanes=0&view=FitH`. On browsers without an inline PDF viewer (for example Chrome on Android) it shows an in-theme fallback with Open/Download rather than starting a download.
  - `ResumeActions`: **Download PDF** (`<a download="Marc-Alexis-Resume.pdf">`) and **Open PDF** (new tab, `noopener noreferrer`).
- **Popup** (`components/resume/resume-dialog.tsx`, styles in `components/resume/resume.module.css`):
  - A native modal `<dialog>` titled "Marc Alexis — Resume".
  - Focus starts on Close, Tab/Shift+Tab loop inside, and Escape and backdrop clicks close it.
  - Focus returns to the Resume link, page scroll is locked and then restored, and safe-area padding applies on phones.
  - The PDF is requested only while the popup is open.
- **Navbar** (`components/navbar.tsx`):
  - A plain click on Resume opens the popup without changing the URL.
  - Modifier clicks, visits without JavaScript, and clicks while already on `/resume` follow the link to the page.
  - The popup's open state is tied to the current path, so browser Back closes it and history behaves normally.
- **`/resume`** (`app/resume/page.tsx`): the old placeholder is replaced by a direct page with a heading, the embedded viewer at letter proportions, Download and Open, and the verified GitHub and LinkedIn links. It works on refresh and with JavaScript disabled.
- **Privacy:** the phone number appears only inside the PDF. No new page copy exposes it.

## 3. LinkedIn and contact links

- `data/social-links.ts`: LinkedIn is set to the exact URL and verified. The dummy Email entry is removed (no public address was supplied, and none is invented). GitHub is unchanged.
- `app/resume/page.tsx` now renders only `publicSocialLinks`; previously it rendered the unverified placeholders. About already used `publicSocialLinks`.
- Audit: `grep` across `app/`, `components/`, `data/` and the rendered HTML of `/about` and `/resume` finds no `linkedin.com/in/` root placeholder, no `contact@example.com`, and no `mailto:`.
- A browser click on LinkedIn opened `https://www.linkedin.com/in/marc-alexis-6714b6191`.

## 4. ZBXP media

Assets came from `ZBXP-portfolio-repair-kit.zip`, and each SHA-256 matches its `asset-manifest.json`:

| # | Item | Path | Bytes | Size |
| --- | --- | --- | --- | --- |
| 1 | Trial Scrolls quest board (cover) | `/images/projects/zbxp/trial-scrolls.webp` | 47,000 | 1290×718 |
| 2 | YouTube `c4OYbEZnBus` (owner's upload, oEmbed confirms embeddable, 16:9) | poster `/images/projects/zbxp/zbxp-demo-poster.jpg` (local copy of its thumbnail) | 34,997 | 1280×720 |
| 3 | Sign-in | `/images/projects/zbxp/sign-in.webp` | 26,098 | 1290×712 |
| 4 | Choose your path | `/images/projects/zbxp/choose-your-path.webp` | 19,512 | 1248×675 |
| 5 | Quest reward | `/images/projects/zbxp/focus-reward.webp` | 24,384 | 1290×701 |
| 6 | Character progression | `/images/projects/zbxp/character-progression.webp` | 35,318 | 1280×744 |

- Registered in `data/projects.ts` with the existing `media` array and `youtubeVideo()`. Alt text describes only what is visible.
- `https://zbxp.vercel.app` and `https://github.com/BigZ509/Productivity-WebApp` both return 200 and are unchanged.
- ZBXP gained a `flow` ("XP Path": Quest or workout → Supabase award RPC → XP result → Profile refresh → Level and rank), drawn from the repo's `complete_quest`/`log_workout` RPCs. It deliberately does not claim the Pomodoro timer awards XP, and the leaderboard is not described as guild-scoped.

## 5. Interactive Arcana Fieldbook (`components/project-details.tsx` + `.module.css`)

Each part is a new component structure, not a restyle of the old three paragraphs:

1. **Arcana masthead:** a circular seal with the card's numeral inset over its motif glyph, the tarot name, "Arcanum N", and Close.
2. **Introduction:** category, title, status (Rover: In development), and lede.
3. **Action zone:**
   - A full-width **▶ Watch Demo** ("Plays here · YouTube") when a video exists. It calls the existing `watchDemo()`, so the gallery switches to the real video item and starts it.
   - Narrower **Live app** and **Source** plates beside it. Without a video, the first link becomes primary.
4. **Chapter rail:** sticky `01 / Problem · 02 / Build · 03 / Engineering` (Rover shows "Design"). These are real buttons with `aria-controls` that scroll the panel and move focus to the chapter. The current chapter is tracked by an IntersectionObserver scoped to the panel, and a gold marker slides between chapters.
5. **Reading progress:** a gilt thread pinned to the panel's top edge. It is driven by one passive, rAF-throttled listener on the panel only and writes a CSS variable, so scrolling causes no React renders.
6. **Folios:** an oversized outlined numeral, a gold diamond index on the left rule, a "Chapter I/II/III" kicker, the heading, and the opening sentence set as a display-serif lead above the body text. They fade in on first sight, with no animation under reduced motion. All text is unchanged from the records.
7. **Flow diagram:** numbered nodes joined by a gilt connector, with start and end emphasised. Guiding Hands keeps its 8-step Signal Path; ZBXP shows its 5-step XP Path; projects without a flow show no diagram.
8. **Stack seals:** technologies as pill seals grouped into labelled role plates (`role="group"`).

**Also changed:**
- The dossier column widened slightly, from `clamp(23rem, 37vw, 33rem)` to `clamp(24rem, 39vw, 36rem)` (`components/project-carousel.module.css`).
- The project dialog's Tab loop (`components/project-carousel.tsx`) now also wraps when focus rests on a programmatic target past the last control, such as a chapter the rail jumped to.

The tarot card, the 3D sword-field stage, the gallery and the Infinite Void are untouched.

## Files changed

**Modified:**
- `app/resume/page.tsx`
- `components/about.module.css`
- `components/navbar.tsx`
- `components/personal-story/personal-story.tsx`
- `components/personal-story/personal-story.module.css`
- `components/project-carousel.tsx`
- `components/project-carousel.module.css`
- `components/project-details.tsx`
- `components/project-details.module.css`
- `data/projects.ts`
- `data/social-links.ts`
- `public/media/personal/jamaica-boomerang.mp4` (re-encoded)
- `docs/phase11-source-reuse.md` (re-encode note)

**New:**
- `components/resume/resume-document.tsx`
- `components/resume/resume-dialog.tsx`
- `components/resume/resume.module.css`
- `public/resume/Marc-Alexis-Resume.pdf`
- `public/images/about/ground-noise.webp`
- `public/images/projects/zbxp/` (5 screenshots + poster)
- `docs/phase13-completion-report.md`

`next-env.d.ts` and `AGENTS.md` are unchanged. The untracked kit zips, `AGENT-PROMPT.md` and `OPEN-SOURCE-LINKS.md` in the repo root were left as found.

Source attribution is retained: the GSAP Vault MIT header and notice in `personal-story.tsx` and `docs/phase11-source-reuse.md`. The mobile reveal reuses the same `addReveal()` port.

## Verification

All runs were against `next build` + `next start`. Chrome is the installed Google Chrome; "WebKit" is Playwright WebKit 27.2.

| Area | Result |
| --- | --- |
| `npm run typecheck` / `lint` / `build` | pass / pass / pass, all 7 routes static |
| Project modals, 1440×900, 768×1024, 390×844 (Chrome) | **51/51 at each size.** For all 5 projects: focus starts on Close; rail buttons scroll to, mark and focus each chapter; flow node counts (GH 8, ZBXP 5, others 0); reading progress reaches 1; no horizontal clipping; Tab stays in the dialog; Escape closes with no lingering iframe. ZBXP: 6 items in the right order, every item's pixels load, thumbnails never mount the embed, Watch Demo mounts `youtube-nocookie.com/embed/c4OYbEZnBus`, switching media unmounts it, closing during playback removes it, reopening starts on the cover; Live and Source correct. Guiding Hands and Road Report demos still mount their own videos. |
| Résumé + LinkedIn (Chrome 1440, 390, plus no-JS) | **34/35.** PDF 200/application/pdf/`%PDF-`/same hash; popup opens in place with the right heading, focus and scroll lock; the download event is named `Marc-Alexis-Resume.pdf` with identical bytes; Open PDF opens a new tab; Escape restores focus and scroll; Back closes the popup; `/resume` works on direct load and reload; `aria-current` is set; LinkedIn anchors exact and safe on `/about` and `/resume`; no dummy links. The one "failure" is at 390: a Tab sample taken during Chrome's hand-off of focus to its out-of-process PDF viewer read `BODY`. A 400 ms-settled trace shows focus going straight from Open PDF into the viewer and back with Shift+Tab, never leaving the dialog. |
| About story, Chrome 1440 + WebKit 1440 | Forward, reverse, jumping into each chapter, and rapid wheel both ways all pass; the video plays only in Fun; one pin; no overflow. |
| Interaction suite (Chrome 1440) | **23/23.** Keyboard (Arrow, Page, Space, Shift+Space), refresh inside Style/Fun/below, client navigation and Back/Forward, 6 round-trips, resize across the 900 px breakpoint, tab visibility, reduced motion, autoplay rejection. |
| Mobile reveal (Chrome + WebKit, 390 and 768) | Frames masked below the fold, each opens on entry, the video plays in view and pauses at Style, frames re-mask when scrolling back up. Reduced motion: all unmasked, no autoplay. |
| No-JS | The story renders in flow; nav Resume goes to `/resume` with viewer and download. |
| Memory | 12 About↔Experience round-trips: nodes 646 and listeners 398, flat. |
| Regression | `/`, `/about`, `/projects`, `/experience` and `/resume` return 200 with no console errors and no overflow; Infinite Void canvas live; skill tree's 4 sections expand; tarot carousel and dossier open and close. |

## Evidence (`output/playwright/phase13/`, outside the production bundle)

- **Dossier before/after:**
  - `before-<project>-1440.png` / `-390.png` and `after-<project>-1440.png` / `-390.png` for all five projects.
  - `after-<project>-panel-end-*.png` (stack plates).
  - `after-guiding-hands-flow-*.png` and `after-zbxp-flow-*.png`.
- **ZBXP:** `after-zbxp-gallery-1-*.png`, `after-zbxp-gallery-5-*.png`, `after-zbxp-demo-playing-*.png`.
- **Résumé:** `resume-popup-1440.png`, `resume-popup-390.png`, `resume-page-1440.png`, `resume-page-390.png`.
- **Story:**
  - `1440x900-01-question.png` … `05-exit-to-skills.png`.
  - `chrome-390-adventure-revealed.png`, `webkit-390-adventure-revealed.png` (and the 768 versions).
  - `phase13-about-walkthrough-1440x900.webm` (steady scroll through the story into skills, then a partial reverse).
- **Regression:** `regress-*.png`.

## Limitations and remaining issues

- **Real Safari was not driven.** Safari's "Allow remote automation" setting is off, and it was not changed; WebKit 27.2 via Playwright stood in. Real iOS/Android devices and real touch momentum were not tested. On Android Chrome the popup is expected to show the in-theme fallback with Open/Download, because that browser has no inline PDF viewer; this is designed for but untested on a device.
- **Escape inside the PDF viewer.** While keyboard focus is inside Chrome's PDF viewer, Escape is consumed by the viewer. Shift+Tab leaves the viewer and Escape then closes the popup. This is not a keyboard trap.
- **Earlier video buffering.** With `preload="auto"` on approach, visitors who reach About's lower half download the 2.2 MB boomerang a little earlier than before, though less in total than the previous 5.3 MB file.
- **Homepage noise.** `components/home.module.css` uses the same size-less `feTurbulence` noise. It was out of scope and left unchanged; the same raster-tile fix would likely help Safari there.
- **Pre-existing CSS warning.** Chrome's "CSS chunk `f5def0dd…` preloaded but not used" warning appears on every route in the committed baseline too.
- **Rover gallery.** Autonomous Delivery Rover still shows "No project screenshots supplied yet", because no Rover media exists.
