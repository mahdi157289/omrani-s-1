import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Landing from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard';
import StorePage from './pages/StorePage';
import PackagesPage from './pages/PackagesPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/packages" element={<PackagesPage />} />
      </Routes>
    </>
  );
}

export default App;
