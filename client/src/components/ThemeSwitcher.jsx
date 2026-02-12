import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const ThemeSwitcher = () => {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();


  // Find current theme icon
  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  return (
    <div className="fixed right-6 top-[40%] -translate-y-1/2 z-50 flex flex-col items-center gap-4">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 border border-amber-400 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:shadow-[0_0_30px_rgba(251,191,36,0.8)] hover:scale-110 transition-all duration-300 active:scale-95 relative z-50"
        >
          <motion.span
            key={theme}
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
          >
            {currentTheme.icon}
          </motion.span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-30"
              />
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                className="absolute right-20 top-1/2 -translate-y-1/2 bg-gradient-to-br from-amber-900/95 to-amber-950/95 backdrop-blur-xl p-4 rounded-2xl border border-amber-500/30 shadow-2xl min-w-[280px] z-40"
              >
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-amber-500/20 text-amber-100">
                  <span className="text-xl">✨</span>
                  <span className="font-serif font-bold">{t('themes.title')}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {themes.map((themeItem) => (
                    <button
                      key={themeItem.id}
                      onClick={() => setTheme(themeItem.id)}
                      className={`
                        p-3 rounded-xl border transition-all text-left group relative overflow-hidden
                        ${theme === themeItem.id 
                          ? 'border-amber-400 bg-amber-500/20 shadow-[0_0_10px_rgba(251,191,36,0.3)]' 
                          : 'border-transparent hover:bg-white/5 hover:border-white/10'}
                      `}
                    >
                      <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">{themeItem.icon}</span>
                      <span className={`text-xs font-bold ${theme === themeItem.id ? 'text-amber-200' : 'text-stone-400 group-hover:text-amber-100'}`}>
                        {t(`themes.${themeItem.id}`)}
                      </span>
                      {theme === themeItem.id && (
                        <motion.div
                          layoutId="active-dot"
                          className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_10px_#fbbf24]"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <Link to="/store" className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 border border-amber-400 flex items-center justify-center text-white shadow-[0_0_10px_rgba(251,191,36,0.5)] hover:shadow-[0_0_20px_rgba(251,191,36,0.8)] hover:scale-110 transition-transform animate-bounce-small relative group z-40">
        <span className="text-xl">🏮</span>
        <span className="absolute right-full mr-4 bg-amber-950/90 text-amber-100 text-xs py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-amber-500/30 pointer-events-none">
          {t('navbar.store')}
        </span>
      </Link>

      <Link to="/packages" className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-800 to-amber-950 border border-amber-400 flex items-center justify-center text-white shadow-[0_0_10px_rgba(251,191,36,0.5)] hover:shadow-[0_0_20px_rgba(251,191,36,0.8)] hover:scale-110 transition-transform relative group z-40">
        <span className="text-xl">🎁</span>
        <span className="absolute right-full mr-4 bg-amber-950/90 text-amber-100 text-xs py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-amber-500/30 pointer-events-none">
          {t('navbar.packages')}
        </span>
      </Link>
    </div>
  );
};

export default ThemeSwitcher;
