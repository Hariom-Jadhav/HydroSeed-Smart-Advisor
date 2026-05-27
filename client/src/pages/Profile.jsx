import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMapPin, FiPhone, FiBriefcase, FiCheck } from 'react-icons/fi';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    companyName: '',
    pricePerSqFt: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
        setFormData({
          name: parsedUser.name || '',
          phone: parsedUser.phone || '',
          address: parsedUser.address || '',
          companyName: parsedUser.companyName || '',
          pricePerSqFt: parsedUser.pricePerSqFt || '',
          role: parsedUser.role || 'user'
        });
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectRole = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const nameVal = (formData.name || '').toString().trim();
    const phoneVal = (formData.phone || '').toString().trim();
    const addressVal = (formData.address || '').toString().trim();

    // Validate name, phone, address, and role safely to prevent runtime crashes
    if (!nameVal || !phoneVal || !addressVal || !formData.role) {
      setMessage({ type: 'error', text: 'All required fields must be completed.' });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch('http://localhost:5000/api/v1/users/updateMe', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.status === 'success') {
        const updatedUser = res.data.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setMessage({ type: 'success', text: 'Update successful! Redirecting to home page...' });
        
        // Force refresh user data across elements by dispatching a custom storage event
        window.dispatchEvent(new Event('storage'));

        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile. Please check your connection.' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center py-20 text-slate-500">Loading profile...</div>;
  }

  const isIncomplete = !user.phone || !user.address || !user.name;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
          {isIncomplete ? 'Complete Your Profile' : 'Your Profile'}
        </h1>
        <p className="text-slate-500 mt-2">
          {isIncomplete 
            ? 'You must complete the details below to unlock your dashboard.' 
            : 'Manage your personal information and contact details.'}
        </p>
      </div>

      <div className="glass p-8 rounded-3xl border border-slate-100 shadow-xl max-w-2xl mx-auto relative overflow-hidden">
        {/* Visual Accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-500 to-emerald-400"></div>

        {isIncomplete && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-800 animate-pulse">
            <span className="text-xl">⚠️</span>
            <div>
              <h4 className="font-bold text-sm">Action Required: Setup Mandatory</h4>
              <p className="text-xs text-amber-700 mt-1">
                Please provide your full name, phone number, address, and select your account type below to activate your account.
              </p>
            </div>
          </div>
        )}

        {message.text && (
          <div className={`p-4 rounded-2xl mb-6 text-sm font-medium transition-all ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="relative">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3.5 text-slate-400 text-lg" />
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          {/* User Classification Mechanism */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2.5">Account Type *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => selectRole('user')}
                className={`flex flex-col items-start p-4 border rounded-2xl transition-all text-left shadow-sm ${
                  formData.role === 'user'
                    ? 'border-primary-600 bg-primary-50/50 ring-2 ring-primary-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between w-full items-center mb-2">
                  <div className={`p-2 rounded-lg ${formData.role === 'user' ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'}`}>
                    <FiUser className="text-lg" />
                  </div>
                  {formData.role === 'user' && <FiCheck className="text-primary-600 font-bold" />}
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Customer / Landowner</h4>
                <p className="text-xs text-slate-500 mt-1">Analyze your soil suitability and receive custom contractor quotes.</p>
              </button>

              <button
                type="button"
                onClick={() => selectRole('contractor')}
                className={`flex flex-col items-start p-4 border rounded-2xl transition-all text-left shadow-sm ${
                  formData.role === 'contractor'
                    ? 'border-primary-600 bg-primary-50/50 ring-2 ring-primary-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between w-full items-center mb-2">
                  <div className={`p-2 rounded-lg ${formData.role === 'contractor' ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'}`}>
                    <FiBriefcase className="text-lg" />
                  </div>
                  {formData.role === 'contractor' && <FiCheck className="text-primary-600 font-bold" />}
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Contractor / Service Provider</h4>
                <p className="text-xs text-slate-500 mt-1">Advertise hydroseeding prices, connect with clients, and bid on jobs.</p>
              </button>
            </div>
          </div>

          {/* Phone Number */}
          <div className="relative">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number *</label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-3.5 text-slate-400 text-lg" />
              <input 
                type="text" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your contact number"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Address / Location */}
          <div className="relative">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Address *</label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-3.5 text-slate-400 text-lg" />
              <input 
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="City, State or Full Address"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Contractor-specific fields */}
          {formData.role === 'contractor' && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 animate-fade-in">
              <h4 className="font-bold text-sm text-slate-800 border-b border-slate-200/60 pb-2">Business Specifications</h4>
              
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Company Name</label>
                <div className="relative">
                  <FiBriefcase className="absolute left-3 top-3 text-slate-400 text-base" />
                  <input 
                    type="text" 
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Your Hydroseeding Business Name"
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Price per Square Foot (₹)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold text-sm">₹</span>
                  <input 
                    type="number" 
                    step="0.01"
                    name="pricePerSqFt"
                    value={formData.pricePerSqFt}
                    onChange={handleChange}
                    placeholder="12.00"
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
                  />
                </div>
                <p className="text-red-500 text-xs font-semibold mt-1.5">
                  * Note: Price is dependent on your soil and slurry.
                </p>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3.5 bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-xl'}`}
          >
            {loading ? 'Saving Details...' : (isIncomplete ? 'Complete Account Activation' : 'Update Profile Details')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
