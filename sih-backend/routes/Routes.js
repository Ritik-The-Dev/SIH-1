import express from "express";
import multer from "multer"; // ✅ Add multer
import { authMiddleware } from "../middleware/middleware.js";
import {
  extractResumeText,
  getProfile,
  updateProfile,
  uploadResumes,
} from "../controllers/ProfileController.js";
import { login, signUp } from "../controllers/AuthController.js";
import {
  applyForJob,
  getJobsRecommendations,
  getMyApplications,
} from "../controllers/JobController.js";

const router = express.Router();

// ✅ Configure multer for resume uploads
const upload = multer({ storage: multer.memoryStorage() }); // stores files in memory for Cloudinary or parsing

// ✅ Auth routes
router.post("/signUp", signUp);
router.post("/login", login);

// ✅ Profile routes
router.get("/profile", authMiddleware, getProfile);
router.post("/updateProfile", authMiddleware, uploadResumes, updateProfile); // uploadResumes should handle multiple files

// ✅ Recommendation engine
router.post("/recommend", authMiddleware, getJobsRecommendations);

// ✅ Applications
router.post("/apply/:jobId", authMiddleware, applyForJob);
router.get("/myApplications", authMiddleware, getMyApplications); // changed to GET

// ✅ Resume extraction
router.post("/extract", authMiddleware, upload.single("resume"), extractResumeText);

export default router;
