/*
 * Adapted from Nafiz001/jjk-domain-expansion @ 69d2b8dca8a2c3f9fdea221dd131ff5722b84c7b
 * Source: https://github.com/Nafiz001/jjk-domain-expansion
 *   src/engine/world3d/zones.ts — buildInfiniteVoid(), L150–332, plus the ZonePalette / Zone /
 *   ZoneContext / Station types it returns.
 * Author: Nafiz001
 * Authorization: owner-held reuse authorization, confirmed by the owner 2026-11-16; see
 *   docs/source-permissions.md §1.
 *
 * What is preserved — the scene is the upstream scene:
 * - Ground: the void grid (makeVoidGround) at y = -40, time-driven.
 * - Starfield: 5,000 points, radius 900, upper hemisphere.
 * - Black hole group at (0, 55, -310): r=24 event-horizon sphere; r=25.6 photon-ring torus; the
 *   accretion disk RingGeometry(28, 100, 200) tilted -π/2 + 0.28; the lensed halo RingGeometry(26, 62)
 *   sharing the disk shader at z = -2; the 320-unit glow sprite.
 * - The accretion-disk fragment shader: radial falloff f, the
 *   `0.55 + 0.45·sin(ang·3 + rad·0.35 − t·2.2)·sin(rad·0.9 − t·1.3)` banding, the hot→mid→cold
 *   three-stop mix at smoothstep(0, .35) and smoothstep(.35, 1), and the (1−f)² alpha.
 * - The information inflow: 3,500 motes seeded on a flattened shell r ∈ [140, 420]; the vertex
 *   shader's f = fract(t·0.05 + offset), the (1 − f²) radial collapse, the 5-radian spin about y,
 *   the size ramp and the sin(life·π) fade.
 * - 80 instanced octahedral crystal monoliths with the fresnel rim material, the same placement
 *   ranges, the same keep-out filter around the horizon, the same spin and 0.5 Hz bob.
 * - The distant spiral galaxy: 9,000 points in three arms, pow(r, 0.7)·260 radial distribution,
 *   0.022 arm twist, ±0.3 scatter, colour ramp by radius, placed at (-300, 250, -470) with rotation
 *   (1.1, 0, 0.4) and spinning at 0.01 rad/s.
 * - The zone palette shape and the six camera stations.
 *
 * Changes:
 * - Palette. Re-keyed toward near-black, midnight indigo and electric violet, keeping the source's
 *   icy-blue and cyan as highlights rather than flattening it to one purple. Every original value is
 *   kept beside its replacement in SOURCE_COLORS below.
 * - Colours that upstream hard-codes inside the disk and inflow GLSL are lifted into uniforms so the
 *   palette can be set without touching shader logic. The arithmetic is unchanged.
 * - addTitle() is not called: it renders the domain's Japanese name as a floating text sprite, which
 *   is franchise text and not wanted on the portfolio. makeTextSprite is therefore not ported.
 * - `quality: "low"` scales the four particle/instance counts down for mobile GPUs. "high" uses the
 *   upstream counts exactly.
 * - Returns dispose(), which upstream's builders lack.
 */

import * as THREE from "three";
import { animator, compose, glow, makeGlowSprite, makeRimMaterial, makeStarfield, makeVoidGround, range, rng } from "./shared";

export interface ZonePalette {
  fog: string;
  fogDensity: number;
  skyTop: string;
  skyBottom: string;
  hemiSky: string;
  hemiGround: string;
  hemiIntensity: number;
  sun: string;
  sunIntensity: number;
}

export interface Station {
  pos: [number, number, number];
  look: [number, number, number];
}

export interface Zone {
  group: THREE.Group;
  stations: Station[];
  palette: ZonePalette;
  tick: (time: number) => void;
  /** Not in upstream: frees every geometry, material and texture this zone created. */
  dispose: () => void;
}

export interface ZoneContext {
  seed: number;
  quality: "high" | "low";
  /**
   * Set when the camera holds still on one station instead of flying through the realm. Crystals
   * that would sit on the lens or across the black hole are then skipped (see heldShotClear).
   */
  heldShot?: { pos: readonly [number, number, number]; look: readonly [number, number, number] };
  /** Device pixel ratio the renderer is using; drives the inflow point size as upstream does. */
  pixelRatio: number;
}

/** The upstream colours, for reference and for a faithful A/B. */
export const SOURCE_COLORS = {
  groundBase: "#01020a",
  groundAccent: "#1aa3d9",
  stars: "#cfe9ff",
  photonRing: "#d8f6ff",
  diskHot: [1.0, 0.97, 0.92, 1.9],
  diskMid: [0.25, 0.85, 1.0, 1.15],
  diskCold: [0.35, 0.15, 0.9, 0.9],
  bhGlow: "#69d8ff",
  inflowFrom: [0.3, 0.9, 1.0],
  crystalBase: "#020610",
  crystalRim: "#00f0ff",
  galaxyCore: "#9ad8ff",
  galaxyArm: "#b388ff",
  palette: {
    fog: "#02040d", fogDensity: 0.0032, skyTop: "#000004", skyBottom: "#071733",
    hemiSky: "#7fd9ff", hemiGround: "#05060b", hemiIntensity: 0.9, sun: "#bfe9ff", sunIntensity: 1.2,
  },
} as const;

/** MARC'S WORLD palette: near-black, midnight indigo, electric violet, icy-cyan highlights. */
export const VOID_COLORS = {
  groundBase: "#03020c",
  groundAccent: "#4a3ad6", // was cyan-blue; now a blue-violet grid, a touch dimmer under bloom
  stars: "#d9e6ff", // icy, kept close to source
  photonRing: "#e2f2ff", // icy highlight, kept
  diskHot: [1.0, 0.96, 1.0, 1.9], // near-white core
  diskMid: [0.3, 0.78, 1.0, 1.15], // icy cyan band, kept as the cyan highlight
  diskCold: [0.62, 0.22, 1.0, 1.0], // electric purple outer disk (source: deep blue-violet)
  bhGlow: "#7c5cff", // violet bloom around the horizon (source: cyan)
  inflowFrom: [0.6, 0.45, 1.0], // motes start violet and heat to white as they fall in
  crystalBase: "#06030f",
  crystalRim: "#9d5cff", // electric purple rims (source: cyan)
  galaxyCore: "#9ad8ff", // icy core, kept
  galaxyArm: "#9b4dff", // saturated violet arms (source: lavender)
  palette: {
    fog: "#05030f", fogDensity: 0.0032, skyTop: "#010006", skyBottom: "#160c3d",
    hemiSky: "#9a86ff", hemiGround: "#05060b", hemiIntensity: 0.9, sun: "#d2c8ff", sunIntensity: 1.2,
  },
} as const;

type Rgbi = readonly [number, number, number, number];

/**
 * Not in upstream. Upstream's camera flies through the crystal field, so a crystal a few units from
 * the lens is a moment of transit. Held on one shot as a page background, the same crystal fills a
 * corner of the screen indefinitely, and crystals on the line of sight hide the black hole. This
 * skips crystals within 150 units of the held camera, and those inside a corridor around the sight
 * line to the horizon. Generation is untouched — these are filtered afterwards — so the seeded
 * random sequence, and therefore the galaxy built from it next, is exactly upstream's.
 */
function heldShotClear(
  c: { x: number; y: number; z: number },
  shot: NonNullable<ZoneContext["heldShot"]>,
) {
  const [px, py, pz] = shot.pos;
  if (Math.hypot(c.x - px, c.y - py, c.z - pz) < 150) return false;
  const [, ly, lz] = shot.look;
  const t = (pz - c.z) / (pz - lz); // 0 at the camera, 1 at the black hole's depth
  if (t > 0 && t < 1) {
    const sightY = py + (ly + 10 - py) * t; // aim at the horizon centre (y 55), not the look point
    // The corridor widens toward the black hole so it covers the halo (r 62) and disk silhouette.
    const halfWidth = 30 + 70 * t;
    const halfHeight = 26 + 40 * t;
    if (Math.abs(c.x - px) < halfWidth && Math.abs(c.y - sightY) < halfHeight) return false;
  }
  return true;
}
const v3 = (c: Rgbi) => new THREE.Vector3(c[0] * c[3], c[1] * c[3], c[2] * c[3]);

// ─────────────────────────────────────────────────────────────────────────────
// 01 INFINITE VOID — a black hole drinking an endless stream of information
// ─────────────────────────────────────────────────────────────────────────────
export function buildInfiniteVoid(ctx: ZoneContext, colors = VOID_COLORS): Zone {
  const group = new THREE.Group();
  const anim = animator();
  const r = rng(ctx.seed);
  const low = ctx.quality === "low";

  const ground = makeVoidGround(colors.groundBase, colors.groundAccent);
  ground.position.y = -40;
  group.add(ground);
  anim.timeUniform(ground.material as THREE.Material);
  group.add(makeStarfield(low ? 2500 : 5000, 900, ctx.seed + 1, colors.stars, 1.4));

  // Black hole: horizon, photon ring, tilted accretion disk and its lensed halo
  const bh = new THREE.Group();
  bh.position.set(0, 55, -310);
  group.add(bh);
  bh.add(new THREE.Mesh(new THREE.SphereGeometry(24, 48, 32), new THREE.MeshBasicMaterial({ color: 0x000000, fog: false })));
  bh.add(new THREE.Mesh(new THREE.TorusGeometry(25.6, 0.55, 16, 180), new THREE.MeshBasicMaterial({ color: glow(colors.photonRing, 2.4), fog: false })));
  const diskMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      inner: { value: 28 },
      outer: { value: 100 },
      // Upstream hard-codes these three in the shader body; lifted to uniforms, same arithmetic.
      hot: { value: v3(colors.diskHot) },
      mid: { value: v3(colors.diskMid) },
      cold: { value: v3(colors.diskCold) },
    },
    vertexShader: `varying vec3 vLocal; void main() { vLocal = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float time;
      uniform float inner;
      uniform float outer;
      uniform vec3 hot;
      uniform vec3 mid;
      uniform vec3 cold;
      varying vec3 vLocal;
      void main() {
        float rad = length(vLocal.xy);
        float f = clamp((rad - inner) / (outer - inner), 0.0, 1.0);
        float ang = atan(vLocal.y, vLocal.x);
        float bands = 0.55 + 0.45 * sin(ang * 3.0 + rad * 0.35 - time * 2.2) * sin(rad * 0.9 - time * 1.3);
        vec3 col = mix(mix(hot, mid, smoothstep(0.0, 0.35, f)), cold, smoothstep(0.35, 1.0, f));
        float a = (1.0 - f) * (1.0 - f) * bands * smoothstep(0.0, 0.03, f);
        gl_FragColor = vec4(col * a, a);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  anim.timeUniform(diskMaterial);
  const disk = new THREE.Mesh(new THREE.RingGeometry(28, 100, 200, 1), diskMaterial);
  disk.rotation.x = -Math.PI / 2 + 0.28;
  bh.add(disk);
  const halo = new THREE.Mesh(new THREE.RingGeometry(26, 62, 160, 1), diskMaterial);
  halo.position.z = -2;
  bh.add(halo);
  const bhGlow = makeGlowSprite(colors.bhGlow, 320, 0.2);
  bhGlow.position.z = -8;
  bh.add(bhGlow);

  // Infinite information: thousands of motes spiralling into the horizon
  const count = low ? 1800 : 3500;
  const start = new Float32Array(count * 3);
  const offset = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const theta = r() * Math.PI * 2;
    const phi = Math.acos(2 * r() - 1);
    const rad = range(r, 140, 420);
    start.set([rad * Math.sin(phi) * Math.cos(theta), rad * Math.cos(phi) * 0.5, rad * Math.sin(phi) * Math.sin(theta)], i * 3);
    offset[i] = r();
  }
  const flowGeometry = new THREE.BufferGeometry();
  flowGeometry.setAttribute("position", new THREE.BufferAttribute(start, 3));
  flowGeometry.setAttribute("offset", new THREE.BufferAttribute(offset, 1));
  const flowMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      pixelRatio: { value: Math.min(ctx.pixelRatio || 1, 1.5) },
      // Upstream: vec3(0.3, 0.9, 1.0) inline. Lifted to a uniform.
      fromColor: { value: new THREE.Vector3(...colors.inflowFrom) },
    },
    vertexShader: /* glsl */ `
      attribute float offset;
      uniform float time;
      uniform float pixelRatio;
      varying float vLife;
      void main() {
        float f = fract(time * 0.05 + offset);
        float ang = f * 5.0;
        vec3 p = position * (1.0 - f * f);
        p.xz = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * p.xz;
        vLife = f;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (1.5 + f * 3.0) * pixelRatio * (300.0 / max(1.0, -mvPosition.z));
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 fromColor;
      varying float vLife;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.0, d) * sin(vLife * 3.14159);
        gl_FragColor = vec4(mix(fromColor, vec3(1.0), vLife) * 1.6 * a, a);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  anim.timeUniform(flowMaterial);
  const flow = new THREE.Points(flowGeometry, flowMaterial);
  flow.frustumCulled = false;
  bh.add(flow);

  // Floating crystal monoliths with glowing edges
  const crystals = new THREE.InstancedMesh(
    new THREE.OctahedronGeometry(1, 0),
    makeRimMaterial(colors.crystalBase, colors.crystalRim, 1.8, 1.6),
    low ? 50 : 80,
  );
  const crystalData = Array.from({ length: crystals.count }, () => ({
    x: range(r, -150, 150),
    y: range(r, -15, 95),
    z: range(r, -230, 190),
    s: range(r, 2.5, 7),
    h: range(r, 2.2, 4),
    spin: range(r, -0.4, 0.4),
    bob: r() * 6,
  }))
    .filter((c) => Math.abs(c.x) > 14 || c.y > 50) // upstream keep-out around the horizon
    .filter((c) => !ctx.heldShot || heldShotClear(c, ctx.heldShot));
  crystals.count = crystalData.length;
  const cm = new THREE.Matrix4();
  anim.add((t) => {
    crystalData.forEach((c, i) => {
      crystals.setMatrixAt(i, compose(cm, c.x, c.y + Math.sin(t * 0.5 + c.bob) * 2, c.z, 0, t * c.spin, 0.2, c.s, c.s * c.h, c.s));
    });
    crystals.instanceMatrix.needsUpdate = true;
  });
  anim.run(0);
  crystals.computeBoundingSphere();
  group.add(crystals);

  // Distant spiral galaxy
  const gCount = low ? 4500 : 9000;
  const gPos = new Float32Array(gCount * 3);
  const gCol = new Float32Array(gCount * 3);
  const c1 = new THREE.Color(colors.galaxyCore);
  const c2 = new THREE.Color(colors.galaxyArm);
  for (let i = 0; i < gCount; i++) {
    const arm = i % 3;
    const rad = Math.pow(r(), 0.7) * 260;
    const ang = arm * ((Math.PI * 2) / 3) + rad * 0.022 + range(r, -0.3, 0.3);
    gPos.set([Math.cos(ang) * rad + range(r, -10, 10), range(r, -6, 6), Math.sin(ang) * rad + range(r, -10, 10)], i * 3);
    const c = c1.clone().lerp(c2, rad / 260).multiplyScalar(1.4 - rad / 400);
    gCol.set([c.r, c.g, c.b], i * 3);
  }
  const gGeometry = new THREE.BufferGeometry();
  gGeometry.setAttribute("position", new THREE.BufferAttribute(gPos, 3));
  gGeometry.setAttribute("color", new THREE.BufferAttribute(gCol, 3));
  const galaxy = new THREE.Points(
    gGeometry,
    new THREE.PointsMaterial({ size: 1.8, vertexColors: true, transparent: true, opacity: 0.8, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }),
  );
  galaxy.position.set(-300, 250, -470);
  galaxy.rotation.set(1.1, 0, 0.4);
  anim.add((t) => {
    galaxy.rotation.y = t * 0.01;
  });
  group.add(galaxy);

  // upstream: addTitle(group, ctx, [0, 165, -360]) — deliberately omitted (franchise text).

  const dispose = () => {
    const materials = new Set<THREE.Material>();
    group.traverse((object) => {
      const mesh = object as THREE.Mesh;
      mesh.geometry?.dispose();
      const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(material)) material.forEach((m) => materials.add(m));
      else if (material) materials.add(material);
    });
    for (const material of materials) {
      const map = (material as THREE.SpriteMaterial).map;
      map?.dispose();
      material.dispose();
    }
  };

  return {
    group,
    palette: { ...colors.palette },
    stations: [
      { pos: [0, 12, 210], look: [0, 45, -310] },
      { pos: [-45, 28, 115], look: [0, 50, -310] },
      { pos: [32, 6, 30], look: [-25, 30, -70] },
      { pos: [0, 48, -70], look: [0, 55, -310] },
      { pos: [70, 95, -170], look: [0, 50, -310] },
      { pos: [0, 58, -228], look: [0, 55, -310] },
    ],
    tick: anim.run,
    dispose,
  };
}
