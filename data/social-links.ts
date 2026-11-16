/**
 * Contact destinations.
 *
 * Only entries marked `verified: true` are rendered publicly. The rest were template placeholders
 * that shipped as working-looking links — `https://github.com/`, `https://linkedin.com/in/` and
 * `mailto:contact@example.com` — which send visitors nowhere. They are kept here, unpublished, so
 * the owner can fill in real destinations rather than have them silently reinvented.
 *
 * To publish one: replace `href` with the real destination and set `verified: true`.
 */

export type SocialLink = {
  label: string;
  href: string;
  /** Short identifier for icon selection. */
  icon: "github" | "linkedin" | "email";
  /**
   * False means the destination is unconfirmed and the link is withheld from the page.
   * Never set this true for a guessed address.
   */
  verified: boolean;
  /** Shown beside the link so the invitation reads as a person, not a button row. */
  note?: string;
};

export const socialLinks: readonly SocialLink[] = [
  {
    label: "GitHub",
    // Evidenced by this repository's own origin remote, which the owner pushes to.
    href: "https://github.com/BigZ509",
    icon: "github",
    verified: true,
    note: "Where the projects live.",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/",
    icon: "linkedin",
    verified: false,
    note: "Add a real profile URL to publish this.",
  },
  {
    label: "Email",
    href: "mailto:contact@example.com",
    icon: "email",
    verified: false,
    note: "Add the address you want shown publicly to publish this.",
  },
];

/** The only list a public page should render. */
export const publicSocialLinks = socialLinks.filter((link) => link.verified);
