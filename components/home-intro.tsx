"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { home } from "@/data/home";
import styles from "./home.module.css";

type Phase = "opening" | "reveal" | "ready";

// Client navigation back to Home keeps the completed composition. A fresh load plays the intro.
let introSeenInTab = false;

/** An asymmetric oval with a displaced edge reveals the original city. */
function InkReveal({ register }: { register: (index: number, node: SVGElement | null) => void }) {
  return (
    <svg className={styles.inkReveal} viewBox="0 0 1000 650" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="home-ink-veil" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#050811" stopOpacity=".95" />
          <stop offset=".55" stopColor="#121827" stopOpacity=".9" />
          <stop offset="1" stopColor="#080a14" stopOpacity=".96" />
        </linearGradient>
        <filter id="home-ink-edge" x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency=".018 .027" numOctaves="2" seed="7" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="55" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <mask id="home-ink-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="650">
          <rect width="1000" height="650" fill="white" />
          <ellipse cx="555" cy="285" rx="0" ry="0" fill="black" filter="url(#home-ink-edge)">
            <animate ref={(node) => register(0, node)} attributeName="rx" values="0;80;440;1300" keyTimes="0;.25;.72;1" dur="2.25s" begin="indefinite" fill="freeze" calcMode="spline" keySplines=".2 .7 .2 1;.28 .58 .3 1;.24 .72 .23 1" />
            <animate ref={(node) => register(1, node)} attributeName="ry" values="0;52;300;980" keyTimes="0;.25;.72;1" dur="2.25s" begin="indefinite" fill="freeze" calcMode="spline" keySplines=".2 .7 .2 1;.28 .58 .3 1;.24 .72 .23 1" />
          </ellipse>
        </mask>
      </defs>
      <rect width="1000" height="650" fill="url(#home-ink-veil)" mask="url(#home-ink-mask)" />
    </svg>
  );
}

export function HomeIntro() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>(() => introSeenInTab ? "ready" : "opening");
  const [maskFallback, setMaskFallback] = useState(false);
  const [departing, setDeparting] = useState(false);
  const animations = useRef<(SVGAnimateElement | null)[]>([]);
  const timers = useRef<number[]>([]);
  const animationFrame = useRef(0);
  const registerAnimation = (index: number, node: SVGElement | null) => { animations.current[index] = node as SVGAnimateElement | null; };

  const clearTimers = () => {
    for (const timer of timers.current) window.clearTimeout(timer);
    timers.current = [];
    cancelAnimationFrame(animationFrame.current);
  };

  useEffect(() => {
    if (introSeenInTab) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) {
      timers.current.push(window.setTimeout(() => { introSeenInTab = true; setPhase("ready"); }, 0));
    } else {
      timers.current.push(window.setTimeout(() => {
        const safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const canAnimate = typeof SVGMaskElement !== "undefined" && typeof SVGFEDisplacementMapElement !== "undefined" && animations.current.length === 2 && animations.current.every((node) => typeof node?.beginElement === "function");
        if (safari || !canAnimate) setMaskFallback(true);
        setPhase("reveal");
        if (!safari && canAnimate) {
          animationFrame.current = requestAnimationFrame(() => {
            for (const node of animations.current) node?.beginElement();
          });
          timers.current.push(window.setTimeout(() => {
            const ellipse = animations.current[0]?.targetElement as SVGEllipseElement | null;
            if (!ellipse || ellipse.rx.animVal.value < 30) setMaskFallback(true);
          }, 800));
        }
      }, 120));
      timers.current.push(window.setTimeout(() => { introSeenInTab = true; setPhase("ready"); }, 3200));
    }
    return () => {
      for (const timer of timers.current) window.clearTimeout(timer);
      timers.current = [];
      cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  const skip = () => {
    clearTimers();
    introSeenInTab = true;
    setPhase("ready");
  };

  const leaveForProjects = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.preventDefault();
    if (departing) return;
    clearTimers();
    introSeenInTab = true;
    setPhase("ready");
    setDeparting(true);
    timers.current.push(window.setTimeout(() => router.push("/projects"), 620));
  };

  const portrait = home.portrait;

  return (
    <div className={styles.homeContent} data-phase={phase} data-departing={departing} data-mask-fallback={maskFallback}>
      <div className={styles.introInk} aria-hidden="true"><InkReveal register={registerAnimation} /><div className={styles.introMist} /></div>
      {phase !== "ready" && <button className={styles.skip} onClick={skip}>Skip intro <span aria-hidden="true">↗</span></button>}
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.copy}>
          <p className={styles.eyebrow}><span className={styles.eyebrowLine} />{home.disciplines.join(" / ")}</p>
          <h1 id="home-title" className={styles.title}><span>MARC&rsquo;S</span><span>WORLD</span></h1>
          {home.ownerName && <p className={styles.ownerName}>By {home.ownerName}</p>}
          <p className={styles.lede}>{home.statement}</p>
          <div className={styles.actions}>
            <Link className={styles.primaryAction} href="/projects" onClick={leaveForProjects}><span>Explore Projects</span><span aria-hidden="true">↗</span></Link>
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
      <div className={styles.departureFog} aria-hidden="true" />
    </div>
  );
}
