# Tarot artwork manifest

Last updated: 2026-11-17 (Phase 7).

**Status: five selected illustrations are integrated.** The owner explicitly confirmed permission to use these exact LOTM images in the Phase 7 brief. This is an owner assertion, not an independently verified public licence. The image files were downloaded from the URLs below and converted from PNG to WebP at quality 94 with no crop or resize. Each source and output is 751×1051 pixels. The source artwork already contains its border, numeral, and title, so all entries use `full-card` and the geometric frame is omitted.

## Cards

| # | Card | Project (slug) | Artwork path | Exact source URL | Authorization | Image present? |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | The Fool | SpeakLab AI (`speaklab-ai`) | `public/images/tarot/speaklab-ai.webp` | [Original PNG](https://cdn.shopify.com/s/files/1/0725/9314/6148/files/CB__0_The_Fool.png?v=1743734326) | Owner confirmed | **Yes** |
| XXI | The World | Autonomous Delivery Rover (`autonomous-delivery-rover`) | `public/images/tarot/autonomous-delivery-rover.webp` | [Original PNG](https://cdn.shopify.com/s/files/1/0725/9314/6148/files/CB__21_The_World.png?v=1743734326) | Owner confirmed | **Yes** |
| I | The Magician | Guiding Hands (`guiding-hands`) | `public/images/tarot/guiding-hands.webp` | [Original PNG](https://cdn.shopify.com/s/files/1/0725/9314/6148/files/CB__1_The_Magician_c1779573-5272-4687-837b-678fc766a4af.png?v=1746151098) | Owner confirmed | **Yes** |
| XI | Justice | Road Report (`road-report`) | `public/images/tarot/road-report.webp` | [Original PNG](https://cdn.shopify.com/s/files/1/0725/9314/6148/files/CB__11_Justice_2.png?v=1743734326) | Owner confirmed | **Yes** |
| XVII | The Star | ZBXP (`zbxp`) | `public/images/tarot/zbxp.webp` | [Original PNG](https://cdn.shopify.com/s/files/1/0725/9314/6148/files/CB__17_The_Star.png?v=1743734326) | Owner confirmed | **Yes** |

Source page: [Cards of Blasphemy](https://lordofmysteries.store/pages/cards-of-blasphemy). Output dimensions and file integrity were checked with Sharp after conversion. No source images were taken from Daniel's reference repository.

## Pipeline test files (not project artwork)

These are original test images made for this project in Phase 5A to validate the pipeline. Each is visibly labelled "PIPELINE TEST" and includes proportion markers. They are used only when the site is built with `NEXT_PUBLIC_TAROT_ARTWORK_TEST=1`. A normal build uses the five illustrations above.

| File | Size | Layout tested | Source |
| --- | --- | --- | --- |
| `public/images/tarot/pipeline-test/full-card-test.webp` | 600×900 | `full-card` (has its own border and text) | Original; SVG source in `docs/tarot-pipeline-test-src/full-card-test.svg`, rasterized with headless Chrome |
| `public/images/tarot/pipeline-test/panel-test.webp` | 800×500 | `panel` (wide image fitted inside the frame) | Original; SVG source in `docs/tarot-pipeline-test-src/panel-test.svg` |
| `public/images/tarot/pipeline-test/missing-on-purpose.webp` | — | Missing-file fallback | Deliberately absent |

## Adding or changing an illustration

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
