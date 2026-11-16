"use client";

import { useEffect, useRef } from "react";
import { HomeScene } from "./home-scene";
import styles from "./home.module.css";

/** Gives each drawn city plane its own small camera offset. The drawing itself stays still. */
export function HomeEnvironment() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    const layers = [...element.querySelectorAll<HTMLElement>("[data-depth]")];
    const clockHands = [...element.querySelectorAll<SVGLineElement>("[data-clock-hand]")];
    let frame = 0;
    let scrollFrame = 0;
    let visible = true;

    const setClock = () => {
      const now = new Date();
      const hours = now.getHours() % 12;
      const minutes = now.getMinutes();
      clockHands.find((hand) => hand.dataset.clockHand === "hour")?.setAttribute("transform", `rotate(${hours * 30 + minutes / 2})`);
      clockHands.find((hand) => hand.dataset.clockHand === "minute")?.setAttribute("transform", `rotate(${minutes * 6})`);
    };
    setClock();
    const clockInterval = window.setInterval(setClock, 60_000);

    const reset = () => {
      for (const layer of layers) layer.style.transform = "";
    };
    const move = (event: PointerEvent) => {
      if (!visible || motion.matches || !finePointer.matches || event.pointerType !== "mouse") return;
      const intro = element.parentElement?.querySelector<HTMLElement>("[data-phase]");
      if (intro?.dataset.phase !== "ready" || intro.dataset.departing === "true") return;
      const bounds = element.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width * 2 - 1;
      const y = (event.clientY - bounds.top) / bounds.height * 2 - 1;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        for (const layer of layers) {
          const depth = Number(layer.dataset.depth) || 0;
          layer.style.transform = `translate3d(${(-x * depth).toFixed(2)}px, ${(-y * depth * 0.55).toFixed(2)}px, 0)`;
        }
      });
    };
    const refresh = () => {
      visible = !document.hidden && element.getBoundingClientRect().bottom > 0 && element.getBoundingClientRect().top < window.innerHeight;
      element.dataset.paused = visible && !motion.matches ? "false" : "true";
      if (!visible || motion.matches || !finePointer.matches) reset();
    };
    const observer = new IntersectionObserver(refresh);
    observer.observe(element);
    const onScroll = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        refresh();
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", reset);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", refresh);
    motion.addEventListener("change", refresh);
    finePointer.addEventListener("change", refresh);
    refresh();
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(scrollFrame);
      clearInterval(clockInterval);
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", reset);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", refresh);
      motion.removeEventListener("change", refresh);
      finePointer.removeEventListener("change", refresh);
      reset();
    };
  }, []);

  return <div ref={root} className={styles.environment}><HomeScene /></div>;
}
