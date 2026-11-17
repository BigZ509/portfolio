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

/** A still with its intrinsic size (video posters). */
export interface ProjectPoster extends ProjectImage {
  width: number;
  height: number;
}

/**
 * Self-hosted project video (MP4), played with native controls. Only list real, supplied files:
 * the gallery shows a play control solely for entries here. Videos never autoplay.
 */
export interface ProjectMp4Video {
  kind: "mp4";
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

/**
 * Video hosted on YouTube. The gallery shows the poster first and mounts the privacy-enhanced
 * (youtube-nocookie.com) embed only after the visitor presses Play. Create entries with
 * `youtubeVideo()`, which validates the ID.
 */
export interface ProjectYouTubeVideo {
  kind: "youtube";
  /** The 11-character ID from the watch URL (`youtube.com/watch?v=<id>`). */
  youtubeId: string;
  /** Accessible name for the player and thumbnail, e.g. "Road Report demo". */
  title: string;
  caption: string;
  /**
   * Still shown before playback. Prefer a local copy of the video's thumbnail so nothing is
   * requested from YouTube until the visitor chooses to play. Omitted: YouTube's own thumbnail.
   */
  poster?: ProjectPoster;
}

export type ProjectVideo = ProjectMp4Video | ProjectYouTubeVideo;

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

export function isYouTubeId(value: string): boolean {
  return YOUTUBE_ID.test(value);
}

/**
 * Registers a YouTube video. Throws on a malformed ID, so a typo fails the build instead of
 * rendering a broken embed. To add a project's video, this is the only change needed:
 *   videos: [youtubeVideo({ youtubeId: "…", title: "Guiding Hands demo", caption: "Demo" })]
 */
export function youtubeVideo(video: Omit<ProjectYouTubeVideo, "kind">): ProjectYouTubeVideo {
  if (!isYouTubeId(video.youtubeId)) {
    throw new Error(`Invalid YouTube video ID for "${video.title}": "${video.youtubeId}"`);
  }
  return { kind: "youtube", ...video };
}

/**
 * The dossier copy. Each section answers a different question and must not repeat the others.
 * Everything here should be traceable to the project's repository or the owner's own records.
 */
export interface ProjectStory {
  /** Why the project exists. */
  problem: string;
  /** What exists today, and who built which part on team projects. */
  built: string;
  /** One meaningful implementation choice or tradeoff. Omit it rather than invent one. */
  decision?: {
    /** Heading override, e.g. "Design Approach" for a project without implementation yet. */
    label?: string;
    text: string;
  };
}

/** Technologies grouped by role ("App", "Planned hardware"), shown as quiet labelled lists. */
export interface TechGroup {
  label: string;
  items: readonly string[];
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  tarotIdentity: TarotIdentity;
  romanNumeral: "0" | "I" | "XI" | "XVII" | "XXI";
  motif: CardMotif;
  /** One memorable sentence: the dossier's lede, and the dialog's accessible description. */
  shortDescription: string;
  story: ProjectStory;
  techStack: readonly TechGroup[];
  /** Short discipline label shown above the title. */
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
    shortDescription: "Record a practice speech on your phone, then see your pace and every filler word on the transcript.",
    // Sources: BigZ509/speaklab main (speechEngine/, services/transcription-services.ts) and the
    // owner's SL-01 pipeline audit. The owner-only session API is an open PR by a teammate, so it
    // is described as in review and not credited to Marc.
    story: {
      problem:
        "After a practice run, most people only remember how it felt. Without a record of what was said, it's hard to know whether to slow down, cut the filler words, or rework a section.",
      built:
        "An Expo app that records a practice run and turns the returned transcript into feedback: pace in words per minute across the talk and the timestamp of every filler word. Sounds like “um” always count; words like “like” and “so” are checked against their neighbours before they're flagged.",
      decision: {
        text:
          "Audio goes through a Node.js backend instead of the phone calling the transcription API directly. That keeps API keys off the device and gives one place to validate requests and control cost, at the price of an extra hop. The app also rejects a transcript with missing or out-of-order word timings before any analysis runs. An authenticated session API that returns each saved session only to its owner is in review.",
      },
    },
    techStack: [
      { label: "App", items: ["React Native", "Expo", "TypeScript"] },
      { label: "Backend", items: ["Node.js", "Express", "Whisper"] },
      { label: "Accounts", items: ["Firebase Authentication", "Cloud Firestore"] },
    ],
    category: "Mobile · Speech analysis",
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
    shortDescription: "A four-wheel delivery rover, designed in CAD first so the robotics will have a real chassis to live on.",
    // No repository. Only the Fusion model exists; every electronic component is planned.
    story: {
      problem:
        "Autonomy is the exciting part of a delivery robot, but it needs a body first. Before any navigation code matters, the platform has to carry cargo and hold a camera high enough to see ahead.",
      built:
        "A mechanical model in Autodesk Fusion: a four-wheel chassis with a removable cargo tray and a camera mast. The CAD model is the finished part so far. The rover has not been assembled or driven.",
      decision: {
        label: "Design Approach",
        text:
          "The tray and mast are fixed in the model now, so the electronics planned next (a Raspberry Pi 4, an ESP32, LiDAR and a webcam) will be fitted to settled geometry rather than a frame that is still changing.",
      },
    },
    techStack: [
      { label: "Design", items: ["Autodesk Fusion"] },
      { label: "Planned hardware", items: ["Raspberry Pi 4", "ESP32", "LiDAR", "Webcam"] },
    ],
    category: "Robotics · Mechanical design",
    status: "in-development",
  },
  {
    id: 3,
    slug: "guiding-hands",
    title: "Guiding Hands",
    tarotIdentity: "The Magician",
    romanNumeral: "I",
    motif: "spark",
    shortDescription: "Hand exercises turned into a game you steer with gestures in front of a webcam.",
    // Team project (BigZ509/guiding-hands). Teammates wrote most of the gesture controller and the
    // game; Marc's commits build the React player companion and its read-only tracking preview.
    // No clinical claims: nothing here has been evaluated as therapy.
    story: {
      problem:
        "Repetitive hand exercises are easy to lose interest in. Our team wanted the movements to steer a character in a game, with gestures simple enough to remember mid-play.",
      built:
        "MediaPipe tracks hand landmarks, and a Python controller turns an open hand, a fist and two pinches into movement. Commands travel over UDP to a Node.js relay, which forwards them to the browser game over WebSockets. My part is the player companion: a React screen with four illustrated gesture reminders beside the live game.",
      decision: {
        text:
          "The companion is display-only. It never sends commands to the game, and its optional camera preview is read-only, proxied from the local tracking process. If the companion reconnects or closes, play carries on, which keeps the same boundary between vision and game that the rest of the system relies on.",
      },
    },
    techStack: [
      { label: "Vision", items: ["Python", "OpenCV", "MediaPipe"] },
      { label: "Realtime", items: ["UDP", "Node.js", "WebSockets"] },
      { label: "Interface", items: ["React"] },
      { label: "Target hardware", items: ["Jetson Orin Nano"] },
    ],
    category: "Computer vision · Team project",
    status: "to-confirm",
    githubUrl: "https://github.com/BigZ509/guiding-hands",
    // The owner is recording a demo. When it is published, register it here (no component changes):
    //   videos: [youtubeVideo({ youtubeId: "<11-character ID>", title: "Guiding Hands demo", caption: "Gameplay demo" })],
  },
  {
    id: 4,
    slug: "road-report",
    title: "Road Report",
    tarotIdentity: "Justice",
    romanNumeral: "XI",
    motif: "balance",
    shortDescription: "A hackathon road-hazard map whose classifier knows when a report is too unclear to file.",
    // Sources: Lockop1/Road-Report (lib/reports/classify.ts, docs/incident-classification.md).
    // Marc authored the classifier, report validation and tests; teammates built the map and
    // routing. Geohash deduplication from the original brief is NOT in the repository: omitted.
    story: {
      problem:
        "People describe road hazards loosely. One report says “crash”, another “a tree is blocking the lane”, and some don't name a hazard at all. Forcing every message into a category would put false incidents on the map.",
      built:
        "At a hackathon, I wrote the report classifier, its input validation and its tests. It sorts a free-text description into collision, road obstruction, flooding, traffic signal issue or other, or returns a clarification prompt. Teammates built the map, which shows live incidents and ranks alternative routes by the hazards along them.",
      decision: {
        text:
          "I chose explainable rules over a black box. Specific hazard phrases score 4 and generic ones like “blocking the lane” score 2, so “a crash is blocking the lane” resolves to a collision. Resolved reports, device talk such as “my phone crashed”, and descriptions naming two hazards all ask the reporter to clarify instead of guessing.",
      },
    },
    techStack: [
      { label: "Web", items: ["Next.js", "React", "TypeScript"] },
      { label: "Map", items: ["MapLibre GL"] },
      { label: "Data", items: ["PostgreSQL"] },
    ],
    category: "Civic tech · Geospatial",
    status: "to-confirm",
    githubUrl: "https://github.com/Lockop1/Road-Report",
    demoUrl: "https://hazard-identifier.vercel.app",
    // Supplied by the portfolio owner (YouTube, public, embedding allowed). The poster is a local
    // copy of the video's own thumbnail.
    videos: [
      youtubeVideo({
        youtubeId: "mj-jhV5Joho",
        title: "Road Report demo",
        caption: "Demo video",
        poster: {
          src: "/images/projects/road-report/road-report-demo-poster.jpg",
          alt: "Road Report demo video: the Road Hazard Map with an active incident marker.",
          width: 1280,
          height: 720,
        },
      }),
    ],
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
    shortDescription: "A productivity app where finished quests and workouts earn XP, ranks and a place on the leaderboard.",
    // Source: BigZ509/Productivity-WebApp (src/App.jsx). XP is awarded by Supabase RPCs
    // (complete_quest, log_workout); the Pomodoro timer does not award XP, so it isn't claimed to.
    story: {
      problem:
        "A finished to-do list doesn't feel like much. Games make progress visible with levels, ranks and a team to keep up with, and I wanted everyday tasks to carry the same weight.",
      built:
        "A React web app where completed quests and logged workouts earn XP, with a Pomodoro timer for focus sessions. Players can create a guild or join one by code, take on guild quests, and compare standing on a leaderboard. Supabase handles sign-in and stores progress.",
      decision: {
        text:
          "XP is granted by the database, not the browser. Completing a quest calls a Supabase function that returns the XP it actually awarded; the app shows that number and refreshes the profile. Levels (one per 100 XP) and E-to-S ranks both derive from that single total, so every activity feeds one progression.",
      },
    },
    techStack: [
      { label: "Frontend", items: ["React", "JavaScript"] },
      { label: "Backend", items: ["Supabase"] },
    ],
    category: "Productivity · Web app",
    status: "to-confirm",
    githubUrl: "https://github.com/BigZ509/Productivity-WebApp",
    demoUrl: "https://zbxp.vercel.app",
  },
];

// Card artwork is registered separately so records stay free of unverified assets.
export const projects: readonly Project[] = withCardArtwork(projectRecords);
