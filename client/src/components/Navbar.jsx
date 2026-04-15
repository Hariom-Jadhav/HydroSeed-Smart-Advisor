import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiDroplet, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Analysis', path: '/analysis' },
    { name: 'Login', path: '/login' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20 px-6 py-4 rounded-none">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-primary-700 hover:text-primary-600 transition-colors">
          <FiDroplet className="text-3xl" />
          <span className="text-xl font-bold tracking-tight">HydroSeed Smart Advisor</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-all ${
                location.pathname === link.path
                  ? 'text-primary-600 font-bold'
                  : 'text-slate-600 hover:text-primary-500'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/dashboard"
            className="bg-primary-600 text-white px-5 py-2 rounded-full font-medium hover:bg-primary-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Dashboard
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-slate-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-4 flex flex-col">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block text-slate-700 font-medium px-4 py-2 hover:bg-slate-100 rounded-lg"
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className="block bg-primary-600 text-white text-center px-4 py-2 mx-4 rounded-full font-medium"
          >
            Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
