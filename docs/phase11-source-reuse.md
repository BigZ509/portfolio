# Phase 11 source reuse and verification

## Pinned source

The kit's downloader was run in `/tmp/afterimage-phase11-kit/portfolio-personality-phase11-kit`. Direct `curl` could not resolve `raw.githubusercontent.com` in this environment, so the exact files at the pinned commits were retrieved through the connected GitHub file API into the kit's `vendor-sources/` directory. A second run of the downloader confirmed every expected file was present and wrote `REVISIONS.txt`. No vendor source was added to the portfolio.

| Upstream | Revision | Reused in this portfolio |
| --- | --- | --- |
| [GSAP Vault Image Clip Reveal](https://github.com/jaydickinson/free-gsap-effects/blob/72bf2f26a306a711c1793222fa982f829099a58b/image-clip-reveal/assets/script.js) | `72bf2f26a306a711c1793222fa982f829099a58b` | `CLOSED_CLIPS`, `OPEN_CLIP`, `IMG_START_SCALE`, and the wrapper clip plus inner-media scale/easing sequence from `addReveal()` in `components/personal-story/personal-story.tsx`. React/TypeScript refs replace global selectors; the reveal is placed on one scrubbed timeline so reverse scrolling reverses it. |
| [GSAP Vault Parallax Hero](https://github.com/jaydickinson/free-gsap-effects/blob/72bf2f26a306a711c1793222fa982f829099a58b/parallax-hero/assets/script.js) | `72bf2f26a306a711c1793222fa982f829099a58b` | A scoped `gsap.context()`, `gsap.matchMedia()`, one `gsap.timeline({ scrollTrigger: { pin: true, scrub, invalidateOnRefresh: true } })`, and the data-speed layer offset model. The desktop-only runway is limited to 3.4 viewport heights or 3000px (raised from 2.7vh/2400px during Phase 11 QA so each chapter holds its finished scene; the scroll-per-beat pace is unchanged). |

The [optional SVG Scroll Reveal](https://github.com/tahabakri/scroll-reveal/tree/b7a878911f0643b260f309c4dc7a6d83d5108cdc) was downloaded but not used. Its mask would compete with the existing Infinite Void and the story's question. No Lenis instance, upstream page layout, colors, fonts, images, or global CSS were copied.

## Adaptations and boundaries

- About's former MangaGrid is replaced by a full-width `PersonalStory` between the existing mirror dividers. The approved About intro, Infinite Void provider, ChakraSkills, contact, and navigation remain in place. The former `photoPanels` data remains in `data/about.ts` for other uses.
- The source clip effect uses CSS `clip-path` and image scale. The stage uses the existing gold, violet, and ivory palette. Each of Fun, Style, and Adventure uses Marc's supplied media.
- The video is muted, looped, inline, and plays at normal speed only while its chapter is active. It pauses outside that chapter, on tab hide, and on unmount. Native controls remain available if autoplay is blocked.
- At 900px and below the page uses normal vertical flow. Reduced-motion and no-JavaScript views show every chapter and image without hidden content or pinning.
- `components/about.module.css` changes only the About page's `overflow: hidden` to `overflow-x: clip` so a full-width pin has no vertical clipping ancestor.

## Media provenance

The six optimized files were copied unchanged from the user's Phase 11 kit into `public/media/personal/`; their SHA-256 hashes matched `docs/MEDIA-MANIFEST.json` in the kit. The four original photos and original MP4 remain outside `public/`.

Phase 13 re-encoded `jamaica-boomerang.mp4` from that kit file (3.7 Mbps, keyframes ~4 s apart) to H.264 High, CRF 27 capped at 1.5 Mbps, 1 s keyframes, faststart, no audio, same 720×1280 / 30 fps / 11.6 s (5,356,471 → 2,239,096 bytes; SSIM 0.980 against the kit file). See `docs/phase13-completion-report.md`. The kit file's hash therefore no longer matches the served file.

## MIT notice retained for reused GSAP Vault code

MIT License

Copyright (c) 2026 GSAP Vault (gsapvault.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
