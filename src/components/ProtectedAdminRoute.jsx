// src/components/ProtectedAdminRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthorization();
  }, []);

  const checkAuthorization = async () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'superadmin') {
      setIsAuthorized(false);
      setLoading(false);
      return;
    }

    // Verify token with backend
    try {
      const response = await fetch('http://localhost:5000/api/admin/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
      }
    } catch (error) {
      console.error('Authorization error:', error);
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;