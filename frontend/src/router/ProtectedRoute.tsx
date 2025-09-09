import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LoadingSpinner } from '@/components/core';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission 
}) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Authenticating..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user account is active
  if (user?.account_status !== 'active') {
    if (user?.account_status === 'pending_verification') {
      return <Navigate to="/verify-email" replace />;
    }
    if (user?.account_status === 'password_expired') {
      return <Navigate to="/change-password" replace />;
    }
    // For other statuses (suspended, inactive), redirect to login
    return <Navigate to="/login" replace />;
  }

  // Check permissions if required
  if (requiredPermission && user) {
    const hasPermission = user.roles.some(role =>
      role.role_permissions.some(permission => permission.codename === requiredPermission)
    );
    
    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};