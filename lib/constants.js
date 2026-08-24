export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Internship",
  "Freelance",
  "Contract",
  "Other",
];

export const PROJECT_TYPES = [
  "Website",
  "Web App",
  "Mobile App",
  "Desktop App",
  "API",
  "Tool",
  "Real-time System",
  "Experiment",
  "Open Source",
  "Other",
];

export const PROJECT_CATEGORIES = [
  "Finance",
  "Productivity",
  "Developer Tool",
  "Media",
  "E-commerce",
  "Education",
  "Real-time",
  "Experiment",
  "Other",
];

// Responsibility points may be stored as an array or as a single
// string with bullet/newline separators — normalize to clean lines.
export const splitBulletPoints = (value) =>
  String(Array.isArray(value) ? value.join("\n") : value || "")
    .split(/[•\n]/)
    .map((point) => point.trim())
    .filter(Boolean);

// The technology list shown on the public site and resume:
// a fixed core set merged with everything used across projects.
export const buildStack = (projects) => {
  const core = ["React", "Next.js", "Node.js", "WebRTC", "MongoDB", "Tailwind CSS"];
  return [
    ...new Set([...core, ...projects.flatMap((p) => p.tech || [])]),
  ].sort((a, b) => a.localeCompare(b));
};
