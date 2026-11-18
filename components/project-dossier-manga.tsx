import type { CardMotif } from "@/data/projects";
import { FOCUS_LINES, HATCH, MOTIF_INK, SHARED, type InkLayer } from "./project-dossier-manga-presets";
import styles from "./project-dossier-manga.module.css";

/*
 * Manga-ink atmosphere behind one dossier chapter: a charcoal-violet ink plume entering from the
 * folio's outer right edge, a few hand-ruled focus lines, graduated halftone, and an abstract echo of
 * the project's tarot motif. Purely decorative and stateless: the chapter's `active` flag (already
 * tracked by ProjectDetails) only toggles a data attribute that CSS uses for a brief focus-line reveal.
 *
 * Original artwork and code; see docs/project-dossier-manga.md for the design system, motif map and
 * asset policy.
 */

export type DossierChapter = "problem" | "built" | "decision";

type ProjectDossierMangaProps = {
  motif: CardMotif;
  chapter: DossierChapter;
  active: boolean;
  className?: string;
};

function Ink({ layer }: { layer: InkLayer }) {
  return (
    <>
      {layer.bleed?.map((d) => <path key={d} className={styles.bleed} d={d} />)}
      {layer.fills.map((d) => <path key={d} className={styles.fill} d={d} />)}
      {layer.brush.map((d) => <path key={d} className={styles.brush} d={d} />)}
      {layer.lines.map((d) => <path key={d} className={styles.line} d={d} />)}
      {layer.dashed?.map((d) => <path key={d} className={styles.dash} d={d} />)}
      {layer.dots?.map(([cx, cy, r]) => <circle key={`${cx}-${cy}`} className={styles.dot} cx={cx} cy={cy} r={r} />)}
    </>
  );
}

export function ProjectDossierManga({ motif, chapter, active, className }: ProjectDossierMangaProps) {
  return (
    <div
      className={className ? `${styles.root} ${className}` : styles.root}
      aria-hidden="true"
      data-dossier-manga=""
      data-motif={motif}
      data-ink-chapter={chapter}
      data-active={active ? "true" : "false"}
    >
      <div className={styles.art}>
        <span className={styles.glow} />
        <span className={styles.halftone} />
        <svg className={styles.plume} viewBox="0 0 600 500" preserveAspectRatio="xMaxYMax meet" focusable="false">
          <Ink layer={SHARED} />
          <Ink layer={MOTIF_INK[motif]} />
        </svg>
        <svg className={styles.scratches} viewBox="0 0 600 500" preserveAspectRatio="xMaxYMax meet" focusable="false">
          {FOCUS_LINES.map(({ d, w }) => <path key={d} className={styles.focus} d={d} strokeWidth={w} pathLength={1} />)}
          <path className={styles.hatch} d={HATCH} />
        </svg>
      </div>
    </div>
  );
}
