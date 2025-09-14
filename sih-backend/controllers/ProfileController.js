// controllers/ProfileController.js
import User from "../models/User.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import mammoth from "mammoth";
import PDFParser from "pdf2json"; 

// ✅ Storage for saving resumes to Cloudinary
const cloudStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resumes",
    resource_type: "auto",
    allowed_formats: ["pdf", "doc", "docx"],
  },
});

// ✅ Storage for text extraction (keeps file in memory)
const memoryStorage = multer.memoryStorage();

// Upload to Cloudinary (for saving resume URLs)
export const uploadResumes = multer({ storage: cloudStorage }).array(
  "resumes",
  5
);

// Upload to Memory (for extracting text from resume)
export const uploadResumeForText = multer({ storage: memoryStorage }).single(
  "resume"
);

// ------------------- Profile APIs -------------------

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fields to check for completion
    const fields = [
      "name",
      "email",
      "number",
      "address",
      "skills",
      "education",
      "experience",
      "projects",
      "certifications",
      "resumes",
    ];

    let filledCount = 0;

    fields.forEach((field) => {
      const value = user[field];

      if (!value) return; // skip null/undefined

      if (Array.isArray(value)) {
        // check if array has at least one non-empty item
        const hasData = value.some((item) => {
          if (!item) return false;
          if (typeof item === "string") return item.trim() !== "";
          if (typeof item === "object")
            return Object.values(item).some(
              (v) => v && String(v).trim() !== ""
            );
          return false;
        });
        if (hasData) filledCount++;
      } else if (typeof value === "string") {
        if (value.trim() !== "") filledCount++;
      } else {
        filledCount++;
      }
    });

    const profileCompletion = Math.round(
      (filledCount / fields.length) * 100
    );

    res.json({ success: true, user: { ...user, profileCompletion } });
  } catch (err) {
    console.error("Get Profile Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    let updates = { ...req.body };

    // ✅ Parse JSON fields that come as strings
    const jsonFields = [
      "education",
      "experience",
      "projects",
      "certifications",
      "skills",
      "resumes",
    ];
    jsonFields.forEach((field) => {
      if (updates[field]) {
        try {
          updates[field] =
            typeof updates[field] === "string"
              ? JSON.parse(updates[field])
              : updates[field];
        } catch (err) {
          console.warn(`Failed to parse field ${field}:`, err.message);
          updates[field] = [];
        }
      }
    });

    // ✅ Update user profile
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Update Profile Error:", err);

    // ✅ Handle Mongo duplicate key error (e.g., email already exists)
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
        field: field,
        value: err.keyValue[field],
      });
    }

    // ✅ Fallback for other errors
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ------------------- Resume Extraction -------------------
export const extractResumeText = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const buffer = req.file.buffer;
    const originalName = req.file.originalname.toLowerCase();
    let text = "";

    if (originalName.endsWith(".pdf")) {
      const pdfParser = new PDFParser();

      text = await new Promise((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", (err) => reject(err.parserError));
        pdfParser.on("pdfParser_dataReady", (pdfData) => {
          resolve(pdfParser.getRawTextContent());
        });

        pdfParser.parseBuffer(buffer);
      });
    } else if (originalName.endsWith(".docx")) {
      const data = await mammoth.extractRawText({ buffer });
      text = data.value;
    } else {
      return res.status(400).json({ message: "Unsupported file format" });
    }

    text = text.replace(/\s+/g, " ").trim();

    // === Regex Parsers ===
    const nameMatch = text.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+){0,2})/);
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
    const phoneMatch = text.match(/(\+?\d{1,3}[-\s]?)?\d{10}/);

    // Skills extraction
    const skillsList = [
      "JavaScript", "React", "Node.js", "Python", "Java", "C++", "SQL", "Machine Learning",
      "Data Science", "AWS", "Docker", "Kubernetes", "HTML", "CSS", "MongoDB", "Express",
      "Figma", "NextJS", "Postgres",
    ];
    const skills = skillsList.filter((skill) => text.toLowerCase().includes(skill.toLowerCase()));

    // Extract education section
    const educationMatches = text.match(/EDUCATION([\s\S]*?)(EXPERIENCE|PROJECTS|CERTIFICATIONS|$)/i);
    const education = [];
    if (educationMatches) {
      const eduText = educationMatches[1];
      eduText.split(/[\n•]/).forEach((line) => {
        if (line.match(/College|University|School/i)) {
          education.push({
            institution: line.trim(),
            degree: line.match(/BCA|B\.?Tech|MCA|MBA|BSc|MSc/i)?.[0] || "",
            fieldOfStudy: line.match(/Computer Science|IT|Electronics/i)?.[0] || "",
            startDate: line.match(/\d{4}/g)?.[0] || "",
            endDate: line.match(/\d{4}/g)?.[1] || "",
            grade: line.match(/CGPA|GPA|[0-9]\.[0-9]/)?.[0] || "",
          });
        }
      });
    }

    // Extract experience section
    const experienceMatches = text.match(/EXPERIENCE([\s\S]*?)(PROJECTS|EDUCATION|CERTIFICATIONS|$)/i);
    const experience = [];
    if (experienceMatches) {
      const expText = experienceMatches[1];
      expText.split(/(?=[A-Z][a-z]+\s\|)/).forEach((entry) => {
        if (entry.trim()) {
          experience.push({
            role: entry.match(/^[^\|]+/i)?.[0].trim() || "",
            company: entry.match(/\|\s*([A-Za-z0-9&\s]+)/)?.[1]?.trim() || "",
            startDate: entry.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s?\d{4}/i)?.[0] || "",
            endDate: entry.match(/-\s*(Present|Currently|[A-Za-z]{3}\s?\d{4})/i)?.[1] || "",
            description: entry.split("∗").slice(1).map((d) => d.trim()),
          });
        }
      });
    }

    // Extract projects section
    const projectMatches = text.match(/PROJECTS([\s\S]*?)(EXPERIENCE|EDUCATION|CERTIFICATIONS|$)/i);
    const projects = [];
    if (projectMatches) {
      const projText = projectMatches[1];
      projText.split(/®/).forEach((entry) => {
        if (entry.trim()) {
          projects.push({
            title: entry.split("∗")[0].trim(),
            technologies: skillsList.filter((skill) => entry.toLowerCase().includes(skill.toLowerCase())),
            description: entry.split("∗").slice(1).map((d) => d.trim()),
          });
        }
      });
    }

    // Extract certifications section
    const certMatches = text.match(/CERTIFICATIONS([\s\S]*?)(PROJECTS|EXPERIENCE|EDUCATION|$)/i);
    const certifications = [];
    if (certMatches) {
      const certText = certMatches[1];
      certText.split(/[\n•]/).forEach((line) => {
        if (line.trim()) {
          certifications.push({
            name: line.trim(),
            issuingOrganization: line.match(/Coursera|Udemy|LinkedIn|Google|Microsoft/i)?.[0] || "",
            issueDate: line.match(/\d{4}/)?.[0] || "",
            expiryDate: "",
            credentialId: "",
          });
        }
      });
    }

    res.json({
      success: true,
      extracted: {
        name: nameMatch ? nameMatch[0] : null,
        email: emailMatch ? emailMatch[0] : null,
        phone: phoneMatch ? phoneMatch[0] : null,
        skills,
        education,
        experience,
        projects,
        certifications,
        rawText: text,
      },
    });
  } catch (err) {
    console.error("Resume extraction error:", err.message);
    res.status(500).json({ message: "Failed to extract resume text" });
  }
};
