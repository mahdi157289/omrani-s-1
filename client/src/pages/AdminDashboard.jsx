import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [settings, setSettings] = useState({ storeName: '', description: '' });
  const [activeTab, setActiveTab] = useState('analytics');
  const [managementTab, setManagementTab] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Product Management State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', category: '', stock: '', emoji: '', est_year: ''
  });

  // Gallery Management State
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [fbSyncUrl, setFbSyncUrl] = useState('https://www.facebook.com/makroudhomrani');
  const [galleryForm, setGalleryForm] = useState({
    url: '', type: 'image', title: '', description: '', thumbnail_url: ''
  });

  // Fallback Data
  const mockOrders = [
    { id: 101, customer_name: 'Ahmed K.', total_amount: 120.00, status: 'delivered', created_at: new Date().toISOString() },
    { id: 102, customer_name: 'Sarah M.', total_amount: 45.00, status: 'preparing', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 103, customer_name: 'John D.', total_amount: 89.50, status: 'pending', created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 104, customer_name: 'Layla S.', total_amount: 210.00, status: 'delivered', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 105, customer_name: 'Mike R.', total_amount: 35.00, status: 'cancelled', created_at: new Date(Date.now() - 172800000).toISOString() },
  ];

  const mockProducts = [
    { id: 1, name: 'Baklava Royale', price: 12.00, category: 'Traditional', stock: 156, emoji: '🥮' },
    { id: 2, name: 'Rose Petal Muffin', price: 8.00, category: 'Specialty', stock: 89, emoji: '🧁' },
    { id: 3, name: 'Golden Croissant', price: 6.50, category: 'French', stock: 234, emoji: '🥐' },
    { id: 4, name: 'Saffron Ring', price: 7.50, category: 'Persian', stock: 12, emoji: '🍩' },
    { id: 5, name: "Ma'amoul Legacy", price: 9.00, category: 'Levantine', stock: 0, emoji: '🍪' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [ordersRes, productsRes, settingsRes, galleryRes] = await Promise.all([
          axios.get('/api/orders'),
          axios.get('/api/products'),
          axios.get('/api/settings').catch(() => ({ data: {} })), // Handle missing table or empty data
          axios.get('/api/gallery').catch(() => ({ data: [] }))
        ]);
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
        setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
        setGallery(Array.isArray(galleryRes.data) ? galleryRes.data : []);
        setSettings(prev => ({ ...prev, ...settingsRes.data }));
        setError(null);
      } catch (err) {
        console.error('Admin data fetch failed, using fallback data', err);
        setOrders(mockOrders);
        setProducts(mockProducts);
        setError('Database connection failed. Showing offline mode.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    try {
      await axios.post('/api/settings', settings);
      alert('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings.');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const openProductModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setProductForm(product);
    } else {
      setCurrentProduct(null);
      setProductForm({ name: '', description: '', price: '', category: '', stock: '', emoji: '', est_year: '' });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async () => {
    try {
      if (currentProduct) {
        const res = await axios.put(`/api/products/${currentProduct.id}`, productForm);
        setProducts(products.map(p => p.id === currentProduct.id ? res.data : p));
      } else {
        const res = await axios.post('/api/products', productForm);
        setProducts([...products, res.data]);
      }
      setIsProductModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete product');
    }
  };

  const handleSaveGalleryItem = async () => {
    try {
      const res = await axios.post('/api/gallery', galleryForm);
      setGallery([res.data, ...gallery]);
      setIsGalleryModalOpen(false);
      setGalleryForm({ url: '', type: 'image', title: '', description: '', thumbnail_url: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to save gallery item');
    }
  };

  const handleDeleteGalleryItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`/api/gallery/${id}`);
      setGallery(gallery.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete gallery item');
    }
  };

  const handleSyncFacebook = async () => {
    setIsSyncing(true);
    try {
      const res = await axios.post('/api/gallery/sync', { url: fbSyncUrl });
      if (res.data.addedItems && res.data.addedItems.length > 0) {
        setGallery([...res.data.addedItems, ...gallery]);
      }
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert('Facebook sync failed. Please check the URL or try again later.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Stats
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalCustomers = new Set(orders.map(o => o.customer_email || o.customer_name)).size;

  // Chart Data
  const revenueData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue',
        data: [420, 580, 490, 620, 710, 840, 780],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const trafficData = {
    labels: ['Organic', 'Social', 'Direct', 'Referral'],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' } },
    },
  };

  return (
    <div className="min-h-screen bg-amber-50 flex font-sans rtl:font-serif">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 text-amber-100 flex flex-col fixed h-full z-50 shadow-2xl ltr:left-0 rtl:right-0">
        <div className="p-8 border-b border-amber-800/50">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="text-4xl group-hover:scale-110 transition-transform">🥐</span>
            <div>
              <h1 className="font-serif text-2xl font-bold text-amber-100">{t('admin.sidebar.title')}</h1>
              <span className="text-amber-400 text-xs tracking-widest uppercase">{t('admin.sidebar.adminPanel')}</span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          <div className="text-amber-500/60 text-xs font-bold uppercase tracking-wider mb-4 px-4">{t('admin.sidebar.mainMenu')}</div>
          
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'analytics' ? 'bg-amber-800 text-white shadow-lg ltr:translate-x-2 rtl:-translate-x-2' : 'hover:bg-amber-800/30 text-amber-200'}`}>
            <span className="text-xl">📊</span>
            <span className="font-medium">{t('admin.sidebar.analytics')}</span>
          </button>
          
          <button onClick={() => setActiveTab('management')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'management' ? 'bg-amber-800 text-white shadow-lg ltr:translate-x-2 rtl:-translate-x-2' : 'hover:bg-amber-800/30 text-amber-200'}`}>
            <span className="text-xl">⚙️</span>
            <span className="font-medium">{t('admin.sidebar.management')}</span>
          </button>

          <div className="text-amber-500/60 text-xs font-bold uppercase tracking-wider mt-8 mb-4 px-4">{t('admin.sidebar.quickAccess')}</div>
          
          <button onClick={() => { setActiveTab('management'); setManagementTab('products'); }} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-amber-800/30 text-amber-200 transition-all">
            <span className="text-xl">🥮</span>
            <span className="font-medium">{t('admin.sidebar.products')}</span>
            <span className="ml-auto bg-amber-700/50 px-2 py-0.5 rounded-full text-xs">{products.length}</span>
          </button>
          
          <button onClick={() => setActiveTab('orders')} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-amber-800/30 text-amber-200 transition-all">
            <span className="text-xl">📦</span>
            <span className="font-medium">{t('admin.sidebar.orders')}</span>
            {pendingOrders > 0 && <span className="ml-auto bg-red-500 text-white px-2 py-0.5 rounded-full text-xs animate-pulse">{pendingOrders}</span>}
          </button>
        </nav>

        <div className="p-6 border-t border-amber-800/50 bg-black/10">
          <Link to="/" className="flex items-center gap-3 text-amber-300 hover:text-white transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold shadow-lg">A</div>
            <div>
              <div className="text-sm font-bold">{t('admin.sidebar.adminUser')}</div>
              <div className="text-xs opacity-70">{t('admin.sidebar.logout')}</div>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ltr:ml-72 rtl:mr-72 flex-1 p-8 overflow-y-auto h-screen">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm animate-pulse">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold">{t('admin.analytics.connectionError')}</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Analytics View */}
        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <header className="flex justify-between items-center mb-10">
              <div>
                <h2 className="font-serif text-3xl font-bold text-amber-900">{t('admin.analytics.title')}</h2>
                <p className="text-stone-500 mt-1">{t('admin.analytics.welcome')}</p>
              </div>
              <div className="flex gap-4">
                <button className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md text-amber-600 relative">
                  🔔 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <Link to="/" target="_blank" className="px-6 py-3 bg-white text-amber-900 rounded-xl font-medium shadow-sm hover:shadow-md transition flex items-center gap-2">
                  <span>👁️</span> {t('admin.analytics.viewSite')}
                </Link>
              </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              {[
                { label: t('admin.analytics.totalRevenue'), value: `$${totalRevenue.toFixed(2)}`, icon: '💰', color: 'text-green-600', bg: 'bg-green-50' },
                { label: t('admin.analytics.totalOrders'), value: orders.length, icon: '📦', color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: t('admin.analytics.totalCustomers'), value: totalCustomers, icon: '👥', color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: t('admin.analytics.avgRating'), value: '4.9', icon: '⭐', color: 'text-amber-600', bg: 'bg-amber-50' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all border border-stone-100 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${stat.bg} text-2xl`}>{stat.icon}</div>
                    <span className="text-xs font-bold px-2 py-1 bg-stone-100 rounded-full text-stone-500">{t('admin.analytics.live')}</span>
                  </div>
                  <div className={`text-3xl font-bold text-stone-800 mb-1 group-hover:scale-105 transition-transform origin-left`}>{stat.value}</div>
                  <div className="text-stone-500 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-serif text-xl font-bold text-amber-900">{t('admin.analytics.revenueOverview')}</h3>
                  <select className="px-4 py-2 bg-stone-50 rounded-xl text-sm font-medium outline-none">
                    <option>{t('admin.analytics.last7Days')}</option>
                  </select>
                </div>
                <div className="h-64">
                  <Line data={revenueData} options={chartOptions} />
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                <h3 className="font-serif text-xl font-bold text-amber-900 mb-6">{t('admin.analytics.trafficSources')}</h3>
                <div className="h-64 relative">
                  <Doughnut data={trafficData} options={{ ...chartOptions, cutout: '70%' }} />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-stone-800">1.2k</div>
                      <div className="text-xs text-stone-500">{t('admin.analytics.visitors')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="p-8 border-b border-stone-100 flex justify-between items-center">
                <h3 className="font-serif text-xl font-bold text-amber-900">{t('admin.analytics.recentOrders')}</h3>
                <button onClick={() => setActiveTab('orders')} className="text-amber-600 font-medium hover:text-amber-800 rtl:flex-row-reverse flex gap-1 items-center">
                   {t('admin.analytics.viewAll')} <span className="rtl:rotate-180">→</span>
                </button>
              </div>
              <table className="w-full">
                <thead className="bg-stone-50 text-stone-500 text-sm uppercase tracking-wider">
                  <tr>
                    <th className="px-8 py-4 text-left font-semibold rtl:text-right">{t('admin.analytics.table.orderId')}</th>
                    <th className="px-8 py-4 text-left font-semibold rtl:text-right">{t('admin.analytics.table.customer')}</th>
                    <th className="px-8 py-4 text-left font-semibold rtl:text-right">{t('admin.analytics.table.status')}</th>
                    <th className="px-8 py-4 text-right font-semibold rtl:text-left">{t('admin.analytics.table.amount')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-amber-50/50 transition-colors">
                      <td className="px-8 py-4 font-mono text-stone-600">#{order.order_number || order.id}</td>
                      <td className="px-8 py-4 font-medium text-stone-900">{order.customer_name}</td>
                      <td className="px-8 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                          ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            order.status === 'preparing' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'}`}>
                          {t(`admin.orders.status.${order.status}`)}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right font-bold text-stone-800 rtl:text-left">${Number(order.total_amount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Management View */}
        {activeTab === 'management' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <h2 className="font-serif text-3xl font-bold text-amber-900 mb-8">{t('admin.management.title')}</h2>
            
            <div className="bg-white rounded-2xl shadow-sm p-2 mb-8 inline-flex gap-2 border border-stone-100">
              {['general', 'products', 'packages', 'gallery', 'seo'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setManagementTab(tab)}
                  className={`px-6 py-2 rounded-xl font-medium transition-all ${
                    managementTab === tab 
                      ? 'bg-amber-100 text-amber-900 shadow-sm' 
                      : 'text-stone-500 hover:bg-stone-50'
                  }`}
                >
                  {t(`admin.management.tabs.${tab}`)}
                </button>
              ))}
            </div>

            {/* Products Sub-tab */}
            {managementTab === 'products' && (
              <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="p-8 border-b border-stone-100 flex justify-between items-center">
                  <h3 className="font-serif text-xl font-bold text-amber-900">{t('admin.management.products.title')}</h3>
                  <button 
                    onClick={() => openProductModal()}
                    className="bg-amber-800 text-white px-6 py-2 rounded-xl hover:bg-amber-900 transition flex items-center gap-2"
                  >
                    <span>➕</span> {t('admin.management.products.addProduct')}
                  </button>
                </div>
                <table className="w-full">
                  <thead className="bg-stone-50 text-stone-500 text-sm uppercase tracking-wider">
                    <tr>
                      <th className="px-8 py-4 text-left rtl:text-right">{t('admin.management.products.columns.product')}</th>
                      <th className="px-8 py-4 text-left rtl:text-right">{t('admin.management.products.columns.category')}</th>
                      <th className="px-8 py-4 text-left rtl:text-right">{t('admin.management.products.columns.price')}</th>
                      <th className="px-8 py-4 text-left rtl:text-right">{t('admin.management.products.columns.stock')}</th>
                      <th className="px-8 py-4 text-left rtl:text-right">{t('admin.management.products.columns.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-amber-50/50">
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{product.emoji}</span>
                            <div>
                              <div className="font-bold text-stone-900">{product.name}</div>
                              <div className="text-xs text-stone-500">ID: {product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-stone-600">{product.category}</td>
                        <td className="px-8 py-4 font-bold text-stone-800">${Number(product.price).toFixed(2)}</td>
                        <td className="px-8 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {product.stock} {t('admin.management.products.stockLeft')}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => openProductModal(product)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg">✏️</button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* General Sub-tab (Placeholder for others) */}
            {managementTab === 'general' && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                  <h3 className="font-serif text-xl font-bold text-amber-900 mb-6">{t('admin.management.general.title')}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-stone-600 mb-2">{t('admin.management.general.storeName')}</label>
                      <input 
                        type="text" 
                        value={settings.storeName}
                        onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                        placeholder="Al-Fanous Pastry Museum" 
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-600 mb-2">{t('admin.management.general.description')}</label>
                      <textarea 
                        rows="4" 
                        value={settings.description}
                        onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                        placeholder="Where tradition meets artistry..." 
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500"
                      ></textarea>
                    </div>
                    <button 
                      onClick={handleSaveSettings}
                      className="bg-amber-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-900 transition shadow-lg"
                    >
                      {t('admin.management.general.saveChanges')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Gallery Sub-tab */}
            {managementTab === 'gallery' && (
              <div className="space-y-8">
                {/* Facebook Sync Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 rounded-3xl shadow-lg text-white">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl">
                        FB
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Sync with Facebook</h3>
                        <p className="text-blue-100 text-sm">Extract photos and videos directly from your page</p>
                      </div>
                    </div>
                    <div className="flex-1 w-full max-w-md flex gap-2">
                      <input 
                        type="text" 
                        value={fbSyncUrl}
                        onChange={(e) => setFbSyncUrl(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-blue-200 focus:outline-none focus:bg-white/20 transition"
                        placeholder="Facebook Page URL"
                      />
                      <button 
                        onClick={handleSyncFacebook}
                        disabled={isSyncing}
                        className={`px-6 py-3 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition flex items-center gap-2 whitespace-nowrap ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isSyncing ? (
                          <>
                            <span className="animate-spin">⏳</span> Syncing...
                          </>
                        ) : (
                          <>
                            <span>🔄</span> Sync Now
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-xl font-bold text-amber-900">Media Gallery Management</h3>
                    <button 
                      onClick={() => setIsGalleryModalOpen(true)}
                      className="bg-amber-800 text-white px-6 py-2 rounded-xl hover:bg-amber-900 transition flex items-center gap-2"
                    >
                      <span>➕</span> Add Media
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {gallery.map((item) => (
                      <div key={item.id} className="group relative bg-stone-50 rounded-2xl overflow-hidden border border-stone-100 aspect-square">
                        {item.type === 'image' ? (
                          <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-stone-800 text-white relative">
                            <span className="text-4xl">🎥</span>
                            {item.thumbnail_url && <img src={item.thumbnail_url} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="" />}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                          <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                          <p className="text-amber-200 text-xs mb-4 line-clamp-2">{item.description}</p>
                          <button 
                            onClick={() => handleDeleteGalleryItem(item.id)}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
        
        {/* Orders View */}
        {activeTab === 'orders' && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
             <h2 className="font-serif text-3xl font-bold text-amber-900 mb-8">{t('admin.orders.title')}</h2>
             <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-stone-50 text-stone-500 text-sm uppercase tracking-wider">
                    <tr>
                      <th className="px-8 py-4 text-left font-semibold rtl:text-right">{t('admin.orders.columns.orderId')}</th>
                      <th className="px-8 py-4 text-left font-semibold rtl:text-right">{t('admin.orders.columns.customer')}</th>
                      <th className="px-8 py-4 text-left font-semibold rtl:text-right">{t('admin.orders.columns.status')}</th>
                      <th className="px-8 py-4 text-right font-semibold rtl:text-left">{t('admin.orders.columns.total')}</th>
                      <th className="px-8 py-4 text-left font-semibold rtl:text-right">{t('admin.orders.columns.date')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-amber-50/50 transition-colors">
                        <td className="px-8 py-4 font-mono text-stone-600">#{order.order_number || order.id}</td>
                        <td className="px-8 py-4 font-medium text-stone-900">{order.customer_name}</td>
                        <td className="px-8 py-4">
                          <select 
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="bg-stone-100 border-none rounded-lg px-3 py-1 text-sm font-medium focus:ring-2 focus:ring-amber-500 cursor-pointer"
                          >
                            <option value="pending">{t('admin.orders.status.pending')}</option>
                            <option value="preparing">{t('admin.orders.status.preparing')}</option>
                            <option value="delivered">{t('admin.orders.status.delivered')}</option>
                            <option value="cancelled">{t('admin.orders.status.cancelled')}</option>
                          </select>
                        </td>
                        <td className="px-8 py-4 text-right font-bold text-stone-800 rtl:text-left">${Number(order.total_amount).toFixed(2)}</td>
                        <td className="px-8 py-4 text-stone-500 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
           </motion.div>
        )}
      </main>

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-2xl font-bold text-amber-900 mb-6">
              {currentProduct ? 'Edit Product' : 'Add Product'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-600 mb-1">Name</label>
                <input 
                  type="text" 
                  value={productForm.name} 
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-600 mb-1">Description</label>
                <textarea 
                  value={productForm.description} 
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-stone-600 mb-1">Price</label>
                  <input 
                    type="number" 
                    value={productForm.price} 
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-600 mb-1">Stock</label>
                  <input 
                    type="number" 
                    value={productForm.stock} 
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-stone-600 mb-1">Category</label>
                  <input 
                    type="text" 
                    value={productForm.category} 
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-600 mb-1">Emoji</label>
                  <input 
                    type="text" 
                    value={productForm.emoji} 
                    onChange={(e) => setProductForm({ ...productForm, emoji: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-600 mb-1">Est. Year</label>
                <input 
                  type="number" 
                  value={productForm.est_year || ''} 
                  onChange={(e) => setProductForm({ ...productForm, est_year: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500" 
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-stone-600 hover:bg-stone-100 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProduct}
                className="flex-1 px-6 py-3 rounded-xl font-bold bg-amber-800 text-white hover:bg-amber-900 transition shadow-lg"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl">
            <h3 className="font-serif text-2xl font-bold text-amber-900 mb-6">Add Media Item</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-600 mb-1">Type</label>
                <select 
                  value={galleryForm.type}
                  onChange={(e) => setGalleryForm({ ...galleryForm, type: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-600 mb-1">URL (Facebook, YouTube, or direct image link)</label>
                <input 
                  type="text" 
                  value={galleryForm.url} 
                  onChange={(e) => setGalleryForm({ ...galleryForm, url: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500" 
                  placeholder="https://..."
                />
              </div>
              {galleryForm.type === 'video' && (
                <div>
                  <label className="block text-sm font-bold text-stone-600 mb-1">Thumbnail URL</label>
                  <input 
                    type="text" 
                    value={galleryForm.thumbnail_url} 
                    onChange={(e) => setGalleryForm({ ...galleryForm, thumbnail_url: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500" 
                    placeholder="https://..."
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-stone-600 mb-1">Title</label>
                <input 
                  type="text" 
                  value={galleryForm.title} 
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-600 mb-1">Description</label>
                <textarea 
                  value={galleryForm.description} 
                  onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500" 
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setIsGalleryModalOpen(false)}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-stone-600 hover:bg-stone-100 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveGalleryItem}
                className="flex-1 px-6 py-3 rounded-xl font-bold bg-amber-800 text-white hover:bg-amber-900 transition shadow-lg"
              >
                Add to Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;