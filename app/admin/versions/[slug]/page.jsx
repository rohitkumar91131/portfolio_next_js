"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import { ArrowLeft, Loader2 } from "lucide-react";

const inputClass =
  "w-full p-2 border rounded-lg bg-transparent border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500";
const labelClass = "block text-sm font-medium mb-1";

export default function EditVersion() {
  const { slug } = useParams();
  const router = useRouter();
  const hasFetched = useRef(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const load = async () => {
      try {
        const res = await fetch("/api/version");
        const data = await res.json();
        if (data.success) {
          const version = data.data.find((v) => v.slug === slug);
          if (!version) {
            setError("Version not found");
          } else {
            setForm({
              slug: version.slug,
              versionNumber: version.versionNumber || "",
              name: version.name || "",
              date: version.date || "",
              description: version.description || "",
              designPhilosophy: version.designPhilosophy || "",
              technologies: (version.technologies || []).join(", "),
              skills: (version.skills || []).join(", "),
              thumbnail: version.thumbnail || "",
              isCurrent: Boolean(version.isCurrent),
              isPublic: Boolean(version.isPublic),
              displayOrder: version.displayOrder ?? 0,
              source: version.source,
            });
          }
        } else {
          setError("Failed to load version");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/version", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: form.slug,
          versionNumber: form.versionNumber,
          name: form.name,
          date: form.date,
          description: form.description,
          designPhilosophy: form.designPhilosophy,
          technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean),
          skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
          thumbnail: form.thumbnail,
          isCurrent: form.isCurrent,
          isPublic: form.isPublic,
          displayOrder: Number(form.displayOrder) || 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/versions");
      } else {
        setError(data.error || "Failed to save version");
      }
    } catch (err) {
      setError("Failed to save version");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <AdminNav />
      <main className="mx-auto max-w-2xl px-6 py-10 pb-24">
        <Link href="/admin/versions" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 mb-6">
          <ArrowLeft size={18} /> Back to Versions
        </Link>

        <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
          Edit Version <span className="text-gray-400">/versions/{slug}</span>
        </h1>

        {form?.source === "registry" && (
          <p className="mb-6 p-3 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 text-sm">
            This version uses built-in metadata. Saving creates a database record that overrides it.
          </p>
        )}

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
          {error && <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg border border-red-100">{error}</div>}

          {form && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Version Number</label>
                  <input name="versionNumber" value={form.versionNumber} onChange={handleChange} className={inputClass} placeholder="e.g. 02" />
                </div>
                <div>
                  <label className={labelClass}>Name</label>
                  <input name="name" value={form.name} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Date</label>
                  <input name="date" value={form.date} onChange={handleChange} className={inputClass} placeholder="e.g. Aug 2026" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} className={`${inputClass} h-20`} />
              </div>

              <div>
                <label className={labelClass}>Design Philosophy</label>
                <textarea name="designPhilosophy" value={form.designPhilosophy} onChange={handleChange} className={`${inputClass} h-20`} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Technologies (comma separated)</label>
                  <input name="technologies" value={form.technologies} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Skills (comma separated)</label>
                  <input name="skills" value={form.skills} onChange={handleChange} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Thumbnail URL or path</label>
                  <input name="thumbnail" value={form.thumbnail} onChange={handleChange} className={inputClass} placeholder="/versions/current.png" />
                </div>
                <div>
                  <label className={labelClass}>Display Order</label>
                  <input type="number" name="displayOrder" value={form.displayOrder} onChange={handleChange} className={inputClass} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="isCurrent" checked={form.isCurrent} onChange={handleChange} />
                  Current version (unsets any other current version)
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="isPublic" checked={form.isPublic} onChange={handleChange} />
                  Public (visible in the version archive)
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="animate-spin" /> : "Save Version"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
