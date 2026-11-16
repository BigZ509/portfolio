/*
 * Original artwork for MARC'S WORLD. Takes the place of upstream's `SharinganEye` watermark.
 *
 * Upstream (rishabhaiml/Portfolio, src/lib/components/SharinganEye.svelte) draws Mangekyō Sharingan
 * variants belonging to specific Naruto characters. Those are Masashi Kishimoto / Shueisha designs:
 * the repository's MIT grant covers Rishabh's code, not the franchise imagery it depicts, so they are
 * not reproduced. See docs/marcs-world-phase-6-audit.md §2.
 *
 * This sigil fills the same slot at the same size, and the card CSS gives it upstream's exact
 * watermark treatment (opacity, rotation, hover scale). Like the upstream eye, it idles with a slow
 * rotation. The inner glyphs are the classical alchemical element symbols — Fire △, Water ▽,
 * Earth ▽ with a bar — which are centuries-old public-domain signs and suit the site's occult
 * Lord-of-Mysteries register. Lightning, which has no classical alchemical sign, gets a bolt.
 */

import styles from "./chakra-skills.module.css";

export type Element = "lightning" | "fire" | "earth" | "water";

const TICKS = Array.from({ length: 24 }, (_, index) => {
  const angle = (index * Math.PI) / 12;
  const inner = index % 6 === 0 ? 70 : 77;
  const x1 = 100 + Math.cos(angle) * inner;
  const y1 = 100 + Math.sin(angle) * inner;
  const x2 = 100 + Math.cos(angle) * 85;
  const y2 = 100 + Math.sin(angle) * 85;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
}).join("");

/** Equilateral triangle centred on (100, 100), pointing up or down. */
function triangle(pointsUp: boolean, radius = 38) {
  const sign = pointsUp ? -1 : 1;
  const apex = `100 ${100 + sign * radius}`;
  const half = radius * Math.sin(Math.PI / 3);
  const baseY = 100 - sign * radius * 0.5;
  return `M${apex}L${100 + half} ${baseY}L${100 - half} ${baseY}Z`;
}

const GLYPHS: Record<Element, string> = {
  fire: triangle(true),
  water: triangle(false),
  // Earth: the water triangle crossed by a bar a third of the way down.
  earth: `${triangle(false)}M${100 - 26} ${100 - 6}H${100 + 26}`,
  lightning: "M108 54L84 104H104L92 146L122 90H100L114 54Z",
};

export function ElementSigil({ element, size = 120 }: { element: Element; size?: number }) {
  return (
    <svg
      className={styles.sigil}
      viewBox="0 0 200 200"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="100" cy="100" r="94" strokeWidth="6" />
      <circle cx="100" cy="100" r="62" fill="currentColor" fillOpacity=".18" strokeWidth="4" />
      <g className={styles.sigilTicks}>
        <path d={TICKS} strokeWidth="4" />
        <circle cx="100" cy="6" r="6" fill="currentColor" stroke="none" />
      </g>
      <path d={GLYPHS[element]} strokeWidth="7" fill={element === "lightning" ? "currentColor" : "none"} />
    </svg>
  );
}
