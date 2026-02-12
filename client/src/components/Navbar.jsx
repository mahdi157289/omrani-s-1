import { Link } from 'react-router-dom';
import { useState } from 'react';
// import LanternCanvas from './LanternCanvas'; // Optional: Three.js version
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { setIsCartOpen, totalItems } = useCart();

  return (
    <>
      <nav className="navbar fixed z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] navbar-glow backdrop-blur-md bg-amber-900/95 top-4 left-1/2 -translate-x-1/2 w-[95%] md:w-[85%] rounded-full py-2 shadow-[0_10px_40px_rgba(0,0,0,0.3),0_0_60px_rgba(251,191,36,0.2)] border border-amber-400/50 shimmer-gold">
        
        {/* Left Lantern */}
        <div className="absolute left-10 md:left-20 top-full -mt-2 hidden lg:block lantern-container transition-transform duration-300 scale-75 origin-top">
           <div className="lantern">
             <div className="chain">
              <div className="chain-link"></div>
              <div className="chain-link"></div>
            </div>
             <div className="lantern-hook"></div>
             <div className="lantern-top"></div>
             <div className="lantern-body">
               <div className="lantern-pattern"></div>
               <div className="flame"></div>
               <div className="lantern-rays">
                 {[...Array(8)].map((_, i) => <div key={i} className="ray"></div>)}
               </div>
             </div>
             <div className="lantern-bottom"></div>
             <div className="lantern-tip"></div>
             <div className="lantern-tassel"></div>
           </div>
        </div>

        {/* Right Lantern */}
        <div className="absolute right-10 md:right-20 top-full -mt-2 hidden lg:block lantern-container transition-transform duration-300 scale-75 origin-top">
           <div className="lantern">
             <div className="chain">
               <div className="chain-link"></div>
               <div className="chain-link"></div>
             </div>
             <div className="lantern-hook"></div>
             <div className="lantern-top"></div>
             <div className="lantern-body">
               <div className="lantern-pattern"></div>
               <div className="flame"></div>
               <div className="lantern-rays">
                 {[...Array(8)].map((_, i) => <div key={i} className="ray"></div>)}
               </div>
             </div>
             <div className="lantern-bottom"></div>
             <div className="lantern-tip"></div>
             <div className="lantern-tassel"></div>
           </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="particle" style={{ left: `${10 + i * 12}%`, animationDelay: `${i * 0.5}s`, animationDuration: `${3 + i % 3}s` }} />
          ))}
        </div>

        <div className="container mx-auto px-6 py-4 relative">
          <div className="flex items-center justify-between relative">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
              <div className="relative w-28 h-28 overflow-hidden rounded-full border-2 border-amber-500/50 shadow-lg group-hover:scale-110 transition-transform">
                <img src="/images/media/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="font-serif font-bold logo-text transition-all duration-300 text-2xl">{t('navbar.title')}</h1>
                <span className="text-amber-300 text-xs tracking-widest hidden sm:block uppercase">{t('navbar.subtitle')}</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
              <Link to="/#exhibits" className="text-amber-100 font-medium nav-link py-2">{t('navbar.exhibits')}</Link>
              <Link to="/#media" className="text-amber-100 font-medium nav-link py-2">{t('navbar.media')}</Link>
              <Link to="/#packages" className="text-amber-100 font-medium nav-link py-2">{t('navbar.packages')}</Link>
              <Link to="/#heritage" className="text-amber-100 font-medium nav-link py-2">{t('navbar.heritage')}</Link>
              
              <button 
                onClick={() => setIsCartOpen(true)}
                className="text-2xl p-2 hover:bg-amber-700/50 rounded-full transition-all duration-500 relative group opacity-100 scale-100 w-auto"
              >
                🛒
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    {totalItems}
                  </span>
                )}
              </button>
              
              <Link to="/store" className="bg-gradient-to-r from-amber-100 to-amber-200 text-amber-900 px-6 py-2.5 rounded-full font-semibold visit-btn animate-bounce-small border border-amber-400/50 shimmer-gold">
                <span className="flex items-center gap-2">
                  <span>🏮</span> {t('navbar.store')}
                </span>
              </Link>
            </div>


            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-amber-100"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="block w-6 h-0.5 bg-current mb-1"></span>
              <span className="block w-6 h-0.5 bg-current mb-1"></span>
              <span className="block w-6 h-0.5 bg-current"></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-amber-900 text-amber-100 p-4 absolute top-full left-0 right-0 shadow-xl border-t border-amber-800">
             {/* Mobile Lantern */}
            <div className="flex justify-center mb-8 mt-4">
              <div className="lantern scale-75 origin-top">
                <div className="lantern-hook"></div>
                <div className="lantern-top"></div>
                <div className="lantern-body">
                  <div className="flame"></div>
                  <div className="lantern-pattern"></div>
                </div>
                <div className="lantern-bottom"></div>
                <div className="lantern-tip"></div>
              </div>
            </div>

            <Link to="/#exhibits" className="block py-2">{t('navbar.exhibits')}</Link>
            <Link to="/#media" className="block py-2">{t('navbar.media')}</Link>
            <Link to="/#packages" className="block py-2">{t('navbar.packages')}</Link>
            <Link to="/#heritage" className="block py-2">{t('navbar.heritage')}</Link>
          </div>
        )}
      </nav>

      {/* Language Selector - Bottom Center */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
        <LanguageSelector />
      </div>
    </>
  );
};

export default Navbar;
