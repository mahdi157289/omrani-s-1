import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
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

const ScrollSection = ({ children, className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center", "end start"]
  });

  // Accelerate fade-out near the end of the section
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.7, 0.92], [0, 1, 1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.1, 0.7, 0.92], ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"]);
  const scale = useTransform(scrollYProgress, [0, 0.1, 0.7, 0.92], [0.985, 1, 1, 0.985]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, filter: blur, scale }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
};

const Landing = () => {
  return (
    <div className="min-h-screen font-sans transition-colors duration-500 overflow-x-hidden">
      <Navbar />
      <CartSidebar />
      <ThemeSwitcher />
      
      <ScrollSection>
        <Hero />
      </ScrollSection>

      <ScrollSection>
        <div className="relative">
          <SectionSeparator position="top" variant="wave" color="text-white" />
          <Exhibits />
        </div>
      </ScrollSection>
      
      <ScrollSection>
        <div className="relative">
          <SectionSeparator position="top" variant="curve" color="text-amber-50/30" />
          <Media />
        </div>
      </ScrollSection>
      
      <ScrollSection>
        <div className="relative">
          <SectionSeparator position="top" variant="wave" color="text-white" />
          <Packages />
        </div>
      </ScrollSection>
      
      <ScrollSection>
        <div className="relative">
          <SectionSeparator position="top" variant="curve" color="text-amber-50/30" />
          <Heritage />
        </div>
      </ScrollSection>
      
      <ScrollSection>
        <div className="relative">
          <SectionSeparator position="top" variant="wave" color="text-white" />
          <Gallery />
        </div>
      </ScrollSection>
      
      <ScrollSection>
        <div className="relative">
          <SectionSeparator position="top" variant="curve" color="text-amber-50/30" />
          <Visit />
        </div>
      </ScrollSection>
      
      <Footer />
    </div>
  );
};

export default Landing;
