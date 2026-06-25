# Portfolio Remote Editing Workflow

This document makes it easy for Jared to message Hermes, request portfolio changes, preview them, and eventually push them live.

## Current source of truth

- Local working folder: `E:/Portfolio/galleryversion`
- Git repository root: `E:/Portfolio`
- Public GitHub repo: `https://github.com/jmcdanielproductions-bit/Portfolio`
- Current public Vercel URL: `https://portfolio-steel-one-45x10q8lkk.vercel.app/`
- Main site entry: `index.html`

## How to ask Hermes for portfolio edits

Use a focused Telegram or desktop message like:

```text
/new
/title Portfolio update
[Portfolio] In E:/Portfolio/galleryversion, update the DOOM case study to make the Xbox proof more prominent. Preserve the Director's Archive style. Preview locally before committing.
```

For smaller copy edits:

```text
[Portfolio] Change the Kairi & Pixel case study language so it emphasizes character creation and campaign universe, not just animation production. Keep it concise and recruiter-friendly.
```

For visual/layout edits:

```text
[Portfolio] Adjust the homepage archive cards so mobile feels cleaner. Preserve the dark archive style, 44px touch targets, reduced-motion fallbacks, and current typography.
```

## Hermes editing checklist

When Hermes edits the portfolio, it should:

1. Run `git -C /e/Portfolio status --short --branch` before changing anything.
2. Inspect the relevant HTML and existing copy/style first.
3. Serve locally when preview is needed:

   ```bash
   cd /e/Portfolio/galleryversion
   python -m http.server 4173 --bind 127.0.0.1
   ```

4. Open `http://127.0.0.1:4173/index.html` in the browser and verify the affected page.
5. Check for browser console errors.
6. Run a final `git diff --stat` and summarize changed files.
7. Ask Jared before pushing unless he explicitly says to push/deploy.

## Push/deploy flow

The repo is connected to Vercel, so pushing to the deployment branch should eventually update the public portfolio.

Safe default flow:

```bash
git -C /e/Portfolio status --short --branch
git -C /e/Portfolio diff --stat
git -C /e/Portfolio add galleryversion/path-to-file.html
git -C /e/Portfolio commit -m "type: short description"
git -C /e/Portfolio push origin main
```

Use conventional commit styles:

- `docs: add portfolio agent workflow`
- `fix: improve mobile portfolio nav`
- `feat: add new portfolio case study`
- `refactor: clean portfolio archive styles`

After pushing, verify:

- GitHub push succeeded.
- Vercel deployment updates.
- Public URL loads: `https://portfolio-steel-one-45x10q8lkk.vercel.app/`

## Files intentionally ignored

The repo ignores local/generated agent artifacts:

- `**/.od-skills/`
- `**/*.artifact.json`
- `galleryversion/*-image.png`

Intentional portfolio assets should be placed in `galleryversion/images/`, not in random generated root filenames.

## Style guardrails

Preserve the portfolio identity:

- Director's Archive, records, dossiers, proof of direction, commentary/creative notes.
- Dark cinematic archive/control-room visual language.
- Anton headlines, JetBrains Mono metadata, Space Grotesk body copy.
- Specific director/editor language: creative problem, approach, responsibilities, outcome.
- Do not genericize into a plain portfolio template.

## Remote access notes

- If messaging the Hermes instance running on the home PC, Hermes can edit local files in `E:/Portfolio/galleryversion`.
- If messaging a NAS/remote Hermes instance, it can inspect the public GitHub/Vercel site but cannot see local unpushed files unless the repo is cloned/mirrored there.
- For always-on edits while the desktop is off, mirror/clone the repo to MIKOSHI/NAS and document the path in SKYNET.
