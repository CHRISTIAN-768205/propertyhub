import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Home, Eye, EyeOff, Shield } from 'lucide-react';

export default function AuthPages() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    adminSecretCode: ''
  });
  const [resetEmail, setResetEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 2) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 3) return { strength: 2, label: 'Medium', color: 'bg-yellow-500' };
    if (strength <= 4) return { strength: 3, label: 'Strong', color: 'bg-green-500' };
    return { strength: 4, label: 'Very Strong', color: 'bg-green-600' };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && !formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!isLogin && !formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    // ✅ REMOVED STRICT PASSWORD VALIDATION - Backend will handle it

    if (!isLogin && !formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
     const API_URL = process.env.REACT_APP_API_URL || '${API_URL}';

const endpoint = isLogin 
  ? `${API_URL}/api/auth/login` 
  : `${API_URL}/api/auth/register`;
  
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          ...((!isLogin) && {
            fullName: formData.fullName,
            phone: formData.phone,
            adminSecretCode: formData.adminSecretCode || undefined
          })
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store credentials
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Show success message for super admin
        if (data.role === 'superadmin') {
          alert('🎉 ' + data.message);
        }
        
        // 🎯 SMART ROUTING BASED ON ROLE
        switch(data.role) {
          case 'superadmin':
            navigate('/admin');
            break;
          case 'landlord':
          case 'admin':
            navigate('/dashboard');
            break;
          case 'tenant':
          case 'user':
            navigate('/');
            break;
          default:
            navigate('/');
        }
      } else {
        setErrors({ submit: data.message || 'Authentication failed. Please check your credentials.' });
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ submit: 'Unable to connect to server. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!resetEmail.trim()) {
      alert('Please enter your email address');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('${API_URL}/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Password reset instructions have been sent to your email!');
        setShowForgotPassword(false);
        setResetEmail('');
      } else {
        alert(data.message || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setShowAdminCode(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      adminSecretCode: ''
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-0 right-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '6s'}}></div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Reset Password</h2>
            <p className="text-slate-600 mb-6">Enter your email address and we'll send you instructions to reset your password.</p>
            
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail('');
                  }}
                  className="flex-1 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-100 transition-all"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-bold hover:shadow-xl transition-all disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/90 backdrop-blur rounded-3xl mb-4 shadow-2xl">
            <Home className="text-purple-600" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            PropertyHub
          </h1>
          <p className="text-white/90 text-lg drop-shadow">
            {isLogin ? 'Welcome back!' : 'Join PropertyHub'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              {isLogin 
                ? 'Sign in to access your account' 
                : 'Sign up to get started'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Full Name - Signup Only */}
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-3 rounded-lg border ${
                      errors.fullName ? 'border-red-500' : 'border-slate-300'
                    } focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-4 py-3 rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-slate-300'
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone - Signup Only */}
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-3 rounded-lg border ${
                      errors.phone ? 'border-red-500' : 'border-slate-300'
                    } focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none`}
                    placeholder="+254 712 345 678"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            )}

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-11 py-3 rounded-lg border ${
                    errors.password ? 'border-red-500' : 'border-slate-300'
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
              
              {/* Password Strength Indicator - Signup Only */}
              {!isLogin && formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-600">Password Strength:</span>
                    <span className={`text-xs font-bold ${
                      getPasswordStrength(formData.password).strength <= 2 ? 'text-red-600' :
                      getPasswordStrength(formData.password).strength === 3 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {getPasswordStrength(formData.password).label}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full ${
                          level <= getPasswordStrength(formData.password).strength
                            ? getPasswordStrength(formData.password).color
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-slate-600 space-y-1">
                    <p className="font-medium">Recommended:</p>
                    <ul className="list-disc list-inside space-y-0.5 ml-2">
                      <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                        At least 8 characters
                      </li>
                      <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                        One uppercase letter
                      </li>
                      <li className={/[a-z]/.test(formData.password) ? 'text-green-600' : ''}>
                        One lowercase letter
                      </li>
                      <li className={/\d/.test(formData.password) ? 'text-green-600' : ''}>
                        One number
                      </li>
                      <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-600' : ''}>
                        One special character (!@#$%...)
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password - Signup Only */}
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-3 rounded-lg border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-slate-300'
                    } focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none`}
                    placeholder="Confirm your password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* 🔐 ADMIN SECRET CODE - Signup Only */}
            {!isLogin && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Admin Access
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAdminCode(!showAdminCode)}
                    className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                  >
                    <Shield size={14} />
                    {showAdminCode ? 'Hide Code' : 'Super Admin?'}
                  </button>
                </div>
                
                {showAdminCode && (
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-4">
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" size={20} />
                      <input
                        type="password"
                        name="adminSecretCode"
                        value={formData.adminSecretCode}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white"
                        placeholder="Enter super admin secret code"
                      />
                    </div>
                    <p className="text-xs text-red-700 mt-2 flex items-center gap-1">
                      🔒 Only authorized personnel have this code
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Forgot Password - Login Only */}
            {isLogin && (
              <div className="flex items-center justify-end mb-6">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white py-3 rounded-lg font-bold text-lg hover:shadow-xl transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>

            {/* Switch Mode */}
            <div className="text-center">
              <p className="text-slate-600 text-sm">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-purple-600 hover:text-purple-700 font-bold"
                  disabled={loading}
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* User Access Info */}
        <div className="mt-6 text-center">
          <p className="text-white drop-shadow text-sm">
            Just browsing properties?{' '}
            <a href="/" className="text-white font-bold underline hover:text-yellow-200">
              View Properties
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
