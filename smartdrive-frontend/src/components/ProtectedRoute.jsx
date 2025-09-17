import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setRole(response.data.role);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!role) return <Navigate to="/smartdrive-frontend/login" />;
  if (!allowedRoles.includes(role)) return <Navigate to="/smartdrive-frontend/unauthorized" />;

  return children;
};

export default ProtectedRoute;