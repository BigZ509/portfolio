"use client";

/*
 * Adapted from GarunJad/Anime-Portfolio @ a2700feea9e022a1f95b94d971e9956173265553
 * Source: https://github.com/GarunJad/Anime-Portfolio  (script.js)
 *   - initHeroAnimations()  L140–153
 *   - initMirrorDividers()  L195–215
 *   - initMangaPanels()     L274–311
 * Author: GarunJad
 * Authorization: MIT (per README) + owner-held authorization, see docs/source-permissions.md
 *
 * Changes:
 * - GSAP and ScrollTrigger are ES module imports, not the upstream CDN <script> tags.
 * - Upstream's global class selectors ('.hero-sub', '.manga-panel', '.mirror-text-top') are
 *   replaced with data attributes resolved inside a scoped root element, so this runs against
 *   React-rendered markup and cannot reach outside the About page.
 * - All work is created inside gsap.context(scope) and reverted on cleanup, so React 19
 *   StrictMode's double effect in development cannot duplicate timelines or ScrollTriggers.
 * - Honours prefers-reduced-motion: with it set, nothing is created at all and the page renders
 *   in its final state. Upstream has no reduced-motion branch.
 * - Upstream animates '.name-line' with a stagger; our heading lines carry the same role, so the
 *   same values are applied to [data-hero-line].
 *
 * Preserved verbatim: every duration, delay, ease, stagger and transform value from the three
 * upstream functions, including the manga-panel direction table, the 'top 85%' /
 * toggleActions 'play none none none' trigger, and the scrubbed y:-25 image parallax.
 * See docs/fidelity-notes.md for the comparison against the upstream demo.
 */

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Upstream initMangaPanels() direction table, unchanged (script.js L279–284). */
const PANEL_DIRECTIONS = [
  { x: -80, y: 40, rotate: -2 },
  { x: 80, y: 0, rotate: 2 },
  { x: 0, y: 80, rotate: 0 },
  { x: 60, y: 40, rotate: -1 },
] as const;

export function AboutMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = root.current;
    if (!scope) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      // --- initHeroAnimations() ------------------------------------------------
      // Upstream staged the character image, glow, badge, sub, name lines, tagline,
      // description, actions and scroll hint across one timeline. Same offsets here.
      const hero = gsap.timeline({ defaults: { ease: "power3.out" } });
      hero
        .from("[data-hero='photo']", { opacity: 0, scale: 1.15, duration: 1.6, ease: "power2.out" }, 0)
        .from("[data-hero='glow']", { opacity: 0, scale: 0.5, duration: 1.2 }, 0.3)
        .from("[data-hero='chapter']", { opacity: 0, y: 30, scale: 0.9, duration: 0.6 }, 0.3)
        .from("[data-hero='kicker']", { opacity: 0, x: -40, duration: 0.6 }, 0.4)
        .from("[data-hero-line]", { opacity: 0, y: 100, rotateX: 30, duration: 1, stagger: 0.15 }, 0.5)
        .from("[data-hero='lede']", { opacity: 0, y: 20, duration: 0.5 }, 0.9)
        .from("[data-hero='body']", { opacity: 0, y: 30, duration: 0.6 }, 1.0)
        .from("[data-hero='actions']", { opacity: 0, y: 30, duration: 0.6 }, 1.15)
        .from("[data-hero='meta']", { opacity: 0, y: 20, scale: 0.8, duration: 0.4, stagger: 0.08 }, 1.3);

      // --- initMirrorDividers() ------------------------------------------------
      for (const divider of gsap.utils.toArray<HTMLElement>("[data-mirror-divider]")) {
        const top = divider.querySelector("[data-mirror-top]");
        const bottom = divider.querySelector("[data-mirror-bottom]");
        if (top) {
          gsap.from(top, {
            opacity: 0, x: -60, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: divider, start: "top 80%" },
          });
        }
        if (bottom) {
          gsap.from(bottom, {
            opacity: 0, x: 60, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: divider, start: "top 80%" },
          });
        }
      }

      // --- initMangaPanels() ---------------------------------------------------
      gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel, index) => {
        const direction = PANEL_DIRECTIONS[index % PANEL_DIRECTIONS.length];

        gsap.fromTo(
          panel,
          { opacity: 0, x: direction.x, y: direction.y, rotation: direction.rotate, scale: 0.92 },
          {
            opacity: 1, x: 0, y: 0, rotation: 0, scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );

        const image = panel.querySelector("[data-panel-img]");
        if (image) {
          gsap.to(image, {
            y: -25,
            ease: "none",
            scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: 1.5 },
          });
        }
      });
    }, scope);

    // Images finish decoding after mount and change the page height, so the triggers
    // need their positions recomputed once things have settled.
    const refresh = () => ScrollTrigger.refresh();
    const timer = window.setTimeout(refresh, 400);
    window.addEventListener("load", refresh);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", refresh);
      context.revert();
    };
  }, []);

  return <div ref={root}>{children}</div>;
}
