# Phase 9: Project Dossier Redesign and Complete Media Integration

Baseline: `c748c4d`. Phase 9 landed in two commits: the dossier panel and the Road Report video first, then the Guiding Hands Short, the four Guiding Hands photos and a responsive pass.

Scope is limited to the expanded project showcase. The carousel, tarot artwork, JJK environments, homepage, About, Experience and existing screenshots are unchanged.

## Media model

`Project.media` is one ordered list, and its order is the gallery order. Each entry is one of three types:

- **`kind: "image"`:** a photo or screenshot, with its intrinsic size, alt text and caption.
- **`kind: "mp4"`:** the existing native-player path, unchanged.
- **`kind: "youtube"`:** created only through `youtubeVideo()`, which validates the 11-character ID (a bad ID fails the build). It has an optional `aspect` of `"16:9"` (the default) or `"9:16"` for Shorts, and an optional local `poster`.

One state, `components/project-media.tsx`, is shared by the gallery and the dossier: the active index plus whether a YouTube player has been started. It is mounted only while a project is open, so closing the dialog or switching project discards it.

## YouTube behaviour (Road Report and Guiding Hands)

Both videos use the same player.

**Sources.** Both videos are public and embeddable (checked through oEmbed).
- Road Report: `mj-jhV5Joho`, 16:9.
- Guiding Hands: `UwMCrwPF1LA`, a 9:16 Short uploaded by Marc's own channel.

**Before playback.** Opening a project shows a local poster: a copy of the video's own thumbnail, or the portrait Shorts thumbnail for Guiding Hands. There are no YouTube requests and no iframe.

**Playback.**
- Watch Demo, on the poster or in the panel, mounts the `youtube-nocookie.com` embed (`autoplay=1` after the click, `rel=0`, `playsinline`).
- The poster stays underneath until the player loads, so the frame never goes blank.
- Fullscreen is enabled through `allowFullScreen`.

**Stopping.** Switching media, closing the dialog or changing project unmounts the iframe, which stops playback.

**Focus.**
- The gallery's Play button moves focus to the player's frame, a wrapper in this page rather than the cross-origin iframe, so Escape still closes the dialog. Tab enters YouTube's controls.
- The panel's Watch Demo leaves focus on its own button.

**Fallback.** "Watch on YouTube ↗" is always in the caption row. If the player hasn't loaded after 15 s, a status line points to it.

**Framing.** Video frames are sized to their true aspect ratio. Portrait Shorts use the stage height and are never cropped into 16:9. Measured player sizes:

| Video | 1440×900 | 768×1024 | 390×844 |
| --- | --- | --- | --- |
| Short | 334×594 | 248×441 | 164×292 |
| Road Report | 16:9 | 16:9 | about 90% of the stage width |

## Guiding Hands photos

The four supplied photos are copied from `guiding-hands-phase9-agent-package.zip` into `public/images/projects/guiding-hands/` as the package's optimized WebPs. The original JPEGs stay in the ZIP, which is kept locally and not committed.

Gallery order:
1. Projected game board (the result)
2. Demo video
3. Team demo (the people)
4. Projector setup (the installation)
5. Jetson board (the embedded hardware)

Alt text describes only what is visible. Two deliberate choices:
- **Jetson model:** the photo's alt text doesn't name a model. The "Orin Nano (target)" label in the tech list comes from the repository's `CONTEXT.md`.
- **Robot:** the Makeblock robot on the board is described neutrally, because the repository's README states that "No robot commands are sent by this prototype."

**Image loading.** Local gallery images now go through Next's image optimizer, with `sizes` and lazily loaded thumbnails. Opening Guiding Hands loads, for example, a 10 KB thumbnail instead of the 144 KB original. Remote stills are used as-is.

## Dossier panel

- **Masthead:** the card's motif glyph, the numeral and the arcana name, plus Close.
- **Title block:** a discipline label, the title, a status badge (only for real states), and a one-sentence lede.
- **Actions** sit directly under the lede: Watch Demo, View Live Demo and Source on GitHub. Each appears only when real, and the first is the primary action.
- **Record:** numbered I/II/III entries (The Problem, What I Built, Engineering Decisions) separated by gilt hairlines. The rover's third entry is headed "Design Approach".
- **Signal Path:** a new optional `story.flow`, used for Guiding Hands. It shows the eight-stage path from camera frame to browser game as one quiet line of steps joined by arrows.
- **Built with:** a grouped technology ledger rather than badges.
- **Styling:** indigo paper, a held violet glow, a fixed gold hairline and a faint motif watermark.

**Responsive fixes found in testing.**
- The thumbnail strip overflowed the stage on tablet and mobile. The gallery grid's `auto` column grew to fit its content, so it now uses `minmax(0, 1fr)`. The arrows stay put, the strip scrolls, and the active thumbnail is kept in view by scrolling the strip itself.
- Image and video frames may use up to 62% of the stage width. That changes nothing on desktop, where frames are limited by height, but makes them larger on narrow stages.

## Copy: sources

Every claim was checked against the repositories and their commit authorship.

**Guiding Hands** (team project):
- **Feature extraction** is from `controls.py`: 21 landmarks, finger-bend angles, and thumb-to-fingertip pinch distances divided by palm size.
- **Fail-safe behaviour** is from `CONTEXT.md` and the README: tracking loss, ambiguous gestures and slow inference all stop movement, and the receiver is expected to stop when packets stop.
- **Transport:** JSON over UDP, then a Node.js relay and WebSockets.
- **Physical setup:** a projector on a table mount and a 36 × 20 in board.
- **Credits:** teammates wrote the controller and the game. Marc built the display-only React companion.
- **Claims:** no clinical claims are made. The repository itself calls its features "not clinical measurements".

**Road Report:** Marc wrote the classifier, its validation and its tests; teammates built the map and routing. The copy cites the real rule weights and clarification cases.

**SpeakLab AI:**
- The architecture decision comes from Marc's own audit notes.
- The session API with owner-only access is still an open PR by a teammate, so it is described as "in review".
- Common Voice evaluation is listed as in progress.

**Delivery Rover:**
- The completed CAD scope comes from the owner: chassis, tray, mast, mounting space and clearance planning.
- All electronics are listed as planned, and autonomy comes after them.
- The copy states plainly that the rover has not been assembled or driven.

**ZBXP:**
- XP is awarded by Supabase RPCs, with one level per 100 XP and ranks E to S.
- The Pomodoro timer awards no XP, so the copy doesn't claim it does.
- Whether the leaderboard is per guild is unverified, so the copy says "the leaderboard".

## Verification

`npm run typecheck`, `npm run lint` and `npm run build` all pass.

The production build was driven with Playwright and system Chrome in five configurations:

- 1440×900, WebGL
- 768×1024, WebGL
- 390×844, WebGL
- 1440×900, `prefers-reduced-motion: reduce`
- 1440×900, WebGL disabled (fallback grid)

**In every configuration:**

- **Open and close:** all five projects open and close, with both Escape and Close.
- **Focus:** on close, focus returns to that project's control. The focus trap held over 30 Tabs.
- **Overflow:** no horizontal overflow, and the gallery arrows stay inside the stage.
- **Guiding Hands on open:** it opens on the projected-game photo with zero YouTube requests.
  - All five items render. Each photo is loaded, has alt text and keeps its orientation.
  - The panel's Watch Demo mounts the nocookie embed, and the Short plays: `currentTime` advances, the video isn't paused, and the stream is 480×854, which is portrait.
  - Moving to the next item removes the iframe, and closing while it plays removes it too.
- **Changing project:** opening Road Report next starts fresh on its own poster, with no iframe and no requests. Its own video plays, and Escape closes the dialog after Play.
- **Reopening:** Guiding Hands reopens on photo 1 with no iframe.
- **Reduced motion:** the panel and media-float animations are `none`.
- **Console:** no errors or warnings, apart from the known GPU notices from headless rendering.

Screenshots are in `output/playwright/phase-9/`: `before-*`, `after-desktop-*`, `after-tablet-*` and `after-mobile-*`.

## Limitations

- **Embedding failures:** these can't be detected across origins without the YouTube IFrame API. The always-visible link and the 15 s notice are the fallback.
- **Focus inside the player:** once keyboard or mouse focus is inside the YouTube player, Escape belongs to the player. Shift+Tab out, or use Close.
- **iOS Safari:** it may require a second tap inside the player before playback starts.
- **Mobile Shorts:** the player is compact on phones (164×292). YouTube's fullscreen control is available.
- **Robot:** the robot in the projected-game photo is not part of the described system.
- **Asset-package copies:** a second copy of the package ZIP sits in `data/`. It is identical to the copy at the repository root and was left untouched and uncommitted.
