import React, { useState, useEffect } from 'react';
import API_URL from '../../config/api';
import { Search, MapPin, DollarSign, Heart, Star, Filter, Phone, Mail, Calendar, Wifi, Car, Wind, User, LogIn, Camera, Shield, Dumbbell, Waves, Dog, Sofa, Trees, Building2, Shirt, UtensilsCrossed, Zap, Bed, Bath, Moon, Sun } from 'lucide-react';
import PropertyComparison from '../../components/PropertyComparison';
import { GitCompare } from 'lucide-react';
import RatingModal from '../../components/RatingModal';
import LocationSearch, { 
  calculateDistance, 
  DistanceBadge, 
  RoutePlannerButton 
} from '../../components/LocationSearch';
import Footer from '../../components/Footer';
import PaymentModal from '../../components/PaymentModal';

export default function UserPropertyPage(){
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [propertyToRate, setPropertyToRate] = useState(null);
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [filterPrice, setFilterPrice] = useState('all');
  const [filterAmenities, setFilterAmenities] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
const [currentBooking, setCurrentBooking] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [userLocation, setUserLocation] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [bookingData, setBookingData] = useState({
    userName: '',
    userEmail: '',
    phone: '',
    moveInDate: '',
    message: ''
  });

  // Available amenities for filtering
  const availableAmenities = [
    { value: 'WiFi', icon: Wifi, label: 'WiFi' },
    { value: 'Parking', icon: Car, label: 'Parking' },
    { value: 'AC', icon: Wind, label: 'AC' },
    { value: 'Security', icon: Shield, label: 'Security' },
    { value: 'Gym', icon: Dumbbell, label: 'Gym' },
    { value: 'Pool', icon: Waves, label: 'Pool' },
    { value: 'Pet-friendly', icon: Dog, label: 'Pet Friendly' }
  ];

  // Get icon for amenity
  const getAmenityIcon = (amenity) => {
    const amenityMap = {
      'WiFi': Wifi,
      'Parking': Car,
      'AC': Wind,
      'Security': Shield,
      'Gym': Dumbbell,
      'Pool': Waves,
      'Pet-friendly': Dog,
      'Furnished': Sofa,
      'Balcony': Trees,
      'Garden': Trees,
      'Elevator': Building2,
      'Laundry': Shirt,
      'Kitchen': UtensilsCrossed,
      'Generator': Zap
    };
    return amenityMap[amenity] || Star;
  };

  // Toggle amenity filter
  const toggleAmenityFilter = (amenity) => {
    if (filterAmenities.includes(amenity)) {
      setFilterAmenities(filterAmenities.filter(a => a !== amenity));
    } else {
      setFilterAmenities([...filterAmenities, amenity]);
    }
  };

  // Fetch properties from backend
  useEffect(() => {
    fetchProperties();
  }, []);
  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);
  
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${API_URL}/api/properties`);
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  // Handle location found - FIXED for GeoJSON coordinates
  const handleLocationFound = (coords, locationName) => {
    setUserLocation(coords);
    console.log('User location:', coords, locationName);
    
    // Calculate distances for all properties
    const propertiesWithDistance = properties.map(property => {
      // Check GeoJSON format first
      if (property.location?.coordinates && property.location.coordinates.length === 2) {
        const [lng, lat] = property.location.coordinates;
        const distance = calculateDistance(
          coords.lat,
          coords.lng,
          lat,
          lng
        );
        return { ...property, distance: parseFloat(distance) };
      }
      // Fallback to old format
      else if (property.coordinates?.lat && property.coordinates?.lng) {
        const distance = calculateDistance(
          coords.lat,
          coords.lng,
          property.coordinates.lat,
          property.coordinates.lng
        );
        return { ...property, distance: parseFloat(distance) };
      }
      return { ...property, distance: null };
    });
    
    setProperties(propertiesWithDistance);
  };

  // Sort properties - FIXED for price as Number
  const getSortedProperties = (propertiesToSort) => {
    let sorted = [...propertiesToSort];
    
    switch (sortBy) {
      case 'distance':
        sorted = sorted.sort((a, b) => {
          if (!a.distance) return 1;
          if (!b.distance) return -1;
          return a.distance - b.distance;
        });
        break;
      case 'price-low':
        sorted = sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted = sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    
    return sorted;
  };

  // Toggle favorite
  const toggleFavorite = (propertyId) => {
    if (favorites.includes(propertyId)) {
      setFavorites(favorites.filter(id => id !== propertyId));
    } else {
      setFavorites([...favorites, propertyId]);
    }
  };

  // Handle booking submission
  const handleBooking = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: selectedProperty._id,
          ...bookingData
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Rental inquiry submitted successfully! The landlord will contact you soon.');
        setShowBookingModal(false);
        setBookingData({
          userName: '',
          userEmail: '',
          phone: '',
          moveInDate: '',
          message: ''
        });
      } else {
        alert(data.message || 'Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  // Filter properties - FIXED for new field names
  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.price?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesView = activeView === 'all' || 
      (activeView === 'favorites' && favorites.includes(property._id));

    const matchesPrice = filterPrice === 'all' || 
      (filterPrice === 'low' && property.price < 40000) ||
      (filterPrice === 'mid' && property.price >= 40000 && property.price <= 60000) ||
      (filterPrice === 'high' && property.price > 60000);

    const matchesAmenities = filterAmenities.length === 0 || 
      filterAmenities.every(amenity => property.amenities?.includes(amenity));

    return matchesSearch && matchesView && matchesPrice && matchesAmenities;
  });

  // Image navigation
  const nextImage = (e, property) => {
    e.stopPropagation();
    const images = property.images || [property.image];
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e, property) => {
    e.stopPropagation();
    const images = property.images || [property.image];
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Lightbox navigation
  const nextLightboxImage = () => {
    const images = selectedProperty.images || [selectedProperty.image];
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const prevLightboxImage = () => {
    const images = selectedProperty.images || [selectedProperty.image];
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  // Open Google Maps - FIXED for GeoJSON coordinates
  const openMap = (property) => {
    // Check location.coordinates first (GeoJSON format)
    if (property.location?.coordinates && property.location.coordinates.length === 2) {
      const [lng, lat] = property.location.coordinates;
      const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(mapUrl, '_blank');
    } 
    // Fallback to old format if exists
    else if (property.latitude && property.longitude) {
      const mapUrl = `https://www.google.com/maps?q=${property.latitude},${property.longitude}`;
      window.open(mapUrl, '_blank');
    } 
    // Last resort: search by address
    else {
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`;
      window.open(mapUrl, '_blank');
    }
  };

  // Track property view
  const trackPropertyView = async (propertyId) => {
    try {
      await fetch(`${API_URL}/api/analytics/track-view/${propertyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ View tracked for property:', propertyId);
    } catch (error) {
      console.error('Error tracking view:', error);
      // Fail silently - don't disrupt user experience
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PropertyHub
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Find your perfect home</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveView(activeView === 'all' ? 'favorites' : 'all')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeView === 'favorites'
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Heart size={20} className={activeView === 'favorites' ? 'fill-white' : ''} />
                <span className="hidden sm:inline">
                  {activeView === 'favorites' ? `Favorites (${favorites.length})` : 'Favorites'}
                </span>
              </button>
              
              <button
                onClick={() => setShowComparison(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg"
              >
                <GitCompare size={20} />
                <span className="hidden sm:inline">Compare</span>
              </button>

              <a
                href="/login"
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-xl transition-all"
              >
                <LogIn size={20} />
                <span>Landlord Login</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar & Location */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 border border-slate-200 dark:border-slate-700">
          
          {/* Search Input */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          {/* Location Search & Sort Row */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-4">
            {/* Location Search */}
            <div className="flex-1 w-full">
              <LocationSearch onLocationFound={handleLocationFound} />
            </div>
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <label className="font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap text-sm">
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-xl border-2 font-semibold text-sm"
                style={{
                  borderColor: '#10b981',
                  color: '#047857'
                }}
              >
                <option value="default">Default</option>
                <option value="distance">Nearest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        

          {/* Filters and Dark Mode */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg transition-all hover:scale-110 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
                showFilters 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Filter size={18} />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-3 pt-3 border-t border-slate-200 space-y-3">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-medium text-slate-700">Price Range:</span>
                {[
                  { value: 'all', label: 'All Prices' },
                  { value: 'low', label: 'Under 40K' },
                  { value: 'mid', label: '40K - 60K' },
                  { value: 'high', label: 'Above 60K' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFilterPrice(option.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filterPrice === option.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-medium text-slate-700">Amenities:</span>
                {availableAmenities.map((amenity) => {
                  const Icon = amenity.icon;
                  const isSelected = filterAmenities.includes(amenity.value);
                  return (
                    <button
                      key={amenity.value}
                      onClick={() => toggleAmenityFilter(amenity.value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Icon size={14} />
                      {amenity.label}
                    </button>
                  );
                })}
              </div>
              
              {(filterPrice !== 'all' || filterAmenities.length > 0) && (
                <button
                  onClick={() => {
                    setFilterPrice('all');
                    setFilterAmenities([]);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-slate-600 dark:text-slate-400">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
          </p>
          {activeView === 'favorites' && (
            <button
              onClick={() => setActiveView('all')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to all properties
            </button>
          )}
        </div>

        {/* Property Grid */}
        {filteredProperties.length === 0 ? (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Search size={40} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No properties found</h3>
              <p className="text-slate-600">
                {activeView === 'favorites' 
                  ? "You haven't added any favorites yet. Start exploring properties!"
                  : "Try adjusting your search or filters to find more properties."}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getSortedProperties(filteredProperties).map((property) => {
              const propertyImages = property.images || (property.image ? [property.image] : []);
              const mainImage = property.mainImage || propertyImages[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400';
              
              return (
                <div
                  key={property._id}
                  id={`property-${property._id}`}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/50 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 dark:border-slate-700"
                >
                  {/* IMAGE SECTION */}
                  <div className="relative group">
                    <img
                      src={`${API_URL}${mainImage}`}
                      alt={property.title}
                      className="w-full h-56 object-cover cursor-pointer"
                      onClick={() => {
                        setSelectedProperty(property);
                        trackPropertyView(property._id);
                      }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400';
                      }}
                    />
                    
                    {/* Distance Badge - TOP LEFT */}
                    {property.distance && (
                      <div className="absolute top-4 left-4">
                        <DistanceBadge distance={property.distance} />
                      </div>
                    )}
                    
                    {/* Image Counter Badge - NEXT TO DISTANCE */}
                    {propertyImages.length > 1 && (
                      <div className="absolute top-4 left-4" style={{ marginLeft: property.distance ? '90px' : '0' }}>
                        <div className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                          <Camera size={14} />
                          {propertyImages.length}
                        </div>
                      </div>
                    )}
                    
                    {/* Favorite Button - TOP RIGHT */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(property._id);
                      }}
                      className="absolute top-4 right-4 bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                      <Heart
                        size={24}
                        className={favorites.includes(property._id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-slate-400 dark:text-slate-500 hover:text-red-500'}
                      />
                    </button>

                    {/* Rating Badge - BOTTOM LEFT */}
                    <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                        {property.rating > 0 ? property.rating.toFixed(1) : 'New'}
                      </span>
                      {property.reviewCount > 0 && (
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          ({property.reviewCount})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CONTENT SECTION */}
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 mb-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                        onClick={() => {
                          setSelectedProperty(property);
                          trackPropertyView(property._id);
                        }}>
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-3 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                         onClick={() => openMap(property)}>
                      <MapPin size={16} />
                      <span className="text-sm">{property.address}</span>
                    </div>

                    {property.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                        {property.description}
                      </p>
                    )}

                    {/* Amenities */}
                    {property.amenities && property.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {property.amenities.slice(0, 4).map((amenity) => {
                          const Icon = getAmenityIcon(amenity);
                          return (
                            <div
                              key={amenity}
                              className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs"
                              title={amenity}
                            >
                              <Icon size={12} />
                              <span>{amenity}</span>
                            </div>
                          );
                        })}
                        {property.amenities.length > 4 && (
                          <div className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs font-medium">
                            +{property.amenities.length - 4} more
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bedrooms & Bathrooms */}
                    {(property.bedrooms > 0 || property.bathrooms > 0) && (
                      <div className="flex items-center gap-3 mb-3 text-sm text-slate-600 dark:text-slate-400">
                        {property.bedrooms > 0 && (
                          <div className="flex items-center gap-1">
                            <Bed size={16} />
                            <span>{property.bedrooms} Bed</span>
                          </div>
                        )}
                        {property.bathrooms > 0 && (
                          <div className="flex items-center gap-1">
                            <Bath size={16} />
                            <span>{property.bathrooms} Bath</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* PRICE AND BUTTONS */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-1">
                        <span className="text-green-600 dark:text-green-400 font-bold text-lg">
                          KES {property.price?.toLocaleString()}/mo
                        </span>
                      </div>
                      
                      {/* BUTTONS */}
                      <div className="flex gap-2 items-center">
                        {/* Small Rate Icon Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPropertyToRate(property);
                            setShowRatingModal(true);
                          }}
                          className="p-2 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-yellow-500 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all"
                          title="Rate this property"
                        >
                          <Star size={18} />
                        </button>
                        
                        {/* Get Directions Button (if coordinates exist) */}
                        {(() => {
                          // Try GeoJSON format first
                          if (property.location?.coordinates && property.location.coordinates.length === 2) {
                            const [lng, lat] = property.location.coordinates;
                            return (
                              <RoutePlannerButton
                                propertyLat={lat}
                                propertyLng={lng}
                                propertyName={property.title}
                              />
                            );
                          }
                          // Fallback to old format
                          else if (property.coordinates?.lat && property.coordinates?.lng) {
                            return (
                              <RoutePlannerButton
                                propertyLat={property.coordinates.lat}
                                propertyLng={property.coordinates.lng}
                                propertyName={property.title}
                              />
                            );
                          }
                          return null;
                        })()}
                        
                        {/* Big Prominent Inquire Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProperty(property);
                            setShowBookingModal(true);
                          }}
                          className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-bold hover:shadow-xl transform hover:scale-105 transition-all"
                        >
                          Inquire Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedProperty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
               onClick={() => setShowBookingModal(false)}>
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                 onClick={(e) => e.stopPropagation()}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-800">Rental Inquiry</h3>
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="text-slate-400 hover:text-slate-600 text-3xl font-bold leading-none"
                  >
                    ×
                  </button>
                </div>

                <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-bold text-lg text-slate-800">{selectedProperty.title}</h4>
                  <p className="text-slate-600 text-sm">{selectedProperty.address}</p>
                  <p className="text-green-600 font-bold text-lg mt-2">
                    KES {selectedProperty.price?.toLocaleString()}/month
                  </p>
                </div>

                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Your Name *</label>
                    <input
                      type="text"
                      value={bookingData.userName}
                      onChange={(e) => setBookingData({...bookingData, userName: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={bookingData.userEmail}
                      onChange={(e) => setBookingData({...bookingData, userEmail: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="+254 712 345 678"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Move-in Date *</label>
                    <input
                      type="date"
                      value={bookingData.moveInDate}
                      onChange={(e) => setBookingData({...bookingData, moveInDate: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Message (Optional)</label>
                    <textarea
                      value={bookingData.message}
                      onChange={(e) => setBookingData({...bookingData, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none h-24"
                      placeholder="Any questions or special requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
                  >
                    Submit Inquiry
                  </button>

                  <p className="text-xs text-slate-500 text-center">
                    The landlord will contact you via email or phone to discuss rental details
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Modal */}
        {showComparison && (
          <PropertyComparison
            properties={filteredProperties}
            onClose={() => setShowComparison(false)}
          />
        )}

        {/* Rating Modal */}
        {showRatingModal && propertyToRate && (
          <RatingModal
            property={propertyToRate}
            onClose={() => {
              setShowRatingModal(false);
              setPropertyToRate(null);
            }}
            onSubmit={() => fetchProperties()}
          />
        )}
      
    </div>
    
      <Footer />
      </div>

  );
}



