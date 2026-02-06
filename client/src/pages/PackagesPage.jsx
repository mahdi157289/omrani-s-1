import Navbar from '../components/Navbar';
import Packages from '../components/Packages';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import ThemeSwitcher from '../components/ThemeSwitcher';

const PackagesPage = () => {
  return (
    <div className="min-h-screen font-sans transition-colors duration-500">
      <Navbar />
      <CartSidebar />
      <ThemeSwitcher />
      <div className="pt-24">
        <Packages />
      </div>
      <Footer />
    </div>
  );
};

export default PackagesPage;
