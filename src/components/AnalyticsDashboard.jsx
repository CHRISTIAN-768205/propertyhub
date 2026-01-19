import React, { useState, useEffect } from 'react';
import { 
  Eye, MousePointer, MessageSquare, MapPin, Bookmark, 
  TrendingUp, DollarSign, Award, BarChart3, PieChart,
  Calendar, Phone, Mail, Share2, X
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RePieChart, Pie, Cell } from 'recharts';

const AnalyticsDashboard = ({ propertyId, onClose }) => {
  const [analytics, setAnalytics] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('property'); // 'property' or 'overview'

  useEffect(() => {
    if (propertyId && viewMode === 'property') {
      fetchPropertyAnalytics();
    } else if (viewMode === 'overview') {
      fetchOverview();
    }
  }, [propertyId, viewMode]);

  const fetchPropertyAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/analytics/property/${propertyId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAnalytics(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  const fetchOverview = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('${API_URL}/api/analytics/overview', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setOverview(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching overview:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen p-4 flex items-start justify-center py-8">
        <div className="bg-white rounded-3xl max-w-7xl w-full shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-3xl relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-all"
            >
              <X size={24} />
            </button>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <BarChart3 size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
                <p className="text-white/90">Track your property performance</p>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-white/10 backdrop-blur rounded-lg p-1 inline-flex">
              <button
                onClick={() => setViewMode('property')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  viewMode === 'property'
                    ? 'bg-white text-blue-600'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Property View
              </button>
              <button
                onClick={() => setViewMode('overview')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  viewMode === 'overview'
                    ? 'bg-white text-blue-600'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Overview
              </button>
            </div>
          </div>

          <div className="p-8">
            {viewMode === 'property' && analytics ? (
              <PropertyAnalytics analytics={analytics} />
            ) : viewMode === 'overview' && overview ? (
              <OverviewAnalytics overview={overview} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

// Property Analytics View
const PropertyAnalytics = ({ analytics }) => {
  const stats = [
    {
      icon: Eye,
      label: 'Total Views',
      value: analytics.analytics.views.total,
      thisMonth: analytics.analytics.views.thisMonth,
      color: 'blue',
      trend: '+12%'
    },
    {
      icon: MousePointer,
      label: 'Total Clicks',
      value: analytics.analytics.clicks.total,
      thisMonth: analytics.analytics.clicks.thisMonth,
      color: 'green',
      trend: '+8%'
    },
    {
      icon: MessageSquare,
      label: 'Inquiries',
      value: analytics.analytics.inquiries.total,
      thisMonth: analytics.analytics.inquiries.thisMonth,
      color: 'purple',
      trend: '+15%'
    },
    {
      icon: MapPin,
      label: 'Near Me Views',
      value: analytics.analytics.nearMeImpressions.total,
      thisMonth: analytics.analytics.nearMeImpressions.thisMonth,
      color: 'orange',
      trend: '+20%'
    },
    {
      icon: Bookmark,
      label: 'Bookmarks',
      value: analytics.analytics.bookmarks.total,
      thisMonth: analytics.analytics.bookmarks.thisMonth,
      color: 'pink',
      trend: '+5%'
    },
    {
      icon: DollarSign,
      label: 'Revenue',
      value: `KES ${analytics.analytics.bookings.revenue.toLocaleString()}`,
      thisMonth: analytics.analytics.bookings.total,
      color: 'emerald',
      trend: '+25%'
    }
  ];

  const conversionData = [
    { name: 'Views', value: analytics.analytics.views.total },
    { name: 'Clicks', value: analytics.analytics.clicks.total },
    { name: 'Inquiries', value: analytics.analytics.inquiries.total },
    { name: 'Bookings', value: analytics.analytics.bookings.total }
  ];

  const clickTypeData = [
    { name: 'Phone', value: analytics.analytics.clicks.phoneClicks, color: '#3B82F6' },
    { name: 'Email', value: analytics.analytics.clicks.emailClicks, color: '#10B981' },
    { name: 'WhatsApp', value: analytics.analytics.clicks.whatsappClicks, color: '#25D366' }
  ];

  return (
    <div className="space-y-6">
      {/* Property Title */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{analytics.title}</h3>
        {analytics.featured?.isActive && (
          <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-bold">
            ⭐ Featured
          </span>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-gray-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                  <Icon size={24} className={`text-${stat.color}-600`} />
                </div>
                <span className="text-green-600 text-sm font-semibold">{stat.trend}</span>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
              <div className="text-xs text-gray-500 mt-2">This month: {stat.thisMonth}</div>
            </div>
          );
        })}
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
        <h3 className="text-xl font-bold mb-6">Conversion Funnel</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={conversionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Rates */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {analytics.analytics.conversionRates.viewToClick}%
          </div>
          <div className="text-sm text-gray-700">View → Click Rate</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {analytics.analytics.conversionRates.clickToInquiry}%
          </div>
          <div className="text-sm text-gray-700">Click → Inquiry Rate</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {analytics.analytics.conversionRates.inquiryToBooking}%
          </div>
          <div className="text-sm text-gray-700">Inquiry → Booking Rate</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {analytics.analytics.conversionRates.overall}%
          </div>
          <div className="text-sm text-gray-700">Overall Conversion</div>
        </div>
      </div>

      {/* Click Types Distribution */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
        <h3 className="text-xl font-bold mb-6">Contact Method Preferences</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={clickTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {clickTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
          
          <div className="space-y-4">
            {clickTypeData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: item.color }}></div>
                  <span className="font-semibold">{item.name}</span>
                </div>
                <span className="text-2xl font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Award size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Performance Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✅ Your view-to-click rate is {analytics.analytics.conversionRates.viewToClick > 5 ? 'excellent' : 'good'}!</li>
              <li>💡 Add more photos to increase engagement</li>
              <li>🎯 Boost this property to get 10x more views</li>
              <li>📸 Properties with 8+ photos get 3x more inquiries</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Analytics View
const OverviewAnalytics = ({ overview }) => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
          <div className="text-3xl font-bold text-gray-800 mb-2">{overview.totalProperties}</div>
          <div className="text-sm text-gray-600">Total Properties</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
          <div className="text-3xl font-bold text-blue-600 mb-2">{overview.totalViews.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Views</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
          <div className="text-3xl font-bold text-green-600 mb-2">KES {overview.totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
      </div>

      {/* Top Performer */}
      {overview.topPerformer && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <Award size={32} className="text-purple-600" />
            <h3 className="text-2xl font-bold text-gray-800">Top Performer</h3>
          </div>
          <div className="bg-white rounded-xl p-6">
            <h4 className="text-xl font-bold mb-4">{overview.topPerformer.title}</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-blue-600">{overview.topPerformer.views}</div>
                <div className="text-sm text-gray-600">Views</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{overview.topPerformer.clicks}</div>
                <div className="text-sm text-gray-600">Clicks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{overview.topPerformer.inquiries}</div>
                <div className="text-sm text-gray-600">Inquiries</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
