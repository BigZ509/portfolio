import Image from "next/image";
import Link from "next/link";
import { AtmosphericBackground } from "@/components/atmospheric-background";
import type { Metadata } from "next";
import { AboutMotion } from "@/components/about-motion";
import { MirrorDivider } from "@/components/mirror-divider";
import { PersonalStory } from "@/components/personal-story/personal-story";
import { ChakraSkills } from "@/components/skills/chakra-skills";
import { aboutIntro, connect } from "@/data/about";
import { publicSocialLinks } from "@/data/social-links";
import styles from "@/components/about.module.css";

export const metadata: Metadata = {
  title: "About — MARC'S WORLD",
  description:
    "Marc is a computer science student at the University of Central Florida, building across software, AI and robotics.",
};

function SocialIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "github":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "email":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function AboutPage() {
  return (
    <main className={`${styles.page} min-h-screen`}>
      <AtmosphericBackground />
      <div className={styles.ground} aria-hidden="true" />

      <AboutMotion>
        <div className={styles.inner}>
          {/* ---- Origins ---- */}
          <section className={styles.hero} aria-labelledby="about-title">
            <div className={styles.heroCopy}>
              <p className={styles.chapterTag} data-hero="chapter">{aboutIntro.chapter}</p>
              <p className={styles.kicker} data-hero="kicker">Marc&rsquo;s World</p>
              <h1 id="about-title" className={styles.heroTitle}>
                <span data-hero-line="">The person</span>
                <span data-hero-line="">behind the projects</span>
              </h1>
              <p className={styles.lede} data-hero="lede">{aboutIntro.lede}</p>
              <div className={styles.body} data-hero="body">
                {aboutIntro.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <div className={styles.heroActions} data-hero="actions">
                <Link className={styles.primaryAction} href="/projects">
                  <span>See the projects</span>
                  <span aria-hidden="true">↗</span>
                </Link>
                <Link className={styles.secondaryAction} href="/experience">
                  What I&rsquo;ve worked on <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <figure className={styles.heroPhoto}>
              <div className={styles.heroGlow} aria-hidden="true" data-hero="glow" />
              <div className={styles.heroFrame}>
                <Image
                  className={styles.heroImage}
                  src={aboutIntro.photo.src}
                  alt={aboutIntro.photo.alt}
                  width={aboutIntro.photo.width}
                  height={aboutIntro.photo.height}
                  sizes="(max-width: 700px) 70vw, (max-width: 1024px) 50vw, 30vw"
                  priority
                  data-hero="photo"
                />
              </div>
              <figcaption className={styles.heroCaption}>
                <span data-hero="meta">Fig. I</span>
                <span data-hero="meta">{aboutIntro.photo.caption}</span>
              </figcaption>
            </figure>
          </section>

          {/* ---- Outside the Screen ---- */}
          <MirrorDivider text="BEYOND THE SCREEN" />
        </div>

        <PersonalStory />

        <div className={styles.inner}>

          {/* ---- The Process ---- */}
          <MirrorDivider text="TOOLS OF THE TRADE" />

          <section className={styles.section} aria-labelledby="tools-heading">
            <header className={styles.chapterHead}>
              <p className={styles.chapterTag}>The Process</p>
              <h2 id="tools-heading">What I reach for</h2>
              <p>
                Four kinds of work, and the tools each one has needed so far. Open a card to see what&rsquo;s
                in it.
              </p>
            </header>

            <ChakraSkills />
          </section>

          {/* ---- What's Next ---- */}
          <MirrorDivider text="SAY HELLO" />

          <section className={styles.section} aria-labelledby="connect-heading">
            <header className={styles.chapterHead}>
              <p className={styles.chapterTag}>{connect.chapter}</p>
              <h2 id="connect-heading">{connect.heading}</h2>
            </header>

            <div className={styles.connect}>
              <p>{connect.body}</p>
              {publicSocialLinks.length > 0 && (
                <ul className={styles.connectLinks}>
                  {publicSocialLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        className={styles.connectLink}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <SocialIcon icon={link.icon} />
                        <span>
                          {link.label}
                          {link.note && <span className={styles.connectNote}>{link.note}</span>}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </AboutMotion>
    </main>
  );
}
