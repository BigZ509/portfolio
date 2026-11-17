# Phase 9: Project Dossier Redesign and Video Integration

Baseline: `c748c4d`. Scope is limited to the expanded project showcase. The carousel, tarot artwork, JJK environments, homepage, About, Experience and existing screenshots are unchanged.

## Road Report video

- **Source:** `youtube.com/watch?v=mj-jhV5Joho` ("RoadReport ShellHacks2026 Demo"). oEmbed confirmed it is public and embeddable, and the `youtube-nocookie.com` embed responds.
- **Gallery order:** the demo is first, followed by the two existing screenshots. Its thumbnail is labelled "▶ Watch Demo".
- **Poster:** Road Report opens on the poster, `road-report-demo-poster.jpg`, a local copy of the video's own thumbnail. Opening a project makes no requests to YouTube.
- **Playback:**
  - The embed (`youtube-nocookie.com`, `rel=0`, `playsinline`) mounts only after the visitor presses Watch Demo, either on the poster or in the panel.
  - The poster stays underneath until the iframe loads, so the frame never goes blank.
  - Focus moves into the player when it mounts.
- **Stopping:** switching media, changing project or closing the dialog unmounts the iframe, which stops playback.
- **Fullscreen:** enabled through `allowFullScreen`.
- **Framing:** video frames are sized 16:9 and are larger than portrait screenshots. On phones they use about 90% of the stage width.
- **Fallback:** "Watch on YouTube ↗" is always shown in the caption row. If the player has not loaded after 15 s, a status line points to that link.

## Adding the Guiding Hands video

No video is registered yet. When it is published, add this to the Guiding Hands record in `data/projects.ts`:

```ts
videos: [youtubeVideo({ youtubeId: "<11-char id>", title: "Guiding Hands demo", caption: "Gameplay demo" })],
```

The thumbnail, player and the panel's Watch Demo action all appear automatically. A local `poster` is optional; without one, YouTube's thumbnail is used. A malformed ID fails the build.

## Data model

- `ProjectVideo` is now a discriminated union: `kind: "mp4"` keeps the existing native-player path, and `kind: "youtube"` is created through the validating `youtubeVideo()` helper.
- `detailedDescription` is replaced by `story`, with `problem`, `built` and an optional `decision` (whose heading can be overridden).
- `technologies` is replaced by `techStack`, a list of labelled groups.
- `components/project-media.tsx` holds a single media state that the gallery and the dossier share. It is mounted only while a project is open, so closing the dialog discards the state and unmounts any player. The gallery still works standalone with local state.

## The dossier panel

- **Masthead:** the card's motif glyph, the numeral and the arcana name, plus Close.
- **Title block:** the discipline label, the title, a status badge (only for real states such as "In development"), and a one-sentence lede.
- **Actions** sit directly under the lede: Watch Demo, View Live Demo and Source on GitHub. Watch Demo is shown only when a video exists, and the first action is the primary one. If a project has no public links, the actions row is omitted.
- **Record:** numbered I/II/III entries (The Problem, What I Built, Engineering Decisions) separated by gilt hairlines. The rover's third entry is headed "Design Approach".
- **Built with:** a quiet labelled ledger of technologies rather than rows of badges.
- **Styling:** indigo paper with a held violet glow, a fixed gold hairline and a faint motif watermark. The panel column widened slightly to `clamp(23rem, 37vw, 33rem)`.

## Copy: sources and corrections

Every claim was checked against the repositories (cloned read-only) and their commit authorship.

- **Road Report:** Marc authored the classifier, report validation and tests. Teammates built the map and safest-route ranking. The decision entry cites the real rule weights (4 for specific phrases, 2 for generic ones) and the clarification cases.
- **SpeakLab AI:**
  - The decision comes from Marc's own architecture notes: requests go through a Node.js backend to keep keys off the device, validate requests and control cost.
  - **Correction:** the earlier copy said Marc "added ownership checks on session reads". That session API is an open, unmerged PR by a teammate, so it is now described as "in review".
  - Whisper appears in the owner's original brief but not in the repo, so it stays only in the tech list.
- **Guiding Hands:** this is a team project. The controller and the game are teammates' work; Marc built the display-only React player companion and its read-only tracking preview. No clinical claims are made.
- **ZBXP:**
  - XP is awarded by Supabase RPCs (`complete_quest`, `log_workout`). Levels are one per 100 XP, with ranks E to S.
  - The Pomodoro timer does not award XP, so it is not claimed to.
  - Whether the leaderboard is per guild is unverified, so the copy says "the leaderboard".
- **Delivery Rover:** the CAD model is the only current result. All electronics are listed as planned.

## Verification

`npm run typecheck`, `npm run lint` and `npm run build` all pass.

The production build was driven with Playwright and system Chrome in three configurations: 1440×900 with WebGL, 390×844 with WebGL, and 1440×900 with WebGL disabled (fallback grid). In every configuration:

- **Open and close:** all five projects open, and each closes with Escape and with Close.
- **Panel:** structure and links are correct, with no horizontal overflow.
- **Road Report on open:** it opens on the demo poster with zero YouTube requests and no iframe.
- **Playback:**
  - Watch Demo mounts the nocookie embed, focuses it, and the video plays (`currentTime` advances, not paused).
  - Moving to a screenshot removes the iframe.
  - The panel's Watch Demo returns to the video and plays it.
  - Selecting the video thumbnail shows the poster only.
  - Closing while it plays removes the iframe, and reopening does not autoplay.
- **Keyboard:** from Close, Tab goes to Watch Demo, View Live Demo, Source on GitHub, then the gallery's Watch Demo, Watch on YouTube and the media controls. Escape closes.
- **Scrolling:** the mouse wheel scrolls the panel without moving the page.
- **Console:** no errors or warnings, apart from the known GPU notices from headless rendering.

Screenshots are in `output/playwright/phase-9/` (`before-*`, `after-*`).

## Limitations

- **Embedding failures:** these can't be detected across origins without the YouTube IFrame API. The always-visible "Watch on YouTube" link and the 15 s notice are the fallback.
- **Escape inside the player:** while keyboard focus is inside the YouTube player, Escape is handled by the player, not the dialog. Shift+Tab out, then press Escape.
- **iOS Safari:** it may ignore `autoplay=1` after the click and show YouTube's own play button, which needs one more tap.
- **Guiding Hands, SpeakLab, ZBXP:** these still have no screenshots.
