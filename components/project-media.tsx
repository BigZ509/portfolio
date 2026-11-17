"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { isYouTubeId, type Project, type ProjectImageMedia, type ProjectMp4Video, type ProjectYouTubeVideo } from "@/data/projects";

export type MediaItem =
  | ProjectImageMedia
  | ProjectMp4Video
  | (ProjectYouTubeVideo & { width: number; height: number });

/** Player frame for each YouTube aspect; the poster (when supplied) should match. */
const YOUTUBE_SIZE = {
  "16:9": { width: 1280, height: 720 },
  "9:16": { width: 720, height: 1280 },
} as const;

/**
 * Gallery items in the order the project lists them. A YouTube entry with a malformed ID is
 * skipped rather than rendered as a broken embed.
 */
export function projectMedia(project: Project): MediaItem[] {
  return (project.media ?? []).flatMap((item): MediaItem[] => {
    if (item.kind !== "youtube") return [item];
    return isYouTubeId(item.youtubeId) ? [{ ...item, ...YOUTUBE_SIZE[item.aspect ?? "16:9"] }] : [];
  });
}

export const mediaKey = (item: MediaItem) => (item.kind === "youtube" ? `youtube:${item.youtubeId}` : item.src);

export type ProjectMediaController = {
  media: MediaItem[];
  activeIndex: number;
  /** True once the visitor has asked the active YouTube item to play (its embed is mounted). */
  started: boolean;
  /** Index of the first video, for the dossier's Watch Demo action; null when there is none. */
  demoIndex: number | null;
  /** Shows an item. Switching away from a playing embed unmounts it. */
  select: (index: number) => void;
  /** Starts the active YouTube item. */
  play: () => void;
  /** Shows the first video and starts it (an explicit visitor request). */
  watchDemo: () => void;
};

function useMediaState(project: Project): ProjectMediaController {
  const media = projectMedia(project);
  // Keyed by project, so a different project always starts on its first item with nothing playing.
  const [state, setState] = useState({ projectId: project.id, index: 0, started: false });
  const current = state.projectId === project.id ? state : { projectId: project.id, index: 0, started: false };
  const count = media.length;
  const activeIndex = count > 0 ? Math.min(current.index, count - 1) : 0;
  const demo = media.findIndex((item) => item.kind !== "image");
  const demoIndex = demo === -1 ? null : demo;

  const select = (index: number) => {
    if (count === 0) return;
    setState({ projectId: project.id, index: ((index % count) + count) % count, started: false });
  };

  return {
    media,
    activeIndex,
    started: current.started && media[activeIndex]?.kind === "youtube",
    demoIndex,
    select,
    play: () => setState({ projectId: project.id, index: activeIndex, started: true }),
    watchDemo: () => {
      if (demoIndex !== null) setState({ projectId: project.id, index: demoIndex, started: true });
    },
  };
}

const ProjectMediaContext = createContext<ProjectMediaController | null>(null);

/**
 * Shares one media state between the gallery (left) and the dossier (right). Mount it only while
 * a project is open: unmounting on close discards the state, which also unmounts any embed.
 */
export function ProjectMediaProvider({ project, children }: { project: Project; children: ReactNode }) {
  const controller = useMediaState(project);
  return <ProjectMediaContext.Provider value={controller}>{children}</ProjectMediaContext.Provider>;
}

/** The shared controller inside a provider; otherwise a private one for this component. */
export function useProjectMedia(project: Project): ProjectMediaController {
  const shared = useContext(ProjectMediaContext);
  const local = useMediaState(project);
  return shared ?? local;
}

/** The shared controller, or null outside a provider (the dossier then shows no Watch Demo). */
export function useOptionalProjectMedia(): ProjectMediaController | null {
  return useContext(ProjectMediaContext);
}
