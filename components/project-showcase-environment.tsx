import styles from "./project-showcase-environment.module.css";

export function ProjectShowcaseEnvironment() {
  return (
    <div className={styles.environment} aria-hidden="true">
      <div className={`${styles.parallaxLayer} ${styles.farLayer}`}>
        <div className={`${styles.driftLayer} ${styles.farDrift}`}>
          <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
            <path
              className={styles.farStone}
              d="M0 900V686l54-42 45 13 54-92 72 58v-87l53-38 50 42v112l46-32 58 26 40-78 46 36V548l67-54 70 48v99l37-28 55 27 52-84 63 47v-73l66-50 67 54v128l39-31 45 20 53-95 73 60V586l60-45 54 37 42 98 57-23 42 32V900Z"
            />
            <path className={styles.farWindow} d="M289 900V666h31v-82h30v82h31v234m416 0V637h32v-78h32v78h32v263m420 0V680h30v-76h30v76h30v220" />
          </svg>
        </div>
      </div>
      <div className={`${styles.parallaxLayer} ${styles.middleLayer}`}>
        <div className={`${styles.driftLayer} ${styles.middleDrift}`}>
          <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
            <path
              className={styles.middleStone}
              d="M0 900V768h108V630l55-44 56 44v138h65V536h56V390l67-82 68 82v146h55v222h77V606h48V486q0-110 110-110t110 110v120h48v294h79V544h55V404l62-72 62 72v140h53v224h74V650l57-44 57 44v118h93v132Z"
            />
            <path className={styles.archOutline} d="M466 900V407q0-155 154-155t154 155v493M532 900V426q0-88 88-88t88 88v474M1112 900V429q0-121 120-121t120 121v471" />
            <path className={styles.archDetail} d="M466 609h308m-278-34h248m-212-47h176M1112 592h240m-218-36h196m-170-39h144M610 251v-76m-30 20 30-45 30 45m520 133v-69m-26 17 26-38 26 38" />
          </svg>
        </div>
      </div>
      <div className={`${styles.parallaxLayer} ${styles.foregroundLayer}`}>
        <div className={`${styles.driftLayer} ${styles.foregroundDrift}`}>
          <svg viewBox="0 0 1600 900" preserveAspectRatio="none">
            <path className={styles.frameStone} d="M0 0h196l-18 25v712l28 24v139H0Zm1600 0h-196l18 25v712l-28 24v139h206ZM180 25Q800-85 1420 25" />
            <path className={styles.frameGold} d="M34 0v862m22-862v851m1508-851v862m-22-862v851M202 58Q800-34 1398 58M12 794h143m-143 22h143m1290-22h143m-143 22h143" />
            <path className={styles.frameOrnament} d="M83 112h45m-22-22v44m1368-22h45m-22-22v44M83 761h45m-22-22v44m1368-22h45m-22-22v44" />
          </svg>
        </div>
      </div>
      <div className={`${styles.fog} ${styles.fogHigh}`} />
      <div className={`${styles.fog} ${styles.fogLow}`} />
      <div className={styles.vignette} />
    </div>
  );
}
