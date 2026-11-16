import type { Project, ProjectStatus } from "@/data/projects";
import styles from "./project-details.module.css";

const STATUS_LABELS: Record<ProjectStatus, string> = {
  complete: "Complete",
  "in-development": "In development",
  "to-confirm": "Status to be confirmed",
};

/** Placeholder copy in the data starts with "TODO" and must never be shown as project content. */
function verified(text: string | undefined): string | null {
  const value = text?.trim();
  return value && !/^TODO\b/i.test(value) ? value : null;
}

type ProjectDetailsProps = {
  project: Project;
  titleId: string;
  summaryId: string;
  onClose: () => void;
};

export function ProjectDetails({ project, titleId, summaryId, onClose }: ProjectDetailsProps) {
  const summary = verified(project.shortDescription);
  const description = verified(project.detailedDescription);
  const category = verified(project.category);
  const technologies = project.technologies.map((tech) => verified(tech)).filter((tech): tech is string => tech !== null);
  const links = [
    project.githubUrl ? { href: project.githubUrl, label: "View source on GitHub" } : null,
    project.demoUrl ? { href: project.demoUrl, label: "Open live demo" } : null,
  ].filter((link): link is { href: string; label: string } => link !== null);

  return (
    // Focusable so keyboard users can scroll long details; the dialog moves initial focus to Close.
    <article className={styles.panel} tabIndex={0} aria-labelledby={titleId}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>
          <span className={styles.numeral}>{project.romanNumeral}</span>
          <span>{project.tarotIdentity}</span>
        </p>
        <button type="button" className={styles.close} onClick={onClose} data-dialog-initial-focus="">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
          Close
        </button>
      </div>

      <h2 id={titleId} className={styles.title}>{project.title}</h2>
      <p className={styles.status} data-status={project.status}>{STATUS_LABELS[project.status]}</p>

      <p id={summaryId} className={summary ? styles.summary : styles.pending}>
        {summary ?? "A verified project summary is coming soon."}
      </p>

      <section className={styles.section} aria-labelledby={`${titleId}-about`}>
        <h3 id={`${titleId}-about`} className={styles.sectionTitle}>About</h3>
        <p className={description ? styles.body : styles.pending}>
          {description ?? "Full project details are being prepared."}
        </p>
        {category && <p className={styles.meta}>Category: {category}</p>}
      </section>

      <section className={styles.section} aria-labelledby={`${titleId}-tech`}>
        <h3 id={`${titleId}-tech`} className={styles.sectionTitle}>Technologies</h3>
        {technologies.length > 0 ? (
          <ul className={styles.tags}>
            {technologies.map((tech) => <li key={tech} className={styles.tag}>{tech}</li>)}
          </ul>
        ) : (
          <p className={styles.pending}>Technologies to be confirmed.</p>
        )}
      </section>

      <section className={styles.section} aria-labelledby={`${titleId}-links`}>
        <h3 id={`${titleId}-links`} className={styles.sectionTitle}>Links</h3>
        {links.length > 0 ? (
          <ul className={styles.links}>
            {links.map((link) => (
              <li key={link.href}>
                <a className={styles.link} href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.pending}>No public links yet.</p>
        )}
      </section>
    </article>
  );
}
