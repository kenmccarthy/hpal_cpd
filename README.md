# Understanding Module Descriptors — Standalone HTML Course

A clean, modern, self-paced e-learning course built from the *Understanding
Module Descriptors* narration & build script (originally written for Articulate
Rise). It is a fully **standalone** static web course — no build step, no server
framework, and no external dependencies.

**Audience:** Industry-based part-time lecturers with high subject expertise but
limited HE/quality-assurance background.
**Runtime:** ~30 minutes, 7 sections.

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
├── index.html        # all course content + interactive markup
├── css/styles.css    # design system, layout, component styles, light/dark
├── js/app.js         # navigation, progress, and all interactions
└── assets/           # (reserved for images if you replace placeholders)
```

## Placeholders / items needing your input

The script flagged a few assets that need real-world sourcing. These are marked
in-course with a *[Placeholder …]* note:

- **Cover banner image** — currently a styled gradient; swap in a warm,
  professional photo of a lecturer at a whiteboard / in a workshop.
- **Further-reading links** — the reference list in Section 6 is plain text;
  add live hyperlinks to your institution's copies of the QQI, National Forum,
  and ECTS documents.
- **Hours-per-credit default** — set to 20 (common Irish HE figure). Adjust the
  calculator's default in `js/app.js`/`index.html` if your institution uses 25.

All diagrams called for in the script (Bloom's pyramid, alignment triangle, NFQ
ladder, ECTS infographic, annotated descriptor) are rendered as inline SVG, so
they stay crisp and theme-aware without external image files.
