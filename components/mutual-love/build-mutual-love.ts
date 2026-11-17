/*
 * Adapted from Nafiz001/jjk-domain-expansion @ 69d2b8dca8a2c3f9fdea221dd131ff5722b84c7b
 * Source: src/engine/world3d/zones.ts buildAuthenticMutualLove() and
 * src/engine/world3d/shared.ts makeGround('field') / makeDriftPoints().
 * Owner-confirmed reuse authorization is recorded in docs/source-permissions.md.
 *
 * The source's sword field, crosses, descending light, halo, and drifting particles are retained.
 * Palette is shifted from pink/gold toward indigo/violet for the project showcase. Counts scale on
 * small screens; title text from the source's six-realm narrative is omitted from this background.
 */

import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { animator, compose, glow, makeGlowSprite, makeRimMaterial, range, rng } from "../infinite-void/shared";

export type LoveQuality = "high" | "low";

function fieldGround() {
  const material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      { baseColor: { value: new THREE.Color("#160f2c") }, glowColor: { value: new THREE.Color("#8d6ddb") } },
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
      varying vec3 vWorld;
      varying vec2 vUv;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
        return v;
      }
      void main() {
        vec2 p = vWorld.xz;
        float n = fbm(p * 0.04);
        vec3 col = mix(baseColor * 0.7, baseColor * 1.35, n)
          + glowColor * pow(fbm(p * 0.25), 6.0) * 0.6;
        float edge = smoothstep(0.0, 0.2, min(vUv.y, 1.0 - vUv.y))
          * smoothstep(0.0, 0.08, min(vUv.x, 1.0 - vUv.x));
        gl_FragColor = vec4(mix(fogColor, col, edge), 1.0);
        #include <fog_fragment>
      }
    `,
    fog: true,
  });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1400, 760), material);
  ground.rotation.x = -Math.PI / 2;
  ground.position.z = -50;
  return ground;
}

function driftingLights(count: number, pixelRatio: number, seed: number) {
  const r = rng(seed);
  const box = new THREE.Vector3(560, 200, 640);
  const start = new Float32Array(count * 3);
  const velocity = new Float32Array(count * 3);
  const phase = new Float32Array(count);
  const tint = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    start.set([range(r, -0.5, 0.5) * box.x, range(r, -0.5, 0.5) * box.y, range(r, -0.5, 0.5) * box.z], i * 3);
    velocity.set([5 + range(r, -2, 2), -6 + range(r, -2, 2), -2 + range(r, -2, 2)], i * 3);
    phase[i] = r() * 100;
    tint[i] = r();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(start, 3));
  geometry.setAttribute("velocity", new THREE.BufferAttribute(velocity, 3));
  geometry.setAttribute("phase", new THREE.BufferAttribute(phase, 1));
  geometry.setAttribute("tint", new THREE.BufferAttribute(tint, 1));
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), box.length());
  const material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        time: { value: 0 }, box: { value: box }, size: { value: 2.6 }, sway: { value: 6 },
        pixelRatio: { value: pixelRatio }, colorA: { value: new THREE.Color("#8e7cdb") },
        colorB: { value: new THREE.Color("#dad4ff") }, opacity: { value: 0.85 },
      },
    ]),
    vertexShader: /* glsl */ `
      #include <fog_pars_vertex>
      attribute vec3 velocity;
      attribute float phase;
      attribute float tint;
      uniform float time;
      uniform vec3 box;
      uniform float size;
      uniform float sway;
      uniform float pixelRatio;
      varying float vTint;
      void main() {
        vec3 p = position + velocity * time;
        p.x += sin(time * 0.9 + phase) * sway;
        p.z += cos(time * 0.7 + phase * 1.3) * sway;
        p = mod(p + box * 0.5, box) - box * 0.5;
        vTint = tint;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = size * pixelRatio * (300.0 / max(1.0, -mvPosition.z));
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }
    `,
    fragmentShader: /* glsl */ `
      #include <fog_pars_fragment>
      uniform vec3 colorA;
      uniform vec3 colorB;
      uniform float opacity;
      varying float vTint;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.0, d) * opacity;
        gl_FragColor = vec4(mix(colorA, colorB, vTint), a);
        #include <fog_fragment>
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: true,
  });
  return new THREE.Points(geometry, material);
}

export function buildMutualLove(quality: LoveQuality, pixelRatio: number) {
  const group = new THREE.Group();
  const anim = animator();
  const r = rng(1404);
  group.add(fieldGround());

  const blade = new THREE.BoxGeometry(0.34, 9, 0.07).translate(0, -4.5, 0);
  const guard = new THREE.CylinderGeometry(0.75, 0.75, 0.22, 12);
  const grip = new THREE.CylinderGeometry(0.17, 0.17, 3.2, 8).translate(0, 1.7, 0);
  const katana = mergeGeometries([blade, guard, grip]);
  blade.dispose(); guard.dispose(); grip.dispose();
  if (!katana) throw new Error("Could not build sword geometry");
  const steel = new THREE.MeshStandardMaterial({
    color: "#cbd3ed", metalness: 0.85, roughness: 0.25,
    emissive: "#231240", emissiveIntensity: 0.6,
  });
  const swords = new THREE.InstancedMesh(katana, steel, quality === "high" ? 3200 : 1050);
  const matrix = new THREE.Matrix4();
  for (let i = 0; i < swords.count; i++) {
    let x = 0; let z = 0;
    do {
      x = range(r, -280, 280);
      z = range(r, -340, 240);
    } while (Math.abs(x) < 10 && z > -90);
    compose(matrix, x, range(r, 0.5, 4), z, range(r, -0.3, 0.3), r() * Math.PI, range(r, -0.3, 0.3), range(r, 0.8, 1.5));
    swords.setMatrixAt(i, matrix);
  }
  swords.instanceMatrix.needsUpdate = true;
  swords.computeBoundingSphere();
  group.add(swords);

  const crossMat = makeRimMaterial("#100b25", "#b5a6ff", 2.0, 1.4);
  const upright = new THREE.BoxGeometry(4, 64, 4).translate(0, 32, 0);
  const crossbar = new THREE.BoxGeometry(30, 4, 4).translate(0, 46, 0);
  const crossGeo = mergeGeometries([upright, crossbar]);
  upright.dispose(); crossbar.dispose();
  if (!crossGeo) throw new Error("Could not build cross geometry");
  for (const [x, z, tilt] of [[-70, -80, 0.06], [85, -120, -0.08], [-120, -220, 0.1], [110, -250, -0.05], [0, -300, 0], [-40, -170, -0.04]]) {
    const cross = new THREE.Mesh(crossGeo, crossMat);
    cross.position.set(x, -2, z);
    cross.rotation.set(0, range(r, -0.5, 0.5), tilt);
    group.add(cross);
  }

  const beamMaterial = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 }, color: { value: glow("#b8a5ff", 1.8) } },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float time;
      uniform vec3 color;
      varying vec2 vUv;
      void main() {
        float streak = 0.6 + 0.4 * sin(vUv.x * 40.0 + time * 1.5) * sin(vUv.y * 6.0 - time * 2.0);
        float a = pow(vUv.y, 0.6) * (1.0 - smoothstep(0.85, 1.0, vUv.y)) * 0.35 * streak;
        gl_FragColor = vec4(color * a, a);
      }
    `,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  });
  anim.timeUniform(beamMaterial);
  for (const [x, z, rad] of [[0, -150, 18], [-60, -110, 7], [70, -190, 9], [-110, -260, 8], [40, -60, 5]]) {
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(rad * 0.85, rad * 1.4, 420, 40, 1, true), beamMaterial);
    beam.position.set(x, 205, z);
    group.add(beam);
    const pool = makeGlowSprite("#a998ff", rad * 6, 0.6);
    pool.position.set(x, 2, z);
    group.add(pool);
  }
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(80, 1.4, 12, 160),
    new THREE.MeshBasicMaterial({ color: glow("#cdbdff", 2.6), fog: false }),
  );
  halo.position.set(0, 300, -150);
  halo.rotation.x = Math.PI / 2;
  group.add(halo);
  anim.add((t) => { halo.rotation.z = t * 0.05; });

  const lights = driftingLights(quality === "high" ? 2600 : 850, pixelRatio, 1407);
  anim.timeUniform(lights.material as THREE.Material);
  group.add(lights);

  return {
    group,
    tick: anim.run,
    dispose() {
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      group.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) geometries.add(mesh.geometry);
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((item) => materials.add(item));
        else if (material) materials.add(material);
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => {
        (material as THREE.SpriteMaterial).map?.dispose();
        material.dispose();
      });
    },
  };
}
