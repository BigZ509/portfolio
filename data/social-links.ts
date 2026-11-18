/**
 * Contact destinations.
 *
 * Only entries marked `verified: true` are rendered publicly, and every one of them must be the
 * owner's real destination. Earlier template placeholders (`https://linkedin.com/in/` and
 * `mailto:contact@example.com`) sent visitors nowhere; they have been removed rather than kept as
 * working-looking links. No public email address has been supplied, so none is listed.
 *
 * To add one: use the real destination and set `verified: true`. Never publish a guessed address.
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
    // Evidenced by this repository's own origin remote, which the owner pushes to, and printed on
    // the owner's resume.
    href: "https://github.com/BigZ509",
    icon: "github",
    verified: true,
    note: "Where the projects live.",
  },
  {
    label: "LinkedIn",
    // Exact profile URL printed on the owner's supplied resume (public/resume/Marc-Alexis-Resume.pdf).
    href: "https://www.linkedin.com/in/marc-alexis-6714b6191/",
    icon: "linkedin",
    verified: true,
    note: "Experience, coursework and updates.",
  },
];

/** The only list a public page should render. */
export const publicSocialLinks = socialLinks.filter((link) => link.verified);
