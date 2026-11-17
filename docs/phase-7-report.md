# Phase 7 — visual identity completion

Date: 2026-11-17. Working branch: `main`.

## Implemented

- Registered the five exact owner-selected Cards of Blasphemy illustrations in `data/tarot-artwork.ts`. The PNG originals were converted to WebP at their unchanged 751×1051 dimensions, with no crop or resize. `full-card` displays each illustration's original border, numeral and lettering without an extra site frame. Exact source URLs and authorization status are in `docs/tarot-artwork-manifest.md`.
- Replaced the project detail city's backdrop with a violet adaptation of the sword field in `Nafiz001/jjk-domain-expansion` at `69d2b8dca8a2c3f9fdea221dd131ff5722b84c7b`. The source's field, crosses, beams, halo, particles and opening camera composition are traced in `components/mutual-love/`. The shared Infinite Void pauses while the modal realm is open. The existing gallery and detail controls remain.
- Added a differently framed Infinite Void instance behind Home's “Beyond the editor” section. It loads only when the section enters view, pauses offscreen and on hidden tabs, and is the only void renderer active on Home. The hero was not changed.
- Replaced About's introduction with the three owner-supplied paragraphs exactly. Removed the duplicate five-project grid, kept the personal photo gallery and Naruto-inspired skill tree, and replaced generic chapter numbers with content-specific labels.
- Rebuilt Experience as two documented participation milestones: Road Report hackathon work and attendance at a CTOC Labs system design workshop. No unverified employer, title, award, team size or date was added. Updated the five project descriptions to explain purpose, engineering choices and known limitations without changing their statuses.
- Added an original `app/icon.svg` after browser QA found a missing favicon request. Made illustrated fallback cards eager to avoid an above-the-fold image warning.

## Files changed

- Pages and content: `app/about/page.tsx`, `app/experience/page.tsx`, `app/icon.svg`, `data/about.ts`, `data/experience.ts`, `data/projects.ts`, `data/tarot-artwork.ts`.
- Rendering and presentation: `components/home-cosmos.tsx`, `components/home-cosmos.module.css`, `components/home-intro.tsx`, `components/home.module.css`, `components/infinite-void/infinite-void-provider.tsx`, `components/infinite-void/void-renderer.ts`, `components/mutual-love/build-mutual-love.ts`, `components/mutual-love/mutual-love-renderer.ts`, `components/project-showcase-environment.tsx`, `components/project-showcase-environment.module.css`, `components/tarot-card.tsx`, `components/about.module.css`, `components/experience.module.css`.
- Documentation: `docs/tarot-artwork-manifest.md`, `docs/source-permissions.md`, this report. Next.js also regenerated `next-env.d.ts` during build.
- Assets: the five WebPs under `public/images/tarot/`. No packages were added.

## Asset checks

| Card | Output | Pixels | Bytes |
| --- | --- | ---: | ---: |
| The Fool | `speaklab-ai.webp` | 751×1051 | 159,634 |
| The World | `autonomous-delivery-rover.webp` | 751×1051 | 232,424 |
| The Magician | `guiding-hands.webp` | 751×1051 | 232,004 |
| Justice | `road-report.webp` | 751×1051 | 204,328 |
| The Star | `zbxp.webp` | 751×1051 | 199,132 |

No MP4, WebM, MOV or M4V project file exists in the non-reference workspace. The supplied Road Report ZIP contains two WebP screenshots and a README, no video. The existing `VideoPlayer` and `ProjectMediaGallery` support native controls, poster, aspect ratio and pause-on-unmount, but no video record was registered and no video playback was claimed or tested.

## Validation

- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm run build` — passed; `/`, `/about`, `/experience`, `/projects`, `/resume` and `/icon.svg` were prerendered.
- Real Chromium browser at 1280px desktop and 390px mobile: viewed Home, About, Experience, Projects and the expanded modal. All five images loaded in the WebGL carousel and each expanded view at 751×1051. Road Report's gallery advanced from screenshot 1 to 2 and decoded the second image. Mobile modal kept its image, controls and readable detail panel.
- Forced WebGL unavailable by returning `null` for WebGL canvas contexts in a separate browser session. The Projects fallback showed five `full-card` illustrations, all decoded; its expanded detail view used the gradient realm fallback and kept the illustration.
- Emulated `prefers-reduced-motion: reduce`: Home cosmos and the modal realm rendered, and screenshots taken 500 ms apart were byte-identical in each case. No post-fix browser console errors were observed. The earlier missing-favicon request was resolved by `app/icon.svg`. The production browser emitted one Next.js CSS-preload timing warning after a viewport resize; no page failure accompanied it.

## Screenshots

- [Five illustrated cards in WebGL](../output/playwright/phase-7/projects-webgl.png)
- [Road Report modal, desktop](../output/playwright/phase-7/road-report-modal-desktop.png)
- [Road Report modal, mobile](../output/playwright/phase-7/road-report-modal-mobile.png)
- [Static no-WebGL card fallback](../output/playwright/phase-7/projects-fallback.png)
- [Home cosmic section, desktop](../output/playwright/phase-7/home-cosmos-desktop.png)
- [Home cosmic section, mobile](../output/playwright/phase-7/home-cosmos-mobile.png)
- [About photo section](../output/playwright/phase-7/about-gallery.png)
- [About introduction, mobile](../output/playwright/phase-7/about-mobile.png)
- [Experience field journal, desktop](../output/playwright/phase-7/experience-desktop.png)
- [Experience field journal, mobile](../output/playwright/phase-7/experience-mobile.png)

## Remaining limits

- The owner asserted authorization for the five card images and JJK source. Written grantor, scope and redistribution evidence are still not in the repository; see `docs/source-permissions.md`.
- No real project video was available, so actual playback remains untested and no play control appears.
- Several project completion details and individual hackathon responsibilities remain unverified. The public copy avoids claiming them.
- Browser QA was Chromium only. Safari and physical-device GPU performance were not measured.
