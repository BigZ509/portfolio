"use client";

import { useInfiniteVoid } from "./infinite-void/infinite-void-provider";

/**
 * Page background. Previously a static CSS gradient; it now requests the Infinite Void scene
 * (components/infinite-void), which the root layout renders once behind every page that includes
 * this component. What remains here is only a light readability veil over that scene — localized
 * at the top and bottom edges, clear through the middle — rather than an opaque wash.
 */
export function AtmosphericBackground() {
  useInfiniteVoid();
  return <div aria-hidden="true" className="atmospheric-background" />;
}
