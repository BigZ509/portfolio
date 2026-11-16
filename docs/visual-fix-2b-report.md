# Visual Fix 2B — cinematic intro and transition polish

Date: 2026-11-16. Local work only; no commit, push, or deployment.

## Preserved

The Victorian city and its original SVG architecture in `components/home-scene.tsx`, the graduation and workshop photographs, the field-note section, the portrait's natural aspect ratio, the existing Projects carousel, and all other routes remain intact. No reference files were changed. No audio, video assets, artwork, or new package was added.

## Changes

- `components/home-intro.tsx`: replaced the two sliding panels with a dark atmospheric veil and an expanding, irregular SVG mask. A turbulent edge opens around the clock and moon before exposing the rooftops. The two title lines then unveil in sequence; the framed graduation photo enters on its own depth plane; the software/AI/robotics label, one concise sentence, and actions follow. The intro finishes at about 3.2 seconds. Skip Intro cancels timers and reveals the final state immediately. The intro plays on a fresh load; client-side Back to Home returns directly to the finished scene.
- `components/home.module.css`: staged the far, landmark, middle, and foreground plane entrances by depth. Removed the independent perpetual swaying of buildings; slow fog, lights, stars, and the orrery remain. Added a restrained light and shadow treatment to the portrait frame and an independent photo unveil. Added the scoped departure choreography: the near rooftops draw inward, the hero recedes slightly, and fog sweeps across the scene before Projects navigation.
- `components/home-environment.tsx`: pointer parallax starts only after the intro settles. A passive, frame-throttled scroll check supplements the existing IntersectionObserver so ambient movement pauses exactly when the hero leaves view. It and all listeners, intervals, observers, and RAF work are cleaned up on unmount.
- `data/home.ts`: shortened the repeated identity copy to one statement: “I build software, intelligent systems, and robots for the real world.” `ownerName` remains configurable and is shown beneath the title when a verified value is supplied; it remains unset now.
- `app/globals.css`: on the homepage at narrow widths, the five existing nav destinations use the full header width. The hero already carries the AFTERIMAGE name, so the duplicate small wordmark is hidden only on this mobile view. Other routes' navigation styling was not changed.

## Reference mechanics and fallback

The owner confirmed permission for relevant reference implementation reuse. I inspected `reference/daniel-portfolio/app/page.tsx` (intro timing and plane coordination), `components/landing/ink-mask-svg.tsx` (filtered mask and Safari branch), `components/landing/tree-overlays.tsx` (independent foreground), `components/ui/alpha-video.tsx` (media fallback), and `components/ui/page-transition/` (route cover timing and readiness). This implementation adapts the *mechanics* of a filtered reveal, independently staged depth, and delayed route handoff. The SVG mask design, motion, CSS, and page code are AFTERIMAGE-specific; no Daniel source, media, branding, font, or artwork was copied. GSAP was unnecessary for this one-shot 3.2-second sequence and was not installed.

On Safari or where the required SVG mask/animation interfaces are absent, the veil uses a timed opacity fallback. A watchdog also falls back if the ellipse fails to expand. The 3.2-second completion timer removes the veil even if animation support fails. Reduced motion bypasses the mask, parallax, portrait movement, and departure delay, and navigates immediately.

## Verification and visual review

- `npm run typecheck`, `npm run lint`, `npm run build`: passed on the final code.
- Real Chrome headless/CDP production run at 1440 × 900, 1280 × 800, and 390 × 844. All final captures were inspected. The opening is dark with a faint city; the mid-reveal exposes the clock and moon through the irregular aperture; the settled layout keeps the city, title, photo, and actions distinct. The mobile title, photo, and CTAs do not overlap or clip. The five nav links fit without horizontal overflow.
- Intro state moved from `opening` to `reveal` to `ready`; the animated ellipse expanded from radius 0 through about 440 to 1300. Skip Intro reached `ready` immediately. The portrait loaded with a nonzero natural width at each viewport. Mouse movement shifted the closest city plane by about 22.7 px. At a one-viewport mobile scroll, the workshop section remained reachable and scene animation reported paused.
- Clicking Explore Projects produced the fog departure before reaching `/projects`. Enter on the focused action also reached `/projects`. Browser Back returned to `/` in `ready` state, with no leftover departure layer. Direct navigation to `/projects` worked. Reduced-motion navigation reached Projects without the departure delay. No runtime exceptions were reported in the CDP pass.
- A Chrome user-agent override activated the Safari fallback branch; this does **not** establish actual Safari rendering quality. The browser pass used `--disable-gpu`, so the recorded Projects arrival shows its existing static grid fallback. The WebGL carousel was not changed or visually tested here.
- Screenshots: `docs/screenshots/visual-fix-2b/desktop-opening.png`, `desktop-mid-reveal.png`, `desktop-final.png`, `laptop-final.png`, `mobile-final.png`, `reduced-motion.png`, and `desktop-departure.png`.
- Actual intro and transition recording: `docs/screenshots/visual-fix-2b/intro-projects-transition.webp` (animated WebP, 39 frames, about 5.5 seconds, 960 × 600). I inspected a frame sequence from the final recording: there is no blank interval between the ink reveal, settled home, fog departure, and Projects arrival.

## Remaining limits

Actual Safari/iOS and a physical low-power phone were unavailable. Frame rate and battery impact on those devices remain unmeasured. The Safari fallback was checked by user-agent override in Chrome only. The homepage intro is replayed on a hard refresh; client-side Back keeps the completed scene. The existing headless WebGL fallback is visible in the recording by design of the test environment, not a change to the Projects page.
