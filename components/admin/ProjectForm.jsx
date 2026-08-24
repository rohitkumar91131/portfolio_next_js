"use client";

import CreatableSelect from "react-select/creatable";
import { PROJECT_TYPES, PROJECT_CATEGORIES } from "@/lib/constants";

const TECH_OPTIONS = [
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "Tailwind CSS",
  "MongoDB",
  "PostgreSQL",
  "Redis",
  "Docker",
  "AWS",
  "Python",
  "C++",
  "WebRTC",
  "Socket.io",
  "GraphQL",
  "Express",
  "Flutter",
  "Supabase",
  "GSAP",
].map((t) => ({ value: t, label: t }));

const customStyles = {
  control: (base, state) => ({
    ...base,
    background: "transparent",
    borderColor: state.isFocused ? "#3b82f6" : "rgba(107, 114, 128, 0.5)",
    borderRadius: "0.5rem",
    padding: "2px",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
    "&:hover": { borderColor: "#3b82f6" },
  }),
  menu: (base) => ({ ...base, borderRadius: "0.5rem", overflow: "hidden", zIndex: 9999 }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#3b82f6" : "white",
    color: state.isFocused ? "white" : "black",
  }),
  multiValue: (base) => ({ ...base, backgroundColor: "#eff6ff", borderRadius: "9999px" }),
  multiValueLabel: (base) => ({ ...base, color: "#1e40af", fontWeight: 600 }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#1e40af",
    ":hover": { backgroundColor: "#dbeafe", color: "#1e3a8a" },
  }),
  input: (base) => ({ ...base, color: "inherit" }),
  singleValue: (base) => ({ ...base, color: "inherit" }),
};

const inputClass =
  "w-full p-2 border rounded-lg bg-transparent border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500";
const labelClass = "block text-sm font-medium mb-1";

export const emptyProject = () => ({
  title: "",
  description: "",
  type: "",
  category: "",
  tech: [],
  githubLink: "",
  liveLink: "",
  featured: false,
});

export const toProjectFormData = (data) => ({
  ...emptyProject(),
  ...data,
  tech: Array.isArray(data.tech) ? [...data.tech] : [],
});

export const validateProject = (data) => {
  if (!data.title.trim()) return "Title is required";
  if (!data.description.trim()) return "Description is required";
  return null;
};

export const toProjectPayload = (data) => ({
  title: data.title.trim(),
  description: data.description.trim(),
  type: data.type || "",
  category: data.category || "",
  tech: data.tech,
  githubLink: data.githubLink.trim(),
  liveLink: data.liveLink.trim(),
  featured: Boolean(data.featured),
});

export default function ProjectForm({ formData, setFormData, error, onSubmit, submitButton }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleTechChange = (newValue) => {
    setFormData({
      ...formData,
      tech: newValue ? newValue.map((item) => item.value) : [],
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg border border-red-100">{error}</div>
      )}

      <div>
        <label className={labelClass}>Title</label>
        <input name="title" value={formData.title} onChange={handleChange} className={inputClass} placeholder="e.g. MoneyLog" required />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className={`${inputClass} h-28`} placeholder="What problem does it solve..." required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Type</label>
          <select name="type" value={formData.type} onChange={handleChange} className={inputClass}>
            <option value="">—</option>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Category (optional)</label>
          <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
            <option value="">—</option>
            {PROJECT_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Tech Stack</label>
        <CreatableSelect
          isMulti
          instanceId="project-tech-select"
          options={TECH_OPTIONS}
          value={formData.tech.map((t) => ({ value: t, label: t }))}
          onChange={handleTechChange}
          styles={customStyles}
          className="text-sm"
          classNamePrefix="select"
          placeholder="Select technologies or type to create new ones..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>GitHub URL</label>
          <input name="githubLink" value={formData.githubLink} onChange={handleChange} className={inputClass} placeholder="https://github.com/user/repo" />
        </div>
        <div>
          <label className={labelClass}>Live URL</label>
          <input name="liveLink" value={formData.liveLink} onChange={handleChange} className={inputClass} placeholder="https://project.com" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
        Featured (shown on the homepage)
      </label>

      {submitButton}
    </form>
  );
}
