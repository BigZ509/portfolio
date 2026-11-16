export type Skill = {
  name: string;
  category: "languages" | "frameworks" | "tools" | "platforms";
};

export const skills: readonly Skill[] = [
  // Languages
  { name: "TypeScript", category: "languages" },
  { name: "JavaScript", category: "languages" },
  { name: "Python", category: "languages" },
  { name: "C++", category: "languages" },

  // Frameworks and libraries
  { name: "React", category: "frameworks" },
  { name: "React Native", category: "frameworks" },
  { name: "Next.js", category: "frameworks" },
  { name: "Node.js", category: "frameworks" },
  { name: "Express", category: "frameworks" },
  { name: "Three.js", category: "frameworks" },
  { name: "OpenCV", category: "frameworks" },
  { name: "MediaPipe", category: "frameworks" },

  // Tools
  { name: "Git", category: "tools" },
  { name: "Autodesk Fusion", category: "tools" },
  { name: "PostgreSQL", category: "tools" },
  { name: "Firebase", category: "tools" },
  { name: "WebGL", category: "tools" },
  { name: "WebSockets", category: "tools" },

  // Platforms
  { name: "Expo", category: "platforms" },
  { name: "Raspberry Pi", category: "platforms" },
  { name: "Jetson Orin Nano", category: "platforms" },
];

export const skillCategories = [
  { key: "languages" as const, label: "Languages" },
  { key: "frameworks" as const, label: "Frameworks & Libraries" },
  { key: "tools" as const, label: "Tools & Databases" },
  { key: "platforms" as const, label: "Platforms" },
] as const;
