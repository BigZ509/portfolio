/**
 * Engineering involvement shown on the public Experience page.
 *
 * This file deliberately contains NO employment claims. The previous `experiences` array held a
 * "Software Engineer / To be confirmed / 2024 — Present" placeholder that rendered publicly as a
 * real job; it is preserved below as `draftEmploymentRecords`, unexported from the page and
 * explicitly not for display, until the owner supplies verified employers, dates and duties.
 *
 * Every entry here is derived from a record in `data/projects.ts` or from an owner-supplied
 * photograph. Fields that cannot be established — employer, dates, formal role — are omitted
 * rather than invented, and `period` is only ever set when a real date is known.
 */

import type { ProjectStatus } from "./projects";

export type InvolvementKind = "project" | "hackathon" | "workshop";

export type Involvement = {
  id: number;
  kind: InvolvementKind;
  title: string;
  /** What kind of work this was. Never an employer unless one is verified. */
  context: string;
  /** Only set when a real date is established. Omitted otherwise — never guessed. */
  period?: string;
  summary: string;
  highlights?: readonly string[];
  /** Links through to the matching card in the Projects showcase. */
  projectSlug?: string;
  /** Mirrors the project record so the page can label in-development work honestly. */
  status?: ProjectStatus;
  technologies?: readonly string[];
};

export const involvement: readonly Involvement[] = [
  {
    id: 1,
    kind: "project",
    title: "Guiding Hands",
    context: "Computer vision · rehabilitation",
    summary:
      "A computer-vision rehabilitation game that guides at-home hand exercises by tracking hand gestures through a webcam.",
    highlights: [
      "Gesture classification from MediaPipe hand landmarks with Python and OpenCV",
      "A Python controller sends commands over UDP to a Node.js service, which forwards updates to the browser over WebSockets",
      "Tested with Jetson Orin Nano hardware",
    ],
    technologies: ["Python", "OpenCV", "MediaPipe", "Node.js", "WebSockets", "Jetson Orin Nano"],
    projectSlug: "guiding-hands",
    status: "to-confirm",
  },
  {
    id: 2,
    kind: "project",
    title: "SpeakLab AI",
    context: "Mobile · AI communication",
    summary:
      "An AI-assisted mobile app for practising public speaking, pairing speech transcription with feedback on delivery.",
    highlights: [
      "React Native and Expo client with a Node.js, Express and TypeScript backend",
      "Firebase Authentication and Cloud Firestore for accounts and session data, with user-ownership checks on reads",
      "Whisper transcription feeding speech metrics and filler-word analysis",
    ],
    technologies: ["React Native", "Expo", "TypeScript", "Firebase", "Whisper"],
    projectSlug: "speaklab-ai",
    status: "to-confirm",
  },
  {
    id: 3,
    kind: "hackathon",
    title: "Road Report",
    context: "Hackathon project · civic technology",
    summary:
      "Hackathon work on reporting and classifying road hazards, built around a weighted phrase-rule classifier and a map interface.",
    highlights: [
      "Scores phrase matches to assign hazard categories",
      "Asks for clarification when a report is ambiguous or outside the road-hazard domain",
      "Map-based interface with report models for coordinates, Google Place IDs and incident IDs",
    ],
    technologies: ["Next.js", "React", "TypeScript", "MapLibre GL", "PostgreSQL"],
    projectSlug: "road-report",
    status: "to-confirm",
  },
  {
    id: 4,
    kind: "project",
    title: "Autonomous Delivery Rover",
    context: "Robotics · mechanical design",
    summary:
      "A four-wheel delivery rover designed in Autodesk Fusion, with a removable cargo tray and camera mast. Mechanical design is the completed part; the hardware build and autonomous navigation are still ahead.",
    highlights: [
      "Four-wheel platform modelled in Autodesk Fusion",
      "Raspberry Pi 4, ESP32, LiDAR and webcam integration planned, not yet assembled",
    ],
    technologies: ["Autodesk Fusion", "Raspberry Pi 4 (planned)", "ESP32 (planned)", "LiDAR (planned)"],
    projectSlug: "autonomous-delivery-rover",
    status: "in-development",
  },
  {
    id: 5,
    kind: "project",
    title: "ZBXP",
    context: "Web application · productivity",
    summary:
      "A gamified productivity web app built around tasks, guilds, leaderboards and Pomodoro sessions.",
    technologies: ["React", "JavaScript"],
    projectSlug: "zbxp",
    status: "to-confirm",
  },
  {
    id: 6,
    kind: "workshop",
    title: "System design workshop, CTOC Labs",
    context: "CTOC Labs \u00b7 system design",
    // Described strictly from what the owner's own photograph shows. The screens read "Sebastian's
    // System Design Workshop", and the photo is taken from the audience, so Marc is recorded as
    // attending. No presenting or organizing role is claimed — that is not established here.
    summary:
      "A system design workshop run in the CTOC Labs space, working through design examples on screen with the room.",
  },
];

/**
 * INTERNAL DRAFT — NOT FOR DISPLAY.
 *
 * The original placeholder employment record. It asserted a Software Engineer role at an employer
 * recorded only as "To be confirmed", running "2024 — Present", and was rendered on the public
 * Experience page. Keeping it here preserves the intent without publishing an unverified claim.
 * Replace the organization, dates and duties with verified values before any public use.
 */
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
