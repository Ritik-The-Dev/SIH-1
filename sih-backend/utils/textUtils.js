// utils/textUtils.js
import PDFParser from "pdf2json";
import _ from "lodash";

/**
 * Extract text from an uploaded PDF resume buffer using pdf2json
 * @param {Buffer} fileBuffer
 * @returns {Promise<string>}
 */
export async function extractTextFromPdfBuffer(fileBuffer) {
  if (!fileBuffer) return "";

  return new Promise((resolve, reject) => {
    try {
      const pdfParser = new PDFParser();

      pdfParser.on("pdfParser_dataError", errData => {
        console.error("pdf2json parse error:", errData.parserError);
        resolve(""); // return empty string on error
      });

      pdfParser.on("pdfParser_dataReady", pdfData => {
        // Extract text from all pages
        const rawText = pdfData.formImage.Pages
          .map(page =>
            page.Texts
              .map(t => decodeURIComponent(t.R.map(r => r.T).join("")))
              .join(" ")
          )
          .join(" ");
        resolve(rawText);
      });

      // Load buffer
      pdfParser.parseBuffer(fileBuffer);
    } catch (err) {
      console.error("pdf2json error:", err);
      resolve("");
    }
  });
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
    parts.push(
      prefs.education
        .map(e => `${e.degree || ""} ${e.school || ""} ${e.year || ""}`)
        .join(" ")
    );

  if (Array.isArray(prefs.experience) && prefs.experience.length)
    parts.push(
      prefs.experience
        .map(x => `${x.role || ""} ${x.company || ""} ${x.description || ""}`)
        .join(" ")
    );

  if (Array.isArray(prefs.projects) && prefs.projects.length)
    parts.push(
      prefs.projects
        .map(p => `${p.title || ""} ${p.tech || ""} ${p.description || ""}`)
        .join(" ")
    );

  if (prefs.resumeText) parts.push(prefs.resumeText);
  if (prefs.freeText) parts.push(prefs.freeText);

  const combined = parts.join(" ").replace(/\s+/g, " ").toLowerCase();
  return _.trim(combined);
}
