import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import axios from 'axios';

const CartSidebar = () => {
  const { t } = useTranslation();
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQty, totalItems, totalPrice, clearCart } = useCart();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const orderData = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerAddress: formData.address || 'Pickup/Not provided',
        items: cart,
        total: totalPrice,
        notes: ''
      };

      await axios.post('/api/orders', orderData);
      setOrderSuccess(true);
      setTimeout(() => {
        clearCart();
        setIsCartOpen(false);
        setOrderSuccess(false);
        setIsCheckingOut(false);
        setFormData({ name: '', phone: '', email: '', address: '' });
      }, 3000);
    } catch (err) {
      console.error('Order failed', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!isSubmitting) setIsCartOpen(false);
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-gradient-to-b from-amber-50 to-stone-50 z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-900 to-amber-950 p-6 text-white flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🛒</span>
                <div>
                  <h3 className="font-serif text-xl font-bold">
                    {orderSuccess ? t('cart.orderComplete') || 'Success!' : isCheckingOut ? t('cart.checkout') || 'Checkout' : t('cart.title')}
                  </h3>
                  {!orderSuccess && <p className="text-amber-200 text-sm">{totalItems} {t('cart.items')}</p>}
                </div>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-3xl text-amber-200 hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                &times;
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {orderSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center space-y-4"
                >
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-5xl mb-4">
                    ✅
                  </div>
                  <h4 className="text-2xl font-bold text-amber-900 font-serif">{t('cart.thankYou') || 'Merci!'}</h4>
                  <p className="text-stone-600">
                    {t('cart.orderSuccessMsg') || 'Votre commande a été reçue. Nous vous contacterons bientôt.'}
                  </p>
                </motion.div>
              ) : isCheckingOut ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <button 
                    onClick={() => setIsCheckingOut(false)}
                    className="text-amber-800 font-medium flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
                  >
                    ← {t('cart.backToCart') || 'Retour au panier'}
                  </button>
                  
                  <form onSubmit={handleSubmitOrder} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-amber-900 mb-1">{t('visit.name_ph') || 'Nom'}</label>
                      <input 
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-amber-500 outline-none transition-all"
                        placeholder={t('visit.name_ph')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-amber-900 mb-1">{t('cart.phone') || 'Téléphone'}</label>
                      <input 
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-amber-500 outline-none transition-all"
                        placeholder="Ex: +216 12 345 678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-amber-900 mb-1">{t('visit.email_ph') || 'Email'}</label>
                      <input 
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-amber-500 outline-none transition-all"
                        placeholder={t('visit.email_ph')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-amber-900 mb-1">{t('cart.address') || 'Adresse'}</label>
                      <textarea 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-amber-500 outline-none transition-all h-24"
                        placeholder="Votre adresse de livraison"
                      ></textarea>
                    </div>

                    <div className="pt-4 border-t border-amber-100">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-stone-600">{t('cart.total')}</span>
                        <span className="font-bold text-xl text-amber-900">${totalPrice.toFixed(2)}</span>
                      </div>
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 rounded-xl font-bold text-lg hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span className="animate-spin text-2xl">⏳</span>
                        ) : (
                          <><span>🏮</span> {t('cart.confirmOrder') || 'Confirmer la commande'}</>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-12 opacity-50">
                      <span className="text-6xl block mb-4">🧺</span>
                      <h4 className="font-serif text-xl font-bold text-amber-900">{t('cart.empty_title')}</h4>
                      <p className="text-stone-500 mt-2">{t('cart.empty_text')}</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 border border-amber-100"
                      >
                        <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center text-4xl shrink-0 overflow-hidden">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            item.emoji
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-amber-900 font-serif">{item.name}</h4>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-400 hover:text-red-600 text-sm"
                            >
                              {t('cart.remove')}
                            </button>
                          </div>
                          <p className="text-amber-700 font-semibold text-sm mb-2">${item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => updateQty(item.id, -1)}
                              className="w-7 h-7 rounded-lg border border-amber-400 text-amber-700 flex items-center justify-center hover:bg-amber-50 font-bold transition-colors"
                            >
                              -
                            </button>
                            <span className="font-medium text-amber-900 min-w-[20px] text-center">{item.qty}</span>
                            <button 
                              onClick={() => updateQty(item.id, 1)}
                              className="w-7 h-7 rounded-lg border border-amber-400 text-amber-700 flex items-center justify-center hover:bg-amber-50 font-bold transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && !isCheckingOut && !orderSuccess && (
              <div className="bg-white p-6 border-t border-amber-100 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-stone-600">{t('cart.subtotal')}</span>
                  <span className="font-bold text-lg text-amber-900">${totalPrice.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 rounded-xl font-bold text-lg hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95"
                >
                  <span>🏮</span> {t('cart.placeOrder')}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
