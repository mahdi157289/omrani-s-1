import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="site-footer bg-amber-950 text-amber-100 py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-amber-500/30">
                <img src="/images/media/logo.jpg" alt="Makroudh Omrani Logo" className="w-full h-full object-cover" />
              </div>
              <h2 className="font-serif text-3xl font-bold">{t('footer.title')}</h2>
            </div>
            <p className="text-amber-300 max-w-md">
              {t('footer.description')}
            </p>
          </div>
          <div>
            <h4 className="font-serif font-bold text-lg mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-amber-300">
              <li><a href="#exhibits" className="hover:text-white transition">{t('navbar.exhibits')}</a></li>
              <li><a href="#media" className="hover:text-white transition">{t('navbar.media')}</a></li>
              <li><a href="#packages" className="hover:text-white transition">{t('navbar.packages')}</a></li>
              <li><a href="#heritage" className="hover:text-white transition">{t('navbar.heritage')}</a></li>
              <li><a href="#visit" className="hover:text-white transition">{t('navbar.visit')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif font-bold text-lg mb-4">{t('footer.followUs')}</h4>
            <div className="flex space-x-4 rtl:space-x-reverse text-2xl">
              <a href="#" className="hover:scale-110 transition">📸</a>
              <a href="#" className="hover:scale-110 transition">📘</a>
              <a href="#" className="hover:scale-110 transition">🐦</a>
            </div>
            
            {/* Admin Access */}
            <div className="mt-6 pt-4 border-t border-amber-800/50">
              <Link to="/admin" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-200 transition group">
                <span className="text-lg">🔐</span>
                <span className="text-sm font-medium">{t('footer.adminPanel')}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-amber-800 mt-12 pt-8 text-center text-amber-400">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
