"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import SortableList from "@/components/admin/SortableList";
import { Edit, Plus, Archive, RotateCcw, Trash2, Star, ExternalLink } from "lucide-react";

export default function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("active"); // active | archived
    const [saveState, setSaveState] = useState(""); // "" | "saving" | "saved"

    const fetchProjects = useCallback(async () => {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.success) setProjects(data.data);
        return data.data || [];
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/api/projects");
                const data = await res.json();
                if (data.success) setProjects(data.data);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const active = projects.filter((p) => !p.archived);
    const archived = projects.filter((p) => p.archived);
    const visible = tab === "active" ? active : archived;

    const persistOrder = async (reordered) => {
        setSaveState("saving");
        await fetch("/api/projects/reorder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                items: reordered.map((p, index) => ({ id: p._id, order: index })),
            }),
        });
        setProjects(reordered.map((p, index) => ({ ...p, order: index })));
        setSaveState("saved");
        setTimeout(() => setSaveState(""), 1500);
    };

    const patchProject = async (id, payload) => {
        const res = await fetch(`/api/projects/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) await fetchProjects();
        else alert(`Error: ${data.error || "Update failed"}`);
    };

    const deleteProject = async (project) => {
        if (!confirm(`Delete "${project.title}" permanently?\n\nThis cannot be undone.`)) return;
        const res = await fetch(`/api/projects/${project._id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) await fetchProjects();
        else alert(`Error: ${data.error || "Delete failed"}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <AdminNav />
            <main className="mx-auto max-w-4xl px-6 py-10 pb-24">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {active.length} active · {archived.length} archived ·{" "}
                            {active.filter((p) => p.featured).length} featured
                        </p>
                    </div>
                    <Link
                        href="/admin/projects/add"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                    >
                        <Plus size={18} /> Add Project
                    </Link>
                </div>

                <div className="mb-6 flex items-center gap-4">
                    {["active", "archived"].map((name) => (
                        <button
                            key={name}
                            type="button"
                            onClick={() => setTab(name)}
                            className={`pb-1 text-sm font-medium capitalize transition-colors border-b-2 ${
                                tab === name
                                    ? "border-gray-900 dark:border-white text-gray-900 dark:text-white"
                                    : "border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            }`}
                        >
                            {name} ({name === "active" ? active.length : archived.length})
                        </button>
                    ))}
                    {tab === "active" && saveState && (
                        <span className="ml-auto text-xs text-gray-400">
                            {saveState === "saving" ? "Saving..." : "Saved"}
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="py-20 text-center text-gray-400">Loading...</div>
                ) : visible.length === 0 ? (
                    <div className="py-20 text-center text-gray-400">
                        No {tab} projects.
                    </div>
                ) : tab === "active" ? (
                    <SortableList
                        items={active}
                        getId={(p) => p._id}
                        onReorder={persistOrder}
                        renderItem={(project) => (
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {project.title}
                                        </h3>
                                        {project.featured && (
                                            <Star size={13} className="fill-yellow-400 text-yellow-400" aria-label="Featured" />
                                        )}
                                    </div>
                                    <p className="mt-0.5 text-sm text-gray-500">
                                        {[project.type, project.category].filter(Boolean).join(" · ") || "—"}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        {(project.tech || []).slice(0, 4).join(" · ")}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => patchProject(project._id, { featured: !project.featured })}
                                        className={`p-2 rounded-lg transition ${
                                            project.featured
                                                ? "text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                                                : "text-gray-300 hover:text-yellow-500 dark:text-gray-600"
                                        }`}
                                        title={project.featured ? "Unfeature" : "Feature on homepage"}
                                    >
                                        <Star size={17} className={project.featured ? "fill-current" : ""} />
                                    </button>
                                    <Link
                                        href={`/admin/projects/edit/${project._id}`}
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                                        title="Edit"
                                    >
                                        <Edit size={17} />
                                    </Link>
                                    {project.liveLink && (
                                        <a
                                            href={project.liveLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg transition"
                                            title="Preview"
                                        >
                                            <ExternalLink size={17} />
                                        </a>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => patchProject(project._id, { archived: true })}
                                        className="p-2 text-gray-400 hover:text-orange-600 rounded-lg transition"
                                        title="Archive"
                                    >
                                        <Archive size={17} />
                                    </button>
                                </div>
                            </div>
                        )}
                    />
                ) : (
                    <ul>
                        {archived.map((project) => (
                            <li
                                key={project._id}
                                className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 py-4 dark:border-gray-800"
                            >
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-gray-500 dark:text-gray-400">
                                        {project.title}
                                    </h3>
                                    <p className="mt-0.5 text-sm text-gray-400">
                                        {[project.type, project.category].filter(Boolean).join(" · ") || "—"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => patchProject(project._id, { archived: false })}
                                        className="p-2 text-gray-400 hover:text-green-600 rounded-lg transition"
                                        title="Restore"
                                    >
                                        <RotateCcw size={17} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => deleteProject(project)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                                        title="Delete permanently"
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
