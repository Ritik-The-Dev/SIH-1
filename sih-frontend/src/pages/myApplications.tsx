import { useState, useEffect } from "react";
import { FaClipboardCheck, FaSpinner } from "react-icons/fa";
import InternshipCard from "../components/cards";
import { useRecoilValue } from "recoil";
import { themeState } from "../store/theme";
import { useTranslation } from "react-i18next";
import { useMyApplications } from "../services/hooks";

export default function MyApplications() {
    const { t } = useTranslation();
    const darkMode = useRecoilValue(themeState);
    const [applications, setApplications] = useState<any[]>([]);

    const { data, isLoading, isFetching } = useMyApplications({
        page: 1,
        limit: 999999,
    });

    // ✅ Handle API response
    useEffect(() => {
        if (!data) return;

        const newApplications = Array.isArray(data?.applications)
            ? data.applications
            : [];

        setApplications(newApplications);
    }, [data]);

    return (
        <main
            className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
                }`}
            aria-label="My Applications Page"
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="text-center mb-8" aria-label="page-header">
                    <h1
                        className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"
                            }`}
                    >
                        {t("myApplications.title", "My Applications")}
                    </h1>
                    <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                        {t(
                            "myApplications.subtitle",
                            "Track internships you have applied to"
                        )}
                    </p>
                </header>

                {/* Applications Grid */}
                {applications.length > 0 && (
                    <section
                        className="grid grid-cols-1 gap-6 mb-8"
                        aria-label="applications-list"
                    >
                        {applications.map((app, index) => {
                            const jobId = app?.job?._id || index;
                            if (applications.length === index + 1) {
                                return (
                                    <div key={jobId}>
                                        <InternshipCard
                                            myApplications={true}
                                            job={app.job}
                                            status={app.status}
                                            appliedAt={app.appliedAt}
                                        />
                                    </div>
                                );
                            }
                            return (
                                <InternshipCard
                                    myApplications={true}
                                    key={jobId}
                                    job={app.job}
                                    status={app.status}
                                    appliedAt={app.appliedAt}
                                />
                            );
                        })}
                    </section>
                )}

                {/* Loader */}
                {(isLoading || isFetching) && (
                    <div className="flex justify-center py-6" aria-label="loading">
                        <FaSpinner className="animate-spin text-blue-600 text-2xl" />
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !isFetching && applications.length === 0 && (
                    <section className="text-center py-12" aria-label="empty-state">
                        <div
                            className={`inline-flex items-center justify-center rounded-full p-4 mb-4 ${darkMode ? "bg-gray-800" : "bg-gray-100"
                                }`}
                        >
                            <FaClipboardCheck
                                className={`text-2xl ${darkMode ? "text-gray-400" : "text-gray-500"
                                    }`}
                                aria-hidden="true"
                            />
                        </div>
                        <h3
                            className={`text-lg font-medium mb-2 ${darkMode ? "text-white" : "text-gray-900"
                                }`}
                        >
                            {t("myApplications.emptyTitle", "No applications yet")}
                        </h3>
                        <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                            {t(
                                "myApplications.emptyDescription",
                                "Your applied internships will appear here"
                            )}
                        </p>
                    </section>
                )}
            </div>
        </main>
    );
}
