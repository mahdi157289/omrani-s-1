import React from 'react';

const SectionSeparator = ({ position = 'bottom', variant = 'wave', color = 'text-white' }) => {
  // Common SVG props
  const svgProps = {
    className: `w-full h-12 md:h-24 ${color}`,
    viewBox: "0 0 1440 320",
    xmlns: "http://www.w3.org/2000/svg",
    preserveAspectRatio: "none"
  };

  // Paths for different variants
  const paths = {
    wave: <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>,
    curve: <path fill="currentColor" fillOpacity="1" d="M0,160L80,176C160,192,320,224,480,224C640,224,800,192,960,176C1120,160,1280,160,1360,160L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>,
    tilt: <path fill="currentColor" fillOpacity="1" d="M0,224L1440,32L1440,320L0,320Z"></path>
  };

  // Position styles
  const wrapperClass = position === 'top' 
    ? 'absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180 z-10' 
    : 'absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-10';

  return (
    <div className={wrapperClass}>
      <svg {...svgProps}>
        {paths[variant] || paths.wave}
      </svg>
    </div>
  );
};

export default SectionSeparator;
