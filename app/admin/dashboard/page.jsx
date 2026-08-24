"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import { ArrowRight, Plus } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        projects: { active: 0, archived: 0, featured: 0 },
        experience: { active: 0, archived: 0 },
        education: 0,
        resumes: { total: 0, primary: null },
        versions: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsRes, experienceRes, educationRes, resumesRes, versionsRes] = await Promise.all([
                    fetch("/api/projects"),
                    fetch("/api/experience"),
                    fetch("/api/education"),
                    fetch("/api/resume"),
                    fetch("/api/version"),
                ]);

                const [projectsData, experienceData, educationData, resumesData, versionsData] =
                    await Promise.all([
                        projectsRes.json(),
                        experienceRes.json(),
                        educationRes.json(),
                        resumesRes.json(),
                        versionsRes.json(),
                    ]);

                setStats({
                    projects: {
                        active: (projectsData.data || []).filter((p) => !p.archived).length,
                        archived: (projectsData.data || []).filter((p) => p.archived).length,
                        featured: (projectsData.data || []).filter((p) => p.featured && !p.archived).length,
                    },
                    experience: {
                        active: (experienceData.data || []).filter((e) => e.isVisible).length,
                        archived: (experienceData.data || []).filter((e) => !e.isVisible).length,
                    },
                    education: (educationData.data || []).length,
                    resumes: {
                        total: (resumesData.data || []).length,
                        primary: (resumesData.data || []).find((r) => r.isPrimary)?.title || null,
                    },
                    versions: (versionsData.data || []).length,
                });
            } catch (error) {
                console.error("Failed to fetch dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const sections = [
        {
            title: "Projects",
            summary: loading
                ? "…"
                : `${stats.projects.active} active · ${stats.projects.archived} archived · ${stats.projects.featured} featured`,
            manageHref: "/admin/projects",
            addHref: "/admin/projects/add",
            addLabel: "Add Project",
        },
        {
            title: "Experience",
            summary: loading ? "…" : `${stats.experience.active} active · ${stats.experience.archived} archived`,
            manageHref: "/admin/experience",
            addHref: "/admin/experience/add",
            addLabel: "Add Experience",
        },
        {
            title: "Education",
            summary: loading ? "…" : `${stats.education} entries`,
            manageHref: "/admin/education",
            addHref: "/admin/education/add",
            addLabel: "Add Education",
        },
        {
            title: "Resumes",
            summary: loading
                ? "…"
                : `${stats.resumes.total} resumes${stats.resumes.primary ? ` · primary: ${stats.resumes.primary}` : " · none primary"}`,
            manageHref: "/admin/resumes",
            addHref: "/admin/resumes/add",
            addLabel: "Add Resume",
        },
        {
            title: "Versions",
            summary: loading ? "…" : `${stats.versions} archived designs`,
            manageHref: "/admin/versions",
            manageOnly: true,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <AdminNav />
            <main className="mx-auto max-w-4xl px-6 py-10 pb-24">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

                <div className="space-y-4">
                    {sections.map((section) => (
                        <section
                            key={section.title}
                            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {section.title}
                                    </h2>
                                    <p className="mt-0.5 text-sm text-gray-500">{section.summary}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!section.manageOnly && (
                                        <Link
                                            href={section.addHref}
                                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                                        >
                                            <Plus size={16} /> {section.addLabel}
                                        </Link>
                                    )}
                                    <Link
                                        href={section.manageHref}
                                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition"
                                    >
                                        Manage <ArrowRight size={15} />
                                    </Link>
                                </div>
                            </div>
                        </section>
                    ))}
                </div>

                <p className="mt-10 text-xs text-gray-400">
                    Changes appear on the public site immediately.
                </p>
            </main>
        </div>
    );
}
