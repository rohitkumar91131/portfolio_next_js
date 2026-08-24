# Editorial

## Overview

Version 02 — the current portfolio design (shipped August 2026). A
typography-led, monochrome, editorial redesign. Reachable at
`/versions/current`; this version intentionally tracks the live homepage
until a future redesign supersedes it.

## Design Philosophy

Swiss editorial × modern digital portfolio × quiet luxury. The rule:
spend visual complexity on typography and composition, not decoration.
No cards, no pills, no shadows, no color accents — hairline rules,
numbered sections, and designed whitespace carry the hierarchy.

## Typography

- Display: Inter Tight (semibold, tight tracking, uppercase) — hero name
  `clamp(4rem, 15vw, 13.5rem)`, section titles `clamp(2.5rem, 6vw, 5.5rem)`
- Accent voice: Instrument Serif italic — single italic words inside
  statements, institution names, "(dev)"
- Body: Inter, 1rem–1.25rem, muted color
- Utility: JetBrains Mono uppercase micro-labels (`0.6875rem`, 0.18em
  tracking) for dates, section numbers, metadata, tech lists

## Layout

`.shell` container: `max-width: 1400px`, `padding-inline:
clamp(1.25rem, 4vw, 5rem)`. 12-column grid with deliberate asymmetry
(labels left, content offset right). Section rhythm
`clamp(6rem, 14vh, 13rem)`. Sections: Hero → 01 About → 02 Selected Work →
03 Experience → 04 Stack → 05 Education → 06 Contact.

## Colors

Near-monochrome tokens (CSS variables, light/dark):
`--bg #F7F7F4 / #121211`, `--ink #131312 / #ECECE7`, `--muted`, `--faint`,
`--line #DEDED6 / #2B2B28`, `--surface`. Accent is the ink itself.
Selection inverts; focus is a 1px ink outline with offset.

## Components

Fixed minimal navbar (name + mono links + theme icon + mobile overlay),
poster hero with two-line name and animated scroll line, editorial About
spread, numbered full-width project rows with stretched links, hairline
Stack index grid, quiet education list, closing contact statement with
oversized email link, minimal footer with Versions archive link.

## Animation

GSAP isolated to small client islands: `HeroAnimation` (load timeline:
nav → name lines clip-reveal → meta → scroll indicator loop) and `Reveal`
(ScrollTrigger fade-up, `power3.out`, once). Hovers are CSS-only
(translate, underline draw). Everything respects `prefers-reduced-motion`;
the site must work with animation disabled.

## Navigation

Fixed transparent navbar: name left; Work / About / Contact / Resume mono
links right; theme toggle; mobile hamburger opens a full-screen overlay
with oversized numbered links and Escape/scroll-lock handling.

## Projects / Work

Full-width editorial index rows: mono index number, huge display title
(translate-x on hover), muted description, mono tech list right-aligned,
GITHUB ↗ / LIVE SITE ↗ text links, hairline separators. Whole row links to
`/<title>` detail pages. Featured projects show first; falls back to all
active projects. Type/category render as a small mono label above titles.

## Responsive Behaviour

Fluid `clamp()` typography throughout; grids collapse to single columns
with preserved hierarchy; project tech lists move below content; mobile
nav replaces inline links; hero bottom bar wraps.

## Technologies

Next.js (App Router, server components), React 19, Tailwind CSS v4
(CSS-first tokens), GSAP + ScrollTrigger + @gsap/react, Mongoose/MongoDB,
lucide-react, next-themes.

## Changes

Complete redesign from v01 "Original": removed cards/pills/gradients/
colorful icons; introduced design tokens, editorial typography, numbered
sections, server-rendered homepage with direct DB access, isolated GSAP
architecture, drag-and-drop admin management, experience section, dynamic
resume, and the version archive itself.

## Notes

`/versions/current` composes the live homepage components on purpose —
it must always mirror the shipped site. When the next major redesign
lands: freeze a copy of the then-current components under
`versions/<new-slug>/`, register it in `lib/version-registry.js`, mark the
old entry `isCurrent: false`, and write a new skill.md.
