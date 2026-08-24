"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import ExperienceForm, {
  emptyExperience,
  validateExperience,
  toPayload,
} from "@/components/admin/ExperienceForm";

export default function AddExperience() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState(emptyExperience());

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const validationError = validateExperience(formData);
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/experience", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(toPayload(formData)),
            });
            const data = await res.json();

            if (data.success) {
                router.push("/admin/dashboard");
            } else {
                setError(data.error || "Failed to add experience");
            }
        } catch (err) {
            setError("Failed to add experience");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-6 pb-20">
            <div className="max-w-2xl mx-auto">
                <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 mb-6">
                    <ArrowLeft size={20} /> Back to Dashboard
                </Link>

                <h1 className="text-3xl font-bold mb-8">Add Experience</h1>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                    <ExperienceForm
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
                                {loading ? <Loader2 className="animate-spin" /> : <>Add Experience <Plus size={18} /></>}
                            </button>
                        }
                    />
                </div>
            </div>
        </div>
    );
}
