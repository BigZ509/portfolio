"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { CardMotif, Project, ProjectStatus } from "@/data/projects";
import { cardMotifs } from "./card-motifs";
import { useOptionalProjectMedia } from "./project-media";
import styles from "./project-details.module.css";

/*
 * The project dossier as an "Interactive Arcana Fieldbook": a sealed masthead, an action zone led by
 * the demo, a working chapter rail with reading progress, three editorial folios, a node/connector
 * diagram of the system's data path, and the stack as grouped seals. Every word comes from the
 * project record; nothing here adds claims, metrics or badges.
 */

/**
 * Public status labels. `to-confirm` maps to null on purpose: it is an internal audit state meaning
 * "not yet verified by a maintainer", and showing it to a visitor reads as a defect in the project
 * rather than a note to ourselves. `in-development` is a real, honest status and is shown.
 */
const STATUS_LABELS: Record<ProjectStatus, string | null> = {
  complete: "Complete",
  "in-development": "In development",
  "to-confirm": null,
};

const CHAPTER_NUMERALS = ["I", "II", "III"] as const;

/** Placeholder copy in the data starts with "TODO" and must never be shown as project content. */
function verified(text: string | undefined): string | null {
  const value = text?.trim();
  return value && !/^TODO\b/i.test(value) ? value : null;
}

/** Splits a passage into its opening sentence (set as the folio's lead) and the rest. */
function splitLead(text: string): { lead: string; rest: string | null } {
  const match = /^(.+?[.!?])\s+(\S[\s\S]*)$/.exec(text);
  return match ? { lead: match[1], rest: match[2] } : { lead: text, rest: null };
}

/** The card's own geometric symbol, reused as the dossier's seal. */
function MotifGlyph({ motif, className }: { motif: CardMotif; className: string }) {
  const shape = cardMotifs[motif];
  return (
    <svg aria-hidden="true" focusable="false" className={className} viewBox="0 0 128 128" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      {shape.paths.map((d) => <path key={d} d={d} />)}
      {shape.circles?.map(({ cx, cy, r }) => <circle key={`${cx}-${cy}-${r}`} cx={cx} cy={cy} r={r} />)}
      {shape.ellipses?.map(({ cx, cy, rx, ry }) => <ellipse key={`${cx}-${cy}-${rx}-${ry}`} cx={cx} cy={cy} rx={rx} ry={ry} />)}
    </svg>
  );
}

type Chapter = { key: string; rail: string; title: string; text: string };

type ProjectDetailsProps = {
  project: Project;
  titleId: string;
  summaryId: string;
  onClose: () => void;
};

export function ProjectDetails({ project, titleId, summaryId, onClose }: ProjectDetailsProps) {
  const media = useOptionalProjectMedia();
  const panelRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  // After a rail click the clicked chapter stays current while the panel scrolls to it, even if a
  // short record bottoms out with a later chapter on screen.
  const railLockUntil = useRef(0);
  const [seen, setSeen] = useState<ReadonlySet<string>>(() => new Set());

  const summary = verified(project.shortDescription);
  const category = verified(project.category);
  const status = STATUS_LABELS[project.status];
  const { story } = project;
  const decisionLabel = story.decision?.label;
  const chapters = [
    { key: "problem", rail: "Problem", title: "The Problem", text: verified(story.problem) },
    { key: "built", rail: "Build", title: "What I Built", text: verified(story.built) },
    {
      key: "decision",
      // "Design Approach" becomes "Design" on the rail; the folio keeps the full heading.
      rail: decisionLabel ? decisionLabel.split(" ")[0] : "Engineering",
      title: decisionLabel ?? "Engineering Decisions",
      text: verified(story.decision?.text),
    },
  ].filter((chapter): chapter is Chapter => chapter.text !== null);
  const flowSteps = (story.flow?.steps ?? []).map(verified).filter((step): step is string => step !== null);
  const showFlow = flowSteps.length > 1 && story.flow !== undefined;
  const techGroups = project.techStack
    .map((group) => ({ label: group.label, items: group.items.map(verified).filter((item): item is string => item !== null) }))
    .filter((group) => group.items.length > 0);
  const demo = media !== null && media.demoIndex !== null ? media.media[media.demoIndex] : null;
  const links = [
    project.demoUrl ? { href: project.demoUrl, label: "Live app", long: "Visit the live app", icon: "live" as const } : null,
    project.githubUrl ? { href: project.githubUrl, label: "Source", long: "View the source on GitHub", icon: "code" as const } : null,
  ].filter((link): link is { href: string; label: string; long: string; icon: "live" | "code" } => link !== null);
  const hasActions = demo !== null || links.length > 0;
  const chapterId = (key: string) => `${titleId}-${key}`;
  const chapterKeys = chapters.map((chapter) => chapter.key).join("|");

  // Reading progress: one passive listener on the panel itself (never the window), written straight
  // to a CSS variable once per frame so scrolling causes no React renders.
  useEffect(() => {
    const panel = panelRef.current;
    const bar = progressRef.current;
    if (!panel || !bar) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = panel.scrollHeight - panel.clientHeight;
      bar.style.setProperty("--progress", String(max > 0 ? Math.min(1, panel.scrollTop / max) : 1));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    panel.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      panel.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [project.id]);

  // Active chapter and first-sight reveal, both observed inside the panel's own scroll box.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const sections = Array.from(panel.querySelectorAll<HTMLElement>("[data-chapter]"));
    const reveal = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).map((entry) => (entry.target as HTMLElement).dataset.chapter ?? "");
        if (visible.length) setSeen((prev) => (visible.every((key) => prev.has(key)) ? prev : new Set([...prev, ...visible])));
      },
      { root: panel, threshold: 0.12 },
    );
    // A chapter is "current" while it crosses a reading line about a third of the way down.
    const current = new IntersectionObserver(
      (entries) => {
        if (performance.now() < railLockUntil.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index ?? 0));
        }
      },
      { root: panel, rootMargin: "-32% 0px -60% 0px" },
    );
    sections.forEach((section) => {
      reveal.observe(section);
      current.observe(section);
    });
    // At the very bottom the last chapter may never reach the reading line.
    const onEnd = () => {
      if (performance.now() < railLockUntil.current) return;
      if (panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 4) setActive(sections.length - 1);
      else if (panel.scrollTop < 4) setActive(0);
    };
    panel.addEventListener("scroll", onEnd, { passive: true });
    return () => {
      reveal.disconnect();
      current.disconnect();
      panel.removeEventListener("scroll", onEnd);
    };
  }, [project.id, chapterKeys]);

  const goToChapter = (index: number, at: number) => {
    const panel = panelRef.current;
    const target = panel?.querySelector<HTMLElement>(`[data-index="${index}"]`);
    if (!panel || !target) return;
    const offset = (railRef.current?.offsetHeight ?? 0) + 14;
    const top = target.getBoundingClientRect().top - panel.getBoundingClientRect().top + panel.scrollTop - offset;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The click's timeStamp shares performance.now()'s clock.
    railLockUntil.current = at + 900;
    panel.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    setActive(index);
    // Move focus with the view so keyboard and screen-reader users land in the chapter.
    target.focus({ preventScroll: true });
  };

  return (
    // Focusable so keyboard users can scroll long details; the dialog moves initial focus to Close.
    <article ref={panelRef} className={styles.panel} tabIndex={0} aria-labelledby={titleId}>
      <span ref={progressRef} className={styles.progress} aria-hidden="true" />
      <MotifGlyph motif={project.motif} className={styles.watermark} />

      <header className={styles.masthead}>
        <div className={styles.seal} aria-hidden="true">
          <MotifGlyph motif={project.motif} className={styles.sealGlyph} />
          <span className={styles.sealNumeral} data-length={project.romanNumeral.length}>{project.romanNumeral}</span>
        </div>
        <p className={styles.arcana}>
          <span className={styles.arcanaName}>{project.tarotIdentity}</span>
          <span className={styles.arcanaMeta}>Arcanum {project.romanNumeral}</span>
        </p>
        <button type="button" className={styles.close} onClick={onClose} data-dialog-initial-focus="">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
          Close
        </button>
      </header>

      <div className={styles.intro}>
        {category && <p className={styles.discipline}>{category}</p>}
        <h2 id={titleId} className={styles.title}>{project.title}</h2>
        {status && <p className={styles.status} data-status={project.status}>{status}</p>}
        <p id={summaryId} className={summary ? styles.lede : styles.pending}>
          {summary ?? "A verified project summary is coming soon."}
        </p>
      </div>

      {/* Omitted entirely when a project has nothing public: nothing is fabricated to fill it. */}
      {hasActions && (
        <ul className={styles.actions} aria-label="Project links" data-has-demo={demo ? "true" : undefined}>
          {demo && (
            <li className={styles.demoItem}>
              <button type="button" className={styles.demo} onClick={() => media?.watchDemo()}>
                <span className={styles.demoPlay} aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false"><path d="M8 5.5v13l10.5-6.5Z" /></svg>
                </span>
                <span className={styles.demoText}>
                  <span className={styles.demoLabel}>Watch Demo</span>
                  <span className={styles.demoMeta}>{demo.kind === "youtube" ? "Plays here · YouTube" : "Plays here"}</span>
                </span>
              </button>
            </li>
          )}
          {links.map((link, index) => (
            <li key={link.href}>
              <a
                className={styles.action}
                data-primary={!demo && index === 0 ? "true" : undefined}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                title={link.long}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={styles.actionIcon}>
                  {link.icon === "live" ? <path d="M7 17 17 7M9 7h8v8" /> : <path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.5 5.5l-3 13" />}
                </svg>
                <span>
                  {link.label}
                  <span className="sr-only">{link.icon === "code" ? " on GitHub" : ""} (opens in a new tab)</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}

      {chapters.length > 0 ? (
        <>
          <nav ref={railRef} className={styles.rail} aria-label="Dossier chapters">
            <ol className={styles.railList} style={{ "--chapters": chapters.length, "--active": active } as CSSProperties}>
              {chapters.map((chapter, index) => (
                <li key={chapter.key}>
                  <button
                    type="button"
                    className={styles.railButton}
                    aria-current={active === index ? "step" : undefined}
                    aria-controls={chapterId(chapter.key)}
                    onClick={(event) => goToChapter(index, event.timeStamp)}
                  >
                    <span className={styles.railIndex}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={styles.railSlash} aria-hidden="true">/</span>
                    <span className={styles.railLabel}>{chapter.rail}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <div className={styles.folios}>
            {chapters.map((chapter, index) => {
              const { lead, rest } = splitLead(chapter.text);
              return (
                <div key={chapter.key} className={styles.folioGroup}>
                  <section
                    id={chapterId(chapter.key)}
                    className={styles.folio}
                    aria-labelledby={`${chapterId(chapter.key)}-title`}
                    tabIndex={-1}
                    data-chapter={chapter.key}
                    data-index={index}
                    data-seen={seen.has(chapter.key) ? "true" : undefined}
                  >
                    <span className={styles.folioNumeral} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    <header className={styles.folioHead}>
                      <p className={styles.folioKicker} aria-hidden="true">Chapter {CHAPTER_NUMERALS[index]}</p>
                      <h3 id={`${chapterId(chapter.key)}-title`} className={styles.folioTitle}>{chapter.title}</h3>
                    </header>
                    <p className={styles.folioLead}>{lead}</p>
                    {rest && <p className={styles.folioBody}>{rest}</p>}
                  </section>

                  {chapter.key === "built" && showFlow && story.flow && (
                    <figure className={styles.flow} aria-labelledby={`${titleId}-flow`}>
                      <figcaption id={`${titleId}-flow`} className={styles.flowCaption}>
                        <span className={styles.flowMark} aria-hidden="true">◇</span>
                        {story.flow.label}
                        <span className={styles.flowCount}>{flowSteps.length} steps</span>
                      </figcaption>
                      <ol className={styles.flowSteps}>
                        {flowSteps.map((step, stepIndex) => (
                          <li key={step} className={styles.flowNode} data-edge={stepIndex === 0 ? "start" : stepIndex === flowSteps.length - 1 ? "end" : undefined}>
                            <span className={styles.flowIndex} aria-hidden="true">{stepIndex + 1}</span>
                            <span className={styles.flowLabel}>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </figure>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p className={styles.pending}>Full project details are being prepared.</p>
      )}

      {techGroups.length > 0 && (
        <section className={styles.stack} aria-labelledby={`${titleId}-stack`}>
          <h3 id={`${titleId}-stack`} className={styles.stackTitle}>
            <span aria-hidden="true">✦</span> Built with
          </h3>
          <div className={styles.stackGrid}>
            {techGroups.map((group, groupIndex) => (
              <div key={group.label} className={styles.plate} role="group" aria-labelledby={`${titleId}-stack-${groupIndex}`}>
                <p id={`${titleId}-stack-${groupIndex}`} className={styles.plateLabel}>{group.label}</p>
                <ul className={styles.seals}>
                  {group.items.map((item) => <li key={item} className={styles.techSeal}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className={styles.colophon} aria-hidden="true">
        <span>✦</span> Arcanum {project.romanNumeral} · {project.tarotIdentity} <span>✦</span>
      </p>
    </article>
  );
}
