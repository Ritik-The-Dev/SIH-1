// models/Application.js
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
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
    sector: {
      type: String,
      trim: true,
    },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
    },
    jobDescription: {
      type: String,
      required: true,
    },
    compensation: {
      type: Number, // store in INR or define currency separately
      required: true,
    },
    skillsRequired: {
      type: [String],
      default: [],
    },
    dateOfPosting: {
      type: Date,
      default: Date.now,
    },
    totalPositions: {
      type: Number,
      default: 1,
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract", "Freelance"],
      required: true,
    },
    modeOfWork: {
      type: String,
      enum: ["On-site", "Remote", "Hybrid"],
      required: true,
    },
    educationRequirement: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// ✅ Correct way to prevent model overwrite errors in dev (Hot Reload)
export default mongoose.models.JobPosting || mongoose.model("JobPosting", applicationSchema);
