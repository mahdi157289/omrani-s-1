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
            className="relative"
          >
            {/* Main Central Image Card - Popping Out Effect */}
            <motion.div 
              whileHover={{ scale: 1.05, rotateY: 5, rotateX: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="card-golden relative z-0 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-amber-600/30 aspect-[4/5] md:aspect-square group cursor-pointer"
            >
              <img 
                src="/images/media/media7.jpg" 
                alt="Our Heritage" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
              
              {/* Glossy overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>

            {/* Corner Cards - Rounded with Image only and Floating Effect */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -left-10 z-10 w-1/3 max-w-[140px]"
            >
              <div className="card-golden bg-amber-800 p-0 shadow-2xl scale-90 md:scale-100 origin-bottom-right overflow-hidden rounded-[2rem] border-4 border-amber-600/30">
                <img src="/images/media/media9.jpg" alt="Artisan" className="w-full h-32 md:h-40 object-cover hover:scale-110 transition-transform duration-500" />
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -top-10 -right-10 z-10 w-1/3 max-w-[140px]"
            >
              <div className="card-golden bg-amber-800 p-0 shadow-2xl scale-90 md:scale-100 origin-bottom-left overflow-hidden rounded-[2rem] border-4 border-amber-600/30">
                <img src="/images/media/media8.jpg" alt="Ingredients" className="w-full h-32 md:h-40 object-cover hover:scale-110 transition-transform duration-500" />
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              className="absolute -bottom-10 -left-10 z-10 w-1/3 max-w-[140px]"
            >
              <div className="card-golden bg-amber-800 p-0 shadow-2xl scale-90 md:scale-100 origin-top-right overflow-hidden rounded-[2rem] border-4 border-amber-600/30">
                <img src="/images/media/media5.jpg" alt="Recipe" className="w-full h-32 md:h-40 object-cover hover:scale-110 transition-transform duration-500" />
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="absolute -bottom-10 -right-10 z-10 w-1/3 max-w-[140px]"
            >
              <div className="card-golden bg-amber-800 p-0 shadow-2xl scale-90 md:scale-100 origin-top-left overflow-hidden rounded-[2rem] border-4 border-amber-600/30">
                <img src="/images/media/media3.jpg" alt="Handcrafted" className="w-full h-32 md:h-40 object-cover hover:scale-110 transition-transform duration-500" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Heritage;
