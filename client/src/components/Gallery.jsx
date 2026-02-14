import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Gallery = () => {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get('/api/gallery');
        // Filter only images for this component
        setImages(res.data.filter(item => item.type === 'image'));
      } catch (err) {
        console.error('Failed to fetch gallery images', err);
      }
    };
    fetchImages();
  }, []);

  return (
    <section id="gallery" className="py-24 relative overflow-hidden bg-amber-50/30">
      <div className="absolute inset-0 opacity-10">
        <div className="pattern-bg h-full w-full"></div>
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
          {/* Decorative glows */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl"></div>

          <div className="flex flex-col items-center mb-16 relative z-10">
            <div className="flex items-center gap-4 mb-3">
               <span className="h-px w-12 bg-amber-900 opacity-30"></span>
               <span className="font-medium tracking-widest uppercase text-sm text-amber-900/80">{t('gallery.subtitle')}</span>
               <span className="h-px w-12 bg-amber-900 opacity-30"></span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 text-amber-950">
              {t('gallery.title')}
            </h2>
            <div className="w-24 h-1 bg-amber-800/20 rounded-full mt-6"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
          {images.length > 0 ? (
            images.map((img, index) => (
              <motion.div 
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${index === 0 ? 'col-span-2 row-span-2 border-4 border-amber-500/20' : ''} rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1`}
              >
                <img src={img.url} alt={img.title || 'Gallery item'} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>
            ))
          ) : (
            // Fallback to original static images if API fails or empty
            <>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-lg border-4 border-amber-500/20"
              >
                <img src="/images/media/media.jpg" alt="Makroudh Preparation" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <img src="/images/media/media2.jpg" alt="Traditional Makroudh" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <img src="/images/media/media3.jpg" alt="Almond Makroudh" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <img src="/images/media/media4.jpg" alt="Sesame Makroudh" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <img src="/images/media/media5.jpg" alt="Makroudh Detail" className="w-full h-full object-cover" />
              </motion.div>
            </>
          )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;