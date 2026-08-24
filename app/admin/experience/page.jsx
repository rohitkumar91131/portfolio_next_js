"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import SortableList from "@/components/admin/SortableList";
import { Edit, Plus, Archive, RotateCcw, Trash2 } from "lucide-react";

const formatDate = (value) =>
    value
        ? new Date(value)
              .toLocaleDateString("en-GB", {
                  month: "short",
                  year: "numeric",
                  timeZone: "UTC",
              })
              .toUpperCase()
        : "";

export default function AdminExperience() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("active");
    const [saveState, setSaveState] = useState("");

    const fetchItems = useCallback(async () => {
        const res = await fetch("/api/experience");
        const data = await res.json();
        if (data.success) setItems(data.data);
        return data.data || [];
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/api/experience");
                const data = await res.json();
                if (data.success) setItems(data.data);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const active = items.filter((e) => e.isVisible);
    const archived = items.filter((e) => !e.isVisible);
    const visible = tab === "active" ? active : archived;

    const dateRange = (item) =>
        `${formatDate(item.startDate)} — ${item.isCurrent ? "Present" : formatDate(item.endDate)}`;

    const persistOrder = async (reordered) => {
        setSaveState("saving");
        await fetch("/api/experience/reorder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                items: reordered.map((item, index) => ({ id: item._id, order: index })),
            }),
        });
        setItems(reordered.map((item, index) => ({ ...item, displayOrder: index })));
        setSaveState("saved");
        setTimeout(() => setSaveState(""), 1500);
    };

    const patchExperience = async (id, payload) => {
        const res = await fetch(`/api/experience/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) await fetchItems();
        else alert(`Error: ${data.error || "Update failed"}`);
    };

    const deleteExperience = async (item) => {
        if (!confirm(`Delete "${item.role} — ${item.companyName}" permanently?\n\nThis cannot be undone.`)) return;
        const res = await fetch(`/api/experience/${item._id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) await fetchItems();
        else alert(`Error: ${data.error || "Delete failed"}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <AdminNav />
            <main className="mx-auto max-w-4xl px-6 py-10 pb-24">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Experience</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {active.length} active · {archived.length} archived
                        </p>
                    </div>
                    <Link
                        href="/admin/experience/add"
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
                    >
                        <Plus size={18} /> Add Experience
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
                    <div className="py-20 text-center text-gray-400">No {tab} experience entries.</div>
                ) : tab === "active" ? (
                    <SortableList
                        items={active}
                        getId={(item) => item._id}
                        onReorder={persistOrder}
                        renderItem={(item) => (
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.role}</h3>
                                    <p className="mt-0.5 text-sm text-gray-500">{item.companyName}</p>
                                    <p className="mt-1 text-xs text-gray-400">{dateRange(item)}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Link
                                        href={`/admin/experience/edit/${item._id}`}
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                                        title="Edit"
                                    >
                                        <Edit size={17} />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => patchExperience(item._id, { isVisible: false })}
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
                        {archived.map((item) => (
                            <li
                                key={item._id}
                                className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 py-4 dark:border-gray-800"
                            >
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-gray-500 dark:text-gray-400">{item.role}</h3>
                                    <p className="mt-0.5 text-sm text-gray-400">{item.companyName}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => patchExperience(item._id, { isVisible: true })}
                                        className="p-2 text-gray-400 hover:text-green-600 rounded-lg transition"
                                        title="Restore"
                                    >
                                        <RotateCcw size={17} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => deleteExperience(item)}
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
