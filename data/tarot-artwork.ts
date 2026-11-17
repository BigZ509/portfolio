import type { CardArtwork, Project } from "./projects";

/**
 * Final, authorized tarot illustrations, keyed by project slug.
 *
 * The owner confirmed authorization for the exact five illustrations recorded in
 * docs/tarot-artwork-manifest.md. Their original borders, numerals, and titles are included.
 *
 * Cards without an entry (or whose file fails to load) use the original geometric design.
 */
const authorizedArtwork: Partial<Record<string, CardArtwork>> = {
  "speaklab-ai": {
    src: "/images/tarot/speaklab-ai.webp",
    alt: "The Fool: a dark-haired figure tips a top hat before a warm golden city, inside the illustrated tarot frame.",
    width: 751,
    height: 1051,
    layout: "full-card",
  },
  "autonomous-delivery-rover": {
    src: "/images/tarot/autonomous-delivery-rover.webp",
    alt: "The World: a reclining blond figure surrounded by colorful mushrooms within an ornate green tarot frame.",
    width: 751,
    height: 1051,
    layout: "full-card",
  },
  "guiding-hands": {
    src: "/images/tarot/guiding-hands.webp",
    alt: "The Magician: a figure in a broad hat reaches forward amid birds and sweeping ribbons in a rose-colored frame.",
    width: 751,
    height: 1051,
    layout: "full-card",
  },
  "road-report": {
    src: "/images/tarot/road-report.webp",
    alt: "Justice: a woman holds a staff beside a dog beneath a blue sky, within a green illustrated tarot frame.",
    width: 751,
    height: 1051,
    layout: "full-card",
  },
  zbxp: {
    src: "/images/tarot/zbxp.webp",
    alt: "The Star: a dark-haired figure writes at a typewriter while pages and golden stars float through a blue frame.",
    width: 751,
    height: 1051,
    layout: "full-card",
  },
};

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
