import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaSun,
  FaMoon,
  FaGlobe,
  FaUser,
  FaLock,
  FaRocket,
} from "react-icons/fa";
import AuthAnimation from "../components/authAnimation";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { themeState } from "../store/theme";
import { useLogin } from "../services/hooks";
import GoogleLoginFunction from "../components/loginWithGoogle";

const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

export default function Login() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useRecoilState(themeState);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { mutateAsync: userLogin, isLoading: loading } = useLogin();
  // const toggleDarkMode = () => setDarkMode(!darkMode);
  const changeLanguage = (lang: string) => i18n.changeLanguage(lang);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await userLogin(formData);
      if (data && data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/"
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row transition-colors duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
    >
      {/* Left Section - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        {/* Header */}
        <div className="w-full max-w-sm mb-10">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <FaRocket className="text-blue-500 mr-2 text-xl" />
              <h1 className="sm:text-2xl text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Cosmos Careers
              </h1>
            </div>

            <div className="flex space-x-2">
              {/* Dark Mode Toggle */}
              {/* <button
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
                className={`p-2 rounded-lg transition-colors ${darkMode ? "bg-gray-800" : "bg-gray-100"
                  } hover:scale-110`}
              >
                {darkMode ? (
                  <FaSun className="text-yellow-400" />
                ) : (
                  <FaMoon className="text-black" />
                )}
              </button> */}

              {/* Language Switcher */}
              <div
                className={`flex items-center space-x-1 p-2 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-100"
                  }`}
                aria-label="Language switcher"
              >
                <FaGlobe className="text-gray-500" />
                <button
                  onClick={() => changeLanguage("en")}
                  className={`px-2 py-1 rounded text-xs ${i18n.language === "en"
                    ? "bg-blue-500 text-white"
                    : darkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-200"
                    }`}
                >
                  EN
                </button>
                <button
                  onClick={() => changeLanguage("hi")}
                  className={`px-2 py-1 rounded text-xs ${i18n.language === "hi"
                    ? "bg-blue-500 text-white"
                    : darkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-200"
                    }`}
                >
                  HI
                </button>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-2">{t("loginTitle")}</h2>
          <p className="text-gray-500">{t("welcomeBack")}</p>
        </div>

        {/* Login Form */}
        <form
          className="w-full max-w-sm space-y-4"
          onSubmit={handleSubmit}
          aria-label="Login form"
        >
          {/* Username */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-500"
            >
              {t("enterEmail")}
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                id="email"
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("enterEmail")}
                aria-label="Email"
                className={`w-full p-3 pl-10 rounded-lg border focus:ring-2 focus:ring-blue-500 ${darkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-gray-50 border-gray-200 text-black"
                  }`}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-500"
            >
              {t("password")}
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                aria-label="Password"
                className={`w-full p-3 pl-10 rounded-lg border focus:ring-2 focus:ring-blue-500 ${darkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-gray-50 border-gray-200 text-black"
                  }`}
                required
              />
            </div>
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                aria-label="Remember me"
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>{t("rememberMe")}</span>
            </label>
            <a
              href="#"
              className="text-blue-600 hover:underline"
              aria-label="Forgot password"
            >
              {t("forgotPassword")}
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className={`w-full font-medium py-3 rounded-lg transition-colors flex justify-center items-center ${loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            {loading ? (
              <span className="loader border-2 border-t-2 border-white w-5 h-5 rounded-full animate-spin"></span>
            ) : (
              t("login")
            )}
          </button>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className={`px-2 ${darkMode ? "bg-gray-900 text-gray-400" : "bg-white text-gray-500"
                  }`}
              >
                {t("orContinueWith")}
              </span>
            </div>
          </div>

          {/* Google Login */}
          <GoogleLoginFunction />
        </form>

        <div className="w-full max-w-sm mt-8 text-center text-sm">
          <p>
            {t("noAccount")}{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-600 hover:underline font-medium"
            >
              {t("signUpNow")}
            </span>
          </p>
        </div>
      </div>


      {/* Right Section */}
      <AuthAnimation cn={cn} darkMode={darkMode} t={t} head={"loginTagline"} body={"loginSubtitle"} />
    </div>
  );
}
