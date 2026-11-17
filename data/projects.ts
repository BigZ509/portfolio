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
    shortDescription: "A mobile practice space for public speaking, turning a recorded session into transcription and feedback on delivery.",
    detailedDescription: "SpeakLab AI gives someone a way to practice a speech and review how they delivered it. The React Native and Expo app connects to a Node.js and Express backend; Whisper transcription feeds speech metrics and filler-word analysis. Firebase Authentication and Firestore hold accounts and sessions, with ownership checks on session reads. Public outcomes and the current release status have not been confirmed.",
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
    shortDescription: "A four-wheel delivery rover design with a removable cargo tray and camera mast; the hardware build is still ahead.",
    detailedDescription: "I used Autodesk Fusion to design a four-wheel delivery platform and work out how its cargo tray and camera mast fit together. The mechanical model is the completed part so far. Raspberry Pi 4, ESP32, LiDAR and webcam integration are planned; the rover has not been assembled or driven.",
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
    shortDescription: "A rehabilitation game that turns webcam-tracked hand gestures into at-home exercise controls.",
    detailedDescription: "Guiding Hands explores how a webcam can guide hand exercises at home. Python, OpenCV and MediaPipe classify gestures from hand landmarks. A Python controller sends commands by UDP to a Node.js service, which pushes game updates to the browser over WebSockets. The system has been tested with Jetson Orin Nano hardware; clinical outcomes have not been established here.",
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
    shortDescription: "A hackathon road-reporting project that classifies hazard descriptions and asks when a report needs clarification.",
    // Internal note (not shown publicly): geohash-based deduplication was mentioned in the project
    // brief but was NOT verified in the inspected repository, so it is deliberately absent from the
    // description below. Confirm with the owner before claiming it.
    detailedDescription: "Road Report tackles a common reporting problem: a short description may be vague or unrelated to a road hazard. Its weighted phrase rules score possible categories, and the interface asks for clarification instead of forcing an uncertain match. The repository also includes a map interface and report models for coordinates, Google Place IDs and incident IDs. The available records do not establish deployment or real-world usage.",
    technologies: ["Next.js", "React", "TypeScript", "MapLibre GL", "PostgreSQL"],
    category: "Civic technology and geospatial applications",
    status: "to-confirm",
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
    shortDescription: "A productivity app exploring whether game-like progress can make tasks and focused work easier to follow.",
    // Internal note (not shown publicly): per-feature completion status and the backend stack are
    // unconfirmed. The description below therefore describes scope, not finished functionality.
    detailedDescription: "ZBXP explores a game-like structure for productivity: tasks, guilds, leaderboards and Pomodoro sessions are its intended parts. The known frontend uses React and JavaScript. The available records do not establish which features are complete or whether the app has been released.",
    technologies: ["React", "JavaScript"],
    category: "Productivity software",
    status: "to-confirm",
  },
];

// Card artwork is registered separately so records stay free of unverified assets.
export const projects: readonly Project[] = withCardArtwork(projectRecords);
