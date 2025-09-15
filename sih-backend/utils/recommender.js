// services/recommender.js
import natural from "natural";

// services/geminiRecommender.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const { TfIdf, PorterStemmer } = natural;
natural.PorterStemmer = PorterStemmer;

/**
 * Compute cosine similarity between two numeric vectors
 */
function cosineSimilarity(vecA, vecB) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Use Gemini AI to filter and recommend top jobs matching user profile
 * @param {Array} jobs - Array of job objects { _id, title, jobDescription, skillsRequired, ... }
 * @param {Object} userProfile - User profile object { skills: [], experience: [], education: [], preferences: {} }
 * @param {number} topN - Number of top recommendations to return
 * @returns {Promise<Array>} - Array of recommended jobs with match scores and reasoning
 */
export async function recommendWithGemini(jobs, userProfile, topN = 5) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Prepare user profile context
    const userContext = `
User Profile:
- Skills: ${userProfile.skills?.join(", ") || "Not specified"}
- Experience: ${userProfile.experience?.join(", ") || "Not specified"}
- Education: ${userProfile.education?.join(", ") || "Not specified"}
- Preferences: ${JSON.stringify(userProfile.preferences) || "None"}
`;

    // Prepare jobs data for analysis
    const jobsData = jobs.map((job) => ({
      id: job._id,
      title: job.title || job.role,
      description: job.jobDescription || "",
      skills: Array.isArray(job.skillsRequired) ? job.skillsRequired : [],
      company: job.company || "",
      location: job.location || "",
    }));

    const prompt = `
You are an AI career advisor. Analyze the following user profile and list of available jobs.
Return ONLY a valid JSON array with the top ${topN} most suitable jobs in order of best match.

User Profile:
${userContext}

Available Jobs (${jobs.length} total):
${JSON.stringify(jobsData, null, 2)}

Return format (JSON array):
[
  {
    "jobId": "job_id_here",
    "matchScore": 0.95,
    "reasoning": "Brief explanation of why this job matches well",
    "keyMatches": ["skill1", "experience2", "preference3"]
  }
]

Important:
1. Return ONLY valid JSON, no additional text
2. Match score should be between 0.0 and 1.0
3. Focus on skills alignment, experience relevance, and user preferences
4. Consider both technical and cultural fit
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response from Gemini
    let recommendations;
    try {
      // Extract JSON from the response (Gemini might add markdown code blocks)
      const jsonMatch =
        text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\[[\s\S]*\]/);
      recommendations = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      throw new Error("Invalid response format from AI");
    }

    // Map recommendations back to full job objects
    const recommendedJobs = recommendations
      .map((rec) => {
        const job = jobs.find((j) => j._id.toString() === rec.jobId);
        return {
          job,
          score: rec.matchScore,
          reasoning: rec.reasoning,
          keyMatches: rec.keyMatches,
        };
      })
      .filter((item) => item.job); // Filter out any jobs that weren't found

    return recommendedJobs;
  } catch (error) {
    console.error("Gemini recommendation error:", error);

    // Fallback to simple keyword matching if Gemini fails
    console.log("Falling back to keyword matching...");
    return fallbackRecommendation(jobs, userProfile, topN);
  }
}

/**
 * Fallback recommendation using simple keyword matching
 */
function fallbackRecommendation(jobs, userProfile, topN) {
  const userSkills = userProfile.skills || [];
  const userSkillsLower = userSkills.map((s) => s.toLowerCase());

  return jobs
    .map((job) => {
      const jobSkills = Array.isArray(job.skillsRequired)
        ? job.skillsRequired.map((s) => s.toLowerCase())
        : [];

      const matchingSkills = jobSkills.filter((skill) =>
        userSkillsLower.some(
          (userSkill) => userSkill.includes(skill) || skill.includes(userSkill)
        )
      );

      const score = matchingSkills.length / Math.max(jobSkills.length, 1);

      return {
        job,
        score,
        reasoning: `Matched ${matchingSkills.length} of ${jobSkills.length} skills`,
        keyMatches: matchingSkills,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

/**
 * Enhanced version with more detailed analysis
 */
export async function recommendWithGeminiDetailed(jobs, userProfile, topN = 5) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
As an expert career matching AI, perform detailed analysis of this user profile against available jobs.

USER PROFILE:
- Skills: ${userProfile.skills?.join(", ") || "None"}
- Experience: ${
      userProfile.experience
        ?.map((exp) => `${exp.role} at ${exp.company} (${exp.duration})`)
        .join("; ") || "None"
    }
- Education: ${userProfile.edience?.join(", ") || "None"}
- Preferences: ${JSON.stringify(userProfile.preferences) || "None"}

ANALYZE ${jobs.length} JOBS:
${jobs
  .map(
    (job) => `
JOB: ${job.title}
ID: ${job._id}
COMPANY: ${job.company}
SKILLS: ${
      Array.isArray(job.skillsRequired) ? job.skillsRequired.join(", ") : "None"
    }
DESCRIPTION: ${job.jobDescription?.substring(0, 200)}...
`
  )
  .join("\n")}

RETURN JSON with:
[
  {
    "jobId": "string",
    "overallScore": 0.95,
    "skillMatch": 0.9,
    "experienceMatch": 0.8,
    "cultureFit": 0.7,
    "growthPotential": 0.85,
    "detailedAnalysis": "Comprehensive analysis...",
    "recommendationStrength": "Strong/Moderate/Weak"
  }
]

Return ONLY valid JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse and process similar to the main function
    const analysis = JSON.parse(text.replace(/```json|```/g, ""));

    return analysis
      .map((item) => {
        const job = jobs.find((j) => j._id.toString() === item.jobId);
        return { job, ...item };
      })
      .filter((item) => item.job);
  } catch (error) {
    console.error("Detailed Gemini analysis failed:", error);
    return recommendWithGemini(jobs, userProfile, topN);
  }
}

/**s
 * Build TF-IDF matrix with natural and return similarity scores
 * jobs: array of { _id, title, jobDescription, skillsRequired: [] , ...}
 * profileText: string
 * returns array of { job, score }
 */
export function recommendWithTfIdf(jobs, profileText) {
  // Build documents: first document is the user profile, rest are jobs
  const documents = [profileText];
  for (const j of jobs) {
    // Combine title + description + skills into a single doc
    const jobDocParts = [];
    if (j.role || j.title) jobDocParts.push(j.role || j.title);
    if (j.jobDescription) jobDocParts.push(j.jobDescription);
    if (Array.isArray(j.skillsRequired) && j.skillsRequired.length)
      jobDocParts.push(j.skillsRequired.join(" "));
    documents.push((jobDocParts.join(" ") || "").toLowerCase());
  }

  const tfidf = new TfIdf();
  documents.forEach((doc) => tfidf.addDocument(doc));

  // Build vocabulary
  const vocab = [];
  tfidf.documents.forEach((doc) => {
    Object.keys(doc).forEach((term) => {
      if (!vocab.includes(term)) vocab.push(term);
    });
  });

  // Convert each document to a vector of tfidf weights using vocab order
  function docToVector(docIndex) {
    return vocab.map((term) => {
      // natural.TfIdf has tfidf(term, docIndex)
      try {
        return tfidf.tfidf(term, docIndex);
      } catch (e) {
        return 0;
      }
    });
  }

  const profileVec = docToVector(0);
  const results = [];
  for (let i = 1; i < documents.length; i++) {
    const job = jobs[i - 1];
    const jobVec = docToVector(i);
    const score = cosineSimilarity(profileVec, jobVec);
    results.push({ job, score });
  }

  // sort descending by score
  results.sort((a, b) => b.score - a.score);
  return results;
}
