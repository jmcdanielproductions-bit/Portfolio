# Portfolio — Handoff File for OpenDesign App

**Repo location:** `C:\Users\cyber\Projects\portfolio-git`
**Working file:** `galleryversion/index.html` (single-file, ~11,400 lines)
**Branch:** `main` — commit `05eddce`, pushed to `origin/main`
**Remote:** `github.com/jmcdanielproductions-bit/Portfolio.git`
**Date:** 2026-08-21

---

## Where things are

| File | Purpose |
|------|---------|
| `galleryversion/index.html` | The entire site — single-file HTML/CSS/JS build (~11,400 lines, 408KB) |
| `galleryversion/portfolio-data.json` | Canonical project data (17 projects + reel: YouTube IDs, loop MP4 paths, case-study page links) |
| `galleryversion/mockups/` | Design mockups (5 HTML files — refer to these for intended visual direction) |
| `galleryversion/video/` | Loop MP4 files for hero rotator and carousel hover previews |
| `HERMES-HANDOFF.md` | This file |

**Open with:** Open your browser directly on `galleryversion/index.html` to see it running.

---

## Current state (what's built)

The site is partway through a redesign toward a **Disney+/streaming-style film portfolio** while preserving the signature 3D drag-to-explore record wall.

**Already built and working:**
1. **Hero rotator** (`#heroReel`) — full-screen video hero that crossfades between the Director Reel and 4 featured project loops (Cyberpunk 2077, DOOM, Fallout Nuka-Cola, The Witcher). Ken Burns zoom, ambient play/pause, auto-freezes when modals are open.
2. **3D record wall** (`#rwStage`) — signature drag-to-explore grid, enlarged and working.
3. **Category carousels** (`#carouselRows`) — three horizontal marquee rows below the wall (Campaigns & Trailers, Commercial & Brand, Narrative & Experimental). Hover video previews, scroll-based reveal animation.
4. **Tilt-shift depth bands** — fixed blur strips top/bottom that freeze during scroll/modal.
5. **Nav pill redesign** — transparent header with solid-white active tab pill (Disney+ style).

**Pages/rooms (hash-based routing):**
- `#archive` (default) — hero + wall + carousels → the main home experience
- `#work` — filterable flat grid (duplicates content from wall/carousel, architecture still undecided)
- `#about` — director bio page (hero record, statement, operating model, signals grid, CTA)
- `#contact` — contact/transmission room page

---

## What needs to be done — the 5 issues

### 1. ABOUT page — simpler, better looking

The current About page (`#about` / `.about-room` section starting at line ~8438) has these sections stacked vertically:
- Hero Record (big headline + metadata dossier)
- Director Statement (blockquote + body text)
- Operating Model (3-step numbered process)
- Signal Grid (5 project links in a grid)
- CTA / "Start a Conversation" button

**What's needed:** A cleaner, simpler layout that doesn't feel like scrolling through a dossier. Fewer sections, more breathing room, better visual hierarchy. The tone should be professional cinematographer/director, not a resume. Think: single scrollable editorial page with generous whitespace, the right typographic rhythm.

### 2. CONTACT page — simpler, better looking

The current Contact page (`#contact` / `.contact-room` starting at line ~8587) has:
- Control hero (headline + transmission status aside)
- Contact console (email link + social links + project scope note + CTA button)

**What's needed:** Cleaner, more inviting. Less dense. The email should be prominent but the whole thing should feel like a friendly invitation to reach out, not a control panel. More breathing room, warmer tone.

### 3. Director's Reel floats away (doesn't stay fixed)

**THE KEY BUG.** The hero reel section (`.hero-reel-section` at line ~7930) lives **outside** the room-switching system. The room system toggles `active` class on `[data-room]` elements — but `.hero-reel-section` has no `data-room` attribute, so `showRoom()` never touches it.

**Current behavior:** Click #about or #contact → the about/contact room appears AND the hero reel stays at the top of the page the entire time. The reel occupies 100dvh of space, so the about/contact content starts way below the fold, after a full-screen hero section that has nothing to do with those pages.

**What's needed:** When you navigate to `#about`, `#contact`, or `#work`, the hero reel should **disappear / float away** (fade out, slide up, or collapse). It should only show on the `#archive` (home) room. The fix is in `showRoom()` (around line 9515) — needs to also toggle the hero reel's visibility based on room name.

### 4. Harsh shadowing under thumbnails and task bar

**Thumbnail shadows:** The `.archive-piece` cards have heavy box-shadows on hover:
```css
box-shadow: 0 24px 70px rgba(0, 0, 0, 0.36), 0 0 48px rgba(111, 140, 255, 0.12);
```
And the `::before` pseudo-element gradient:
```css
linear-gradient(180deg, rgba(8, 10, 13, 0.02), rgba(8, 10, 13, 0.68))
```
These create a harsh, muddy shadow effect underneath the thumbnails. The border glow is also quite strong.

**What's needed:** Softer, subtler shadows. More elegant, less aggressive. Think Netflix/Apple TV card styling — subtle drop shadows, not heavy dark gradients.

### 5. Categories should be a TAB section, not just scrolling down

The "Campaigns & Trailers", "Commercial & Brand", "Narrative & Experimental" rows (`.carousel-rows` at line ~8368) are currently horizontal marquee carousels that scroll below the wall on the home page.

**What's needed:** These categories should be a dedicated TAB section on the site — either as a separate page/room, or as a tab bar within the home view that switches which category row is visible. The idea is you click "Campaigns" and the view filters to just that content, rather than scrolling past all three rows.

---

## Technical notes

**Room system:** Hash-based routing. `showRoom()` (line 9515) toggles `active` class on `[data-room]` elements. Rooms are: `archive`, `work`, `about`, `contact`. Hero reel (`#heroReel`) is **not** in this system — that's the bug.

**Performance constraints (IMPORTANT):**
- The site must perform well in **both Chrome and Firefox**. There's a known pattern where `.chrome-performance` class strips effects only on Chrome, leaving Firefox on the unoptimized path.
- Don't add expensive effects (backdrop-filter, per-frame operations, multiple simultaneous video decodes) without a plan for when they turn off (off-screen, reduced-motion, modal-open, hidden tab).
- The hero rotator and carousel marquees already have freeze coordination built in — respect the existing freeze flags.

**Navigation:** The header nav links use hash links (`href="#about"`, `href="#contact"`, etc.). Active tab highlighting is handled by `setActiveHeaderLink()` (line 9646).

**Brand text:** "Director's Archive" in the nav. Tagline: "Creative Video Director / Editor". Colors: dark ground (`#080b12`), blue accent (`#6f8cff`), white ink (`#f2eee7`). Headline font: **Anton** (uppercase). Body font: Space Grotesk.

---

## How to use this file

The companion **OpenDesign prompt** is below. Copy-paste it into OpenDesign, and it will generate about/contact page redesigns and the category tab system. Use this handoff file as reference for where things are and how they work.