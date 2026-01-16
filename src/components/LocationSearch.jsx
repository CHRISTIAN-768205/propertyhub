import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Navigation2, Loader } from 'lucide-react';

const LocationSearch = ({ onLocationFound, onDistanceCalculated }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('');

  // Get user's current location
  const getUserLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setUserLocation(coords);
        
        // Get location name from coordinates (reverse geocoding)
        const name = await getLocationName(coords.lat, coords.lng);
        setLocationName(name);
        
        // Notify parent component
        if (onLocationFound) {
          onLocationFound(coords, name);
        }
        
        setLoading(false);
      },
      (error) => {
        setError('Unable to retrieve your location. Please enable location services.');
        setLoading(false);
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Reverse geocoding - convert coordinates to location name
  const getLocationName = async (lat, lng) => {
    try {
      // Using OpenStreetMap Nominatim (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.address) {
        const { suburb, county, city, country } = data.address;
        return `${suburb || county || city}, ${country}`;
      }
      return 'Unknown location';
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Location detected';
    }
  };

  return (
    <div className="space-y-4">
      {/* Near Me Button */}
      <button
        onClick={getUserLocation}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        style={{
          background: loading 
            ? '#9ca3af' 
            : 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          color: 'white'
        }}
      >
        {loading ? (
          <>
            <Loader className="animate-spin" size={20} />
            Finding your location...
          </>
        ) : (
          <>
            <Navigation size={20} />
            Near Me
          </>
        )}
      </button>

      {/* Location Display */}
      {userLocation && locationName && (
        <div 
          className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-md"
          style={{
            background: 'rgba(209, 250, 229, 0.9)',
            border: '2px solid #10b981'
          }}
        >
          <MapPin size={20} style={{ color: '#10b981' }} />
          <div>
            <div className="text-xs font-semibold" style={{ color: '#047857' }}>
              Your Location
            </div>
            <div className="text-sm font-bold" style={{ color: '#047857' }}>
              {locationName}
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div 
          className="px-4 py-3 rounded-xl text-sm font-semibold"
          style={{
            background: '#fee2e2',
            color: '#991b1b'
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance.toFixed(1); // Returns distance in km
};

const toRad = (value) => {
  return (value * Math.PI) / 180;
};

// Distance Badge Component
export const DistanceBadge = ({ distance }) => {
  if (!distance) return null;
  
  return (
    <div 
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold shadow-md"
      style={{
        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        color: 'white'
      }}
    >
      <MapPin size={12} />
      {distance} km away
    </div>
  );
};

// Route Planner Button
export const RoutePlannerButton = ({ propertyLat, propertyLng, propertyName }) => {
  const openGoogleMaps = () => {
    // Get user's current location first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          // Open Google Maps with directions
          const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${propertyLat},${propertyLng}&travelmode=driving`;
          window.open(url, '_blank');
        },
        () => {
          // If location access denied, just open destination
          const url = `https://www.google.com/maps/search/?api=1&query=${propertyLat},${propertyLng}`;
          window.open(url, '_blank');
        }
      );
    }
  };

  return (
    <button
      onClick={openGoogleMaps}
      className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
      style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white'
      }}
    >
      <Navigation2 size={18} />
      Get Directions
    </button>
  );
};

// Geocode location name to coordinates
export const geocodeLocation = async (locationName) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

export default LocationSearch;