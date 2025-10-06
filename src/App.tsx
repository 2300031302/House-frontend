import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import Header from './components/common/Header';
import ProtectedRoute from './components/common/ProtectedRoute';
import UserLogin from './components/auth/UserLogin';
import ProfessionalLogin from './components/auth/ProfessionalLogin';
import AdminLogin from './components/auth/AdminLogin';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import UserDashboard from './components/dashboard/UserDashboard';
import ProfessionalDashboard from './components/dashboard/ProfessionalDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import UserProfile from './components/profile/UserProfile';
import ProfessionalProfile from './components/profile/ProfessionalProfile';

function AppContent() {
  const { state } = useAuth();

  // Show loading state while checking authentication
  if (state.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/login/professional" element={<ProfessionalLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute allowedRoles={['user', 'professional', 'admin']}>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/services" 
            element={
              <ProtectedRoute allowedRoles={['user', 'professional', 'admin']}>
                <ServicesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/user" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/professional" 
            element={
              <ProtectedRoute allowedRoles={['professional']}>
                <ProfessionalDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/user" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/professional" 
            element={
              <ProtectedRoute allowedRoles={['professional']}>
                <ProfessionalProfile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}
function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;