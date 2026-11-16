export type Experience = {
  id: number;
  role: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string;
  highlights?: readonly string[];
};

/**
 * Experience records. Dates are formatted as display strings (e.g. "Sep 2024").
 * Omit `endDate` for current roles. Specific employers and dates should be confirmed
 * with the portfolio owner before publishing.
 */
export const experiences: readonly Experience[] = [
  {
    id: 1,
    role: "Software Engineer",
    organization: "To be confirmed",
    startDate: "2024",
    description:
      "Full-stack development and engineering projects across web, mobile, and embedded systems.",
    highlights: [
      "Built and maintained React and Next.js web applications",
      "Developed mobile applications with React Native and Expo",
      "Integrated AI and computer-vision pipelines",
    ],
  },
];
