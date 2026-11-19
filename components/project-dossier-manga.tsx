import Image from "next/image";
import type { CardMotif } from "@/data/projects";
import { DOSSIER_MANGA_PRESETS } from "./project-dossier-manga-presets";
import styles from "./project-dossier-manga.module.css";

/*
 * The dossier's illustrated manga backdrop: two screentoned manga panels, one bleeding off the
 * top-right corner of the dossier (the project's tarot figure) and one off the bottom-right corner (a
 * detail from the same card), split by a slanted gilt gutter, with focus lines around the figure and a
 * gradient that keeps the reading column dark.
 *
 * One system for all five projects: geometry, palette, gradients, scale, motion and responsive rules
 * are shared here and in the CSS module; DOSSIER_MANGA_PRESETS only picks the plates and their focal
 * points. The stage is a sticky, viewport-tall layer inside the dossier's scroll, so the artwork stays
 * framed in the visible panel while the chapters scroll over it.
 *
 * Purely decorative: aria-hidden, no pointer events, no focusable content, no state or effects.
 * See docs/project-dossier-manga.md.
 */

export type DossierChapter = "problem" | "built" | "decision";

type ProjectDossierMangaProps = {
  motif: CardMotif;
  /** The chapter currently being read; the plates pan gently with it. */
  chapter: DossierChapter;
  className?: string;
};

const round = (value: number) => Math.round(value * 100) / 100;

/**
 * Focus lines (shūchūsen) as thin filled wedges converging on [cx, cy], in the upper panel's
 * 0-100 box. Uneven angles, starts and widths are deliberate and deterministic.
 */
function focusLines(cx: number, cy: number): string {
  const wedges: string[] = [];
  for (let i = 0; i < 44; i++) {
    const deg = i * (360 / 44) + ((i * 37) % 9) - 4;
    const rad = (deg * Math.PI) / 180;
    const r0 = 30 + ((i * 53) % 17);
    const r1 = 150;
    const half = 0.35 + ((i * 29) % 5) * 0.16; // half-width at the outer end, in degrees
    const [ax, ay] = [cx + r0 * Math.cos(rad), cy + r0 * Math.sin(rad)];
    const b = ((deg - half) * Math.PI) / 180;
    const c = ((deg + half) * Math.PI) / 180;
    wedges.push(
      `M${round(ax)} ${round(ay)}L${round(cx + r1 * Math.cos(b))} ${round(cy + r1 * Math.sin(b))}L${round(cx + r1 * Math.cos(c))} ${round(cy + r1 * Math.sin(c))}Z`,
    );
  }
  return wedges.join("");
}

/*
 * Panel outlines in each panel's own 0-100 box. They must match the clip-path polygons in the CSS
 * module (.upper .cut and .lower .cut). Only the inner edges are drawn: the outer edges bleed off the
 * dossier.
 */
const UPPER_EDGE = "M18 0L0 100L100 84";
const LOWER_EDGE = "M10 100L0 18L100 0";

export function ProjectDossierManga({ motif, chapter, className }: ProjectDossierMangaProps) {
  const preset = DOSSIER_MANGA_PRESETS[motif];
  const [fx, fy] = preset.focusPoint;
  return (
    <div
      className={className ? `${styles.root} ${className}` : styles.root}
      aria-hidden="true"
      data-dossier-manga=""
      data-motif={motif}
      data-ink-chapter={chapter}
    >
      <div className={styles.stage}>
        <div className={`${styles.panel} ${styles.upper}`}>
          <div className={styles.cut}>
            <div className={styles.pan}>
              <Image src={preset.upper.src} alt="" fill unoptimized loading="eager" sizes="40vw" className={styles.plate} style={{ objectPosition: preset.upper.focus }} />
            </div>
            <svg className={styles.focus} viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
              <path d={focusLines(fx, fy)} />
            </svg>
            <span className={styles.shade} />
          </div>
          <svg className={styles.edge} viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
            <path className={styles.gutter} d={UPPER_EDGE} />
            <path className={styles.gilt} d={UPPER_EDGE} pathLength={1} />
          </svg>
        </div>

        <div className={`${styles.panel} ${styles.lower}`}>
          <div className={styles.cut}>
            <div className={styles.pan}>
              <Image src={preset.lower.src} alt="" fill unoptimized loading="eager" sizes="40vw" className={styles.plate} style={{ objectPosition: preset.lower.focus }} />
            </div>
            <span className={styles.shade} />
          </div>
          <svg className={styles.edge} viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
            <path className={styles.gutter} d={LOWER_EDGE} />
            <path className={styles.gilt} d={LOWER_EDGE} pathLength={1} />
          </svg>
        </div>

        <span className={styles.scrim} />
      </div>
    </div>
  );
}
