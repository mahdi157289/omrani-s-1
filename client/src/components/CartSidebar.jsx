import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';

const CartSidebar = () => {
  const { t } = useTranslation();
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQty, totalItems, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
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
                  <h3 className="font-serif text-xl font-bold">{t('cart.title')}</h3>
                  <p className="text-amber-200 text-sm">{totalItems} {t('cart.items')}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-3xl text-amber-200 hover:text-white transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center text-4xl shrink-0">
                      {item.emoji}
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

            {/* Footer */}
            {cart.length > 0 && (
              <div className="bg-white p-6 border-t border-amber-100 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-stone-600">{t('cart.subtotal')}</span>
                  <span className="font-bold text-lg text-amber-900">${totalPrice.toFixed(2)}</span>
                </div>
                <button className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 rounded-xl font-bold text-lg hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95">
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
