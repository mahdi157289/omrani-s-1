import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const Visit = () => {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section id="visit" className="py-24 bg-amber-50/30 relative">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-white card-golden shadow-2xl overflow-hidden"
        >
          <div className="grid md:grid-cols-2">
            <div className="bg-amber-800 p-12 text-white">
              <h3 className="font-serif text-3xl font-bold mb-6">{t('visit.title')}</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">📍</span>
                  <div>
                    <h4 className="font-medium text-lg">{t('visit.loc_title')}</h4>
                    <p className="text-amber-200">{t('visit.loc_text')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-2xl">🕐</span>
                  <div>
                    <h4 className="font-medium text-lg">{t('visit.hours_title')}</h4>
                    <p className="text-amber-200">{t('visit.hours_text')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-2xl">📞</span>
                  <div>
                    <h4 className="font-medium text-lg">{t('visit.contact_title')}</h4>
                    <p className="text-amber-200">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-12">
              <h3 className="font-serif text-2xl font-bold text-amber-900 mb-6">{t('visit.book_title')}</h3>
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 text-green-800 p-6 rounded-xl border border-green-200 text-center h-[280px] flex flex-col items-center justify-center"
                >
                  <span className="text-4xl mb-4">✅</span>
                  <h4 className="text-xl font-bold mb-2">Reservation Received!</h4>
                  <p>We look forward to welcoming you.</p>
                </motion.div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <input required type="text" placeholder={t('visit.name_ph')} className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500 transition-colors" />
                  <input required type="email" placeholder={t('visit.email_ph')} className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500 transition-colors" />
                  <input required type="date" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500 transition-colors" />
                  <button className="w-full bg-amber-800 text-white py-3 rounded-xl font-medium hover:bg-amber-900 transition-colors shadow-lg active:scale-95 transform duration-150">
                    {t('visit.reserve_btn')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Visit;
