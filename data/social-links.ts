export type SocialLink = {
  label: string;
  href: string;
  /** Short identifier for icon selection. */
  icon: "github" | "linkedin" | "email";
};

export const socialLinks: readonly SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/",
    icon: "github",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/",
    icon: "linkedin",
  },
  {
    label: "Email",
    href: "mailto:contact@example.com",
    icon: "email",
  },
];
