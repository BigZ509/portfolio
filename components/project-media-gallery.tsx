"use client";

import Image from "next/image";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
} from "react";
import type { Project, ProjectMp4Video, ProjectYouTubeVideo } from "@/data/projects";
import { mediaKey, useProjectMedia, type MediaItem } from "./project-media";
import styles from "./project-media-gallery.module.css";

const ratioStyle = (item: MediaItem) => ({ "--media-ratio": `${item.width / item.height}` }) as CSSProperties;

const youtubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
// Without a local poster, YouTube's own thumbnail (4:3 with letterboxing; cropped to 16:9 by CSS).
const youtubePoster = (item: ProjectYouTubeVideo) =>
  item.poster?.src ?? `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`;

/**
 * Local files go through Next's image optimizer (resized, modern formats, per `sizes`), so opening
 * a project never pulls every full-resolution photo. Remote stills (YouTube) are used as-is.
 */
const optimizable = (src: string) => src.startsWith("/") && !src.startsWith("//");

const orientation = (item: MediaItem) => (item.height > item.width ? "portrait" : "landscape");

type ImageItem = Extract<MediaItem, { kind: "image" }>;
const isImage = (item: MediaItem | undefined): item is ImageItem => item?.kind === "image";

/** One `sizes` for the shown screenshot and its preloads, so both resolve to the same file. */
const GALLERY_SIZES = "(max-width: 700px) 94vw, 50vw";
/** Matches the crossfade in project-media-gallery.module.css (.imageLayer). */
const CROSSFADE_MS = 220;

/**
 * The active screenshot. Switching used to remount a fresh <img>, so the dark frame showed through
 * until the next file arrived (a black flash on a phone network). Now the outgoing screenshot stays
 * painted underneath until the incoming one has loaded and decoded, then the new one fades in over
 * it. A failed load is still shown (as its alt text) rather than hidden behind the old image.
 */
function GalleryImage({ item }: { item: ImageItem }) {
  const [layers, setLayers] = useState<{ item: ImageItem; ready: boolean }[]>(() => [{ item, ready: true }]);
  const top = layers[layers.length - 1];
  if (top.item.src !== item.src) {
    // Derived during render (React's documented pattern for state that follows a prop): keep only the
    // last painted screenshot and the requested one; anything skipped past while loading is dropped.
    const painted = layers.filter((layer) => layer.ready).at(-1);
    setLayers(painted?.item.src === item.src ? [painted] : painted ? [painted, { item, ready: false }] : [{ item, ready: false }]);
  }

  // Once the newest layer is painted and its fade has run, release the ones beneath it.
  useEffect(() => {
    if (layers.length < 2 || !layers[layers.length - 1].ready) return;
    const timer = window.setTimeout(() => setLayers((current) => current.slice(-1)), CROSSFADE_MS + 40);
    return () => window.clearTimeout(timer);
  }, [layers]);

  const markReady = (src: string) =>
    setLayers((current) => current.map((layer) => (layer.item.src === src && !layer.ready ? { ...layer, ready: true } : layer)));

  return (
    // data-loading drives a thin shimmer while the requested screenshot is still on its way, so the
    // previous one is never mistaken for it.
    <span className={styles.imageStack} data-loading={top.ready ? undefined : "true"}>
      {layers.map((layer, index) => {
        const current = index === layers.length - 1;
        return (
          <Image
            key={layer.item.src}
            src={layer.item.src}
            // The outgoing screenshot is only a visual bridge; the incoming one carries the description.
            alt={current ? layer.item.alt : ""}
            aria-hidden={current ? undefined : true}
            width={layer.item.width}
            height={layer.item.height}
            unoptimized={!optimizable(layer.item.src)}
            loading="eager"
            fetchPriority={current ? "high" : "auto"}
            sizes={GALLERY_SIZES}
            className={`${styles.media} ${styles.imageLayer}`}
            data-state={layer.ready ? "shown" : "loading"}
            onLoad={(event) => {
              const image = event.currentTarget;
              // decode() resolves once the pixels can be painted without a blank first frame.
              void image.decode().catch(() => undefined).then(() => markReady(layer.item.src));
            }}
            onError={() => markReady(layer.item.src)}
          />
        );
      })}
    </span>
  );
}

/**
 * Full-size screenshot viewer, a nested modal <dialog>: Fit shows the whole screenshot; Actual size
 * (or a tap on the image) shows it pixel for pixel, panned by scrolling, so dense interface text is
 * readable on a phone. Escape, Close or a tap outside the image returns to the gallery with focus
 * restored. Native pinch-zoom also works.
 */
function ScreenshotViewer({ item, openerRef, onClose }: { item: ImageItem; openerRef: RefObject<HTMLElement | null>; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [zoomed, setZoomed] = useState(false);
  // Fraction of the image the visitor tapped, kept under their finger after zooming in.
  const focusPoint = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // Return focus to the screenshot that opened the viewer. It is passed in rather than read from
    // document.activeElement, because Safari does not focus a button when it is clicked or tapped.
    const returnTo = openerRef.current ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus();
    return () => {
      if (dialog.open) dialog.close();
      if (returnTo?.isConnected) returnTo.focus({ preventScroll: true });
    };
  }, [openerRef]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { x, y } = focusPoint.current;
    canvas.scrollTo({
      left: zoomed ? x * canvas.scrollWidth - canvas.clientWidth / 2 : 0,
      top: zoomed ? y * canvas.scrollHeight - canvas.clientHeight / 2 : 0,
    });
  }, [zoomed]);

  const onImageClick = (event: ReactMouseEvent<HTMLImageElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    focusPoint.current = {
      x: Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width)),
      y: Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height)),
    };
    setZoomed((value) => !value);
  };

  // Everything here stays inside the viewer: the outer showcase dialog has its own Tab loop and its
  // own cancel/close handlers, which React would otherwise also run as these events bubble.
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDialogElement>) => {
    event.stopPropagation();
    if (event.key !== "Tab") return;
    const focusable = [...event.currentTarget.querySelectorAll<HTMLElement>("button, [tabindex='0']")];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.viewer}
      aria-label={`Full-size screenshot: ${item.caption}`}
      onCancel={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }}
      onClose={(event) => {
        event.stopPropagation();
        onClose();
      }}
      onKeyDown={onKeyDown}
    >
      <div className={styles.viewerBar}>
        <p className={styles.viewerCaption}>{item.caption}</p>
        <button type="button" className={styles.viewerButton} aria-pressed={zoomed} onClick={() => {
          focusPoint.current = { x: 0.5, y: 0.5 };
          setZoomed((value) => !value);
        }}>
          {zoomed ? "Fit" : "Actual size"}
        </button>
        <button ref={closeRef} type="button" className={`${styles.viewerButton} ${styles.viewerClose}`} onClick={onClose} aria-label="Close full-size view">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </div>
      <div
        ref={canvasRef}
        className={styles.viewerCanvas}
        data-zoomed={zoomed ? "true" : undefined}
        // Keyboard users scroll the zoomed screenshot with the arrow keys.
        tabIndex={zoomed ? 0 : -1}
        onClick={(event) => {
          if (event.target === event.currentTarget && !zoomed) onClose();
        }}
      >
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          // The original file: these are small (20-130 KB) and the sharpest source for reading text.
          unoptimized
          loading="eager"
          className={styles.viewerImage}
          style={zoomed ? { width: item.width, height: item.height } : undefined}
          onClick={onImageClick}
        />
      </div>
    </dialog>
  );
}

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
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setSlow(true), 15000);
    return () => window.clearTimeout(timer);
  }, []);

  const params = new URLSearchParams({ autoplay: "1", rel: "0", playsinline: "1" });

  return (
    <>
      <iframe
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

type YouTubeItem = Extract<MediaItem, { kind: "youtube" }>;

function YouTubePlayer({ item, started, onPlay }: { item: YouTubeItem; started: boolean; onPlay: () => void }) {
  const poster = youtubePoster(item);
  const wrapRef = useRef<HTMLDivElement>(null);
  return (
    // Focus target once Play is pressed (the button unmounts). It stays in this document rather
    // than inside the cross-origin iframe, so Escape still closes the dialog; Tab enters the player.
    <div ref={wrapRef} className={styles.videoWrap} data-kind="youtube" tabIndex={-1} aria-label={`${item.title} video`} role="group">
      {/* The poster stays underneath while the embed loads, so the frame is never blank. */}
      <Image
        src={poster}
        alt={started ? "" : (item.poster?.alt ?? `${item.title} thumbnail`)}
        width={item.width}
        height={item.height}
        unoptimized={!optimizable(poster)}
        priority
        sizes={GALLERY_SIZES}
        className={styles.poster}
      />
      {started ? (
        <YouTubeEmbed item={item} />
      ) : (
        <button type="button" className={styles.watchButton} aria-label={`Watch Demo: play ${item.title}`} onClick={() => {
          onPlay();
          wrapRef.current?.focus({ preventScroll: true });
        }}>
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
  const [viewing, setViewing] = useState<ImageItem | null>(null);
  const zoomTriggerRef = useRef<HTMLButtonElement>(null);
  const thumbsRef = useRef<HTMLUListElement>(null);

  // Keep the active thumbnail visible when the strip scrolls. Only the strip's own scrollLeft moves;
  // the dialog and page never scroll.
  useEffect(() => {
    const list = thumbsRef.current;
    const current = list?.querySelector<HTMLElement>("[aria-current='true']")?.parentElement;
    if (!list || !current || list.scrollWidth <= list.clientWidth) return;
    const left = current.offsetLeft - (list.clientWidth - current.offsetWidth) / 2;
    list.scrollTo({ left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [activeIndex]);
  const active = media[activeIndex];
  const count = media.length;
  const next = count > 1 ? media[(activeIndex + 1) % count] : undefined;
  const previous = count > 2 ? media[(activeIndex - 1 + count) % count] : undefined;
  // Fetched ahead at the gallery's own size: the screenshots either side of the current one, and every
  // video poster (one or two per project), so switching to them never shows an empty frame.
  const preloads = [
    ...[next, previous].filter(isImage).map((item) => ({ src: item.src, width: item.width, height: item.height })),
    ...media.flatMap((item, index) => {
      const still = item.kind === "image" || index === activeIndex ? null : stillFor(item);
      return still ? [{ src: still, width: item.width, height: item.height }] : [];
    }),
  ].filter((item, index, list) => list.findIndex((other) => other.src === item.src) === index);
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
              <Image src={nextStill} alt="" width={next.width} height={next.height} unoptimized={!optimizable(nextStill)} sizes="(max-width: 700px) 50vw, 30vw" className={styles.media} />
            ) : (
              <span className={styles.backGlyph}>▶</span>
            )}
          </div>
        )}
        <figure className={styles.figure} style={ratioStyle(active)} data-kind={active.kind} data-orientation={orientation(active)}>
          <div className={styles.float}>
            <div className={styles.frame} data-kind={active.kind}>
              {active.kind === "image" ? (
                <button ref={zoomTriggerRef} type="button" className={styles.zoomTrigger} aria-haspopup="dialog" onClick={() => setViewing(active)}>
                  <GalleryImage item={active} />
                  <span className={styles.zoomHint} aria-hidden="true">
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" /></svg>
                    Enlarge
                  </span>
                  <span className="sr-only">, view full size</span>
                </button>
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
          <ul ref={thumbsRef} className={styles.thumbs}>
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
                      <Image src={thumbSrc} alt="" width={item.width} height={item.height} unoptimized={!optimizable(thumbSrc)} sizes="112px" className={styles.thumbImage} />
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
      {preloads.length > 0 && (
        <div className={styles.preload} aria-hidden="true">
          {preloads.map((item) => (
            <Image
              key={item.src}
              src={item.src}
              alt=""
              width={item.width}
              height={item.height}
              unoptimized={!optimizable(item.src)}
              loading="eager"
              fetchPriority="low"
              sizes={GALLERY_SIZES}
            />
          ))}
        </div>
      )}
      {viewing && <ScreenshotViewer item={viewing} openerRef={zoomTriggerRef} onClose={() => setViewing(null)} />}
    </section>
  );
}
