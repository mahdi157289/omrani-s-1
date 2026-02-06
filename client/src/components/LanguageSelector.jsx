import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-1 rtl:space-x-reverse bg-amber-950/30 backdrop-blur-sm rounded-full p-1 border border-amber-500/20">
      <button 
        onClick={() => changeLanguage('en')}  
        className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all ${i18n.language === 'en' ? 'bg-amber-600/80 shadow-lg scale-110' : 'hover:bg-amber-800/50 hover:scale-105 opacity-70 hover:opacity-100'}`}
        title="English"
      >
        🇺🇸
      </button>
      <button 
        onClick={() => changeLanguage('fr')} 
        className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all ${i18n.language === 'fr' ? 'bg-amber-600/80 shadow-lg scale-110' : 'hover:bg-amber-800/50 hover:scale-105 opacity-70 hover:opacity-100'}`}
        title="Français"
      >
        🇫🇷
      </button>
      <button 
        onClick={() => changeLanguage('ar')} 
        className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all ${i18n.language === 'ar' ? 'bg-amber-600/80 shadow-lg scale-110' : 'hover:bg-amber-800/50 hover:scale-105 opacity-70 hover:opacity-100'}`}
        title="العربية"
      >
        🇹🇳
      </button>
    </div>
  );
};

export default LanguageSelector;