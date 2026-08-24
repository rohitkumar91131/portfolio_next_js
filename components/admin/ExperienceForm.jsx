"use client";

import { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { Plus, Trash2 } from "lucide-react";
import { EMPLOYMENT_TYPES, splitBulletPoints } from "@/lib/constants";

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
  "Express",
  "GraphQL",
  "WebRTC",
  "Socket.io",
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

const toDateInput = (value) => (value ? String(value).slice(0, 10) : "");

export const emptyExperience = () => ({
  companyName: "",
  role: "",
  employmentType: "Internship",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  responsibilities: [""],
  technologies: [],
  companyUrl: "",
});

// Normalizes an API experience document into form state.
// Responsibilities may be bullet-joined strings — split them into
// separate inputs for editing.
export const toFormData = (data) => ({
  ...emptyExperience(),
  ...data,
  startDate: toDateInput(data.startDate),
  endDate: data.endDate ? toDateInput(data.endDate) : "",
  responsibilities: (() => {
    const points = splitBulletPoints(data.responsibilities);
    return points.length > 0 ? points : [""];
  })(),
  technologies: Array.isArray(data.technologies) ? [...data.technologies] : [],
});

// Client-side validation mirroring the API rules.
export const validateExperience = (data) => {
  if (!data.companyName.trim()) return "Company name is required";
  if (!data.role.trim()) return "Role is required";
  if (!data.startDate) return "Start date is required";
  if (!data.isCurrent && data.endDate && data.endDate < data.startDate) {
    return "End date cannot be earlier than start date";
  }
  if (data.companyUrl.trim() && !/^https?:\/\/[^\s]+\.[^\s]+$/i.test(data.companyUrl.trim())) {
    return "Company URL must be a valid http(s) URL";
  }
  return null;
};

// Serializes form state into the API payload.
export const toPayload = (data) => ({
  companyName: data.companyName.trim(),
  role: data.role.trim(),
  employmentType: data.employmentType,
  location: data.location.trim(),
  startDate: data.startDate,
  endDate: data.isCurrent ? "" : data.endDate,
  isCurrent: data.isCurrent,
  description: data.description.trim(),
  responsibilities: data.responsibilities.map((r) => r.trim()).filter(Boolean),
  technologies: data.technologies,
  companyUrl: data.companyUrl.trim(),
});

export default function ExperienceForm({ formData, setFormData, error, onSubmit, submitButton }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleTechChange = (newValue) => {
    setFormData({
      ...formData,
      technologies: newValue ? newValue.map((item) => item.value) : [],
    });
  };

  const handleResponsibilityChange = (i, value) => {
    const next = [...formData.responsibilities];
    next[i] = value;
    setFormData({ ...formData, responsibilities: next });
  };

  const addResponsibility = () => {
    setFormData({ ...formData, responsibilities: [...formData.responsibilities, ""] });
  };

  const removeResponsibility = (i) => {
    const next = formData.responsibilities.filter((_, index) => index !== i);
    setFormData({ ...formData, responsibilities: next.length ? next : [""] });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg border border-red-100">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Company Name</label>
          <input name="companyName" value={formData.companyName} onChange={handleChange} className={inputClass} placeholder="e.g. Yashar.dev" required />
        </div>
        <div>
          <label className={labelClass}>Role</label>
          <input name="role" value={formData.role} onChange={handleChange} className={inputClass} placeholder="e.g. Web Developer Intern" required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Employment Type</label>
          <select name="employmentType" value={formData.employmentType} onChange={handleChange} className={inputClass}>
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input name="location" value={formData.location} onChange={handleChange} className={inputClass} placeholder="e.g. Remote / Kolkata, India" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Start Date</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>End Date {formData.isCurrent && <span className="text-gray-400">(current role)</span>}</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={inputClass}
            disabled={formData.isCurrent}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isCurrent" checked={formData.isCurrent} onChange={handleChange} />
        Current position (shows &quot;PRESENT&quot; as end date)
      </label>

      <div>
        <label className={labelClass}>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className={`${inputClass} h-28`} placeholder="What you did in this role..." />
      </div>

      <div>
        <label className={labelClass}>Responsibilities / Highlights</label>
        <div className="space-y-2">
          {formData.responsibilities.map((entry, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={entry}
                onChange={(e) => handleResponsibilityChange(i, e.target.value)}
                className={inputClass}
                placeholder={`e.g. Built and shipped ${i === 0 ? "the new marketing site" : "..."}`}
              />
              <button
                type="button"
                onClick={() => removeResponsibility(i)}
                className="p-2 text-gray-400 hover:text-red-600 transition"
                aria-label={`Remove responsibility ${i + 1}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addResponsibility}
          className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          <Plus size={14} /> Add another
        </button>
      </div>

      <div>
        <label className={labelClass}>Technologies</label>
        <CreatableSelect
          isMulti
          instanceId="experience-tech-select"
          options={TECH_OPTIONS}
          value={formData.technologies.map((t) => ({ value: t, label: t }))}
          onChange={handleTechChange}
          styles={customStyles}
          className="text-sm"
          classNamePrefix="select"
          placeholder="Select technologies or type to create new ones..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Company URL</label>
          <input name="companyUrl" value={formData.companyUrl} onChange={handleChange} className={inputClass} placeholder="https://company.com" />
        </div>
      </div>

      {submitButton}
    </form>
  );
}
