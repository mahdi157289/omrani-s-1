import Navbar from '../components/Navbar';
import Exhibits from '../components/Exhibits';
import Visit from '../components/Visit';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import ThemeSwitcher from '../components/ThemeSwitcher';

const StorePage = () => {
  return (
    <div className="min-h-screen font-sans transition-colors duration-500">
      <Navbar />
      <CartSidebar />
      <ThemeSwitcher />
      <div className="pt-24">
        <Exhibits />
        <Visit />
      </div>
      <Footer />
    </div>
  );
};

export default StorePage;
