// models/User.js
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPosting",
      required: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Under Review", "Shortlisted", "Rejected", "Accepted"],
      default: "Applied",
    },
    appliedAt: { type: Date, default: Date.now },

    // ✅ Store both name + url for resume
    resume: {
      name: { type: String },
      url: { type: String },
    },

    coverLetter: { type: String },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    school: String,
    degree: String,
    year: String,
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    role: String,
    company: String,
    startDate: String,
    endDate: String,
    description: [String], // bullet points
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: String,
    technologies: [String],
    description: [String],
  },
  { _id: false }
);

const certificationSchema = new mongoose.Schema(
  {
    name: String,
    issuingOrganization: String,
    issueDate: String,
    expiryDate: String,
    credentialId: String,
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Original file name
    url: { type: String, required: true },  // Cloudinary URL
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    number: { type: String, trim: true },
    password: { type: String }, // optional for Google users
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    skills: { type: [String], default: [] },
    education: { type: [educationSchema], default: [] },
    projects: { type: [projectSchema], default: [] },
    experience: { type: [experienceSchema], default: [] },
    certifications: { type: [certificationSchema], default: [] },
    address: { type: String, trim: true },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobPosting", default: [] }],
    applications: { type: [applicationSchema], default: [] },

    // ✅ Store multiple resumes (name + url)
    resumes: { type: [resumeSchema], default: [] },

    // Google auth fields
    googleAuth: { type: Boolean, default: false },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
