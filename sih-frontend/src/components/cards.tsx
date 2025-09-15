import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaCalendarAlt,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import { themeState } from "../store/theme";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import JobPopup from "./JobPopup";

export default function InternshipCard({ job, status, myApplications }: any) {
  const darkMode = useRecoilValue(themeState);
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Card */}
      <div
        className={`rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md border
        ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <div >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between w-full gap-2 sm:gap-4">
                <h3
                  className={`font-semibold text-lg sm:text-xl flex-shrink-0 ${darkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                  {job.role}
                </h3>
                <p
                  className={`text-sm font-medium px-2 py-1 rounded-full inline-block
    ${darkMode
                      ? "bg-gray-700 text-gray-200" // Dark mode: slightly darker badge
                      : "bg-gray-100 text-gray-800" // Light mode: subtle badge
                    }`}
                >
                  {job.recommendationReason}
                </p>


              </div>
              <p
                className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
              >
                {job.companyName}
              </p>
            </div>

            {/* Toggle + / - */}
            <button
              onClick={() => setShowDetails((prev) => !prev)}
              aria-label={t("home.toggleDetails")}
              className={`p-1 rounded-md transition ${darkMode
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {showDetails ? <FaMinus size={14} /> : <FaPlus size={14} />}
            </button>
          </div>

          {/* Compact Info */}
          <div className="flex flex-wrap gap-3 text-sm mb-3">
            <div
              className={`flex items-center ${darkMode ? "text-gray-400" : "text-gray-500"
                }`}
            >
              <FaMapMarkerAlt className="mr-1" />
              {job.location.city}, {job.location.state}
            </div>
            <div
              className={`flex items-center ${darkMode ? "text-gray-400" : "text-gray-500"
                }`}
            >
              <FaBriefcase className="mr-1" />
              {job.employmentType} • {job.modeOfWork}
            </div>
            <div
              className={`flex items-center ${darkMode ? "text-gray-400" : "text-gray-500"
                }`}
            >
              <FaCalendarAlt className="mr-1" />
              {new Date(job.dateOfPosting).toLocaleDateString()}
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-3">
            {job.skillsRequired?.slice(0, 3).map((skill: string, i: number) => (
              <span
                key={i}
                className={`px-2 py-0.5 text-xs rounded-full ${darkMode
                  ? "bg-blue-900/30 text-blue-300"
                  : "bg-blue-100 text-blue-700"
                  }`}
              >
                {skill}
              </span>
            ))}
            {job.skillsRequired?.length > 3 && (
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-200 text-gray-700"
                  }`}
              >
                +{job.skillsRequired.length - 3} {t("home.more")}
              </span>
            )}
          </div>

          {/* Expandable Section */}
          {showDetails && (
            <div
              className={`mb-3 text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              <p className="mb-1">
                <strong>{t("home.description")}:</strong> {job.jobDescription}
              </p>
              <p className="mb-1">
                <strong>{t("home.education")}:</strong>{" "}
                {job.educationRequirement}
              </p>
              <p className="mb-1">
                <strong>{t("home.positions")}:</strong> {job.totalPositions}
              </p>
              <p className="mb-1">
                <strong>{t("home.sector")}:</strong> {job.sector}
              </p>
            </div>
          )}

          {/* Footer */}
          {myApplications ? (
            <div className="flex flex-col gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              {/* Salary */}
              <span
                className={`font-bold text-base ${darkMode ? "text-white" : "text-gray-900"
                  }`}
              >
                ₹{job.compensation.toLocaleString()}
              </span>

              {/* Status Tracker */}
              <div
                className="flex items-center justify-between"
                aria-label="application-status-tracker"
              >
                {["Applied", "Under Review", "Shortlisted", "Accepted"].map((step, idx) => {
                  const currentIndex = ["Applied", "Under Review", "Shortlisted", "Accepted"].indexOf(status);
                  const stepCompleted = idx < currentIndex;
                  const stepActive = idx === currentIndex;
                  const isRejected = status === "Rejected" && step === "Rejected";

                  // 🎨 Theme-aware colors
                  const getStepColor = () => {
                    if (isRejected) {
                      return darkMode
                        ? "bg-red-700 border-red-500 text-white"
                        : "bg-red-200 border-red-400 text-red-900";
                    }
                    if (stepActive) {
                      return darkMode
                        ? "bg-blue-700 border-blue-500 text-white"
                        : "bg-blue-200 border-blue-400 text-blue-900";
                    }
                    if (stepCompleted) {
                      return darkMode
                        ? "bg-green-700 border-green-500 text-white"
                        : "bg-green-200 border-green-400 text-green-900";
                    }
                    return darkMode
                      ? "bg-gray-700 border-gray-500 text-gray-300"
                      : "bg-gray-200 border-gray-400 text-gray-600";
                  };

                  const getLineColor = () => {
                    if (stepCompleted) {
                      return darkMode ? "bg-green-500" : "bg-green-400";
                    }
                    return darkMode ? "bg-gray-600" : "bg-gray-300";
                  };

                  return (
                    <div key={step} className="flex-1 flex flex-col items-center relative">
                      {/* Dot */}
                      <div
                        className={`w-8 h-8 z-10 flex items-center justify-center rounded-full border-2 text-xs font-bold ${getStepColor()}`}
                      >
                        {idx + 1}
                      </div>

                      {/* Label */}
                      <span
                        className={`mt-2 text-xs ${stepCompleted || stepActive
                          ? darkMode
                            ? "text-white"
                            : "text-gray-900"
                          : darkMode
                            ? "text-gray-400"
                            : "text-gray-500"
                          }`}
                      >
                        {step}
                      </span>

                      {/* Connector line */}
                      {idx < 3 && (
                        <div
                          className={`absolute top-4 left-1/2 w-full h-0.5 -translate-y-1/2 ${getLineColor()}`}
                        />
                      )}
                    </div>
                  );
                })}

                {/* Rejected case */}
                {status === "Rejected" && (
                  <div className="flex flex-col items-center ml-4">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full border-2 font-bold text-xs bg-red-600 text-white">
                      ✕
                    </div>
                    <span className="mt-2 text-xs text-red-600 dark:text-red-400 font-semibold">
                      Rejected
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
              <span
                className={`font-bold text-base ${darkMode ? "text-white" : "text-gray-900"
                  }`}
              >
                ₹{job.compensation.toLocaleString()}
              </span>
              <button
                onClick={() => setShowModal(true)}
                aria-label={t("home.applyNowButton")}
                className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                {t("home.applyNowButton")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <JobPopup isOpen={showModal} onClose={() => setShowModal(false)} job={job} />
      )}
    </>
  );
}
