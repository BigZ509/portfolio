/*
 * Adapted from Nafiz001/jjk-domain-expansion @ 69d2b8dca8a2c3f9fdea221dd131ff5722b84c7b
 * Source: https://github.com/Nafiz001/jjk-domain-expansion
 *   - src/engine/world3d/shared.ts: rng, range, glow, makeGround, makeRimMaterial, makeGlowSprite
 *   - src/engine/world3d/zones.ts:  animator, makeStarfield, compose (module-private helpers)
 * Author: Nafiz001
 * Authorization: owner-held reuse authorization, confirmed by the owner 2026-11-16; see
 *   docs/source-permissions.md §1.
 *
 * Changes:
 * - Only the utilities buildInfiniteVoid() needs are ported; the other five domains' helpers
 *   (makeDriftPoints, makeTendril, scatterInstances, makeTextSprite) are not.
 * - makeGround: upstream compiles one shader with six `kind` branches for six domains. Only the
 *   `void` branch (the infinite light grid) is kept, so the fbm noise block the other five branches
 *   need is dropped. The kept branch — two gridLine() scales, the fog-coloured edge fade, the fog
 *   chunks — is verbatim.
 * - makeGlowSprite: upstream caches its radial texture in a module-level singleton that is never
 *   disposed. Here the texture is created per call and owned by the sprite, so disposing the scene
 *   frees it.
 *
 * Preserved verbatim: the mulberry32 PRNG constants, glow()'s linear-space overbright trick, the
 * gridLine() fwidth antialiasing, the fresnel rim term and its instancing branch, the glow sprite's
 * three gradient stops, and the starfield's upper-hemisphere distribution.
 */

import * as THREE from "three";

/** Deterministic PRNG so every visit builds the same world. (upstream shared.ts) */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const range = (r: () => number, min: number, max: number) => min + r() * (max - min);

/** Colour that blooms: scale an sRGB hex past 1.0 in linear space. (upstream shared.ts) */
export const glow = (hex: string | number, intensity: number) => new THREE.Color(hex).multiplyScalar(intensity);

type Tick = (time: number) => void;

/** Collects time-driven shader materials and custom animations for a zone. (upstream zones.ts) */
export function animator() {
  const ticks: Tick[] = [];
  return {
    ticks,
    timeUniform(material: THREE.Material) {
      const m = material as THREE.ShaderMaterial;
      ticks.push((t) => {
        m.uniforms.time.value = t;
      });
    },
    add(fn: Tick) {
      ticks.push(fn);
    },
    run(t: number) {
      for (const fn of ticks) fn(t);
    },
  };
}

/**
 * Procedural animated ground — the Infinite Void's faint infinite grid of light. (upstream
 * shared.ts makeGround, `void` branch only.) Bounded, dissolving into the fog colour at its edges.
 */
export function makeVoidGround(base: string, accent: string, width = 1400, length = 760): THREE.Mesh {
  const material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        baseColor: { value: new THREE.Color(base) },
        glowColor: { value: new THREE.Color(accent) },
        time: { value: 0 },
      },
    ]),
    vertexShader: /* glsl */ `
      #include <fog_pars_vertex>
      varying vec3 vWorld;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xyz;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }
    `,
    fragmentShader: /* glsl */ `
      #include <fog_pars_fragment>
      uniform vec3 baseColor;
      uniform vec3 glowColor;
      uniform float time;
      varying vec3 vWorld;
      varying vec2 vUv;
      float gridLine(vec2 p, float cell) {
        vec2 q = p / cell;
        vec2 g = abs(fract(q - 0.5) - 0.5) / fwidth(q);
        return 1.0 - min(min(g.x, g.y), 1.0);
      }
      void main() {
        vec2 p = vWorld.xz;
        // Void: faint infinite grid of light
        vec3 col = baseColor + glowColor * gridLine(p, 24.0) * 0.45 + glowColor * gridLine(p, 120.0) * 0.6;
        float edge = smoothstep(0.0, 0.2, min(vUv.y, 1.0 - vUv.y)) * smoothstep(0.0, 0.08, min(vUv.x, 1.0 - vUv.x));
        gl_FragColor = vec4(mix(fogColor, col, edge), 1.0);
        #include <fog_fragment>
      }
    `,
    fog: true,
  });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(width, length, 1, 1), material);
  ground.rotation.x = -Math.PI / 2;
  ground.position.z = -50;
  return ground;
}

/** Glossy-black body with a glowing fresnel rim. Works with InstancedMesh. (upstream shared.ts) */
export function makeRimMaterial(base: string, rim: string, power = 2.5, intensity = 1.6): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        baseColor: { value: new THREE.Color(base) },
        rimColor: { value: new THREE.Color(rim) },
        power: { value: power },
        intensity: { value: intensity },
      },
    ]),
    vertexShader: /* glsl */ `
      #include <fog_pars_vertex>
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vec4 local = vec4(position, 1.0);
        vec3 n = normal;
        #ifdef USE_INSTANCING
          local = instanceMatrix * local;
          n = mat3(instanceMatrix) * n;
        #endif
        vec4 mvPosition = modelViewMatrix * local;
        vNormal = normalize(normalMatrix * n);
        vView = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }
    `,
    fragmentShader: /* glsl */ `
      #include <fog_pars_fragment>
      uniform vec3 baseColor;
      uniform vec3 rimColor;
      uniform float power;
      uniform float intensity;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float f = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), power);
        gl_FragColor = vec4(baseColor + rimColor * f * intensity, 1.0);
        #include <fog_fragment>
      }
    `,
    fog: true,
  });
}

/** Billboarded additive glow. (upstream shared.ts; texture is per-sprite here, see header.) */
export function makeGlowSprite(color: THREE.ColorRepresentation, size: number, opacity = 1): THREE.Sprite {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.55)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(c),
      color: new THREE.Color(color),
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    }),
  );
  sprite.scale.set(size, size, 1);
  return sprite;
}

/** Upper-hemisphere starfield. (upstream zones.ts makeStarfield, verbatim) */
export function makeStarfield(count: number, radius: number, seed: number, color = "#ffffff", size = 1.6) {
  const r = rng(seed);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = r() * Math.PI * 2;
    const phi = Math.acos(2 * r() - 1);
    const rr = radius * (0.7 + 0.3 * r());
    positions.set([rr * Math.sin(phi) * Math.cos(theta), Math.abs(rr * Math.cos(phi)) * 0.8, rr * Math.sin(phi) * Math.sin(theta)], i * 3);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({ color, size, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.9, depthWrite: false }),
  );
}

const tmpQ = new THREE.Quaternion();
const tmpE = new THREE.Euler();
const tmpS = new THREE.Vector3();
const tmpP = new THREE.Vector3();

/** Compose a TRS matrix in place. (upstream zones.ts, verbatim) */
export function compose(m: THREE.Matrix4, x: number, y: number, z: number, rx: number, ry: number, rz: number, sx: number, sy = sx, sz = sx) {
  tmpP.set(x, y, z);
  tmpQ.setFromEuler(tmpE.set(rx, ry, rz));
  tmpS.set(sx, sy, sz);
  return m.compose(tmpP, tmpQ, tmpS);
}
