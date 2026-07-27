# Understanding Module Descriptors — Standalone HTML Course (SETU-branded)

A clean, modern, self-paced e-learning course built from the *Understanding
Module Descriptors* narration & build script (originally written for Articulate
Rise) and styled to the **SETU Online Course Brand Guide** (SETU Brand
Guidelines v1, May 2022). It is a fully **standalone** static web course — no
build step, no server framework, and no external dependencies (brand fonts are
self-hosted).

**Audience:** Industry-based part-time lecturers with high subject expertise but
limited HE/quality-assurance background.
**Runtime:** ~30 minutes, 7 sections.

## SETU branding applied

- **Primary colour** Slate Grey `#435465` — body text, headings, navigation, and
  all structural UI (the common visual anchor throughout).
- **Secondary palette as accents** each section is keyed to a different SETU
  secondary colour (Barrow Blue, Sea Green, Heather Purple, Clover Pink),
  cycling with Slate Grey as the anchor, exactly as the brand guide permits.
  Semantic states reuse the palette too — **Grass Green** for correct answers,
  **Sunset Red** for incorrect.
- **Typography** headings in **DM Sans** (Bold), body in **Inter** — both
  self-hosted as variable WOFF2 files in `assets/fonts/` (no CDN, works offline).
- **Left-aligned** body content throughout, per the guide's accessibility note.
- **SETU "U" motif** used as a recognisable graphic element — on the cover,
  as section markers, and as watermarks behind statement/quote panels.
- **Gradients used sparingly** — a single Slate → Barrow Blue gradient on the
  hero cover only, paired with Slate Grey as the guide advises.
- **Logo** placed top-left in the sidebar (and mobile top bar) with clear space,
  at a legible size above the 60px minimum.
- **8px spacing scale** and generous whitespace for a clean, spacious feel.

## What's included

| Section | Topic |
|--------:|-------|
| 0 | Welcome & orientation (cover, objectives) |
| 1 | What a module descriptor is and why it matters |
| 2 | Learning outcomes, Bloom's Taxonomy & constructive alignment |
| 3 | NFQ levels |
| 4 | ECTS credits & student workload |
| 5 | Bringing it together (four-question checklist) |
| 6 | Summary, final quiz & reflection |

### Interactions (all native, no libraries)
- **Knowledge checks** — MCQ and true/false with instant, per-answer feedback and retry
- **Reflections** — open text prompts (saved locally, never submitted)
- **Bloom's matching** — drag-and-drop *and* tap-to-place
- **NFQ tabs** — Levels 6–9 with example tasks
- **ECTS workload calculator** — live sliders for credits, hours/credit, contact hours
- **Accordion** — the four "reading a descriptor" questions with practical tips
- **Custom SVG graphics** — annotated descriptor, Bloom's pyramid, alignment triangle, NFQ ladder

### Learner experience
- Left-hand lesson navigation with live **progress bar** and completed ticks
- Previous / Next buttons and **←/→ keyboard** navigation
- Progress, quiz answers and reflection notes **persist** in `localStorage`
- **Light / dark** theme (follows the OS, with a manual toggle)
- Fully **responsive** with a slide-out menu on mobile

## Running it

It's static, so any of these work:

```bash
# Simplest: just open the file
open index.html            # macOS   (or double-click it)

# Or serve it (recommended for a shared/hosted copy)
python3 -m http.server 8000
# then visit http://localhost:8000
```

Deploy by copying the whole folder to any static host (GitHub Pages, Netlify,
an LMS file area, a shared drive, etc.).

## File structure

```
.
├── index.html                 # all course content + interactive markup
├── css/styles.css             # SETU design tokens, layout, components, light/dark
├── js/app.js                  # navigation, progress, and all interactions
└── assets/
    ├── setu-logo.svg          # PLACEHOLDER logo — replace with the official file
    └── fonts/                 # self-hosted DM Sans + Inter (variable WOFF2)
```

## Placeholders / items needing your input

Marked in-course with a *[Placeholder …]* note:

- **SETU logo** — `assets/setu-logo.svg` is a **placeholder** wordmark. The
  official logo files were not present in the repo when this was built. Drop the
  official **reversed (white)** SETU logo in at `assets/setu-logo.svg` (or update
  the two `<img src>` references in `index.html`). It sits on the Slate Grey
  sidebar, so a white/reversed version is needed; keep clear space around it and
  a minimum size of 60px.
- **Cover image** — currently the SETU U-motif over a Slate → Barrow Blue brand
  gradient. Swap in an approved SETU photo or official gradient if preferred.
- **Further-reading links** — the reference list in Section 6 is plain text;
  add live hyperlinks to SETU/QQI/National Forum/ECTS documents.
- **Hours-per-credit default** — set to 20 (common Irish HE figure); the
  calculator slider allows 20–25.

## Brand fonts

DM Sans and Inter (both open-source, and both named in the SETU guide) are
self-hosted as variable WOFF2 files under `assets/fonts/`, so the course renders
with the correct brand typography **offline and with no external requests**. If
you ever need additional weights/styles, add the WOFF2s and extend the
`@font-face` block at the top of `css/styles.css`.

All diagrams called for in the script (Bloom's pyramid, alignment triangle, NFQ
ladder, ECTS infographic, annotated descriptor) are rendered as inline SVG in
the SETU palette, so they stay crisp and theme-aware without external images.

## A note on dark mode

The SETU guide describes a white-background identity. An optional, restrained
**slate-based dark theme** is included as a learner accessibility feature (toggle
in the sidebar). The default is the on-brand light theme; the dark theme keeps
Slate Grey and the approved accents.
