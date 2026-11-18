"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import * as THREE from "three";
import type { Project } from "@/data/projects";
import { clamp, isEditableTarget, isLikelyTrackpad, normalizeWheelDelta, visibleHeightRatio } from "./carousel-input";
import { ProjectDetails } from "./project-details";
import { ProjectMediaProvider } from "./project-media";
import { ProjectMediaGallery } from "./project-media-gallery";
import { ProjectShowcaseEnvironment } from "./project-showcase-environment";
import { createSelectionGlowTexture } from "./selection-glow-texture";
import { loadTarotArtwork } from "./tarot-artwork-loader";
import { TarotCard } from "./tarot-card";
import { createTarotCardTexture } from "./tarot-card-texture";
import styles from "./project-carousel.module.css";

export interface CarouselConfig {
  cardWidth: number;
  cardHeight: number;
  angularSpacing: number;
  curveRadius: number;
  cameraFov: number;
  cameraDistance: number;
  mobileCameraDistance: number;
  /** Signed idle drift in radians per second (positive drifts cards to the right). */
  idleSpeed: number;
  maxPixelRatio: number;

  /** Milliseconds of inactivity before idle drift resumes. */
  idleResumeDelay: number;
  /** Seconds (time constant) for velocity to ease back into idle drift. */
  idleRampTime: number;
  /** Velocity retained per 60 Hz frame while coasting (0–1). Scaled by real frame time. */
  friction: number;
  /** Velocity below this (rad/s) is treated as stopped. */
  minVelocity: number;
  /** Hard cap on carousel velocity in radians per second. */
  maxVelocity: number;

  /** Velocity impulse (rad/s) added per normalized wheel pixel. */
  wheelImpulse: number;
  /** Per-event clamp on normalized wheel pixels, limits huge single deltas. */
  wheelMaxDelta: number;
  /** Multiplier applied to impulses from trackpad-like wheel streams. */
  trackpadDamping: number;
  /** Pixel-mode deltas below this magnitude are treated as trackpad input. */
  wheelNotchThreshold: number;
  /** Pixels per line for deltaMode = DOM_DELTA_LINE. */
  wheelLineHeight: number;
  /** Whether vertical-dominant wheel input may rotate the carousel. */
  wheelCapturesVertical: boolean;
  /** Minimum visible fraction of the viewport before vertical wheel input is captured. */
  wheelCaptureVisibility: number;
  /** Milliseconds without wheel events that begin a new wheel gesture. */
  wheelGestureGap: number;

  /** 1 = the card under the pointer tracks the pointer near the center of the arc. */
  dragSensitivity: number;
  /** Pixels of movement before a pointer press becomes a horizontal drag. */
  dragThreshold: number;
  /** Multiplier applied to release velocity for post-drag momentum. */
  dragMomentum: number;
  /** Release samples older than this (ms) are ignored when measuring fling velocity. */
  dragVelocityWindow: number;

  /** Exponential approach rate (1/s) for keyboard/button steps and selection centering. */
  stepEaseRate: number;

  /** Phase error (radians) under which a clicked card counts as already centered. */
  centeredTolerance: number;
  /** Size of the selection halo plane relative to the card. */
  selectionGlowScale: number;
  /** Peak opacity of the selection halo. */
  selectionGlowOpacity: number;
  /** Seconds for the selection halo to fade in or out. */
  selectionFadeTime: number;

  /** Seconds for the selected card to fly forward into (or back out of) the expanded pose. */
  expandDuration: number;
  /** Fraction of the free stage area the expanded card's height (or width) fills. */
  expandFill: number;
  /** How much the other cards darken while a card is expanded (0–1). */
  expandDim: number;
  /** Peak y-rotation (radians) of the card's swing during the expand/collapse flight. */
  expandSwing: number;

  /** Lower/upper bounds (px) for card texture height; width follows 2:3. */
  textureMinHeight: number;
  textureMaxHeight: number;
}

export const DEFAULT_CAROUSEL_CONFIG: CarouselConfig = {
  cardWidth: 2.4,
  cardHeight: 3.6,
  angularSpacing: 0.5,
  curveRadius: 5.6,
  cameraFov: 45,
  cameraDistance: 8.4,
  mobileCameraDistance: 6.8,
  idleSpeed: 0.11,
  maxPixelRatio: 1.75,

  idleResumeDelay: 2000,
  idleRampTime: 0.8,
  friction: 0.93,
  minVelocity: 0.002,
  maxVelocity: 3,

  wheelImpulse: 0.014,
  wheelMaxDelta: 120,
  trackpadDamping: 0.35,
  wheelNotchThreshold: 50,
  wheelLineHeight: 16,
  wheelCapturesVertical: true,
  wheelCaptureVisibility: 0.85,
  wheelGestureGap: 220,

  dragSensitivity: 1,
  dragThreshold: 8,
  dragMomentum: 0.9,
  dragVelocityWindow: 100,

  stepEaseRate: 9,

  centeredTolerance: 0.002,
  selectionGlowScale: 1.16,
  selectionGlowOpacity: 0.9,
  selectionFadeTime: 0.25,

  expandDuration: 0.75,
  expandFill: 0.84,
  expandDim: 0.72,
  expandSwing: 0.22,

  textureMinHeight: 900,
  textureMaxHeight: 1536,
};

type ProjectCarouselProps = {
  projects: readonly Project[];
  config?: CarouselConfig;
};

type CarouselControls = {
  step: (direction: 1 | -1) => void;
  select: (index: number) => void;
  deselect: () => void;
  /** Flies card `index` into the free area of `stage` (null collapses it back). */
  setExpanded: (index: number | null, stage: HTMLElement | null) => void;
};

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

/**
 * `pendingId` is a card rotating toward center; it becomes `selectedId` once centered.
 * Expansion is a separate state (`expandedId` in the component) layered on a selection.
 */
type SelectionState = { selectedId: number | null; pendingId: number | null };

const NO_SELECTION: SelectionState = { selectedId: null, pendingId: null };

type PointerSample = { time: number; x: number };

const selectedMessage = (project: Project) => `Selected ${project.tarotIdentity}: ${project.title}`;
const CLEARED_MESSAGE = "Selection cleared";

export function ProjectCarousel({ projects, config = DEFAULT_CAROUSEL_CONFIG }: ProjectCarouselProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<CarouselControls | null>(null);
  const deselectButtonRef = useRef<HTMLButtonElement>(null);
  const projectControlRefs = useRef(new Map<number, HTMLButtonElement>());
  const [availability, setAvailability] = useState<"ready" | "fallback">("fallback");
  const [announcement, setAnnouncement] = useState("");
  const [selection, setSelection] = useState<SelectionState>(NO_SELECTION);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageTargetRef = useRef<HTMLDivElement>(null);
  const instructionsId = useId();
  const dialogTitleId = useId();
  const dialogSummaryId = useId();

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!section || !container || !canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      const context = canvas.getContext("webgl2", { alpha: true }) ?? canvas.getContext("webgl", { alpha: true });
      if (!context) {
        return;
      }
      renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(config.cameraFov, 1, 0.1, 40);
    const geometry = new THREE.PlaneGeometry(config.cardWidth, config.cardHeight);
    const textures: THREE.CanvasTexture[] = [];
    const materials: THREE.MeshBasicMaterial[] = [];
    const cards: THREE.Mesh[] = [];
    const glowGeometry = new THREE.PlaneGeometry(
      config.cardWidth * config.selectionGlowScale,
      config.cardHeight * config.selectionGlowScale,
    );
    let glowMaterial: THREE.MeshBasicMaterial;
    let glow: THREE.Mesh;

    // Texture resolution: enough for the card at its expanded (largest) on-screen size, so it stays
    // sharp mid-flight, but clamped to bound GPU memory (~3.3 MB per card at 960 px with mipmaps).
    // The viewport is still hidden here, so its CSS height (70vh, max 44rem) is estimated.
    const effectivePixelRatio = Math.min(window.devicePixelRatio || 1, config.maxPixelRatio);
    const expandedCardPixels = Math.min(window.innerHeight * 0.7, 44 * 16) * config.expandFill * effectivePixelRatio;
    const textureHeight = clamp(
      Math.ceil(expandedCardPixels / 64) * 64,
      config.textureMinHeight,
      Math.min(config.textureMaxHeight, renderer.capabilities.maxTextureSize),
    );
    const anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);

    try {
      for (const project of projects) {
        const texture = createTarotCardTexture(project, { height: textureHeight });
        texture.anisotropy = anisotropy;
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);
        textures.push(texture);
        materials.push(material);
        cards.push(mesh);
        scene.add(mesh);
      }
      // One shared halo, re-parented to whichever card is selected. It sits just behind the card.
      const glowTexture = createSelectionGlowTexture(config.cardWidth, config.cardHeight, config.selectionGlowScale);
      textures.push(glowTexture);
      glowMaterial = new THREE.MeshBasicMaterial({
        map: glowTexture,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      materials.push(glowMaterial);
      glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.z = -0.02;
      glow.visible = false;
    } catch {
      textures.forEach((texture) => texture.dispose());
      materials.forEach((material) => material.dispose());
      geometry.dispose();
      glowGeometry.dispose();
      renderer.dispose();
      return;
    }
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionPreference.matches;
    let pageVisible = !document.hidden;
    let inView = false;
    let frameId: number | null = null;
    let lastFrameTime = 0;
    let contextLost = false;
    const spacing = config.angularSpacing;
    const span = projects.length * spacing;
    const centerOffset = (projects.length - 1) / 2;
    // Phases that center a card: integer multiples of spacing, shifted by half a step for even counts.
    const alignOffset = (centerOffset % 1) * spacing;
    // Total distance a velocity impulse coasts under friction (used for the reduced-motion direct path).
    const coastDistancePerVelocity = config.friction < 1 ? config.friction / (1 - config.friction) / 60 : 1;

    // Motion state. Positive phase velocity moves cards to the right.
    let phase = 0;
    let velocity = reducedMotion ? 0 : config.idleSpeed;
    let idleActive = !reducedMotion;
    let stepTarget: number | null = null;
    let resumeTimer: number | null = null;

    // Selection state (indices into `projects`). See SelectionState.
    let selectedIndex: number | null = null;
    let pendingIndex: number | null = null;
    let openAfterCommit = false;
    let glowLevel = 0;

    // Expansion state. `expandIndex` outlives `expanded` until the collapse flight finishes.
    let expanded = false;
    let expandIndex: number | null = null;
    let expandLevel = 0;
    let expandStage: HTMLElement | null = null;
    let expandTarget: { x: number; y: number; z: number } | null = null;

    // Wheel gesture state.
    let lastWheelTime = -Infinity;
    let wheelGesture: "carousel" | "page" = "carousel";

    // Pointer drag state.
    let pointerId: number | null = null;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerLastX = 0;
    let dragging = false;
    let samples: PointerSample[] = [];

    const stop = () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = null;
      lastFrameTime = 0;
    };

    const canRender = () => pageVisible && inView && !contextLost;

    const hasSelection = () => selectedIndex !== null || pendingIndex !== null;
    const glowGoal = () => (selectedIndex !== null ? 1 : 0);

    const expandGoal = () => (expanded ? 1 : 0);

    const isAnimating = () =>
      stepTarget !== null ||
      velocity !== 0 ||
      glowLevel !== glowGoal() ||
      expandLevel !== expandGoal() ||
      (idleActive && !reducedMotion);

    /**
     * World position that puts the card's center in the middle of the free stage area
     * (stage ∩ canvas, in screen space) at a depth where its height fills `expandFill` of it.
     * The card only moves closer to the camera, so its texture is never scaled.
     */
    const computeExpandTarget = () => {
      const view = container.getBoundingClientRect();
      if (view.width === 0 || view.height === 0) return null;
      let left = view.left, top = view.top, right = view.right, bottom = view.bottom;
      const stage = expandStage?.getBoundingClientRect();
      if (stage && stage.width > 0 && stage.height > 0) {
        left = Math.max(left, stage.left);
        top = Math.max(top, stage.top);
        right = Math.min(right, stage.right);
        bottom = Math.min(bottom, stage.bottom);
      }
      if (right - left < 40 || bottom - top < 40) {
        ({ left, top, right, bottom } = view);
      }
      const aspect = config.cardHeight / config.cardWidth;
      const heightPx = Math.min((bottom - top) * config.expandFill, (right - left) * config.expandFill * aspect);
      const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const distance = Math.max(config.cardHeight / (2 * tanHalf * (heightPx / view.height)), 1.2);
      const ndcX = (((left + right) / 2 - view.left) / view.width) * 2 - 1;
      const ndcY = -((((top + bottom) / 2 - view.top) / view.height) * 2 - 1);
      return {
        x: ndcX * distance * tanHalf * camera.aspect,
        y: ndcY * distance * tanHalf,
        z: camera.position.z - distance,
      };
    };

    const wrapPhase = () => {
      if (span <= 0 || Math.abs(phase) < span) return;
      const shift = Math.trunc(phase / span) * span;
      phase -= shift;
      if (stepTarget !== null) stepTarget -= shift;
    };

    const positionCards = () => {
      // While expanded, the target tracks the live stage layout (resize); during collapse the
      // dialog is gone, so the last target is reused and the card flies back from where it was.
      if (expanded) expandTarget = computeExpandTarget() ?? expandTarget;
      const eased = easeInOutCubic(expandLevel);
      cards.forEach((card, index) => {
        const rawAngle = (index - centerOffset) * spacing + phase;
        const angle = ((rawAngle + span / 2) % span + span) % span - span / 2;
        const x = Math.sin(angle) * config.curveRadius;
        const z = (Math.cos(angle) - 1) * config.curveRadius;
        const rotation = -angle * 0.5;
        if (index === expandIndex && expandTarget && expandLevel > 0) {
          // Fly forward from the card's actual carousel pose, with a slight swing mid-flight.
          card.position.set(lerp(x, expandTarget.x, eased), lerp(0, expandTarget.y, eased), lerp(z, expandTarget.z, eased));
          card.rotation.y = lerp(rotation, 0, eased) + Math.sin(Math.PI * eased) * config.expandSwing;
        } else {
          card.position.set(x, 0, z);
          card.rotation.y = rotation;
        }
        const dim = expandIndex !== null && index !== expandIndex ? 1 - config.expandDim * eased : 1;
        materials[index].color.setScalar(dim);
      });
    };

    const updateGlow = (delta: number) => {
      const goal = glowGoal();
      if (glowLevel !== goal) {
        const amount = reducedMotion || config.selectionFadeTime <= 0 ? 1 : delta / config.selectionFadeTime;
        glowLevel = goal > glowLevel ? Math.min(goal, glowLevel + amount) : Math.max(goal, glowLevel - amount);
      }
      glowMaterial.opacity = glowLevel * config.selectionGlowOpacity;
      glow.visible = glowLevel > 0 && glow.parent !== null;
    };

    const updateExpansion = (delta: number) => {
      const goal = expandGoal();
      if (expandLevel !== goal) {
        const amount = reducedMotion || config.expandDuration <= 0 ? 1 : delta / config.expandDuration;
        expandLevel = goal > expandLevel ? Math.min(goal, expandLevel + amount) : Math.max(goal, expandLevel - amount);
      }
      if (!expanded && expandLevel === 0) {
        expandIndex = null;
        expandTarget = null;
      }
    };

    const advance = (delta: number) => {
      updateGlow(delta);
      updateExpansion(delta);
      if (dragging) {
        velocity = 0;
        return;
      }
      if (stepTarget !== null) {
        const remaining = stepTarget - phase;
        if (reducedMotion || Math.abs(remaining) < 1e-4) {
          phase = stepTarget;
          stepTarget = null;
          commitPending();
        } else {
          phase += remaining * (1 - Math.exp(-config.stepEaseRate * delta));
        }
        velocity = 0;
      } else if (idleActive && !reducedMotion) {
        velocity += (config.idleSpeed - velocity) * (1 - Math.exp(-delta / config.idleRampTime));
        phase += velocity * delta;
      } else if (velocity !== 0) {
        velocity *= Math.pow(config.friction, delta * 60);
        if (Math.abs(velocity) < config.minVelocity) velocity = 0;
        phase += velocity * delta;
      }
      wrapPhase();
    };

    const renderFrame = (time: number) => {
      frameId = null;
      if (!canRender()) return;
      const delta = lastFrameTime ? Math.min((time - lastFrameTime) / 1000, 0.05) : 0;
      lastFrameTime = time;
      advance(delta);
      positionCards();
      renderer.render(scene, camera);
      if (isAnimating()) frameId = requestAnimationFrame(renderFrame);
      else lastFrameTime = 0;
    };

    const requestRender = () => {
      if (canRender() && frameId === null) frameId = requestAnimationFrame(renderFrame);
    };

    // --- Idle lifecycle -------------------------------------------------------

    const clearResumeTimer = () => {
      if (resumeTimer !== null) window.clearTimeout(resumeTimer);
      resumeTimer = null;
    };

    const pauseIdle = () => {
      idleActive = false;
      clearResumeTimer();
    };

    const scheduleIdleResume = () => {
      clearResumeTimer();
      // A selected (or centering) card holds the carousel still until it is deselected.
      if (reducedMotion || hasSelection() || expanded) return;
      resumeTimer = window.setTimeout(() => {
        resumeTimer = null;
        if (dragging || reducedMotion || hasSelection()) return;
        idleActive = true;
        requestRender();
      }, config.idleResumeDelay);
    };

    // --- Selection ------------------------------------------------------------

    const publishSelection = () => {
      setSelection({
        selectedId: selectedIndex !== null ? projects[selectedIndex].id : null,
        pendingId: pendingIndex !== null ? projects[pendingIndex].id : null,
      });
    };

    /** Called when a centering move finishes (or immediately if no move is needed). */
    function commitPending() {
      if (pendingIndex === null) return;
      selectedIndex = pendingIndex;
      pendingIndex = null;
      const card = cards[selectedIndex];
      if (glow.parent !== card) {
        card.add(glow);
        glowLevel = 0;
      }
      publishSelection();
      setAnnouncement(selectedMessage(projects[selectedIndex]));
      // One activation: once the chosen card has finished centering, open its showcase.
      if (openAfterCommit) {
        openAfterCommit = false;
        setExpandedId(projects[selectedIndex].id);
      }
    }

    /** Releases any selection without moving the carousel. Returns whether one existed. */
    const clearSelection = () => {
      openAfterCommit = false; // Navigating away during centering cancels the pending open.
      if (!hasSelection()) return false;
      if (pendingIndex !== null) stepTarget = null; // Stop a centering move where it is.
      selectedIndex = null;
      pendingIndex = null;
      publishSelection();
      return true;
    };

    // Phase that centers card `index`, choosing the wrap that is the shortest rotation away.
    const centeredPhaseFor = (index: number) => {
      const base = (centerOffset - index) * spacing;
      return span > 0 ? base + Math.round((phase - base) / span) * span : base;
    };

    const select = (index: number) => {
      const project = projects[index];
      if (!project || !cards[index] || expanded) return;
      if (selectedIndex === index && stepTarget === null) {
        // Already selected and centered: open immediately, without extra movement.
        setExpandedId(project.id);
        return;
      }
      pauseIdle();
      velocity = 0;
      selectedIndex = null; // A previous selection releases now; its halo fades while the new card centers.
      pendingIndex = index;
      openAfterCommit = true;
      const target = centeredPhaseFor(index);
      if (reducedMotion || Math.abs(target - phase) <= config.centeredTolerance) {
        phase = target;
        stepTarget = null;
        wrapPhase();
        commitPending();
      } else {
        stepTarget = target;
        publishSelection();
      }
      requestRender();
    };

    const setExpanded = (index: number | null, stage: HTMLElement | null) => {
      if (index !== null && cards[index]) {
        if (dragging || pointerId !== null) endDrag(false, performance.now());
        expanded = true;
        expandIndex = index;
        expandStage = stage;
        pauseIdle();
        velocity = 0;
      } else {
        // Collapse: the card flies back; selection (and the idle pause) stays until deselected.
        expanded = false;
        expandStage = null;
        scheduleIdleResume();
      }
      requestRender();
    };

    const deselect = () => {
      if (expanded || !clearSelection()) return;
      setAnnouncement(CLEARED_MESSAGE);
      scheduleIdleResume();
      requestRender();
    };

    /** Rotating the carousel by any other means releases the selection first. */
    const releaseSelectionForNavigation = () => {
      if (clearSelection()) setAnnouncement(CLEARED_MESSAGE);
    };

    const pickCard = (clientX: number, clientY: number): number | null => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;
      pointerNdc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(pointerNdc, camera);
      // Non-recursive: the halo child is never pickable. Hits are sorted nearest first,
      // so where cards overlap the visible (front) card wins.
      const hit = raycaster.intersectObjects(cards, false)[0];
      if (!hit) return null;
      const index = cards.indexOf(hit.object as THREE.Mesh);
      return index >= 0 ? index : null;
    };

    const applyVelocityImpulse = (impulse: number) => {
      releaseSelectionForNavigation();
      pauseIdle();
      stepTarget = null;
      const limited = clamp(impulse, -config.maxVelocity, config.maxVelocity);
      if (reducedMotion) {
        // No inertia: move the distance the impulse would have coasted, immediately.
        phase += limited * coastDistancePerVelocity;
        velocity = 0;
        wrapPhase();
      } else {
        velocity = clamp(velocity + limited, -config.maxVelocity, config.maxVelocity);
      }
      scheduleIdleResume();
      requestRender();
    };

    // Screen-space pixels → radians so the dragged card stays under the pointer near the center.
    const radiansPerPixel = () => {
      const width = container.clientWidth;
      if (width === 0) return 0;
      const visibleWorldWidth = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
      return (visibleWorldWidth / width / config.curveRadius) * config.dragSensitivity;
    };

    // --- Keyboard and button steps -------------------------------------------

    const nearestAligned = (value: number) => Math.round((value - alignOffset) / spacing) * spacing + alignOffset;

    const centeredIndex = (value: number) => {
      const count = projects.length;
      const index = Math.round(centerOffset - value / spacing);
      return ((index % count) + count) % count;
    };

    const step = (direction: 1 | -1) => {
      if (projects.length === 0 || spacing <= 0 || expanded) return;
      clearSelection(); // Stepping away releases the selection; the new card is announced below.
      pauseIdle();
      velocity = 0;
      // Allow presses to queue at most two cards ahead of the current position.
      if (stepTarget === null || Math.abs(stepTarget - phase) < spacing * 2) {
        const base = stepTarget ?? nearestAligned(phase);
        stepTarget = base - direction * spacing;
      }
      const project = projects[centeredIndex(stepTarget ?? phase)];
      if (project) setAnnouncement(`${project.tarotIdentity}: ${project.title}`);
      scheduleIdleResume();
      requestRender();
    };
    controlsRef.current = { step, select, deselect, setExpanded };

    // --- Wheel and trackpad ---------------------------------------------------

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || expanded) return; // Pinch-zoom gesture: leave to the browser. Expanded: carousel is frozen.
      const now = performance.now();
      const sinceLast = now - lastWheelTime;
      lastWheelTime = now;

      const deltaX = normalizeWheelDelta(event.deltaX, event.deltaMode, config.wheelLineHeight, container.clientWidth);
      const deltaY = normalizeWheelDelta(event.deltaY, event.deltaMode, config.wheelLineHeight, container.clientHeight);
      const horizontal = Math.abs(deltaX) > Math.abs(deltaY);

      // Decide ownership once per gesture so a scroll that brings the carousel into view
      // keeps scrolling the page instead of being captured mid-gesture.
      if (sinceLast > config.wheelGestureGap) {
        const captureVertical = config.wheelCapturesVertical && visibleHeightRatio(container) >= config.wheelCaptureVisibility;
        wheelGesture = horizontal || captureVertical ? "carousel" : "page";
      }
      if (wheelGesture === "page") return;

      event.preventDefault();
      const dominant = clamp(horizontal ? deltaX : deltaY, -config.wheelMaxDelta, config.wheelMaxDelta);
      if (dominant === 0) return;
      const damping = isLikelyTrackpad(dominant, event.deltaMode, sinceLast, config.wheelNotchThreshold) ? config.trackpadDamping : 1;
      // Scrolling down/right advances to the next card, which moves cards left (negative phase).
      applyVelocityImpulse(-dominant * config.wheelImpulse * damping);
    };

    // --- Pointer drag (mouse, pen, touch) -------------------------------------

    const endDrag = (withMomentum: boolean, releaseTime: number) => {
      const activePointer = pointerId;
      const wasDragging = dragging;
      pointerId = null;
      dragging = false;
      delete container.dataset.dragging;
      if (activePointer !== null && container.hasPointerCapture(activePointer)) {
        container.releasePointerCapture(activePointer);
      }
      if (!wasDragging) {
        samples = [];
        return;
      }

      let releaseVelocity = 0;
      const recent = samples.filter((sample) => releaseTime - sample.time <= config.dragVelocityWindow);
      if (withMomentum && !reducedMotion && recent.length >= 2) {
        const first = recent[0];
        const last = recent[recent.length - 1];
        const elapsed = (last.time - first.time) / 1000;
        if (elapsed > 0.008) {
          releaseVelocity = ((last.x - first.x) / elapsed) * radiansPerPixel() * config.dragMomentum;
        }
      }
      samples = [];
      velocity = clamp(releaseVelocity, -config.maxVelocity, config.maxVelocity);
      if (Math.abs(velocity) < config.minVelocity) velocity = 0;
      scheduleIdleResume();
      requestRender();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!event.isPrimary || dragging || expanded) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      pointerId = event.pointerId;
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      pointerLastX = event.clientX;
      dragging = false;
      samples = [];
    };

    const updateHover = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const index = pickCard(event.clientX, event.clientY);
      if (index === null) delete container.dataset.hover;
      else container.dataset.hover = index === selectedIndex ? "expand" : "card";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (pointerId === null) {
        updateHover(event);
        return;
      }
      if (event.pointerId !== pointerId) return;

      if (!dragging) {
        if (event.pointerType === "mouse" && (event.buttons & 1) === 0) {
          // Button was released outside the viewport before the drag began.
          pointerId = null;
          return;
        }
        const dx = event.clientX - pointerStartX;
        const dy = event.clientY - pointerStartY;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < config.dragThreshold) return;
        if (Math.abs(dx) <= Math.abs(dy)) {
          // Vertical intent: release the gesture so the page can scroll.
          pointerId = null;
          return;
        }
        dragging = true;
        container.dataset.dragging = "true";
        releaseSelectionForNavigation();
        try {
          container.setPointerCapture(event.pointerId);
        } catch {
          // Pointer may already be gone; the drag still works without capture.
        }
        pauseIdle();
        stepTarget = null;
        velocity = 0;
        // Start from the current position so crossing the threshold does not jump the cards.
        pointerLastX = event.clientX;
      }

      const moveX = event.clientX - pointerLastX;
      pointerLastX = event.clientX;
      phase += moveX * radiansPerPixel();
      wrapPhase();
      samples.push({ time: event.timeStamp, x: event.clientX });
      while (samples.length > 2 && event.timeStamp - samples[0].time > config.dragVelocityWindow) samples.shift();
      requestRender();
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      // A press that never crossed dragThreshold is a click/tap: pick the card under it.
      const wasTap = !dragging;
      endDrag(true, event.timeStamp);
      if (!wasTap) return;
      const index = pickCard(event.clientX, event.clientY);
      if (index !== null) select(index);
    };
    const onPointerLeave = () => {
      delete container.dataset.hover;
    };
    const onPointerCancel = (event: PointerEvent) => {
      if (event.pointerId === pointerId) endDrag(false, event.timeStamp);
    };
    const onLostPointerCapture = (event: PointerEvent) => {
      // Touch pointers are implicitly captured by the canvas; its loss (when the container
      // takes capture) bubbles here and must not end the drag.
      if (event.target !== container) return;
      if (event.pointerId === pointerId && dragging) endDrag(false, event.timeStamp);
    };
    const onWindowBlur = () => {
      if (pointerId !== null) endDrag(false, performance.now());
    };

    // --- Keyboard -------------------------------------------------------------

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (expanded) return; // The dialog owns the keyboard (its Escape closes it via `cancel`).
      const isArrow = event.key === "ArrowLeft" || event.key === "ArrowRight";
      const isEscape = event.key === "Escape" && hasSelection();
      if (!isArrow && !isEscape) return;
      const target = event.target;
      if (isEditableTarget(target)) return;
      const withinCarousel = target instanceof Node && section.contains(target);
      const pageLevel = target === document.body || target === document.documentElement || target === document;
      if (!withinCarousel && !(pageLevel && inView)) return;
      event.preventDefault();
      if (isEscape) deselect();
      else step(event.key === "ArrowRight" ? 1 : -1);
    };

    // --- Environment ----------------------------------------------------------

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.position.z = width < 640 ? config.mobileCameraDistance : config.cameraDistance;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, config.maxPixelRatio));
      renderer.setSize(width, height, false);
      requestRender();
    };

    const onVisibilityChange = () => {
      pageVisible = !document.hidden;
      if (pageVisible) requestRender();
      else stop();
    };
    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      clearResumeTimer();
      if (reducedMotion) {
        idleActive = false;
        velocity = 0;
      } else if (!dragging && !hasSelection()) {
        idleActive = true;
      }
      stop();
      requestRender();
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      stop();
      setAvailability("fallback");
    };

    // --- Illustrated artwork ----------------------------------------------------
    // The geometric textures render immediately; illustrations load in the background and swap
    // in per card. A missing/broken file keeps the geometric card. Loads are abandoned on unmount,
    // and results are discarded after a context loss (the DOM fallback handles artwork itself).
    const artworkLoads = new AbortController();
    projects.forEach((project, index) => {
      const artwork = project.cardArtwork;
      if (!artwork) return;
      loadTarotArtwork(artwork, artworkLoads.signal)
        .then((loaded) => {
          if (artworkLoads.signal.aborted || contextLost) return;
          const texture = createTarotCardTexture(project, {
            height: textureHeight,
            artwork: { ...loaded, layout: artwork.layout },
          });
          texture.anisotropy = anisotropy;
          const previous = textures[index];
          materials[index].map = texture;
          textures[index] = texture;
          previous.dispose();
          requestRender();
        })
        .catch((error: unknown) => {
          if (artworkLoads.signal.aborted) return;
          console.warn(`[tarot] Artwork for "${project.title}" is unavailable (${artwork.src}); using the geometric card.`, error);
        });
    });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) requestRender();
      else stop();
    }, { threshold: 0.01 });
    intersectionObserver.observe(container);
    document.addEventListener("visibilitychange", onVisibilityChange);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("blur", onWindowBlur);
    motionPreference.addEventListener("change", onMotionChange);
    canvas.addEventListener("webglcontextlost", onContextLost);
    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerCancel);
    container.addEventListener("lostpointercapture", onLostPointerCapture);
    container.addEventListener("pointerleave", onPointerLeave);
    resize();
    const availabilityTimer = window.setTimeout(() => setAvailability("ready"), 0);

    return () => {
      clearTimeout(availabilityTimer);
      artworkLoads.abort();
      clearResumeTimer();
      stop();
      controlsRef.current = null;
      setSelection(NO_SELECTION); // Internal selection and expansion are discarded with the scene.
      setExpandedId(null);
      delete container.dataset.dragging;
      delete container.dataset.hover;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("blur", onWindowBlur);
      motionPreference.removeEventListener("change", onMotionChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerCancel);
      container.removeEventListener("lostpointercapture", onLostPointerCapture);
      container.removeEventListener("pointerleave", onPointerLeave);
      glow.removeFromParent();
      cards.forEach((card) => scene.remove(card));
      textures.forEach((texture) => texture.dispose());
      materials.forEach((material) => material.dispose());
      geometry.dispose();
      glowGeometry.dispose();
      renderer.dispose();
    };
  }, [projects, config]);

  const ready = availability === "ready";
  const activeId = selection.selectedId ?? selection.pendingId;
  const activeProject = activeId !== null ? projects.find((project) => project.id === activeId) : undefined;
  const expandedProject = expandedId !== null ? projects.find((project) => project.id === expandedId) : undefined;

  // Expanded dialog lifecycle: bring the carousel into view, lock page scroll, open the modal
  // (native <dialog> makes the page inert and contains focus), and fly the 3D card forward.
  // Closing reverses all of it and returns focus to the project's own control.
  useEffect(() => {
    if (expandedId === null) return;
    const dialog = dialogRef.current;
    const container = containerRef.current;
    const controlMap = projectControlRefs.current;
    const section = sectionRef.current;
    const index = projects.findIndex((project) => project.id === expandedId);
    if (!dialog || index < 0) return;
    // Restore focus to the invoking control; a canvas click has none, so use the project's control.
    const active = document.activeElement;
    const invoker = active instanceof HTMLElement && section?.contains(active) && !dialog.contains(active) ? active : null;

    if (ready && container) {
      container.scrollIntoView({ block: window.innerWidth <= 700 ? "start" : "center", behavior: "auto" });
    }
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector<HTMLElement>("[data-dialog-initial-focus]")?.focus();
    if (ready) controlsRef.current?.setExpanded(index, stageTargetRef.current);

    return () => {
      controlsRef.current?.setExpanded(null, null);
      if (dialog.open) dialog.close();
      root.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      const focusTarget = invoker?.isConnected ? invoker : controlMap.get(expandedId);
      focusTarget?.focus({ preventScroll: true });
    };
  }, [expandedId, ready, projects]);

  const closeExpanded = () => setExpandedId(null);

  // Desktop mouse parallax: deeper layers move less. Media moves gently and stays readable.
  const PARALLAX_DEPTHS = [
    ["sky", 5],
    ["far", 9],
    ["middle", 15],
    ["near", 22],
    ["front", 30],
    ["media", 10],
  ] as const;

  const onStagePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    for (const [layer, depth] of PARALLAX_DEPTHS) {
      event.currentTarget.style.setProperty(`--parallax-${layer}-x`, `${(-x * depth).toFixed(2)}px`);
      event.currentTarget.style.setProperty(`--parallax-${layer}-y`, `${(-y * depth * 0.6).toFixed(2)}px`);
    }
  };

  const onStagePointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    for (const [layer] of PARALLAX_DEPTHS) {
      event.currentTarget.style.setProperty(`--parallax-${layer}-x`, "0px");
      event.currentTarget.style.setProperty(`--parallax-${layer}-y`, "0px");
    }
  };

  // A native modal makes the page inert, but Tab can still leave for the browser UI. Loop it.
  const onDialogKeyDown = (event: ReactKeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const focusable = [...event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], iframe, [tabindex]:not([tabindex="-1"])',
    )];
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    // Focus can also rest on a programmatic target (a dossier chapter the rail jumped to), which
    // is not in the list; wrap from anything past the last or before the first item as well.
    const active = document.activeElement;
    const pastLast = active !== null && active !== last && !last.contains(active) && Boolean(last.compareDocumentPosition(active) & Node.DOCUMENT_POSITION_FOLLOWING);
    const beforeFirst = active !== null && active !== first && Boolean(first.compareDocumentPosition(active) & Node.DOCUMENT_POSITION_PRECEDING);
    if (event.shiftKey && (active === first || beforeFirst)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || pastLast)) {
      event.preventDefault();
      first.focus();
    }
  };

  const registerProjectControl = (id: number) => (element: HTMLButtonElement | null) => {
    if (element) projectControlRefs.current.set(id, element);
    else projectControlRefs.current.delete(id);
  };

  // With WebGL the effect owns selection (it must center the card first). Without it
  // (fallback grid or lost context), selection is plain React state.
  const selectProject = (index: number) => {
    const project = projects[index];
    if (!project || expandedId !== null) return;
    if (selection.selectedId === project.id) {
      setExpandedId(project.id);
      return;
    }
    if (ready && controlsRef.current) {
      // WebGL: the card centers first, then the effect opens the showcase automatically.
      controlsRef.current.select(index);
      return;
    }
    // Fallback: no centering animation, so select and open in one step.
    setSelection({ selectedId: project.id, pendingId: null });
    setAnnouncement(selectedMessage(project));
    setExpandedId(project.id);
  };

  const deselectProject = () => {
    if (activeId === null) return;
    // The Deselect button unmounts once nothing is selected; hand focus to the project's own control.
    const restoreFocus = document.activeElement === deselectButtonRef.current;
    if (ready && controlsRef.current) {
      controlsRef.current.deselect();
    } else {
      setSelection(NO_SELECTION);
      setAnnouncement(CLEARED_MESSAGE);
    }
    if (restoreFocus) projectControlRefs.current.get(activeId)?.focus();
  };

  const onSectionKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    // While expanded, Escape belongs to the dialog (its `cancel` closes expansion only).
    if (event.key !== "Escape" || activeId === null || expandedId !== null || event.defaultPrevented) return;
    if (isEditableTarget(event.target)) return;
    event.preventDefault();
    deselectProject();
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Project carousel"
      aria-roledescription="carousel"
      aria-describedby={instructionsId}
      onKeyDown={onSectionKeyDown}
    >
      <div ref={containerRef} className={ready ? styles.viewport : styles.viewportHidden}>
        <canvas ref={canvasRef} className={ready ? styles.canvas : styles.canvasHidden} aria-hidden="true" />
      </div>
      <p id={instructionsId} className="sr-only">
        {ready
          ? "Select a project to center its card and open its showcase. Use the previous and next buttons, or the left and right arrow keys, to rotate the cards. In the showcase, press Escape to close; press Escape again to deselect."
          : "Select a project card to open its showcase. Press Escape to close it; press Escape again to deselect."}
      </p>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
      {ready ? (
        <>
          <div className={styles.controls}>
            <button type="button" className={styles.control} aria-label="Previous project" onClick={() => controlsRef.current?.step(-1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M14.5 5.5 8 12l6.5 6.5" />
              </svg>
            </button>
            <button type="button" className={styles.control} aria-label="Next project" onClick={() => controlsRef.current?.step(1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M9.5 5.5 16 12l-6.5 6.5" />
              </svg>
            </button>
          </div>
          <div className={styles.projectList} role="group" aria-label="Select a project">
            {projects.map((project, index) => (
              <button
                key={project.id}
                ref={registerProjectControl(project.id)}
                type="button"
                className={styles.projectChip}
                aria-current={selection.selectedId === project.id ? "true" : undefined}
                onClick={() => selectProject(index)}
              >
                <span className={styles.chipNumeral}>{project.romanNumeral}</span>
                <span className={styles.chipName}>{project.tarotIdentity}</span>
                <span className="sr-only">: {project.title}</span>
              </button>
            ))}
          </div>
          <div className="sr-only">
            {projects.map((project) => (
              <article key={project.id}>
                <h2>{project.tarotIdentity}: {project.title}</h2>
                <p>{project.shortDescription}</p>
                {project.status === "in-development" && <p>In development</p>}
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.fallbackGrid}>
          {projects.map((project, index) => {
            const selected = selection.selectedId === project.id;
            return (
              <div key={project.id} className={styles.fallbackItem} data-selected={selected ? "true" : undefined}>
                <TarotCard project={project} />
                {/* Overlay button: keeps the card's article/heading markup valid (not nested in a button). */}
                <button
                  ref={registerProjectControl(project.id)}
                  type="button"
                  className={styles.fallbackSelect}
                  aria-label={`Select ${project.tarotIdentity}: ${project.title}`}
                  aria-current={selected ? "true" : undefined}
                  onClick={() => selectProject(index)}
                />
              </div>
            );
          })}
        </div>
      )}
      <div className={styles.selectionBar}>
        {activeProject && (
          <>
            <p className={styles.selectionStatus} aria-hidden="true">
              {selection.selectedId !== null ? "Selected" : "Centering"} · {activeProject.tarotIdentity}
            </p>
            {selection.selectedId !== null && (
              <button
                type="button"
                className={styles.openDetails}
                aria-haspopup="dialog"
                onClick={() => setExpandedId(activeProject.id)}
              >
                Open details
              </button>
            )}
            <button ref={deselectButtonRef} type="button" className={styles.deselect} onClick={deselectProject}>
              {ready ? "Deselect & resume" : "Deselect"}
            </button>
          </>
        )}
      </div>

      {/* The expanded scene mounts only while open, so its atmospheric motion is paused otherwise. */}
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby={dialogTitleId}
        aria-describedby={dialogSummaryId}
        onCancel={(event) => {
          event.preventDefault(); // Close through state so the card can fly back.
          closeExpanded();
        }}
        onClose={closeExpanded}
        onKeyDown={onDialogKeyDown}
      >
        {expandedProject && (
          // One media state for the gallery and the dossier's Watch Demo; discarded on close, which
          // also unmounts any playing embed.
          <ProjectMediaProvider project={expandedProject}>
            <div className={styles.dialogLayout}>
              <div
                className={styles.stage}
                onPointerMove={onStagePointerMove}
                onPointerLeave={onStagePointerLeave}
              >
                <ProjectShowcaseEnvironment />
                {/* The selected card as an emblem beside the work. With WebGL, the 3D card flies toward
                    this spot beneath the scene as it fades in; the DOM card then materializes in place. */}
                <div ref={stageTargetRef} className={styles.stageCard} data-webgl={ready ? "true" : undefined}>
                  <TarotCard project={expandedProject} compact />
                </div>
                <ProjectMediaGallery key={expandedProject.id} project={expandedProject} />
              </div>
              <ProjectDetails
                project={expandedProject}
                titleId={dialogTitleId}
                summaryId={dialogSummaryId}
                onClose={closeExpanded}
              />
            </div>
          </ProjectMediaProvider>
        )}
      </dialog>
    </section>
  );
}
