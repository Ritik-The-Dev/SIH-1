// src/pages/Signup.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaSun, FaMoon, FaGlobe, FaGoogle, FaUser, FaLock, FaEnvelope, FaRocket, FaSatellite } from "react-icons/fa";

export default function Signup() {
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };
  
  const changeLanguage = (lang: string) => i18n.changeLanguage(lang);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup submitted:", formData);
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${darkMode ? "dark" : ""}`}>
      {/* Left Section - Signup Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 
                      bg-white dark:bg-gray-900 text-gray-900 dark:text-white 
                      transition-colors duration-300">
        
        {/* Header */}
        <div className="w-full max-w-sm mb-10">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <FaRocket className="text-blue-500 mr-2 text-xl" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CosmosCareers
              </h1>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
              </button>
              
              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                <FaGlobe className="text-gray-500 dark:text-gray-400" />
                <button
                  onClick={() => changeLanguage("en")}
                  className={`px-2 py-1 rounded text-xs ${i18n.language === "en" ? "bg-blue-500 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                >
                  EN
                </button>
                <button
                  onClick={() => changeLanguage("hi")}
                  className={`px-2 py-1 rounded text-xs ${i18n.language === "hi" ? "bg-blue-500 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                >
                  HI
                </button>
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold mb-2">{t("Create Account")}</h2>
          <p className="text-gray-500 dark:text-gray-400">{t("joinUsToday")}</p>
        </div>

        {/* Signup Form */}
        <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("fullName")}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("enterFullName")}
                className="w-full p-3 pl-10 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("email")}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("enterEmail")}
                className="w-full p-3 pl-10 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("password")}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full p-3 pl-10 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("confirmPassword")}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="********"
                className="w-full p-3 pl-10 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex items-center text-sm">
            <input 
              id="terms" 
              type="checkbox" 
              className="rounded text-blue-600 focus:ring-blue-500 mr-2" 
              required 
            />
            <label htmlFor="terms" className="text-gray-600 dark:text-gray-400">
              {t("iAgreeTo")} <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">{t("termsAndConditions")}</a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            {t("createAccount")}
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                {t("orContinueWith")}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 py-3 rounded-lg transition-colors"
          >
            <FaGoogle className="text-red-500" />
            <span>{t("signUpWithGoogle")}</span>
          </button>
        </form>

        <div className="w-full max-w-sm mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            {t("alreadyHaveAccount")}{" "}
            <a href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
              {t("signIn")}
            </a>
          </p>
        </div>
      </div>

      {/* Right Section - Space Theme */}
      <div className="w-full md:w-1/2 relative bg-gradient-to-br from-indigo-900 to-purple-900 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-8">
        <div className="text-center z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">{t("Launch Your Career Into Orbit")}</h2>
            <p className="text-indigo-200">{t("Join thousands of students who found their dream internships through us.")}</p>
          </motion.div>
        </div>

        {/* Animated Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ y: "100vh", x: "30%" }}
            animate={{ y: "-100vh", x: "30%" }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 bottom-0"
          >
            <FaRocket className="text-yellow-300 text-3xl" />
          </motion.div>

          <motion.div
            className="absolute top-1/4 left-1/4"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <FaSatellite className="text-pink-300 text-5xl" />
          </motion.div>

          <motion.div
            className="absolute top-1/3 right-1/4"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <FaSatellite className="text-teal-300 text-3xl" />
          </motion.div>

          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-1 bg-white rounded-full absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}