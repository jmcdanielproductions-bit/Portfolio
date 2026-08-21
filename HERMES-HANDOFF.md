# Portfolio Overhaul — Status & Handoff for Hermes

**File:** `galleryversion/index.html` (~11,200 lines, single-file build)
**Branch:** `main` — everything below is **uncommitted**
**Date:** 2026-08-14

---

## What we're trying to accomplish

Jared is a creative video director/editor. His portfolio is a cinematic, dark, "director's archive" site built around a **3D drag-to-explore record wall** (the signature, most-differentiated element — do not remove or dumb this down). We are overhauling it toward a **"film portfolio like a streaming experience"** direction pulled directly from his own Figma Make moodboard: Disney+/Netflix-style — dark ground, hero banner, horizontal category carousels, rich detail views — **without losing the 3D wall**.

Two hard constraints given by Jared, non-negotiable:
1. **Keep the 3D wall.** It's the reason this portfolio stands out. Enhance around it, never replace it.
2. **Performance on both Chrome and Firefox.** An earlier audit found the codebase's performance strategy was Chrome-only (a `.chrome-performance` UA-sniff class strips expensive effects only in Chrome), leaving **Firefox running the heavy, unoptimized path** — worse backdrop-filter cost, more simultaneous video loops, per-frame raycasting. Every new feature added this session was built with an explicit "when does this freeze/turn off" answer (scroll, off-screen, modal-open, reduced-motion, hidden tab) specifically so it doesn't repeat that mistake. **However: all verification this whole project has been done in a Chromium-only preview tool — real Firefox has never actually been tested.** This is the single biggest open risk.

The agreed architecture for the home/archive experience, top to bottom:
1. **Rotating video-first hero banner** (Disney+-style) — plays real loop clips of featured work, not thumbnails.
2. **The 3D record wall** — unchanged, sits directly below the hero, already its own full-height section.
3. **Category carousels** — Disney+-style horizontal rows below the wall, grouped by the site's existing filter tags (Gaming/Commercial/Narrative+Experimental).

Sections **not yet touched** (explicitly deferred by Jared to get individual attention later): the `#work` room's flat duplicate grid (architecture question — does it get consolidated or kept as a dedicated filterable browse view?), and no visual redesign has gone beyond incremental fixes on About/Contact.

---

## What has been done (this session, chronological)

1. **Wall enlargement pass** — cards were undersized relative to the viewport. Enlarged via `computeLayout()`'s `maxColW`/`stageH` (not `transform:scale`, so drag/hit math stayed correct automatically). Result: 1920×1080 cards went 430px→505px (+17%), 2560×1440 went to 520px (+21%). Laptop/mobile paths untouched by design.

2. **Ported the Disney+ direction into the real site**, replacing the old single-video hero:
   - **Hero rotator** (`#heroReel`) — dual-slide cross-blur dissolve between the Director Reel + the 4 real "Featured" projects (Cyberpunk 2077, DOOM, Fallout/Nuka-Cola, The Witcher), using their real local loop `.mp4` files with a YouTube-still poster fallback, subtle Ken Burns zoom, ambient play/pause toggle preserved, auto-pauses when the case-study preview or video modal is open.
   - **Category carousels** (`#carouselRows`, inserted as a sibling *after* `.archive-stage` closes — NOT inside it, since `.archive-stage` is `display:grid;place-items:center` and would otherwise squeeze/center the whole block) — three rows grouped by real `filters` tags. Each row: cards duplicated for a seamless ambient marquee drift (alternating direction per row), a one-time "float into place" reveal on first scroll into view (cards converge toward center + rise + fade, staggered), single-budget hover-preview video (only one loop ever decodes at a time, verified), hidden scrollbars with edge-fade masking and hover arrows (made always-visible on touch devices — initially missed this, they were hover-only and unusable on mobile).
   - **Tilt-shift depth bands** — two fixed, graduated-blur strips top/bottom. Chrome already strips all `backdrop-filter` sitewide via an existing rule, so these cost nothing there; added our own scroll-triggered removal for Firefox specifically (the browser the audit flagged as the actual risk).
   - **Freeze coordination** — marquee drift and tilt-band blur both freeze during active scroll (160ms idle debounce), when the site's existing `rw-preview` (case-study overlay) or `#videoModal` (YouTube modal) is open (read via existing DOM state — zero changes made to those pre-existing systems), off-screen (IntersectionObserver), hidden tab, reduced-motion.

3. **Nav redesign** — the top bar looked like a plain rectangular taskbar. Fixed by NOT rounding the wide outer header bar (that just rounds the far ends of a stretched shape, looks worse) — instead stripped the outer `<header>` of all background/border/shadow entirely (now a transparent layout grid) and moved the actual pill visuals onto `.header-nav` itself, sized to fit only its tab content. Active route now renders as a solid white pill (matching the Disney+ "For You" reference Jared provided), inactive tabs are plain text. Brand name/social icons float free with text-shadow for legibility instead of a background box.

4. **Removed dead overlay content** — the "Creative Leadership Record" statement box and "Fast Path / Start Here" nav box that sat on top of the wall were cut entirely per Jared's request (pre-existing elements, not part of the new build).

5. **About/Contact/Work visual consistency pass** — found and fixed two font-family gaps identical in nature to a bug already found in the hero (headline text silently falling back to Space Grotesk instead of Anton): About's main headline, and border-radius missing entirely from About's CTA button. Contact was already correctly styled. Work room cards were already correctly styled — its only outstanding issue is architectural duplication (see below), not visual.

6. **Found and fixed a real, pre-existing HTML bug**, not introduced this session: `<header class="site-archive-header"` was missing its closing `>` before the next tag. Browsers' error-recovery parsing silently swallowed the `.header-identity` wrapper's `class` attribute, so the brand name and role subtitle spans became unconstrained direct children of the header instead of a contained ~210px block — they stretched to ~563px wide, which is why the subtitle looked "cut off and far from the name" with an unblended shadow nearby. This had been sitting invisible for an unknown amount of time because the old opaque header background happened to mask the broken layout. It only became visible once that background was stripped for the pill redesign. **This suggests other similar dormant HTML errors may exist elsewhere in this file — see the ask below.**

Everything above has been verified in-browser (Chromium tool only): structure, console errors, broken-resource checks, responsive behavior at 2560/1920/1440/1366/390px widths, and the freeze/pause logic tested via direct DOM state manipulation across real elapsed time.

---

## What Hermes should do next

Paste the prompt below as-is, or adapt it — it's written to be self-contained.

```
CONTEXT
You're continuing work on Jared McDaniel's portfolio site at galleryversion/index.html,
a single-file ~11,200-line build. The site is mid-overhaul toward a Disney+/streaming-style
home experience (rotating video hero -> 3D drag-to-explore record wall -> category carousels)
while preserving the record wall as the signature element. Nothing is committed to git yet.

HARD CONSTRAINTS — do not violate these:
1. The 3D record wall (#rwStage / rw-wall engine, computeLayout/buildWall functions) must
   stay. Do not replace, flatten, or degrade its interaction model.
2. Performance must hold up in BOTH Chrome and Firefox. The existing codebase has a known bad
   pattern: a `.chrome-performance` UA-sniff class strips expensive effects (backdrop-filter,
   per-frame filter writes, extra video loops) ONLY on Chrome, leaving Firefox on the
   unoptimized path. Do not add new effects without an explicit answer to "what turns this
   off, and when" (scroll, off-screen, modal-open, reduced-motion, hidden tab are the
   established patterns already in use for the hero rotator and carousel rows this session).
3. NEVER assume a browser-tool screenshot or getComputedStyle read is ground truth without
   cross-checking — this session hit a case where a non-compositing/hidden preview pane
   returned stale paint-property values (color/background) while layout properties (width,
   border-radius) stayed accurate. When in doubt, verify via multiple independent methods
   (fresh isolated test element, direct source-text confirmation via cache-busted fetch, and
   real screenshots) before concluding something is broken.

IMMEDIATE TASK — HTML validation sweep
This session found a real, previously-invisible bug: a `<header ...` tag was missing its
closing `>`, which caused browser error-recovery parsing to silently swallow a child
element's class attribute, breaking its layout in a way that was masked by unrelated styling
for an unknown length of time. Do a full HTML validation pass on galleryversion/index.html
(e.g. run it through an HTML validator, or manually check tag-balance/attribute-closure on
the file) to find and fix any other similar dormant markup errors before they surface the
same way after a future style change removes whatever is currently hiding them.

AFTER THAT — pending decisions, don't just pick one:
1. The #work room shows a flat grid of the same 4 featured projects the wall and carousels
   already show. Ask Jared whether to (a) consolidate it away, (b) keep it as a dedicated
   filterable "browse everything" view distinct from the home experience, or (c) leave as-is.
2. Nothing in this project has been verified in real Firefox. Ask Jared to open the site in
   actual Firefox and report whether the tilt-shift blur bands and carousel marquee feel
   smooth, before any more backdrop-filter-based effects get added.

Read galleryversion/portfolio-data.json for the canonical list of all 17 projects + reel
(YouTube IDs, loop video paths, case-study page links) if you need project data — don't
re-derive it from the HTML.
```

---

## Audit snapshot (for reference)

| Area | Status |
|---|---|
| 3D wall | Enlarged, verified, untouched otherwise |
| Hero | Rebuilt — video rotator, real data, verified |
| Carousels | Built — marquee/reveal/hover-preview/freeze, verified |
| Tilt-shift bands | Built, Chrome-free via existing sitewide rule, Firefox-gated on scroll |
| Nav header | Redesigned to pill, **one real HTML bug found+fixed** |
| About | Font + button fixed, otherwise strong pre-existing content |
| Contact | Already consistent, no changes needed beyond verification |
| Work room | Visually consistent; **architecturally duplicates wall/carousel content — undecided** |
| Firefox testing | **Never done — Chromium-only tool used all session** |
| HTML validity | **One bug found; full sweep not yet done** |
| Git | Nothing committed |
