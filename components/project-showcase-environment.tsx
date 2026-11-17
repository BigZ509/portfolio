"use client";

import { useEffect, useRef, useState } from "react";
import { useSuspendInfiniteVoid } from "./infinite-void/infinite-void-provider";
import styles from "./project-showcase-environment.module.css";

/** Foreground realm exists only while a project dialog is open. */
export function ProjectShowcaseEnvironment() {
  useSuspendInfiniteVoid();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"loading" | "webgl" | "fallback">("loading");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    let renderer: import("./mutual-love/mutual-love-renderer").MutualLoveRenderer | null = null;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => renderer?.setReducedMotion(motion.matches);
    motion.addEventListener("change", onMotionChange);
    import("./mutual-love/mutual-love-renderer")
      .then(({ MutualLoveRenderer }) => {
        if (cancelled) return;
        try {
          const low = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
          renderer = new MutualLoveRenderer(
            canvas, low ? "low" : "high", motion.matches,
            () => { if (!cancelled) setMode("webgl"); },
            () => { if (!cancelled) setMode("fallback"); },
          );
        } catch {
          setMode("fallback");
        }
      })
      .catch(() => { if (!cancelled) setMode("fallback"); });
    return () => {
      cancelled = true;
      motion.removeEventListener("change", onMotionChange);
      renderer?.dispose();
    };
  }, []);

  return (
    <div className={styles.environment} data-realm="mutual-love" data-mode={mode} aria-hidden="true">
      <div className={styles.fallback} />
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.veil} />
    </div>
  );
}
