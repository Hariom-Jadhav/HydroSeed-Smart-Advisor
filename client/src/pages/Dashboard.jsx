import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiMap, FiAward, FiLock, FiMessageSquare, FiBriefcase, FiUser, FiActivity, FiStar, FiCheckCircle } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  let userName = 'User';
  let currentUser = null;
  
  if (userStr) {
    try {
      currentUser = JSON.parse(userStr);
      if (currentUser.name) userName = currentUser.name;
    } catch(e) {}
  }

  const [usersList, setUsersList] = useState([]);
  const [analysesList, setAnalysesList] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Customer feedback & review states
  const [activeFeedbacks, setActiveFeedbacks] = useState([]);
  const [fetchingFeedbacks, setFetchingFeedbacks] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  const fetchFeedbacks = async (contractorId) => {
    try {
      setFetchingFeedbacks(true);
      setFeedbackError('');
      setFeedbackSuccess('');
      const res = await axios.get(`${API_URL}/api/v1/feedbacks/contractor/${contractorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.status === 'success') {
        setActiveFeedbacks(res.data.data.feedbacks);
      }
    } catch (err) {
      console.error("Failed to fetch feedbacks", err);
    } finally {
      setFetchingFeedbacks(false);
    }
  };

  const handleContractorClick = (contractorId) => {
    if (expandedUser === contractorId) {
      setExpandedUser(null);
      setActiveFeedbacks([]);
    } else {
      setExpandedUser(contractorId);
      setRating(5);
      setComment('');
      setFeedbackError('');
      setFeedbackSuccess('');
      fetchFeedbacks(contractorId);
    }
  };

  const handleSubmitFeedback = async (e, contractorId) => {
    e.preventDefault();
    if (!comment.trim()) {
      setFeedbackError('Please enter a comment.');
      return;
    }
    try {
      setSubmittingFeedback(true);
      setFeedbackError('');
      setFeedbackSuccess('');
      const res = await axios.post(`${API_URL}/api/v1/feedbacks`, {
        contractorId,
        rating,
        comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.status === 'success') {
        setFeedbackSuccess('Thank you for your feedback! The contractor has been notified.');
        setComment('');
        setRating(5);
        fetchFeedbacks(contractorId);
        
        // Refresh contractor list to display new ratings immediately
        const typeToFetch = currentUser.role === 'contractor' ? 'customer' : 'service_provider';
        const usersRes = await axios.get(`${API_URL}/api/v1/users?userType=${typeToFetch}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (usersRes.data.status === 'success') {
          setUsersList(usersRes.data.data.users);
        }
      }
    } catch (err) {
      console.error("Feedback submission error:", err);
      setFeedbackError(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setSubmittingFeedback(false);
    }
  };
  
  useEffect(() => {
    if (token && currentUser) {
      const fetchUsers = async () => {
        try {
          setLoading(true);
          const typeToFetch = currentUser.role === 'contractor' ? 'customer' : 'service_provider';
          const res = await axios.get(`${API_URL}/api/v1/users?userType=${typeToFetch}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data.status === 'success') {
            setUsersList(res.data.data.users);
          }
        } catch (err) {
          console.error("Failed to fetch users list", err);
        } finally {
          setLoading(false);
        }
      };

      const fetchAnalyses = async () => {
        if (currentUser.role !== 'contractor') {
          try {
            const res = await axios.get(`${API_URL}/api/v1/analyses`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.status === 'success') {
              setAnalysesList(res.data.data.analyses);
            }
          } catch (err) {
            console.error("Failed to fetch past analyses", err);
          }
        }
      };

      fetchUsers();
      fetchAnalyses();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleStartMessage = (user) => {
    navigate('/messages', { state: { startChatWith: user } });
  };

  if (!token) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center animate-fade-in">
        <div className="glass max-w-lg mx-auto p-10 rounded-3xl flex flex-col items-center border border-slate-100 shadow-xl">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <FiLock className="text-4xl text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Dashboard Access Restricted</h2>
          <p className="text-slate-500 mb-8">Please log in or register to view your land synthesis overview, manage quotes, and discover local contractors.</p>
          <div className="flex gap-4 w-full justify-center">
            <Link to="/login" className="px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors">
              Log In
            </Link>
            <Link to="/login" className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // CONTRACTOR DASHBOARD (Streamlined Business Portal)
  if (currentUser?.role === 'contractor') {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            Contractor Console
          </span>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Business Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back, {userName}. Manage your bids and discover client opportunities.</p>
        </div>

        {/* Business Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass p-6 border-l-4 border-l-emerald-500 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                <FiActivity className="text-2xl" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Rate</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-0.5">
                  ₹{currentUser.pricePerSqFt ? parseFloat(currentUser.pricePerSqFt).toFixed(2) : '12.00'}/sq.ft
                </h3>
              </div>
            </div>
          </div>
          
          <div className="glass p-6 border-l-4 border-l-indigo-500 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                <FiBriefcase className="text-2xl" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Company Name</p>
                <h3 className="text-lg font-bold text-slate-800 truncate mt-1">
                  {currentUser.companyName || 'Not Specified'}
                </h3>
              </div>
            </div>
          </div>

          <div className="glass p-6 border-l-4 border-l-primary-500 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-50 rounded-2xl text-primary-600">
                <FiUser className="text-2xl" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Leads Available</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-0.5">
                  {usersList.length} Active Clients
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Streamlined Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Available Leads section */}
          <div className="lg:col-span-2 glass p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
              <span>Available Project Leads</span>
              <span className="bg-primary-100 text-primary-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                New
              </span>
            </h2>
            
            {loading ? (
              <div className="text-center py-10 text-slate-400 text-sm">Searching for local project leads...</div>
            ) : usersList.length === 0 ? (
              <div className="text-center py-12 bg-slate-50/50 border border-slate-100 rounded-3xl">
                <p className="text-slate-500 font-medium">No customer land enquiries registered yet.</p>
                <p className="text-xs text-slate-400 mt-1">We will notify you immediately once a client draws their plot!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {usersList.map((client) => (
                  <div 
                    key={client._id}
                    className={`p-5 border rounded-2xl transition-all cursor-pointer bg-white/50 hover:bg-white ${
                      expandedUser === client._id 
                        ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/10' 
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                    onClick={() => setExpandedUser(expandedUser === client._id ? null : client._id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-800 text-base">{client.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{client.address || 'Address not listed'}</p>
                      </div>
                      <span className="bg-primary-50 text-primary-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg">
                        Landowner
                      </span>
                    </div>

                    {expandedUser === client._id && (
                      <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in text-sm text-slate-600 space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="block text-slate-400">Phone Number:</span>
                            <span className="font-semibold text-slate-800">{client.phone || 'Not provided'}</span>
                          </div>
                          <div>
                            <span className="block text-slate-400">Service Location:</span>
                            <span className="font-semibold text-slate-800">{client.address || 'Not provided'}</span>
                          </div>
                        </div>

                        <button 
                          onClick={(e) => { e.stopPropagation(); handleStartMessage(client); }}
                          className="w-full py-2.5 flex justify-center items-center gap-2 bg-gradient-to-r from-emerald-600 to-primary-600 hover:from-emerald-700 hover:to-primary-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                        >
                          <FiMessageSquare /> Connect & Send Quote
                        </button>
                      </div>
                    )}

                    {expandedUser !== client._id && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleStartMessage(client); }}
                        className="w-full mt-3 py-2 flex justify-center items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                      >
                        <FiMessageSquare /> Message Client
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Streamlined Business Sidebar */}
          <div className="glass p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Operations Console</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                  <FiCheckCircle className="text-emerald-600 text-lg shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Business Profile Verified</h4>
                    <p className="text-[10px] text-slate-500">Your profile details are complete & public.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                  <FiAward className="text-indigo-600 text-lg shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Rupee Pricing Active</h4>
                    <p className="text-[10px] text-slate-500">Bids display correctly in Indian Rupees (₹).</p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">Service Guidelines</h4>
              <ul className="text-xs text-slate-500 space-y-2.5 list-disc pl-4 leading-relaxed">
                <li>Check project leads regularly to bid first.</li>
                <li>Your pricing is explicitly marked as dependent on the client's local soil quality and slurry materials.</li>
                <li>Communicate pricing details and custom quotes directly in messages.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LANDOWNER (USER) DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          Landowner Center
        </span>
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Your Land Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back, {userName}. Synthesize your plot suitability and manage contractor quotes.</p>
      </div>

      {/* Landowner Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="glass p-6 border-l-4 border-l-blue-500 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <FiTrendingUp className="text-2xl" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">AI Suitability</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-0.5">
                {analysesList.length > 0 
                  ? `${Math.round(analysesList.reduce((acc, curr) => acc + curr.score, 0) / analysesList.length)}% Avg` 
                  : 'N/A'}
              </h3>
            </div>
          </div>
        </div>

        <div className="glass p-6 border-l-4 border-l-purple-500 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
              <FiAward className="text-2xl" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Quotes</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-0.5">3 Active</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Land Analyses (or dynamic empty state if none exist yet) */}
        <div className="lg:col-span-2 glass p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
              <span>Recent Land Analyses</span>
              {analysesList.length > 0 && (
                <span className="bg-primary-100 text-primary-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {analysesList.length} Archived
                </span>
              )}
            </h2>
            
            {analysesList.length > 0 ? (
              <div className="space-y-4">
                {analysesList.slice(0, 3).map((analysis) => (
                  <div 
                    key={analysis._id} 
                    onClick={() => navigate('/analysis')}
                    className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:shadow-sm hover:border-primary-200 transition-all cursor-pointer gap-4"
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div 
                        className="w-16 h-16 bg-slate-200 rounded-xl bg-cover bg-center shrink-0 shadow-sm" 
                        style={{backgroundImage: `url("${analysis.imageUrl}")`}}
                      ></div>
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-slate-800 text-sm truncate">{analysis.soilType} Diagnostic</h4>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{analysis.recommendation || 'No recommendation provided.'}</p>
                      </div>
                    </div>
                    <div className="text-right w-full sm:w-auto shrink-0 flex sm:flex-col justify-between items-center sm:items-end">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold mb-1">
                        Score: {analysis.score}/100
                      </span>
                      <p className="text-[10px] text-slate-400">{new Date(analysis.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 p-8 flex flex-col items-center justify-center my-auto min-h-[250px]">
                <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mb-4 border border-primary-100 text-primary-600">
                  <FiActivity className="text-2xl" />
                </div>
                <h4 className="font-bold text-slate-700 text-sm">No past analyses found</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  You haven't run any terrain diagnostics yet. Upload your soil photo to instantly analyze slope, drainage, compaction, and pH ratings!
                </p>
                <Link
                  to="/analysis"
                  className="mt-5 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Start Free AI Analysis
                </Link>
              </div>
            )}
          </div>
          
          {analysesList.length > 0 && (
            <div className="mt-6 text-center">
              <Link 
                to="/analysis"
                className="inline-block text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Inspect All Analyses in Diagnostic Center →
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Contractors List */}
        <div className="lg:col-span-1 glass p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-5">Nearby Contractors</h2>
          
          {loading ? (
            <div className="text-center py-10 text-slate-400 text-sm">Searching for contractors...</div>
          ) : usersList.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No matching contractors found.</p>
          ) : (
            <div className="space-y-4">
              {usersList.slice(0, 5).map((contractor) => (
                <div 
                  key={contractor._id} 
                  className={`p-4 border rounded-2xl bg-white/40 transition-all cursor-pointer hover:bg-white ${
                    expandedUser === contractor._id 
                      ? 'border-primary-500 shadow-md ring-2 ring-primary-500/5' 
                      : 'border-slate-100 hover:border-primary-200'
                  }`}
                  onClick={() => handleContractorClick(contractor._id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-slate-800 text-sm truncate">
                        {contractor.companyName || contractor.name}
                      </h4>
                      <div className="flex items-center gap-1 text-yellow-500 text-xs my-1">
                        {'★'.repeat(Math.round(contractor.ratingsAverage || 0)) + '☆'.repeat(5 - Math.round(contractor.ratingsAverage || 0))}
                        <span className="text-slate-400 ml-1 font-semibold text-[10px]">
                          ({contractor.ratingsQuantity > 0 ? (contractor.ratingsAverage || 0).toFixed(1) : '0'} • {contractor.ratingsQuantity || 0} reviews)
                        </span>
                      </div>
                    </div>
                    {contractor.pricePerSqFt && (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-1 rounded-lg shrink-0">
                        ₹{contractor.pricePerSqFt}/sq.ft
                      </span>
                    )}
                  </div>
                  
                  <p className="text-[11px] text-slate-400 mt-1 truncate">
                    {contractor.address || 'Location not specified'}
                  </p>
                  
                  {expandedUser === contractor._id && (
                    <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in text-xs text-slate-600 space-y-3" onClick={(e) => e.stopPropagation()}>
                      <p><strong>Contact:</strong> {contractor.phone || 'Not provided'}</p>
                      {contractor.pricePerSqFt && (
                        <div>
                          <p><strong>Price per sq. ft:</strong> ₹{contractor.pricePerSqFt}</p>
                          <p className="text-[9px] text-red-500 mt-0.5 italic">* Price is dependent on your soil and slurry.</p>
                        </div>
                      )}
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleStartMessage(contractor); }}
                        className="w-full mt-2 py-2.5 flex justify-center items-center gap-2 bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                      >
                        <FiMessageSquare /> Connect & Discuss Quote
                      </button>

                      {/* Customer Feedbacks / Reviews list */}
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <h5 className="font-bold text-slate-800 text-xs mb-2">Customer Feedback</h5>
                        {fetchingFeedbacks ? (
                          <p className="text-[10px] text-slate-400 animate-pulse">Loading reviews...</p>
                        ) : activeFeedbacks.length === 0 ? (
                          <p className="text-[10px] text-slate-400 italic">No reviews yet for this contractor.</p>
                        ) : (
                          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                            {activeFeedbacks.map((f) => (
                              <div key={f._id} className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                                <div className="flex justify-between items-center text-[10px] mb-0.5">
                                  <span className="font-bold text-slate-700">{f.customer?.name || 'Customer'}</span>
                                  <span className="text-yellow-500 font-bold">
                                    {'★'.repeat(f.rating) + '☆'.repeat(5 - f.rating)}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-relaxed">{f.comment}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Leave Feedback rating input and form */}
                      {!activeFeedbacks.some(f => f.customer?._id === currentUser?._id || f.customer === currentUser?._id) && (
                        <form onSubmit={(e) => handleSubmitFeedback(e, contractor._id)} className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
                          <h5 className="font-bold text-slate-800 text-xs">Leave a Review</h5>
                          
                          {feedbackError && (
                            <p className="text-[10px] text-red-500 bg-red-50 p-2 rounded-xl border border-red-100">
                              {feedbackError}
                            </p>
                          )}
                          {feedbackSuccess && (
                            <p className="text-[10px] text-green-500 bg-green-50 p-2 rounded-xl border border-green-100 animate-pulse">
                              {feedbackSuccess}
                            </p>
                          )}

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-slate-500">Rating:</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  type="button"
                                  key={star}
                                  onClick={() => setRating(star)}
                                  className="text-sm transition-transform hover:scale-110 focus:outline-none"
                                >
                                  {star <= rating ? (
                                    <span className="text-yellow-500">★</span>
                                  ) : (
                                    <span className="text-slate-300">☆</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <textarea
                              rows="2"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Share your experience working with this contractor..."
                              className="w-full p-2 text-[10px] bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-primary-500 focus:bg-white outline-none transition-all resize-none"
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={submittingFeedback}
                            className="w-full py-2 bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 text-white rounded-xl text-[10px] font-bold shadow-md transition-all disabled:opacity-50"
                          >
                            {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                  
                  {expandedUser !== contractor._id && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleStartMessage(contractor); }}
                      className="w-full mt-3 py-2 flex justify-center items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                    >
                      <FiMessageSquare /> Send Message
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
