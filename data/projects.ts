import { withCardArtwork } from "./tarot-artwork";

export type ProjectStatus = "to-confirm" | "in-development" | "complete";

export type TarotIdentity =
  | "The Fool"
  | "The World"
  | "The Magician"
  | "Justice"
  | "The Star";

export type CardMotif = "threshold" | "orbit" | "spark" | "balance" | "star";

export interface ProjectImage {
  src: string;
  alt: string;
}

/**
 * How an illustration sits on the card:
 * - `full-card`: the illustration is the whole card face, including its own border, numeral and
 *   name. It is fitted to the card and nothing is drawn over it.
 * - `panel`: the illustration only. It is fitted inside the existing gold frame's art window and
 *   the numeral, tarot identity and title are still drawn around it.
 */
export type CardArtworkLayout = "full-card" | "panel";

/** Local, authorized card illustration. See docs/tarot-artwork-manifest.md. */
export interface CardArtwork extends ProjectImage {
  /** Root-relative path under /images/tarot/ (same-origin, so WebGL can use it as a texture). */
  src: `/images/tarot/${string}`;
  /** Intrinsic pixel size of the file; used for layout and to warn about mismatched proportions. */
  width: number;
  height: number;
  layout: CardArtworkLayout;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  tarotIdentity: TarotIdentity;
  romanNumeral: "0" | "I" | "XI" | "XVII" | "XXI";
  motif: CardMotif;
  shortDescription: string;
  detailedDescription: string;
  technologies: readonly string[];
  category: string;
  status: ProjectStatus;
  githubUrl?: string;
  demoUrl?: string;
  screenshots?: readonly ProjectImage[];
  cardArtwork?: CardArtwork;
}

const projectRecords: readonly Project[] = [
  {
    id: 1,
    slug: "speaklab-ai",
    title: "SpeakLab AI",
    tarotIdentity: "The Fool",
    romanNumeral: "0", // The Fool is traditionally numbered 0, not a Roman numeral.
    motif: "threshold",
    shortDescription: "An AI-assisted mobile app for practicing public speaking and communication, with speech transcription and feedback.",
    detailedDescription: "SpeakLab AI pairs a React Native and Expo mobile app with a Node.js, Express, and TypeScript backend. Firebase Authentication and Firestore support user accounts and session data. Sessions can be created and retrieved with user-ownership checks; Whisper transcription feeds speech metrics and filler-word analysis.",
    technologies: ["React Native", "Expo", "Node.js", "Express", "TypeScript", "Firebase Authentication", "Cloud Firestore", "Whisper"],
    category: "AI communication",
    status: "to-confirm",
  },
  {
    id: 2,
    slug: "autonomous-delivery-rover",
    title: "Autonomous Delivery Rover",
    tarotIdentity: "The World",
    romanNumeral: "XXI",
    motif: "orbit",
    shortDescription: "An in-development four-wheel delivery rover designed in Autodesk Fusion, with a removable cargo tray and camera mast.",
    detailedDescription: "The rover is a mechanical design project for a four-wheel delivery platform. A Raspberry Pi 4, ESP32, LiDAR, and webcam integration are planned; physical assembly and autonomous navigation are not confirmed as complete.",
    technologies: ["Autodesk Fusion", "Raspberry Pi 4 (planned)", "ESP32 (planned)", "LiDAR (planned)", "Webcam (planned)"],
    category: "Robotics and mechanical design",
    status: "in-development",
  },
  {
    id: 3,
    slug: "guiding-hands",
    title: "Guiding Hands",
    tarotIdentity: "The Magician",
    romanNumeral: "I",
    motif: "spark",
    shortDescription: "A computer-vision rehabilitation game that guides at-home hand exercises using tracked hand gestures.",
    detailedDescription: "Guiding Hands uses Python, OpenCV, and MediaPipe hand landmarks for gesture classification and game control. A Python controller sends commands over UDP to a Node.js service, which forwards updates to the browser over WebSockets. The system has been tested with Jetson Orin Nano hardware.",
    technologies: ["Python", "OpenCV", "MediaPipe", "UDP", "Node.js", "WebSockets", "Jetson Orin Nano"],
    category: "Computer vision and rehabilitation",
    status: "to-confirm",
  },
  {
    id: 4,
    slug: "road-report",
    title: "Road Report",
    tarotIdentity: "Justice",
    romanNumeral: "XI",
    motif: "balance",
    shortDescription: "A hackathon project for classifying road-hazard descriptions with weighted phrase rules.",
    detailedDescription: "The classifier scores phrase matches to assign hazard categories and asks for clarification when reports are ambiguous or outside the road-hazard domain. The repository includes report models for coordinates, Google Place IDs, and incident IDs, alongside a map-based interface. Geohash-based deduplication was mentioned in the project brief but was not verified in the inspected repository.",
    technologies: ["Next.js", "React", "TypeScript", "MapLibre GL", "PostgreSQL"],
    category: "Civic technology and geospatial applications",
    status: "to-confirm",
  },
  {
    id: 5,
    slug: "zbxp",
    title: "ZBXP",
    tarotIdentity: "The Star",
    romanNumeral: "XVII",
    motif: "star",
    shortDescription: "A gamified productivity web app centered on tasks, guilds, leaderboards, and Pomodoro sessions.",
    detailedDescription: "ZBXP is built with a React and JavaScript frontend. Its described feature areas include authentication, guilds, leaderboards, tasks, and Pomodoro functionality; the completion status of individual features and the backend technologies have not been confirmed.",
    technologies: ["React", "JavaScript"],
    category: "Productivity software",
    status: "to-confirm",
  },
];

// Card artwork is registered separately so records stay free of unverified assets.
export const projects: readonly Project[] = withCardArtwork(projectRecords);
