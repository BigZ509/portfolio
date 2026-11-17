# Infinite Void integration: stabilization and verification

Verified on the `feature/infinite-void-background` branch against a production build on
2026-11-16/17. The unmodified `origin/main` branch was archived into a temporary directory,
built with the same installed dependencies, and served separately for warning attribution.
No reference repository or upstream source was changed.

## Integration retained

Claude's implementation adapts the upstream Infinite Void scene in
`components/infinite-void/{shared,build-infinite-void,void-renderer}.ts`. It includes the grid,
stars, black hole and accretion disk, inflowing particles, galaxy, and instanced crystals.
`components/infinite-void/infinite-void-provider.tsx` owns one canvas in the root layout;
`components/atmospheric-background.tsx` registers Projects, Resume, About, and Experience for
that background. Home does not register. The existing Projects carousel remains separate.
Desktop uses bloom; the low tier reduces scene counts, skips bloom, caps rendering near 30 fps,
and caps the void's backing resolution at DPR 1. The renderer releases scene resources and
listeners when its provider unmounts. These lifecycle provisions were code reviewed; not all
can be measured from browser automation.

## Correction made

About's GSAP timeline targeted two `data-hero="meta"` elements that were absent from the
markup on both this branch and `origin/main`. The existing photo caption spans now carry that
hook (`app/about/page.tsx`), preserving the intended staggered animation. In the rebuilt
production browser, both the named and empty GSAP target warnings disappeared.

`docs/source-permissions.md` now lists the `world3d/` files actually adapted, rather than
the earlier proposed particle and renderer files. The owner's reuse authorization is recorded
as asserted; the grant's exact scope and public redistribution terms are still undocumented.

## Production validation

| Check | Result |
|---|---|
| `npm run typecheck`, `npm run lint`, `npm run build` | Passed after the About change. |
| Projects, Resume, About, Experience at 1440×900 and 390×844 | All reached visible WebGL mode; no context loss or horizontal overflow observed. |
| In-place resize at 1440×900, 390×844, 1024×700, 768×1024 | Void canvas matched each viewport; no context loss or overflow observed. |
| Animated render | Two void-canvas captures 800 ms apart differed. The captured black-hole silhouette was clear of crystals at desktop and mobile widths. |
| Mobile device emulation | At viewport 360×732 and device DPR 3, the void canvas backing was 360×732 (effective DPR 1). |
| Reduced motion | Void canvas captures 900 ms apart were identical; live preference change resumed animation. |
| WebGL unavailable | Simulated `getContext()` failure produced the visible CSS fallback and retained Projects content. |
| Route reuse | The same canvas and WebGL context survived repeated client navigation; Home hid the layer. Projects had two canvases (void and carousel); other target routes had one. |
| Interaction | Void did not intercept hit testing. Projects buttons, project dialog and Escape, keyboard ArrowRight, mobile tap selection, About skill-tree Enter, and navigation were exercised. |
| Heap sample | After explicit browser garbage collection: 7.41 MB initially, 9.43 MB after 15 route changes, 9.96 MB after 30. No duplicate renderer or runaway growth was seen in this short sample. |

The browser used headless Chromium with a working WebGL context. Hardware GPU acceleration
was not confirmed. Hidden-tab pausing was verified in the renderer's `visibilitychange`
handler, but the headless browser did not mark a background tab hidden, so that behavior was
not demonstrated live. GPU time, GPU memory, Safari, and sustained mobile thermals were not
measured. No shader or context-loss errors appeared in the sampled browser console.

## Baseline warnings and unrelated limitations

- The same Next.js CSS preload warning appears in the isolated `origin/main` production build.
  The baseline also showed one additional route CSS preload warning. It is not attributable to
  the Infinite Void integration from this evidence.
- `/favicon.ico` returned 404 on both builds. There is no favicon in `origin/main`; the browser
  requested the missing application asset. It predates this integration.
- Both About GSAP target warnings appeared on `origin/main`; the caption-hook correction above
  removes them on this branch.
- Resume's current `LinkedIn` and `Get in Touch` links still point to
  `https://linkedin.com/in/` and `mailto:contact@example.com`. They are existing placeholders;
  real contact destinations were not supplied.
- The original verifier ran for 13 minutes without producing results and was stopped along with
  its dedicated Chrome process. This report uses separate bounded browser checks instead.

## Visual evidence

| Page | Baseline | Final |
|---|---|---|
| Projects desktop | [before](screenshots/phase-6/baseline-projects-desktop.png) | [after](screenshots/phase-6/final-projects-desktop.png) |
| Projects mobile | — | [final](screenshots/phase-6/final-projects-mobile.png) |
| Resume desktop | — | [final](screenshots/phase-6/final-resume-desktop.png) |
| About desktop | [before](screenshots/phase-6/baseline-about-desktop.png) | [after](screenshots/phase-6/final-about-desktop.png) |
| About mobile | — | [final](screenshots/phase-6/final-about-mobile.png) |
| Experience desktop | [before](screenshots/phase-6/baseline-experience-desktop.png) | [after](screenshots/phase-6/final-experience-desktop.png) |
| Experience mobile | — | [final](screenshots/phase-6/final-experience-mobile.png) |
| Home desktop | [before](screenshots/phase-6/baseline-home-desktop.png) | [after](screenshots/phase-6/final-home-desktop.png) |
| Home mobile | — | [final](screenshots/phase-6/final-home-mobile.png) |

The Home desktop captures match in layout and artwork apart from the existing scene's animated
details. A fresh Home load left the void layer in `idle` mode, hidden, with an uninitialized
300-pixel canvas. The renderer was not initialized on Home.

## Release limitation

The upstream `jjk-domain-expansion` repository has no public licence recorded at the audited
commit. The owner says reuse permission was granted, but the grantor, evidence, exact coverage
of the three `world3d/` source files, and public redistribution terms remain to be documented
in `docs/source-permissions.md` before publishing this adapted source.
