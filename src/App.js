import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import your pages
import AuthPages from './pages/auth/AuthPages';
import PropertyDashboard from './pages/admin/PropertyDashboard';
import UserPropertyPage from './pages/user/UserPropertyPage';
import ResetPassword from './pages/auth/ResetPassword';
import AboutPage from './pages/AboutPage';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import PricingPage from './pages/PricingPage';
import CookiePolicy from './pages/Cookiepolicy';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import PropertyDetail from './pages/PropertyDetail';
import HowItWorks from './pages/Howitworks';



// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    return <Navigate to="/admin-dashboard" replace />;
  }
  
  return children;
};

function App() {
  

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/" element={<UserPropertyPage />} />
        <Route path="/properties" element={<UserPropertyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/cookies" element={<CookiePolicy />} />     
        <Route path="/property/:id" element={<PropertyDetail />} />
<Route 
  path="/admin" 
  element={
    <ProtectedAdminRoute>
      <SuperAdminDashboard />
    </ProtectedAdminRoute>
  } 
/>

        
        {/* Auth Routes - Only accessible when NOT logged in */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <AuthPages />
            </PublicRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <AuthPages />
            </PublicRoute>
          } 
        />
        
        {/* Password Reset Route - Public */}
        <Route path="/reset-password" element={<ResetPassword />} />
         
        
        {/* Protected Admin Routes - Only accessible when logged in */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute>
              <PropertyDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;