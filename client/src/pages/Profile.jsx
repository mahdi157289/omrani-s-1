import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('orders');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const [credentials, setCredentials] = useState({ currentPassword: '', newPassword: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, offersRes] = await Promise.all([
          axios.get('/api/profile'),
          axios.get('/api/offers')
        ]);
        setProfileData(profileRes.data);
        setOffers(offersRes.data);
      } catch (err) {
        console.error('Error fetching profile data', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/profile/credentials', credentials);
      setMsg({ type: 'success', text: 'Password updated successfully!' });
      setCredentials({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Update failed' });
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      setProfileData(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => n.id === id ? { ...n, is_read: true } : n)
      }));
    } catch (err) {
      console.error('Error marking notification as read', err);
    }
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 dark:bg-slate-900">
      <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-serif mb-4 text-amber-900 dark:text-amber-100">Please Log In</h2>
        <p className="mb-6 text-slate-600 dark:text-slate-400">You need to be logged in to view your profile.</p>
        <button onClick={() => window.location.href = '/'} className="px-6 py-2 bg-amber-600 text-white rounded-full">Back to Home</button>
      </div>
    </div>
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-slate-900 transition-colors duration-500">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-amber-100 dark:border-amber-900/30">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full mx-auto flex items-center justify-center text-4xl mb-4">
                  👤
                </div>
                <h2 className="text-xl font-serif font-bold text-amber-900 dark:text-amber-100">{profileData?.customer?.name}</h2>
                <p className="text-sm text-slate-500">{profileData?.customer?.email}</p>
              </div>
              
              <nav className="space-y-2">
                {[
                  { id: 'orders', label: 'My Orders', icon: '📦' },
                  { id: 'offers', label: 'Special Offers', icon: '🎁' },
                  { id: 'notifications', label: 'Notifications', icon: '🔔', count: profileData?.notifications?.filter(n => !n.is_read).length },
                  { id: 'settings', label: 'Account Settings', icon: '⚙️' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id 
                        ? 'bg-amber-600 text-white shadow-lg' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span>{tab.icon}</span>
                      {tab.label}
                    </span>
                    {tab.count > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{tab.count}</span>
                    )}
                  </button>
                ))}
                
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 mt-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                >
                  <span>🚪</span> Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:w-3/4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-amber-100 dark:border-amber-900/30 min-h-[500px]"
              >
                {activeTab === 'orders' && (
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-amber-900 dark:text-amber-100 mb-6">Purchase History</h3>
                    {profileData?.orders?.length > 0 ? (
                      <div className="space-y-4">
                        {profileData.orders.map(order => (
                          <div key={order.id} className="p-4 border border-slate-100 dark:border-slate-700 rounded-2xl hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="text-xs font-mono text-amber-600 font-bold">{order.order_number}</span>
                                <p className="text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {order.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-amber-900 dark:text-amber-100">{order.total_amount} TND</span>
                              <button className="text-amber-600 text-sm hover:underline">View Details</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 opacity-50">No orders yet. Start shopping!</div>
                    )}
                  </div>
                )}

                {activeTab === 'offers' && (
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-amber-900 dark:text-amber-100 mb-6">Exclusive Offers</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {offers.map(offer => (
                        <div key={offer.id} className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg group">
                          <div className="relative z-10">
                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block uppercase tracking-wider">
                              {offer.discount_percent}% OFF
                            </span>
                            <h4 className="text-xl font-bold mb-2">{offer.title}</h4>
                            <p className="text-amber-50 text-sm mb-4">{offer.description}</p>
                            <div className="flex items-center justify-between">
                              <code className="bg-white/20 px-4 py-2 rounded-lg font-mono text-lg">{offer.code}</code>
                              <button className="bg-white text-amber-600 px-4 py-2 rounded-lg font-bold hover:bg-amber-50 transition-colors">Copy</button>
                            </div>
                          </div>
                          <div className="absolute -right-8 -bottom-8 text-white/10 text-9xl font-bold transform -rotate-12 transition-transform group-hover:scale-110">🎁</div>
                        </div>
                      ))}
                      {offers.length === 0 && <div className="col-span-2 text-center py-20 opacity-50">Check back later for special offers!</div>}
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-amber-900 dark:text-amber-100 mb-6">Notifications</h3>
                    <div className="space-y-4">
                      {profileData?.notifications?.map(notif => (
                        <div key={notif.id} className={`p-4 rounded-2xl border transition-all ${notif.is_read ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700' : 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className={`font-bold ${notif.is_read ? 'text-slate-700 dark:text-slate-300' : 'text-amber-900 dark:text-amber-100'}`}>{notif.title}</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{notif.message}</p>
                              <p className="text-xs text-slate-400 mt-2">{new Date(notif.created_at).toLocaleString()}</p>
                            </div>
                            {!notif.is_read && (
                              <button onClick={() => markAsRead(notif.id)} className="text-xs text-amber-600 font-bold hover:underline">Mark as read</button>
                            )}
                          </div>
                        </div>
                      ))}
                      {profileData?.notifications?.length === 0 && <div className="text-center py-20 opacity-50">All caught up!</div>}
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-amber-900 dark:text-amber-100 mb-6">Account Settings</h3>
                    <form onSubmit={handleUpdatePassword} className="max-w-md space-y-6">
                      {msg.text && (
                        <div className={`p-4 rounded-xl text-sm ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {msg.text}
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                        <input
                          type="password"
                          required
                          value={credentials.currentPassword}
                          onChange={e => setCredentials(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                        <input
                          type="password"
                          required
                          value={credentials.newPassword}
                          onChange={e => setCredentials(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                      </div>
                      <button type="submit" className="w-full bg-amber-600 text-white py-3 rounded-xl font-bold hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/20">
                        Update Password
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
