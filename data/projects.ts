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

/** Project screenshot. Intrinsic size keeps the gallery frame at the image's true aspect ratio. */
export interface ProjectScreenshot extends ProjectImage {
  width: number;
  height: number;
  /** Short label for thumbnails and the gallery caption. */
  caption: string;
}

/**
 * Project video (MP4). Only list real, supplied files: the gallery shows a play control
 * solely for entries here. Videos never autoplay and play with native controls.
 */
export interface ProjectVideo {
  src: `${string}.mp4`;
  /** Accessible name for the player, e.g. "Road Report walkthrough". */
  title: string;
  caption: string;
  width: number;
  height: number;
  /** Optional still shown before playback and in the thumbnail. */
  poster?: ProjectImage;
  /** Optional WebVTT captions file. */
  captionsSrc?: `${string}.vtt`;
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
  screenshots?: readonly ProjectScreenshot[];
  videos?: readonly ProjectVideo[];
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
    shortDescription: "A mobile practice space that turns a recorded speech into a transcript and feedback on delivery.",
    detailedDescription: "Public speaking is hard to improve when you only remember how a practice session felt. I built SpeakLab AI so someone can record a talk and review a transcript, speech metrics, and filler-word feedback.\n\nThe mobile app keeps practice sessions tied to an account. I separated transcription into a backend service and added ownership checks on session reads so feedback stays with the person who recorded it.",
    technologies: ["React Native", "Expo", "Node.js", "Express", "TypeScript", "Firebase Authentication", "Cloud Firestore", "Whisper"],
    category: "AI communication",
    status: "to-confirm",
    githubUrl: "https://github.com/BigZ509/speaklab",
  },
  {
    id: 2,
    slug: "autonomous-delivery-rover",
    title: "Autonomous Delivery Rover",
    tarotIdentity: "The World",
    romanNumeral: "XXI",
    motif: "orbit",
    shortDescription: "A four-wheel delivery rover design with a removable cargo tray and camera mast; the hardware build is still ahead.",
    detailedDescription: "What would a small delivery rover need before adding autonomy? I modelled a four-wheel platform in Autodesk Fusion with a removable cargo tray and camera mast.\n\nThe mechanical design is the current result. The Raspberry Pi, ESP32, LiDAR and camera integration are planned, and the rover has not been assembled or driven.",
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
    shortDescription: "A hand-tracking game companion that turns webcam gestures into movement and visual guidance.",
    detailedDescription: "I wanted hand exercises to feel more like interacting with a game than following a static prompt. Guiding Hands uses a webcam gesture controller and an on-screen companion to show movement cues beside the live game.\n\nThe controller sends input over UDP to a Node relay, then WebSockets pass it to the browser. Keeping tracking separate from the game view makes the controls easier to inspect and adjust.",
    technologies: ["Python", "OpenCV", "MediaPipe", "UDP", "Node.js", "WebSockets", "Jetson Orin Nano (target)"],
    category: "Computer vision and rehabilitation",
    status: "to-confirm",
    githubUrl: "https://github.com/BigZ509/guiding-hands",
  },
  {
    id: 4,
    slug: "road-report",
    title: "Road Report",
    tarotIdentity: "Justice",
    romanNumeral: "XI",
    motif: "balance",
    shortDescription: "A hackathon road-reporting project that classifies hazard descriptions and asks when a report needs clarification.",
    // Internal note (not shown publicly): geohash-based deduplication was mentioned in the project
    // brief but was NOT verified in the inspected repository, so it is deliberately absent from the
    // description below. Confirm with the owner before claiming it.
    detailedDescription: "Road hazards aren't always described clearly. One person reports an accident, another mentions debris, and sometimes the description doesn't identify a road hazard at all.\n\nAt a hackathon, I worked on a classifier that uses weighted phrase matching to identify possible hazards and request clarification when a report is ambiguous. The project also includes a map interface for displaying reports with location and incident information.",
    technologies: ["Next.js", "React", "TypeScript", "MapLibre GL", "PostgreSQL"],
    category: "Civic technology and geospatial applications",
    status: "to-confirm",
    githubUrl: "https://github.com/Lockop1/Road-Report",
    demoUrl: "https://hazard-identifier.vercel.app",
    // Supplied by the portfolio owner (road-report-portfolio-assets.zip). Screenshots illustrate the
    // interface only; they do not verify any feature beyond what the description states.
    screenshots: [
      {
        src: "/images/projects/road-report/road-report-route-comparison.webp",
        alt: "Road Report map showing alternate driving routes around Miami, hazard indicators, and a route labeled Safest.",
        width: 862,
        height: 1454,
        caption: "Route comparison",
      },
      {
        src: "/images/projects/road-report/road-report-hazard-details.webp",
        alt: "Road Report map with an incident details popup showing an active collision and report counts.",
        width: 840,
        height: 1404,
        caption: "Incident details",
      },
    ],
  },
  {
    id: 5,
    slug: "zbxp",
    title: "ZBXP",
    tarotIdentity: "The Star",
    romanNumeral: "XVII",
    motif: "star",
    shortDescription: "A game-inspired productivity app for tasks, focus sessions, guilds, and visible progress.",
    // Internal note (not shown publicly): per-feature completion status and the backend stack are
    // unconfirmed. The description below therefore describes scope, not finished functionality.
    detailedDescription: "I wanted everyday tasks to have the sense of progress a game gives you. ZBXP brings tasks, focus sessions, guilds, and leaderboards into one web app.\n\nI built the React frontend around a shared progression view so those parts feel connected instead of like separate checklists. A public web build is available to explore.",
    technologies: ["React", "JavaScript"],
    category: "Productivity software",
    status: "to-confirm",
    githubUrl: "https://github.com/BigZ509/Productivity-WebApp",
    demoUrl: "https://zbxp.vercel.app",
  },
];

// Card artwork is registered separately so records stay free of unverified assets.
export const projects: readonly Project[] = withCardArtwork(projectRecords);
