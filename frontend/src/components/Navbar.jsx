import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'AI Engine', path: '/ai-engine' },
    { name: 'Items Feed', path: '/items' },
    { name: 'Report Item', path: '/report-lost' },
    { name: 'Dashboard', path: '/dashboard' }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-bg-dark/80 backdrop-blur-xl border-b border-border-subtle py-4' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-green/20 to-cyan/20 border border-neon-green/30 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(57,255,136,0.3)] transition-all">
            <Brain className="text-neon-green w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-xl tracking-wider text-text-primary">FINDBACK</span>
            <span className="text-[9px] font-medium tracking-widest text-text-muted uppercase">AI Recovery Platform</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2 bg-bg-glass border border-border-subtle px-2 py-1.5 rounded-full">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isActive(link.path) 
                  ? 'bg-neon-green/10 text-neon-green' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-glass-hover'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/report-lost" className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5">
            <span className="text-xl leading-none">+</span> Report Item
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-text-primary p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-bg-dark/95 backdrop-blur-xl border-b border-border-subtle p-6 flex flex-col gap-4 md:hidden shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-lg font-medium transition-all ${
                  isActive(link.path) 
                    ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' 
                    : 'text-text-secondary border border-transparent'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/report-lost" 
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary text-center mt-4"
            >
              + Report Item
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
