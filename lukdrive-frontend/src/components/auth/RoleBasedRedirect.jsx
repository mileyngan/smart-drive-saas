import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const RoleBasedRedirect = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    // Should be caught by ProtectedRoute, but as a fallback
    return <Navigate to="/login" />;
  }

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" />;
    case 'student':
      return <Navigate to="/student/dashboard" />;
    case 'instructor':
      return <Navigate to="/instructor/dashboard" />;
    case 'superadmin':
      return <Navigate to="/superadmin/dashboard" />;
    default:
      // Fallback for any other roles or unexpected scenarios
      return <Navigate to="/login" />;
  }
};

export default RoleBasedRedirect;