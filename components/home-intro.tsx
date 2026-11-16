"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { home } from "@/data/home";
import styles from "./home.module.css";

type Phase = "opening" | "reveal" | "ready";

export function HomeIntro() {
  const [phase, setPhase] = useState<Phase>("opening");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const immediate = window.setTimeout(() => setPhase("ready"), 0);
      return () => clearTimeout(immediate);
    }
    const reveal = window.setTimeout(() => setPhase("reveal"), 100);
    const finish = window.setTimeout(() => setPhase("ready"), 3000);
    return () => { clearTimeout(reveal); clearTimeout(finish); };
  }, []);

  const skip = () => setPhase("ready");
  const portrait = home.portrait;

  return (
    <div className={styles.homeContent} data-phase={phase}>
      <div className={styles.introCurtain} aria-hidden="true">
        <div className={styles.curtainLeft} /><div className={styles.curtainRight} />
        <div className={styles.curtainSigil}>✦</div>
      </div>
      {phase !== "ready" && <button className={styles.skip} onClick={skip}>Skip intro <span aria-hidden="true">↗</span></button>}
      <div className={styles.edition} aria-hidden="true"><span>AF / 001</span><span>THE CITY AFTER DARK</span></div>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.copy}>
          <p className={styles.eyebrow}><span className={styles.eyebrowLine} /> An engineer between worlds <span className={styles.eyebrowLine} /></p>
          <h1 id="home-title" className={styles.title}><span>AFTER</span><span>IMAGE</span></h1>
          <p className={styles.lede}>Building what comes next from the worlds of <em>software, AI, and robotics.</em></p>
          <p className={styles.statement}>{home.statement}</p>
          <div className={styles.actions}>
            <Link className={styles.primaryAction} href="/projects"><span>Explore Projects</span><span aria-hidden="true">↗</span></Link>
            <Link className={styles.secondaryAction} href="/about">About Me <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        {portrait && <figure className={styles.portrait}>
          <div className={styles.portraitCrown} aria-hidden="true">✧ <span>PORTRAIT / 01</span> ✧</div>
          <div className={styles.portraitFrame}>
            <Image src={portrait.src} alt={portrait.alt} width={portrait.width} height={portrait.height} priority sizes="(max-width: 700px) 53vw, 28vw" className={styles.portraitImage} />
          </div>
          <figcaption><span>FIG. I</span><span>{portrait.caption}</span></figcaption>
        </figure>}
      </section>
      <div className={styles.footerRule} aria-hidden="true"><span>EST. IN CURIOSITY</span><span className={styles.footStar}>✦</span><span>SCROLL TO EXPLORE</span></div>
      <section className={styles.fieldNote} aria-labelledby="field-note-title">
        <div className={styles.fieldNoteCopy}>
          <p className={styles.fieldLabel}>FROM THE FIELD / 02</p>
          <h2 id="field-note-title">Ideas are meant to leave the page.</h2>
          <p>From hands-on workshops to ambitious prototypes, I work where technical curiosity becomes something people can use.</p>
          <Link href="/experience">Explore my experience <span aria-hidden="true">↗</span></Link>
        </div>
        <figure className={styles.fieldImage}>
          <Image src="/images/home/workshop-ctoc.webp" alt="A student-led cybersecurity workshop with diagrams shown across two presentation screens." width={1152} height={1536} sizes="(max-width: 700px) 85vw, 30vw" />
          <figcaption>A workshop in progress</figcaption>
        </figure>
      </section>
    </div>
  );
}
