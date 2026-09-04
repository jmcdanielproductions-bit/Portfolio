# Portfolio — Comprehensive Design Handoff

**Repo location:** `C:\Users\cyber\Projects\portfolio-git`
**Working file:** `galleryversion/index.html` (single-file, ~14,000 lines, ~500KB)
**Branch:** `main` — commit `de118a2`, pushed to `origin/main`
**Remote:** `github.com/jmcdanielproductions-bit/Portfolio.git`
**Live URL:** `https://jmcdanielproductions-bit.github.io/Portfolio/galleryversion/index.html`
**Date:** 2026-09-04

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & Routing](#2-architecture--routing)
3. [Design System](#3-design-system)
4. [Rooms / Pages](#4-rooms--pages)
5. [Animation Systems](#5-animation-systems)
6. [Data Layer](#6-data-layer)
7. [Known Issues / Improvement Candidates](#7-known-issues--improvement-candidates)
8. [Sketch Mockups (Reference)](#8-sketch-mockups-reference)
9. [Improvement Checklist](#9-improvement-checklist)
10. [Design Prompt](#10-design-prompt)

---

## 1. PROJECT OVERVIEW

Jared McDaniel's film portfolio — a dark, cinematic single-page "Director's Archive" built for a Creative Video Director/Editor working with AAA gaming and entertainment brands (CD Projekt Red, Bethesda, Xbox, Apple, Corsair).

**Tech stack:** Single-file HTML/CSS/JS (~14K lines, 500KB). No build step. No framework. Hash-based room routing. Vanilla JS throughout.

**Aesthetic:** Dark cinematic with blue accent. Think Disney+/Netflix streaming interface meets editorial portfolio. Headlines in Anton (uppercase), body in Space Grotesk, mono elements in JetBrains Mono. Blue accent `#4A7C9D` with gold `#d6b77a` highlights.

**Signature feature:** 3D drag-to-explore record wall built with vanilla JS physics — cards arranged on a parametric grid that the user can drag left/right with mouse parallax, idle floating animation, and column perspective curvature. Desktop-only (90cm+ width, fine pointer).

**Deployment:** GitHub Pages at `jmcdanielproductions-bit.github.io/Portfolio/galleryversion/index.html`

---

## 2. ARCHITECTURE & ROUTING

### Hash-based Room System

Five rooms, each a `<section>` with `data-room` attribute and `class="room"`:

| Hash | Room | Description |
|------|------|-------------|
| `#archive` | Home page | Hero intro + Record Wall + Brand Partners + Category Carousels |
| `#work` | Selected Work | Featured project screening room (rotating hero frame + selector strip) |
| `#browse` | Browse | Category carousels (Campaigns, Commercial, Narrative) |
| `#about` | About | Director profile with philosophy, process, BTS, personal notes |
| `#contact` | Contact | Intro panel + intake form + direct contact links |

### Key Functions

- **`showRoom(roomName)`** (line ~11871) — toggles `active` class on `[data-room]` elements. Also toggles `is-archived-away` on the hero reel (`#heroReel`). Dispatches `jm:roomchange` custom event.
- **`syncRoute()`** (line ~11906) — hash-change listener. Checks `window.location.hash`, calls `showRoom`. On `file://` protocol skips `startViewTransition` to avoid hanging.
- **`setActiveHeaderLink()`** (line ~12035) — highlights current nav pill based on hash.

### Room Visibility

Rooms use `display: none` / `display: block` toggling via `.active` class. The `.glide` engine (see below) re-measures elements on every `jm:roomchange` event to account for the display state change.

### Nav Header

Fixed header at top with logo (brand text), center pill nav (Archive, Browse, About, Contact, Reel), and social icons. Header-parallax effect on hover using spring- lerp of CSS custom properties.

---

## 3. DESIGN SYSTEM

### CSS Custom Properties (`:root` ~line 11)

```css
--bg: #0E131F;
--bg-deep: #080B12;
--ink: #E8EDF2;
--muted: rgba(232, 237, 242, 0.62);
--faint: rgba(232, 237, 242, 0.34);
--line: rgba(232, 237, 242, 0.12);
--line-blue: rgba(74, 124, 157, 0.28);
--blue: #4A7C9D;
--blue-muted: #3D5A73;
--blue-deep: #1A2B3E;
--blue-atmosphere: rgba(74, 124, 157, 0.16);
--blue-soft: rgba(74, 124, 157, 0.12);
--glass: rgba(14, 19, 31, 0.78);
--glass-frost: rgba(26, 43, 62, 0.55);
--gold: #d6b77a;
```

### Typography

| Usage | Font | Weight | Case |
|-------|------|--------|------|
| Headlines (H1, H2) | Anton / Impact | 400 | Uppercase |
| Body text | Space Grotesk | 400-700 | Mixed |
| Mono labels / codes | JetBrains Mono | 500-700 | Uppercase |
| Accent body | Sora | 400-700 | Mixed (about/contact only) |

### Environment / Background Layers

The site creates depth with multiple fixed-position layers:

1. **`.environment-light`** — radial gradients that shift with mouse parallax (via `--mx`, `--my` CSS vars), breathing animation
2. **`.environment-geometry`** — three thin rings + horizontal planes, semi-transparent blue
3. **`.chamber-architecture`** — nested rings (`ring-a` through `ring-c`) and light columns (`column-a` through `column-c`) with `animation: columnBreath`
4. **`body::before`** — repeating radial dot grid + blue vertical lines
5. **`body::after`** — grid scanline overlay with framework drift animation
6. **`.tilt-band`** — top/bottom fixed blur vignette (`backdrop-filter: blur(9px)`) that drops during active scroll

**Important:** Chrome has a `.chrome-performance` class that strips many parallax/layer effects. Firefox gets the full experience.

### Per-Project Mood Colors (Record Wall)

```js
MOODS = {
  "cyberpunk-2077": { mood: "#ff3d72", soft: "rgba(255,61,114,.15)" },
  "doom":           { mood: "#ff6b35", soft: "rgba(255,107,53,.15)" },
  "witcher":        { mood: "#9fc7ff", soft: "rgba(159,199,255,.14)" },
  "fallout-nuka-cola": { mood: "#cc3333", soft: "rgba(204,51,51,.15)" },
  "kairi-animation-storyboard": { mood: "#f3c74e", soft: "rgba(243,199,78,.15)" },
};
```

The wall's ambient tint (`--rw-mood`) shifts based on the nearest card's mood color. This system could be extended to theme entire rooms.

---

## 4. ROOMS / PAGES

### Archive (Home) — `#archive`

The primary page. Contains:

1. **Archive Identity** — H1 "Jared McDaniel" + role text. Animated intro sequence that scales from 3.25x down to identity position. Settles after intro animation.
2. **Record Wall (`#rwStage`)** — 3D drag-to-explore grid. The signature experience. Built with vanilla JS physics. Desktop-only (min-width 900px, min-height 680px, fine pointer). Mobile gets a flat list fallback.
3. **Brand Partners** — Logo strip (CD Projekt Red, Bethesda, Xbox, Apple, Corsair, Invincible)
4. **Category Carousels** — Horizontal marquee rows (Campaigns & Trailers, Commercial & Brand, Narrative & Experimental) with hover video previews
5. **Hero Reel (`#heroReel`)** — Full-screen video rotator with cross-blur dissolve between the Director Reel and 4 featured projects. GhostCursor Three.js particle system. Play/pause toggle.

### Work — `#work`

Selected project screening room. Rotating hero frame with:
- 16:9 poster image → hover video replacement
- Project info (number, title, client, role)
- Case study link
- 4-selector thumbnail strip with accent color per project
- Tilt parallax on hover (translates based on cursor position)
- Ambient atmosphere glow that changes per project

### Browse — `#browse`

Category browser — the same carousel rows as the archive home, rendered standalone. Built by the same `buildBrowseCarousels()` function.

### About — `#about`

Director profile page with sections:
- **001 / ABOUT** — Hero headline + bio + identity meta dl + BTS image
- **002 / POINT OF VIEW** — Blockquote philosophy
- **003 / PROCESS** — 3-column grid (Direction, Editorial, Development)
- **004 / BEHIND THE FRAME** — BTS image grid (cyberpunk, doom production photos)
- **005 / PERSONAL** — Personal interests list
- **006 / NEXT** — Future aspirations
- **007 / CONTACT** — CTA link to contact room

### Contact — `#contact`

Two-column layout:
- **Left:** Intro panel (headline, subtext, signal metadata)
- **Right:** Intake form (name, email, project type radio grid, textarea, submit)
- **Bottom:** Direct contact info (email, social links)

---

## 5. ANIMATION SYSTEMS

### 1. Glide Engine (NEW — added Sep 2026)

Located at line ~13339. Replaces the old `.scroll-focus` IntersectionObserver.

**How it works:** A single `requestAnimationFrame` loop maps each `.glide` element's scroll position (0→1) to opacity, `filter: blur()`, `transform: translateY() scale()`, and `transform`. Uses cubic ease-out easing.

**Per-element config via data attributes:**
- `data-glide-blur` — blur at entry start (default 14px)
- `data-glide-y` — translateY offset (default 40px)
- `data-glide-scale` — scale at entry start (default 0.94)
- `data-glide-stagger` — stagger offset 0–0.45 (defaults to index/N)

**Entry window:** From element bottom at viewport bottom → element center at 30% from viewport top.

**Edge behavior:**
- Progress ≥ 1 → `opacity: 1; filter: blur(0); transform: none;` + class `.is-visible`
- Progress ≤ 0 → full blur/translate/scale; JS sets inline styles

**Room switches:** When `showRoom()` fires, the engine re-measures via double `requestAnimationFrame`.

**Reduced motion:** Entire engine skips if `(prefers-reduced-motion: reduce)` matches.

### 2. Intro Sequence

- **Skip button** (fixed bottom-right) — sets `body.skip-intro`
- **Archive identity** starts at 3.25x scale in center → settles to small header identity via `body.intro-settled`
- **Record wall** cards animate in from random outward vectors with staggering
- **Intro scrim** fades from black

### 3. Hero Reel Rotator

Dual-layer slide cross-fade with blur dissolve. Alternates between `#heroSlideA` and `#heroSlideB`. 9-second rotation. Freezes on hidden tab / modal open. GhostCursor Three.js particle system follows mouse within the hero section. Ken Burns-style scale animation on slides.

### 4. Record Wall Physics Engine

~1300 lines (~line 12197). Complex vanilla JS system:
- Parametric layout: rows × columns computed from record count + viewport
- Flagship records always own center of middle band
- Drag-to-look: momentum-based with spring lerp (`lerpSpeed: 0.06`)
- Column perspective: cards at edges get more rotateY, less scale, more opacity fade
- Idle floating: subtle sin-wave drift after 7.2s of inactivity
- Chrome performance: lower resolution settings, 30fps throttle

### 5. View Transition API

Room switches use `document.startViewTransition()` for a cross-blur animation (`@keyframes blurPageOut / blurPageIn`). Skipped on `file://` protocol.

### 6. Mouse Parallax

Multi-layered parallax driven by `pointermove` event:
- `--mx` / `--my` CSS vars (mouse offset from center) mapped at ~30fps
- Environment light layers shift at different rates
- Header identity, nav, and social icons shift independently
- Record wall gets additional parallax on per-card transform
- Selected work frame gets tilt on pointer move

### 7. Scroll Progress Rail

Thin fixed bar on the right edge of the viewport. Height maps to `scrollY / (scrollHeight - windowHeight) * 100`. Linear gradient from blue to muted blue. Updates on scroll via passive listener.

---

## 6. DATA LAYER

### `portfolio-data.json` (external) + inline data (~line 10948)

The single source of truth for projects. Contains:

```js
const reelArchiveItem = { slug, title, yt, loop, isReel: true, ... };
const projects = [ { slug, code, title, yt, loop, client, role, type, year, filters, page, tags, ... }, ... ];
```

**18 projects** across categories:
- Featured (4): Cyberpunk 2077, DOOM, Fallout/Nuka-Cola, The Witcher
- Commercial (6): Product Experience, Invincible Novablade, Prime Gaming Week, BMW Fanatec, Experience Store, Kairi & Pixel
- Experimental (5): Frame Cut, Lil Baby, Iron Man, Luffy, Silent Collapse
- Narrative (1): Ashfall
- Trailer (1): Shugo Samurai

**DOSSIER_SLUGS** (5 projects with case studies): cyberpunk-2077, doom, witcher, fallout-nuka-cola, kairi-animation-storyboard

---

## 7. KNOWN ISSUES / IMPROVEMENT CANDIDATES

### Existing Bug: Hero Reel on Non-Archive Pages
**File:** `index.html` (line ~11878)
**Problem:** The hero reel (`#heroReel`) is now toggled by `showRoom()` with `is-archived-away` class, but the reel still occupies space in the DOM. The CSS collapse transition works but could be more elegant.

### 1. RECORD WALL — Desktop Only
The wall engine requires `(min-width: 900px) and (min-height: 680px) and (pointer: fine)`. Below that, a flat list fallback (`#rwMobile`) renders. The mobile experience is significantly weaker.

**Improvement candidate:** Rebuild the mobile fallback as a swipeable vertical card stack or horizontal scroll strip.

### 2. ROOM TRANSITIONS — Abrupt on Non-Chrome
`startViewTransition` is Chrome-only. Firefox, Safari, and Edge get an instant `display: none → block` toggle with `roomReveal` animation. No crossfade, no shared-element transition.

**Improvement candidate:** Implement a CSS-only or JS-based crossfade fallback for all browsers.

### 3. ABOUT PAGE — Dense Layout
The about page has 7 sections stacked vertically. The user has previously requested simplification — more breathing room, less dossier feel.

### 4. CONTACT PAGE — Form Spacing
The contact form works but feels dense. The email could be more prominent.

### 5. THUMBNAIL SHADOWS
Cards have heavy box-shadows that can look muddy on dark backgrounds:
```css
box-shadow: 0 24px 70px rgba(0, 0, 0, 0.36), 0 0 48px rgba(111, 140, 255, 0.12);
```

**Improvement candidate:** Softer, more elegant shadows (Netflix/Apple TV style).

### 6. INTERACTION FEEDBACK
- Buttons use basic opacity/color transitions — no magnetic hover, no ripple effect
- No custom cursor
- No data-wave section dividers
- No counter roll-up animations on stats
- No terminal/cyberpunk hacker accents

### 7. TYPOGRAPHY CONSISTENCY
Some sections use Sora as body font (about, contact) while others use Space Grotesk. This was intentional but could be unified.

### 8. PERFORMANCE ON FIREFOX
The `.chrome-performance` class strips effects on Chrome but leaves them on Firefox. Some Firefox users report stutter on the record wall. Consider GPU-composited alternatives.

### 9. MOBILE NAVIGATION
Hamburger menu exists but is minimal. Category carousels are desktop-optimized with overflow masks and arrow buttons.

### 10. NO SMOOTH SCROLL LIBRARY
Scrolling is standard browser scrolling. The `.glide` engine adds scroll-driven animation but doesn't change the scroll feel itself.

---

## 8. SKETCH MOCKUPS (REFERENCE)

Located at `C:\Users\cyber\Projects\portfolio-git\sketches/`:

| File | Theme | Techniques Shown |
|------|-------|------------------|
| `001-cyberpunk-blur-reveals.html` | Cyberpunk | Glitch text, neon borders, scanlines, magnetic buttons, ripple clicks |
| `002-cinematic-scroll-glide.html` | Cinematic | Parallax depth, glass cards, clip-path reveals |
| `003-hacker-data-stream.html` | Hacker | Matrix rain, terminal UI, counter roll-ups, data wave, CRT scanlines |
| `004-scroll-glide-working.html` | Scroll Demo | Working scroll-driven blur/translate/scale engine with progress indicator |
| `005-lavender-color-scheme.html` | Lavender | Purple-dark palette with glass cards, scroll reveals, magnetic buttons |

---

## 9. IMPROVEMENT CHECKLIST

### Priority 1 — Polish (low effort, high impact)

```
[ ] Magnetic button hover (cursor-follow lerp on all CTA buttons)
[ ] Ripple click effect (radial burst from click point)
[ ] Scroll progress rail (already built — tune opacity/width)
[ ] Data-wave section dividers (sweeping gradient pulse)
```

### Priority 2 — Visual Upgrades

```
[ ] Glitch text on H1 or featured project titles
[ ] Scanline overlay (subtle CRT, mix-blend-mode)
[ ] Glass cards with backdrop-filter on about/contact sections
[ ] Neon conic-gradient border on hover for project cards
[ ] Custom scrollbar styling
```

### Priority 3 — Interactive Enhancements

```
[ ] Counter roll-up animations on stats (18 records, 6 brands, etc.)
[ ] Terminal-style UI accents ($ prompt, ls output on hero/about)
[ ] Custom cursor (crosshair or minimal dot)
```

### Priority 4 — Structural

```
[ ] Unified typography (choose Space Grotesk or Sora, not both)
[ ] About page simplification (fewer sections, more whitespace)
[ ] Contact page simplification (bigger email, less dense form)
[ ] Mobile record wall — swipeable vertical stack
[ ] Cross-browser room transition fallback
```

### Priority 5 — Cyberpunk / Hacker Energy

```
[ ] Matrix rain canvas (background, 8% opacity)
[ ] CRT scanline overlay
[ ] Data-stream pulse lines as section dividers
[ ] Terminal emulator blocks (ls -la ./projects/)
[ ] Cyber buttons (▶ prefix, monospace, glow-on-hover)
```

---

## 10. DESIGN PROMPT

Copy-paste this block into Claude Design / OpenDesign:

```
PROJECT OVERVIEW
Jared McDaniel's film portfolio — a dark, cinematic single-page "Director's Archive" for a Creative Video Director/Editor working with AAA gaming brands (CD Projekt Red, Bethesda, Corsair). Single-file HTML/CSS/JS (~14K lines, 500KB, no build step). Hash-based room routing (archive, work, browse, about, contact). Dark background (#0E131F / #080B12), blue accent (#4A7C9D), white ink (#E8EDF2). Headlines in Anton (uppercase), body in Space Grotesk, mono in JetBrains Mono. Gold highlight (#d6b77a). Signature feature: 3D drag-to-explore record wall with physics engine. Live at https://jmcdanielproductions-bit.github.io/Portfolio/galleryversion/index.html

CURRENT STATE
5 rooms (archive/home, work, browse, about, contact) via hash routing. Hero reel with 2-layer video crossfade rotator. 18 projects across 4 categories. Scroll-driven glide engine (blur + translateY + scale mapped to scroll position). Scroll progress rail on right edge. Room transitions via startViewTransition (Chrome) or instant toggle (others). Record wall with drag-to-look, column perspective, idle float, mood color shift. Intro sequence with identity scale animation. GhostCursor Three.js particle system on hero reel.

WHAT NEEDS IMPROVEMENT (in priority order)

1. CARD SHADOWS — Heavy box-shadows on .archive-piece cards (box-shadow: 0 24px 70px rgba(0,0,0,0.36)) look muddy. Need softer, Netflix/Apple TV-style shadows.

2. ROOM TRANSITIONS — startViewTransition (blur crossfade) is Chrome-only. Other browsers get instant display toggle. Need a CSS or JS fallback crossfade for all browsers.

3. ABOUT PAGE — 7 stacked sections feel dense. Simplify to fewer sections with more breathing room. More editorial, less dossier. Keep BTS images but reduce copy density.

4. CONTACT PAGE — Form feels compact. Make email more prominent. More whitespace. Warmer tone.

5. MOBILE RECORD WALL — Desktop only (900px+). Mobile gets a flat list. Replace with swipeable vertical card stack or horizontal scroll strip.

6. INTERACTION BOREDOM — Buttons use basic opacity/color transitions. Add magnetic hover (cursor-follow lerp), ripple click effect, and custom cursor for the archive room.

7. CYBERPUNK/HACKER TOUCHES — The user wants "slight hacker energy." Consider: data-wave section dividers (sweeping gradient pulse), subtle scanline overlay, glitch text on titles, terminal-style UI accents ($ prompt), counter roll-up animations on stats.

8. DATA STORYTELLING — Add stats display (18 records, 6 brands, 5 case studies) with scroll-triggered number roll-up animation. Display in the hero area or about section.

DESIGN GUIDELINES
- Dark background (#0E131F), blue accent (#4A7C9D), gold highlight (#d6b77a), white text (#E8EDF2)
- Keep the existing CSS variables (:root tokens) intact — new colors should extend the system
- Headline font: Anton (uppercase, no letter-spacing). Body: Space Grotesk. Mono: JetBrains Mono
- DON'T remove or restructure the record wall engine — it's the signature feature
- DON'T replace the hash-based routing with a framework
- DON'T add heavy JS libraries (no GSAP, no Framer Motion, no Locomotive — we have a glide engine already)
- MUST perform in both Chrome AND Firefox (the site has separate perf paths)
- Preserve .chrome-performance class logic (strips effects on Chrome, keeps them on Firefox)
- All animations must freeze on hidden tab and respect prefers-reduced-motion
- The .glide engine already handles scroll-driven reveals (blur + translateY + scale). Enhance it rather than replacing it.
- Existing data: 18 projects in the projects array with yt (YouTube ID), loop (video path), client, role, type, filters, tags, page (case study link)
- Per-project mood colors exist in the MOODS constant — can be extended

OUTPUT: Provide exact HTML/CSS/JS changes. For each issue, show find/replace blocks with surrounding context for unique matching. The file is a single-page build — all changes go into galleryversion/index.html. Scope changes to visual and interaction design — do not propose structural routing changes.
```

---

## Appendix: Key File References

| File | Path |
|------|------|
| Main portfolio | `galleryversion/index.html` |
| Project data (JSON) | `galleryversion/portfolio-data.json` |
| Case study: Cyberpunk | `galleryversion/work/cyberpunk-2077.html` |
| Case study: DOOM | `galleryversion/work/doom.html` |
| Case study: Fallout | `galleryversion/work/fallout-nuka-cola.html` |
| Case study: Witcher | `galleryversion/work/the-witcher.html` |
| Case study: Kairi | `galleryversion/work/kairi-pixel.html` |
| Video loops | `galleryversion/videos/loops/` |
| Mockups | `sketches/` |

### CSS Architecture Notes

All styles are in a single `<style>` block at the top of `index.html`, organized by section with `/* ═══════════════ SECTION NAME ═══ */` dividers. Key sections:

- `:root` vars: ~line 11
- `body` / environment layers: ~line 62
- Header / nav / room base: ~line 290
- Archive page / record wall CSS: ~line 321 (extensive, ~1000 lines)
- About page CSS: ~line 9842
- Contact page CSS: ~line 10350
- Hero reel CSS: ~line 7938
- Glide / scroll rail CSS: ~line 7898
- Category carousels CSS (inline `<style>` in archive room): ~line 8402

### JS Architecture Notes

All JS is in inline `<script>` tags at the bottom of the body. Key blocks:

| Block | Line | Purpose |
|-------|------|---------|
| Glide engine | ~13339 | Scroll-driven reveals + progress rail |
| GhostCursor (Three.js) | ~13458 | Particle system in hero reel |
| Data + helpers | ~10948 | Projects array, utility functions |
| Dialog focus trap | ~11173 | Modal accessibility |
| Room system | ~11869 | showRoom, syncRoute, hash routing |
| Header nav | ~12030 | setActiveHeaderLink, header parallax |
| Record wall engine | ~12197 | 3D wall physics, layout, rendering |
| Hero reel rotator | ~13513 | 2-layer video crossfade |
| Category carousels | ~13742 | Browse room marquee rows |
| Selected screening | ~11683 | Work room projector view |
| Render archive wall | ~11624 | Grid-based archive wall |