import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaHome, FaTasks, FaHeart, FaUserCircle, FaCog, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaBars, FaTimes, FaRocket } from 'react-icons/fa';

function Navigation() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode based on system preference or saved preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDarkMode = savedDarkMode !== null ? savedDarkMode : systemPrefersDark;
    
    setDarkMode(initialDarkMode);
    document.documentElement.classList.toggle('dark', initialDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
    setShowDropdown(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and project name */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <FaRocket className="text-2xl text-blue-600 dark:text-blue-400 mr-2" />
              <span className="font-bold text-xl text-gray-800 dark:text-white">ProjectHub</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              <button onClick={() => navigate('/')} className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
                <FaHome className="mr-1" />
                {t('Home')}
              </button>
              <button onClick={() => navigate('/applications')} className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
                <FaTasks className="mr-1" />
                My Applications
              </button>
              <button onClick={() => navigate('/favourites')} className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
                <FaHeart className="mr-1" />
                Favourites
              </button>
            </div>
          </div>

          {/* Right side - Auth and language options */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FaSun className="text-yellow-400 text-lg" />
              ) : (
                <FaMoon className="text-gray-700 text-lg" />
              )}
            </button>

            {/* Language selector */}
            <div className="hidden md:flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button 
                onClick={() => changeLanguage('en')} 
                className={`px-2 py-1 rounded text-xs ${i18n.language === 'en' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              >
                EN
              </button>
              <button 
                onClick={() => changeLanguage('hn')} 
                className={`px-2 py-1 rounded text-xs ${i18n.language === 'hn' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              >
                HN
              </button>
            </div>

            {/* Auth section */}
            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    JS
                  </div>
                  <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-200">John Smith</span>
                  <svg className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${showDropdown ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                {/* Dropdown menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-600">
                    <button onClick={() => { navigate('/profile'); setShowDropdown(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <FaUserCircle className="inline mr-2" />
                      Profile
                    </button>
                    <button onClick={() => { navigate('/settings'); setShowDropdown(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <FaCog className="inline mr-2" />
                      Settings
                    </button>
                    <button 
                      onClick={toggleLogin}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <FaSignOutAlt className="inline mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                >
                  <FaSignInAlt className="mr-1" />
                  Login
                </button>
                <button onClick={() => navigate('/signUp')} className="hidden md:block border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
            >
              {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-2">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button onClick={() => { navigate('/'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <FaHome className="inline mr-2" />
                {t('Home')}
              </button>
              <button onClick={() => { navigate('/applications'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <FaTasks className="inline mr-2" />
                My Applications
              </button>
              <button onClick={() => { navigate('/favourites'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <FaHeart className="inline mr-2" />
                Favourites
              </button>
            </div>
            
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-5 space-x-3 mb-3">
                <button 
                  onClick={() => changeLanguage('en')} 
                  className={`px-3 py-1 rounded text-sm ${i18n.language === 'en' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => changeLanguage('hn')} 
                  className={`px-3 py-1 rounded text-sm ${i18n.language === 'hn' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                  हिंदी
                </button>
              </div>
              
              {!isLoggedIn && (
                <div className="px-2 space-y-2">
                  <button 
                    onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <FaSignInAlt className="inline mr-2" />
                    Login
                  </button>
                  <button 
                    onClick={() => { navigate('/signUp'); setMobileMenuOpen(false); }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <FaUserPlus className="inline mr-2" />
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;