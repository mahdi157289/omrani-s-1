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
    <section id="gallery" className="py-24 bg-white relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-24">
          <div className="flex items-center gap-4 mb-3">
             <span className="h-px w-12 bg-current opacity-50"></span>
             <span className="font-medium tracking-widest uppercase text-sm opacity-80">{t('gallery.subtitle')}</span>
             <span className="h-px w-12 bg-current opacity-50"></span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 relative inline-block">
            {t('gallery.title')}
          </h2>
          <div className="w-32 h-px bg-current opacity-30 mt-8"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
    </section>
  );
};

export default Gallery;