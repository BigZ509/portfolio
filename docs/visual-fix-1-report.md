# Visual Fix 1 — Cinematic project showcase

Date: 2026-11-15 (America/New_York). Not committed or pushed.

## What changed

**1. Road Report screenshots**
- **Source:** `road-report-portfolio-assets.zip`. The brief named `assets-inbox/`, but that folder doesn't exist; the ZIP was in the project root, and it was used from there.
- **Files:** extracted unchanged to `public/images/projects/road-report/`:
  - `road-report-route-comparison.webp` (862×1454, primary)
  - `road-report-hazard-details.webp` (840×1404, secondary)
- **Data:** connected through the existing `screenshots` field on the Road Report record. Alt text comes from the ZIP's README. Captions are "Route comparison" and "Incident details".
- **Caveat recorded in the data:** a comment notes that the screenshots illustrate the interface only. They don't verify features beyond the existing description. No project text was changed.
- **Schema** (`data/projects.ts`), extended only where needed:
  - `ProjectScreenshot` (`ProjectImage` plus intrinsic `width`, `height` and `caption`) for aspect-correct framing.
  - `ProjectVideo`: an `.mp4` `src`, `title`, `caption`, `width`, `height`, and an optional `poster` and `.vtt` captions file.
  - `Project.videos?` was added.

**2. One-click opening** (`components/project-carousel.tsx`)
- **WebGL:** one click, tap or project control centers the card using the existing easing. When centering finishes, the showcase opens automatically.
- **Navigating away:** wheel, drag, arrows or Previous/Next during centering cancel the pending open.
- **Already selected:** an already-centered selected card opens immediately.
- **Reduced motion and fallback:** both open immediately.
- **Unchanged:** carousel physics, click-versus-drag detection, Escape (first closes, second deselects), the Close button, focus restoration, and the "Open details" and "Deselect" buttons. Screen-reader instructions were updated.

**3. Left showcase environment** (`components/project-showcase-environment.*`)
- **Original artwork:** all inline SVG, made for AFTERIMAGE. There are no external or downloaded assets and no Lord of Mysteries insignia.
- **Layers, back to front:**
  - midnight sky with a moon, halo and twinkling stars
  - distant spires and a clock tower
  - fog
  - a slowly turning occult sigil: a ring of planetary symbols and a seven-pointed star
  - gabled rooftops with lit gothic windows
  - fog
  - a near parapet with an iron railing and gas lamps
  - fog
  - a gothic pointed-arch frame with a crescent keystone
  - a vignette
- **Seamless motion:** each city layer is a 1600×900 tile whose edges match, repeated three times and moved by exactly one tile. Speeds are 260 s, 170 s and 110 s per tile, so farther layers move slower. Fog strips loop the same way.
- **Smaller animations:** windows and lamps flicker; the sigil turns once every 300 s.
- **Mouse parallax** (desktop mouse only): CSS variables per depth. Maximum travel is 5, 9, 15, 22 and 30 px from sky to frame; the media moves 10 px.
- **Rendering:** all motion is compositor-only (`transform`/`rotate`), with `contain: strict`. Nothing renders while the showcase is closed.
- **Emblem:** the selected tarot card sits beside the screenshots as a floating emblem. It uses a new opt-in `compact` variant of `TarotCard`, whose type scales with the card's width. The artwork pipeline is unchanged.

    The environment is opaque, so the existing 3D card flight now happens beneath the scene as it fades in. The DOM emblem then appears in place.
- **Performance safeguards:**
  - Mobile (≤700 px): one fog band removed, lighter blur, slower loops, no twinkle, no parallax transitions, emblem hidden.
  - `prefers-reduced-motion`: a completely still scene with no parallax.

**4. Mixed-media gallery** (`components/project-media-gallery.*`; it replaces `project-screenshot-gallery.*`, which was deleted)
- **Frame:** a gilt frame sized from each item's real aspect ratio using stage container units, with `object-fit: contain`. Nothing is ever cropped.
- **Depth:** the next item floats behind as a dimmed, tilted frame.
- **Motion:** gentle floating on both frames, plus mouse parallax on the composition.
- **Controls:** Previous/Next, thumbnail buttons (with a ▶ badge for videos), and a caption with a counter. A polite live region announces changes only after user interaction.
- **Video:** a native `<video controls playsInline preload="metadata">` with an optional poster and captions track. It never autoplays.
  - A play button appears only for supplied videos, and only until playback starts. A load error replaces the player with "This video could not be loaded" and no play button.
  - The video pauses when switching media; when the project changes or the showcase closes, the player unmounts and pauses on cleanup.
  - While a video plays, the gallery's floating and parallax are switched off, so the player stays still. No perspective transforms are applied to it.
  - Fullscreen is available through native controls.
- **No media:** a project with no media shows "No project screenshots supplied yet". No placeholders are invented.

**5. Right panel** (`components/project-details.module.css`)
- **Content:** the same structure and fields as before.
- **Styling:**
  - a gilt double rule on the left edge and a warm top glow
  - a gilt underline beneath the title
  - section headings in the display face, with a ◆ ornament and a fading gilt rule
  - technology tags styled as engraved plaques
  - squared gilt buttons and status
- **Motion:** the panel never moves with the environment.

**Not changed:** homepage, About, Experience, Resume, the tarot artwork pipeline, carousel physics, project descriptions, and `reference/daniel-portfolio/` (no changes).

## Screenshots used

- **Project media:** only the two supplied Road Report screenshots. No screenshots or videos were created for any project.
- **Results:** saved in `docs/screenshots/visual-fix-1/`:
  - `desktop-route.png`, `desktop-hazard.png`
  - `mobile-route.png`, `mobile-hazard.png`
  - `desktop-reduced-motion.png`
  - `fallback.png`

## Tests

- `npm run typecheck`, `npm run lint`, and `npm run build`: passed.
- **Browser test:** 27/27 passed, against the production build in headless Chrome 157 with real CDP mouse, touch and key events.
  - **One-click opening:**
    - A click on the Justice card on the WebGL canvas leaves the dialog closed at 60 ms. It opens at about 1.0 s, after centering, with focus on Close.
    - Reopening is one activation (4 ms) and resets the gallery to the primary image.
    - Enter on a project control opens after centering. Escape returns focus to that control.
  - **Gallery:**
    - The primary screenshot is 862×1454 natural, rendered 355×595 (ratio 0.595 against 0.593), with `contain`. The frame is 615 of the 900 px stage height.
    - There are two thumbnails, and no video elements or play buttons.
    - Next shows the hazard screenshot with its aspect preserved and announces "Screenshot 2 of 2: Incident details". The gallery wraps around, and thumbnails select media.
  - **Animated backdrop:** over 1.5 s the far, middle and near layers moved 9.6, 14.7 and 22.7 px. Fog, the sigil and both frames animate.
  - **Parallax:** moving the mouse across the stage, layer travel was 4.9, 8.8, 14.7, 21.5 and 29.4 px (sky to frame), and 9.8 px for the media. The panel's position didn't change.
  - **Close and Escape:** Close keeps the selection. Escape closes, and a second Escape deselects.
  - **Other inputs and cases:**
    - SpeakLab shows the empty state.
    - A drag starting on a card neither selects nor opens.
    - The wheel still rotates the carousel.
  - **Mobile 390×844 (touch emulation):**
    - The stage is 456 px (54dvh) with the panel directly below.
    - The frame (155×251) and media controls fit inside the stage, and the emblem is hidden.
    - The safeguards are active (fog band removed, 14 px blur), and switching media works.
  - **Reduced motion:** opens in 18 ms. Every loop, fog, sigil and float animation is `none`, and mouse movement sets no parallax.
  - **WebGL fallback** (blocked through a `getContext` override): one click opens with the emblem card and screenshots, and switching works.
- **No console errors.**
- **Earlier phase suites:** the 4B, 4C and 4D scripts were not rerun. They assume two-activation opening, which this fix replaces. The behaviors they covered that still apply (wheel, drag threshold, keyboard, Escape sequence, focus, reduced motion, fallback) are covered by the new suite above.

## Remaining issues

- **Video playback is untested in a browser.** No MP4 was supplied, and `ffmpeg` isn't installed to make a test fixture. The player, play button, pause-on-switch, stationary-while-playing and error paths are implemented and type-checked but not exercised.
- **The 3D card flight is now hidden.** It runs beneath the opaque scene, and only the DOM emblem is visible afterwards. The flight could be removed, or replaced with a crossfade, in a later pass.
- **Untested on real hardware:** real phones, iOS Safari, and low-end GPUs. Animation smoothness was checked only in software-rendered headless Chrome.
- **Text over rooftops on mobile:** the caption sits over the rooftop layer. It is readable thanks to a text shadow, but has less contrast than on desktop.
- **The ZIP is still in the project root** and untracked. Consider deleting it, or adding it to `.gitignore`, before the next commit.
- **Other projects have no media yet.** They will populate automatically when screenshots or videos are added to their records.
