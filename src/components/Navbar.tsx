import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X } from 'lucide-react';

interface NavbarProps {
  profile?: { firstName?: string; lastName?: string } | null;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'À propos', href: '#about' },
    { label: 'Compétences', href: '#skills' },
    { label: 'Expériences', href: '#experiences' },
    { label: 'Formations', href: '#education' },
    { label: 'Projets', href: '#projects' },
    { label: 'Témoignages', href: '#testimonials' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-theme-main/90 backdrop-blur-md border-b border-theme shadow-xl py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo - SAMUEL */}
        <a href="#hero" className="flex items-center gap-2 group">
          <span className="font-extrabold text-2xl tracking-wider text-theme-main uppercase font-heading group-hover:text-theme-primary transition-colors">
            SAMUEL
          </span>
        </a>

        {/* Desktop Navigation Links — wraps to 2 lines and shrinks around 840px */}
        <nav className="hidden md:flex flex-1 flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 lg:gap-x-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm lg:text-base font-medium text-theme-muted hover:text-theme-main transition-colors duration-200 whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-theme-muted hover:text-theme-main bg-theme-card border border-theme hover:border-theme-primary transition-all shadow-sm"
            title={theme === 'dark' ? 'Passer en Mode Clair' : 'Passer en Mode Sombre'}
            aria-label="Changer le thème"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>

          {/* Contact Button */}
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 justify-center px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-gradient-mockup text-white shadow-lg"
          >
            <span>Contact</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-theme-muted hover:text-theme-main"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-theme-surface border-b border-theme px-6 py-6 flex flex-col gap-4 shadow-2xl">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-base font-medium text-theme-muted hover:text-theme-main transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 border-t border-theme flex flex-col gap-3">
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center py-2.5 rounded-xl bg-gradient-mockup text-white text-xs font-bold uppercase tracking-wider"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

