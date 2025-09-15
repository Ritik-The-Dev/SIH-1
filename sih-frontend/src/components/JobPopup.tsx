import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaSpinner } from "react-icons/fa";
import { useRecoilValue } from "recoil";
import { themeState } from "../store/theme";
import { useApplyForJob } from "../services/hooks";
import { userState } from "../store/profile";
import { useState } from "react";

interface JobPopupProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
}

export default function JobPopup({ isOpen, onClose, job }: JobPopupProps) {
  const darkMode = useRecoilValue(themeState);
  const user: any = useRecoilValue(userState);
  const { mutateAsync: applyForJob, isLoading: loading } = useApplyForJob();
  const [selectedResume, setSelectedResume] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await applyForJob({ jobId: job._id, resume: selectedResume });
      if (data && data.success) {
        onClose();
      }
    } catch (error) {
      console.error("Apply error:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="job-title"
        >
          {/* Popup Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`relative w-full max-w-lg p-6 rounded-2xl shadow-xl ${
              darkMode ? "bg-gray-900" : "bg-white"
            }`}
          >
            {/* Close Button */}
            <button
              disabled={loading}
              onClick={onClose}
              aria-label="Close job details"
              className={`absolute top-4 right-4 transition ${
                darkMode
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaTimes className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="mb-4">
              <h2
                id="job-title"
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {job.role}
              </h2>
              <p
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {job.companyName}
              </p>
            </div>

            {/* Job Details */}
            <div
              className={`space-y-3 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <p>
                <span className="font-semibold">📍 Location:</span>{" "}
                {job.location.city}, {job.location.state}
              </p>
              <p>
                <span className="font-semibold">💼 Type:</span>{" "}
                {job.employmentType} • {job.modeOfWork}
              </p>
              <p>
                <span className="font-semibold">📅 Posted:</span>{" "}
                {new Date(job.dateOfPosting).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">📝 Description:</span>{" "}
                {job.description}
              </p>
              <div>
                <span className="font-semibold">⚡ Skills:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.skillsRequired?.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 text-xs rounded-full ${
                        darkMode
                          ? "bg-blue-900/30 text-blue-300"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Resume Selection */}
            {user?.resumes?.length > 0 && (
              <div className="mt-6">
                <h3
                  className={`font-semibold mb-2 ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Select Resume
                </h3>
                <div className="space-y-2 max-h-32 scroll-small overflow-y-auto pr-2">
                  {user.resumes.map(
                    (resume: { name: string; url: string }, idx: number) => (
                      <label
                        key={idx}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${
                          darkMode
                            ? "hover:bg-gray-800 text-gray-300"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name="resume"
                          value={resume.url}
                          checked={selectedResume === resume.url}
                          onChange={() => setSelectedResume(resume.url)}
                          className="accent-blue-600"
                        />
                        <span className="truncate">{resume.name}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <span
                className={`text-lg font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                ₹{job.compensation.toLocaleString()}
              </span>
              <button
                onClick={handleSubmit}
                disabled={loading}
                aria-label="Apply for this job"
                aria-busy={loading}
                className={`px-5 py-2 flex items-center justify-center gap-2 rounded-lg shadow-md transition text-sm font-medium ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed opacity-75"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white w-full sm:w-auto`}
              >
                {loading && (
                  <FaSpinner className="animate-spin h-4 w-4 text-white" />
                )}
                {loading ? "Applying..." : "Apply Now"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
