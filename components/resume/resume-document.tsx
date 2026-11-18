import styles from "./resume.module.css";

/**
 * The owner's own one-page resume, served byte-for-byte from public/resume. It is never
 * regenerated or retyped: the viewer always shows this exact file.
 */
export const RESUME = {
  href: "/resume/Marc-Alexis-Resume.pdf",
  filename: "Marc-Alexis-Resume.pdf",
  title: "Marc Alexis — Resume",
} as const;

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={styles.icon}>
      <path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14" />
    </svg>
  );
}

function OpenIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={styles.icon}>
      <path d="M14 5h5v5M19 5l-8 8M17 14v5H5V7h5" />
    </svg>
  );
}

/** Download and Open: plain links, so they work with or without inline PDF support or JavaScript. */
export function ResumeActions({ compact = false }: { compact?: boolean }) {
  return (
    <div className={styles.actions} data-compact={compact ? "true" : undefined}>
      <a className={styles.action} data-primary="true" href={RESUME.href} download={RESUME.filename}>
        <DownloadIcon />
        Download PDF
      </a>
      <a className={styles.action} href={RESUME.href} target="_blank" rel="noopener noreferrer">
        <OpenIcon />
        Open PDF
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}

/**
 * Inline viewer. `<object>` (not an iframe) so browsers without a PDF viewer, such as Chrome on
 * Android, render the fallback below instead of starting a download.
 */
export function ResumeDocument({ className = "" }: { className?: string }) {
  return (
    <div className={`${styles.paper} ${className}`}>
      {/* PDF open parameters: hide the thumbnail sidebar and fit the page width, so it reads at once. */}
      <object className={styles.document} data={`${RESUME.href}#navpanes=0&view=FitH`} type="application/pdf" aria-label={`${RESUME.title} (PDF)`}>
        <div className={styles.fallback}>
          <span className={styles.fallbackSeal} aria-hidden="true">✦</span>
          <p className={styles.fallbackTitle}>This browser can&rsquo;t show the PDF here.</p>
          <p className={styles.fallbackText}>Open it in a new tab or download the one-page file.</p>
          <ResumeActions compact />
        </div>
      </object>
    </div>
  );
}
