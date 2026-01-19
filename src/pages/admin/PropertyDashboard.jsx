import React, { useState, useEffect } from 'react';
import API_URL from '../../config/api';
import { 
  BarChart3, Rocket, Eye, EyeOff, Plus, Edit, Trash2, Home, Calendar, 
  Settings, Star, MapPin, User, Phone, Mail, Camera, LogOut, 
  Wifi, Car, Wind, Shield, Dumbbell, Waves, Dog, Sofa, Trees, 
  Building2, Shirt, UtensilsCrossed, Zap, TrendingUp
} from 'lucide-react';
import DeleteAccountSection from '../../components/DeleteAccountSection';
import PropertyEditModal from './Propertyeditmodal';

export default function PropertyDashboard() {
  // ALL STATE
  const [showEditModal, setShowEditModal] = useState(false);
const [propertyToEdit, setPropertyToEdit] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedPropertyForAnalytics, setSelectedPropertyForAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({ averageRating: 0, totalReviews: 0 });
  const [analyticsData, setAnalyticsData] = useState([]);
  const [userData, setUserData] = useState({ fullName: '', email: '', phone: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [newProperty, setNewProperty] = useState({
    title: '', description: '', address: '', latitude: '', longitude: '',
    price: '', propertyType: 'apartment', images: [], amenities: [], bedrooms: 0, bathrooms: 0
  });
  const [mapPreview, setMapPreview] = useState('');

  const availableAmenities = [
    { value: 'WiFi', icon: Wifi, label: 'WiFi' },
    { value: 'Parking', icon: Car, label: 'Parking' },
    { value: 'Air Conditioning', icon: Wind, label: 'Air Conditioning' },
    { value: 'Security', icon: Shield, label: '24/7 Security' },
    { value: 'Gym', icon: Dumbbell, label: 'Gym' },
    { value: 'Swimming Pool', icon: Waves, label: 'Swimming Pool' },
    { value: 'Pet Friendly', icon: Dog, label: 'Pet Friendly' },
    { value: 'Furnished', icon: Sofa, label: 'Furnished' },
    { value: 'Balcony', icon: Trees, label: 'Balcony' },
    { value: 'Garden', icon: Trees, label: 'Garden' },
    { value: 'Elevator', icon: Building2, label: 'Elevator' },
    { value: 'Laundry', icon: Shirt, label: 'Laundry' },
    { value: 'Kitchen', icon: UtensilsCrossed, label: 'Full Kitchen' },
    { value: 'Generator', icon: Zap, label: 'Backup Generator' }
  ];

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' }, { value: 'house', label: 'House' },
    { value: 'condo', label: 'Condo' }, { value: 'townhouse', label: 'Townhouse' },
    { value: 'studio', label: 'Studio' }, { value: 'other', label: 'Other' }
  ];

  // EFFECTS
  useEffect(() => {
    if (newProperty.latitude && newProperty.longitude) {
      const lat = parseFloat(newProperty.latitude);
      const lng = parseFloat(newProperty.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapPreview(`https://maps.google.com/maps?q=${lat},${lng}&output=embed`);
      }
    } else {
      setMapPreview('');
    }
  }, [newProperty.latitude, newProperty.longitude]);

  useEffect(() => {
    fetchMyProperties();
    fetchMyBookings();
    fetchUserProfile();
    fetchRatings();
    fetchAnalytics();
  }, []);

  // FETCH FUNCTIONS
  const fetchAnalytics = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/analytics/landlord/properties`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
      const data = await response.json();
      // Filter out any items without property data
      setAnalyticsData(data.filter(item => item && item.property && item.property._id));
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
  }
};


  const getTotalViews = () => analyticsData.reduce((sum, item) => sum + item.viewCount, 0);

  const fetchUserProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) setUserData({ fullName: user.fullName || '', email: user.email || '', phone: user.phone || '' });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchMyProperties = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/properties/my-properties`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
      const data = await response.json();
      // Filter out any null/undefined properties
      setProperties(data.filter(p => p && p._id));
    } else {
      setProperties([]);
    }
  } catch (error) {
    console.error('Error fetching properties:', error);
    setProperties([]);
  } finally {
    setLoading(false);
  }
};

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/bookings/landlord-bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setBookings(await response.json());
      else setBookings([]);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    }
  };

  const fetchRatings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.id) {
        const response = await fetch(`${API_URL}/api/reviews/landlord-stats/${user.id}`);
        if (response.ok) setRatings(await response.json());
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  // HELPER FUNCTIONS
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getCoordinatesFromAddress = async () => {
    if (!newProperty.address) {
      alert('Please enter an address first');
      return;
    }
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newProperty.address)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setNewProperty(prev => ({ ...prev, latitude: data[0].lat, longitude: data[0].lon }));
        alert('✅ Coordinates found!');
      } else {
        alert('Could not find coordinates. Please enter manually.');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      alert('Error fetching coordinates. Please enter manually.');
    }
  };

  const toggleAmenity = (amenity) => {
    setNewProperty({
      ...newProperty,
      amenities: newProperty.amenities.includes(amenity)
        ? newProperty.amenities.filter(a => a !== amenity)
        : [...newProperty.amenities, amenity]
    });
  };

  // HANDLER FUNCTIONS
  const handleApproveBooking = async (bookingId) => {
    if (!window.confirm('Approve this booking request?')) return;
    try {
      const response = await fetch(`${API_URL}/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'confirmed' })
      });
      if (response.ok) {
        alert('✅ Booking approved!');
        fetchMyBookings();
      }
    } catch (error) {
      console.error('Error approving booking:', error);
    }
  };

  const handleRejectBooking = async (bookingId) => {
    if (!window.confirm('Reject this booking request?')) return;
    try {
      const response = await fetch(`${API_URL}/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });
      if (response.ok) {
        alert('Booking rejected.');
        fetchMyBookings();
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };
const togglePropertyVisibility = async (id) => {
  try {
    const token = localStorage.getItem('token');
    
    console.log('Toggling visibility for property:', id);
    
    const response = await fetch(`${API_URL}/api/properties/${id}/toggle-visibility`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Visibility toggled:', data);
      alert(data.message);
      fetchMyProperties(); // Refresh the list
    } else {
      console.error('❌ Error response:', data);
      alert(data.error || 'Failed to toggle visibility');
    }
  } catch (error) {
    console.error('❌ Error toggling visibility:', error);
    alert('Error toggling visibility. Please check your connection.');
  }
};

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    setNewProperty({ ...newProperty, images: files });
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    if (!newProperty.title || !newProperty.address || !newProperty.price || newProperty.images.length === 0) {
      alert('Please fill in all required fields including at least one image');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', newProperty.title);
      formData.append('description', newProperty.description);
      formData.append('address', newProperty.address);
      formData.append('latitude', newProperty.latitude);
      formData.append('longitude', newProperty.longitude);
      formData.append('price', newProperty.price);
      formData.append('propertyType', newProperty.propertyType);
      formData.append('amenities', JSON.stringify(newProperty.amenities));
      formData.append('bedrooms', newProperty.bedrooms);
      formData.append('bathrooms', newProperty.bathrooms);
      newProperty.images.forEach((image) => formData.append('images', image));
      
      const response = await fetch(`${API_URL}/api/properties`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      const data = await response.json();
      if (response.ok) {
        alert('✅ Property added successfully!');
        setNewProperty({ title: '', description: '', address: '', latitude: '', longitude: '', price: '', propertyType: 'apartment', images: [], amenities: [], bedrooms: 0, bathrooms: 0 });
        setMapPreview('');
        fetchMyProperties();
        fetchAnalytics();
        setActiveTab('properties');
      } else {
        alert(data.error || data.errors?.join(', ') || 'Failed to add property');
      }
    } catch (error) {
      console.error('Add property error:', error);
      alert('Error adding property.');
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/properties/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert('✅ Property deleted successfully!');
        fetchMyProperties();
        fetchAnalytics();
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      user.fullName = userData.fullName;
      user.email = userData.email;
      user.phone = userData.phone;
      localStorage.setItem('user', JSON.stringify(user));
      alert('✅ Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    alert('Password change functionality will be implemented in backend');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  const showPropertyAnalytics = (property) => {
    setSelectedPropertyForAnalytics(property);
    setShowAnalytics(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // RENDER
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* SIDEBAR */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-10">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PropertyHub</h1>
          <p className="text-sm text-slate-500 mt-1">Landlord Dashboard</p>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { id: 'home', icon: Home, label: 'Dashboard' },
            { id: 'analytics', icon: BarChart3, label: 'Analytics' },
            { id: 'add', icon: Plus, label: 'Add Property' },
            { id: 'properties', icon: Eye, label: 'My Properties' },
            { id: 'bookings', icon: Calendar, label: 'Bookings' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'
              }`}>
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all mt-4">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="ml-64 p-8">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Welcome Back, {userData.fullName || 'Landlord'}!</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">Total Properties</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{properties.length}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-xl"><Home className="text-blue-600" size={24} /></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">Total Views</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{getTotalViews()}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-xl"><TrendingUp className="text-green-600" size={24} /></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">Total Bookings</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{bookings.length}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-xl"><Calendar className="text-purple-600" size={24} /></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">Avg Rating</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{ratings.averageRating ? ratings.averageRating.toFixed(1) : '0.0'}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-xl"><Star className="text-yellow-600" size={24} /></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <button onClick={() => setActiveTab('add')} className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-xl transition-all">
                  <Plus size={20} />Add New Property
                </button>
                <button onClick={() => setActiveTab('analytics')} className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-xl transition-all">
                  <BarChart3 size={20} />View Analytics
                </button>
                <button onClick={() => setActiveTab('properties')} className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-xl transition-all">
                  <Eye size={20} />View Properties
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">📊 Property Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-6 shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Views</p>
                    <p className="text-4xl font-bold mt-1">{getTotalViews()}</p>
                    <p className="text-blue-100 text-xs mt-2">All time property views</p>
                  </div>
                  <Eye size={48} className="opacity-50" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Active Properties</p>
                    <p className="text-4xl font-bold mt-1">{properties.length}</p>
                    <p className="text-green-100 text-xs mt-2">Currently listed</p>
                  </div>
                  <Home size={48} className="opacity-50" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Avg. Views/Property</p>
                    <p className="text-4xl font-bold mt-1">{properties.length > 0 ? Math.round(getTotalViews() / properties.length) : 0}</p>
                    <p className="text-orange-100 text-xs mt-2">Per listing</p>
                  </div>
                  <BarChart3 size={48} className="opacity-50" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Property Performance</h3>
              {analyticsData.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 size={48} className="mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-600">No analytics data available yet</p>
                  <p className="text-sm text-slate-500 mt-2">Views will appear here once people start viewing your properties</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {analyticsData.map((item, index) => (
                    
                    <div key={item.property._id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                      <div className="text-2xl font-bold text-slate-400 w-8">#{index + 1}</div>
                      <img src={`${API_URL}${item.property.images?.[0] || '/placeholder.jpg'}`} alt={item.property.title}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'; }}
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800">{item.property.title}</h4>
                        <p className="text-sm text-slate-500">{item.property.address}</p>
                      </div>
                      <div className="text-center px-4">
                        <p className="text-2xl font-bold text-blue-600">{item.viewCount}</p>
                        <p className="text-xs text-slate-500">Total Views</p>
                      </div>
                      <div className="text-center px-4">
                        <p className="text-2xl font-bold text-green-600">{item.uniqueViewers}</p>
                        <p className="text-xs text-slate-500">Unique Viewers</p>
                      </div>
                      <button onClick={() => showPropertyAnalytics(item.property)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ADD PROPERTY TAB */}
        {activeTab === 'add' && (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Add New Property</h2>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 max-w-2xl">
              <form onSubmit={handleAddProperty} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Property Photos * (Max 5)</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" id="image-upload" required />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {newProperty.images.length > 0 ? (
                        <div>
                          <Camera className="mx-auto text-green-600 mb-2" size={48} />
                          <p className="text-green-600 font-bold">✓ {newProperty.images.length} image(s) selected</p>
                          <div className="mt-3 flex flex-wrap gap-2 justify-center">
                            {newProperty.images.map((file, index) => (
                              <div key={index} className="relative">
                                <img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} className="w-20 h-20 object-cover rounded-lg border-2 border-green-500" />
                                <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">{index + 1}</span>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-slate-500 mt-2">Click to change images</p>
                        </div>
                      ) : (
                        <div>
                          <Camera className="mx-auto text-slate-400 mb-2" size={48} />
                          <p className="text-slate-600 font-medium">Click to upload property images</p>
                          <p className="text-xs text-slate-500 mt-1">Upload 1-5 images (JPG, PNG)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Property Title *</label>
                  <input type="text" value={newProperty.title} onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g., Modern Downtown Apartment" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                  <textarea value={newProperty.description} onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none h-32"
                    placeholder="Describe your property in detail..." required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Property Type *</label>
                  <select value={newProperty.propertyType} onChange={(e) => setNewProperty({ ...newProperty, propertyType: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" required>
                    {propertyTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address *</label>
                  <div className="flex gap-2">
                    <input type="text" value={newProperty.address} onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                      className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g., Nairobi CBD, Kenya" required />
                    <button type="button" onClick={getCoordinatesFromAddress}
                      className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all whitespace-nowrap">
                      📍 Get Coordinates
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Click "Get Coordinates" to automatically fill latitude & longitude</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Latitude</label>
                    <input type="number" step="any" value={newProperty.latitude} onChange={(e) => setNewProperty({ ...newProperty, latitude: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="-1.2921" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Longitude</label>
                    <input type="number" step="any" value={newProperty.longitude} onChange={(e) => setNewProperty({ ...newProperty, longitude: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="36.8219" />
                  </div>
                </div>

                {mapPreview && (
                  <div className="border-2 border-slate-200 rounded-xl overflow-hidden">
                    <iframe title="Location Preview" src={mapPreview} width="100%" height="300" style={{ border: 0 }} allowFullScreen="" loading="lazy" />
                    <div className="p-3 bg-slate-50 text-center">
                      <a href={`https://www.google.com/maps?q=${newProperty.latitude},${newProperty.longitude}`} target="_blank" rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        🗺️ View on Google Maps
                      </a>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Rent (KES) *</label>
                  <input type="number" value={newProperty.price} onChange={(e) => setNewProperty({ ...newProperty, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., 50000" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Bedrooms</label>
                    <input type="number" min="0" value={newProperty.bedrooms} onChange={(e) => setNewProperty({ ...newProperty, bedrooms: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Bathrooms</label>
                    <input type="number" min="0" value={newProperty.bathrooms} onChange={(e) => setNewProperty({ ...newProperty, bathrooms: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Amenities & Features</label>
                  <div className="grid grid-cols-2 gap-3">
                    {availableAmenities.map((amenity) => {
                      const Icon = amenity.icon;
                      const isSelected = newProperty.amenities.includes(amenity.value);
                      return (
                        <button key={amenity.value} type="button" onClick={() => toggleAmenity(amenity.value)}
                          className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                            isSelected ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}>
                          <Icon size={20} className={isSelected ? 'text-blue-600' : 'text-slate-400'} />
                          <span className="font-medium text-sm">{amenity.label}</span>
                          {isSelected && <span className="ml-auto text-blue-600">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Selected: {newProperty.amenities.length} amenities</p>
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all">
                  Add Property
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MY PROPERTIES TAB */}
        {activeTab === 'properties' && (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">My Properties ({properties.length})</h2>
            {properties.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-200 text-center">
                <Home size={64} className="mx-auto text-slate-400 mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Properties Yet</h3>
                <p className="text-slate-600 mb-6">Start by adding your first property</p>
                <button onClick={() => setActiveTab('add')} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-xl transition-all">
                  <Plus size={20} className="inline mr-2" />Add Property
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map(property => (
                  <div key={property._id} className={`bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden transition-all hover:shadow-xl ${!property.isVisible ? 'opacity-60' : ''}`}>
                    <div className="relative">
                      <img 
  src={
    property?.images && property.images.length > 0 
      ? `${API_URL}${property.images[0]}` 
      : 'https://via.placeholder.com/400x300?text=No+Image'
  } 
  alt={property.title || 'Property'}
  className="w-full h-48 object-cover"
  onError={(e) => { 
    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; 
  }} 
/>
                     {!property.isVisible && (
  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <span className="text-white font-bold text-lg">HIDDEN FROM PUBLIC</span>
  </div>
)}

{property.isVisible && (
  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
    ✓ VISIBLE
  </div>
)}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-gray-800">{property.title || 'Untitled Property'}</h3>
                      <p className="text-green-600 font-bold text-2xl mb-4">KES {(property.price || 0).toLocaleString()}/month</p>
                      <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600">
                        {property.bedrooms !== undefined && <span className="flex items-center gap-1">🛏️ {property.bedrooms} Beds</span>}
                        {property.bathrooms !== undefined && <span className="flex items-center gap-1">🚿 {property.bathrooms} Baths</span>}
                        {property.propertyType && <span className="flex items-center gap-1 capitalize">🏠 {property.propertyType}</span>}
                      </div>
                      {property.address && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                          <MapPin size={16} />
                          <span className="truncate">{property.address}</span>
                        </div>
                      )}
                      <div className="space-y-2">
                        <button onClick={() => showPropertyAnalytics(property)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-xl transition-all">
                          <BarChart3 size={18} />View Analytics
                        </button>
                        <div className="flex gap-2">
                          <button
  onClick={() => togglePropertyVisibility(property._id)}
  className={`flex-1 flex items-center justify-center gap-1 p-2 rounded-lg transition-all font-medium text-sm ${
    !property.isVisible
      ? 'bg-green-100 hover:bg-green-200 text-green-700'
      : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
  }`}
  title={!property.isVisible ? 'Click to show property to public' : 'Click to hide property from public'}
>
  {!property.isVisible ? (
    <>
      <Eye size={18} />
      <span className="hidden sm:inline">Show</span>
    </>
  ) : (
    <>
      <EyeOff size={18} />
      <span className="hidden sm:inline">Hide</span>
    </>
  )}
</button>
                          <button 
  onClick={() => {
    setPropertyToEdit(property);
    setShowEditModal(true);
  }} 
  className="flex-1 p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all" 
  title="Edit property"
>
  <Edit size={18} className="mx-auto" />
</button>     <button onClick={() => handleDeleteProperty(property._id)} className="flex-1 p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-all" title="Delete property">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Bookings ({bookings.length})</h2>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              {bookings.length === 0 ? (
                <div className="p-12 text-center">
                  <Calendar size={48} className="mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-600">No bookings yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Property</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Customer</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Contact</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Check-in</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {bookings.map(booking => (
                        <tr key={booking._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-slate-800">{booking.propertyId?.title || 'N/A'}</p>
                              <p className="text-sm text-slate-500">{booking.propertyId?.address || ''}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <User size={16} className="text-slate-500" />
                              <span className="text-slate-800 font-medium">{booking.tenantId?.name || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Mail size={14} className="text-slate-400" />
                                <span className="text-sm text-slate-800">{booking.tenantId?.email || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone size={14} className="text-slate-400" />
                                <span className="text-sm text-slate-800">{booking.tenantId?.phone || 'N/A'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-slate-400" />
                              <span className="text-slate-800">{formatDate(booking.checkInDate)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {booking.status === 'confirmed' ? '✓ Approved' : booking.status === 'cancelled' ? '✗ Rejected' : '⏳ Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {booking.status === 'pending' ? (
                              <div className="flex gap-2">
                                <button onClick={() => handleApproveBooking(booking._id)}
                                  className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-all">
                                  ✓ Approve
                                </button>
                                <button onClick={() => handleRejectBooking(booking._id)}
                                  className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all">
                                  ✗ Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-sm text-slate-500">{booking.status === 'confirmed' ? 'Approved ✓' : 'Declined'}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Settings</h2>
            <div className="max-w-2xl space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Profile Settings</h3>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <input type="text" value={userData.fullName} onChange={(e) => setUserData({...userData, fullName: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input type="email" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                    <input type="tel" value={userData.phone} onChange={(e) => setUserData({...userData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-bold hover:shadow-xl transition-all">
                    Update Profile
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                    <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                    <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                    <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" required />
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-bold hover:shadow-xl transition-all">
                    Change Password
                  </button>
                </form>
              </div>

              <DeleteAccountSection />
            </div>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
{showEditModal && propertyToEdit && (
  <PropertyEditModal
    property={propertyToEdit}
    onClose={() => {
      setShowEditModal(false);
      setPropertyToEdit(null);
    }}
    onSuccess={() => {
      fetchMyProperties();
      fetchAnalytics();
    }}
  />
)}

      {/* ANALYTICS MODAL */}
      {showAnalytics && selectedPropertyForAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">📊 Analytics: {selectedPropertyForAnalytics.title}</h2>
              <button onClick={() => { setShowAnalytics(false); setSelectedPropertyForAnalytics(null); }}
                className="text-slate-500 hover:text-slate-700 text-2xl">✕</button>
            </div>
            <div className="p-6">
              <PropertyAnalyticsDetail propertyId={selectedPropertyForAnalytics._id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PropertyAnalyticsDetail({ propertyId }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [propertyId]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_URL}/api/analytics/property/${propertyId}`);
      if (response.ok) setAnalytics(await response.json());
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading analytics...</div>;
  if (!analytics) return <div className="text-center py-8">No analytics data available</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl p-6 text-white">
          <p className="text-blue-100 text-sm mb-2">Total Views</p>
          <p className="text-4xl font-bold">{analytics.viewCount}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white">
          <p className="text-green-100 text-sm mb-2">Unique Viewers</p>
          <p className="text-4xl font-bold">{analytics.uniqueViewers}</p>
        </div>
      </div>
      {analytics.dailyViews && analytics.dailyViews.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Last 30 Days</h3>
          <div className="flex items-end justify-between gap-2 h-40">
            {analytics.dailyViews.slice(-30).map((day, index) => {
              const maxViews = Math.max(...analytics.dailyViews.map(d => d.count), 1);
              const height = (day.count / maxViews) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
                    style={{ height: `${height}%`, minHeight: day.count > 0 ? '4px' : '0' }}
                    title={`${day.count} views`} />
                  {day.count > 0 && <span className="text-xs text-slate-600">{day.count}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}



