import type { CardMotif } from "@/data/projects";

type Circle = { cx: number; cy: number; r: number };
type Ellipse = { cx: number; cy: number; rx: number; ry: number };

export type MotifShape = {
  paths: readonly string[];
  circles?: readonly Circle[];
  ellipses?: readonly Ellipse[];
};

// Original geometric symbols shared by the DOM card and its canvas texture.
export const cardMotifs: Record<CardMotif, MotifShape> = {
  threshold: {
    paths: [
      "M32 75V35c0-17 14-31 32-31s32 14 32 31v40",
      "M25 75h78M40 75l24-24 24 24M64 51V28",
    ],
    circles: [{ cx: 64, cy: 20, r: 4 }],
  },
  orbit: {
    paths: ["M25 64h78M64 25v78"],
    circles: [{ cx: 64, cy: 64, r: 39 }, { cx: 64, cy: 64, r: 5 }],
    ellipses: [{ cx: 64, cy: 64, rx: 18, ry: 39 }],
  },
  spark: {
    paths: [
      "M64 17l9 36 36 11-36 11-9 36-9-36-36-11 36-11z",
      "M25 28l9 9M103 28l-9 9M25 100l9-9M103 100l-9-9",
    ],
    circles: [{ cx: 64, cy: 64, r: 7 }],
  },
  balance: {
    paths: ["M64 20v79M35 42h58M35 42l-14 30h28L35 42zM93 42L79 72h28L93 42zM44 100h40"],
    circles: [{ cx: 64, cy: 25, r: 5 }],
  },
  star: {
    paths: ["M64 15l8 34 32-17-17 32 32 8-34 8 17 32-32-17-8 34-8-34-32 17 17-32-34-8 34-8-17-32 32 17z"],
    circles: [{ cx: 64, cy: 64, r: 10 }],
  },
};
