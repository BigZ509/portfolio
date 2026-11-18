"use client";

/*
 * Image aperture choreography adapted from GSAP Vault's MIT Image Clip Reveal,
 * image-clip-reveal/assets/script.js @ 72bf2f26a306a711c1793222fa982f829099a58b.
 * Pinned timeline and responsive GSAP lifecycle adapted from its MIT Parallax Hero,
 * parallax-hero/assets/script.js at the same revision.
 * Full notices and transformations: docs/phase11-source-reuse.md.
 */

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalStory } from "@/data/personal-story";
import styles from "./personal-story.module.css";

// GSAP Vault's six-point aperture paths, preserved for stable clip interpolation.
const CLOSED_CLIPS = {
  up: "polygon(0% 100%, 42% 100%, 50% 94%, 58% 100%, 100% 100%, 0% 100%)",
  down: "polygon(0% 0%, 42% 0%, 50% 6%, 58% 0%, 100% 0%, 0% 0%)",
  left: "polygon(100% 0%, 100% 42%, 94% 50%, 100% 58%, 100% 100%, 100% 0%)",
  right: "polygon(0% 0%, 0% 42%, 6% 50%, 0% 58%, 0% 100%, 0% 0%)",
} as const;
const OPEN_CLIP = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%)";
const IMG_START_SCALE = 1.14;

// Story timeline beats. The night photo finishes opening at 1.67 and the coat 1.1
// after Style begins; HOLD keeps each finished scene up before the next one.
const HOLD = 0.5;
const FUN_EXIT = 1.67 + HOLD;
const STYLE_EXIT = FUN_EXIT + 0.25 + 1.1 + HOLD;
const STORY_END = STYLE_EXIT + 0.75 + 0.85;

// Port of GSAP Vault's addReveal(): the same clip and image easing live in a
// single scrubbed story timeline so reversing the scroll also reverses the reveal.
function addReveal(
  timeline: gsap.core.Timeline,
  wrapper: HTMLElement,
  direction: keyof typeof CLOSED_CLIPS,
  position: number,
  duration = 1.1,
) {
  const image = wrapper.querySelector("img, video");
  timeline.fromTo(
    wrapper,
    { clipPath: CLOSED_CLIPS[direction] },
    { clipPath: OPEN_CLIP, duration, ease: "expo.inOut" },
    position,
  );
  if (image) {
    timeline.fromTo(
      image,
      { scale: IMG_START_SCALE },
      { scale: 1, duration: duration + 0.18, ease: "power3.out" },
      position,
    );
  }
}

export function PersonalStory() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // A layout effect, as in GSAP's useGSAP(): its cleanup runs before React detaches the
  // DOM, so the pin is reverted (stage moved out of its .pin-spacer) while still connected.
  // Unpinning after detachment re-inserted the images into a detached tree, which left
  // Chrome's per-image viewport listeners holding the whole old About page in memory.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    gsap.registerPlugin(ScrollTrigger);
    const desktopQuery = window.matchMedia("(min-width: 901px) and (prefers-reduced-motion: no-preference)");
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let desktopActive = false;
    let mobileVisible = false;

    const syncPlayback = () => {
      const active = desktopQuery.matches ? desktopActive : mobileVisible;
      if (active && !reducedQuery.matches && document.visibilityState === "visible") {
        video.play().catch(() => {
          // The native controls remain available if the browser rejects autoplay.
        });
      } else {
        video.pause();
      }
    };

    // On narrow screens the chapter is in normal document flow. Its video plays
    // only while the Fun chapter is actually on screen.
    const fun = root.querySelector<HTMLElement>("[data-story-chapter='fun']");
    const observer = new IntersectionObserver(
      ([entry]) => {
        mobileVisible = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.4 },
    );
    if (fun) observer.observe(fun);

    // Buffer the boomerang while the visitor approaches the story, so Fun starts from data that is
    // already downloaded instead of opening the stream at the moment the chapter appears. Until
    // then only metadata is fetched, so readers who never scroll this far download nothing more.
    const approach = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        video.preload = "auto";
        approach.disconnect();
      },
      { rootMargin: "100% 0px" },
    );
    approach.observe(root);

    document.addEventListener("visibilitychange", syncPlayback);
    desktopQuery.addEventListener("change", syncPlayback);
    reducedQuery.addEventListener("change", syncPlayback);

    const context = gsap.context(() => {
      // Responsive, scoped setup/cleanup follows GSAP Vault's Parallax Hero.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = root.querySelector<HTMLElement>("[data-story-stage]");
        const question = root.querySelector<HTMLElement>("[data-story-question]");
        const funChapter = root.querySelector<HTMLElement>("[data-story-chapter='fun']");
        const styleChapter = root.querySelector<HTMLElement>("[data-story-chapter='style']");
        const adventureChapter = root.querySelector<HTMLElement>("[data-story-chapter='adventure']");
        const videoFrame = root.querySelector<HTMLElement>("[data-story-media='video']");
        const nightFrame = root.querySelector<HTMLElement>("[data-story-media='night']");
        const coatFrame = root.querySelector<HTMLElement>("[data-story-media='coat']");
        const portraitFrame = root.querySelector<HTMLElement>("[data-story-media='portrait']");
        const actionFrame = root.querySelector<HTMLElement>("[data-story-media='action']");
        if (!stage || !question || !funChapter || !styleChapter || !adventureChapter ||
            !videoFrame || !nightFrame || !coatFrame || !portraitFrame || !actionFrame) return;

        gsap.set([funChapter, styleChapter, adventureChapter], { autoAlpha: 0 });

        // Playback follows the rendered timeline, not raw scroll events: with scrub the
        // timeline keeps easing toward the scroll position after scrolling stops, so a jump
        // straight into Fun only reaches the Fun window during that catch-up.
        const updateDesktopPlayback = () => {
          const time = timeline.time();
          const next = Boolean(timeline.scrollTrigger?.isActive) && time >= 0.38 && time < FUN_EXIT;
          if (next !== desktopActive) {
            desktopActive = next;
            syncPlayback();
          }
        };

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          onUpdate: updateDesktopPlayback,
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            // Same scroll-per-beat pace as the original 4.9-beat/2.7vh runway, scaled for the holds.
            end: () => `+=${Math.round(Math.min(window.innerHeight * 3.4, 3000))}`,
            pin: true,
            scrub: 0.45,
            invalidateOnRefresh: true,
            onToggle: updateDesktopPlayback,
          },
        });

        timeline
          .to(question, { autoAlpha: 0, y: -55, duration: 0.45 }, 0.1)
          .to(funChapter, { autoAlpha: 1, duration: 0.35 }, 0.3);
        addReveal(timeline, videoFrame, "up", 0.35);
        addReveal(timeline, nightFrame, "right", 0.82, 0.85);

        // Each chapter's last reveal ends HOLD before the chapter leaves, so the fully
        // composed scene stays on screen for a real stretch of scroll.
        timeline
          .to(funChapter, { autoAlpha: 0, y: -45, duration: 0.3 }, FUN_EXIT)
          .to(styleChapter, { autoAlpha: 1, duration: 0.35 }, FUN_EXIT + 0.2);
        addReveal(timeline, coatFrame, "left", FUN_EXIT + 0.25);

        timeline
          .to(styleChapter, { autoAlpha: 0, y: -45, duration: 0.3 }, STYLE_EXIT)
          .to(adventureChapter, { autoAlpha: 1, duration: 0.35 }, STYLE_EXIT + 0.2);
        addReveal(timeline, portraitFrame, "up", STYLE_EXIT + 0.25);
        addReveal(timeline, actionFrame, "right", STYLE_EXIT + 0.75, 0.85);

        // Parallax Hero's data-layer speed model: a restrained depth offset
        // shares the same scrubbed timeline without adding a pointer listener.
        gsap.utils.toArray<HTMLElement>("[data-story-speed]", root).forEach((layer) => {
          const speed = Number.parseFloat(layer.dataset.storySpeed ?? "1");
          timeline.to(layer, { y: (1 - (Number.isFinite(speed) ? speed : 1)) * 56, duration: STORY_END }, 0);
        });

        // The ending image holds before the normal page resumes.
        timeline.to({}, { duration: HOLD }, STORY_END);
        timeline.progress(0);
        root.dataset.enhanced = "true";
        ScrollTrigger.refresh();

        return () => {
          desktopActive = false;
          syncPlayback();
          delete root.dataset.enhanced;
        };
      });

      // Phones and tablets keep normal scrolling (no pin), but each photograph still opens with
      // the same aperture reveal as it enters the viewport, and closes again on the way back up.
      mm.add("(max-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const directions: Record<string, keyof typeof CLOSED_CLIPS> = {
          video: "up",
          night: "right",
          coat: "left",
          portrait: "up",
          action: "right",
        };
        gsap.utils.toArray<HTMLElement>("[data-story-media]", root).forEach((frame) => {
          const reveal = gsap.timeline({
            scrollTrigger: { trigger: frame, start: "top 88%", toggleActions: "play none none reverse" },
          });
          addReveal(reveal, frame, directions[frame.dataset.storyMedia ?? ""] ?? "up", 0, 1);
        });
      });
    }, root);

    return () => {
      observer.disconnect();
      approach.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      desktopQuery.removeEventListener("change", syncPlayback);
      reducedQuery.removeEventListener("change", syncPlayback);
      video.pause();
      context.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className={styles.story} aria-labelledby="life-heading">
      <header className={styles.sectionHead}>
        <p className={styles.chapterTag}>Outside the Screen</p>
        <h2 id="life-heading">Away from the Keyboard</h2>
      </header>

      <div className={styles.stage} data-story-stage>
        <div className={styles.stageInner}>
          <div className={styles.question} data-story-question>
            <p>{personalStory.question}</p>
            <span>Keep scrolling.</span>
          </div>

          <div className={`${styles.chapter} ${styles.fun}`} data-story-chapter="fun">
            <h3>Fun?</h3>
            <div className={styles.funMedia}>
              <div className={`${styles.mediaFrame} ${styles.videoFrame}`} data-story-media="video" data-story-speed="1.18">
                <video
                  ref={videoRef}
                  aria-label={personalStory.video.label}
                  width={personalStory.video.width}
                  height={personalStory.video.height}
                  poster={personalStory.video.poster}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  controls
                >
                  <source src={personalStory.video.src} type="video/mp4" />
                  Your browser does not support video playback.
                </video>
              </div>
              <div className={`${styles.mediaFrame} ${styles.nightFrame}`} data-story-media="night" data-story-speed="0.78">
                <Image
                  src={personalStory.night.src}
                  alt={personalStory.night.alt}
                  width={personalStory.night.width}
                  height={personalStory.night.height}
                  sizes="(max-width: 900px) 42vw, 22vw"
                />
              </div>
            </div>
          </div>

          <div className={`${styles.chapter} ${styles.style}`} data-story-chapter="style">
            <h3>Style?</h3>
            <div className={styles.styleMedia}>
              <div className={`${styles.mediaFrame} ${styles.coatFrame}`} data-story-media="coat" data-story-speed="1.06">
                <Image
                  src={personalStory.style.src}
                  alt={personalStory.style.alt}
                  width={personalStory.style.width}
                  height={personalStory.style.height}
                  sizes="(max-width: 900px) 80vw, 36vw"
                />
              </div>
            </div>
          </div>

          <div className={`${styles.chapter} ${styles.adventure}`} data-story-chapter="adventure">
            <h3>Adventure?</h3>
            <div className={styles.adventureMedia}>
              <div className={`${styles.mediaFrame} ${styles.portraitFrame}`} data-story-media="portrait" data-story-speed="0.9">
                <Image
                  src={personalStory.snowboardPortrait.src}
                  alt={personalStory.snowboardPortrait.alt}
                  width={personalStory.snowboardPortrait.width}
                  height={personalStory.snowboardPortrait.height}
                  sizes="(max-width: 900px) 44vw, 25vw"
                />
              </div>
              <div className={`${styles.mediaFrame} ${styles.actionFrame}`} data-story-media="action" data-story-speed="1.12">
                <Image
                  src={personalStory.snowboardAction.src}
                  alt={personalStory.snowboardAction.alt}
                  width={personalStory.snowboardAction.width}
                  height={personalStory.snowboardAction.height}
                  sizes="(max-width: 900px) 44vw, 25vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
