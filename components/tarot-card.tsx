"use client";

import Image from "next/image";
import { useState } from "react";
import type { CardMotif, Project } from "@/data/projects";
import { cardMotifs } from "./card-motifs";
import styles from "./tarot-card.module.css";

function CardSymbol({ motif }: { motif: CardMotif }) {
  const shape = cardMotifs[motif];

  return (
    <svg aria-hidden="true" className={styles.symbol} viewBox="0 0 128 128" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      {shape.paths.map((d) => <path key={d} d={d} />)}
      {shape.circles?.map(({ cx, cy, r }) => <circle key={`${cx}-${cy}-${r}`} cx={cx} cy={cy} r={r} />)}
      {shape.ellipses?.map(({ cx, cy, rx, ry }) => <ellipse key={`${cx}-${cy}-${rx}-${ry}`} cx={cx} cy={cy} rx={rx} ry={ry} />)}
    </svg>
  );
}

const SIZES = "(max-width: 640px) 90vw, (max-width: 1280px) 45vw, 30vw";

/** `compact`: type and spacing scale with the card's own width (for small emblem placements). */
export function TarotCard({ project, compact = false }: { project: Project; compact?: boolean }) {
  // A missing or broken illustration falls back to the original geometric card.
  const [artworkFailed, setArtworkFailed] = useState(false);
  const artwork = artworkFailed ? undefined : project.cardArtwork;
  const label = `${project.tarotIdentity}: ${project.title}`;

  if (artwork?.layout === "full-card") {
    // The illustration carries its own border, numeral and name; only screen-reader text is added.
    return (
      <article className={`${styles.card} ${styles.fullArt}`} style={{ aspectRatio: `${artwork.width} / ${artwork.height}` }} aria-label={label} data-artwork="full-card" data-compact={compact || undefined}>
        <Image
          src={artwork.src}
          alt={artwork.alt}
          width={artwork.width}
          height={artwork.height}
          unoptimized
          loading="eager"
          sizes={SIZES}
          className={styles.fullArtImage}
          onError={() => setArtworkFailed(true)}
        />
        <div className="sr-only">
          <p>{project.tarotIdentity}</p>
          <h2>{project.title}</h2>
          {project.status === "in-development" && <p>In development</p>}
        </div>
      </article>
    );
  }

  return (
    <article className={styles.card} aria-label={label} data-artwork={artwork ? "panel" : "geometric"} data-compact={compact || undefined}>
      <div className={styles.inner}>
        <div className={styles.number} aria-label={`Card number ${project.romanNumeral}`}>
          {project.romanNumeral}
        </div>
        <div className={styles.artwork}>
          {artwork ? (
            <Image
              src={artwork.src}
              alt={artwork.alt}
              fill
              unoptimized
              loading="eager"
              sizes={SIZES}
              className={styles.artworkImage}
              onError={() => setArtworkFailed(true)}
            />
          ) : (
            <CardSymbol motif={project.motif} />
          )}
        </div>
        <div className={styles.caption}>
          <p className={styles.identity}>{project.tarotIdentity}</p>
          <h2 className={styles.title}>{project.title}</h2>
          {project.status === "in-development" && (
            <p className={styles.status}>In development</p>
          )}
        </div>
      </div>
    </article>
  );
}
