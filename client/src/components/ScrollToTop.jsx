import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (hash) {
        // If there is a hash, scroll to the element
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // If no hash, scroll to top
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    };

    // Immediate attempt
    handleScroll();

    // Delayed attempt to handle any layout shifts or render delays
    const timer = setTimeout(handleScroll, 100);

    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
