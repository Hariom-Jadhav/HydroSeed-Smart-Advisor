import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiBarChart2, FiUsers, FiSun, FiUploadCloud, FiCpu, FiMail, FiPhone, FiDroplet, FiCheck } from 'react-icons/fi';

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
  // Smooth hash scrolling on hash changes (e.g. from navbar clicks)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      try {
        const element = document.querySelector(hash);
        if (element) {
          // Subtle delay to allow DOM mapping to finish
          const timer = setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 150);
          return () => clearTimeout(timer);
        }
      } catch (err) {
        console.warn("Invalid CSS selector in location hash:", hash, err);
      }
    }
  }, [window.location.hash]);

  return (
    <div className="w-full animate-fade-in">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-100 to-teal-50 pt-20 pb-32 px-6">
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(34, 197, 94, 0.15), transparent 25%), radial-gradient(circle at 85% 30%, rgba(20, 184, 166, 0.15), transparent 25%)' }}
        ></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-800 font-bold text-xs mb-6 border border-green-200 shadow-sm uppercase tracking-wider animate-pulse">
            New: AI-Powered Suitability Engine Available
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6 max-w-4xl">
            Transform Your Land with <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Hydroseeding Intelligence</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-10 max-w-2xl font-light leading-relaxed">
            Capture photos of your soil, get an instant AI suitability score, map your estate, and discover the best local contractors—all in one smart dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <Link to="/analysis" className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold text-base sm:text-lg shadow-xl shadow-green-500/30 transition-all transform hover:-translate-y-1 text-center">
              Start Free Land Analysis
            </Link>
            <Link to="/dashboard" className="px-8 py-4 bg-white text-slate-800 hover:text-primary-700 border border-slate-200 rounded-full font-semibold text-base sm:text-lg shadow-sm hover:shadow-md transition-all text-center">
              Find Contractors
            </Link>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section id="about" className="py-24 bg-slate-50 border-b border-slate-100 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-2">
              Learn & Explore
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Hydroseeding Knowledge Center</h2>
            <p className="text-slate-500 mt-2 max-w-xl mx-auto font-light text-sm sm:text-base">
              Discover the mechanics of grass slurry application and how our AI ecosystem bridges landowners with professional contractors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="glass p-8 rounded-3xl bg-white border border-green-100 shadow-sm hover:shadow-md transition-all text-left">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <div className="p-2.5 bg-green-100 rounded-xl text-green-600 shrink-0"><FiSun /></div>
                What is Hydroseeding?
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-light">
                Hydroseeding is a fast and easy way to grow grass! We mix grass seeds, fertilizer, wood fiber mulch, and water together to make a green liquid. Then, we spray this mixture onto the ground using a special machine, and a beautiful green lawn grows very quickly.
              </p>
            </div>
            <div className="glass p-8 rounded-3xl bg-white border border-blue-100 shadow-sm hover:shadow-md transition-all text-left">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 rounded-xl text-blue-600 shrink-0"><FiMapPin /></div>
                Where is it used?
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-light">
                It is perfect for growing grass anywhere! People use it for home gardens, parks, sports fields, golf courses, and alongside big roads. It is also great for hillsides because it stops soil and dirt from washing away when it rains.
              </p>
            </div>
          </div>

          {/* Dual value proposition layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-slate-200/50">
            {/* For Landowners Card */}
            <div className="glass p-8 rounded-3xl bg-gradient-to-br from-green-50/80 via-white to-emerald-50/30 border border-green-200/50 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-green-100 text-green-800 rounded-lg text-[9px] font-extrabold uppercase tracking-wider mb-4">
                  For Landowners
                </span>
                <h3 className="text-2xl font-extrabold text-slate-800 mb-3 tracking-tight leading-snug">
                  Want to Grow Grass but Don't Know How?
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-light mb-6">
                  Want a beautiful green lawn but don't know where to start? We make it super easy! Just upload a photo of your soil. Our smart system will check your soil, recommend the best grass seed mix, check if the weather is good for planting, and connect you with trusted local contractors who can do the spraying for you.
                </p>
              </div>

              <div className="space-y-3 bg-white/60 p-5 rounded-2xl border border-green-100/50">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">How We Guide You:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <FiCheck className="text-green-600 shrink-0 text-base" />
                    <span>AI Soil & pH Diagnostics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCheck className="text-green-600 shrink-0 text-base" />
                    <span>Custom Mulch Slurry Advice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCheck className="text-green-600 shrink-0 text-base" />
                    <span>Open-Meteo Rain Risk Scan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCheck className="text-green-600 shrink-0 text-base" />
                    <span>Verified Contractor Matching</span>
                  </div>
                </div>
              </div>
            </div>

            {/* For Contractors Card */}
            <div className="glass p-8 rounded-3xl bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/30 border border-blue-200/50 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-lg text-[9px] font-extrabold uppercase tracking-wider mb-4">
                  For Contractors
                </span>
                <h3 className="text-2xl font-extrabold text-slate-800 mb-3 tracking-tight leading-snug">
                  Grow Your Hydroseeding Business
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-light mb-6">
                  Want to find more customers for your hydroseeding business? We are here to help! Get instant access to local landowners who need their soil sprayed. You can check their soil details, send them custom price quotes in Indian Rupees (₹), and chat with them directly through our secure messaging inbox to close the deal.
                </p>
              </div>

              <div className="space-y-3 bg-white/60 p-5 rounded-2xl border border-blue-100/50">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">How We Empower Your Growth:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <FiCheck className="text-blue-600 shrink-0 text-base" />
                    <span>High-Quality Local Leads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCheck className="text-blue-600 shrink-0 text-base" />
                    <span>Rupee (₹) Pricing Formats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCheck className="text-blue-600 shrink-0 text-base" />
                    <span>Secure Direct Chat Inbox</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCheck className="text-blue-600 shrink-0 text-base" />
                    <span>Slurry-Conditioned Bidding</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION (NEW) */}
      <section className="py-24 bg-white px-6 border-b border-slate-100 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-green-50 text-green-800 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-2">
              Step-by-step
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">How It Works</h2>
            <p className="text-slate-500 mt-2 max-w-lg mx-auto font-light text-sm sm:text-base">
              Get detailed agricultural insights and connect with contractors in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-100/50 transition-all text-left relative group">
              <div className="absolute top-6 right-6 text-5xl font-black text-slate-100 group-hover:text-primary-100 transition-colors">
                01
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-all text-primary-600 border border-primary-50">
                <FiUploadCloud className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Upload Soil Image</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-light">
                Capture or select a clear, high-resolution photo of your land terrain and soil texture from any mobile device or desktop browser.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-100/50 transition-all text-left relative group">
              <div className="absolute top-6 right-6 text-5xl font-black text-slate-100 group-hover:text-primary-100 transition-colors">
                02
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-all text-primary-600 border border-primary-50">
                <FiCpu className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">AI Diagnostics Scan</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-light">
                Our advanced neural network instantly analyzes soil categories, slope stability, water drainage rates, pH acidity ratios, and compaction risk.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-100/50 transition-all text-left relative group">
              <div className="absolute top-6 right-6 text-5xl font-black text-slate-100 group-hover:text-primary-100 transition-colors">
                03
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-all text-primary-600 border border-primary-50">
                <FiBarChart2 className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Suitability & Slurry Advice</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-light">
                Receive an dynamic suitability rating score out of 100, custom material slurry mixtures, and query real-time Open-Meteo local weather advice.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* CONTACT SECTION (NEW) */}
      <section id="contact" className="py-20 bg-white px-6 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 bg-green-50 text-green-800 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-3">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Connect with our Team
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto leading-relaxed font-light mb-10">
            Have questions about soil classifications, slurry recipes, weather variables, or contractor subscriptions? Reach out directly via our email or call hotline support!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-left shadow-sm">
              <div className="p-3 bg-primary-100 rounded-xl text-primary-600 shrink-0">
                <FiMail className="text-2xl" />
              </div>
              <div className="overflow-hidden">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email support</span>
                <span className="font-bold text-slate-700 text-xs sm:text-sm break-all">jadhavhariom82@gmail.com</span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-left shadow-sm">
              <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600 shrink-0">
                <FiPhone className="text-2xl" />
              </div>
              <div className="overflow-hidden">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Call Hotline</span>
                <span className="font-bold text-slate-700 text-xs sm:text-sm break-all">+91 91721 51585</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MULTI-COLUMN PREMIUM FOOTER (NEW) */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6 relative border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-left">
          
          {/* Column 1 */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg">
              <FiDroplet className="text-2xl text-primary-500" />
              <span>HydroSeed Advisor</span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              The advanced agricultural diagnostics platform. We leverage neural soil classifications and Open-Meteo forecasting to empower professional hydroseeding operations.
            </p>
            <div className="text-[10px] text-slate-600 font-bold uppercase mt-2">
              © 2026 HydroSeed Smart Advisor.
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Solutions</h4>
            <ul className="text-xs space-y-2.5 font-light">
              <li>
                <Link to="/analysis" className="hover:text-primary-500 transition-colors">AI Terrain Diagnostics</Link>
              </li>
              <li>
                <Link to="/analysis" className="hover:text-primary-500 transition-colors">Weather Advisor Check</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-primary-500 transition-colors">Contractor Bidding Portal</Link>
              </li>
              <li>
                <Link to="/messages" className="hover:text-primary-500 transition-colors">Client Message Inbox</Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Platform</h4>
            <ul className="text-xs space-y-2.5 font-light">
              <li>
                <a href="#about" className="hover:text-primary-500 transition-colors">About Hydroseeding</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-primary-500 transition-colors">Get Support / Contact</a>
              </li>
              <li>
                <Link to="/profile" className="hover:text-primary-500 transition-colors">Edit User Profile</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary-500 transition-colors">Sign-in console</Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-800/80 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-600 gap-4">
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Slurry Disclaimers</a>
          </div>
          <div>
            <span>Developed for Agricultural Engineering Excellence.</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
