import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { buildMutualLove, type LoveQuality } from "./build-mutual-love";

/** The upstream realm's opening camera, held as a backdrop instead of flying through six realms. */
const SHOT = { position: new THREE.Vector3(0, 9, 230), look: new THREE.Vector3(0, 25, -150) };

export class MutualLoveRenderer {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(62, 1, 0.5, 2800);
  private readonly zone;
  private readonly sky: THREE.Mesh;
  private readonly composer: EffectComposer | null;
  private readonly bloom: UnrealBloomPass | null;
  private readonly observer: ResizeObserver;
  private frame = 0;
  private lastFrameAt = 0;
  private running = false;
  private reducedMotion: boolean;
  private disposed = false;
  private firstFrame = false;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly quality: LoveQuality,
    reducedMotion: boolean,
    private readonly onFirstFrame: () => void,
    private readonly onFailure: () => void,
  ) {
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!context) throw new Error("WebGL unavailable");
    this.reducedMotion = reducedMotion;
    this.renderer = new THREE.WebGLRenderer({ canvas, context, antialias: quality === "high", powerPreference: "default" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality === "low" ? 1 : 1.25));
    this.renderer.setClearColor("#10091f");
    this.scene.fog = new THREE.FogExp2("#10091f", 0.0036);
    this.camera.position.copy(SHOT.position);
    this.camera.lookAt(SHOT.look);

    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: { top: { value: new THREE.Color("#090513") }, bottom: { value: new THREE.Color("#30245c") } },
      vertexShader: `varying vec3 vDir; void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform vec3 top; uniform vec3 bottom; varying vec3 vDir; void main() { gl_FragColor = vec4(mix(bottom, top, smoothstep(-0.05, 0.55, vDir.y)), 1.0); }`,
      side: THREE.BackSide, depthWrite: false,
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(2400, 32, 16), skyMaterial);
    this.sky.renderOrder = -2;
    this.scene.add(this.sky);

    const hemi = new THREE.HemisphereLight("#b4a6e8", "#160f2c", 1.2);
    const sun = new THREE.DirectionalLight("#cbb9ff", 2);
    sun.position.set(80, 160, 60);
    this.scene.add(hemi, sun);
    this.zone = buildMutualLove(quality, this.renderer.getPixelRatio());
    this.scene.add(this.zone.group);

    if (quality === "high") {
      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(new RenderPass(this.scene, this.camera));
      this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.42, 0.4, 0.83);
      this.composer.addPass(this.bloom);
      this.composer.addPass(new OutputPass());
    } else {
      this.composer = null;
      this.bloom = null;
    }

    canvas.addEventListener("webglcontextlost", this.handleContextLost);
    document.addEventListener("visibilitychange", this.handleVisibility);
    this.observer = new ResizeObserver(this.resize);
    this.observer.observe(canvas);
    this.resize();
    if (reducedMotion) this.render(14);
    else this.start();
  }

  setReducedMotion(reduced: boolean) {
    if (this.disposed || this.reducedMotion === reduced) return;
    this.reducedMotion = reduced;
    if (reduced) { this.stop(); this.render(14); }
    else this.start();
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.stop();
    this.observer.disconnect();
    this.canvas.removeEventListener("webglcontextlost", this.handleContextLost);
    document.removeEventListener("visibilitychange", this.handleVisibility);
    this.zone.dispose();
    this.sky.geometry.dispose();
    (this.sky.material as THREE.Material).dispose();
    this.bloom?.dispose();
    this.composer?.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }

  private start() {
    if (this.running || this.disposed || this.reducedMotion || document.hidden) return;
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
    if (now - this.lastFrameAt < (this.quality === "low" ? 32 : 20)) return;
    this.lastFrameAt = now;
    this.render(now * 0.001);
  };

  private render(time: number) {
    this.camera.position.copy(SHOT.position);
    if (!this.reducedMotion) this.camera.position.x += Math.sin(time * 0.08) * 2;
    this.camera.lookAt(SHOT.look);
    this.sky.position.copy(this.camera.position);
    this.zone.tick(time);
    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
    if (!this.firstFrame) { this.firstFrame = true; this.onFirstFrame(); }
  }

  private readonly resize = () => {
    if (this.disposed) return;
    const width = Math.max(1, this.canvas.clientWidth);
    const height = Math.max(1, this.canvas.clientHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.composer?.setSize(width, height);
    this.bloom?.resolution.set(width, height);
    if (this.reducedMotion) this.render(14);
  };

  private readonly handleVisibility = () => {
    if (document.hidden) this.stop();
    else if (!this.reducedMotion) this.start();
  };

  private readonly handleContextLost = () => {
    this.stop();
    this.onFailure();
  };
}
