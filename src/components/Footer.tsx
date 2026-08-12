import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-10 bg-theme-main border-t border-theme text-theme-muted transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-lg text-theme-main font-heading uppercase tracking-wider">
            SAMUEL
          </span>
          <span className="text-xs text-theme-muted">
            © {new Date().getFullYear()} Tous droits réservés.
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs font-medium">
          <a href="#about" className="hover:text-theme-main transition-colors">
            À propos
          </a>
          <a href="#skills" className="hover:text-theme-main transition-colors">
            Compétences
          </a>
          <a href="#experiences" className="hover:text-theme-main transition-colors">
            Expérience
          </a>
          <a href="#projects" className="hover:text-theme-main transition-colors">
            Projets
          </a>
          <a href="#contact" className="hover:text-theme-main transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

