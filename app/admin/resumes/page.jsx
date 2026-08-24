"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import { Edit, Plus, Trash2, ExternalLink, Star, FileText } from "lucide-react";

export default function AdminResumes() {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchResumes = useCallback(async () => {
        const res = await fetch("/api/resume");
        const data = await res.json();
        if (data.success) setResumes(data.data);
        return data.data || [];
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/api/resume");
                const data = await res.json();
                if (data.success) setResumes(data.data);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const makePrimary = async (resume) => {
        const res = await fetch(`/api/resume/${resume._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isPrimary: true }),
        });
        const data = await res.json();
        if (data.success) await fetchResumes();
        else alert(`Error: ${data.error || "Update failed"}`);
    };

    const deleteResume = async (resume) => {
        if (!confirm(`Delete "${resume.title}" permanently?\n\nThis cannot be undone.`)) return;
        const res = await fetch(`/api/resume/${resume._id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) await fetchResumes();
        else alert(`Error: ${data.error || "Delete failed"}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <AdminNav />
            <main className="mx-auto max-w-4xl px-6 py-10 pb-24">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resumes</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {resumes.length} resumes · the primary one is used by the public Download Resume button
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/resumes/create"
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            <FileText size={18} /> Create Resume
                        </Link>
                        <Link
                            href="/admin/resumes/add"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                        >
                            <Plus size={18} /> Add Resume
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 text-center text-gray-400">Loading...</div>
                ) : resumes.length === 0 ? (
                    <div className="py-20 text-center text-gray-400">
                        No resumes yet. The public site falls back to /resume.pdf.
                    </div>
                ) : (
                    <ul>
                        {resumes.map((resume) => (
                            <li
                                key={resume._id}
                                className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 py-4 dark:border-gray-800"
                            >
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{resume.title}</h3>
                                        {resume.isPrimary && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                <Star size={11} className="fill-current" /> Primary
                                            </span>
                                        )}
                                    </div>
                                    {resume.description && (
                                        <p className="mt-0.5 text-sm text-gray-500">{resume.description}</p>
                                    )}
                                    <a
                                        href={resume.resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 block max-w-md truncate text-xs text-blue-600 hover:underline"
                                        title={resume.resumeUrl}
                                    >
                                        {resume.resumeUrl}
                                    </a>
                                </div>
                                <div className="flex items-center gap-1">
                                    <a
                                        href={resume.resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg transition"
                                        title="Preview"
                                    >
                                        <ExternalLink size={17} />
                                    </a>
                                    {!resume.isPrimary && (
                                        <button
                                            type="button"
                                            onClick={() => makePrimary(resume)}
                                            className="p-2 text-gray-400 hover:text-yellow-500 rounded-lg transition"
                                            title="Make primary"
                                        >
                                            <Star size={17} />
                                        </button>
                                    )}
                                    <Link
                                        href={`/admin/resumes/edit/${resume._id}`}
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                                        title="Edit"
                                    >
                                        <Edit size={17} />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => deleteResume(resume)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                                        title="Delete"
                                    >
                                        <Trash2 size={17} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
}
