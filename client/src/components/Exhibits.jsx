import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';

const Exhibits = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch products', err);
        // Fallback data if API fails or not ready
        setProducts([
          { id: 1, name: 'Traditional Makroudh', price: 15.00, emoji: '🍯', image_url: '/images/media/media6.jpg', description: 'Classic semolina pastry filled with dates and soaked in honey.', est_year: 1850 },
          { id: 2, name: 'Almond Makroudh', price: 18.00, emoji: '🌰', image_url: '/images/media/media7.jpg', description: 'Delicate white makroudh filled with crushed almonds.', est_year: 1920 },
          { id: 3, name: 'Sesame Makroudh', price: 16.50, emoji: '✨', image_url: '/images/media/media8.jpg', description: 'Golden pastry covered in roasted sesame seeds.', est_year: 1900 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section id="exhibits" className="py-24 bg-white relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-24">
          <div className="flex items-center gap-4 mb-3">
             <span className="h-px w-12 bg-current opacity-50"></span>
             <span className="font-medium tracking-widest uppercase text-sm opacity-80">{t('exhibits.subtitle')}</span>
             <span className="h-px w-12 bg-current opacity-50"></span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 inline-flex items-center gap-6">
            <span className="text-3xl">✨</span>
            {t('exhibits.title')}
            <span className="text-3xl">✨</span>
          </h2>
          <div className="w-32 h-px bg-current opacity-30 mt-8"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white card-golden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="h-64 bg-stone-100 flex items-center justify-center overflow-hidden group">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <span className="text-8xl">{product.emoji}</span>
                )}
              </div>
              <div className="p-6">
                <span className="text-xs text-amber-600 font-medium tracking-widest uppercase">{t('exhibits.est')} {product.est_year}</span>
                <h3 className="font-serif text-2xl font-bold text-amber-900 mt-2">{product.name}</h3>
                <p className="text-stone-500 mt-3 leading-relaxed">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-amber-700 font-bold text-lg">${Number(product.price).toFixed(2)}</span>
                  <button 
                    onClick={() => {
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: Number(product.price),
                        image_url: product.image_url,
                        emoji: product.emoji
                      });
                    }}
                    className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-amber-200 transition active:scale-95"
                  >
                    {t('exhibits.addToCart')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Exhibits;
