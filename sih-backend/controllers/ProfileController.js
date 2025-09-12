import User from "../models/User.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// ✅ Setup Cloudinary Storage for resumess
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resumes",
    resource_type: "auto",
    allowed_formats: ["pdf", "doc", "docx"],
  },
});

// ✅ Multer middleware for multiple resume uploads
export const uploadResumes = multer({ storage }).array("resumes", 5); // max 5 resumes

/**
 * @desc   Get logged-in user profile
 * @route  GET /api/profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Get Profile Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc   Update user profile (with resume upload support)
 * @route  POST /api/profile/update
 */
export const updateProfile = async (req, res) => {
  try {
    let updates = { ...req.body };

    // ✅ If resumes are uploaded, push Cloudinary URLs
    if (req.files && req.files.length > 0) {
      const newResumes = req.files.map((file) => file.path); // Cloudinary returns .path as the URL
      updates.$push = { resumes: { $each: newResumes } };
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Update Profile Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

import axios from "axios";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

/**
 * @desc   Extract text from resume and parse details
 * @route  POST /api/resume/extract
 * @body   { resumeUrl: "https://cloudinary.com/.../resume.pdf" }
 */
export const extractResumeText = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const buffer = req.file.buffer;
    const originalName = req.file.originalname.toLowerCase();
    let text = "";

    // ✅ Detect format (PDF or DOCX)
    if (originalName.endsWith(".pdf")) {
      const data = await pdfParse(buffer);
      text = data.text;
    } else if (originalName.endsWith(".docx")) {
      const data = await mammoth.extractRawText({ buffer });
      text = data.value;
    } else {
      return res.status(400).json({ message: "Unsupported file format" });
    }

    text = text.replace(/\s+/g, " ").trim();

    // ✅ Extract details
    const nameMatch = text.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+){0,2})/);
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
    const phoneMatch = text.match(/(\+?\d{1,3}[-\s]?)?\d{10}/);

    const skillsList = [
      "JavaScript","React","Node.js","Python","Java","C++","SQL",
      "Machine Learning","Data Science","AWS","Docker","Kubernetes",
      "HTML","CSS","MongoDB","Express","Figma"
    ];
    const skills = skillsList.filter(skill =>
      text.toLowerCase().includes(skill.toLowerCase())
    );

    const education = [];
    if (text.match(/B\.?Tech|Bachelor|BSc|B\.E/i)) education.push("Bachelor");
    if (text.match(/M\.?Tech|Master|MSc|MBA/i)) education.push("Master");
    if (text.match(/PhD|Doctorate/i)) education.push("PhD");

    const expMatch = text.match(/(\d+)\+?\s+years?/i);
    const experience = expMatch ? expMatch[1] + " years" : "Fresher";

    res.json({
      extracted: {
        name: nameMatch ? nameMatch[0] : null,
        email: emailMatch ? emailMatch[0] : null,
        phone: phoneMatch ? phoneMatch[0] : null,
        skills,
        education,
        experience,
        rawText: text,
      }
    });
  } catch (err) {
    console.error("Resume extraction error:", err.message);
    res.status(500).json({ message: "Failed to extract resume text" });
  }
};