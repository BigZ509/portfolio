import { CanvasTexture, SRGBColorSpace } from "three";
import type { CardArtworkLayout, Project } from "@/data/projects";
import { cardMotifs } from "./card-motifs";

// The card face is designed in a 600×900 (2:3) coordinate space and rendered at any
// resolution by scaling the canvas context, so text and motifs stay crisp when enlarged.
const DESIGN_WIDTH = 600;
const DESIGN_HEIGHT = 900;

/** Region between the numeral and the caption divider where `panel` artwork is placed. */
const ART_WINDOW = { x: 50, y: 128, width: 500, height: 548 };

export type CardTextureArtwork = {
  image: CanvasImageSource;
  width: number;
  height: number;
  layout: CardArtworkLayout;
};

export type CardTextureOptions = {
  /** Texture height in pixels (width follows the 2:3 card ratio). Defaults to 900. */
  height?: number;
  /** Decoded illustration. Omit to draw the original geometric card. */
  artwork?: CardTextureArtwork;
};

function wrapTitle(context: CanvasRenderingContext2D, title: string, maxWidth: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of title.split(" ")) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && context.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Draws an image scaled to fit inside a box, centered, never stretched or cropped. */
function drawContained(
  context: CanvasRenderingContext2D,
  artwork: CardTextureArtwork,
  box: { x: number; y: number; width: number; height: number },
) {
  const scale = Math.min(box.width / artwork.width, box.height / artwork.height);
  const width = artwork.width * scale;
  const height = artwork.height * scale;
  context.drawImage(artwork.image, box.x + (box.width - width) / 2, box.y + (box.height - height) / 2, width, height);
}

function drawBackground(context: CanvasRenderingContext2D) {
  const background = context.createLinearGradient(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
  background.addColorStop(0, "#1b2239");
  background.addColorStop(0.52, "#121626");
  background.addColorStop(1, "#090b10");
  context.fillStyle = background;
  context.fillRect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
}

function drawMotif(context: CanvasRenderingContext2D, project: Project, gold: string) {
  context.save();
  context.translate(201, 260);
  context.scale(1.55, 1.55);
  context.strokeStyle = gold;
  context.lineWidth = 1.5;
  context.lineCap = "round";
  context.lineJoin = "round";
  const shape = cardMotifs[project.motif];
  for (const path of shape.paths) context.stroke(new Path2D(path));
  for (const circle of shape.circles ?? []) {
    context.beginPath();
    context.arc(circle.cx, circle.cy, circle.r, 0, Math.PI * 2);
    context.stroke();
  }
  for (const ellipse of shape.ellipses ?? []) {
    context.beginPath();
    context.ellipse(ellipse.cx, ellipse.cy, ellipse.rx, ellipse.ry, 0, 0, Math.PI * 2);
    context.stroke();
  }
  context.restore();
}

/**
 * Renders a card face to a CanvasTexture (sRGB).
 * - No artwork: the original geometric design.
 * - `panel` artwork: the original frame, numeral and caption, with the illustration in the art window.
 * - `full-card` artwork: the illustration alone, fitted to the card. Its own border and text are
 *   not duplicated; any letterbox space uses the card background.
 */
export function createTarotCardTexture(project: Project, options: CardTextureOptions = {}): CanvasTexture {
  const height = Math.round(options.height ?? DESIGN_HEIGHT);
  const width = Math.round((height * DESIGN_WIDTH) / DESIGN_HEIGHT);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2D canvas unavailable");
  context.scale(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  const { artwork } = options;
  drawBackground(context);

  if (artwork?.layout === "full-card") {
    drawContained(context, artwork, { x: 0, y: 0, width: DESIGN_WIDTH, height: DESIGN_HEIGHT });
    return toTexture(canvas);
  }

  const rootStyle = getComputedStyle(document.documentElement);
  const gold = rootStyle.getPropertyValue("--color-antique-gold").trim() || "#c9ae78";
  const ivory = rootStyle.getPropertyValue("--color-ivory").trim() || "#f1eee6";
  const muted = rootStyle.getPropertyValue("--color-text-muted").trim() || "#b6bac5";
  const displayFont = rootStyle.getPropertyValue("--font-display").trim() || "Georgia, serif";
  const bodyFont = rootStyle.getPropertyValue("--font-body").trim() || "Arial, sans-serif";

  const mist = context.createRadialGradient(300, 390, 30, 300, 390, 330);
  mist.addColorStop(0, "rgba(137,128,166,0.24)");
  mist.addColorStop(1, "rgba(137,128,166,0)");
  context.fillStyle = mist;
  context.fillRect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);

  context.strokeStyle = gold;
  context.lineWidth = 3;
  context.strokeRect(13, 13, 574, 874);
  context.globalAlpha = 0.58;
  context.lineWidth = 1;
  context.strokeRect(30, 30, 540, 840);
  context.beginPath();
  context.moveTo(50, 690);
  context.lineTo(550, 690);
  context.stroke();
  context.globalAlpha = 1;

  context.fillStyle = gold;
  context.font = `36px ${displayFont}`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(project.romanNumeral, 300, 85);

  if (artwork) {
    drawContained(context, artwork, ART_WINDOW);
  } else {
    drawMotif(context, project, gold);
  }

  context.fillStyle = gold;
  context.font = `54px ${displayFont}`;
  context.fillText(project.tarotIdentity, 300, 744, 500);

  context.fillStyle = ivory;
  context.font = `27px ${bodyFont}`;
  const titleLines = wrapTitle(context, project.title, 480);
  titleLines.forEach((line, index) => context.fillText(line, 300, 800 + index * 34));
  if (project.status === "in-development") {
    context.fillStyle = muted;
    context.font = `20px ${bodyFont}`;
    context.fillText("In development", 300, 864);
  }

  return toTexture(canvas);
}

function toTexture(canvas: HTMLCanvasElement) {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
