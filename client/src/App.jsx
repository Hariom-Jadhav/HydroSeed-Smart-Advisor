import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadArea from './pages/UploadArea';
import Profile from './pages/Profile';
import Messages from './pages/Messages';

const ProfileGuard = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        // Profile is incomplete if name, phone, or address is missing
        const isIncomplete = !user.name || !user.phone || !user.address;
        
        if (isIncomplete && location.pathname !== '/profile') {
          navigate('/profile', { replace: true });
        }
      } catch (e) {
        console.error('Error parsing user in ProfileGuard', e);
      }
    }
  }, [location.pathname, navigate]);

  return children;
};

function App() {
  return (
    <Router>
      <ProfileGuard>
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analysis" element={<UploadArea />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/messages" element={<Messages />} />
            </Routes>
          </main>
        </div>
      </ProfileGuard>
    </Router>
  );
}

export default App;
