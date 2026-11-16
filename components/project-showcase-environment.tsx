import type { ReactNode } from "react";
import styles from "./project-showcase-environment.module.css";

/*
 * Original Victorian-gothic night city for the project showcase (all shapes drawn for MARC'S WORLD).
 * Each city layer is a 1600×900 tile whose left and right edges match, repeated three times and
 * translated by exactly one tile, so the drift loops seamlessly. Layers drift at different speeds
 * (parallax depth); mouse parallax is applied through CSS variables set on the stage.
 */

const TILE = "0 0 1600 900";

function Loop({ className, children }: { className: string; children: ReactNode }) {
  return (
    <div className={`${styles.loop} ${className}`}>
      {[0, 1, 2].map((copy) => (
        <svg key={copy} viewBox={TILE} preserveAspectRatio="xMinYMax meet" className={styles.tile}>
          {children}
        </svg>
      ))}
    </div>
  );
}

const archWindow = (x: number, y: number, w = 12, h = 20) =>
  `M${x} ${y}v-${h}q${w / 2}-${w * 0.9} ${w} 0v${h}Z`;

const FAR_WINDOWS = [
  [372, 455], [380, 470], [884, 445], [622, 520], [1116, 470], [1365, 500], [158, 540], [260, 560], [1240, 575], [1508, 570],
].map(([x, y]) => `M${x} ${y}h5v8h-5Z`).join("");

const MID_WINDOWS = [
  archWindow(88, 680), archWindow(312, 650), archWindow(330, 650), archWindow(594, 600, 10, 18), archWindow(752, 690),
  archWindow(1018, 640), archWindow(1036, 640), archWindow(1220, 690), archWindow(1494, 690), archWindow(186, 690, 10, 16),
].join("");

const RAIL_BARS = Array.from({ length: 80 }, (_, index) => `M${index * 20 + 6} 822v-26`).join("");

export function ProjectShowcaseEnvironment() {
  return (
    <div className={styles.environment} aria-hidden="true">
      {/* Sky, moon and stars: deepest layer, mouse parallax only. */}
      <div className={`${styles.layer} ${styles.sky}`}>
        <div className={styles.moonHalo} />
        <div className={styles.moon} />
        <div className={styles.stars} />
      </div>

      <div className={`${styles.layer} ${styles.far}`}>
        <Loop className={styles.farLoop}>
          <path
            className={styles.farStone}
            d="M0 900V600h60v-40h30v40h50v-80l20-50 20 50v80h50v-60q30-40 60 0v60h50V480h20v-60l15-90 15 90v60h20v120h60v-45h50v45h60v-100l30-45 30 45v100h60v-30h30v-50h30v50h40v30h50V430h20v-50q15-30 30 0v50h20v170h70v-55h50v55h50v-95l20-65 10-40 10 40 20 65v95h60v-40q30-35 60 0v40h50v-90h30v-40h30v40h30v90h60v-50l30-35 30 35v50h70v300Z"
          />
          <circle className={styles.clockFace} cx="885" cy="414" r="13" />
          <path className={styles.farLights} d={FAR_WINDOWS} />
        </Loop>
      </div>

      <div className={`${styles.fog} ${styles.fogBack}`} />

      {/* Occult sigil: a slowly turning ring behind the screenshots. */}
      <div className={`${styles.layer} ${styles.sigilLayer}`}>
        <svg viewBox="-220 -220 440 440" className={styles.sigil}>
          <circle r="208" className={styles.sigilLine} />
          <circle r="186" className={styles.sigilFaint} />
          <circle r="120" className={styles.sigilFaint} />
          <path
            className={styles.sigilLine}
            d={Array.from({ length: 7 }, (_, index) => {
              const angle = (index * 3 * 2 * Math.PI) / 7 - Math.PI / 2;
              return `${index === 0 ? "M" : "L"}${(Math.cos(angle) * 118).toFixed(1)} ${(Math.sin(angle) * 118).toFixed(1)}`;
            }).join("") + "Z"}
          />
          <path
            className={styles.sigilFaint}
            d={Array.from({ length: 28 }, (_, index) => {
              const angle = (index * 2 * Math.PI) / 28;
              const inner = index % 4 === 0 ? 186 : 194;
              return `M${(Math.cos(angle) * inner).toFixed(1)} ${(Math.sin(angle) * inner).toFixed(1)}L${(Math.cos(angle) * 208).toFixed(1)} ${(Math.sin(angle) * 208).toFixed(1)}`;
            }).join("")}
          />
          {["☉", "☽", "☿", "♀", "♂", "♃", "♄"].map((glyph, index) => {
            const angle = (index * 2 * Math.PI) / 7 - Math.PI / 2;
            return (
              <text key={glyph} x={(Math.cos(angle) * 153).toFixed(1)} y={(Math.sin(angle) * 153).toFixed(1)} className={styles.sigilGlyph}>
                {glyph}
              </text>
            );
          })}
        </svg>
      </div>

      <div className={`${styles.layer} ${styles.middle}`}>
        <Loop className={styles.midLoop}>
          <path
            className={styles.midStone}
            d="M0 900V700h40l55-90 55 90h20v-60h30v-40h15v40h25v60h40v-80l40-60 40 60v80h60l50-60 50 60h40V590h25v-45l15-45 15 45v45h25v110h60l60-75 60 75h30v-50h30v-40h15v40h25v50h60V600l50-70 50 70v100h50v-40h60l35-45 35 45v40h60v-90h25v-40h15v40h25v90h55l60-70 60 70h40v200Z"
          />
          <path className={styles.midTrim} d="M40 700l55-90 55 90M280 620l40-60 40 60M420 700l50-60 50 60M700 700l60-75 60 75M980 600l50-70 50 70M1440 700l60-70 60 70" />
          <path className={styles.midLights} d={MID_WINDOWS} />
        </Loop>
      </div>

      <div className={`${styles.fog} ${styles.fogMid}`} />

      <div className={`${styles.layer} ${styles.near}`}>
        <Loop className={styles.nearLoop}>
          <path
            className={styles.nearStone}
            d="M0 900V822h120v-32h30v32h150l30-20h90l30 20h150v-42h40v42h180v-27h40v27h140l40-32h80l30 32h150v-37h40v37h260v78Z"
          />
          <path className={styles.rail} d={`M0 796h1600M0 804h1600${RAIL_BARS}`} />
          {[230, 1060].map((x) => (
            <g key={x}>
              <circle cx={x} cy="700" r="34" className={styles.lampGlow} />
              <path className={styles.lampPost} d={`M${x - 2.5} 822V716h5v106ZM${x - 9} 690h18l-3 -8h-12ZM${x - 7} 712h14l2 4h-18Z`} />
              <path className={styles.lampFlame} d={`M${x - 6} 692h12v20h-12Z`} />
            </g>
          ))}
        </Loop>
      </div>

      <div className={`${styles.fog} ${styles.fogFront}`} />

      {/* Gothic pointed-arch frame (foreground, strongest parallax). */}
      <div className={`${styles.layer} ${styles.front}`}>
        <svg viewBox="0 0 1600 900" preserveAspectRatio="none" className={styles.frame}>
          <path className={styles.frameStone} fillRule="evenodd" d="M-40-40H1640V940H-40ZM96 940V270Q96 70 800 34Q1504 70 1504 270V940Z" />
          <path className={styles.frameGold} d="M118 940V274Q118 92 800 56Q1482 92 1482 274V940" vectorEffect="non-scaling-stroke" />
          <path className={styles.frameFaint} d="M140 940V280Q140 114 800 78Q1460 114 1460 280V940M48 0v900M1552 0v900" vectorEffect="non-scaling-stroke" />
          <path className={styles.frameGold} d="M60 330h28M60 600h28M1512 330h28M1512 600h28M74 316v28M74 586v28M1526 316v28M1526 586v28" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className={styles.keystone}>
          <svg viewBox="-30 -30 60 60">
            <circle r="22" className={styles.keystoneRing} />
            <path className={styles.keystoneMark} d="M7-12a13 13 0 1 0 0 24a10 10 0 1 1 0-24ZM13-4l2 4 4 1-4 2-1 4-2-4-4-1 4-2Z" />
          </svg>
        </div>
      </div>

      <div className={styles.vignette} />
    </div>
  );
}
