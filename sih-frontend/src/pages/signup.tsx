import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaGlobe,
  FaUser,
  FaLock,
  FaEnvelope,
  FaRocket
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AuthAnimation from "../components/authAnimation";
import { useRecoilValue } from "recoil";
import { themeState } from "../store/theme";
import { useSignUp } from "../services/hooks";
import toast from "react-hot-toast";
import GoogleLoginFunction from "../components/loginWithGoogle";

// small helper to join classes
const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

export default function Signup() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const darkMode = useRecoilValue(themeState);
  const { mutateAsync: signUp, isLoading: loading } = useSignUp();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // const toggleDarkMode = () => setDarkMode(!darkMode);
  const changeLanguage = (lang: string) => i18n.changeLanguage(lang);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      const data = await signUp(formData);
      if (data?.success) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col md:flex-row transition-colors duration-500",
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      )}
    >
      {/* Left Section */}
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
                className={cn(
                  "p-2 rounded-lg hover:scale-110 transition-transform",
                  darkMode ? "bg-gray-800 text-yellow-400" : "bg-gray-100 text-black"
                )}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button> */}

              {/* Language Switcher */}
              <div
                className={cn(
                  "flex items-center space-x-1 p-2 rounded-lg",
                  darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
                )}
                aria-label="Language switcher"
              >
                <FaGlobe />
                <button
                  onClick={() => changeLanguage("en")}
                  className={cn(
                    "px-2 py-1 rounded text-xs",
                    i18n.language === "en"
                      ? "bg-blue-500 text-white"
                      : darkMode
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-200"
                  )}
                >
                  EN
                </button>
                <button
                  onClick={() => changeLanguage("hi")}
                  className={cn(
                    "px-2 py-1 rounded text-xs",
                    i18n.language === "hi"
                      ? "bg-blue-500 text-white"
                      : darkMode
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-200"
                  )}
                >
                  HI
                </button>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-2">{t("createAccount")}</h2>
          <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
            {t("joinUsToday")}
          </p>
        </div>

        {/* Signup Form */}
        <form
          className="w-full max-w-sm space-y-4"
          onSubmit={handleSubmit}
          aria-label="Signup form"
        >
          {/* Name */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className={cn(
                "text-sm font-medium",
                darkMode ? "text-gray-400" : "text-gray-500"
              )}
            >
              {t("fullName")}
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("enterFullName")}
                className={cn(
                  "w-full p-3 pl-10 rounded-lg border focus:ring-2 focus:ring-blue-500",
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
                )}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className={cn(
                "text-sm font-medium",
                darkMode ? "text-gray-400" : "text-gray-500"
              )}
            >
              {t("email")}
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("enterEmail")}
                className={cn(
                  "w-full p-3 pl-10 rounded-lg border focus:ring-2 focus:ring-blue-500",
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
                )}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className={cn(
                "text-sm font-medium",
                darkMode ? "text-gray-400" : "text-gray-500"
              )}
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
                className={cn(
                  "w-full p-3 pl-10 rounded-lg border focus:ring-2 focus:ring-blue-500",
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
                )}
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className={cn(
                "text-sm font-medium",
                darkMode ? "text-gray-400" : "text-gray-500"
              )}
            >
              {t("confirmPassword")}
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="********"
                className={cn(
                  "w-full p-3 pl-10 rounded-lg border focus:ring-2 focus:ring-blue-500",
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
                )}
                required
              />
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center text-sm">
            <input
              id="terms"
              type="checkbox"
              className="rounded text-blue-600 focus:ring-blue-500 mr-2"
              required
            />
            <label
              htmlFor="terms"
              className={darkMode ? "text-gray-400" : "text-gray-600"}
            >
              {t("iAgreeTo")}{" "}
              <a
                href="#"
                className={darkMode ? "text-blue-400" : "text-blue-600"}
              >
                {t("termsAndConditions")}
              </a>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full font-medium py-3 rounded-lg transition-colors flex justify-center items-center",
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            {loading ? (
              <span className="loader border-2 border-t-2 border-white w-5 h-5 rounded-full animate-spin"></span>
            ) : (
              t("createAccount")
            )}
          </button>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div
                className={cn(
                  "w-full border-t",
                  darkMode ? "border-gray-700" : "border-gray-300"
                )}
              />
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className={cn(
                  "px-2",
                  darkMode
                    ? "bg-gray-900 text-gray-400"
                    : "bg-white text-gray-500"
                )}
              >
                {t("orContinueWith")}
              </span>
            </div>
          </div>

          {/* Google Button */}
          {/* <button
            type="button"
            className={cn(
              "w-full flex items-center justify-center space-x-2 py-3 rounded-lg border transition-colors",
              darkMode
                ? "bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
                : "bg-white border-gray-300 hover:bg-gray-100 text-gray-900"
            )}
          >
            <FaGoogle className="text-red-500" />
            <span>{t("signUpWithGoogle")}</span>
          </button> */
          }
        <GoogleLoginFunction />
        </form>

        <div
          className={cn(
            "w-full max-w-sm mt-8 text-center text-sm",
            darkMode ? "text-gray-400" : "text-gray-500"
          )}
        >
          <p>
            {t("alreadyHaveAccount")}{" "}
            <span
              onClick={() => (navigate("/login"))}
              className={darkMode ? "text-blue-400" : "text-blue-600"}
            >
              {t("signIn")}
            </span>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <AuthAnimation cn={cn} darkMode={darkMode} t={t} head={"launchYourCareer"} body={"joinThousands"} />
    </div>
  );
}
