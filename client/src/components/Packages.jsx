import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';

const Packages = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  return (
    <section id="packages" className="py-24 relative overflow-hidden bg-amber-50/30">
      <div className="absolute inset-0 opacity-10">
        <div className="pattern-bg h-full w-full"></div>
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
          {/* Decorative glows */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl"></div>

          <div className="flex flex-col items-center mb-16 relative z-10">
            <div className="flex items-center gap-4 mb-3">
               <span className="h-px w-12 bg-amber-900 opacity-30"></span>
               <span className="font-medium tracking-widest uppercase text-sm text-amber-900/80">{t('packages.subtitle')}</span>
               <span className="h-px w-12 bg-amber-900 opacity-30"></span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 text-amber-950 inline-flex items-center gap-6">
              <span className="text-3xl">🎁</span>
              {t('packages.title')}
              <span className="text-3xl">🎁</span>
            </h2>
            <div className="w-24 h-1 bg-amber-800/20 rounded-full mt-6"></div>
            <p className="text-amber-900/70 mt-8 max-w-2xl mx-auto text-center font-medium">{t('packages.desc')}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {/* Package 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-golden bg-gradient-to-br from-amber-800 to-amber-900 group hover:scale-105 transition-transform duration-300"
            >
              <div className="relative p-8">
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse z-20">
                  🌙 {t('packages.pkg1_badge')}
                </div>
                
                {/* Package Image */}
                <div className="relative h-48 mb-6 rounded-2xl overflow-hidden border-2 border-amber-400/30">
                  <img 
                    src="/images/media/pack1.jpg" 
                    alt={t('packages.pkg1_title')} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-950/60 to-transparent"></div>
                </div>

                <div className="text-center">
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
                <button 
                  onClick={() => addToCart({ 
                    id: 'pkg1', 
                    name: t('packages.pkg1_title'), 
                    price: 69.00, 
                    image_url: '/images/media/pack1.jpg',
                    emoji: '🌙'
                  })}
                  className="w-full mt-6 bg-white text-amber-900 py-3 rounded-full font-bold hover:bg-amber-100 transition active:scale-95"
                >
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
                <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold z-20">
                  ⭐ {t('packages.pkg2_badge')}
                </div>

                {/* Package Image */}
                <div className="relative h-48 mb-6 rounded-2xl overflow-hidden border-2 border-amber-400/30">
                  <img 
                    src="/images/media/pack2.jpg" 
                    alt={t('packages.pkg2_title')} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent"></div>
                </div>

                <div className="text-center">
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
                <button 
                  onClick={() => addToCart({ 
                    id: 'pkg2', 
                    name: t('packages.pkg2_title'), 
                    price: 129.00, 
                    image_url: '/images/media/pack2.jpg',
                    emoji: '⭐'
                  })}
                  className="w-full mt-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-full font-bold hover:from-amber-600 hover:to-amber-700 transition active:scale-95"
                >
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
                <div className="absolute top-4 right-4 bg-rose-400 text-white px-3 py-1 rounded-full text-sm font-bold z-20">
                  💒 {t('packages.pkg3_badge')}
                </div>

                {/* Package Image */}
                <div className="relative h-48 mb-6 rounded-2xl overflow-hidden border-2 border-amber-400/30">
                  <img 
                    src="/images/media/media11.jpg" 
                    alt={t('packages.pkg3_title')} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-950/60 to-transparent"></div>
                </div>

                <div className="text-center">
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
                <button 
                  onClick={() => addToCart({ 
                    id: 'pkg3', 
                    name: t('packages.pkg3_title'), 
                    price: 199.00, 
                    image_url: '/images/media/media11.jpg',
                    emoji: '💒'
                  })}
                  className="w-full mt-6 bg-white text-rose-900 py-3 rounded-full font-bold hover:bg-rose-100 transition active:scale-95"
                >
                  {t('packages.inquireNow')}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Packages;
