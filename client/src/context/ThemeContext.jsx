import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    // Remove all theme classes
    document.body.classList.remove('theme-midnight', 'theme-rose', 'theme-emerald', 'theme-purple', 'theme-desert', 'dark');
    
    // Add selected theme class
    if (theme !== 'default') {
      document.body.classList.add(`theme-${theme}`);
    }
    // Toggle dark mode for specific themes
    if (['midnight', 'purple'].includes(theme)) {
      document.body.classList.add('dark');
    }
  }, [theme]);

  const themes = [
    { id: 'default', name: 'Golden Hour', icon: '🌅' },
    { id: 'midnight', name: 'Midnight', icon: '🌙' },
    { id: 'rose', name: 'Rose Garden', icon: '🌹' },
    { id: 'emerald', name: 'Emerald Oasis', icon: '🌿' },
    { id: 'purple', name: 'Royal Purple', icon: '👑' },
    { id: 'desert', name: 'Desert Sand', icon: '🏜️' },
  ];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
