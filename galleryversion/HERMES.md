# Jared McDaniel Portfolio — Hermes Context

This folder is the current live portfolio build for Jared McDaniel’s cinematic director/editor portfolio.

## Project location

- Local folder: `E:/Portfolio/galleryversion`
- Git remote: `git@github.com:jmcdanielproductions-bit/Portfolio.git` (SSH, avoids GitHub Desktop/Git Credential Manager popups during unattended pushes)
- Public repo: `https://github.com/jmcdanielproductions-bit/Portfolio`
- Vercel public link found in GitHub About: `https://portfolio-steel-one-45x10q8lkk.vercel.app/`
- Static site: no package manager/build step is currently required for this folder. Serve locally with:

```bash
python -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/index.html`.

## Current structure

- `index.html` — main single-page archive experience with Work/About/Contact/Reel sections.
- `work/*.html` — flagship case-study pages.
- `videos/loops/*.mp4` — local lightweight loop assets for archive cards.
- `images/` — local case-study images and brand logos.
- `mockups/` — design exploration history for the record wall, mobile index, commentary layer, and dossier interaction patterns.
- `PORTFOLIO_WORKFLOW.md` — remote-editing, preview, commit, and push/deploy workflow.

## Portfolio content model

The portfolio is built as a **Director’s Archive**: a curated record wall rather than a generic grid. Preserve this frame when editing.

Core language:

- Creative video director / editor.
- Cinematic trailer, campaign, and brand-film work.
- Games, entertainment, and technology brands.
- Creative leadership from brief to final frame.
- Directing and editing as one connected process: direction shapes what happens; editing shapes how it lands.

Primary proof points currently visible:

- Cyberpunk 2077 — CD Projekt Red — creative/trailer direction, surveillance POV, editorial pressure, campaign cutdowns.
- DOOM — Bethesda — trailer/campaign direction, practical creature work, performance direction, Xbox social proof.
- Fallout / Nuka-Cola — Bethesda — in-universe commercial, retro broadcast language, Fallout tone, gameplay integration.
- The Witcher — CD Projekt Red — cinematic direction, worldbuilding, practical atmosphere, performance direction.
- Kairi & Pixel — CORSAIR / Pixune — character creation, animation direction, Black Friday/Cyber Monday campaign, final edit + SFX.
- Additional archive records include product films, retail campaigns, editorial edits, narrative/experimental shorts, and trailers.

## Style and design language to preserve

Visual identity:

- Dark cinematic environment: deep navy/black background, faint blue grid, glass panels, soft radial light, subtle vignette.
- Editorial/archive language: `REC`, `ARC`, `SIG`, `record`, `dossier`, `proof of direction`, `director’s commentary`.
- Typography: Anton for large compressed titles; JetBrains Mono for labels/metadata; Space Grotesk for readable body copy.
- Palette: warm off-white ink, muted blue atmospheric glow, gold accents, project-specific mood colors.
- Layout: wide archive cards, recruiter fast path, filtered archive, case-study dossiers, commentary/creative notes toggles.
- Motion: cinematic but restrained; honor `prefers-reduced-motion`; mobile should become a calmer weighted index rather than forcing 3D.

Writing voice:

- Specific, cinematic, director-minded.
- Show the creative problem, approach, responsibilities, and outcome.
- Avoid generic hype. Favor proof, taste, constraints, and what the direction made the audience feel.
- Good sentence patterns already in the site:
  - “The products needed to feel like they’d always been there.”
  - “The city isn’t the subject — the loneliness is.”
  - “Intensity was the trap.”
  - “The commercial cannot know the world ended.”
  - “Direction and editing are not separate jobs for me. They’re the same conversation at different stages.”

## Editing rules for Hermes/agents

1. Before changing visuals or copy, inspect the live page locally in a browser.
2. Do not flatten the portfolio into a generic template. Keep the “archive / record / dossier / commentary” concept.
3. Preserve accessibility basics: 44px touch targets, meaningful alt text, focusable video modals, mobile layout, `prefers-reduced-motion` fallbacks.
4. Be careful with existing uncommitted changes. Run `git status --short --branch` before edits.
5. Do not overwrite local creative assets or generated references unless Jared explicitly asks.
6. If creating Obsidian notes from portfolio content, use SKYNET paths:
   - `C:/Obsidian/SKYNET/SKYNET/Efforts/Film Projects/Portfolio Projects/` for portfolio-system/project organization.
   - `C:/Obsidian/SKYNET/SKYNET/Efforts/Client Projects/CORSAIR/` for client/project-specific materials.
   - `C:/Obsidian/SKYNET/SKYNET/Atlas/Creative Taste/`, `Atlas/Film & Directing/`, `Atlas/Editing/`, or `Atlas/Motion Design/` for reusable principles.

## Remote/Hermes access notes

Hermes can interact with this portfolio away from the desktop in three practical ways:

1. **Telegram to the home Hermes desktop** — current machine has Telegram configured and the gateway was observed running on 2026-06-24. This gives Hermes access to the local `E:/Portfolio/galleryversion` folder if the PC/gateway is awake.
2. **Public GitHub/Vercel** — because the repo and Vercel link are public, a remote Hermes instance can inspect the deployed site/repo via web even without local E: drive access.
3. **NAS/Mikoshi mirror** — if Jared wants always-on portfolio work while the PC is off, mirror or clone the repo to the NAS/projects area and keep a note of the path. Do not assume the NAS can see `E:/Portfolio` directly.

Useful remote prompt:

```text
[Portfolio] Use the public repo/site if you are remote. If you are on my home PC, use E:/Portfolio/galleryversion. Preserve the Director’s Archive style and update SKYNET notes under Efforts/Film Projects/Portfolio Projects when you extract career/portfolio knowledge.
```
