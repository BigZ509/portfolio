import type { ReactNode } from "react";
import styles from "./home.module.css";

/*
 * Original Victorian-gothic night city for the homepage. Every shape is drawn here for AFTERIMAGE:
 * no external artwork. The scene is a composed 1920×1080 plate split into depth layers. Each layer
 * is cropped to the band it occupies and placed by percentage inside a shared 16:9 frame, so the
 * layers stay registered at any viewport size. Continuous motion is only ever applied to whole
 * elements (transform/opacity), never to shapes inside an SVG, so it stays on the compositor.
 */

const W = 1920;
const H = 1080;

type Box = readonly [x: number, y: number, width: number, height: number];

function Art({ box, className, children }: { box: Box; className?: string; children: ReactNode }) {
  const [x, y, width, height] = box;
  return (
    <svg
      viewBox={`${x} ${y} ${width} ${height}`}
      className={className ? `${styles.art} ${className}` : styles.art}
      style={{
        left: `${(x / W) * 100}%`,
        top: `${(y / H) * 100}%`,
        width: `${(width / W) * 100}%`,
        height: `${(height / H) * 100}%`,
      }}
    >
      {children}
    </svg>
  );
}

function prng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const r = (value: number) => Math.round(value * 10) / 10;

/** Pointed gothic window, bottom-left corner at (x, bottom). */
const lancet = (x: number, bottom: number, w: number, h: number) =>
  `M${r(x)} ${r(bottom)}V${r(bottom - h + w * 0.9)}Q${r(x)} ${r(bottom - h + w * 0.25)} ${r(x + w / 2)} ${r(bottom - h)}Q${r(x + w)} ${r(bottom - h + w * 0.25)} ${r(x + w)} ${r(bottom - h + w * 0.9)}V${r(bottom)}Z`;

type Zone = "open" | "low" | "skip";

type SkylineOptions = {
  seed: number;
  scale: number;
  /** Typical wall-top height at the left and right edges: the skyline climbs toward the right. */
  topLeft: number;
  topRight: number;
  jitter: number;
  windows: "rect" | "lancet";
  litChance: (x: number) => number;
  zone?: (x: number, width: number) => Zone;
};

type Skyline = { body: string; panes: string; lights: [string, string]; glows: [number, number][] };

function buildSkyline(options: SkylineOptions): Skyline {
  const { scale: s } = options;
  const rand = prng(options.seed);
  const between = (min: number, max: number) => min + rand() * (max - min);
  const body: string[] = [];
  const panes: string[] = [];
  const lights: [string[], string[]] = [[], []];
  const glows: [number, number][] = [];
  let lit = 0;

  const chimney = (x: number, base: number, height: number, pots: number) => {
    const width = (5 + pots * 5) * s;
    let d = `M${r(x)} ${r(base)}V${r(base - height)}h${r(width)}V${r(base)}Z`;
    for (let pot = 0; pot < pots; pot++) {
      d += `M${r(x + (2.5 + pot * 5) * s)} ${r(base - height)}v${r(-5 * s)}h${r(3 * s)}v${r(5 * s)}Z`;
    }
    return d;
  };

  const windows = (left: number, right: number, top: number, rows: number) => {
    const ww = (options.windows === "lancet" ? 9 : 5) * s;
    const wh = (options.windows === "lancet" ? 19 : 8) * s;
    const stepX = ww * 2.5;
    const stepY = wh * 1.9;
    const columns = Math.floor((right - left) / stepX);
    if (columns < 1) return;
    const offset = left + (right - left - (columns - 1) * stepX - ww) / 2;
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const wx = offset + column * stepX;
        const bottom = top + row * stepY + wh;
        if (bottom > H - 12) continue;
        const d = options.windows === "lancet"
          ? lancet(wx, bottom, ww, wh)
          : `M${r(wx)} ${r(bottom - wh)}h${r(ww)}v${r(wh)}h${r(-ww)}Z`;
        if (rand() < 0.8) panes.push(d);
        if (rand() < options.litChance(wx)) {
          lights[lit % 2].push(d);
          if (lit % 3 === 0) glows.push([r(wx + ww / 2), r(bottom - wh / 2)]);
          lit++;
        }
      }
    }
  };

  let x = -70;
  while (x < W + 70) {
    const width = between(66, 128) * s;
    const progress = Math.min(1, Math.max(0, x / W));
    const top = options.topLeft + (options.topRight - options.topLeft) * progress + between(-options.jitter, options.jitter);
    const zone = options.zone?.(x, width) ?? "open";
    if (zone === "skip") {
      x += width;
      continue;
    }
    const pick = rand();
    const right = x + width;

    if (pick < 0.16 && zone === "open") {
      // Tower with a pyramid cap, finial and corner pinnacles.
      const tw = between(40, 58) * s;
      const ttop = top - between(70, 170) * s;
      const cap = between(56, 120) * s;
      const cx = x + tw / 2;
      body.push(
        `M${r(x)} ${H}V${r(ttop)}h${r(-4 * s)}L${r(cx)} ${r(ttop - cap)}L${r(x + tw + 4 * s)} ${r(ttop)}h${r(-4 * s)}V${H}Z`,
        `M${r(cx - s)} ${r(ttop - cap + 2)}v${r(-13 * s)}h${r(2 * s)}v${r(13 * s)}Z`,
        `M${r(x - 5 * s)} ${r(ttop)}l${r(3 * s)} ${r(-18 * s)}l${r(3 * s)} ${r(18 * s)}Z`,
        `M${r(x + tw - s)} ${r(ttop)}l${r(3 * s)} ${r(-18 * s)}l${r(3 * s)} ${r(18 * s)}Z`,
      );
      windows(x + tw * 0.3, x + tw * 0.7, ttop + 16 * s, 4);
      x += tw - between(0, 5) * s;
      continue;
    }

    if (pick < 0.42) {
      // Steep gabled house with a chimney on the slope.
      const rise = width * between(0.42, 0.68);
      body.push(`M${r(x)} ${H}V${r(top)}L${r(x + width / 2)} ${r(top - rise)}L${r(right)} ${r(top)}V${H}Z`);
      const t = between(0.14, 0.32);
      const side = rand() < 0.5 ? t : 1 - t - 0.08;
      const roofY = top - rise * (1 - Math.abs(side - 0.5) * 2);
      body.push(chimney(x + width * side, roofY + 8 * s, between(24, 42) * s, 1 + Math.floor(rand() * 2)));
      windows(x + 9 * s, right - 9 * s, top + 12 * s, 3);
    } else if (pick < 0.6) {
      // Mansard roof with end chimneys.
      const rise = between(28, 42) * s;
      const inset = width * 0.14;
      body.push(
        `M${r(x)} ${H}V${r(top)}L${r(x + inset)} ${r(top - rise)}H${r(right - inset)}L${r(right)} ${r(top)}V${H}Z`,
        chimney(x + inset + 3 * s, top - rise + 2, between(14, 26) * s, 2),
        chimney(right - inset - 18 * s, top - rise + 2, between(14, 26) * s, 2),
      );
      windows(x + 8 * s, right - 8 * s, top + 12 * s, 3);
    } else if (pick < 0.78) {
      // Flat-fronted terrace with a cornice and chimney stacks.
      body.push(
        `M${r(x)} ${H}V${r(top)}H${r(right)}V${H}Z`,
        `M${r(x - 2 * s)} ${r(top)}v${r(-4 * s)}h${r(width + 4 * s)}v${r(4 * s)}Z`,
      );
      const stacks = 2 + Math.floor(rand() * 2);
      for (let stack = 0; stack < stacks; stack++) {
        body.push(chimney(x + width * (0.12 + (stack * 0.74) / stacks), top - 2, between(18, 34) * s, 2 + Math.floor(rand() * 2)));
      }
      windows(x + 8 * s, right - 8 * s, top + 12 * s, 4);
    } else if (pick < 0.93) {
      // Stepped gable.
      const steps = 3 + Math.floor(rand() * 2);
      const stepW = width / (2 * steps + 1);
      const stepH = between(11, 17) * s;
      let d = `M${r(x)} ${H}V${r(top)}`;
      for (let step = 0; step < steps; step++) d += `h${r(stepW)}v${r(-stepH)}`;
      d += `h${r(stepW)}`;
      for (let step = 0; step < steps; step++) d += `v${r(stepH)}h${r(stepW)}`;
      body.push(`${d}V${H}Z`);
      windows(x + 9 * s, right - 9 * s, top + 12 * s, 3);
    } else {
      // Domed hall with a lantern.
      const radius = width * 0.36;
      const cx = x + width / 2;
      const drum = top - 14 * s;
      body.push(
        `M${r(x)} ${H}V${r(top)}H${r(right)}V${H}Z`,
        `M${r(cx - radius)} ${r(top)}V${r(drum)}A${r(radius)} ${r(radius)} 0 0 1 ${r(cx + radius)} ${r(drum)}V${r(top)}Z`,
        `M${r(cx - 4 * s)} ${r(drum - radius + 3)}v${r(-14 * s)}l${r(4 * s)} ${r(-10 * s)}l${r(4 * s)} ${r(10 * s)}v${r(14 * s)}Z`,
      );
      windows(x + 8 * s, right - 8 * s, top + 12 * s, 3);
    }
    x += width - between(0, 6) * s;
  }

  return { body: body.join(""), panes: panes.join(""), lights: [lights[0].join(""), lights[1].join("")], glows };
}

/* ---- Layers ---- */

const MOON: readonly [number, number] = [1128, 236];
const TOWER_X = 1040;

const FAR = buildSkyline({
  seed: 20261115,
  scale: 0.62,
  topLeft: 760,
  topRight: 612,
  jitter: 26,
  windows: "rect",
  litChance: (x) => (x < 760 ? 0.05 : 0.15),
  zone: (x) => (x < 640 ? "low" : "open"),
});

const MID = buildSkyline({
  seed: 1887,
  scale: 1,
  topLeft: 868,
  topRight: 730,
  jitter: 30,
  windows: "lancet",
  litChance: (x) => (x < 780 ? 0.07 : 0.24),
  zone: (x, width) => {
    if (x + width > 1425 && x < 1715) return "skip"; // the cathedral stands here
    if (x < 800 || (x + width > 930 && x < 1150)) return "low"; // keep the title and clock tower clear
    return "open";
  },
});

const STARS = (() => {
  const rand = prng(404);
  const groups: [ReactNode[], ReactNode[]] = [[], []];
  for (let index = 0; index < 120; index++) {
    const x = rand() * W;
    const y = rand() * rand() * 620;
    const radius = 0.5 + rand() * rand() * 1.5;
    const opacity = 0.35 + rand() * 0.6;
    if (Math.hypot(x - MOON[0], y - MOON[1]) < 130) continue;
    groups[index % 2].push(
      <circle key={index} cx={r(x)} cy={r(y)} r={r(radius)} opacity={r(opacity)} className={index % 9 === 0 ? styles.starGold : styles.star} />,
    );
  }
  return groups;
})();

// An original constellation above the title: linked stars, no real-world or licensed figure.
const CONSTELLATION: readonly [number, number][] = [[214, 168], [296, 214], [388, 186], [452, 262], [548, 232], [610, 304]];

// Clock tower silhouette, centered on x = 0 (placed at TOWER_X).
const TOWER =
  "M-78 1080V860H-66V640H-58V520H-72V510H-64V380H-72V372H-68V332L-62 298L-56 332V372H-50V318L0 160L50 318V372H56V332L62 298L68 332V372H72V380H64V510H72V520H58V640H66V860H78V1080Z";

const CLOCK_Y = 445;
const CLOCK_TICKS = Array.from({ length: 12 }, (_, index) => {
  const angle = (index * Math.PI) / 6;
  const inner = index % 3 === 0 ? 33 : 37;
  return `M${r(Math.sin(angle) * inner)} ${r(CLOCK_Y - Math.cos(angle) * inner)}L${r(Math.sin(angle) * 42)} ${r(CLOCK_Y - Math.cos(angle) * 42)}`;
}).join("");

// Cathedral in the middle distance: twin spired towers, nave roof and a central flèche.
const CATHEDRAL =
  "M1440 1080V600h-6L1470 468L1506 600h-6V705L1512 690H1564L1570 612L1576 690H1628L1640 705V570h-6L1670 418L1706 570h-6V1080Z";
const CATHEDRAL_PANES =
  lancet(1462, 690, 16, 46) + lancet(1662, 668, 16, 50) + [1522, 1548, 1592, 1618].map((x) => lancet(x, 800, 12, 46)).join("");
const ROSE: readonly [number, number] = [1570, 752];
const ROSE_TRACERY = Array.from({ length: 8 }, (_, index) => {
  const angle = (index * Math.PI) / 4;
  return `M${ROSE[0]} ${ROSE[1]}L${r(ROSE[0] + Math.cos(angle) * 24)} ${r(ROSE[1] + Math.sin(angle) * 24)}`;
}).join("");

// Foreground rooftops: chimney stack, two ridges with iron cresting, and a turret with a weathervane.
const NEAR =
  "M-80 1080V985H180V905h14v-22h10v22h16v-30h10v30h16v-22h10v22h14V985H330L520 930H820L950 1000H1050V940h12v-18h9v18h14v-18h9v18h12V1000H1200L1310 950H1540L1610 1000H1650V900h-8L1700 790L1758 900h-8V1000H2000V1080Z";
const cresting = (from: number, to: number, y: number) => {
  let d = "";
  for (let x = from, index = 0; x <= to; x += 12, index++) {
    d += index % 5 === 2 ? `M${x} ${y}l4 -19l4 19Z` : `M${x} ${y}l4 -10l4 10Z`;
  }
  return d;
};
const NEAR_DETAIL =
  cresting(528, 808, 931) + cresting(1318, 1530, 951) +
  "M1699 792V744h2v48ZM1680 753h32l-4 -4h3l8 5.500l-8 5.500h-3l4 -4h-32ZM1692 768h16v1.500h-16Z";

const ORRERY_TICKS = Array.from({ length: 24 }, (_, index) => {
  const angle = (index * Math.PI) / 12;
  const outer = index % 6 === 0 ? 126 : 119;
  return `M${r(Math.cos(angle) * 112)} ${r(Math.sin(angle) * 112)}L${r(Math.cos(angle) * outer)} ${r(Math.sin(angle) * outer)}`;
}).join("");

export function HomeScene() {
  return (
    <div className={styles.scene} aria-hidden="true">
      <div className={styles.camera}>
        {/* Sky: stars, an original constellation, the moon and a slowly turning orrery ring. */}
        <div className={styles.layer} data-depth="5">
          <div className={`${styles.sway} ${styles.swaySky}`}>
            <div className={styles.frame}>
              <Art box={[0, 0, W, 640]} className={styles.twinkleA}>{STARS[0]}</Art>
              <Art box={[0, 0, W, 640]} className={styles.twinkleB}>{STARS[1]}</Art>
              <Art box={[180, 130, 470, 210]}>
                <path className={styles.constellation} d={`M${CONSTELLATION.map(([x, y]) => `${x} ${y}`).join("L")}M388 186L362 292`} />
                {[...CONSTELLATION, [362, 292] as const].map(([x, y], index) => (
                  <circle key={index} cx={x} cy={y} r={index % 3 === 0 ? 2.6 : 1.8} className={styles.constellationNode} />
                ))}
              </Art>
              <Art box={[MOON[0] - 300, MOON[1] - 300, 600, 600]} className={styles.moonHalo}>
                <defs>
                  <radialGradient id="home-halo">
                    <stop offset="0" stopColor="#dcd6be" stopOpacity="0.34" />
                    <stop offset="0.35" stopColor="#b9bcc8" stopOpacity="0.13" />
                    <stop offset="1" stopColor="#b9bcc8" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx={MOON[0]} cy={MOON[1]} r="300" fill="url(#home-halo)" />
              </Art>
              <Art box={[MOON[0] - 160, MOON[1] - 160, 320, 320]} className={styles.orrery}>
                <g transform={`translate(${MOON[0]} ${MOON[1]})`}>
                  <circle r="112" className={styles.orreryLine} />
                  <circle r="150" className={styles.orreryDash} />
                  <path className={styles.orreryLine} d={ORRERY_TICKS} />
                  <circle cx="150" r="4" className={styles.orreryBody} />
                  <circle cx="-106" cy="106" r="2.6" className={styles.orreryBody} />
                  <circle cy="-112" r="3" className={styles.orreryBody} />
                </g>
              </Art>
              <Art box={[MOON[0] - 80, MOON[1] - 80, 160, 160]}>
                <defs>
                  <radialGradient id="home-moon" cx="0.4" cy="0.36" r="0.75">
                    <stop offset="0" stopColor="#f6f1e2" />
                    <stop offset="0.62" stopColor="#d2cab2" />
                    <stop offset="1" stopColor="#a39c88" />
                  </radialGradient>
                </defs>
                <circle cx={MOON[0]} cy={MOON[1]} r="66" fill="url(#home-moon)" />
                <path
                  className={styles.moonMaria}
                  d={`M${MOON[0] - 24} ${MOON[1] - 22}q16 -12 30 2q8 14 -8 22q-20 4 -22 -24ZM${MOON[0] + 12} ${MOON[1] + 16}q14 -6 20 8q-2 14 -16 12q-10 -8 -4 -20ZM${MOON[0] - 34} ${MOON[1] + 20}q8 -6 14 2q0 10 -10 8q-6 -4 -4 -10Z`}
                />
              </Art>
            </div>
          </div>
        </div>

        {/* Far skyline, hazed by distance. */}
        <div className={styles.layer} data-depth="9">
          <div className={`${styles.sway} ${styles.swayFar}`}>
            <div className={styles.frame}>
              <Art box={[0, 360, W, 720]}>
                <defs><path id="home-far" d={FAR.body} /></defs>
                <use href="#home-far" className={styles.farRim} />
                <use href="#home-far" className={styles.farBody} transform="translate(-1.2 1.4)" />
              </Art>
              <div className={`${styles.lit} ${styles.litFar}`}>
                <Art box={[0, 360, W, 720]} className={styles.flickerB}>
                  <path className={styles.farLights} d={FAR.lights[0] + FAR.lights[1]} />
                </Art>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.fog} ${styles.fogA}`} />

        {/* The clock tower: its own depth plane, between the far skyline and the rooftops. */}
        <div className={styles.layer} data-depth="13">
          <div className={`${styles.sway} ${styles.swayLandmark}`}>
            <div className={styles.frame}>
              <Art box={[TOWER_X - 140, 100, 280, 980]}>
                <defs>
                  <radialGradient id="home-clock-face">
                    <stop offset="0" stopColor="#fbeecb" />
                    <stop offset="0.7" stopColor="#ecc98a" />
                    <stop offset="1" stopColor="#b98f4b" />
                  </radialGradient>
                </defs>
                <g transform={`translate(${TOWER_X} 0)`}>
                  <path className={styles.towerRim} d={TOWER} />
                  <path className={styles.towerBody} d={TOWER} transform="translate(-2 1.6)" />
                  <path className={styles.towerBody} d="M-1.500 164V128h3v36Z" />
                  <circle cy="124" r="5" className={styles.towerRim} />
                  <path className={styles.towerLine} d="M-66 760H62M-58 640H54M-64 515H60M-64 376H60M-38 278H34M-22 228H18M-66 860H62" />
                  <path className={styles.towerDark} d={lancet(-36, 366, 15, 38) + lancet(-9.500, 366, 15, 38) + lancet(17, 366, 15, 38)} />
                  <path className={styles.towerDark} d={lancet(-34, 618, 17, 70) + lancet(13, 618, 17, 70) + lancet(-36, 840, 17, 62)} />
                  <path className={styles.towerLit} d={lancet(15, 840, 17, 62) + lancet(-6, 300, 9, 26)} />
                  <circle cy={CLOCK_Y} r="53" className={styles.clockRing} />
                  <circle cy={CLOCK_Y} r="46" fill="url(#home-clock-face)" />
                  <path className={styles.clockTick} d={CLOCK_TICKS} />
                  <g transform={`translate(0 ${CLOCK_Y})`}>
                    {/* Default 11:54; the client sets the visitor's local time. */}
                    <line y2="-24" className={styles.clockHand} data-clock-hand="hour" transform="rotate(357)" />
                    <line y2="-37" className={styles.clockHandThin} data-clock-hand="minute" transform="rotate(324)" />
                    <circle r="3.500" className={styles.clockPin} />
                  </g>
                </g>
              </Art>
              <div className={`${styles.lit} ${styles.litClock}`}>
                <Art box={[TOWER_X - 190, CLOCK_Y - 190, 380, 380]} className={styles.clockGlow}>
                  <defs>
                    <radialGradient id="home-clock-glow">
                      <stop offset="0" stopColor="#f2cf8c" stopOpacity="0.5" />
                      <stop offset="0.3" stopColor="#e8bf78" stopOpacity="0.16" />
                      <stop offset="1" stopColor="#e8bf78" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx={TOWER_X} cy={CLOCK_Y} r="190" fill="url(#home-clock-glow)" />
                </Art>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.fog} ${styles.fogB}`} />

        {/* Middle distance: rooftops, chimneys, towers and the cathedral, with lit windows. */}
        <div className={styles.layer} data-depth="18">
          <div className={`${styles.sway} ${styles.swayMid}`}>
            <div className={styles.frame}>
              <Art box={[0, 380, W, 700]}>
                <defs><path id="home-mid" d={MID.body + CATHEDRAL} /></defs>
                <use href="#home-mid" className={styles.midRim} />
                <use href="#home-mid" className={styles.midBody} transform="translate(-1.8 1.8)" />
                <path className={styles.midPanes} d={MID.panes + CATHEDRAL_PANES} />
              </Art>
              <div className={`${styles.lit} ${styles.litMid}`}>
                <Art box={[0, 380, W, 700]} className={styles.flickerA}>
                  <defs>
                    <radialGradient id="home-window-glow">
                      <stop offset="0" stopColor="#f1c877" stopOpacity="0.34" />
                      <stop offset="1" stopColor="#f1c877" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  {MID.glows.map(([x, y]) => (
                    <circle key={`${x}-${y}`} cx={x} cy={y} r="26" fill="url(#home-window-glow)" />
                  ))}
                  <path className={styles.midLights} d={MID.lights[0]} />
                  <circle cx={ROSE[0]} cy={ROSE[1]} r="60" fill="url(#home-window-glow)" />
                  <circle cx={ROSE[0]} cy={ROSE[1]} r="24" className={styles.midLights} />
                  <path className={styles.roseTracery} d={`${ROSE_TRACERY}M${ROSE[0] - 11} ${ROSE[1]}a11 11 0 1 0 22 0a11 11 0 1 0 -22 0`} />
                </Art>
                <Art box={[0, 380, W, 700]} className={styles.flickerB}>
                  <path className={styles.midLights} d={MID.lights[1] + lancet(1548, 800, 12, 46) + lancet(1592, 800, 12, 46)} />
                </Art>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.fog} ${styles.fogC}`} />

        {/* Foreground rooftops: the darkest plane, with the strongest parallax. */}
        <div className={styles.layer} data-depth="24">
          <div className={`${styles.sway} ${styles.swayNear}`}>
            <div className={styles.frame}>
              <Art box={[-80, 730, 2080, 350]}>
                <defs>
                  <path id="home-near" d={NEAR + NEAR_DETAIL} />
                  <radialGradient id="home-near-glow">
                    <stop offset="0" stopColor="#f3c873" stopOpacity="0.3" />
                    <stop offset="1" stopColor="#f3c873" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <use href="#home-near" className={styles.nearRim} />
                <use href="#home-near" className={styles.nearBody} transform="translate(-2 2)" />
              </Art>
              <div className={`${styles.lit} ${styles.litNear}`}>
                <Art box={[560, 880, 1240, 200]} className={styles.flickerA}>
                  <circle cx="660" cy="992" r="46" fill="url(#home-near-glow)" />
                  <path className={styles.nearLit} d={lancet(650, 1012, 20, 38)} />
                  <path className={styles.roseTracery} d="M660 974V1012M650 996H670" />
                  <circle cx="1700" cy="946" r="40" fill="url(#home-near-glow)" />
                  <circle cx="1700" cy="946" r="8" className={styles.nearLit} />
                  <path className={styles.roseTracery} d="M1692 946H1708M1700 938V954" />
                </Art>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.fog} ${styles.fogD}`} />
      </div>

      <div className={styles.scrim} />
      <div className={styles.grain} />
      <div className={styles.veil} />
      <div className={styles.introFog} />
    </div>
  );
}
