// Pure helpers for carousel input handling. Kept free of Three.js and React so
// the interaction math can be reasoned about (and tested) in isolation.

const DOM_DELTA_LINE = 1;
const DOM_DELTA_PAGE = 2;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Converts a WheelEvent delta to pixels regardless of the browser's deltaMode. */
export function normalizeWheelDelta(delta: number, deltaMode: number, lineHeight: number, pageSize: number): number {
  if (deltaMode === DOM_DELTA_LINE) return delta * lineHeight;
  if (deltaMode === DOM_DELTA_PAGE) return delta * pageSize;
  return delta;
}

/**
 * Heuristic: precision trackpads (and smooth-scrolling wheels) report small or
 * fractional pixel deltas in rapid streams; classic mouse wheels report large,
 * integral notches or line/page units.
 */
export function isLikelyTrackpad(delta: number, deltaMode: number, msSincePreviousEvent: number, notchThreshold: number): boolean {
  if (deltaMode !== 0) return false;
  const magnitude = Math.abs(delta);
  return magnitude < notchThreshold || !Number.isInteger(magnitude) || msSincePreviousEvent < 35;
}

/** Fraction (0–1) of an element's height currently inside the window viewport. */
export function visibleHeightRatio(element: Element): number {
  const rect = element.getBoundingClientRect();
  if (rect.height <= 0) return 0;
  const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
  return clamp(visible / rect.height, 0, 1);
}

const EDITABLE_ROLES = '[contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="combobox"], [role="slider"], [role="spinbutton"], [role="searchbox"]';

/** True when arrow keys belong to the focused element (text entry, selects, sliders). */
export function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
    return true;
  }
  return target.closest(EDITABLE_ROLES) !== null;
}
