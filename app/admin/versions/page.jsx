"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import { Edit, ExternalLink, Eye, EyeOff, Star } from "lucide-react";

export default function AdminVersions() {
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/api/version");
                const data = await res.json();
                if (data.success) setVersions(data.data);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const togglePublish = async (version) => {
        const res = await fetch("/api/version", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: version.slug, name: version.name, isPublic: !version.isPublic }),
        });
        const data = await res.json();
        if (data.success) {
            const refreshed = await fetch("/api/version");
            const refreshedData = await refreshed.json();
            if (refreshedData.success) setVersions(refreshedData.data);
        } else {
            alert(`Error: ${data.error || "Update failed"}`);
        }
    };

    const makeCurrent = async (version) => {
        const res = await fetch("/api/version", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: version.slug, name: version.name, isCurrent: true }),
        });
        const data = await res.json();
        if (data.success) {
            const refreshed = await fetch("/api/version");
            const refreshedData = await refreshed.json();
            if (refreshedData.success) setVersions(refreshedData.data);
        } else {
            alert(`Error: ${data.error || "Update failed"}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <AdminNav />
            <main className="mx-auto max-w-4xl px-6 py-10 pb-24">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Versions</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Archived portfolio designs. Each version is a complete frozen website.
                    </p>
                </div>

                {loading ? (
                    <div className="py-20 text-center text-gray-400">Loading...</div>
                ) : (
                    <ul>
                        {versions.map((version, i) => (
                            <li
                                key={version.slug}
                                className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 py-4 dark:border-gray-800"
                            >
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs text-gray-400">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {version.name}
                                        </h3>
                                        {version.isCurrent && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                <Star size={11} className="fill-current" /> Current
                                            </span>
                                        )}
                                        {!version.isPublic && (
                                            <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500 dark:bg-gray-800">
                                                Unpublished
                                            </span>
                                        )}
                                        {version.source === "registry" && (
                                            <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500 dark:bg-gray-800">
                                                built-in
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-0.5 text-sm text-gray-500">
                                        /versions/{version.slug} {version.date && `· ${version.date}`}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1">
                                    <a
                                        href={`/versions/${version.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg transition"
                                        title="Open public version"
                                    >
                                        <ExternalLink size={17} />
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => togglePublish(version)}
                                        className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg transition"
                                        title={version.isPublic ? "Unpublish" : "Publish"}
                                    >
                                        {version.isPublic ? <Eye size={17} /> : <EyeOff size={17} />}
                                    </button>
                                    {!version.isCurrent && (
                                        <button
                                            type="button"
                                            onClick={() => makeCurrent(version)}
                                            className="p-2 text-gray-400 hover:text-yellow-500 rounded-lg transition"
                                            title="Mark as current"
                                        >
                                            <Star size={17} />
                                        </button>
                                    )}
                                    <Link
                                        href={`/admin/versions/${version.slug}`}
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                                        title="Edit metadata"
                                    >
                                        <Edit size={17} />
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
}
