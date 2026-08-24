"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import ResumeForm, {
  emptyResume,
  validateResume,
  toResumePayload,
} from "@/components/admin/ResumeForm";

export default function AddResume() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(emptyResume());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateResume(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toResumePayload(formData)),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/admin/resumes");
      } else {
        setError(data.error || "Failed to add resume");
      }
    } catch (err) {
      setError("Failed to add resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <AdminNav />
      <main className="mx-auto max-w-2xl px-6 py-10 pb-24">
        <Link href="/admin/resumes" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 mb-6">
          <ArrowLeft size={18} /> Back to Resumes
        </Link>

        <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Add Resume</h1>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
          <ResumeForm
            formData={formData}
            setFormData={setFormData}
            error={error}
            onSubmit={handleSubmit}
            submitButton={
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Save Resume <Plus size={18} /></>}
              </button>
            }
          />
        </div>
      </main>
    </div>
  );
}
