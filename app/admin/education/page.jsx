"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import { Edit, Plus } from "lucide-react";

export default function AdminEducation() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/education");
                const data = await res.json();
                if (data.success) setItems(data.data);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <AdminNav />
            <main className="mx-auto max-w-4xl px-6 py-10 pb-24">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Education</h1>
                        <p className="mt-1 text-sm text-gray-500">{items.length} entries · shown newest first</p>
                    </div>
                    <Link
                        href="/admin/education/add"
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                    >
                        <Plus size={18} /> Add Education
                    </Link>
                </div>

                {loading ? (
                    <div className="py-20 text-center text-gray-400">Loading...</div>
                ) : items.length === 0 ? (
                    <div className="py-20 text-center text-gray-400">No education entries.</div>
                ) : (
                    <ul>
                        {items.map((item) => (
                            <li
                                key={item._id}
                                className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 py-4 dark:border-gray-800"
                            >
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.degree}</h3>
                                    <p className="mt-0.5 text-sm text-gray-500">{item.institution}</p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        {item.startYear} — {item.endYear}
                                    </p>
                                </div>
                                <Link
                                    href={`/admin/education/edit/${item._id}`}
                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                                    title="Edit"
                                >
                                    <Edit size={17} />
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
}
