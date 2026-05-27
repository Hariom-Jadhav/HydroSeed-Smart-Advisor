import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiDroplet, FiMenu, FiX, FiUser, FiPhone, FiMapPin, FiLogOut, FiBriefcase, FiAlertTriangle, FiBell } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const notiRef = useRef(null);

  const handleUserUpdate = () => {
    const userStr = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    setToken(savedToken);
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  const fetchUnreadCount = async () => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        const res = await axios.get('http://localhost:5000/api/v1/messages/unread-count', {
          headers: { Authorization: `Bearer ${savedToken}` }
        });
        if (res.data.status === 'success') {
          setUnreadCount(res.data.data.count);
        }
      } catch (err) {
        console.error("Failed to fetch unread count", err);
      }
    } else {
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    handleUserUpdate();
  }, [location]);

  useEffect(() => {
    fetchUnreadCount();
    window.addEventListener('storage', handleUserUpdate);
    return () => {
      window.removeEventListener('storage', handleUserUpdate);
    };
  }, []);

  useEffect(() => {
    // Poll unread count every 10 seconds when token is active
    let interval;
    if (token) {
      fetchUnreadCount();
      interval = setInterval(fetchUnreadCount, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [token, location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setNotiOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setUnreadCount(0);
    setDropdownOpen(false);
    setNotiOpen(false);
    navigate('/login');
  };

  // Determine if profile is incomplete
  const isProfileIncomplete = user && (!user.phone || !user.address || !user.name);

  // Set navigation links based on auth and completeness
  let navLinks = [];
  if (!token) {
    navLinks = [
      { name: 'Home', path: '/' },
      { name: 'Analysis', path: '/analysis' },
      { name: 'Login', path: '/login' },
    ];
  } else if (!isProfileIncomplete) {
    navLinks = [
      { name: 'Home', path: '/' },
      { name: 'Analysis', path: '/analysis' },
      { name: 'Messages', path: '/messages' },
    ];
  }

  // Get user avatar initials
  const getInitials = () => {
    if (!user || !user.name) return 'U';
    const names = user.name.split(' ');
    if (names.length > 1) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return user.name[0].toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 rounded-none shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        {isProfileIncomplete ? (
          <div className="flex items-center gap-2 text-primary-700 cursor-not-allowed">
            <FiDroplet className="text-3xl text-primary-600" />
            <span className="text-xl font-bold tracking-tight">HydroSeed Smart Advisor</span>
          </div>
        ) : (
          <Link to="/" className="flex items-center gap-2 text-primary-700 hover:text-primary-600 transition-colors">
            <FiDroplet className="text-3xl text-primary-600" />
            <span className="text-xl font-bold tracking-tight">HydroSeed Smart Advisor</span>
          </Link>
        )}
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-semibold transition-all ${
                location.pathname === link.path
                  ? 'text-primary-600 font-bold'
                  : 'text-slate-600 hover:text-primary-500'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {token && !isProfileIncomplete && (
            <Link
              to="/dashboard"
              className="bg-primary-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-primary-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 mr-2"
            >
              Dashboard
            </Link>
          )}

          {/* Premium Notification Bell (Desktop) */}
          {token && user && !isProfileIncomplete && (
            <div className="relative" ref={notiRef}>
              <button
                onClick={() => setNotiOpen(!notiOpen)}
                className="relative p-2 text-slate-500 hover:text-primary-600 rounded-full hover:bg-slate-50 transition-all focus:outline-none"
              >
                <FiBell className="text-xl" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {notiOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-3xl shadow-xl py-4 px-4 z-50 animate-fade-in">
                  <h4 className="font-bold text-slate-800 text-sm mb-3 border-b border-slate-100 pb-2 flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {unreadCount} New
                      </span>
                    )}
                  </h4>
                  {unreadCount > 0 ? (
                    <div className="space-y-3 py-1">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        You have <span className="font-bold text-primary-600">{unreadCount}</span> unread message{unreadCount > 1 ? 's' : ''} waiting in your chat inbox.
                      </p>
                      <Link
                        to="/messages"
                        onClick={() => setNotiOpen(false)}
                        className="block text-center w-full bg-primary-50 text-primary-700 text-xs font-bold py-2.5 rounded-xl hover:bg-primary-100 transition-colors"
                      >
                        Go to Inbox
                      </Link>
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="text-xs text-slate-400">All caught up! No new notifications.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Profile Dropdown Trigger (Desktop) */}
          {token && user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-emerald-500 text-white font-bold text-sm shadow-md hover:shadow-lg focus:outline-none transition-all transform hover:scale-105"
              >
                {isProfileIncomplete ? (
                  <span className="relative flex h-10 w-10">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-10 w-10 bg-red-500 justify-center items-center font-bold">!</span>
                  </span>
                ) : (
                  getInitials()
                )}
              </button>

              {/* Dropdown Menu Card */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-3xl shadow-xl py-5 px-5 z-50 animate-fade-in">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-primary-700 text-lg border border-primary-50">
                      {getInitials()}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-slate-800 truncate text-sm">{user.name}</h4>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      user.role === 'contractor' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-primary-100 text-primary-800'
                    }`}>
                      {user.role === 'contractor' ? 'Contractor' : 'Customer'}
                    </span>
                  </div>

                  {/* Address and phone details */}
                  <div className="space-y-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl mb-4">
                    {user.phone ? (
                      <div className="flex items-center gap-2">
                        <FiPhone className="text-slate-400" />
                        <span className="truncate">{user.phone}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-500 font-medium animate-pulse">
                        <FiAlertTriangle />
                        <span>Add Phone Number</span>
                      </div>
                    )}

                    {user.address ? (
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-slate-400" />
                        <span className="truncate">{user.address}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-500 font-medium animate-pulse">
                        <FiAlertTriangle />
                        <span>Add Address / Location</span>
                      </div>
                    )}
                  </div>

                  {/* Profile Status warning block */}
                  {isProfileIncomplete && (
                    <div className="p-3 bg-red-50 rounded-2xl border border-red-100 text-red-700 text-xs font-semibold mb-4 flex items-center gap-2">
                      <FiAlertTriangle className="text-sm shrink-0" />
                      <span>Completing profile is mandatory to activate account features.</span>
                    </div>
                  )}

                  <hr className="border-slate-100 my-3" />

                  <div className="space-y-1.5">
                    {!isProfileIncomplete && (
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors"
                      >
                        <FiUser className="text-slate-400" />
                        <span>Edit Profile</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm font-semibold transition-colors"
                    >
                      <FiLogOut className="text-red-500" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-slate-700 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-4 flex flex-col border-t border-slate-100 pt-4 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block text-slate-700 font-semibold px-4 py-2.5 hover:bg-slate-50 rounded-xl"
            >
              {link.name}
            </Link>
          ))}

          {token && !isProfileIncomplete && (
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="block bg-primary-600 text-white text-center px-4 py-2.5 mx-4 rounded-full font-semibold shadow-md"
            >
              Dashboard
            </Link>
          )}

          {token && user && (
            <div className="mx-4 p-4 bg-slate-50 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                    {getInitials()}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{user.name}</h4>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                {unreadCount > 0 && (
                  <Link
                    to="/messages"
                    onClick={() => setIsOpen(false)}
                    className="relative p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                  >
                    <FiBell className="text-lg" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  </Link>
                )}
              </div>

              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                user.role === 'contractor' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-primary-100 text-primary-800'
              }`}>
                {user.role === 'contractor' ? 'Contractor' : 'Customer'}
              </span>

              {isProfileIncomplete ? (
                <div className="p-3 bg-red-100 text-red-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-pulse">
                  <FiAlertTriangle />
                  <span>Profile Completion Required!</span>
                </div>
              ) : (
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-xl text-sm font-semibold"
                >
                  <FiUser className="text-slate-400" />
                  <span>Edit Profile</span>
                </Link>
              )}

              <button
                onClick={() => { setIsOpen(false); handleLogout(); }}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-red-600 hover:bg-red-100/50 rounded-xl text-sm font-semibold"
              >
                <FiLogOut className="text-red-500" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
