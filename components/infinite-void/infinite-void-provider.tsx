"use client";

/*
 * React host for the Infinite Void background.
 *
 * One renderer for the whole site, mounted once in the root layout and kept alive across client
 * navigation, so moving between pages never tears down and rebuilds a WebGL context. Pages opt in
 * by rendering <AtmosphericBackground />, which registers here; with no registrant (the homepage,
 * which has its own city scene) the renderer is paused and the layer fades out.
 *
 * Three.js and the scene are loaded with a dynamic import the first time a page asks for them, so
 * routes that never show the void never download it. All animation runs outside React: nothing in
 * the render loop sets state, and the layer's mode/visibility are written to the DOM directly.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { VoidRenderer } from "./void-renderer";
import styles from "./infinite-void.module.css";

type Registry = { register: () => () => void; suspend: () => () => void };

const InfiniteVoidContext = createContext<Registry>({ register: () => () => {}, suspend: () => () => {} });

/** Ask for the Infinite Void behind the current page for as long as the caller is mounted. */
export function useInfiniteVoid() {
  const { register } = useContext(InfiniteVoidContext);
  useEffect(() => register(), [register]);
}

/** Pause the shared page backdrop while a foreground WebGL realm owns the screen. */
export function useSuspendInfiniteVoid() {
  const { suspend } = useContext(InfiniteVoidContext);
  useEffect(() => suspend(), [suspend]);
}

// One shared import, so repeated or StrictMode-doubled effect runs never fetch the module twice.
let rendererModule: Promise<typeof import("./void-renderer")> | null = null;
const loadRenderer = () => (rendererModule ??= import("./void-renderer"));

function pickQuality(): "high" | "low" {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  return coarse || narrow || cores <= 4 || memory <= 4 ? "low" : "high";
}

function supportsWebGL() {
  try {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") ?? probe.getContext("webgl");
    // Release the probe's context straight away rather than leaving it for GC.
    (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

const reducedMotionQuery = () => window.matchMedia("(prefers-reduced-motion: reduce)");

export function InfiniteVoidProvider({ children }: { children: ReactNode }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<VoidRenderer | null>(null);
  const [requests, setRequests] = useState(0);
  const [suspensions, setSuspensions] = useState(0);

  const register = useCallback(() => {
    setRequests((count) => count + 1);
    return () => setRequests((count) => count - 1);
  }, []);
  const suspend = useCallback(() => {
    setSuspensions((count) => count + 1);
    return () => setSuspensions((count) => count - 1);
  }, []);
  const registry = useMemo(() => ({ register, suspend }), [register, suspend]);
  const active = requests > 0 && suspensions === 0;

  useEffect(() => {
    const layer = layerRef.current;
    const canvas = canvasRef.current;
    if (!layer || !canvas) return;
    const setVisible = (visible: boolean) => { layer.dataset.visible = String(visible); };
    const fallBack = () => { layer.dataset.mode = "fallback"; setVisible(true); };

    if (!active) {
      rendererRef.current?.setActive(false);
      setVisible(false);
      return;
    }
    if (layer.dataset.mode === "fallback") {
      setVisible(true);
      return;
    }
    if (rendererRef.current) {
      rendererRef.current.setActive(true);
      setVisible(true);
      return;
    }
    if (!supportsWebGL()) {
      fallBack();
      return;
    }

    let cancelled = false;
    loadRenderer()
      .then(({ VoidRenderer }) => {
        // A later run (StrictMode, or a fast navigation) owns creation if this one was cancelled.
        if (cancelled || rendererRef.current) return;
        try {
          const renderer = new VoidRenderer(canvas, {
            quality: pickQuality(),
            reducedMotion: reducedMotionQuery().matches,
            onFirstFrame: () => setVisible(true),
            onContextLost: fallBack,
          });
          rendererRef.current = renderer;
          layer.dataset.mode = "webgl";
          renderer.setActive(true);
        } catch {
          fallBack();
        }
      })
      .catch(() => {
        if (!cancelled) fallBack();
      });

    return () => {
      cancelled = true;
    };
  }, [active]);

  // Follow changes to the reduced-motion preference live.
  useEffect(() => {
    const query = reducedMotionQuery();
    const onChange = () => rendererRef.current?.setReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Full teardown when the layout itself unmounts.
  useEffect(() => () => {
    rendererRef.current?.dispose();
    rendererRef.current = null;
  }, []);

  return (
    <InfiniteVoidContext.Provider value={registry}>
      <div ref={layerRef} className={styles.layer} data-mode="idle" data-visible="false" aria-hidden="true">
        <canvas ref={canvasRef} className={styles.canvas} />
        <div className={styles.fallback} />
      </div>
      {children}
    </InfiniteVoidContext.Provider>
  );
}
