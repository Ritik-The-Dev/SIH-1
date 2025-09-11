import { useState } from "react";
import { FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function FilterSection({ searchQuery, setSearchQuery, filters, setFilters }: any) {
    const [isExpanded, setIsExpanded] = useState(false);

    const filterOptions = {
        type: ["Full-time", "Part-time", "Remote", "Hybrid"],
        duration: ["1 month", "2 months", "3 months", "6 months", "Flexible"],
        stipend: ["Unpaid", "Under ₹5k", "₹5k - ₹10k", "₹10k - ₹20k", "₹20k+"],
        location: ["Remote", "Mumbai", "Bangalore", "Delhi", "Hyderabad"]
    };

    return (
        <> <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
            </div>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search internships by title, company, or skills..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-2.5 bottom-2.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                Search
            </button>
        </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h2>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center text-blue-600 dark:text-blue-400 text-sm"
                    >
                        {isExpanded ? (
                            <>
                                <span>Show Less</span>
                                <FaChevronUp className="ml-1" />
                            </>
                        ) : (
                            <>
                                <span>Show More</span>
                                <FaChevronDown className="ml-1" />
                            </>
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Type</label>
                        <select
                            value={filters.type}
                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="">Any</option>
                            {filterOptions.type.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration</label>
                        <select
                            value={filters.duration}
                            onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="">Any</option>
                            {filterOptions.duration.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stipend</label>
                        <select
                            value={filters.stipend}
                            onChange={(e) => setFilters({ ...filters, stipend: e.target.value })}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="">Any</option>
                            {filterOptions.stipend.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                        <select
                            value={filters.location}
                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="">Any</option>
                            {filterOptions.location.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {["React", "Node.js", "Python", "UI/UX", "Marketing", "Data Analysis"].map(skill => (
                                <button
                                    key={skill}
                                    onClick={() => setFilters({
                                        ...filters,
                                        skills: filters.skills.includes(skill)
                                            ? filters.skills.filter((s: string) => s !== skill)
                                            : [...filters.skills, skill]
                                    })}
                                    className={`px-3 py-1 rounded-full text-sm ${filters.skills.includes(skill)
                                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        }`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};