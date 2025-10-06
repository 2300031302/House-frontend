import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('user' | 'professional' | 'admin')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { state } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
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
  if (!state.isAuthenticated) {
    return <Navigate to="/login/user" state={{ from: location }} replace />;
  }

  if (state.userType && !allowedRoles.includes(state.userType)) {
    // Redirect to appropriate dashboard based on user type
    switch (state.userType) {
      case 'user':
        return <Navigate to="/dashboard/user" replace />;
      case 'professional':
        return <Navigate to="/dashboard/professional" replace />;
      case 'admin':
        return <Navigate to="/dashboard/admin" replace />;
      default:
        return <Navigate to="/login/user" replace />;
    }
  }

  return <>{children}</>;
}