"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Plus, ExternalLink, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from "lucide-react";

const formatDate = (value) =>
    value
        ? new Date(value)
              .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  timeZone: "UTC",
              })
              .toUpperCase()
        : "";

export default function AdminDashboard() {
    const [projects, setProjects] = useState([]);
    const [education, setEducation] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsRes, educationRes, experiencesRes] = await Promise.all([
                    fetch("/api/projects"),
                    fetch("/api/education"),
                    fetch("/api/experience")
                ]);

                const projectsData = await projectsRes.json();
                const educationData = await educationRes.json();
                const experiencesData = await experiencesRes.json();

                if (projectsData.success) setProjects(projectsData.data);
                if (educationData.success) setEducation(educationData.data);
                if (experiencesData.success) setExperiences(experiencesData.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const refreshExperiences = async () => {
        const res = await fetch("/api/experience");
        const data = await res.json();
        if (data.success) setExperiences(data.data);
    };

    const patchExperience = async (id, payload) => {
        const res = await fetch(`/api/experience/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
            await refreshExperiences();
        } else {
            alert(`Error: ${data.error || "Update failed"}`);
        }
    };

    // Reorder by rewriting sequential displayOrder values for the
    // entries whose position actually changed.
    const moveExperience = async (index, direction) => {
        const target = index + direction;
        if (target < 0 || target >= experiences.length) return;

        const next = [...experiences];
        const [moved] = next.splice(index, 1);
        next.splice(target, 0, moved);

        const changed = next
            .map((item, order) => ({ ...item, displayOrder: order }))
            .filter((item, order) => experiences.find((e) => e._id === item._id).displayOrder !== order);

        await Promise.all(
            changed.map((item) =>
                fetch(`/api/experience/${item._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ displayOrder: item.displayOrder }),
                })
            )
        );
        await refreshExperiences();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-6">
            <div className="max-w-6xl mx-auto space-y-12">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>

                {/* Projects Section */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Projects</h2>
                        <Link
                            href="/addprojects"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                        >
                            <Plus size={20} /> Add Project
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-gray-500">Loading...</div>
                    ) : (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                    <tr>
                                        <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Title</th>
                                        <th className="p-4 font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Tech Stack</th>
                                        <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {projects.map((project) => (
                                        <tr key={project._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition">
                                            <td className="p-4">
                                                <div className="font-semibold text-gray-900 dark:text-white">{project.title}</div>
                                                <div className="text-sm text-gray-500 truncate max-w-xs">{project.description}</div>
                                            </td>
                                            <td className="p-4 hidden md:table-cell">
                                                <div className="flex gap-1 flex-wrap">
                                                    {project.tech.slice(0, 3).map((t, i) => (
                                                        <span key={i} className="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                                            {t}
                                                        </span>
                                                    ))}
                                                    {project.tech.length > 3 && <span className="text-xs text-gray-400">+{project.tech.length - 3}</span>}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/admin/edit/${project._id}`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </Link>
                                                    <a
                                                        href={`/${project.title}`}
                                                        target="_blank"
                                                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition"
                                                        title="View Live"
                                                    >
                                                        <ExternalLink size={18} />
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {projects.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="p-8 text-center text-gray-400">No projects found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* Experience Section */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Experience</h2>
                        <Link
                            href="/admin/experience/add"
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
                        >
                            <Plus size={20} /> Add Experience
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-gray-500">Loading...</div>
                    ) : (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                    <tr>
                                        <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Role & Company</th>
                                        <th className="p-4 font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Duration</th>
                                        <th className="p-4 font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Status</th>
                                        <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Order</th>
                                        <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {experiences.map((exp, index) => (
                                        <tr key={exp._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition">
                                            <td className="p-4">
                                                <div className="font-semibold text-gray-900 dark:text-white">
                                                    {exp.role}
                                                    {exp.isCurrent && (
                                                        <span className="ml-2 px-2 py-0.5 rounded text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                            Current
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {exp.companyName}
                                                    {!exp.isVisible && (
                                                        <span className="ml-2 text-xs text-gray-400">(hidden)</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 hidden md:table-cell text-sm text-gray-600 dark:text-gray-400">
                                                {formatDate(exp.startDate)} — {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                                            </td>
                                            <td className="p-4 hidden md:table-cell">
                                                <button
                                                    onClick={() => patchExperience(exp._id, { isVisible: !exp.isVisible })}
                                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition ${
                                                        exp.isVisible
                                                            ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                                                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                    }`}
                                                    title={exp.isVisible ? "Visible — click to hide" : "Hidden — click to show"}
                                                >
                                                    {exp.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                                                    {exp.isVisible ? "Visible" : "Hidden"}
                                                </button>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1">
                                                    <button
                                                        onClick={() => moveExperience(index, -1)}
                                                        disabled={index === 0}
                                                        className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition"
                                                        title="Move up"
                                                    >
                                                        <ArrowUp size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => moveExperience(index, 1)}
                                                        disabled={index === experiences.length - 1}
                                                        className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition"
                                                        title="Move down"
                                                    >
                                                        <ArrowDown size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/admin/experience/edit/${exp._id}`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {experiences.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-gray-400">No experience entries found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* Education Section */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Education</h2>
                        <Link
                            href="/admin/education/add"
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                        >
                            <Plus size={20} /> Add Education
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-gray-500">Loading...</div>
                    ) : (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                    <tr>
                                        <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Degree & Institution</th>
                                        <th className="p-4 font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Duration</th>
                                        <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {education.map((edu) => (
                                        <tr key={edu._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition">
                                            <td className="p-4">
                                                <div className="font-semibold text-gray-900 dark:text-white">{edu.degree}</div>
                                                <div className="text-sm text-gray-500">{edu.institution}</div>
                                            </td>
                                            <td className="p-4 hidden md:table-cell text-sm text-gray-600 dark:text-gray-400">
                                                {edu.startYear} - {edu.endYear}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/admin/education/edit/${edu._id}`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {education.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="p-8 text-center text-gray-400">No education entries found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
