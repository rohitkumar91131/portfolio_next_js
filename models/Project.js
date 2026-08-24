import mongoose from "mongoose";
import { PROJECT_TYPES, PROJECT_CATEGORIES } from "@/lib/constants";

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: [...PROJECT_TYPES, ""],
    default: "",
  },
  category: {
    type: String,
    enum: [...PROJECT_CATEGORIES, ""],
    default: "",
  },
  tech: [{
    type: String,
    trim: true,
    required: true
  }],
  githubLink: {
    type: String,
    trim: true,
    default: "",
  },
  liveLink: {
    type: String,
    trim: true,
    default: "",
  },
  featured: {
    type: Boolean,
    default: false,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
