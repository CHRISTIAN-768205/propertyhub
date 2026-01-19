import React, { useState } from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Heart, Shield, CheckCircle } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Please enter your email address');
      setMessageType('error');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message);
        setMessageType('success');
        setEmail(''); // Clear input on success
      } else {
        setMessage(data.message || 'Subscription failed. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setMessage('Unable to connect. Please try again later.');
      setMessageType('error');
    } finally {
      setLoading(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              PropertyHub
            </h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Kenya's most trusted property rental platform. Find your perfect home with ease and confidence.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-400 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="/" className="text-slate-400 hover:text-white transition-colors">Browse Properties</a></li>
              <li><a href="/login" className="text-slate-400 hover:text-white transition-colors">List Your Property</a></li>
              <li><a href="/about" className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="/how-it-works" className="text-slate-400 hover:text-white transition-colors">
  How It Works
</a></li>
              <li><a href="/pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* For Landlords */}
          <div>
            <h4 className="text-lg font-bold mb-4">For Landlords</h4>
            <ul className="space-y-3">
              <li><a href="/login" className="text-slate-400 hover:text-white transition-colors">Add Property</a></li>
              <li><a href="/login" className="text-slate-400 hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="/login" className="text-slate-400 hover:text-white transition-colors">Manage Bookings</a></li>
              <li><a href="/login" className="text-slate-400 hover:text-white transition-colors">Analytics</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-4">Support</h4>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2 text-slate-400">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span className="text-sm">Nairobi, Kenya<br />P.O. Box 12345</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone size={18} className="flex-shrink-0" />
                <span className="text-sm">+254 712 345 678</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail size={18} className="flex-shrink-0" />
                <span className="text-sm">info@propertyhub.co.ke</span>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div>
              <h5 className="font-semibold mb-3">Subscribe to our newsletter</h5>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={loading}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Subscribing...
                    </span>
                  ) : (
                    'Subscribe'
                  )}
                </button>
                
                {/* Success/Error Message */}
                {message && (
                  <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                    messageType === 'success' 
                      ? 'bg-green-900/50 border border-green-700 text-green-300' 
                      : 'bg-red-900/50 border border-red-700 text-red-300'
                  }`}>
                    {messageType === 'success' ? (
                      <CheckCircle size={16} className="flex-shrink-0" />
                    ) : (
                      <Mail size={16} className="flex-shrink-0" />
                    )}
                    <span>{message}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} PropertyHub. All rights reserved. 
              Made with <Heart size={14} className="inline text-red-500 mx-1" /> in Kenya
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <a href="/privacy" className="text-slate-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-slate-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="/cookies" className="text-slate-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
              <div className="flex items-center gap-2 text-green-400">
                <Shield size={14} />
                <span className="font-medium">Secure</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <CheckCircle size={14} />
                <span className="font-medium">Trusted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

