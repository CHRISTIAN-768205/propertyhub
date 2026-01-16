// src/components/BookingModal.jsx

import React, { useState } from 'react';
import { Calendar, DollarSign, CheckCircle } from 'lucide-react';

export default function BookingModal({ property, onClose, onBook }) {
  const [moveInDate, setMoveInDate] = useState('');
  const [leaseDuration, setLeaseDuration] = useState(12);
  const [loading, setLoading] = useState(false);
  
  const userPlan = localStorage.getItem('userPlan') || 'free';
  const commissionRate = userPlan === 'premium' ? 5 : 15;
  const commissionAmount = (property.price * commissionRate) / 100;
  const totalFirstMonth = property.price + commissionAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: property._id,
          moveInDate,
          leaseDuration
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Booking request sent successfully!');
        onBook(data.booking);
        onClose();
      } else {
        alert(data.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">
            Book This Property
          </h2>
          
          {/* Property Details */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-xl text-slate-800 mb-2">{property.title}</h3>
            <p className="text-slate-600">{property.address}</p>
            <div className="mt-4 flex items-center gap-2">
              <DollarSign className="text-blue-600" size={24} />
              <span className="text-2xl font-bold text-slate-800">
                KES {property.price.toLocaleString()}/month
              </span>
            </div>
          </div>
          
          {/* Commission Breakdown */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6">
            <h4 className="font-bold text-slate-800 mb-4">💰 Payment Breakdown</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Monthly Rent:</span>
                <span className="font-bold">KES {property.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-blue-600">
                <span>PropertyHub Fee ({commissionRate}%):</span>
                <span className="font-bold">KES {commissionAmount.toLocaleString()}</span>
              </div>
              <div className="border-t-2 border-yellow-300 pt-2 flex justify-between text-lg font-bold">
                <span>Total First Month:</span>
                <span>KES {totalFirstMonth.toLocaleString()}</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                * Fee applies only to first month. Future months: direct payment to landlord
              </p>
            </div>
          </div>
          
          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Move-In Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Lease Duration
              </label>
              <select
                value={leaseDuration}
                onChange={(e) => setLeaseDuration(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value={6}>6 months</option>
                <option value={12}>12 months (1 year)</option>
                <option value={24}>24 months (2 years)</option>
              </select>
            </div>
            
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}