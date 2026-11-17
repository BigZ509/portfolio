"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Project, ProjectMp4Video, ProjectYouTubeVideo } from "@/data/projects";
import { mediaKey, useProjectMedia, type MediaItem } from "./project-media";
import styles from "./project-media-gallery.module.css";

const ratioStyle = (item: MediaItem) => ({ "--media-ratio": `${item.width / item.height}` }) as CSSProperties;

const youtubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
// Without a local poster, YouTube's own thumbnail (4:3 with letterboxing; cropped to 16:9 by CSS).
const youtubePoster = (item: ProjectYouTubeVideo) =>
  item.poster?.src ?? `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`;

/** Thumbnail / back-layer still for any item, or null when a video has no poster. */
function stillFor(item: MediaItem): string | null {
  if (item.kind === "image") return item.src;
  if (item.kind === "youtube") return youtubePoster(item);
  return item.poster?.src ?? null;
}

function VideoPlayer({ item, onPlayingChange }: { item: ProjectMp4Video; onPlayingChange: (playing: boolean) => void }) {
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
          <PlayIcon />
        </button>
      )}
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M8 5.5v13l10.5-6.5Z" />
    </svg>
  );
}

/**
 * The real YouTube player. Mounted only after the visitor asks to play, so opening a project never
 * contacts YouTube or autoplays; unmounting it (switching media, changing project, closing the
 * showcase) stops playback.
 */
function YouTubeEmbed({ item }: { item: ProjectYouTubeVideo }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    // The Play control that had focus is gone; keep keyboard focus with the video.
    frameRef.current?.focus({ preventScroll: true });
    const timer = window.setTimeout(() => setSlow(true), 15000);
    return () => window.clearTimeout(timer);
  }, []);

  const params = new URLSearchParams({ autoplay: "1", rel: "0", playsinline: "1" });

  return (
    <>
      <iframe
        ref={frameRef}
        className={styles.embed}
        data-loaded={loaded ? "true" : undefined}
        src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?${params}`}
        title={`${item.title} (YouTube video player)`}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => setLoaded(true)}
      />
      {!loaded && (
        <p className={styles.embedStatus} role="status">
          {slow ? "The player is taking a while to load. Use “Watch on YouTube” below instead." : "Loading video…"}
        </p>
      )}
    </>
  );
}

function YouTubePlayer({ item, started, onPlay }: { item: ProjectYouTubeVideo; started: boolean; onPlay: () => void }) {
  return (
    <div className={styles.videoWrap} data-kind="youtube">
      {/* The poster stays underneath while the embed loads, so the frame is never blank. */}
      <Image
        src={youtubePoster(item)}
        alt={started ? "" : (item.poster?.alt ?? `${item.title} thumbnail`)}
        width={1280}
        height={720}
        unoptimized
        className={styles.poster}
      />
      {started ? (
        <YouTubeEmbed item={item} />
      ) : (
        <button type="button" className={styles.watchButton} aria-label={`Watch Demo: play ${item.title}`} onClick={onPlay}>
          <span className={styles.watchIcon}><PlayIcon /></span>
          <span className={styles.watchText}>Watch Demo</span>
        </button>
      )}
    </div>
  );
}

export function ProjectMediaGallery({ project }: { project: Project }) {
  const { media, activeIndex, started, select, play } = useProjectMedia(project);
  const [playing, setPlaying] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const active = media[activeIndex];
  const count = media.length;
  const next = count > 1 ? media[(activeIndex + 1) % count] : undefined;
  const go = (index: number) => {
    setInteracted(true);
    select(index);
  };
  const label = (item: MediaItem, index: number) =>
    item.kind === "image"
      ? `Screenshot ${index + 1} of ${count}: ${item.caption}`
      : `${item.kind === "youtube" ? "Watch Demo: video" : "Video"} ${index + 1} of ${count}: ${item.title}`;

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

  const nextStill = next ? stillFor(next) : null;
  // Hold the composition still whenever a video is on screen: a drifting play control is harder to
  // hit, and a playing video should never move.
  const still = playing || started || active.kind !== "image";

  return (
    <section className={styles.gallery} aria-label={`${project.title} media`} data-playing={still ? "true" : undefined}>
      <div className={styles.scene}>
        {next && (
          // Depth layer: the next item floats behind the active frame (decorative; use the controls to switch).
          <div className={styles.backFrame} style={ratioStyle(next)} data-kind={next.kind} aria-hidden="true">
            {nextStill ? (
              <Image src={nextStill} alt="" width={next.width} height={next.height} unoptimized className={styles.media} />
            ) : (
              <span className={styles.backGlyph}>▶</span>
            )}
          </div>
        )}
        <figure className={styles.figure} style={ratioStyle(active)} data-kind={active.kind}>
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
              ) : active.kind === "youtube" ? (
                <YouTubePlayer key={active.youtubeId} item={active} started={started} onPlay={play} />
              ) : (
                <VideoPlayer key={active.src} item={active} onPlayingChange={setPlaying} />
              )}
            </div>
          </div>
          <figcaption className={styles.caption}>
            <span className={styles.captionText}>{active.caption}</span>
            {count > 1 && <span className={styles.counter}>{activeIndex + 1} / {count}</span>}
            {active.kind === "youtube" && (
              // Always available: the fallback if the embed is blocked, or for a larger player.
              <a className={styles.watchLink} href={youtubeWatchUrl(active.youtubeId)} target="_blank" rel="noopener noreferrer">
                Watch on YouTube<span aria-hidden="true"> ↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
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
              const thumbSrc = stillFor(item);
              return (
                <li key={mediaKey(item)}>
                  <button
                    type="button"
                    className={styles.thumb}
                    aria-label={label(item, index)}
                    aria-current={index === activeIndex ? "true" : undefined}
                    data-kind={item.kind}
                    onClick={() => go(index)}
                  >
                    {thumbSrc ? (
                      <Image src={thumbSrc} alt="" width={item.width} height={item.height} unoptimized className={styles.thumbImage} />
                    ) : null}
                    {item.kind === "youtube" ? (
                      <span className={styles.thumbLabel} aria-hidden="true">▶ Watch Demo</span>
                    ) : item.kind === "mp4" ? (
                      <span className={styles.thumbBadge} aria-hidden="true">▶</span>
                    ) : null}
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
