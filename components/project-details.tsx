"use client";

import type { CardMotif, Project, ProjectStatus } from "@/data/projects";
import { cardMotifs } from "./card-motifs";
import { useOptionalProjectMedia } from "./project-media";
import styles from "./project-details.module.css";

/**
 * Public status labels. `to-confirm` maps to null on purpose: it is an internal audit state meaning
 * "not yet verified by a maintainer", and showing it to a visitor reads as a defect in the project
 * rather than a note to ourselves. The value stays in the data for future verification; the badge
 * is simply omitted. `in-development` is kept and shown, because that is a real, honest status.
 */
const STATUS_LABELS: Record<ProjectStatus, string | null> = {
  complete: "Complete",
  "in-development": "In development",
  "to-confirm": null,
};

const ENTRY_NUMERALS = ["I", "II", "III"] as const;

/** Placeholder copy in the data starts with "TODO" and must never be shown as project content. */
function verified(text: string | undefined): string | null {
  const value = text?.trim();
  return value && !/^TODO\b/i.test(value) ? value : null;
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

type ProjectDetailsProps = {
  project: Project;
  titleId: string;
  summaryId: string;
  onClose: () => void;
};

export function ProjectDetails({ project, titleId, summaryId, onClose }: ProjectDetailsProps) {
  const media = useOptionalProjectMedia();
  const summary = verified(project.shortDescription);
  const category = verified(project.category);
  const status = STATUS_LABELS[project.status];
  const { story } = project;
  const entries = [
    { key: "problem", label: "The Problem", text: verified(story.problem) },
    { key: "built", label: "What I Built", text: verified(story.built) },
    { key: "decision", label: story.decision?.label ?? "Engineering Decisions", text: verified(story.decision?.text) },
  ].filter((entry): entry is { key: string; label: string; text: string } => entry.text !== null);
  const techGroups = project.techStack
    .map((group) => ({ label: group.label, items: group.items.map(verified).filter((item): item is string => item !== null) }))
    .filter((group) => group.items.length > 0);
  const canWatch = media !== null && media.demoIndex !== null;
  const links = [
    project.demoUrl ? { href: project.demoUrl, label: "View Live Demo", icon: "live" as const } : null,
    project.githubUrl ? { href: project.githubUrl, label: "Source on GitHub", icon: "code" as const } : null,
  ].filter((link): link is { href: string; label: string; icon: "live" | "code" } => link !== null);
  const hasActions = canWatch || links.length > 0;

  return (
    // Focusable so keyboard users can scroll long details; the dialog moves initial focus to Close.
    <article className={styles.panel} tabIndex={0} aria-labelledby={titleId}>
      <MotifGlyph motif={project.motif} className={styles.watermark} />

      <header className={styles.masthead}>
        <p className={styles.arcana}>
          <MotifGlyph motif={project.motif} className={styles.arcanaGlyph} />
          <span className={styles.numeral}>{project.romanNumeral}</span>
          <span className={styles.arcanaRule} aria-hidden="true" />
          <span>{project.tarotIdentity}</span>
        </p>
        <button type="button" className={styles.close} onClick={onClose} data-dialog-initial-focus="">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
          Close
        </button>
      </header>

      <div className={styles.titleBlock}>
        {category && <p className={styles.discipline}>{category}</p>}
        <h2 id={titleId} className={styles.title}>{project.title}</h2>
        {status && <p className={styles.status} data-status={project.status}>{status}</p>}
        <p id={summaryId} className={summary ? styles.lede : styles.pending}>
          {summary ?? "A verified project summary is coming soon."}
        </p>
      </div>

      {/* Omitted entirely when a project has nothing public: nothing is fabricated to fill it. */}
      {hasActions && (
        <ul className={styles.actions} aria-label="Project links">
          {canWatch && (
            <li>
              <button type="button" className={styles.action} data-primary="true" onClick={() => media?.watchDemo()}>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={styles.actionIcon} data-fill="true">
                  <path d="M8 5.5v13l10.5-6.5Z" />
                </svg>
                Watch Demo
              </button>
            </li>
          )}
          {links.map((link, index) => (
            <li key={link.href}>
              <a
                className={styles.action}
                data-primary={!canWatch && index === 0 ? "true" : undefined}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={styles.actionIcon}>
                  {link.icon === "live" ? <path d="M7 17 17 7M9 7h8v8" /> : <path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.5 5.5l-3 13" />}
                </svg>
                {link.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.rule} aria-hidden="true"><span>◆</span></div>

      {entries.length > 0 ? (
        <div className={styles.dossier}>
          {entries.map((entry, index) => (
            <section key={entry.key} className={styles.entry} aria-labelledby={`${titleId}-${entry.key}`}>
              <span className={styles.entryMark} aria-hidden="true">{ENTRY_NUMERALS[index]}</span>
              <div>
                <h3 id={`${titleId}-${entry.key}`} className={styles.entryTitle}>{entry.label}</h3>
                <p className={styles.entryText}>{entry.text}</p>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className={styles.pending}>Full project details are being prepared.</p>
      )}

      {techGroups.length > 0 && (
        <section className={styles.stack} aria-labelledby={`${titleId}-stack`}>
          <h3 id={`${titleId}-stack`} className={styles.stackTitle}>Built with</h3>
          <dl className={styles.stackList}>
            {techGroups.map((group) => (
              <div key={group.label} className={styles.stackRow}>
                <dt>{group.label}</dt>
                <dd>
                  <ul className={styles.stackItems}>
                    {group.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <p className={styles.colophon} aria-hidden="true">
        <span>✦</span> Arcanum {project.romanNumeral} · {project.tarotIdentity} <span>✦</span>
      </p>
    </article>
  );
}
