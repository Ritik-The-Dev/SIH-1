import User from "../models/User.js";
import JobPosting from "../models/Jobs.js";
import { sendEmail } from "../utils/sendEmail.js";
import { recommendWithTfIdf } from "../utils/recommender.js";

/**
 * @desc   Get top job recommendations using TF-IDF + cosine similarity
 * @route  POST /api/jobs/recommend
 */
export const getJobsRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 5 } = req.query;

    const user = await User.findById(userId).select(
      "skills education experience certifications resumes"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Build profile text (skills + education + exp + certs)
    let profileText = [
      ...(user.skills || []),
      ...(user.education || []),
      ...(user.experience || []),
      ...(user.certifications || []),
    ]
      .join(" ")
      .toLowerCase();

    // (Optional) if resumes uploaded, you can extract text from them with pdf-parse later

    // ✅ Get all jobs (or filtered by location/sector from req.body)
    const filters = {};
    if (req.body.location) filters["location.city"] = req.body.location;
    if (req.body.sector) filters.sector = req.body.sector;

    const jobs = await JobPosting.find(filters);

    if (!jobs.length) {
      return res.json({ jobs: [] });
    }

    // ✅ Rank jobs with recommender
    const ranked = recommendWithTfIdf(jobs, profileText);

    // ✅ Paginate results
    const start = (page - 1) * limit;
    const paginated = ranked.slice(start, start + parseInt(limit));

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total: ranked.length,
      jobs: paginated.map((r) => ({
        ...r.job.toObject(),
        score: r.score, // include similarity score
      })),
    });
  } catch (err) {
    console.error("Job Recommendation Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc   Get all jobs the user applied to
 * @route  GET /api/jobs/myApplications
 */
export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("applications");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      applications: user.applications,
    });
  } catch (err) {
    console.error("My Applications Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const applyForJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobId } = req.params;

    // ✅ Check job exists
    const job = await JobPosting.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // ✅ Fetch user
    const user = await User.findById(userId);

    // ✅ Prevent duplicate applications
    if (user.applications.includes(jobId)) {
      return res.status(400).json({ message: "Already applied for this job" });
    }

    // ✅ Save application
    user.applications.push(jobId);
    await user.save();

    // ✅ Send confirmation email
    const subject = `Application Submitted - ${job.role} @ ${job.companyName}`;
    const text = `
Hi ${user.name},

Your application for the role of ${job.role} at ${job.companyName} has been submitted successfully.

Job Location: ${job.location.city}, ${job.location.state}
Employment Type: ${job.employmentType}
Mode of Work: ${job.modeOfWork}

We will notify you if you are shortlisted.

Best regards,
Internship Portal Team
    `;

    await sendEmail(user.email, subject, text);

    res.status(200).json({
      message: "Application submitted successfully.",
      jobId,
      userId,
    });
  } catch (err) {
    console.error("Apply Job Error:", err.message);
    res.status(500).json({ message: "Failed to apply for job" });
  }
};
