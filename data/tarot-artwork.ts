import type { CardArtwork, Project } from "./projects";

/**
 * Final, authorized tarot illustrations, keyed by project slug.
 *
 * EMPTY ON PURPOSE: no artwork files confirmed as authorized for use exist in this project yet.
 * When one is added, place it at `public/images/tarot/<slug>.webp`, record its source and
 * license in docs/tarot-artwork-manifest.md, and register it here, for example:
 *
 *   "speaklab-ai": {
 *     src: "/images/tarot/speaklab-ai.webp",
 *     alt: "Describe what the illustration shows, not just the card name",
 *     width: 1200,
 *     height: 1800,
 *     layout: "full-card",
 *   },
 *
 * Cards without an entry (or whose file fails to load) use the original geometric design.
 */
const authorizedArtwork: Partial<Record<string, CardArtwork>> = {};

/**
 * Pipeline validation only. Build with NEXT_PUBLIC_TAROT_ARTWORK_TEST=1 to attach original test
 * illustrations (clearly marked "PIPELINE TEST") plus one deliberately missing file. These are
 * not project artwork and must never be enabled for a production build.
 */
const pipelineTestArtwork: Partial<Record<string, CardArtwork>> =
  process.env.NEXT_PUBLIC_TAROT_ARTWORK_TEST === "1"
    ? {
        "speaklab-ai": {
          src: "/images/tarot/pipeline-test/full-card-test.webp",
          alt: "Pipeline test card: an abstract gold sun over layered violet hills, labelled as a test image",
          width: 600,
          height: 900,
          layout: "full-card",
        },
        "guiding-hands": {
          src: "/images/tarot/pipeline-test/panel-test.webp",
          alt: "Pipeline test panel: a wide abstract night horizon with a crescent moon, labelled as a test image",
          width: 800,
          height: 500,
          layout: "panel",
        },
        "autonomous-delivery-rover": {
          src: "/images/tarot/pipeline-test/missing-on-purpose.webp",
          alt: "Missing test file used to verify the geometric fallback",
          width: 600,
          height: 900,
          layout: "full-card",
        },
      }
    : {};

export function withCardArtwork(records: readonly Project[]): readonly Project[] {
  return records.map((record) => {
    const cardArtwork = pipelineTestArtwork[record.slug] ?? authorizedArtwork[record.slug];
    return cardArtwork ? { ...record, cardArtwork } : record;
  });
}
