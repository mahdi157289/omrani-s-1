import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Heritage = () => {
  const { t } = useTranslation();
  return (
    <section id="heritage" className="py-24 relative overflow-hidden bg-amber-50/30">
      <div className="absolute inset-0 opacity-10">
        <div className="pattern-bg h-full w-full"></div>
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-3">
               <span className="h-px w-12 bg-current opacity-50"></span>
               <span className="font-medium tracking-widest uppercase text-sm opacity-80">{t('heritage.subtitle')}</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-6 inline-flex items-center gap-4">
              <span className="text-3xl opacity-80">📜</span>
              {t('heritage.title')}
              <span className="text-3xl opacity-80">📜</span>
            </h2>
            <div className="w-24 h-px bg-current opacity-30 mb-10"></div>
            <p className="opacity-90 text-lg leading-relaxed mb-6">
              {t('heritage.p1')}
            </p>
            <p className="opacity-90 text-lg leading-relaxed mb-8">
              {t('heritage.p2')}
            </p>
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-serif font-bold opacity-90">200+</div>
                <div className="opacity-70 text-sm mt-1">{t('heritage.stat1')}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-serif font-bold opacity-90">50+</div>
                <div className="opacity-70 text-sm mt-1">{t('heritage.stat2')}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-serif font-bold opacity-90">7</div>
                <div className="opacity-70 text-sm mt-1">{t('heritage.stat3')}</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="card-golden bg-amber-800 p-8 text-center hover:bg-amber-700 transition-colors duration-300">
                <span className="text-6xl block mb-4">👨‍🍳</span>
                <h4 className="font-serif text-xl font-bold">{t('heritage.card1_title')}</h4>
                <p className="text-amber-200 text-sm mt-2">{t('heritage.card1_text')}</p>
              </div>
              <div className="card-golden bg-amber-800 p-8 text-center mt-8 hover:bg-amber-700 transition-colors duration-300">
                <span className="text-6xl block mb-4">🌿</span>
                <h4 className="font-serif text-xl font-bold">{t('heritage.card2_title')}</h4>
                <p className="text-amber-200 text-sm mt-2">{t('heritage.card2_text')}</p>
              </div>
              <div className="card-golden bg-amber-800 p-8 text-center hover:bg-amber-700 transition-colors duration-300">
                <span className="text-6xl block mb-4">📜</span>
                <h4 className="font-serif text-xl font-bold">{t('heritage.card3_title')}</h4>
                <p className="text-amber-200 text-sm mt-2">{t('heritage.card3_text')}</p>
              </div>
              <div className="card-golden bg-amber-800 p-8 text-center mt-8 hover:bg-amber-700 transition-colors duration-300">
                <span className="text-6xl block mb-4">✨</span>
                <h4 className="font-serif text-xl font-bold">{t('heritage.card4_title')}</h4>
                <p className="text-amber-200 text-sm mt-2">{t('heritage.card4_text')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Heritage;
