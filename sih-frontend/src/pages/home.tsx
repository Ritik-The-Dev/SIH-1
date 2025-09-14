import { useState, useEffect, useRef, useCallback } from "react";
import { FaFilter, FaSpinner } from "react-icons/fa";
import FilterSection from "../components/filters";
import InternshipCard from "../components/cards";
import { useRecoilValue } from "recoil";
import { themeState } from "../store/theme";
import { useTranslation } from "react-i18next";
import { useRecommendJobs } from "../services/hooks";
import { userState } from "../store/profile";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const { t } = useTranslation();
    const darkMode = useRecoilValue(themeState);
    const navigate = useNavigate();
    // ✅ State
    const user = useRecoilValue(userState)
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({ location: "", sector: "" });
    const [page, setPage] = useState(1);
    const [curated, setCurated] = useState<any[]>([]); // top 5
    const [trending, setTrending] = useState<any[]>([]); // batches of 20
    const [hasMore, setHasMore] = useState(true);

    // ✅ Fetch jobs
    const { data, isLoading, isFetching, refetch } = useRecommendJobs({
        ...filters,
        page,
        limit: page === 1 ? 5 : 20, // 5 for curated, 20 for trending batches
        search: searchQuery,
    });

    // ✅ Handle API response
    useEffect(() => {
        if (!data?.jobs) return;

        if (page === 1) {
            setCurated(data.jobs); // first 5 curated
            setTrending([]); // reset trending
        } else {
            setTrending((prev) => [...prev, ...data.jobs]); // load trending
        }

        setHasMore(data.jobs.length > 0 && (curated.length + trending.length) < data.total);
    }, [data]);

    // ✅ Reset when filters/search changes
    useEffect(() => {
        setPage(1);
        setCurated([]);
        setTrending([]);
        refetch();
    }, [filters, searchQuery]);

    // ✅ Infinite Scroll for trending
    const observer = useRef<IntersectionObserver | null>(null);
    const lastTrendingRef = useCallback(
        (node: any) => {
            if (isFetching) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [isFetching, hasMore]
    );

    // ✅ Handle API response
    useEffect(() => {
        if (!data?.jobs) return;

        if (page === 1) {
            setCurated(data.jobs); // first 5 curated
            setTrending([]); // reset trending

            // 👉 Automatically trigger trending load after curated
            if (data.jobs.length > 0) {
                setPage(2);
            }
        } else {
            setTrending((prev) => [...prev, ...data.jobs]); // load trending
        }

        setHasMore(
            data.jobs.length > 0 &&
            curated.length + trending.length < data.total
        );
    }, [data]);


    return (
        <div
            className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
                }`}
        >
            <div className="max-w-7xl mx-auto">

                {user?._id && user?.profileCompletion <= 20 && (
                    <div
                        className={`relative rounded-lg px-5 py-3 my-5 mb-10 flex items-center justify-between shadow-md transition
      ${darkMode ? "bg-gray-800 text-gray-200" : "bg-purple-50 text-gray-900"}`}
                    >
                        {/* Left: Warning + Percentage */}
                        <div className="flex items-center gap-3">
                            <span className="text-red-500 text-2xl">⚠️</span>
                            <p className="text-sm sm:text-base font-medium">
                                {t("home.completion", { count: user?.profileCompletion })}
                            </p>
                        </div>

                        {/* Right: Button */}
                        <button
                            onClick={() => navigate("/profile")}
                            className={`ml-4 px-5 py-2 rounded-lg font-semibold text-sm sm:text-base transition
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
                        className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"
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
                {curated.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-xl font-semibold mb-4">
                            🎯 {t("home.curatedTitle")}
                        </h2>
                        <div className="grid grid-cols-1 gap-6">
                            {curated.map((job) => (
                                <InternshipCard key={job._id} job={job} isFeatured />
                            ))}
                        </div>
                    </div>
                )}

                {/* Trending Internships */}
                {trending.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">
                            🚀 {t("home.trendingTitle")}
                        </h2>
                        <div
                            className="grid grid-cols-1  gap-6"
                            aria-label="trending-list"
                        >
                            {trending.map((job, index) => {
                                if (trending.length === index + 1) {
                                    return (
                                        <div ref={lastTrendingRef} key={job._id}>
                                            <InternshipCard job={job} />
                                        </div>
                                    );
                                }
                                return <InternshipCard key={job._id} job={job} />;
                            })}
                        </div>
                    </div>
                )}

                {/* Loader */}
                {(isLoading || isFetching) && (
                    <div className="flex justify-center py-6">
                        <FaSpinner className="animate-spin text-blue-600 text-2xl" />
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !isFetching && curated.length === 0 && trending.length === 0 && (
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
