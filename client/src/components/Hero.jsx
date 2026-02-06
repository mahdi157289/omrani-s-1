import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/background image.jpg" 
          alt="Makroudh Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
      </div>
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-96">
            <a href="#exhibits" className="bg-white/90 text-amber-900 px-10 py-4 rounded-full font-medium hover:bg-white transition-all shadow-lg hover:shadow-xl backdrop-blur-sm">
              {t('hero.explore')}
            </a>
            <a href="#heritage" className="bg-amber-900/80 text-white px-10 py-4 rounded-full font-medium hover:bg-amber-900 transition-all backdrop-blur-sm border border-amber-700/50">
              {t('hero.heritage')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
