import mongoose from "mongoose";
import Version from "@/models/Version";
import { VERSION_REGISTRY } from "./version-registry";

// Route-level code splitting: each version loads only its own bundle.
const loaders = {
  original: () => import("../versions/original/OriginalSite"),
  current: () => import("../versions/current/CurrentSite"),
};

export function loadVersionSite(slug) {
  return loaders[slug] ? loaders[slug]() : null;
}

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

// Merges a registry entry with its admin-managed database record.
const mergeVersion = (registryEntry, doc) => {
  if (!doc) return { ...registryEntry, source: "registry" };
  const { _id, createdAt, updatedAt, ...overrides } = doc;
  return {
    ...registryEntry,
    ...overrides,
    slug: registryEntry.slug, // registry slug is canonical for rendering
    id: String(_id),
    source: "db",
  };
};

// Full listing (registry + database metadata merged, sorted for display).
export async function getAllVersions() {
  try {
    await connectDB();
    const docs = await Version.find({}).lean();
    const byslug = new Map(docs.map((doc) => [doc.slug, doc]));

    const merged = VERSION_REGISTRY.map((entry) =>
      mergeVersion(entry, byslug.get(entry.slug) || null)
    );

    // Database-only versions (metadata without a frozen site build).
    for (const doc of docs) {
      if (!VERSION_REGISTRY.some((v) => v.slug === doc.slug)) {
        merged.push(mergeVersion({ slug: doc.slug }, doc));
      }
    }

    return merged.sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));
  } catch (error) {
    console.error("getAllVersions failed:", error.message);
    return VERSION_REGISTRY.map((entry) => mergeVersion(entry, null));
  }
}

// Public archive listing — unpublished entries are hidden.
export async function getVersions() {
  const all = await getAllVersions();
  return all.filter((v) => v.isPublic);
}

export async function getVersionBySlug(slug) {
  const all = await getVersions();
  return all.find((v) => v.slug === slug) || null;
}
