import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { AtmosphericBackground } from "@/components/atmospheric-background";
import { experienceEntries } from "@/data/experience";
import styles from "@/components/experience.module.css";

export const metadata: Metadata = {
  title: "Experience — MARC'S WORLD",
  description: "Marc's documented hackathon and workshop participation.",
};

export default function ExperiencePage() {
  return (
    <main className={`${styles.page} min-h-screen`}>
      <AtmosphericBackground />
      <div className={styles.ground} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.kicker}>Marc&rsquo;s World / Field notes</p>
          <h1 className={styles.title}>Where the work happened<span aria-hidden="true">.</span></h1>
          <p className={styles.lede}>
            Projects show the things I made. These are the rooms and circumstances that shaped the
            work: a hackathon deadline and a system design workshop. I&rsquo;m still building this record.
          </p>
        </header>

        <div className={styles.journeyHead} aria-hidden="true">
          <span>Selected participation</span>
          <span>01 — 02</span>
        </div>

        <ol className={styles.journey}>
          {experienceEntries.map((entry, index) => (
            <li key={entry.id} className={styles.milestone}>
              <span className={styles.number} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <article className={styles.story}>
                <div className={styles.storyMeta}>
                  <span>{entry.kind}</span>
                  <span>{entry.setting}</span>
                </div>
                <h2>{entry.title}</h2>
                <p className={styles.participation}>{entry.participation}</p>
                <ul className={styles.focus}>
                  {entry.focus.map((point) => <li key={point}>{point}</li>)}
                </ul>
                {entry.projectSlug && (
                  <Link href="/projects" className={styles.storyLink}>
                    Explore Road Report <span aria-hidden="true">↗</span>
                  </Link>
                )}
                {entry.kind === "workshop" && (
                  <figure className={styles.workshopPhoto}>
                    <Image
                      src="/images/home/workshop-ctoc.webp"
                      alt="Students at a CTOC Labs system design workshop watch architecture diagrams on two screens."
                      width={1152}
                      height={1536}
                      sizes="(max-width: 720px) 85vw, 320px"
                    />
                    <figcaption>System design workshop at CTOC Labs</figcaption>
                  </figure>
                )}
              </article>
            </li>
          ))}
        </ol>

        <aside className={styles.closing}>
          <p>For the build decisions and the work itself, open the project showcase.</p>
          <Link href="/projects">See the projects <span aria-hidden="true">↗</span></Link>
        </aside>
      </div>
    </main>
  );
}
