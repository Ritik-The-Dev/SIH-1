import express from "express";
import multer from "multer"; // ✅ Add multer
import { authMiddleware } from "../middleware/middleware.js";
import {
  extractResumeText,
  getProfile,
  updateProfile,
  uploadResumeForText,
  uploadResumes,
} from "../controllers/ProfileController.js";
import { login, signInWithGoogle, signUp } from "../controllers/AuthController.js";
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
router.post("/signInWithGoogle", signInWithGoogle);

// ✅ Profile routes
router.get("/profile", authMiddleware, getProfile);
router.post("/updateProfile", authMiddleware, updateProfile); 

// ✅ Recommendation engine
router.post("/recommend", authMiddleware, getJobsRecommendations);

// ✅ Applications
router.post("/apply/:jobId", authMiddleware, applyForJob);
router.get("/myApplications", authMiddleware, getMyApplications); // changed to GET

router.post("/logout", authMiddleware, (req, res) => {
  res.cookie("Authorization", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ success : true , message: "Logged out successfully" });
});

// ✅ Resume extraction
router.post("/extract", authMiddleware, uploadResumeForText, extractResumeText);

export default router;
