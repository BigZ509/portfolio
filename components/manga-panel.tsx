/*
 * Adapted from GarunJad/Anime-Portfolio @ a2700feea9e022a1f95b94d971e9956173265553
 * Source: https://github.com/GarunJad/Anime-Portfolio  (index.html, .manga-grid markup L330–386)
 * Author: GarunJad
 * Authorization: MIT (per README) + owner-held authorization, see docs/source-permissions.md
 *
 * Changes:
 * - Ported from static HTML to a React server component; classes come from a CSS Module.
 * - <img> replaced with next/image so the owner's photographs are optimized and sized.
 * - Upstream's Lucide CDN icon in .panel-link replaced with an inline arrow (no CDN scripts).
 * - `data-panel` / `data-panel-img` hooks added for the ported GSAP ScrollTrigger choreography.
 *
 * Preserved: the panel > (media > img, overlay, content > (numeral, label, title, desc, tech, link))
 * structure and its stacking order, which is what the upstream CSS and animations are written for.
 */

import Image from "next/image";
import Link from "next/link";
import styles from "./manga-panel.module.css";

export type MangaPanelProps = {
  span: "tall" | "large" | "narrow" | "wide";
  /** The oversized faint numeral in the corner, e.g. "01". */
  numeral?: string;
  label: string;
  title?: string;
  description?: string;
  caption?: string;
  technologies?: readonly string[];
  /** Small status pill, used only for genuinely in-progress work. */
  flag?: string;
  href?: string;
  linkLabel?: string;
  image: { src: string; alt: string; width: number; height: number };
  sizes?: string;
  priority?: boolean;
};

export function MangaPanel({
  span, numeral, label, title, description, caption, technologies, flag, href, linkLabel, image, sizes, priority,
}: MangaPanelProps) {
  return (
    <article className={`${styles.panel} ${styles[span]}`} data-panel="">
      <div className={styles.media}>
        <Image
          className={styles.image}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes ?? "(max-width: 700px) 92vw, (max-width: 1024px) 46vw, 32vw"}
          priority={priority}
          data-panel-img=""
        />
      </div>
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        {numeral && <span className={styles.numeral} aria-hidden="true">{numeral}</span>}
        {flag && <span className={styles.flag}>{flag}</span>}
        <span className={styles.label}>{label}</span>
        {title && <h3 className={styles.title}>{title}</h3>}
        {description && <p className={styles.description}>{description}</p>}
        {caption && <p className={styles.caption}>{caption}</p>}
        {technologies && technologies.length > 0 && (
          <ul className={styles.tech}>
            {technologies.map((tech) => <li key={tech}>{tech}</li>)}
          </ul>
        )}
        {href && (
          <Link className={styles.link} href={href}>
            {linkLabel ?? "See the project"}
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        )}
      </div>
    </article>
  );
}

export function MangaGrid({ children }: { children: React.ReactNode }) {
  return <div className={styles.mangaGrid}>{children}</div>;
}
