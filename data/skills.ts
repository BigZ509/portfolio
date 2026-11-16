/**
 * Skills, grouped by what they are actually used to do rather than by a flat taxonomy.
 *
 * `evidence` records where each entry is supported: a project slug from `data/projects.ts`, or
 * "owner" for a skill the owner has stated but which no project record demonstrates. Nothing here
 * carries a proficiency score, ranking or year count — none of that is established.
 */

export type SkillGroupKey = "engineering" | "intelligence" | "physical" | "toolkit";

export type Skill = {
  name: string;
  group: SkillGroupKey;
  /** Project slugs that demonstrate the skill, or "owner" when it is owner-stated only. */
  evidence: readonly string[];
};

export const skillGroups = [
  {
    key: "engineering" as const,
    label: "Software engineering",
    blurb: "Building and shipping the application and the service behind it.",
  },
  {
    key: "intelligence" as const,
    label: "AI, vision & real-time systems",
    blurb: "Making a program respond to speech, motion and the world as it happens.",
  },
  {
    key: "physical" as const,
    label: "Robotics, embedded & CAD",
    blurb: "Taking the work off the screen and into hardware.",
  },
  {
    key: "toolkit" as const,
    label: "Languages & tools",
    blurb: "The everyday kit underneath all of it.",
  },
] as const;

export const skills: readonly Skill[] = [
  // Software engineering
  { name: "React", group: "engineering", evidence: ["road-report", "zbxp"] },
  { name: "Next.js", group: "engineering", evidence: ["road-report"] },
  { name: "React Native", group: "engineering", evidence: ["speaklab-ai"] },
  { name: "Expo", group: "engineering", evidence: ["speaklab-ai"] },
  { name: "Node.js", group: "engineering", evidence: ["speaklab-ai", "guiding-hands"] },
  { name: "Express", group: "engineering", evidence: ["speaklab-ai"] },
  { name: "PostgreSQL", group: "engineering", evidence: ["road-report"] },
  { name: "Firebase", group: "engineering", evidence: ["speaklab-ai"] },

  // AI, vision and real-time systems
  { name: "OpenCV", group: "intelligence", evidence: ["guiding-hands"] },
  { name: "MediaPipe", group: "intelligence", evidence: ["guiding-hands"] },
  { name: "Whisper", group: "intelligence", evidence: ["speaklab-ai"] },
  { name: "WebSockets", group: "intelligence", evidence: ["guiding-hands"] },
  { name: "UDP", group: "intelligence", evidence: ["guiding-hands"] },
  { name: "MapLibre GL", group: "intelligence", evidence: ["road-report"] },

  // Robotics, embedded and CAD
  { name: "Autodesk Fusion", group: "physical", evidence: ["autonomous-delivery-rover"] },
  { name: "Jetson Orin Nano", group: "physical", evidence: ["guiding-hands"] },
  { name: "Raspberry Pi", group: "physical", evidence: ["autonomous-delivery-rover"] },
  { name: "ESP32", group: "physical", evidence: ["autonomous-delivery-rover"] },

  // Languages and tools
  { name: "TypeScript", group: "toolkit", evidence: ["speaklab-ai", "road-report"] },
  { name: "JavaScript", group: "toolkit", evidence: ["zbxp"] },
  { name: "Python", group: "toolkit", evidence: ["guiding-hands"] },
  // C and C++ are owner-stated. No project record in this repository demonstrates either;
  // C was added at the owner's direction during the Phase 5 review.
  { name: "C", group: "toolkit", evidence: ["owner"] },
  { name: "C++", group: "toolkit", evidence: ["owner"] },
  { name: "Three.js", group: "toolkit", evidence: ["owner"] },
  { name: "WebGL", group: "toolkit", evidence: ["owner"] },
  { name: "Git", group: "toolkit", evidence: ["owner"] },
];
