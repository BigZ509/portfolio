/*
 * Adapted from Nafiz001/jjk-domain-expansion @ 69d2b8dca8a2c3f9fdea221dd131ff5722b84c7b
 * Source: https://github.com/Nafiz001/jjk-domain-expansion  (src/engine/world3d/index.ts, class World3D)
 * Author: Nafiz001
 * Authorization: owner-held reuse authorization, confirmed by the owner 2026-11-16; see
 *   docs/source-permissions.md §1.
 *
 * A standalone renderer for one realm — the Infinite Void — used as a site background.
 *
 * Preserved from World3D: PerspectiveCamera(62°, near 0.5, far 2800); FogExp2 driven by the zone
 * palette with the clear colour matched to fog; the camera-following gradient sky dome shader
 * (radius 2400, smoothstep(-0.05, 0.55, dir.y)) verbatim; HemisphereLight + DirectionalLight from the
 * palette with the sun offset (80, 160, 60) from the camera; EffectComposer → RenderPass →
 * UnrealBloomPass(strength 0.55, radius 0.45, threshold 0.82) → OutputPass; pixel ratio capped at
 * 1.5; and the pointer parallax — camera translated along its right/up axes by pointerX·2.2 and
 * −pointerY·1.4, then rolled by pointerX·0.02.
 *
 * Not ported, because they belong to the six-realm scroll narrative rather than one realm:
 * the 36-station Catmull-Rom flight path and banking, the painted plate backdrops, the barrier
 * membranes between realms, palette cross-fades, and the impact/Black-Flash CSS filters.
 *
 * Changes:
 * - Camera: upstream station 0 (pos [0, 12, 210] → look [0, 45, -310]), the realm's opening wide
 *   shot, held still. The black hole is then placed off-centre with a lens shift
 *   (camera.setViewOffset) rather than by turning the camera, so perspective is unchanged and the
 *   composition adapts to portrait and landscape. Adds a slow ±6-unit dolly for depth.
 * - Pointer parallax is eased toward the target each frame and only follows a fine (mouse) pointer.
 * - Upstream adds `window.addEventListener('resize', () => this.resize())` and never removes it,
 *   and has no dispose(). This class removes every listener and frees all GPU resources.
 * - Quality tiers: "low" drops bloom, caps the pixel ratio at 1, caps at 30 fps, and asks the zone
 *   for reduced particle counts. "high" matches upstream.
 * - powerPreference "default" instead of "high-performance": a page background should not force a
 *   laptop onto its discrete GPU.
 * - Reduced motion renders a single still frame and re-renders it only on resize.
 */

import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { buildInfiniteVoid, type Zone } from "./build-infinite-void";

export type VoidQuality = "high" | "low";

export interface VoidRendererOptions {
  quality: VoidQuality;
  /** Optional section-specific camera composition; the Projects framing remains the default. */
  framing?: typeof FRAMING;
  /** Initial value; change it later with setReducedMotion(). */
  reducedMotion: boolean;
  /** Called if the GL context is lost, so the host can show its fallback. */
  onContextLost?: () => void;
  /** Called once the first frame has been drawn. */
  onFirstFrame?: () => void;
}

/** Where the black hole sits on screen, in NDC (−1…1, +y up). */
const FRAMING = {
  landscape: { x: 0.5, y: 0.26 },
  portrait: { x: 0.34, y: 0.47 },
};

const STILL_TIME = 14; // seconds into the loop for the reduced-motion still: motes are well spread
const SUN_OFFSET = new THREE.Vector3(80, 160, 60); // upstream offset, hoisted out of the frame loop

export class VoidRenderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly options: VoidRendererOptions;
  private reducedMotion: boolean;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(62, 1, 0.5, 2800);
  private readonly fog = new THREE.FogExp2(0x000000, 0.004);
  private readonly hemi = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
  private readonly sun = new THREE.DirectionalLight(0xffffff, 1);
  private readonly sky: THREE.Mesh;
  private readonly skyMaterial: THREE.ShaderMaterial;
  private readonly composer: EffectComposer | null = null;
  private readonly bloom: UnrealBloomPass | null = null;
  private readonly zone: Zone;

  private readonly basePos = new THREE.Vector3();
  private readonly baseLook = new THREE.Vector3();
  private readonly forward = new THREE.Vector3();
  private readonly right = new THREE.Vector3();
  private readonly up = new THREE.Vector3();
  private readonly projected = new THREE.Vector3();

  private pointerTarget = { x: 0, y: 0 };
  private pointer = { x: 0, y: 0 };
  private frame = 0;
  private lastFrameAt = 0;
  private running = false;
  private active = false;
  private drewFirstFrame = false;
  private disposed = false;
  private readonly resizeObserver: ResizeObserver;

  constructor(canvas: HTMLCanvasElement, options: VoidRendererOptions) {
    this.canvas = canvas;
    this.options = options;
    this.reducedMotion = options.reducedMotion;
    const low = options.quality === "low";

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: !low, alpha: false, powerPreference: "default" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, low ? 1 : 1.5));
    this.scene.fog = this.fog;

    if (!low) {
      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(new RenderPass(this.scene, this.camera));
      this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.45, 0.82);
      this.composer.addPass(this.bloom);
      this.composer.addPass(new OutputPass());
    }

    // Gradient sky dome that follows the camera (upstream, verbatim)
    this.skyMaterial = new THREE.ShaderMaterial({
      uniforms: { top: { value: new THREE.Color() }, bottom: { value: new THREE.Color() } },
      vertexShader: `varying vec3 vDir; void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform vec3 top;
        uniform vec3 bottom;
        varying vec3 vDir;
        void main() { gl_FragColor = vec4(mix(bottom, top, smoothstep(-0.05, 0.55, vDir.y)), 1.0); }
      `,
      side: THREE.BackSide,
      depthWrite: false,
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(2400, 32, 16), this.skyMaterial);
    this.sky.renderOrder = -2;
    this.scene.add(this.sky);
    this.scene.add(this.hemi, this.sun, this.sun.target);

    // Upstream station 0 is the held shot; the zone keeps crystals clear of it.
    const HELD_SHOT = { pos: [0, 12, 210], look: [0, 45, -310] } as const;
    this.zone = buildInfiniteVoid({
      seed: 1000,
      quality: options.quality,
      pixelRatio: this.renderer.getPixelRatio(),
      heldShot: HELD_SHOT,
    });
    this.scene.add(this.zone.group);

    // Atmosphere from the realm palette (upstream render(), with no cross-fade: one realm)
    const pal = this.zone.palette;
    this.fog.color.set(pal.fog);
    this.fog.density = pal.fogDensity;
    this.renderer.setClearColor(pal.fog);
    this.skyMaterial.uniforms.top.value.set(pal.skyTop);
    this.skyMaterial.uniforms.bottom.value.set(pal.skyBottom);
    this.hemi.color.set(pal.hemiSky);
    this.hemi.groundColor.set(pal.hemiGround);
    this.hemi.intensity = pal.hemiIntensity;
    this.sun.color.set(pal.sun);
    this.sun.intensity = pal.sunIntensity;

    // Upstream station 0: the realm's opening wide shot.
    const station = this.zone.stations[0];
    this.basePos.set(...station.pos);
    this.baseLook.set(...station.look);

    canvas.addEventListener("webglcontextlost", this.handleContextLost);
    window.addEventListener("pointermove", this.handlePointer, { passive: true });
    document.addEventListener("visibilitychange", this.handleVisibility);
    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(canvas);
    this.handleResize();
  }

  /** Show or hide the realm. Inactive means no frames are drawn at all. */
  setActive(on: boolean) {
    if (this.disposed) return;
    this.active = on;
    if (on && !this.reducedMotion) this.start();
    else this.stop();
    if (on && this.reducedMotion) this.renderFrame(STILL_TIME);
  }

  /**
   * Switch motion on or off in place. (A canvas keeps one GL context for life, so after dispose()
   * it cannot host a new renderer — the setting has to be live rather than a rebuild.)
   */
  setReducedMotion(reduced: boolean) {
    if (this.disposed || reduced === this.reducedMotion) return;
    this.reducedMotion = reduced;
    if (reduced) this.pointerTarget = { x: 0, y: 0 };
    this.setActive(this.active);
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.stop();
    this.canvas.removeEventListener("webglcontextlost", this.handleContextLost);
    window.removeEventListener("pointermove", this.handlePointer);
    document.removeEventListener("visibilitychange", this.handleVisibility);
    this.resizeObserver.disconnect();
    this.zone.dispose();
    this.sky.geometry.dispose();
    this.skyMaterial.dispose();
    this.bloom?.dispose();
    this.composer?.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }

  private start() {
    if (this.running || !this.active || document.hidden) return;
    this.running = true;
    this.frame = requestAnimationFrame(this.loop);
  }

  private stop() {
    this.running = false;
    cancelAnimationFrame(this.frame);
  }

  private readonly loop = (now: number) => {
    if (!this.running) return;
    this.frame = requestAnimationFrame(this.loop);
    // Low tier: hold to ~30 fps. The motion is slow enough that this costs nothing visually.
    if (this.options.quality === "low" && now - this.lastFrameAt < 32) return;
    this.lastFrameAt = now;
    this.renderFrame(now * 0.001);
  };

  private renderFrame(time: number) {
    const calm = this.reducedMotion ? 0 : 1;
    const cam = this.camera;

    // Ease the pointer so the camera never snaps (upstream applies it raw).
    this.pointer.x += (this.pointerTarget.x - this.pointer.x) * 0.04;
    this.pointer.y += (this.pointerTarget.y - this.pointer.y) * 0.04;

    // Held station-0 shot, with a slow dolly for depth.
    this.forward.copy(this.baseLook).sub(this.basePos).normalize();
    cam.position.copy(this.basePos).addScaledVector(this.forward, Math.sin(time * 0.05) * 6 * calm);
    cam.lookAt(this.baseLook);
    cam.updateMatrix();
    this.right.setFromMatrixColumn(cam.matrix, 0);
    this.up.setFromMatrixColumn(cam.matrix, 1);
    // Upstream parallax constants.
    cam.position
      .addScaledVector(this.right, this.pointer.x * 2.2 * calm)
      .addScaledVector(this.up, -this.pointer.y * 1.4 * calm);
    cam.lookAt(this.baseLook);
    cam.rotateZ(this.pointer.x * 0.02 * calm);

    this.sky.position.copy(cam.position);
    this.sun.position.copy(cam.position).add(SUN_OFFSET);
    this.sun.target.position.copy(cam.position);

    this.zone.tick(time);
    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene, cam);

    if (!this.drewFirstFrame) {
      this.drewFirstFrame = true;
      this.options.onFirstFrame?.();
    }
  }

  /** Lens-shift the projection so the black hole lands on its framing point. */
  private frame3D(width: number, height: number) {
    const cam = this.camera;
    cam.aspect = width / height;
    cam.clearViewOffset();
    cam.position.copy(this.basePos);
    cam.lookAt(this.baseLook);
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld();

    // Where the horizon centre falls with no shift…
    this.zone.group.updateMatrixWorld();
    this.projected.set(0, 55, -310).applyMatrix4(this.zone.group.matrixWorld).project(cam);
    // …and the offset that moves it to the target.
    const framing = this.options.framing ?? FRAMING;
    const target = width >= height ? framing.landscape : framing.portrait;
    const offsetX = ((this.projected.x - target.x) / 2) * width;
    const offsetY = ((target.y - this.projected.y) / 2) * height;
    cam.setViewOffset(width, height, offsetX, offsetY, width, height);
    cam.updateProjectionMatrix();
  }

  private readonly handleResize = () => {
    if (this.disposed) return;
    const width = Math.max(1, this.canvas.clientWidth);
    const height = Math.max(1, this.canvas.clientHeight);
    this.renderer.setSize(width, height, false);
    this.composer?.setSize(width, height);
    this.bloom?.resolution.set(width, height);
    this.frame3D(width, height);
    if (this.active && this.reducedMotion) this.renderFrame(STILL_TIME);
  };

  private readonly handlePointer = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || this.reducedMotion) return;
    this.pointerTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointerTarget.y = (event.clientY / window.innerHeight) * 2 - 1;
  };

  private readonly handleVisibility = () => {
    if (document.hidden) this.stop();
    else if (!this.reducedMotion) this.start();
  };

  private readonly handleContextLost = () => {
    this.stop();
    this.options.onContextLost?.();
  };
}
