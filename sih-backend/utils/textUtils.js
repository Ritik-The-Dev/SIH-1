// utils/textUtils.js
import fs from "fs";
import pdfParse from "pdf-parse";
import _ from "lodash";

/**
 * Extract text from an uploaded resume file (supports PDF; for other formats you can add parsers)
 * @param {Buffer} fileBuffer
 * @returns {Promise<string>}
 */
export async function extractTextFromPdfBuffer(fileBuffer) {
  if (!fileBuffer) return "";
  try {
    const data = await pdfParse(fileBuffer);
    return data.text || "";
  } catch (err) {
    console.error("pdf parse error:", err);
    return "";
  }
}

/**
 * Build a single normalized "profile" text from user preferences and resume text
 * so TF-IDF can compare text easily.
 * @param {Object} prefs - { skills:[], education:[], experience:[], age, otherText }
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
    parts.push(prefs.education.map(e => `${e.degree || ""} ${e.school || ""} ${e.year || ""}`).join(" "));

  if (Array.isArray(prefs.experience) && prefs.experience.length)
    parts.push(prefs.experience.map(x => `${x.role || ""} ${x.company || ""} ${x.description || ""}`).join(" "));

  if (Array.isArray(prefs.projects) && prefs.projects.length)
    parts.push(prefs.projects.map(p => `${p.title || ""} ${p.tech || ""} ${p.description || ""}`).join(" "));

  if (prefs.resumeText) parts.push(prefs.resumeText);

  if (prefs.freeText) parts.push(prefs.freeText);

  const combined = parts.join(" ").replace(/\s+/g, " ").toLowerCase();
  // minimal cleaning
  return _.trim(combined);
}
