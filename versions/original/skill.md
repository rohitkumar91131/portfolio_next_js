# Original

## Overview

The first version of the portfolio (v01), shipped in 2025. A conventional
developer portfolio: centered hero, colorful accents, card-based project
grid, and an animated education timeline. It is preserved here as a
complete, frozen website reachable at `/versions/original`.

## Design Philosophy

Friendly and approachable. Visual interest comes from color (blue primary,
multi-colored category icons), rounded cards with soft shadows, and playful
interaction (3D card tilt, cursor-following glow, elastic timeline entrance).
Dark mode is fully supported through class-based theming.

## Typography

The system font stack (`ui-sans-serif, system-ui, -apple-system, sans-serif`)
— no custom webfonts. Hierarchy is built with weight and size:
`text-5xl/7xl font-bold` hero, `text-4xl font-bold` section titles,
`text-2xl font-bold` card titles, `text-sm` supporting text.

## Layout

Centered single-column flow. Sections use `max-w-6xl` / `max-w-4xl`
containers with `py-20 px-4` vertical rhythm. Projects sit in a
3-column grid (collapsing to 1 column on mobile); education and contact
use `max-w-4xl`.

## Colors

Light: `bg-gray-50` page, white cards, `border-gray-200` borders.
Dark: `bg-gray-900` page, black cards, `border-gray-800`.
Accents: `blue-600` primary buttons/links, plus green, purple, orange and
pink icon colors per project category.

## Components

- Hero with per-character split-text reveal and parallax background blobs
- Project cards with 3D tilt, cursor glow, category icon, tech pills
- Education timeline with colored icon circles and a scroll-drawn line
- Contact: large email card + three social cards (LinkedIn, GitHub, Resume)
- Floating circular theme toggle (top right of hero)

## Animation

GSAP: hero timeline (`hero-text-char` rotateX reveal, `hero-element` fade-up),
mouse parallax on blobs/buttons, ScrollTrigger batch reveal for project
cards, elastic entrance for education items, scrubbed timeline line.
All animation is skipped under `prefers-reduced-motion`.

## Navigation

No navbar. A single floating theme toggle sits top-right; in-page anchors
(`#projects`, `#contact`) are used from hero buttons.

## Projects / Work

3-column responsive card grid. Each card links to its detail page at
`/<title>`; GitHub/live icon buttons appear on hover (always visible on
touch). Data is passed as props from the shared database.

## Responsive Behaviour

Grid collapses to a single column below `md`; hero text scales via
`text-5xl → md:text-7xl`; card action icons are always visible on touch
devices; contact grid stacks vertically.

## Technologies

Next.js (App Router), React, Tailwind CSS, GSAP + ScrollTrigger,
Mongoose/MongoDB, lucide-react icons.

## Changes

Baseline version — everything starts here.

## Notes

This version is intentionally frozen: its components live in
`versions/original/` and do not import the current homepage components.
Content (projects, education, resume URL) is fetched live from the shared
database so contact details never go stale; the presentation layer will
never change. The original used client-side fetching from `/api/projects`
and `/api/education`; the archive renders server-side with the same data.
