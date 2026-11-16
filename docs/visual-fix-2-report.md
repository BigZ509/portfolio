# Visual Fix 2 — cinematic homepage

Date: 2026-11-16. This is an uncommitted local continuation of Claude's work. No deployment or push was made.

## What was present

At handoff, `app/page.tsx` already replaced the Phase 2 home with imports for `HomeEnvironment` and `HomeIntro`, but those modules did not yet exist. `data/home.ts` contained the typed homepage content and an unset portrait. `components/home-scene.tsx` contained Claude's original 1920 × 1080, multi-plane SVG city: stars, moon, orrery, far and mid skylines, a lit clock tower, cathedral, near rooftops, and fog surfaces. There was no `home.module.css`, report, handoff file, or Visual Fix 2 screenshot yet. Existing carousel and other page work remained untouched.

## Completed here

- Added `components/home-environment.tsx`: a small client controller for desktop pointer parallax, a clock set to the visitor's local time, visibility and reduced-motion pausing, and cleanup of observers, events, the clock interval, and animation frames.
- Added `components/home-intro.tsx`: staged split-curtain entrance, two-line title reveal, editorial copy, owner portrait, functional Skip Intro, Projects and About actions, and a field-note section linking to Experience. Timers are cleared on unmount. Reduced motion displays the complete scene immediately.
- Added `components/home.module.css`: original art direction, scene plane colors and depth, window flicker, orrery motion, drifting fog, portrait framing, responsive layout, entrance timing, and reduced-motion rules. The scene uses compositor transforms and opacity for its ongoing movement. No WebGL or video runs on the homepage.
- Populated `data/home.ts` with the owner-supplied graduation portrait and alt text. Integrated the workshop image below the hero. Added all four supplied optimized WebP files under `public/images/home/`; the other two remain unused on this page.
- Added homepage-scoped narrow-screen navigation sizing in `app/globals.css` so the existing five links remain visible at 390 px.
- Preserved Claude's `app/page.tsx` and `components/home-scene.tsx` work; completed its missing dependencies. No reference files, project carousel, or unrelated route source were edited.

## Motion and reference mechanics

The owner stated permission to reuse relevant reference implementation mechanics. I inspected the existing source audit and relevant reference landing files. The implemented behavior uses independent depth planes, a staged title/foreground entrance, an atmosphere reveal, desktop parallax, mobile-specific positioning, and cleanup. The timing and layer ordering are informed by the audit of Daniel's intro, but the split-curtain design, CSS choreography, code, and SVG city are original to AFTERIMAGE. No Daniel source code, ink mask, CSS, third-party assets, images, fonts, or branding were copied. GSAP was not added because the required sequence works with CSS and a few cancellable timers. The LOTM influence is Victorian gothic atmosphere and occult astronomy rather than copyrighted character art or insignia.

## Validation

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed with Next 16.4.5 / webpack. The static routes built successfully.
- Actual Chrome headless/CDP run against the production server at 1440 × 900, 1280 × 800, and 390 × 844. Screenshots were inspected. Final desktop and mobile compositions show the title, architectural scene, authentic portrait, and actions; no horizontal page overflow was detected.
- The desktop intro screenshot captures the curtain partway open. The scene reaches `ready` after the intro. Skip Intro immediately sets `ready`. Both hero actions were clicked and reached `/projects` and `/about`. The two rendered images loaded with nonzero natural dimensions.
- Mouse input changed the nearest layer's transform from its resting state to `translate3d(-22.67px, -1.47px, 0px)` in the 1440 px test. In reduced-motion emulation, the curtain was hidden, the title fully visible, ambient animations disabled, and the state reached `ready`. Route navigation away completed. The source removes listeners, observers, timers, and RAF work on unmount; a browser memory profile was not taken.
- Screenshots: `docs/screenshots/visual-fix-2/desktop-intro.png`, `desktop-final.png`, `laptop-final.png`, `mobile-final.png`, `reduced-motion.png`. No intro video recording was captured; the test pass used screenshots and CDP state checks.

## Remaining considerations

Safari/iOS and a low-end mobile device were not available for this pass. On those devices, confirm CSS mask/clip and SVG performance, the size of the mobile portrait, and frame rate during fog motion. The owner name is deliberately unset in `data/home.ts`; no name was invented. The archive did not contain a formal coat photo. The unused beach and campus images can be placed on the About page in a later task if desired.
