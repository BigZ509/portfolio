/**
 * About-page content: Marc's introduction, personal photos and contact invitation.
 *
 * The introduction is supplied by the owner. Each photograph is the owner's own, captioned only
 * with what it shows. Nothing describes an unverified event, role, award or employment.
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

export const aboutIntro = {
  chapter: "Origins",
  lede:
    "Most things I build start with a question I don't know how to answer yet. That's what makes it interesting.",
  body: [
    "I like figuring things out as I go, even when it means learning something completely new or realizing my first approach was wrong. My curiosity takes me across software, AI, robotics, and whatever else catches my attention.",
    "I'm studying computer science at UCF, but I don't want to limit myself to one field. I enjoy taking ideas beyond the screen, seeing what works, and learning from what doesn't. There's always something new I want to understand or build.",
  ],
  photo: {
    src: "/images/home/graduation.webp" as const,
    alt: "Marc in a black graduation cap and gown outside an arena.",
    width: 1152,
    height: 1536,
    caption: "University of Central Florida",
  },
} as const;

/**
 * Personal gallery. All four photographs are 1152×1536 (3:4 portrait), so every slot is a
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
    alt: "Workshop attendees watch system design diagrams on two screens while a presenter speaks at the front of the room.",
    width: 1152,
    height: 1536,
    label: "Learning together",
    caption: "Attending a System Design Workshop",
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
  chapter: "What's Next",
  heading: "Say hello",
  body:
    "If you're working on something in software, AI or robotics — or you just want to talk through an idea that isn't fully formed yet — I'd like to hear about it. I'm a student, I'm still learning, and the interesting conversations usually start that way.",
} as const;
