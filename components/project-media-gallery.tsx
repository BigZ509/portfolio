"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Project, ProjectScreenshot, ProjectVideo } from "@/data/projects";
import styles from "./project-media-gallery.module.css";

type MediaItem =
  | ({ kind: "image" } & ProjectScreenshot)
  | ({ kind: "video" } & ProjectVideo);

export function projectMedia(project: Project): MediaItem[] {
  return [
    ...(project.screenshots ?? []).map((item) => ({ kind: "image" as const, ...item })),
    ...(project.videos ?? []).map((item) => ({ kind: "video" as const, ...item })),
  ];
}

const ratioStyle = (item: MediaItem) => ({ "--media-ratio": `${item.width / item.height}` }) as CSSProperties;

function VideoPlayer({ item, onPlayingChange }: { item: Extract<MediaItem, { kind: "video" }>; onPlayingChange: (playing: boolean) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);

  // Pause when this item is switched away from, the project changes, or the showcase closes.
  useEffect(() => {
    const video = videoRef.current;
    return () => {
      video?.pause();
      onPlayingChange(false);
    };
  }, [onPlayingChange]);

  if (failed) {
    return (
      <div className={styles.mediaMessage} role="status">
        <p>This video could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className={styles.videoWrap}>
      <video
        ref={videoRef}
        className={styles.media}
        controls
        playsInline
        preload="metadata"
        poster={item.poster?.src}
        aria-label={item.title}
        onPlay={() => {
          setStarted(true);
          onPlayingChange(true);
        }}
        onPause={() => onPlayingChange(false)}
        onEnded={() => onPlayingChange(false)}
        onError={() => setFailed(true)}
      >
        <source src={item.src} type="video/mp4" onError={() => setFailed(true)} />
        {item.captionsSrc && <track kind="captions" src={item.captionsSrc} srcLang="en" label="English" default />}
      </video>
      {!started && (
        <button
          type="button"
          className={styles.playButton}
          aria-label={`Play video: ${item.title}`}
          onClick={() => {
            void videoRef.current?.play().catch(() => undefined);
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M8 5.5v13l10.5-6.5Z" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function ProjectMediaGallery({ project }: { project: Project }) {
  const media = projectMedia(project);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const active = media[activeIndex];
  const next = media.length > 1 ? media[(activeIndex + 1) % media.length] : undefined;
  const count = media.length;
  const go = (index: number) => {
    setInteracted(true);
    setActiveIndex(((index % count) + count) % count);
  };
  const label = (item: MediaItem, index: number) =>
    `${item.kind === "video" ? "Video" : "Screenshot"} ${index + 1} of ${count}: ${item.caption}`;

  if (!active) {
    return (
      <section className={styles.gallery} aria-label={`${project.title} media`}>
        <div className={styles.scene}>
          <div className={styles.empty}>
            <span className={styles.emptyMark} aria-hidden="true">✦</span>
            <p>No project screenshots supplied yet</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.gallery} aria-label={`${project.title} media`} data-playing={playing ? "true" : undefined}>
      <div className={styles.scene}>
        {next && (
          // Depth layer: the next item floats behind the active frame (decorative; use the controls to switch).
          <div className={styles.backFrame} style={ratioStyle(next)} aria-hidden="true">
            {next.kind === "image" ? (
              <Image src={next.src} alt="" width={next.width} height={next.height} unoptimized className={styles.media} />
            ) : next.poster ? (
              <Image src={next.poster.src} alt="" width={next.width} height={next.height} unoptimized className={styles.media} />
            ) : (
              <span className={styles.backGlyph}>▶</span>
            )}
          </div>
        )}
        <figure className={styles.figure} style={ratioStyle(active)}>
          <div className={styles.float}>
            <div className={styles.frame} data-kind={active.kind}>
              {active.kind === "image" ? (
                <Image
                  key={active.src}
                  src={active.src}
                  alt={active.alt}
                  width={active.width}
                  height={active.height}
                  unoptimized
                  priority
                  sizes="(max-width: 700px) 60vw, 40vw"
                  className={styles.media}
                />
              ) : (
                <VideoPlayer key={active.src} item={active} onPlayingChange={setPlaying} />
              )}
            </div>
          </div>
          <figcaption className={styles.caption}>
            <span className={styles.captionText}>{active.caption}</span>
            {count > 1 && <span className={styles.counter}>{activeIndex + 1} / {count}</span>}
          </figcaption>
        </figure>
      </div>

      {count > 1 && (
        <div className={styles.controls} role="group" aria-label="Project media">
          <button type="button" className={styles.arrow} aria-label="Previous media" onClick={() => go(activeIndex - 1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14.5 5.5 8 12l6.5 6.5" /></svg>
          </button>
          <ul className={styles.thumbs}>
            {media.map((item, index) => {
              const thumbSrc = item.kind === "image" ? item.src : item.poster?.src;
              return (
              <li key={item.src}>
                <button
                  type="button"
                  className={styles.thumb}
                  aria-label={label(item, index)}
                  aria-current={index === activeIndex ? "true" : undefined}
                  data-kind={item.kind}
                  onClick={() => go(index)}
                >
                  {thumbSrc ? (
                    <Image
                      src={thumbSrc}
                      alt=""
                      width={item.width}
                      height={item.height}
                      unoptimized
                      className={styles.thumbImage}
                    />
                  ) : null}
                  {item.kind === "video" && <span className={styles.thumbBadge} aria-hidden="true">▶</span>}
                </button>
              </li>
              );
            })}
          </ul>
          <button type="button" className={styles.arrow} aria-label="Next media" onClick={() => go(activeIndex + 1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9.5 5.5 16 12l-6.5 6.5" /></svg>
          </button>
        </div>
      )}
      <p className="sr-only" aria-live="polite" aria-atomic="true">{interacted ? label(active, activeIndex) : ""}</p>
    </section>
  );
}
