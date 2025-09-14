import { FaSearch } from "react-icons/fa";
import { themeState } from "../store/theme";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

export default function FilterSection({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
}: any) {
  const { t } = useTranslation();
  const darkMode = useRecoilValue(themeState);

  const sectorOptions = [
    "IT",
    "Finance",
    "Marketing",
    "Sales",
    "Healthcare",
    "Education",
    "Design",
    "Engineering",
  ];

  return (
    <>
      {/* 🔎 Search Bar */}
       <div
      className={`w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-6`}
    >
      {/* Left Section - Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-1/2">
        {/* 🌍 Location */}
        <div className="flex flex-col">
          <label
            htmlFor="location"
            className={`text-sm font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t("home.locationLabel")}
          </label>
          <select
            id="location"
            aria-label="Filter by location"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
              ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
          >
            <option value="">Any</option>
            {["Remote", "Delhi", "Mumbai", "Bangalore", "Hyderabad"].map(
              (loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              )
            )}
          </select>
        </div>

        {/* 🏢 Sector */}
        <div className="flex flex-col">
          <label
            htmlFor="sector"
            className={`text-sm font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t("home.sectorLabel")}
          </label>
          <select
            id="sector"
            aria-label="Filter by sector"
            value={filters.sector}
            onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
              ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
          >
            <option value="">Any</option>
            {sectorOptions.map((sector: string) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Section - Search */}
      <div className="relative w-full md:w-1/2">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          aria-label="Search internships"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search internships by role, company, or skills..."
          className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
            ${
              darkMode
                ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400"
                : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
            }`}
        />
      </div>
    </div>
    </>
  );
}
