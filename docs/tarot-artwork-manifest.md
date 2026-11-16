# Tarot artwork manifest

Last updated: 2026-11-15 (Phase 5A).

**Status: no final tarot artwork is integrated.** No artwork files confirmed as authorized for use exist in this project. All five cards render the original geometric design. Nothing was downloaded, extracted from websites or screenshots, or taken from `reference/daniel-portfolio/`.

## Cards

| # | Card | Project (slug) | Expected artwork path | Source | License / authorization | Image present? |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | The Fool | SpeakLab AI (`speaklab-ai`) | `public/images/tarot/speaklab-ai.webp` | Not yet provided | Not established | **No** |
| XXI | The World | Autonomous Delivery Rover (`autonomous-delivery-rover`) | `public/images/tarot/autonomous-delivery-rover.webp` | Not yet provided | Not established | **No** |
| I | The Magician | Guiding Hands (`guiding-hands`) | `public/images/tarot/guiding-hands.webp` | Not yet provided | Not established | **No** |
| XI | Justice | Road Report (`road-report`) | `public/images/tarot/road-report.webp` | Not yet provided | Not established | **No** |
| XVII | The Star | ZBXP (`zbxp`) | `public/images/tarot/zbxp.webp` | Not yet provided | Not established | **No** |

## Pipeline test files (not project artwork)

These are original test images made for this project in Phase 5A to validate the pipeline. Each is visibly labelled "PIPELINE TEST" and includes proportion markers. They are used only when the site is built with `NEXT_PUBLIC_TAROT_ARTWORK_TEST=1`. A normal build references none of them.

| File | Size | Layout tested | Source |
| --- | --- | --- | --- |
| `public/images/tarot/pipeline-test/full-card-test.webp` | 600×900 | `full-card` (has its own border and text) | Original; SVG source in `docs/tarot-pipeline-test-src/full-card-test.svg`, rasterized with headless Chrome |
| `public/images/tarot/pipeline-test/panel-test.webp` | 800×500 | `panel` (wide image fitted inside the frame) | Original; SVG source in `docs/tarot-pipeline-test-src/panel-test.svg` |
| `public/images/tarot/pipeline-test/missing-on-purpose.webp` | — | Missing-file fallback | Deliberately absent |

## Adding a final illustration

1. **Confirm rights.** Confirm you are authorized to use the image, and fill in its *Source* and *License / authorization* cells above.
2. **Prepare the file.** Export it to the expected path. Recommended:
   - format: WebP (or PNG or JPEG)
   - color profile: sRGB
   - size: 2:3 portrait, about 1200×1800 (enough for the largest expanded size; the texture is capped at 1024×1536)

   Other aspect ratios are fitted without cropping. Any leftover space shows the card background.
3. **Register it.** Add an entry to `authorizedArtwork` in `data/tarot-artwork.ts` with:
   - `src`: same-origin, under `/images/tarot/`
   - `alt`: a description of what the illustration shows
   - `width` and `height`: the file's real pixel size
   - `layout`:
     - `"full-card"`: the illustration includes its own border, numeral and name. The site draws nothing over it.
     - `"panel"`: the illustration only. The site keeps its gold frame, numeral and caption around it.
4. **Set "Image present?"** to **Yes**, then build and check the card in the carousel, the expanded view, and the fallback (WebGL disabled).
