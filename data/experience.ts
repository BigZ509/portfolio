/**
 * Public participation records supported by the owner's project notes or photographs.
 * No employer, event date, team size, award or formal role has been verified.
 */
export type ExperienceEntry = {
  id: string;
  kind: "hackathon" | "workshop";
  title: string;
  setting: string;
  participation: string;
  focus: readonly string[];
  projectSlug?: string;
};

export const experienceEntries: readonly ExperienceEntry[] = [
  {
    id: "road-report-hackathon",
    kind: "hackathon",
    title: "Building under a hackathon deadline",
    setting: "Road Report · civic technology",
    participation:
      "I participated in a hackathon through Road Report, a road-hazard reporting project. The work had to turn a brief description into a useful category without treating every sentence as a certain match.",
    focus: [
      "Weighted phrase rules score possible hazard categories.",
      "Ambiguous and unrelated reports prompt a clarification instead of a forced answer.",
      "The map interface gives reports a location and incident context.",
    ],
    projectSlug: "road-report",
  },
  {
    id: "ctoc-system-design",
    kind: "workshop",
    title: "Learning in the room",
    setting: "System design workshop · CTOC Labs",
    participation:
      "I attended a system design workshop at CTOC Labs. The session put architecture diagrams in front of the room for discussion, a different setting from working through a design alone.",
    focus: [
      "The examples were visible on shared screens, with diagrams the room could refer to together.",
    ],
  },
];

/** Internal, unverified historical placeholder. Never render this as employment. */
export const draftEmploymentRecords = [
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
] as const;
