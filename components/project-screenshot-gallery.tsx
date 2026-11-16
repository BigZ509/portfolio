"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/data/projects";
import styles from "./project-screenshot-gallery.module.css";

export function ProjectScreenshotGallery({ project }: { project: Project }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const screenshots = project.screenshots ?? [];
  const activeScreenshot = screenshots[activeIndex];

  return (
    <section className={styles.gallery} aria-label={`${project.title} project screenshots`}>
      <div className={styles.stack} data-has-screenshots={screenshots.length > 0}>
        <div className={styles.backFrame} aria-hidden="true" />
        {activeScreenshot ? (
          <figure className={styles.frame}>
            <div className={styles.imageWindow}>
              <Image
                src={activeScreenshot.src}
                alt={activeScreenshot.alt}
                fill
                unoptimized
                sizes="(max-width: 700px) 68vw, 58vw"
                className={styles.screenshot}
              />
            </div>
          </figure>
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderMark} aria-hidden="true">✦</span>
            <p>No project screenshots supplied</p>
          </div>
        )}
      </div>
      {screenshots.length > 1 && (
        <div className={styles.controls} role="group" aria-label="Screenshot navigation">
          <button
            type="button"
            className={styles.control}
            aria-label="Previous screenshot"
            onClick={() => setActiveIndex((index) => (index - 1 + screenshots.length) % screenshots.length)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M14.5 5.5 8 12l6.5 6.5" />
            </svg>
          </button>
          <p aria-live="polite" aria-atomic="true">Screenshot {activeIndex + 1} of {screenshots.length}</p>
          <button
            type="button"
            className={styles.control}
            aria-label="Next screenshot"
            onClick={() => setActiveIndex((index) => (index + 1) % screenshots.length)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M9.5 5.5 16 12l-6.5 6.5" />
            </svg>
          </button>
        </div>
      )}
      {screenshots.length === 1 && <p className={styles.singleCaption}>Screenshot 1 of 1</p>}
    </section>
  );
}
