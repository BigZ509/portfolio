import Link from "next/link";
import type { Metadata } from "next";
import { MirrorDivider } from "@/components/mirror-divider";
import { involvement, type InvolvementKind } from "@/data/experience";
import styles from "@/components/experience.module.css";

export const metadata: Metadata = {
  title: "Experience — MARC'S WORLD",
  description: "Engineering work, hackathon projects and workshops — what Marc has actually built.",
};

const KIND_LABELS: Record<InvolvementKind, string> = {
  project: "Project",
  hackathon: "Hackathon",
  workshop: "Workshop",
};

export default function ExperiencePage() {
  return (
    <main className={`${styles.page} min-h-screen`}>
      <div className={styles.ground} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.kicker}>Marc&rsquo;s World</p>
          <h1 className={styles.title}>
            <span>What I&rsquo;ve</span>
            <span>worked on</span>
          </h1>
          <p className={styles.lede}>
            I&rsquo;m a computer science student, so this is a record of engineering work rather than
            an employment history: the projects I&rsquo;ve built, the hackathon I shipped under
            pressure, and the rooms I&rsquo;ve learned in. Everything here is something that exists.
          </p>
        </header>

        <MirrorDivider text="THE RECORD" />

        <ol className={styles.list}>
          {involvement.map((entry) => (
            <li key={entry.id} className={styles.item}>
              <div className={styles.marker} aria-hidden="true">
                <span className={styles.dot} />
              </div>

              <article className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.kind} data-kind={entry.kind}>{KIND_LABELS[entry.kind]}</span>
                  {entry.status === "in-development" && (
                    <span className={styles.flag}>In development</span>
                  )}
                  {entry.period && <span className={styles.period}>{entry.period}</span>}
                </div>

                <h2 className={styles.cardTitle}>{entry.title}</h2>
                <p className={styles.context}>{entry.context}</p>
                <p className={styles.summary}>{entry.summary}</p>

                {entry.highlights && entry.highlights.length > 0 && (
                  <ul className={styles.highlights}>
                    {entry.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                )}

                {entry.technologies && entry.technologies.length > 0 && (
                  <ul className={styles.tech}>
                    {entry.technologies.map((tech) => <li key={tech}>{tech}</li>)}
                  </ul>
                )}

                {entry.projectSlug && (
                  <Link className={styles.cardLink} href="/projects">
                    Open it in the showcase
                    <span aria-hidden="true">↗</span>
                  </Link>
                )}
              </article>
            </li>
          ))}
        </ol>

        <aside className={styles.closing}>
          <p>
            Looking for something specific, or wondering how one of these was put together? The
            projects showcase goes deeper, and I&rsquo;m happy to talk through any of it.
          </p>
          <div className={styles.closingActions}>
            <Link className={styles.primaryAction} href="/projects">
              <span>Browse the projects</span>
              <span aria-hidden="true">↗</span>
            </Link>
            <Link className={styles.secondaryAction} href="/about">
              More about me <span aria-hidden="true">→</span>
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
