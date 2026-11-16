/**
 * About-page content: the five chapters of MARC'S WORLD.
 *
 * Biography facts here are owner-supplied (UCF computer science; interests across software, AI and
 * robotics). Project copy is derived from the verified records in `data/projects.ts`, and each
 * photograph is the owner's own, captioned only with what it shows. Nothing describes an event,
 * role, award or employment that is not established.
 */

export type PanelSpan = "tall" | "large" | "narrow" | "wide";

export type PhotoPanel = {
  id: string;
  src: `/images/home/${string}.webp`;
  alt: string;
  width: number;
  height: number;
  label: string;
  caption: string;
  /** Composition slot, following the upstream panel-large / panel-tall / panel-wide idea. */
  span: PanelSpan;
};

export type BuildPanel = {
  id: string;
  /** Matches a `slug` in data/projects.ts. */
  slug: string;
  discipline: string;
  title: string;
  description: string;
  technologies: readonly string[];
  /** Shown only for work that is genuinely still in progress. */
  inDevelopment?: boolean;
  image?: { src: string; alt: string; width: number; height: number };
};

export const aboutIntro = {
  chapter: "Chapter 01",
  kicker: "The person behind the projects",
  heading: "The person behind the projects",
  lede:
    "I'm Marc, a computer science student at the University of Central Florida. I enjoy building across software, AI and robotics — especially when a project pushes me to learn something I haven't tried before.",
  body: [
    "Most of what I make starts as a question I can't answer yet. A camera that could read a hand well enough to guide an exercise. A phone that could listen to someone practise a speech and tell them something useful. A rover that has to survive contact with an actual floor.",
    "The common thread is that I'd rather find out than speculate. That usually means picking up whatever the problem needs — a vision library, a CAD package, a protocol I haven't used — and building the smallest honest version of the thing.",
  ],
  photo: {
    src: "/images/home/graduation.webp" as const,
    alt: "Marc in a black graduation cap and gown outside an arena.",
    width: 1152,
    height: 1536,
    caption: "University of Central Florida",
  },
} as const;

export const buildPanels: readonly BuildPanel[] = [
  {
    id: "guiding-hands",
    slug: "guiding-hands",
    discipline: "Computer vision",
    title: "Guiding Hands",
    description:
      "A rehabilitation game that watches your hand through a webcam and guides at-home exercises. MediaPipe landmarks drive the gesture classification; a Python controller talks to a Node service over UDP, which pushes the game state to the browser.",
    technologies: ["Python", "OpenCV", "MediaPipe", "Jetson Orin Nano"],
  },
  {
    id: "speaklab-ai",
    slug: "speaklab-ai",
    discipline: "AI & mobile",
    title: "SpeakLab AI",
    description:
      "A mobile app for practising public speaking. You record a session, Whisper transcribes it, and the app turns that into speech metrics and filler-word analysis you can actually act on.",
    technologies: ["React Native", "Expo", "TypeScript", "Whisper"],
  },
  {
    id: "road-report",
    slug: "road-report",
    discipline: "Civic technology",
    title: "Road Report",
    description:
      "Hackathon work on road-hazard reporting. A weighted phrase-rule classifier sorts incoming descriptions into hazard categories, and asks for clarification when a report is ambiguous or isn't about the road at all.",
    technologies: ["Next.js", "TypeScript", "MapLibre GL", "PostgreSQL"],
    image: {
      src: "/images/projects/road-report/road-report-route-comparison.webp",
      alt: "Road Report map showing alternate driving routes around Miami, hazard indicators, and a route labeled Safest.",
      width: 862,
      height: 1454,
    },
  },
  {
    id: "autonomous-delivery-rover",
    slug: "autonomous-delivery-rover",
    discipline: "Robotics & CAD",
    title: "Autonomous Delivery Rover",
    description:
      "A four-wheel delivery platform designed in Autodesk Fusion, with a removable cargo tray and a camera mast. The mechanical design is the part that exists today — the Raspberry Pi, ESP32 and LiDAR integration is planned, and it hasn't driven anywhere yet.",
    technologies: ["Autodesk Fusion", "Raspberry Pi 4", "ESP32", "LiDAR"],
    inDevelopment: true,
  },
  {
    id: "zbxp",
    slug: "zbxp",
    discipline: "Web applications",
    title: "ZBXP",
    description:
      "A productivity app that borrows from games: tasks, guilds, leaderboards and Pomodoro sessions, on the theory that progress is easier to keep up when you can see it.",
    technologies: ["React", "JavaScript"],
  },
];

/**
 * Chapter 03 gallery. All four photographs are 1152×1536 (3:4 portrait), so every slot is a
 * portrait-friendly one — no panel crops a person to a letterbox.
 */
export const photoPanels: readonly PhotoPanel[] = [
  {
    id: "beach",
    src: "/images/home/beach-adventure.webp",
    alt: "Marc standing in shallow turquoise water with both arms raised, in front of a red sports-car-shaped watercraft, with a catamaran moored behind him.",
    width: 1152,
    height: 1536,
    label: "Off the clock",
    caption: "Shallow water, a car that is somehow a boat, and no notes.",
    span: "tall",
  },
  {
    id: "workshop",
    src: "/images/home/workshop-ctoc.webp",
    alt: "A system design workshop in the CTOC Labs room: students at tables watch two screens of system-design diagrams while a presenter points at one.",
    width: 1152,
    height: 1536,
    label: "Rooms worth being in",
    caption: "A system design workshop at CTOC Labs. Pizza included.",
    span: "large",
  },
  {
    id: "campus",
    src: "/images/home/campus-goat.webp",
    alt: "Marc holding a small brown-and-white goat on a campus lawn, with a pen fence and other students behind him.",
    width: 1152,
    height: 1536,
    label: "Campus life",
    caption: "Not every day on campus is a lecture hall. Some days there is a goat.",
    span: "narrow",
  },
  {
    id: "graduation",
    src: "/images/home/graduation.webp",
    alt: "Marc in a black graduation cap and gown outside an arena.",
    width: 1152,
    height: 1536,
    label: "A milestone",
    caption: "Cap, gown, and the walk outside the arena.",
    span: "wide",
  },
];

export const connect = {
  chapter: "Chapter 05",
  heading: "Say hello",
  body:
    "If you're working on something in software, AI or robotics — or you just want to talk through an idea that isn't fully formed yet — I'd like to hear about it. I'm a student, I'm still learning, and the interesting conversations usually start that way.",
} as const;
