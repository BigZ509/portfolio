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
    setting: "Road Report · Hackathon",
    participation:
      "At a hackathon, I worked on Road Report's hazard classifier. Short descriptions left room for more than one interpretation, so the challenge was knowing when to ask for more information instead of pretending a category was certain.",
    focus: [
      "Weighted phrase matching kept the classification path explainable under a short deadline.",
      "A clarification path gave uncertain and unrelated reports a more useful next step.",
      "The experience reinforced the value of building a narrow, testable first version.",
    ],
    projectSlug: "road-report",
  },
  {
    id: "system-design-workshop",
    kind: "workshop",
    title: "Attending a System Design Workshop",
    setting: "Learning with others",
    participation:
      "I attended to learn from others, discuss technical ideas, and see different ways to approach system design. Shared diagrams made it easier to follow how a design takes shape through conversation.",
    focus: [
      "Seeing other approaches gave me questions to bring back to my own work.",
    ],
  },
];

