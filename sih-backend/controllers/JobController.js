import User from "../models/User.js";
import JobPosting from "../models/Jobs.js";
import { sendEmail } from "../utils/sendEmail.js";
import { recommendWithTfIdf } from "../utils/recommender.js";
import { recommendWithGemini } from "../utils/recommender.js";

export const getJobsRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 5 } = req.query;

    // Get user with applications and profile data
    const user = await User.findById(userId)
      .select("skills education experience certifications resumes applications")
      .populate(
        "applications.job",
        "title skillsRequired jobDescription company location"
      );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get applied job IDs to exclude them
    const appliedJobIds =
      user.applications?.map((app) => app.job._id.toString()) || [];

    // Build user profile object for Gemini
    const userProfile = {
      skills: user.skills || [],
      experience: user.experience || [],
      education: user.education || [],
      certifications: user.certifications || [],
      preferences: req.body.preferences || {}, // Allow preferences from request
    };

    // Build filters
    const filters = {};
    if (req.body.location) filters["location.city"] = req.body.location;
    if (req.body.sector) filters.sector = req.body.sector;
    if (req.body.remote !== undefined) filters.remote = req.body.remote;

    // Exclude already applied jobs
    filters._id = { $nin: appliedJobIds };

    // Find available jobs (excluding applied ones)
    const jobs = await JobPosting.find(filters);

    if (!jobs.length) {
      return res.json({
        success: true,
        jobs: [],
        message: "No new jobs available matching your criteria",
      });
    }

    let recommendations;

    try {
      // Use Gemini AI for recommendations (primary)
      recommendations = await recommendWithGemini(jobs, userProfile, 50); // Get more for pagination

      // Enhance recommendations with insights from previous applications
      if (user.applications?.length > 0) {
        recommendations = enhanceWithApplicationHistory(
          recommendations,
          user.applications
        );
      }
    } catch (geminiError) {
      console.warn(
        "Gemini AI failed, falling back to TF-IDF:",
        geminiError.message
      );

      // Fallback to TF-IDF
      const profileText = [
        ...(user.skills || []),
        ...(user.education || []),
        ...(user.experience || []),
        ...(user.certifications || []),
      ]
        .join(" ")
        .toLowerCase();

      const tfidfResults = recommendWithTfIdf(jobs, profileText);
      recommendations = tfidfResults.map((r) => ({
        job: r.job,
        score: r.score,
        reasoning: `TF-IDF similarity score: ${r.score.toFixed(2)}`,
        keyMatches: [],
      }));
    }

    // Sort by score (descending)
    recommendations.sort((a, b) => b.score - a.score);

    // Paginate results
    const start = (page - 1) * limit;
    const end = start + parseInt(limit);
    const paginated = recommendations.slice(start, end);

    res.json({
      success: true,
      page: parseInt(page),
      limit: parseInt(limit),
      total: recommendations.length,
      totalApplied: appliedJobIds.length,
      jobs: paginated.map((rec) => ({
        ...rec.job.toObject(),
        recommendationScore: rec.score,
        recommendationReason: rec.reasoning,
        keyMatches: rec.keyMatches,
        alreadyApplied: false,
      })),
    });
  } catch (err) {
    console.log("Job Recommendation Error:", err.message);
    res.status(500).json({ message: "Server error", err });
  }
};

/**
 * Enhance recommendations based on previous application history
 */
function enhanceWithApplicationHistory(recommendations, applications) {
  if (!applications?.length) return recommendations;

  // Analyze successful applications (those that got responses/interviews)
  const successfulApps = applications.filter(
    (app) => app.status === "interview" || app.status === "shortlisted"
  );

  if (successfulApps.length === 0) return recommendations;

  // Extract patterns from successful applications
  const successfulPatterns = {
    skills: new Set(),
    companies: new Set(),
    titles: new Set(),
    industries: new Set(),
  };

  successfulApps.forEach((app) => {
    if (app.jobId.skillsRequired) {
      app.jobId.skillsRequired.forEach((skill) =>
        successfulPatterns.skills.add(skill)
      );
    }
    if (app.jobId.company) successfulPatterns.companies.add(app.jobId.company);
    if (app.jobId.title) successfulPatterns.titles.add(app.jobId.title);
    if (app.jobId.sector) successfulPatterns.industries.add(app.jobId.sector);
  });

  // Boost scores for jobs matching successful patterns
  return recommendations.map((rec) => {
    let boost = 0;
    const boostReasons = [];

    // Check for skill matches
    const jobSkills = Array.isArray(rec.job.skillsRequired)
      ? rec.job.skillsRequired
      : [];
    const matchingSkills = jobSkills.filter((skill) =>
      Array.from(successfulPatterns.skills).some(
        (pattern) =>
          skill.toLowerCase().includes(pattern.toLowerCase()) ||
          pattern.toLowerCase().includes(skill.toLowerCase())
      )
    );

    if (matchingSkills.length > 0) {
      boost += 0.1 * matchingSkills.length;
      boostReasons.push(
        `Matches ${matchingSkills.length} skills from your successful applications`
      );
    }

    // Check for company match
    if (rec.job.company && successfulPatterns.companies.has(rec.job.company)) {
      boost += 0.15;
      boostReasons.push(`Similar to companies you've had success with`);
    }

    // Check for industry match
    if (rec.job.sector && successfulPatterns.industries.has(rec.job.sector)) {
      boost += 0.1;
      boostReasons.push(`Industry matches your successful applications`);
    }

    if (boost > 0) {
      return {
        ...rec,
        score: Math.min(1, rec.score + boost),
        reasoning:
          rec.reasoning +
          (boostReasons.length > 0
            ? ` [Enhanced: ${boostReasons.join("; ")}]`
            : ""),
      };
    }

    return rec;
  });
}

/**
 * @desc   Get all jobs the user applied to
 * @route  GET /api/jobs/myApplications
 */
export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate({
      path: "applications.job",
      model: "JobPosting",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sortedApplications = [...user.applications].sort(
      (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)
    );

    res.json({
      success: true,
      applications: sortedApplications,
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
    const { resume, coverLetter } = req.body; // optional

    // ✅ Check job exists
    const job = await JobPosting.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // ✅ Fetch user
    const user = await User.findById(userId);

    // ✅ Prevent duplicate applications
    const alreadyApplied = user.applications.some(
      (app) => app.job.toString() === jobId
    );
    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied for this job" });
    }

    // ✅ Save detailed application
    const applicationData = {
      job: job._id,
      status: "Applied",
      appliedAt: new Date(),
      resume: resume || null,
      coverLetter: coverLetter || null,
    };

    user.applications.push(applicationData);
    await user.save();

    // ✅ Respond to user immediately
    res.status(200).json({
      success: true,
      message: "Application submitted successfully.",
      application: {
        jobId: job._id,
        status: "Applied",
        appliedAt: applicationData.appliedAt,
      },
    });

    // ✅ Send confirmation email **in the background**
    const subject = `Application Submitted - ${job.role} @ ${job.companyName}`;
    const text = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Application Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 20px; text-align: center; background-color: #0073e6; border-top-left-radius: 8px; border-top-right-radius: 8px;">
              <h2 style="color: #ffffff; margin: 0;">Application Submitted</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; color: #333333;">
              <p>Hi <b>${user.name}</b>,</p>
              <p>Your application for the role of <b>${job.role}</b> at <b>${
      job.companyName
    }</b> has been submitted successfully.</p>

              <table width="100%" cellpadding="5" cellspacing="0" border="0" style="margin: 15px 0; border-collapse: collapse;">
                <tr>
                  <td style="border: 1px solid #ddd; background: #f1f1f1;"><b>Job Location</b></td>
                  <td style="border: 1px solid #ddd;">${job.location.city}, ${
      job.location.state
    }</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; background: #f1f1f1;"><b>Employment Type</b></td>
                  <td style="border: 1px solid #ddd;">${job.employmentType}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; background: #f1f1f1;"><b>Mode of Work</b></td>
                  <td style="border: 1px solid #ddd;">${job.modeOfWork}</td>
                </tr>
              </table>

              <p>We will notify you if you are shortlisted.</p>
              <p style="margin-top: 25px;">Best regards,<br><b>Internship Portal Team</b></p>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; text-align: center; font-size: 12px; color: #999; background: #f1f1f1; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
              &copy; ${new Date().getFullYear()} Internship Portal. All rights reserved.
            </td>
          </tr>
        </table>
      </body>
    </html>
    `;

    // 👇 Fire and forget
    sendEmail(user.email, subject, text).catch((err) => {
      console.error("Email failed to send in background:", err.message);
    });
  } catch (err) {
    console.error("Apply Job Error:", err.message);
    res.status(500).json({ message: "Failed to apply for job" });
  }
};
