import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import InternshipsPage from './pages/InternshipsPage';
import CompaniesPage from './pages/CompaniesPage';
import SavedJobsPage from './pages/SavedJobsPage';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = window.location;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
}

// Admin Route Component
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = window.location;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

export default function AppInner() {
  const { theme } = useTheme();

  return (
    <Router>
      <div className={`min-h-screen transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-black' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className="relative">
          {/* Enhanced Background Effects */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse ${
              theme === 'dark' ? 'bg-blue-600' : 'bg-blue-400'
            }`} />
            <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse delay-1000 ${
              theme === 'dark' ? 'bg-cyan-600' : 'bg-sky-400'
            }`} />
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-20 animate-pulse delay-500 ${
              theme === 'dark' ? 'bg-blue-500' : 'bg-blue-300'
            }`} />
          </div>

          {/* Grid Pattern Overlay */}
          <div className={`fixed inset-0 opacity-5 pointer-events-none ${
            theme === 'dark' ? 'bg-white' : 'bg-gray-900'
          }`} style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }} />

          <Header />
          
          <main className="relative z-10">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/internships" element={<InternshipsPage />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/saved" element={<SavedJobsPage />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </div>
    </Router>
  );
}
