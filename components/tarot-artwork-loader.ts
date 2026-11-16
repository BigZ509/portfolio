import type { CardArtwork } from "@/data/projects";

export type LoadedArtwork = {
  image: HTMLImageElement;
  width: number;
  height: number;
};

/** Only same-origin, root-relative paths: cross-origin images would taint the canvas for WebGL. */
export function isLocalArtworkPath(src: string): boolean {
  return src.startsWith("/") && !src.startsWith("//");
}

/**
 * Loads and decodes a card illustration. Rejects on a missing/broken file, a non-local path,
 * or abort (component unmounted). Callers fall back to the geometric card on rejection.
 */
export function loadTarotArtwork(artwork: CardArtwork, signal: AbortSignal): Promise<LoadedArtwork> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Artwork load aborted", "AbortError"));
      return;
    }
    if (!isLocalArtworkPath(artwork.src)) {
      reject(new Error(`Card artwork must be a local path under /images/tarot/: ${artwork.src}`));
      return;
    }

    const image = new Image();
    image.decoding = "async";
    const onAbort = () => {
      image.removeAttribute("src");
      reject(new DOMException("Artwork load aborted", "AbortError"));
    };
    signal.addEventListener("abort", onAbort, { once: true });

    image.src = artwork.src;
    image
      .decode()
      .then(() => {
        if (signal.aborted) return;
        if (image.naturalWidth === 0 || image.naturalHeight === 0) throw new Error("Image has no pixels");
        const declared = artwork.width / artwork.height;
        const actual = image.naturalWidth / image.naturalHeight;
        if (Math.abs(declared - actual) / declared > 0.01) {
          console.warn(
            `[tarot] ${artwork.src} is ${image.naturalWidth}×${image.naturalHeight} but declared ${artwork.width}×${artwork.height}; using its real proportions.`,
          );
        }
        resolve({ image, width: image.naturalWidth, height: image.naturalHeight });
      })
      .catch((error: unknown) => {
        if (!signal.aborted) reject(error instanceof Error ? error : new Error(String(error)));
      })
      .finally(() => signal.removeEventListener("abort", onAbort));
  });
}
