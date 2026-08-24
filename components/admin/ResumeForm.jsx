"use client";

const inputClass =
  "w-full p-2 border rounded-lg bg-transparent border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500";
const labelClass = "block text-sm font-medium mb-1";

export const emptyResume = () => ({
  title: "",
  description: "",
  resumeUrl: "",
  isPrimary: false,
});

export const toResumeFormData = (data) => ({
  ...emptyResume(),
  ...data,
});

export const validateResume = (data) => {
  if (!data.title.trim()) return "Title is required";
  if (!data.resumeUrl.trim()) return "Resume URL is required";
  if (!/^https?:\/\/[^\s]+$/i.test(data.resumeUrl.trim())) {
    return "Resume URL must be a valid http(s) URL";
  }
  return null;
};

// The URL is stored exactly as provided by the admin.
export const toResumePayload = (data) => ({
  title: data.title.trim(),
  description: data.description.trim(),
  resumeUrl: data.resumeUrl.trim(),
  isPrimary: Boolean(data.isPrimary),
});

export default function ResumeForm({ formData, setFormData, error, onSubmit, submitButton }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg border border-red-100">{error}</div>
      )}

      <div>
        <label className={labelClass}>Resume Title</label>
        <input name="title" value={formData.title} onChange={handleChange} className={inputClass} placeholder="e.g. Web Developer Resume" required />
      </div>

      <div>
        <label className={labelClass}>Description (optional)</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className={`${inputClass} h-20`} placeholder="What is this resume for..." />
      </div>

      <div>
        <label className={labelClass}>Resume URL</label>
        <input
          name="resumeUrl"
          value={formData.resumeUrl}
          onChange={handleChange}
          className={inputClass}
          placeholder="https://res.cloudinary.com/.../fl_attachment/Resume.pdf"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Paste the public file URL (e.g. Cloudinary). Stored exactly as provided.
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPrimary" checked={formData.isPrimary} onChange={handleChange} />
        Make primary (the public Download Resume button uses this one)
      </label>

      {submitButton}
    </form>
  );
}
