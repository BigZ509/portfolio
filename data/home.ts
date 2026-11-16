/** Homepage identity and portrait. Everything here is owner-supplied; nothing is inferred. */

export type HomePortrait = {
  /** Local file under /public, e.g. "/images/home/portrait.webp" → public/images/home/portrait.webp. */
  src: `/images/home/${string}.webp`;
  alt: string;
  /** Intrinsic pixel size. The frame is built to this ratio, so the photo is never cropped. */
  width: number;
  height: number;
  /** Optional line on the plaque under the frame. Defaults to `ownerName` when that is set. */
  caption?: string;
};

export type HomeContent = {
  /** Shown beneath the title when set. Nothing is displayed while this is null. */
  ownerName: string | null;
  disciplines: readonly string[];
  /** Taken from the existing About page copy. */
  statement: string;
  /** Owner-supplied portrait, kept at its natural aspect ratio. */
  portrait: HomePortrait | null;
};

export const home: HomeContent = {
  // The hero copy now introduces Marc by name, so a separate byline under the giant
  // MARC'S WORLD heading would only repeat it. The field stays supported for future use.
  ownerName: null,
  disciplines: ["Software", "AI", "Robotics"],
  statement: "Hey, I'm Marc. I study computer science at UCF, and I build things that bring software into the real world.",
  portrait: {
    src: "/images/home/graduation.webp",
    alt: "Marc in a black graduation cap and gown outside an arena.",
    width: 1152,
    height: 1536,
    caption: "The person behind the work",
  },
};
