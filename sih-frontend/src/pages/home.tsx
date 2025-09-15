import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSection from "../components/filters";
import InternshipCard from "../components/cards";
import { useRecoilValue } from "recoil";
import { themeState } from "../store/theme";
import { useTranslation } from "react-i18next";
import { useRecommendJobs } from "../services/hooks";
import { userState } from "../store/profile";
import { useNavigate } from "react-router-dom";
import FancyLoader from "../components/Loader";

export default function Home() {
    const { t } = useTranslation();
    const darkMode = useRecoilValue(themeState);
    const navigate = useNavigate();
    // ✅ State
    const user = useRecoilValue(userState)
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({ location: "", sector: "" });

    // ✅ Fetch jobs
    const { data, isLoading, isFetching } = useRecommendJobs({
        ...filters,
        search: searchQuery,
    });

    return (
        <div
            className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
                }`}
        >
            <div className="max-w-7xl mx-auto">

                {user?._id && user?.profileCompletion <= 20 && (
                    <div
                        className={`relative rounded-lg px-4 sm:px-5 py-3 my-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 shadow-md transition
      ${darkMode ? "bg-gray-800 text-gray-200" : "bg-purple-50 text-gray-900"}`}
                    >
                        {/* Left: Warning + Percentage */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-red-500 text-xl sm:text-2xl">⚠️</span>
                            <p className="text-sm sm:text-base font-medium">
                                {t("home.completion", { count: user?.profileCompletion })}
                            </p>
                        </div>

                        {/* Right: Button */}
                        <button
                            onClick={() => navigate("/profile")}
                            className={`w-full sm:w-auto mt-2 sm:mt-0 px-4 sm:px-5 py-2 rounded-lg font-semibold text-sm sm:text-base transition
        ${darkMode
                                    ? "bg-green-500 text-gray-900 hover:bg-green-400"
                                    : "bg-green-400 text-black hover:bg-green-500"}`}
                        >
                            {t("home.completeBtn")}
                        </button>
                    </div>
                )}




                {/* Header */}
                <div className="text-center mb-8">
                    <h1
                        className={`sm:text-3xl text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"
                            }`}
                    >
                        {t(user?._id ? "home.title" : "home.trending")}
                    </h1>
                    <p
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
                    >
                        {t(user?._id ? "home.subtitle" : "home.filtertitle")}
                    </p>
                </div>

                {/* Filters */}
                <FilterSection
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filters={filters}
                    setFilters={setFilters}
                />

                {/* Curated Internships */}
                {data?.jobs?.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-xl font-semibold mb-4">
                            🎯 {t("home.curatedTitle")}
                        </h2>
                        <div className="grid grid-cols-1 gap-6">
                            {data?.jobs?.map((job:any) => (
                                <InternshipCard key={job._id} job={job} isFeatured />
                            ))}
                        </div>
                    </div>
                )}

                <FancyLoader isLoading={isLoading || isFetching} />

                {!isLoading && !isFetching && data?.jobs?.length === 0 && (
                    <div className="text-center py-12">
                        <div
                            className={`inline-flex items-center justify-center rounded-full p-4 mb-4 ${darkMode ? "bg-gray-800" : "bg-gray-100"
                                }`}
                        >
                            <FaFilter
                                className={`text-2xl ${darkMode ? "text-gray-400" : "text-gray-500"
                                    }`}
                            />
                        </div>
                        <h3
                            className={`text-lg font-medium mb-2 ${darkMode ? "text-white" : "text-gray-900"
                                }`}
                        >
                            {t("home.noResults.title")}
                        </h3>
                        <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                            {t("home.noResults.description")}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
