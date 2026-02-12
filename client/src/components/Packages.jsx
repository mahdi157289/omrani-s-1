import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Packages = () => {
  const { t } = useTranslation();
  return (
    <section id="packages" className="py-24 relative overflow-hidden bg-white">
      <div className="absolute inset-0">
        {/* <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-stone-900"></div> */}
        <div className="pattern-bg h-full w-full opacity-5"></div>
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-24">
          <div className="flex items-center gap-4 mb-3">
             <span className="h-px w-12 bg-current opacity-50"></span>
             <span className="font-medium tracking-widest uppercase text-sm opacity-80">{t('packages.subtitle')}</span>
             <span className="h-px w-12 bg-current opacity-50"></span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 inline-flex items-center gap-6">
            <span className="text-3xl">🎁</span>
            {t('packages.title')}
            <span className="text-3xl">🎁</span>
          </h2>
          <div className="w-32 h-px bg-current opacity-30 mt-8"></div>
          <p className="opacity-80 mt-8 max-w-2xl mx-auto text-center">{t('packages.desc')}</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Package 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-golden bg-gradient-to-br from-amber-800 to-amber-900 group hover:scale-105 transition-transform duration-300"
          >
            <div className="relative p-8">
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                🌙 {t('packages.pkg1_badge')}
              </div>
              <div className="text-center pt-6">
                <span className="text-7xl block mb-4">🎁</span>
                <h3 className="font-serif text-2xl font-bold">{t('packages.pkg1_title')}</h3>
                <p className="text-amber-200 mt-3 text-sm">{t('packages.pkg1_desc')}</p>
              </div>
              <div className="mt-6 space-y-2 text-amber-100 text-sm">
                <div className="flex items-center gap-2"><span>✓</span> {t('packages.pkg1_item1')}</div>
                <div className="flex items-center gap-2"><span>✓</span> {t('packages.pkg1_item2')}</div>
                <div className="flex items-center gap-2"><span>✓</span> {t('packages.pkg1_item3')}</div>
                <div className="flex items-center gap-2"><span>✓</span> {t('packages.pkg1_item4')}</div>
              </div>
              <div className="mt-8 text-center">
                <span className="text-stone-400 line-through text-lg">$89.00</span>
                <span className="text-3xl font-bold text-white ml-2">$69.00</span>
              </div>
              <button className="w-full mt-6 bg-white text-amber-900 py-3 rounded-full font-bold hover:bg-amber-100 transition">
                {t('packages.orderNow')}
              </button>
            </div>
          </motion.div>
          
          {/* Package 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card-golden bg-gradient-to-br from-stone-800 to-stone-900 group hover:scale-105 transition-transform duration-300 border border-amber-500/30"
          >
            <div className="relative p-8">
              <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                ⭐ {t('packages.pkg2_badge')}
              </div>
              <div className="text-center pt-6">
                <span className="text-7xl block mb-4">👑</span>
                <h3 className="font-serif text-2xl font-bold">{t('packages.pkg2_title')}</h3>
                <p className="text-stone-400 mt-3 text-sm">{t('packages.pkg2_desc')}</p>
              </div>
              <div className="mt-6 space-y-2 text-stone-300 text-sm">
                <div className="flex items-center gap-2"><span className="text-amber-400">✓</span> {t('packages.pkg2_item1')}</div>
                <div className="flex items-center gap-2"><span className="text-amber-400">✓</span> {t('packages.pkg2_item2')}</div>
                <div className="flex items-center gap-2"><span className="text-amber-400">✓</span> {t('packages.pkg2_item3')}</div>
                <div className="flex items-center gap-2"><span className="text-amber-400">✓</span> {t('packages.pkg2_item4')}</div>
              </div>
              <div className="mt-8 text-center">
                <span className="text-3xl font-bold text-amber-400">$129.00</span>
              </div>
              <button className="w-full mt-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-full font-bold hover:from-amber-600 hover:to-amber-700 transition">
                {t('packages.orderNow')}
              </button>
            </div>
          </motion.div>
          
          {/* Package 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="card-golden bg-gradient-to-br from-rose-900 to-stone-900 group hover:scale-105 transition-transform duration-300"
          >
            <div className="relative p-8">
              <div className="absolute top-4 right-4 bg-rose-400 text-white px-3 py-1 rounded-full text-sm font-bold">
                💒 {t('packages.pkg3_badge')}
              </div>
              <div className="text-center pt-6">
                <span className="text-7xl block mb-4">💝</span>
                <h3 className="font-serif text-2xl font-bold">{t('packages.pkg3_title')}</h3>
                <p className="text-rose-200 mt-3 text-sm">{t('packages.pkg3_desc')}</p>
              </div>
              <div className="mt-6 space-y-2 text-rose-100 text-sm">
                <div className="flex items-center gap-2"><span>✓</span> {t('packages.pkg3_item1')}</div>
                <div className="flex items-center gap-2"><span>✓</span> {t('packages.pkg3_item2')}</div>
                <div className="flex items-center gap-2"><span>✓</span> {t('packages.pkg3_item3')}</div>
                <div className="flex items-center gap-2"><span>✓</span> {t('packages.pkg3_item4')}</div>
              </div>
              <div className="mt-8 text-center">
                <span className="text-sm text-rose-300">{t('packages.startingFrom')}</span>
                <span className="text-3xl font-bold text-white block">$199.00</span>
              </div>
              <button className="w-full mt-6 bg-white text-rose-900 py-3 rounded-full font-bold hover:bg-rose-100 transition">
                {t('packages.inquireNow')}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Packages;
