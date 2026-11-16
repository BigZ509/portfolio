/*
 * Adapted from GarunJad/Anime-Portfolio @ a2700feea9e022a1f95b94d971e9956173265553
 * Source: https://github.com/GarunJad/Anime-Portfolio  (index.html, .mirror-divider L161–165)
 * Author: GarunJad
 * Authorization: MIT (per README) + owner-held authorization, see docs/source-permissions.md
 *
 * Changes: ported to a React server component with CSS Module classes; the reflected copy is
 * marked aria-hidden so screen readers announce the divider text once, not twice.
 */

import styles from "./mirror-divider.module.css";

export function MirrorDivider({ text }: { text: string }) {
  return (
    <div className={styles.divider} data-mirror-divider="">
      <span className={styles.top} data-mirror-top="">{text}</span>
      <span className={styles.bottom} data-mirror-bottom="" aria-hidden="true">{text}</span>
    </div>
  );
}
