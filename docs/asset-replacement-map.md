# Asset replacement map

Inventory: all 410 files under `reference/daniel-portfolio/public` at the audited commit. Dimensions are reported for image formats where macOS `sips` could read them; video/model dimensions and codecs are **not verified**. Usage is based on literal source references in `app`, `components`, `data`, `lib`, and `contexts`; constructed paths can evade this search. This is an inventory, not a reuse grant.

Key evidence: landing layers `app/page.tsx:266-314`, `components/landing/tree-overlays.tsx:12-65`; projects `data/projects.ts:18-104`, `components/projects/background-videos.tsx:60-100`, `components/projects/project-slider.tsx:363-536`; About `components/about/background-layers.tsx:100-191`, `components/about/mobile-background.tsx:38-119`; Experience `components/experience/background-video.tsx:142-170`, `data/experience.ts:17-41`; transition paper `components/ui/page-transition/ink-mask-svg.tsx:153-211`; selector assets `components/ui/mode-selector/*`.

The primary landing composite is `/landing/videos/landing_composite_24fps.{webm,_hevc.mov}` (19.7/30.2 MB); tree alpha variants and the still image are separate. For the carousel, each project entry has a frame, a video thumbnail, a still thumbnail, and five content images (`data/projects.ts:18-104`). Replace all with AFTERIMAGE projects. Stock/third-party notices and Daniel personal materials must be cleared individually.

| Asset path (under `public/`) | Dimensions / size | Observed usage | Proposed treatment |
|---|---:|---|---|
| `about/images/bg.webp` | 1920×1080; 0.10 MiB | Direct path in source | Own portrait, biography art or motion |
| `about/images/bongo_cat.webp` | 1920×1080; 0.08 MiB | No direct path found; indirect or unused uncertain | Own portrait, biography art or motion |
| `about/images/cat.webp` | 1157×671; 0.07 MiB | No direct path found; indirect or unused uncertain | Own portrait, biography art or motion |
| `about/images/cat2.webp` | 586×1019; 0.06 MiB | No direct path found; indirect or unused uncertain | Own portrait, biography art or motion |
| `about/images/cat3.webp` | 574×1046; 0.06 MiB | Direct path in source | Own portrait, biography art or motion |
| `about/images/github.webp` | 75×74; 0.00 MiB | Direct path in source | Own portrait, biography art or motion |
| `about/images/gmail.webp` | 79×79; 0.00 MiB | Direct path in source | Own portrait, biography art or motion |
| `about/images/katie_daniel_w_liu_v2.webp` | 1946×459; 0.10 MiB | Direct path in source | Own portrait, biography art or motion |
| `about/images/katie_subtitle_v2.webp` | 3297×377; 0.11 MiB | Direct path in source | Own portrait, biography art or motion |
| `about/images/katie_tech_stack_v2.webp` | 1474×461; 0.08 MiB | Direct path in source | Own portrait, biography art or motion |
| `about/images/linkedln.webp` | 74×74; 0.00 MiB | Direct path in source | Own portrait, biography art or motion |
| `about/images/right_colour.webp` | 1920×1080; 0.08 MiB | No direct path found; indirect or unused uncertain | Own portrait, biography art or motion |
| `about/images/right_graphics.webp` | 1920×1080; 0.07 MiB | Direct path in source | Own portrait, biography art or motion |
| `about/images/socials.webp` | 1920×1080; 0.01 MiB | No direct path found; indirect or unused uncertain | Own portrait, biography art or motion |
| `about/images/strip.webp` | 932×61; 0.01 MiB | No direct path found; indirect or unused uncertain | Own portrait, biography art or motion |
| `about/images/waterloo.webp` | 1920×1080; 0.03 MiB | No direct path found; indirect or unused uncertain | Own portrait, biography art or motion |
| `about/videos/right_colour.webm` | 0.44 MiB | AlphaVideo source variant | Own portrait, biography art or motion |
| `about/videos/right_colour_hevc.mov` | 0.80 MiB | AlphaVideo source variant | Own portrait, biography art or motion |
| `about/videos/right_colour_phone.webm` | 0.76 MiB | Direct path in source | Own portrait, biography art or motion |
| `about/videos/sparkle_being.webm` | 0.34 MiB | AlphaVideo source variant | Own portrait, biography art or motion |
| `about/videos/sparkle_being_hevc.mov` | 0.20 MiB | AlphaVideo source variant | Own portrait, biography art or motion |
| `about/videos/sparkle_loop.webm` | 2.47 MiB | AlphaVideo source variant | Own portrait, biography art or motion |
| `about/videos/sparkle_loop_hevc.mov` | 1.63 MiB | AlphaVideo source variant | Own portrait, biography art or motion |
| `about/videos/water_colour.webm` | 0.68 MiB | Direct path in source | Own portrait, biography art or motion |
| `animation_frames/experience/bg_anime/your_name_scene_.png0300.webp` | 1920×1080; 0.16 MiB | Direct path in source | Still from own motion assets |
| `animation_frames/landing/composed_bg/composed_bg0300.webp` | 1920×1080; 0.93 MiB | Direct path in source | Still from own motion assets |
| `animation_frames/landing/composed_bg/dragon_body0003.webp` | 1920×1080; 0.94 MiB | No direct path found; indirect or unused uncertain | Still from own motion assets |
| `animation_frames/landing/tree_left0200.webp` | 1920×1080; 0.09 MiB | Direct path in source | Still from own motion assets |
| `animation_frames/landing/tree_right0200.webp` | 1920×1080; 0.07 MiB | Direct path in source | Still from own motion assets |
| `animation_frames/manga/manga_bg/0400.webp` | 1920×1080; 0.51 MiB | Direct path in source | Still from own motion assets |
| `animation_frames/manga/manga_intro/0075.webp` | 1920×1080; 0.51 MiB | Direct path in source | Still from own motion assets |
| `animation_frames/manga/manga_man/0200.webp` | 1920×1080; 0.07 MiB | Direct path in source | Still from own motion assets |
| `animation_frames/manga/manga_man_intro/0075.webp` | 1920×1080; 0.07 MiB | Direct path in source | Still from own motion assets |
| `animation_frames/watercolour_sequences/colour_vid/render_compositing_080.webp` | 1920×1080; 0.08 MiB | Direct path in source | Still from own motion assets |
| `animation_frames/watercolour_sequences/colour_vid_phone/render_compositing_080.webp` | 1920×1080; 0.12 MiB | Direct path in source | Still from own motion assets |
| `animation_frames/watercolour_sequences/portrait_vid/render_compositing_080.webp` | 1920×1080; 0.16 MiB | Direct path in source | Still from own motion assets |
| `animation_frames/watercolour_sequences/sparkle_loop_vid/render_compositing_250.webp` | 1920×1080; 0.04 MiB | Direct path in source | Still from own motion assets |
| `animations/paper-desktop-v1.bin.gz` | 0.07 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `animations/paper-portrait-v1.bin.gz` | 0.06 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `assets/Daniel_W_Liu_Resume.pdf` | 0.13 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `assets/resume.pdf` | 0.12 MiB | Direct path in source | Own resume/content or exclude |
| `draco/README.md` | 0.00 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `draco/draco_decoder.js` | 0.69 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `draco/draco_decoder.wasm` | 0.27 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `draco/draco_wasm_wrapper.js` | 0.06 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `experience/images/bg_sky.webp` | 1920×1080; 0.12 MiB | No direct path found; indirect or unused uncertain | Own career art; employer logos only with rights |
| `experience/images/card_img.webp` | 1920×1080; 0.10 MiB | Direct path in source | Own career art; employer logos only with rights |
| `experience/images/experience_text.webp` | 1646×234; 0.07 MiB | Direct path in source | Own career art; employer logos only with rights |
| `experience/images/hollandbloorview_logo.webp` | 400×400; 0.02 MiB | Direct path in source | Own career art; employer logos only with rights |
| `experience/images/hosa_canada_logo.webp` | 1024×1024; 0.02 MiB | Direct path in source | Own career art; employer logos only with rights |
| `experience/images/playstation-logo.webp` | 1600×1108; 0.03 MiB | Direct path in source | Own career art; employer logos only with rights |
| `experience/images/playstation_logo.png` | 1600×1108; 0.09 MiB | No direct path found; indirect or unused uncertain | Own career art; employer logos only with rights |
| `experience/images/video.webp` | 1424×1413; 1.35 MiB | No direct path found; indirect or unused uncertain | Own career art; employer logos only with rights |
| `experience/images/wedge_logo.avif` | 0.00 MiB | Direct path in source | Own career art; employer logos only with rights |
| `experience/videos/anime_intro.webm` | 0.55 MiB | AlphaVideo source variant | Own career art; employer logos only with rights |
| `experience/videos/anime_intro_hevc.mov` | 1.97 MiB | AlphaVideo source variant | Own career art; employer logos only with rights |
| `experience/videos/anime_style_bg.webm` | 3.21 MiB | AlphaVideo source variant | Own career art; employer logos only with rights |
| `experience/videos/anime_style_bg_hevc.mov` | 6.37 MiB | AlphaVideo source variant | Own career art; employer logos only with rights |
| `experience/videos/first_name.webm` | 1.77 MiB | No direct path found; indirect or unused uncertain | Own career art; employer logos only with rights |
| `experience/videos/first_name_hevc.mov` | 1.55 MiB | No direct path found; indirect or unused uncertain | Own career art; employer logos only with rights |
| `experience/videos/last_name.webm` | 2.56 MiB | No direct path found; indirect or unused uncertain | Own career art; employer logos only with rights |
| `experience/videos/last_name_hevc.mov` | 0.52 MiB | No direct path found; indirect or unused uncertain | Own career art; employer logos only with rights |
| `experience/videos/middle_name.webm` | 1.00 MiB | No direct path found; indirect or unused uncertain | Own career art; employer logos only with rights |
| `experience/videos/middle_name_hevc.mov` | 0.18 MiB | No direct path found; indirect or unused uncertain | Own career art; employer logos only with rights |
| `fonts/ARCADECLASSIC.TTF` | 0.02 MiB | No direct path found; indirect or unused uncertain | Licensed replacement font/icon or own design |
| `fonts/ARCADECLASSIC.woff2` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `fonts/Atop.ttf` | 0.15 MiB | No direct path found; indirect or unused uncertain | Licensed replacement font/icon or own design |
| `fonts/Atop.woff2` | 0.03 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `fonts/BabyToys-Regular.otf` | 0.02 MiB | No direct path found; indirect or unused uncertain | Licensed replacement font/icon or own design |
| `fonts/BabyToys-Regular.ttf` | 0.02 MiB | No direct path found; indirect or unused uncertain | Licensed replacement font/icon or own design |
| `fonts/FAST BLAZE.woff2` | 0.02 MiB | No direct path found; indirect or unused uncertain | Licensed replacement font/icon or own design |
| `fonts/FrederickatheGreat-Regular.woff2` | 0.20 MiB | No direct path found; indirect or unused uncertain | Licensed replacement font/icon or own design |
| `fonts/FrederickatheGreat-core-v1.woff2` | 0.14 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `fonts/FrederickatheGreat-extended-v1.woff2` | 0.10 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `fonts/KatieRoze-Flight.woff2` | 2.72 MiB | No direct path found; indirect or unused uncertain | Licensed replacement font/icon or own design |
| `fonts/KatieRoze-display-512.woff2` | 0.30 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `fonts/KatieRoze-web.woff2` | 2.74 MiB | No direct path found; indirect or unused uncertain | Licensed replacement font/icon or own design |
| `fonts/Mochibop-Demo.ttf` | 0.03 MiB | No direct path found; indirect or unused uncertain | Licensed replacement font/icon or own design |
| `fonts/MochibopBold-Demo.woff2` | 0.01 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `fonts/Weddingday.woff2` | 0.03 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `fonts/WeddingdayPersonalUseRegular-1Gvo0.ttf` | 0.16 MiB | No direct path found; indirect or unused uncertain | Licensed replacement font/icon or own design |
| `fonts/WeddingdayPersonalUseRegular-1Gvo0.woff2` | 0.03 MiB | No direct path found; indirect or unused uncertain | Licensed replacement font/icon or own design |
| `images/canvas.webp` | 0.10 MiB | No direct path found; indirect or unused uncertain | Original shared UI art |
| `images/cat_spin.webp` | 0.04 MiB | Direct path in source | Original shared UI art |
| `images/icon.webp` | 242×245; 0.01 MiB | No direct path found; indirect or unused uncertain | Original shared UI art |
| `images/image.webp` | 2048×2048; 0.06 MiB | No direct path found; indirect or unused uncertain | Original shared UI art |
| `images/paper_bg.webp` | 1920×1080; 0.13 MiB | No direct path found; indirect or unused uncertain | Original shared UI art |
| `images/pumpkin_baked.webp` | 2048×2048; 0.16 MiB | No direct path found; indirect or unused uncertain | Original shared UI art |
| `images/pumpkin_stroke_alpha.webp` | 2048×2048; 0.28 MiB | No direct path found; indirect or unused uncertain | Original shared UI art |
| `images/punpkin_stroke_rgba.webp` | 2048×2048; 0.29 MiB | No direct path found; indirect or unused uncertain | Original shared UI art |
| `images/temp.webp` | 1920×1080; 0.16 MiB | No direct path found; indirect or unused uncertain | Original shared UI art |
| `images/water_colour.webp` | 1920×1080; 0.17 MiB | No direct path found; indirect or unused uncertain | Original shared UI art |
| `landing/images/a4_lightly.webp` | 3618×5260; 0.63 MiB | No direct path found; indirect or unused uncertain | Original city art, silent motion or still |
| `landing/images/a5_lightly_damaged.webp` | 2000×2000; 0.34 MiB | No direct path found; indirect or unused uncertain | Original city art, silent motion or still |
| `landing/images/beige-paper.webp` | 200×200; 0.03 MiB | No direct path found; indirect or unused uncertain | Original city art, silent motion or still |
| `landing/images/bg_paper.webp` | 1920×1080; 0.02 MiB | No direct path found; indirect or unused uncertain | Original city art, silent motion or still |
| `landing/images/mountain1.webp` | 7680×4320; 3.31 MiB | No direct path found; indirect or unused uncertain | Original city art, silent motion or still |
| `landing/images/mountain2.webp` | 7680×4320; 3.75 MiB | No direct path found; indirect or unused uncertain | Original city art, silent motion or still |
| `landing/images/mountain3.webp` | 7680×4320; 2.62 MiB | No direct path found; indirect or unused uncertain | Original city art, silent motion or still |
| `landing/images/mountain4.webp` | 7680×4320; 2.01 MiB | No direct path found; indirect or unused uncertain | Original city art, silent motion or still |
| `landing/images/mountain5.webp` | 7680×4320; 1.83 MiB | No direct path found; indirect or unused uncertain | Original city art, silent motion or still |
| `landing/images/mountain6.webp` | 7680×4320; 2.86 MiB | No direct path found; indirect or unused uncertain | Original city art, silent motion or still |
| `landing/images/painted_bg.webp` | 1920×1080; 0.17 MiB | Direct path in source | Original city art, silent motion or still |
| `landing/images/rough_bg.webp` | 1920×1080; 0.03 MiB | No direct path found; indirect or unused uncertain | Original city art, silent motion or still |
| `landing/images/rough_paper.webp` | 1920×1080; 0.06 MiB | No direct path found; indirect or unused uncertain | Original city art, silent motion or still |
| `landing/images/white_paper.webp` | 1980×1080; 0.08 MiB | Direct path in source | Original city art, silent motion or still |
| `landing/models/butterfly_compressed.glb` | 0.60 MiB | Direct path in source | Original city art, silent motion or still |
| `landing/videos/landing_composite_24fps.webm` | 18.78 MiB | Direct path in source | Original city art, silent motion or still |
| `landing/videos/landing_composite_24fps_hevc.mov` | 28.83 MiB | Direct path in source | Original city art, silent motion or still |
| `landing/videos/tree_left.webm` | 2.53 MiB | AlphaVideo source variant | Original city art, silent motion or still |
| `landing/videos/tree_left_hevc.mov` | 6.48 MiB | AlphaVideo source variant | Original city art, silent motion or still |
| `landing/videos/tree_right.webm` | 2.47 MiB | AlphaVideo source variant | Original city art, silent motion or still |
| `landing/videos/tree_right_hevc.mov` | 5.94 MiB | AlphaVideo source variant | Original city art, silent motion or still |
| `models/CREDITS.md` | 0.00 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `models/casino-cat-v1.glb` | 0.42 MiB | Direct path in source | Exclude from initial build; assess only if needed |
| `models/casino-chip-meshy.glb` | 1.96 MiB | Direct path in source | Exclude from initial build; assess only if needed |
| `models/casino-dealer-v1.glb` | 9.59 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `models/casino-dealer-v1.json` | 0.00 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `models/casino-dealer-v2.glb` | 10.45 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `models/casino-dealer-v2.json` | 0.00 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `models/casino-dealer-v3-1mb.glb` | 0.89 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `models/casino-dealer-v3-1mb.json` | 0.00 MiB | Direct path in source | Exclude from initial build; assess only if needed |
| `models/casino-dealer-v3-compact.glb` | 4.85 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `models/casino-dealer-v3-compact.json` | 0.00 MiB | Direct path in source | Exclude from initial build; assess only if needed |
| `models/casino-dealer-v3-lean.glb` | 2.32 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `models/casino-dealer-v3-lean.json` | 0.00 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `models/casino-dealer-v3-meshopt.glb` | 2.55 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `models/casino-dealer-v3-meshopt.json` | 0.00 MiB | Direct path in source | Exclude from initial build; assess only if needed |
| `models/casino-dealer-v3-web.glb` | 8.77 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `models/casino-dealer-v3-web.json` | 0.00 MiB | Direct path in source | Exclude from initial build; assess only if needed |
| `models/casino-dealer-v3.glb` | 10.99 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `models/casino-dealer-v3.json` | 0.00 MiB | Direct path in source | Exclude from initial build; assess only if needed |
| `models/casino-reaper-v1.glb` | 0.61 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `models/casino-reaper-v2-rigged.glb` | 0.70 MiB | Direct path in source | Exclude from initial build; assess only if needed |
| `models/casino-reaper-v2.glb` | 0.45 MiB | Direct path in source | Exclude from initial build; assess only if needed |
| `models/casino-table-v1.glb` | 0.32 MiB | Direct path in source | Exclude from initial build; assess only if needed |
| `models/chip-b.glb` | 0.19 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `models/dice-b.glb` | 0.15 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `models/dice-preview.glb` | 0.11 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `models/goose-rigged.draco.glb` | 0.28 MiB | Direct path in source | Exclude from initial build; assess only if needed |
| `models/goose-rigged.glb` | 5.00 MiB | Direct path in source | Exclude from initial build; assess only if needed |
| `models/goose.glb` | 2.70 MiB | Direct path in source | Exclude from initial build; assess only if needed |
| `models/paper-delivery.webp` | 1024×1024; 0.14 MiB | Direct path in source | Exclude from initial build; assess only if needed |
| `models/paper.png` | 1024×1024; 0.21 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `models/pomme-apple.glb` | 0.83 MiB | Direct path in source | Exclude from initial build; assess only if needed |
| `models/projects-scene.glb` | 17.26 MiB | Direct path in source | Exclude from initial build; assess only if needed |
| `models/resume-folder-meshopt.glb` | 0.26 MiB | Direct path in source | Exclude from initial build; assess only if needed |
| `models/resume-folder-meshopt.json` | 0.00 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `models/resume-folder-raw.glb` | 0.04 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `models/resume-folder-rig.glb` | 0.43 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `models/resume-folder-split.glb` | 0.63 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `models/resume-folder.glb` | 0.42 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `models/roulette-wheel-meshy.glb` | 1.17 MiB | Direct path in source | Exclude from initial build; assess only if needed |
| `models/spaceship.glb` | 2.37 MiB | Direct path in source | Exclude from initial build; assess only if needed |
| `models/watercolor-normal-optimized.webp` | 1024×1024; 0.16 MiB | Direct path in source | Exclude from initial build; assess only if needed |
| `models/watercolor_normal-delivery.webp` | 1024×1024; 0.67 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `models/watercolor_normal.png` | 1024×1024; 1.63 MiB | Direct path in source | Exclude from initial build; assess only if needed |
| `models/watercolor_normal.webp` | 1024×1024; 1.20 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `motion-capture-worker.js` | 0.00 MiB | Direct path in source | Exclude from initial build; assess only if needed |
| `pomme/pomme-demo.mp4` | 8.96 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `pomme/pomme-poster.jpg` | 720×900; 0.06 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `portfolio/DanielWLiu_Portfolio.pdf` | 9.30 MiB | Direct path in source | Own resume/content or exclude |
| `portfolio/pages/01-900.webp` | 900×1274; 0.15 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/01.webp` | 1800×2548; 0.50 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/02-900.webp` | 900×1274; 0.17 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/02.webp` | 1800×2548; 0.58 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/03-900.webp` | 900×1274; 0.16 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/03.webp` | 1800×2548; 0.48 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/04-900.webp` | 900×1274; 0.21 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/04.webp` | 1800×2548; 0.77 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/05-900.webp` | 900×1274; 0.15 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/05.webp` | 1800×2548; 0.49 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/06-900.webp` | 900×1274; 0.15 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/06.webp` | 1800×2548; 0.50 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/07-900.webp` | 900×1274; 0.19 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/07.webp` | 1800×2548; 0.60 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/08-900.webp` | 900×1274; 0.16 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/08.webp` | 1800×2548; 0.45 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/09-900.webp` | 900×1274; 0.16 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/09.webp` | 1800×2548; 0.51 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/10-900.webp` | 900×1274; 0.15 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/10.webp` | 1800×2548; 0.42 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/11-900.webp` | 900×1274; 0.17 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/11.webp` | 1800×2548; 0.60 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/12-900.webp` | 900×1274; 0.15 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/12.webp` | 1800×2548; 0.50 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/13-900.webp` | 900×1274; 0.16 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/13.webp` | 1800×2548; 0.51 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/14-900.webp` | 900×1274; 0.16 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `portfolio/pages/14.webp` | 1800×2548; 0.45 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `projects/images/flash_bg.webp` | 1920×1080; 0.47 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/images/frames/frame_1.webp` | 389×596; 0.03 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/images/frames/frame_2.webp` | 389×596; 0.02 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/images/frames/frame_3.webp` | 390×596; 0.02 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/images/frames/frame_4.webp` | 389×597; 0.02 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/images/frames/frame_5.webp` | 389×596; 0.01 MiB | No direct path found; indirect or unused uncertain | Own project screenshots, card art or city motion |
| `projects/images/frames/frame_6.webp` | 389×596; 0.02 MiB | No direct path found; indirect or unused uncertain | Own project screenshots, card art or city motion |
| `projects/images/frames/frame_7.webp` | 389×596; 0.01 MiB | No direct path found; indirect or unused uncertain | Own project screenshots, card art or city motion |
| `projects/images/frames/frame_8.webp` | 389×596; 0.02 MiB | No direct path found; indirect or unused uncertain | Own project screenshots, card art or city motion |
| `projects/images/frames/frames_9.webp` | 1920×1080; 0.04 MiB | No direct path found; indirect or unused uncertain | Own project screenshots, card art or city motion |
| `projects/images/starry.webp` | 1920×1080; 0.10 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/curve_guard/about.webp` | 1924×2918; 0.30 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/curve_guard/calender.webp` | 1924×2918; 0.24 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/curve_guard/error.webp` | 1924×2919; 0.25 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/curve_guard/features.webp` | 1924×2919; 0.25 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/curve_guard/frame.webp` | 2918×1924; 0.12 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/curve_guard/landing.webp` | 1924×2918; 0.22 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/portfolio_website/about.webp` | 1924×2918; 0.55 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/portfolio_website/education.webp` | 1925×2919; 0.48 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/portfolio_website/frame.webp` | 1924×2918; 0.22 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/portfolio_website/main.webp` | 1927×2917; 0.44 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/portfolio_website/resume.webp` | 1924×2918; 0.38 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/portfolio_website/title.webp` | 1924×2918; 0.65 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/rainbolt.ai/chat.webp` | 1924×2918; 0.57 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/rainbolt.ai/constellation.webp` | 1924×2918; 0.22 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/rainbolt.ai/frame.webp` | 1924×2918; 0.17 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/rainbolt.ai/landing.webp` | 1924×2918; 0.56 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/rainbolt.ai/team.webp` | 1924×2918; 0.66 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/rainbolt.ai/tech.webp` | 1924×2918; 0.24 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/vibetrade/frame.webp` | 1924×2918; 0.08 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/vibetrade/girl.webp` | 1924×2918; 0.21 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/vibetrade/girl2.webp` | 1924×2918; 0.20 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/vibetrade/landing.webp` | 1924×2918; 0.17 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/vibetrade/selection.webp` | 1924×2918; 0.17 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/projects/vibetrade/tables.webp` | 1924×2918; 0.14 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/thumbnails/curveguard_pingpong.webm` | 0.35 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/thumbnails/curveguard_pingpong_frame.webp` | 500×533; 0.01 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/thumbnails/portfolio_pingpong.webm` | 0.30 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/thumbnails/portfolio_pingpong_frame.webp` | 500×540; 0.02 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/thumbnails/rainbolt_pingpong.webm` | 2.53 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/thumbnails/rainbolt_pingpong_frame.webp` | 500×681; 0.08 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/thumbnails/vibetrade_pingpong.webm` | 0.69 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/thumbnails/vibetrade_pingpong_frame.webp` | 500×262; 0.01 MiB | Direct path in source | Own project screenshots, card art or city motion |
| `projects/videos/manga_bg_slowed.webm` | 9.18 MiB | AlphaVideo source variant | Own project screenshots, card art or city motion |
| `projects/videos/manga_bg_slowed_hevc.mov` | 28.74 MiB | AlphaVideo source variant | Own project screenshots, card art or city motion |
| `projects/videos/manga_intro_bg.webm` | 0.99 MiB | AlphaVideo source variant | Own project screenshots, card art or city motion |
| `projects/videos/manga_intro_bg_hevc.mov` | 3.03 MiB | AlphaVideo source variant | Own project screenshots, card art or city motion |
| `projects/videos/manga_man.webm` | 2.39 MiB | AlphaVideo source variant | Own project screenshots, card art or city motion |
| `projects/videos/manga_man_hevc.mov` | 4.62 MiB | AlphaVideo source variant | Own project screenshots, card art or city motion |
| `projects/videos/manga_man_intro.webm` | 0.40 MiB | AlphaVideo source variant | Own project screenshots, card art or city motion |
| `projects/videos/manga_man_intro_hevc.mov` | 0.79 MiB | AlphaVideo source variant | Own project screenshots, card art or city motion |
| `quality/images/big_note_quality.webp` | 401×260; 0.02 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/cat_tongue.webp` | 633×952; 0.06 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/cat_tongue_outline.webp` | 795×905; 0.03 MiB | Direct path in source | Original mode-selector artwork |
| `quality/images/clip_1_outline.webp` | 326×427; 0.01 MiB | Direct path in source | Original mode-selector artwork |
| `quality/images/clip_2_outline.webp` | 360×316; 0.01 MiB | Direct path in source | Original mode-selector artwork |
| `quality/images/clip_2_quality.webp` | 153×131; 0.01 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/clip_3_outline.webp` | 359×314; 0.01 MiB | Direct path in source | Original mode-selector artwork |
| `quality/images/clip_3_quality.webp` | 152×129; 0.01 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/clip_4_outline.webp` | 330×431; 0.01 MiB | Direct path in source | Original mode-selector artwork |
| `quality/images/clip_4_qua;lity.webp` | 150×198; 0.01 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/clip_quality_2.webp` | 150×198; 0.01 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/paper_clip_outline_1.webp` | 147×392; 0.01 MiB | Direct path in source | Original mode-selector artwork |
| `quality/images/paper_clip_outline_2.webp` | 148×395; 0.01 MiB | Direct path in source | Original mode-selector artwork |
| `quality/images/paper_clip_outline_3.webp` | 135×414; 0.01 MiB | Direct path in source | Original mode-selector artwork |
| `quality/images/paper_clip_outline_4.webp` | 133×393; 0.01 MiB | Direct path in source | Original mode-selector artwork |
| `quality/images/paper_clip_outline_5.webp` | 150×394; 0.01 MiB | Direct path in source | Original mode-selector artwork |
| `quality/images/paper_clip_outline_6.webp` | 136×397; 0.01 MiB | Direct path in source | Original mode-selector artwork |
| `quality/images/paper_clip_outline_7.webp` | 131×389; 0.01 MiB | Direct path in source | Original mode-selector artwork |
| `quality/images/paper_clip_quality_1.webp` | 50×143; 0.00 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/paper_clip_quality_2.webp` | 50×145; 0.00 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/paper_clip_quality_3.webp` | 43×145; 0.00 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/paper_clip_quality_4.webp` | 46×145; 0.00 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/paper_clip_quality_5.webp` | 46×146; 0.00 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/paper_clip_quality_6.webp` | 51×145; 0.00 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/paper_clip_quality_7.webp` | 48×148; 0.00 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/pin_outline.webp` | 795×905; 0.04 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/pin_outline_1.webp` | 245×397; 0.01 MiB | Direct path in source | Original mode-selector artwork |
| `quality/images/pin_outline_2.webp` | 250×406; 0.01 MiB | Direct path in source | Original mode-selector artwork |
| `quality/images/pin_outline_3.webp` | 250×401; 0.01 MiB | Direct path in source | Original mode-selector artwork |
| `quality/images/pin_quality_1.webp` | 69×117; 0.00 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/pin_quality_2.webp` | 70×116; 0.00 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/pin_quality_3.webp` | 69×116; 0.00 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/pin_quality_4.webp` | 69×116; 0.00 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/selfie.webp` | 795×905; 0.07 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/selfie_outline.webp` | 795×905; 0.05 MiB | Direct path in source | Original mode-selector artwork |
| `quality/images/stationary_2_outline.webp` | 795×905; 0.04 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/stationary_outline.webp` | 795×905; 0.04 MiB | Direct path in source | Original mode-selector artwork |
| `quality/images/stationary_quality.webp` | 1920×1080; 0.18 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/sticky_quality.webp` | 1920×1080; 0.11 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/sticky_quality_1.webp` | 262×323; 0.01 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/sticky_quality_2.webp` | 266×289; 0.01 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/sticky_quality_3.webp` | 263×305; 0.01 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/sticky_quality_4.webp` | 288×319; 0.01 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/sticky_quality_5.webp` | 289×326; 0.01 MiB | No direct path found; indirect or unused uncertain | Original mode-selector artwork |
| `quality/images/sticky_quality_outline_1.webp` | 795×905; 0.02 MiB | Direct path in source | Original mode-selector artwork |
| `quality/images/sticky_quality_outline_2.webp` | 795×905; 0.02 MiB | Direct path in source | Original mode-selector artwork |
| `quality/images/waterloo_outline.webp` | 776×777; 0.05 MiB | Direct path in source | Original mode-selector artwork |
| `resume/Jan_2026__external_Daniel_W_Liu.pdf` | 0.23 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `resume/button_img/cat_selected.webp` | 1920×1080; 0.12 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `resume/button_img/email_selected.webp` | 1920×1080; 0.07 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `resume/button_img/folder_selected.webp` | 1920×1080; 0.14 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `resume/button_img/github_selected.webp` | 1920×1080; 0.09 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `resume/button_img/linkedln_selected.webp` | 1920×1080; 0.10 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `resume/button_img/selfie_selected.webp` | 1920×1080; 0.14 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `resume/button_img/waterloo_selected.webp` | 1920×1080; 0.19 MiB | Direct path in source | Own resume/content or exclude |
| `resume/images/photo_img/cat.webp` | 1964×2705; 0.57 MiB | Direct path in source | Own resume/content or exclude |
| `resume/images/photo_img/self.webp` | 751×1468; 0.08 MiB | Direct path in source | Own resume/content or exclude |
| `resume/images/resume_last_frame.webp` | 1920×1080; 0.14 MiB | Direct path in source | Own resume/content or exclude |
| `resume/images/riot.webp` | 256×256; 0.00 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `resume/intro/desktop-v4.mp4` | 2.88 MiB | Direct path in source | Own resume/content or exclude |
| `resume/intro/desktop-v4.webp` | 1280×720; 0.00 MiB | Direct path in source | Own resume/content or exclude |
| `resume/intro/phone-v5.mp4` | 1.90 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `resume/intro/phone-v5.webp` | 720×1334; 0.00 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `resume/qr-resume.png` | 528×528; 0.00 MiB | Direct path in source | Own resume/content or exclude |
| `resume/resume-page1-lossless.webp` | 1583×2048; 0.19 MiB | Direct path in source | Own resume/content or exclude |
| `resume/resume-page1.jpg` | 1583×2048; 0.82 MiB | No direct path found; indirect or unused uncertain | Own resume/content or exclude |
| `resume/videos/resume_loading_anim_24fps.webm` | 0.67 MiB | Direct path in source | Own resume/content or exclude |
| `shared/badges/aws.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/blender.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/bootstrap.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/c.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/canva.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/csharp.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/css3.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/docker.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/expressjs.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/fastapi.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/firebase.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/git.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/github.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/html5.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/java.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/javascript.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/matplotlib.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/mongodb.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/mysql.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/nextjs.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/nodejs.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/numpy.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/opencv.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/pandas.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/postgresql.svg` | 0.01 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/python.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/radixui.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/react.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/supabase.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/tailwindcss.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/threejs.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/typescript.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/unity.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/badges/vercel.svg` | 0.00 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/fonts/Katie Roze Watercolour Font - By Lef/KatieRoze.woff2` | 5.48 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/fonts/weddingday-font/WeddingdayPersonalUseRegular-1Gvo0.ttf` | 0.16 MiB | No direct path found; indirect or unused uncertain | Licensed replacement font/icon or own design |
| `shared/fonts/weddingday-font/ancient-wedding-font/AncientWeddingDemoRegular-KVwll.otf` | 0.07 MiB | No direct path found; indirect or unused uncertain | Licensed replacement font/icon or own design |
| `shared/fonts/weddingday-font/ancient-wedding-font/AncientWeddingDemoRegular-MAm1n.woff2` | 0.05 MiB | Direct path in source | Licensed replacement font/icon or own design |
| `shared/fonts/weddingday-font/ancient-wedding-font/info.txt` | 0.00 MiB | No direct path found; indirect or unused uncertain | Licensed replacement font/icon or own design |
| `shared/fonts/weddingday-font/ancient-wedding-font/misc/177Studio-License.txt` | 0.00 MiB | No direct path found; indirect or unused uncertain | Licensed replacement font/icon or own design |
| `shared/fonts/weddingday-font/info.txt` | 0.00 MiB | No direct path found; indirect or unused uncertain | Licensed replacement font/icon or own design |
| `shared/fonts/weddingday-font/misc/ ! ! ! TERMS OF USE.txt` | 0.00 MiB | No direct path found; indirect or unused uncertain | Licensed replacement font/icon or own design |
| `shared/icons/file.svg` | 0.00 MiB | No direct path found; indirect or unused uncertain | Licensed replacement font/icon or own design |
| `shared/icons/globe.svg` | 0.00 MiB | No direct path found; indirect or unused uncertain | Licensed replacement font/icon or own design |
| `shared/icons/next.svg` | 0.00 MiB | No direct path found; indirect or unused uncertain | Licensed replacement font/icon or own design |
| `shared/icons/vercel.svg` | 0.00 MiB | No direct path found; indirect or unused uncertain | Licensed replacement font/icon or own design |
| `shared/icons/window.svg` | 0.00 MiB | No direct path found; indirect or unused uncertain | Licensed replacement font/icon or own design |
| `social/always-bet-on-daniel-w-liu-v1.jpg` | 1200×630; 0.13 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `social/always-bet-on-daniel-w-liu-v2.jpg` | 1200×630; 0.13 MiB | Direct path in source | Exclude from initial build; assess only if needed |
| `textures/royal-flush/10-hearts.svg` | 0.01 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/10-hearts.webp` | 720×1080; 0.03 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/10-spades.svg` | 0.01 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/10-spades.webp` | 720×1080; 0.02 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/A-hearts.svg` | 0.00 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/A-hearts.webp` | 720×1080; 0.01 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/A-spades.svg` | 0.00 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/A-spades.webp` | 720×1080; 0.01 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/J-clubs.svg` | 0.17 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/J-clubs.webp` | 720×1080; 0.16 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/J-diamonds.svg` | 0.15 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/J-diamonds.webp` | 720×1080; 0.15 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/J-hearts.svg` | 0.18 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/J-hearts.webp` | 720×1080; 0.18 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/J-spades.svg` | 0.17 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/J-spades.webp` | 720×1080; 0.15 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/K-hearts.svg` | 0.20 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/K-hearts.webp` | 720×1080; 0.17 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/K-spades.svg` | 0.15 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/K-spades.webp` | 720×1080; 0.15 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/Q-hearts.svg` | 0.16 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/Q-hearts.webp` | 720×1080; 0.16 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/Q-spades.svg` | 0.16 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/Q-spades.webp` | 720×1080; 0.16 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/casino-back.svg` | 0.00 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/casino-back.webp` | 720×1080; 0.14 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/10-hearts.svg` | 0.01 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/10-hearts.webp` | 512×768; 0.01 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/10-spades.svg` | 0.01 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/10-spades.webp` | 512×768; 0.01 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/A-hearts.svg` | 0.00 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/A-hearts.webp` | 512×768; 0.00 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/A-spades.svg` | 0.00 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/A-spades.webp` | 512×768; 0.00 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/J-clubs.svg` | 0.17 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/J-clubs.webp` | 512×768; 0.07 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/J-diamonds.svg` | 0.15 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/J-diamonds.webp` | 512×768; 0.07 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/J-hearts.svg` | 0.18 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/J-hearts.webp` | 512×768; 0.08 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/J-spades.svg` | 0.17 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/J-spades.webp` | 512×768; 0.06 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/K-hearts.svg` | 0.20 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/K-hearts.webp` | 512×768; 0.08 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/K-spades.svg` | 0.15 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/K-spades.webp` | 512×768; 0.07 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/Q-hearts.svg` | 0.16 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/Q-hearts.webp` | 512×768; 0.07 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/Q-spades.svg` | 0.16 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/Q-spades.webp` | 512×768; 0.07 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/casino-back.svg` | 0.00 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/casino-back.webp` | 512×768; 0.05 MiB | No direct path found; indirect or unused uncertain | Exclude from initial build; assess only if needed |
| `textures/royal-flush/delivery/manifest.json` | 0.00 MiB | Direct path in source | Exclude from initial build; assess only if needed |

Uncertainties: source references may be composed at runtime; the literal scan does not prove a file is unused. Image dimensions do not establish animation duration, alpha channel, color profile, or ownership. The root-level `assets-original/` and `assets/source/` folders, and vendored binaries, are outside `public`; exclude them unless independently audited.
