import mongoose from "mongoose";
import Project from "@/models/Project";
import Education from "@/models/Education";
import Experience from "@/models/Experience";
import Resume from "@/models/Resume";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

const serialize = (docs) =>
  docs.map(({ _id, ...rest }) => ({ id: String(_id), ...rest }));

export async function getProjects() {
  try {
    await connectDB();
    // Public site: active projects only, in the admin-managed order.
    const docs = await Project.find({ archived: { $ne: true } })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return serialize(docs);
  } catch (error) {
    console.error("getProjects failed:", error.message);
    return [];
  }
}

export async function getPrimaryResume() {
  try {
    await connectDB();
    const doc = await Resume.findOne({ isPrimary: true }).lean();
    return doc ? serialize([doc])[0] : null;
  } catch (error) {
    console.error("getPrimaryResume failed:", error.message);
    return null;
  }
}

export async function getEducation() {
  try {
    await connectDB();
    const docs = await Education.find({}).lean();

    // Guard against duplicated education entries in the source data.
    const seen = new Set();
    const unique = docs.filter((item) => {
      const key = [item.degree, item.institution, item.startYear, item.endYear]
        .join("||")
        .toLowerCase()
        .trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const rank = (value = "") =>
      /present|current|now/i.test(value)
        ? 9999
        : parseInt(String(value).replace(/\D/g, ""), 10) || 0;

    unique.sort((a, b) => rank(b.endYear) - rank(a.endYear));
    return serialize(unique);
  } catch (error) {
    console.error("getEducation failed:", error.message);
    return [];
  }
}

export async function getExperiences() {
  try {
    await connectDB();
    const docs = await Experience.find({ isVisible: true })
      .sort({ displayOrder: 1, startDate: -1, createdAt: -1 })
      .lean();
    return serialize(docs);
  } catch (error) {
    console.error("getExperiences failed:", error.message);
    return [];
  }
}

export function buildStack(projects) {
  const core = ["React", "Next.js", "Node.js", "WebRTC", "MongoDB", "Tailwind CSS"];
  return [...new Set([...core, ...projects.flatMap((p) => p.tech || [])])].sort(
    (a, b) => a.localeCompare(b)
  );
}
