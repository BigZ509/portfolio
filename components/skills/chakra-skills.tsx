"use client";

/*
 * Adapted from rishabhaiml/Portfolio @ 411b99a1890562c65f25e3d35b694d3ef8d0f223
 * Source: https://github.com/rishabhaiml/Portfolio  (src/lib/sections/SkillsSection.svelte)
 * Author: Rishabh (rishabhaiml)
 * Authorization: MIT, as stated in the upstream README; code only. See docs/source-permissions.md §7.
 *
 * Changes:
 * - Svelte → React 19. `let activeElement` / `let isVisible` become useState; `onMount` becomes a
 *   useEffect that returns the IntersectionObserver teardown. `toggleElement` is unchanged in logic:
 *   one card open at a time, clicking the open card closes it.
 * - Removed: the `chakra-nature.mp3` sound on open (plan constraint: no audio), and the writes to
 *   upstream's global `eyeEvolution` / `currentSection` stores, which drive its own navigation.
 * - Rishabh's skill claims are not used. Cards are built from Marc's `data/skills.ts`.
 * - Markup follows the WAI-ARIA accordion pattern: heading → button (aria-expanded, aria-controls)
 *   → list region, instead of upstream's <ul> and <h3> nested inside a <button>. Collapsed lists are
 *   `inert` and aria-hidden, so a screen reader does not read content that is visually closed.
 * - The Sharingan watermark is replaced by an original sigil (./element-sigil.tsx) for rights
 *   reasons; "Lightning Release" naming is shortened to the element name.
 * - The element→group pairing, kanji, colours and glow values are upstream's, in upstream's order.
 */

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { skillGroups, skills, type SkillGroupKey } from "@/data/skills";
import { ElementSigil, type Element } from "./element-sigil";
import styles from "./chakra-skills.module.css";

type ElementStyle = {
  element: Element;
  name: string;
  kanji: string;
  /** Upstream `color`. */
  color: string;
  /** Upstream `glowColor`. */
  glow: string;
  /** Text-only tint where the upstream colour misses 4.5:1 at label size. */
  text?: string;
};

/** Upstream's four elements, in upstream order, each paired with one of Marc's groups. */
const ELEMENTS: Record<SkillGroupKey, ElementStyle> = {
  intelligence: { element: "lightning", name: "Lightning", kanji: "雷", color: "#a855f7", glow: "rgba(168, 85, 247, 0.4)", text: "#b57bf9" },
  engineering: { element: "fire", name: "Fire", kanji: "火", color: "#ef4444", glow: "rgba(239, 68, 68, 0.4)" },
  physical: { element: "earth", name: "Earth", kanji: "土", color: "#f59e0b", glow: "rgba(245, 158, 11, 0.4)" },
  toolkit: { element: "water", name: "Water", kanji: "水", color: "#3b82f6", glow: "rgba(59, 130, 246, 0.4)" },
};

export function ChakraSkills() {
  const baseId = useId();
  const gridRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeElement, setActiveElement] = useState<number | null>(null);

  useEffect(() => {
    const grid = gridRef.current;
    // Without IntersectionObserver the grid is never armed, so the cards simply stay visible.
    if (!grid || typeof IntersectionObserver === "undefined") return;

    // Arm the hidden start state only now that JavaScript is running, so the cards stay visible
    // for anyone without it. This is a DOM fact rather than React state, so it is set directly.
    grid.dataset.armed = "";

    // Upstream: IntersectionObserver at threshold 0.2, revealing once.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(grid);
    return () => {
      observer.disconnect();
      delete grid.dataset.armed;
    };
  }, []);

  // Upstream toggleElement(): one open at a time; the open card closes on a second click.
  const toggleElement = (index: number) => {
    setActiveElement((current) => (current === index ? null : index));
  };

  return (
    <div className={styles.skills}>
      <div ref={gridRef} className={styles.grid}>
        {skillGroups.map((group, index) => {
          const element = ELEMENTS[group.key];
          const groupSkills = skills.filter((skill) => skill.group === group.key);
          const active = activeElement === index;
          const listId = `${baseId}-list-${index}`;
          const cardStyle = {
            "--element-color": element.color,
            "--element-glow": element.glow,
            ...(element.text ? { "--element-text": element.text } : {}),
            "--list-max": `calc(${groupSkills.length} * 2.3rem)`,
            animationDelay: `${index * 0.1}s`,
          } as CSSProperties;

          return (
            <div
              key={group.key}
              className={[styles.card, isVisible && styles.visible, active && styles.active].filter(Boolean).join(" ")}
              style={cardStyle}
              data-element={element.element}
            >
              {/* Watermark slot — upstream renders a Mangekyō eye here. */}
              <div className={styles.watermark} aria-hidden="true">
                <ElementSigil element={element.element} size={120} />
              </div>

              <h3 className={styles.heading}>
                <button
                  type="button"
                  className={styles.toggle}
                  aria-expanded={active}
                  aria-controls={listId}
                  onClick={() => toggleElement(index)}
                >
                  {/* Chakra symbol */}
                  <span className={styles.symbol} aria-hidden="true">
                    <span className={styles.ring}>
                      <span className={styles.inner}>
                        <span className={styles.kanji}>{element.kanji}</span>
                      </span>
                    </span>
                    <span className={styles.symbolGlow} />
                  </span>

                  {/* Element info */}
                  <span className={styles.info}>
                    <span className={styles.name} aria-hidden="true">{element.name}</span>
                    <span className={styles.title}>{group.label}</span>
                    <span className={styles.subtitle}>{group.subtitle}</span>
                  </span>
                </button>
              </h3>

              {/* Skills list */}
              <ul
                id={listId}
                className={`${styles.list} ${active ? styles.expanded : ""}`}
                aria-label={`${group.label} skills`}
                aria-hidden={!active}
                inert={!active}
              >
                {groupSkills.map((skill) => (
                  <li key={skill.name}>
                    <span className={styles.dot} aria-hidden="true" />
                    <span>{skill.name}</span>
                  </li>
                ))}
              </ul>

              {/* Expand indicator */}
              <div className={styles.indicator} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Background effects */}
              <div className={styles.cardBg} aria-hidden="true" />
              <div className={styles.flow} aria-hidden="true" />
            </div>
          );
        })}
      </div>

      {/* Decorative pentagon showing all elements — verbatim from upstream. */}
      <div className={`${styles.diagram} ${isVisible ? styles.visible : ""}`} aria-hidden="true">
        <svg viewBox="0 0 200 200" width="120" height="120">
          <polygon points="100,10 190,75 155,180 45,180 10,75" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <circle cx="100" cy="10" r="6" fill="#a855f7" opacity="0.8" />
          <circle cx="190" cy="75" r="6" fill="#ef4444" opacity="0.8" />
          <circle cx="155" cy="180" r="6" fill="#f59e0b" opacity="0.8" />
          <circle cx="45" cy="180" r="6" fill="#3b82f6" opacity="0.8" />
          <circle cx="10" cy="75" r="6" fill="#22c55e" opacity="0.3" />
          <circle cx="100" cy="100" r="15" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}
