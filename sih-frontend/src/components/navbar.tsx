import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  FaSun,
  FaMoon,
  FaHome,
  FaTasks,
  FaUserCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaBars,
  FaTimes,
  FaRocket,
} from "react-icons/fa";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "../store/profile";
import { themeState } from "../store/theme";
import { useLogout } from "../services/hooks";

const ReturnName = (name: string) => {
  if (!name) return "";
  const names = name.split(" ");
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
};

function Navigation() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const user = useRecoilValue(userState);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useRecoilState(themeState);
  const [showSignOutPopup, setShowSignOutPopup] = useState(false);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const { mutateAsync: handleLogout } = useLogout();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleSignOut = async () => {
    const data = await handleLogout();
    if (data && data.success) {
      navigate("/login");
    }
  };

  return (
    <nav
      className={`shadow-md transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <FaRocket
              className={`text-2xl mr-2 ${darkMode ? "text-blue-400" : "text-blue-600"
                }`}
            />
            <span
              className={`font-bold text-xl ${darkMode ? "text-white" : "text-gray-800"
                }`}
            >
              Cosmos Careers
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:space-x-6 items-center">
            {/* <button
              onClick={() => navigate("/")}
              className={`flex items-center transition ${darkMode
                ? "text-gray-200 hover:text-blue-400"
                : "text-gray-700 hover:text-blue-600"
                }`}
            >
              <FaHome className="mr-1" />
              {t("Home")}
            </button> */}

          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {user?._id ? <button
              onClick={() => navigate("/applications")}
              className={`
    flex items-center cursor-pointer 
    transition-all duration-200 ease-in-out
    underline underline-offset-2
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    ${darkMode
                  ? "text-gray-200 hover:text-blue-400"
                  : "text-gray-700 hover:text-blue-600"
                }
  `}
            >
              {t("Applications")}
            </button> : null}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 ml -5 rounded-full transition ${darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-100 hover:bg-gray-200"
                }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FaSun className="text-yellow-400 text-lg" />
              ) : (
                <FaMoon className="text-gray-700 text-lg" />
              )}
            </button>

            {/* Language Selector */}
            <div
              className={`hidden md:flex p-1 rounded-lg space-x-1 ${darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
            >
              <button
                onClick={() => changeLanguage("en")}
                className={`px-2 py-1 rounded text-xs ${i18n.language === "en"
                  ? "bg-blue-500 text-white"
                  : darkMode
                    ? "text-gray-300 hover:bg-gray-600"
                    : "text-gray-600 hover:bg-gray-200"
                  }`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage("hi")}
                className={`px-2 py-1 rounded text-xs ${i18n.language === "hi"
                  ? "bg-blue-500 text-white"
                  : darkMode
                    ? "text-gray-300 hover:bg-gray-600"
                    : "text-gray-600 hover:bg-gray-200"
                  }`}
              >
                HI
              </button>
            </div>

            {/* User / Auth */}
            {user?._id ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`flex items-center space-x-2 p-2 rounded-full transition ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                >
                  <div className="relative h-10 w-10">
                    {/* Background Circle */}
                    <svg className="absolute top-0 left-0 h-10 w-10">
                      <circle
                        className="text-gray-300"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="transparent"
                        r="18"
                        cx="20"
                        cy="20"
                      />
                      {/* Progress Circle */}
                      <circle
                        className="text-green-500 transition-all duration-500 ease-out"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="transparent"
                        r="18"
                        cx="20"
                        cy="20"
                        strokeDasharray={2 * Math.PI * 18}
                        strokeDashoffset={2 * Math.PI * 18 * (1 - (user?.profileCompletion || 0) / 100)}
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* Avatar */}
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold absolute top-1 left-1">
                      {ReturnName(user?.name)}
                    </div>
                  </div>

                  {/* Name */}
                  <span className={`hidden md:inline text-sm font-medium uppercase ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                    {user?.name}
                  </span>
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-20 border ${darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                      }`}
                  >
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowDropdown(false);
                      }}
                      className={`flex items-center w-full px-4 py-2 text-sm transition ${darkMode
                        ? "text-gray-200 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      <FaUserCircle className="mr-2" />
                      {t("Profile")}
                    </button>
                    <button
                      onClick={() => setShowSignOutPopup(true)}
                      className={`flex items-center w-full px-4 py-2 text-sm transition ${darkMode
                        ? "text-red-400 hover:bg-gray-700"
                        : "text-red-600 hover:bg-gray-100"
                        }`}
                    >
                      <FaSignOutAlt className="mr-2" />
                      {t("Sign Out")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate("/login")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition"
                >
                  <FaSignInAlt className="mr-1" />
                  {t("Login")}
                </button>
                <button
                  onClick={() => navigate("/signUp")}
                  className={`hidden md:block px-4 py-2 rounded-md text-sm font-medium transition border ${darkMode
                    ? "border-blue-400 text-blue-400 hover:bg-blue-900/20"
                    : "border-blue-600 text-blue-600 hover:bg-blue-50"
                    }`}
                >
                  {t("Sign Up")}
                </button>
              </div>
            )}

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-md transition ${darkMode
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-700 hover:bg-gray-200"
                }`}
            >
              {mobileMenuOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden mt-2 border-t pt-2 ${darkMode ? "border-gray-700" : "border-gray-200"
              }`}
          >
            <button
              onClick={() => {
                navigate("/");
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 transition ${darkMode
                ? "text-gray-200 hover:bg-gray-800"
                : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <FaHome className="inline mr-2" />
              {t("Home")}
            </button>
            <button
              onClick={() => {
                navigate("/applications");
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 transition ${darkMode
                ? "text-gray-200 hover:bg-gray-800"
                : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <FaTasks className="inline mr-2" />
              {t("Applications")}
            </button>
          </div>
        )}
      </div>
      {showSignOutPopup ? (
        <div
          className="fixed inset-0 flex items-center justify-center z-30"
          aria-modal="true"
          role="dialog"
          aria-labelledby="signout-title"
          aria-describedby="signout-desc"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black opacity-50"></div>

          {/* Modal content */}
          <div className={`relative rounded-lg p-6 w-11/12 max-w-sm mx-auto ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
            <h2 id="signout-title" className="text-lg font-semibold mb-4">
              {t("auth.confirmSignOutTitle")}
            </h2>
            <p id="signout-desc" className="mb-6">
              {t("auth.confirmSignOutMessage")}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowSignOutPopup(false)}
                className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {t("auth.cancel")}
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded bg-red-600 text-white"
              >
                {t("auth.confirm")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}

export default Navigation;
