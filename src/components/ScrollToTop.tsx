import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Retour en haut"
      className="fixed bottom-6 right-6 z-50 p-3 rounded-2xl bg-[#22071d] border-2 border-[#f38038] text-white shadow-2xl hover:bg-[#3d0d34] transition-colors duration-300 flex items-center justify-center gap-1.5 group"
    >
      <ArrowUp className="w-5 h-5 text-[#f38038] group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
};
