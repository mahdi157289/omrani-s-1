import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Exhibits from '../components/Exhibits';
import Media from '../components/Media';
import Packages from '../components/Packages';
import Heritage from '../components/Heritage';
import Gallery from '../components/Gallery';
import Visit from '../components/Visit';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import ThemeSwitcher from '../components/ThemeSwitcher';
import SectionSeparator from '../components/SectionSeparator';

const Landing = () => {
  return (
    <div className="min-h-screen font-sans transition-colors duration-500">
      <Navbar />
      <CartSidebar />
      <ThemeSwitcher />
      
      <Hero />
      <div className="relative">
        <SectionSeparator position="top" variant="wave" color="text-white" />
        <Exhibits />
      </div>
      
      <div className="relative">
        <SectionSeparator position="top" variant="curve" color="text-amber-50/30" />
        <Media />
      </div>
      
      <div className="relative">
        <SectionSeparator position="top" variant="wave" color="text-white" />
        <Packages />
      </div>
      
      <div className="relative">
        <SectionSeparator position="top" variant="curve" color="text-amber-50/30" />
        <Heritage />
      </div>
      
      <div className="relative">
        <SectionSeparator position="top" variant="wave" color="text-white" />
        <Gallery />
      </div>
      
      <div className="relative">
        <SectionSeparator position="top" variant="curve" color="text-amber-50/30" />
        <Visit />
      </div>
      
      <Footer />
    </div>
  );
};

export default Landing;
