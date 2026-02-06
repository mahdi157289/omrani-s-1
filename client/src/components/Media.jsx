import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Media = () => {
  const { t } = useTranslation();
  return (
    <section id="media" className="py-24 relative overflow-hidden bg-amber-50/30">
      <div className="absolute inset-0 opacity-5">
        <div className="pattern-bg h-full w-full"></div>
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-24">
          <div className="flex items-center gap-4 mb-3">
             <span className="h-px w-12 bg-current opacity-50"></span>
             <span className="font-medium tracking-widest uppercase text-sm opacity-80">{t('media.subtitle')}</span>
             <span className="h-px w-12 bg-current opacity-50"></span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 inline-flex items-center gap-6">
            <span className="text-3xl">🎥</span>
            {t('media.title')}
            <span className="text-3xl">🎥</span>
          </h2>
          <div className="w-32 h-px bg-current opacity-30 mt-8"></div>
          <p className="opacity-80 mt-8 max-w-2xl mx-auto text-center">{t('media.description')}</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured Video */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer h-full min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-800 to-amber-950 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="text-center z-10">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-3xl ml-1">▶</span>
                    </div>
                  </div>
                  <h3 className="font-serif text-2xl text-white font-bold">{t('media.video.title')}</h3>
                  <p className="text-amber-200 mt-2">{t('media.video.desc')}</p>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                  12:45
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Video Thumbnails */}
          <div className="space-y-4">
            {[
              { title: t('media.videos.video1.title'), time: "8:30 min", emoji: "🥐", color: "from-rose-300 to-rose-400" },
              { title: t('media.videos.video2.title'), time: "10:15 min", emoji: "🍪", color: "from-purple-300 to-purple-400" },
              { title: t('media.videos.video3.title'), time: "15:00 min", emoji: "🎂", color: "from-amber-300 to-amber-400" }
            ].map((video, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg group cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4 p-4">
                  <div className={`w-28 h-20 bg-gradient-to-br ${video.color} rounded-xl flex items-center justify-center flex-shrink-0 relative`}>
                    <span className="text-4xl">{video.emoji}</span>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                      <span className="text-white text-xl">▶</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-amber-900">{video.title}</h4>
                    <p className="text-stone-500 text-sm mt-1">{video.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Press & Social */}
        <div className="grid md:grid-cols-4 gap-6 mt-12">
          {[
            { icon: "📺", title: t('media.stats.tv.title'), desc: t('media.stats.tv.desc') },
            { icon: "📰", title: t('media.stats.press.title'), desc: t('media.stats.press.desc') },
            { icon: "📸", title: t('media.stats.insta.title'), desc: t('media.stats.insta.desc') },
            { icon: "🏆", title: t('media.stats.awards.title'), desc: t('media.stats.awards.desc') }
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow hover:-translate-y-1 transform duration-300"
            >
              <span className="text-4xl block mb-3">{item.icon}</span>
              <h4 className="font-serif font-bold text-amber-900">{item.title}</h4>
              <p className="text-stone-500 text-sm mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Media;
