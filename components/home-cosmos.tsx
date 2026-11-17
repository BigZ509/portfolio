"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./home-cosmos.module.css";

/** One local instance of the existing Void renderer, active only while this section is visible. */
export function HomeCosmos() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"loading" | "webgl" | "fallback">("loading");

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    let cancelled = false;
    let loading = false;
    let inView = false;
    let renderer: import("./infinite-void/void-renderer").VoidRenderer | null = null;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => renderer?.setReducedMotion(motion.matches);
    motion.addEventListener("change", onMotionChange);

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (!entry.isIntersecting) {
        renderer?.setActive(false);
        return;
      }
      if (renderer) { renderer.setActive(true); return; }
      if (loading) return;
      loading = true;
      import("./infinite-void/void-renderer")
        .then(({ VoidRenderer }) => {
          if (cancelled) return;
          try {
            const low = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
            renderer = new VoidRenderer(canvas, {
              quality: low ? "low" : "high",
              reducedMotion: motion.matches,
              framing: {
                landscape: { x: -0.34, y: 0.08 },
                portrait: { x: 0.48, y: -0.18 },
              },
              onFirstFrame: () => { if (!cancelled) setMode("webgl"); },
              onContextLost: () => { if (!cancelled) setMode("fallback"); },
            });
            renderer.setActive(inView);
          } catch {
            setMode("fallback");
          }
        })
        .catch(() => { if (!cancelled) setMode("fallback"); });
    }, { threshold: 0.05 });
    observer.observe(root);

    return () => {
      cancelled = true;
      observer.disconnect();
      motion.removeEventListener("change", onMotionChange);
      renderer?.dispose();
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.cosmos} data-home-cosmos={mode} aria-hidden="true">
      <div className={styles.fallback} />
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.veil} />
    </div>
  );
}
