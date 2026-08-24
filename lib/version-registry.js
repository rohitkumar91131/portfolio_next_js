// Version registry — pure data, safe to import anywhere (server or client).
// Maps each frozen site build in versions/ to its default metadata.
//
// To archive a future redesign: freeze its components under versions/<slug>/,
// register it here, and write a version-specific skill.md.

export const VERSION_REGISTRY = [
  {
    slug: "original",
    versionNumber: "01",
    name: "Original",
    date: "Aug 2025",
    description:
      "The first version of the portfolio — centered hero, project cards with tilt and glow, and a timeline for education.",
    designPhilosophy:
      "A conventional developer portfolio: friendly, colorful accents, card-based layout with playful interactions.",
    technologies: ["Next.js", "React", "Tailwind CSS", "GSAP", "MongoDB"],
    skills: ["Component design", "Animation", "REST APIs", "Admin CRUD"],
    thumbnail: "/versions/original.png",
    isCurrent: false,
    isPublic: true,
    displayOrder: 1,
  },
  {
    slug: "current",
    versionNumber: "02",
    name: "Editorial",
    date: "Aug 2026",
    description:
      "A redesign focused on typography, spacing and an editorial, monochrome visual language with numbered sections.",
    designPhilosophy:
      "Swiss editorial × modern digital portfolio × quiet luxury. Spend visual complexity on typography and composition, not decoration.",
    technologies: ["Next.js", "React", "Tailwind CSS", "GSAP", "MongoDB"],
    skills: ["Editorial design", "Typography", "Design systems", "SSR architecture"],
    thumbnail: "/versions/current.png",
    isCurrent: true,
    isPublic: true,
    displayOrder: 2,
  },
];
