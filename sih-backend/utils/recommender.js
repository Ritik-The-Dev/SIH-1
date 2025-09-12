 // services/recommender.js
import natural from "natural";

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
    if (Array.isArray(j.skillsRequired) && j.skillsRequired.length) jobDocParts.push(j.skillsRequired.join(" "));
    documents.push((jobDocParts.join(" ") || "").toLowerCase());
  }

  const tfidf = new TfIdf();
  documents.forEach(doc => tfidf.addDocument(doc));

  // Build vocabulary
  const vocab = [];
  tfidf.documents.forEach(doc => {
    Object.keys(doc).forEach(term => {
      if (!vocab.includes(term)) vocab.push(term);
    });
  });

  // Convert each document to a vector of tfidf weights using vocab order
  function docToVector(docIndex) {
    return vocab.map(term => {
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
