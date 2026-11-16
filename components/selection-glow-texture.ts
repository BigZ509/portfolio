import { CanvasTexture, SRGBColorSpace } from "three";

const PIXELS_PER_UNIT = 120;

/**
 * Transparent halo drawn behind a selected card: a soft antique-gold glow plus a thin
 * border just outside the card edge. The card itself (and its artwork) is untouched;
 * this plane is larger than the card by `scale` and sits slightly behind it.
 */
export function createSelectionGlowTexture(cardWidth: number, cardHeight: number, scale: number): CanvasTexture {
  const width = Math.round(cardWidth * scale * PIXELS_PER_UNIT);
  const height = Math.round(cardHeight * scale * PIXELS_PER_UNIT);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2D canvas unavailable");

  const gold = getComputedStyle(document.documentElement).getPropertyValue("--color-antique-gold").trim() || "#c9ae78";
  const cardPixelWidth = cardWidth * PIXELS_PER_UNIT;
  const cardPixelHeight = cardHeight * PIXELS_PER_UNIT;
  const insetX = (width - cardPixelWidth) / 2;
  const insetY = (height - cardPixelHeight) / 2;
  const margin = Math.min(insetX, insetY);

  // Soft halo: the filled rectangle is hidden behind the opaque card; only its blur shows.
  context.shadowColor = gold;
  context.shadowBlur = margin * 0.85;
  context.fillStyle = gold;
  context.globalAlpha = 0.55;
  context.fillRect(insetX, insetY, cardPixelWidth, cardPixelHeight);

  // Thin border emphasis just outside the card's own gold frame.
  context.shadowBlur = 0;
  context.globalAlpha = 0.9;
  context.strokeStyle = gold;
  context.lineWidth = 3;
  context.strokeRect(insetX - 5, insetY - 5, cardPixelWidth + 10, cardPixelHeight + 10);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
