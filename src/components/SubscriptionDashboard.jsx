// src/components/SubscriptionDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Crown, Star, TrendingUp, CheckCircle } from 'lucide-react';

export default function SubscriptionDashboard() {
  const [subscription, setSubscription] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
    fetchStats();
  }, []);

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('${API_URL}/api/subscriptions/current', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSubscription(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('${API_URL}/api/bookings/commissions/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpgrade = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('${API_URL}/api/subscriptions/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentMethod: 'mpesa' })
      });
      
      if (response.ok) {
        alert('Successfully upgraded to Premium!');
        fetchSubscription();
      }
    } catch (error) {
      console.error('Upgrade error:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-slate-800 mb-8">Subscription & Billing</h2>
      
      {/* Current Plan */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className={`rounded-2xl p-6 ${subscription?.plan === 'premium' ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' : 'bg-gradient-to-br from-blue-50 to-cyan-50'}`}>
          <div className="flex items-center gap-3 mb-4">
            {subscription?.plan === 'premium' ? <Crown size={32} /> : <Star size={32} />}
            <div>
              <h3 className="text-xl font-bold">
                {subscription?.plan === 'premium' ? 'Premium Plan' : 'Free Plan'}
              </h3>
              <p className="text-sm opacity-90">
                {subscription?.commissionRate}% commission on bookings
              </p>
            </div>
          </div>
          
          {subscription?.plan === 'free' && (
            <button
              onClick={handleUpgrade}
              className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-xl transition-all"
            >
              Upgrade to Premium - KES 1,000/mo
            </button>
          )}
        </div>
        
        {/* Stats */}
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
          <h4 className="font-bold text-slate-800 mb-4">Commission Statistics</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Total Bookings:</span>
              <span className="font-bold">{stats?.totalBookings || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Total Commission Paid:</span>
              <span className="font-bold text-red-600">
                KES {(stats?.totalCommissionPaid || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Average per Booking:</span>
              <span className="font-bold">
                KES {(stats?.averageCommission || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Savings Calculator */}
      {subscription?.plan === 'free' && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
          <h4 className="font-bold text-slate-800 mb-4">💰 Premium Savings Calculator</h4>
          <p className="text-sm text-slate-600 mb-4">
            See how much you'd save with Premium on your next booking:
          </p>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-slate-600 mb-2">FREE Plan</p>
              <p className="text-2xl font-bold text-red-600">KES 7,500</p>
              <p className="text-xs text-slate-500">15% commission</p>
            </div>
            <div className="bg-purple-100 rounded-xl p-4">
              <p className="text-sm text-purple-800 mb-2">PREMIUM Plan</p>
              <p className="text-2xl font-bold text-purple-600">KES 3,500</p>
              <p className="text-xs text-purple-600">KES 1,000 + 5%</p>
            </div>
          </div>
          <p className="text-center mt-4 font-bold text-green-700">
            Save KES 4,000 per booking!
          </p>
        </div>
      )}
    </div>
  );
}
