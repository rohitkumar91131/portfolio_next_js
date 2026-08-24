import mongoose from "mongoose";

const VersionSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  versionNumber: {
    type: String,
    trim: true,
    default: "",
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: String,
    trim: true,
    default: "",
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  designPhilosophy: {
    type: String,
    trim: true,
    default: "",
  },
  technologies: [
    {
      type: String,
      trim: true,
    },
  ],
  skills: [
    {
      type: String,
      trim: true,
    },
  ],
  thumbnail: {
    type: String,
    trim: true,
    default: "",
  },
  isCurrent: {
    type: Boolean,
    default: false,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Version || mongoose.model("Version", VersionSchema);
