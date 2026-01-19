import React, { useState } from 'react';
import API_URL from '../config/api';
import { CreditCard, Smartphone, AlertCircle, CheckCircle } from 'lucide-react';
import API_URL from '../config/api';

export default function PaymentModal({ booking, onClose, onPaymentComplete }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'pending', 'success', 'failed'
  const [error, setError] = useState('');

  // Calculate amounts
  const monthlyRent = booking.monthlyRent || 0;
  const platformFee = booking.commissionAmount || 0;
  const totalAmount = monthlyRent + platformFee;

  const handlePayment = async () => {
    setError('');
    setLoading(true);

    // Validate phone number
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    try {
      // Format phone number (add 254 prefix if needed)
      let formattedPhone = phoneNumber.replace(/\s/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.substring(1);
      }
      if (!formattedPhone.startsWith('254')) {
        formattedPhone = '254' + formattedPhone;
      }

      console.log('💳 Initiating payment...', {
        booking: booking._id,
        phone: formattedPhone,
        amount: totalAmount
      });

      // Initiate payment
      const response = await fetch(`${API_URL}/api/payments/${booking._id}/initiate-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          paymentMethod: 'mpesa'
        })
      });

      const data = await response.json();

      if (data.success) {
        setPaymentStatus('pending');
        console.log('✅ Payment initiated:', data.paymentDetails);

        // Start checking payment status
        checkPaymentStatus(booking._id, data.paymentDetails.transactionId);
      } else {
        setError(data.message || 'Payment initiation failed');
        setLoading(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  // Poll payment status
  const checkPaymentStatus = async (bookingId, transactionId) => {
    let attempts = 0;
    const maxAttempts = 60; // Check for 2 minutes (every 2 seconds)

    const interval = setInterval(async () => {
      attempts++;

      try {
        const response = await fetch(`${API_URL}/api/payments/${bookingId}/payment-status`);
        const data = await response.json();

        if (data.success && data.payment.status === 'paid') {
          // Payment successful!
          clearInterval(interval);
          setPaymentStatus('success');
          setLoading(false);

          console.log('✅ Payment confirmed!');

          // Notify parent component
          if (onPaymentComplete) {
            setTimeout(() => onPaymentComplete(data.payment), 2000);
          }
        } else if (data.success && data.payment.status === 'failed') {
          // Payment failed
          clearInterval(interval);
          setPaymentStatus('failed');
          setLoading(false);
          setError('Payment was not completed. Please try again.');
        } else if (attempts >= maxAttempts) {
          // Timeout
          clearInterval(interval);
          setPaymentStatus('failed');
          setLoading(false);
          setError('Payment verification timed out. Please check your M-Pesa messages.');
        }
      } catch (error) {
        console.error('Status check error:', error);
      }
    }, 2000); // Check every 2 seconds
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              Complete Payment
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
              disabled={loading}
            >
              ✕
            </button>
          </div>

          {/* Payment Status */}
          {paymentStatus === 'pending' && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6 text-center">
              <Smartphone className="mx-auto mb-4 text-yellow-600" size={48} />
              <h3 className="font-bold text-yellow-800 mb-2">Check Your Phone</h3>
              <p className="text-sm text-yellow-700">
                Enter your M-Pesa PIN to complete payment
              </p>
              <div className="mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto"></div>
              </div>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6 text-center">
              <CheckCircle className="mx-auto mb-4 text-green-600" size={48} />
              <h3 className="font-bold text-green-800 mb-2">Payment Successful!</h3>
              <p className="text-sm text-green-700">
                Your booking has been confirmed
              </p>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6 text-center">
              <AlertCircle className="mx-auto mb-4 text-red-600" size={48} />
              <h3 className="font-bold text-red-800 mb-2">Payment Failed</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Amount Breakdown */}
          {!paymentStatus && (
            <>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-slate-800 mb-4">Payment Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Monthly Rent:</span>
                    <span className="font-bold">KES {monthlyRent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-blue-600">
                    <span>Platform Fee ({booking.commissionRate}%):</span>
                    <span className="font-bold">KES {platformFee.toLocaleString()}</span>
                  </div>
                  <div className="border-t-2 border-purple-200 pt-3 flex justify-between text-lg">
                    <span className="font-bold">Total Amount:</span>
                    <span className="font-bold text-purple-600">
                      KES {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-4">
                  * Platform fee applies only to first month
                </p>
              </div>

              {/* Phone Number Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  M-Pesa Phone Number
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0712345678"
                    className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  You'll receive an M-Pesa prompt on this number
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={loading || !phoneNumber}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Pay KES ${totalAmount.toLocaleString()}`}
              </button>

              {/* Info */}
              <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <h4 className="font-bold text-blue-800 mb-2">How it works:</h4>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Click "Pay" to initiate M-Pesa payment</li>
                  <li>Check your phone for M-Pesa prompt</li>
                  <li>Enter your M-Pesa PIN</li>
                  <li>Receive confirmation SMS</li>
                  <li>Booking confirmed automatically!</li>
                </ol>
              </div>
            </>
          )}

          {/* Close Button (after success/failure) */}
          {paymentStatus && (
            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all mt-4"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

