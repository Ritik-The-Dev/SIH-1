// utils/textUtils.js
import _ from "lodash";
import pdf from "pdf-parse";

/**
 * Extract text from PDF buffer
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
export const extractTextFromPdfBuffer = async (buffer) => {
  try {
    if (!buffer || buffer.length === 0) {
      throw new Error("Empty PDF buffer");
    }
    const data = await pdf(buffer);
    return data.text || "";
  } catch (err) {
    console.error("PDF parsing error:", err.message);
    return "";
  }
};

/**
 * Build normalized profile text for TF-IDF comparison
 */
export function buildProfileText(prefs = {}) {
  const parts = [];

  if (prefs.name) parts.push(prefs.name);
  if (prefs.age) parts.push(String(prefs.age));
  if (prefs.email) parts.push(prefs.email);
  if (prefs.phone) parts.push(prefs.phone);
  if (prefs.address) parts.push(prefs.address);

  if (Array.isArray(prefs.skills) && prefs.skills.length)
    parts.push(prefs.skills.join(" "));

  if (Array.isArray(prefs.education) && prefs.education.length)
    parts.push(
      prefs.education
        .map((e) => `${e.degree || ""} ${e.school || ""} ${e.year || ""}`)
        .join(" ")
    );

  if (Array.isArray(prefs.experience) && prefs.experience.length)
    parts.push(
      prefs.experience
        .map((x) => `${x.role || ""} ${x.company || ""} ${x.description || ""}`)
        .join(" ")
    );

  if (Array.isArray(prefs.projects) && prefs.projects.length)
    parts.push(
      prefs.projects
        .map((p) => `${p.title || ""} ${p.tech || ""} ${p.description || ""}`)
        .join(" ")
    );

  if (prefs.resumeText) parts.push(prefs.resumeText);
  if (prefs.freeText) parts.push(prefs.freeText);

  return _.trim(parts.join(" ").replace(/\s+/g, " ").toLowerCase());
}
