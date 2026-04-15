import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiBarChart2, FiUsers, FiSun } from 'react-icons/fi';

const features = [
  {
    icon: <FiSun className="text-3xl text-orange-500" />,
    title: 'Smart Environmental Analysis',
    description: 'We integrate real-time weather and environment data to assess hydroseeding viability accurately.',
  },
  {
    icon: <FiMapPin className="text-3xl text-blue-500" />,
    title: 'Precision Land Mapping',
    description: 'Draw or pin your land area on interactive maps to estimate costs and requirements.',
  },
  {
    icon: <FiBarChart2 className="text-3xl text-green-500" />,
    title: 'AI Suitability Scoring',
    description: 'Upload soil/land images to our AI engine for instant texture, slope, and vegetation diagnostics.',
  },
  {
    icon: <FiUsers className="text-3xl text-purple-500" />,
    title: 'Contractor Marketplace',
    description: 'Connect instantly with vetted, top-rated local hydroseeding contractors.',
  },
];

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-100 to-teal-50 pt-20 pb-32">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(34, 197, 94, 0.15), transparent 25%), radial-gradient(circle at 85% 30%, rgba(20, 184, 166, 0.15), transparent 25%)' }}>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-800 font-medium text-sm mb-6 border border-green-200 shadow-sm animate-fade-in">
            New: AI-Powered Suitability Engine Available
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6 max-w-4xl">
            Transform Your Land with <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Hydroseeding Intelligence</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl font-light">
            Capture photos of your soil, get an instant AI suitability score, map your estate, and discover the best local contractors—all in one smart dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/analysis" className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold text-lg shadow-xl shadow-green-500/30 transition-all transform hover:-translate-y-1">
              Start Free Land Analysis
            </Link>
            <Link to="/dashboard" className="px-8 py-4 bg-white text-slate-800 hover:text-primary-700 border border-slate-200 rounded-full font-semibold text-lg shadow-sm hover:shadow-md transition-all">
              Find Contractors
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How the Advisor Works</h2>
            <p className="text-slate-500">The most advanced tool to plan and execute hydroseeding projects.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer minimal */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center">
        <p>© 2026 HydroSeed Smart Advisor. Developed for excellence.</p>
      </footer>
    </div>
  );
};

export default Home;
