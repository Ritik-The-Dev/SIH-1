import express from "express";
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

// ✅ Auth routes
router.post("/signUp", signUp);
router.post("/login", login);

// ✅ Profile routes
router.get("/profile", authMiddleware, getProfile);
router.post("/updateProfile", authMiddleware, uploadResumes, updateProfile);

// ✅ Recommendation engine
router.post("/recommend", authMiddleware, getJobsRecommendations);

// ✅ Applications
router.post("/apply/:jobId", authMiddleware, applyForJob);
router.post("/myApplications", authMiddleware, getMyApplications);
router.post("/extract", authMiddleware, upload.single("resume"), extractResumeText);

export default router;
