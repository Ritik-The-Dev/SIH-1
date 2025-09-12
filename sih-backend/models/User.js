// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    number: {
      type: String, // keeping as String to handle leading zeros / country codes
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    skills: {
      type: [String], // e.g. ["JavaScript", "React", "Node.js"]
      default: [],
    },
    education: {
      type: [String], // can expand to objects {degree, institute, year}
      default: [],
    },
    projects: {
      type: [String], // can expand to objects {title, description, link}
      default: [],
    },
    experience: {
      type: [String], // can expand to objects {role, company, duration}
      default: [],
    },
    certifications: {
      type: [String], // e.g. ["AWS Certified", "Google Data Analytics"]
      default: [],
    },
    address: {
      type: String,
      trim: true,
    },
    favourites: {
      type: [mongoose.Schema.Types.ObjectId], // store JobPosting IDs
      ref: "JobPosting",
      default: [],
    },
    applications: {
      type: [mongoose.Schema.Types.ObjectId], // store JobPosting IDs applied
      ref: "JobPosting",
      default: [],
    },
    resumes: {
      type: [String], // store file paths or URLs
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
