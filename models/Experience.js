import mongoose from "mongoose";
import { EMPLOYMENT_TYPES } from "@/lib/constants";

const ExperienceSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  employmentType: {
    type: String,
    enum: EMPLOYMENT_TYPES,
    default: "Internship",
  },
  location: {
    type: String,
    trim: true,
    default: "",
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    default: null,
  },
  isCurrent: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  responsibilities: [
    {
      type: String,
      trim: true,
    },
  ],
  technologies: [
    {
      type: String,
      trim: true,
    },
  ],
  companyUrl: {
    type: String,
    trim: true,
    default: "",
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  isVisible: {
    type: Boolean,
    default: true,
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

export default mongoose.models.Experience ||
  mongoose.model("Experience", ExperienceSchema);
