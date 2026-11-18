import { AtmosphericBackground } from "@/components/atmospheric-background";
import { RESUME, ResumeActions, ResumeDocument } from "@/components/resume/resume-document";
import styles from "@/components/resume/resume.module.css";
import { publicSocialLinks } from "@/data/social-links";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume — MARC'S WORLD",
  description: "Preview or download Marc Alexis's one-page resume.",
};

/**
 * Direct, shareable resume route. Works on refresh and without JavaScript; the navbar opens the
 * same viewer as a dialog on other pages.
 */
export default function ResumePage() {
  return (
    <main className={styles.page}>
      <AtmosphericBackground />
      <div className={styles.pageInner}>
        <header className={styles.pageHead}>
          <div>
            <p className={styles.eyebrow}>The Record · one page</p>
            <h1 className={styles.pageTitle}>{RESUME.title}</h1>
            <p className={styles.pageLede}>
              Education, projects and experience on a single page. Read it here, or take the PDF with you.
            </p>
          </div>
          <ResumeActions />
        </header>

        <ResumeDocument className={styles.pagePaper} />

        {publicSocialLinks.length > 0 && (
          <ul className={styles.connect} aria-label="Elsewhere">
            {publicSocialLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
