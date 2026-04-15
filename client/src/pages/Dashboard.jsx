import React from 'react';
import { FiTrendingUp, FiMap, FiAward } from 'react-icons/fi';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">User Dashboard</h1>
        <p className="text-slate-500">Welcome back, John Doe. Here is your land synthesis overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass p-6 border-l-4 border-l-green-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-600"><FiMap className="text-2xl" /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Mapped Area</p>
              <h3 className="text-2xl font-bold text-slate-800">2.5 Acres</h3>
            </div>
          </div>
        </div>
        <div className="glass p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600"><FiTrendingUp className="text-2xl" /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Average Suitability</p>
              <h3 className="text-2xl font-bold text-slate-800">86%</h3>
            </div>
          </div>
        </div>
        <div className="glass p-6 border-l-4 border-l-purple-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg text-purple-600"><FiAward className="text-2xl" /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Active Quotes</p>
              <h3 className="text-2xl font-bold text-slate-800">3 Pending</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Analyses</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-200 rounded-lg bg-cover bg-center" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1592424001807-6953f93ce0db?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80")'}}></div>
                <div>
                  <h4 className="font-bold text-slate-800">North Ridge Plot</h4>
                  <p className="text-sm text-slate-500">High vegetation need • Loam Soil</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-1">Score: 92/100</span>
                <p className="text-xs text-slate-400">2 days ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Nearby Contractors</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-4 border border-slate-100 rounded-xl hover:border-primary-200 transition-colors">
                <h4 className="font-bold text-slate-800">GreenX Hydroseeding</h4>
                <div className="flex items-center gap-1 text-yellow-400 text-sm my-1">
                  ★ ★ ★ ★ ★ <span className="text-slate-400 ml-1">(42)</span>
                </div>
                <p className="text-sm text-slate-500 mb-2">3.2 miles away</p>
                <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                  Request Quote
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
