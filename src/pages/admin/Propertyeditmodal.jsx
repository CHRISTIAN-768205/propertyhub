import React, { useState, useEffect } from 'react';
import API_URL from '../../config/api';
import { X, Camera, MapPin } from 'lucide-react';
import API_URL from '../../config/api';
import { 
  Wifi, Car, Wind, Shield, Dumbbell, Waves, Dog, Sofa, Trees, 
  Building2, Shirt, UtensilsCrossed, Zap 
} from 'lucide-react';

export default function PropertyEditModal({ property, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: property.title || '',
    description: property.description || '',
    address: property.address || '',
    latitude: property.location?.coordinates?.[1] || '',
    longitude: property.location?.coordinates?.[0] || '',
    price: property.price || '',
    propertyType: property.propertyType || 'apartment',
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    amenities: property.amenities || []
  });

  const [newImages, setNewImages] = useState([]);
  const [mapPreview, setMapPreview] = useState('');
  const [loading, setLoading] = useState(false);

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
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'studio', label: 'Studio' },
    { value: 'other', label: 'Other' }
  ];

  // Update map preview when coordinates change
  useEffect(() => {
    if (formData.latitude && formData.longitude) {
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapPreview(`https://maps.google.com/maps?q=${lat},${lng}&output=embed`);
      }
    } else {
      setMapPreview('');
    }
  }, [formData.latitude, formData.longitude]);

  // Get coordinates from address
  const getCoordinatesFromAddress = async () => {
    if (!formData.address) {
      alert('Please enter an address first');
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setFormData(prev => ({
          ...prev,
          latitude: data[0].lat,
          longitude: data[0].lon
        }));
        alert('✅ Coordinates found!');
      } else {
        alert('Could not find coordinates. Please enter manually.');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      alert('Error fetching coordinates. Please enter manually.');
    }
  };

  // Toggle amenity
  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert('Maximum 5 new images allowed');
      return;
    }
    setNewImages(files);
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      // Append all text fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('propertyType', formData.propertyType);
      formDataToSend.append('bedrooms', formData.bedrooms);
      formDataToSend.append('bathrooms', formData.bathrooms);
      formDataToSend.append('amenities', JSON.stringify(formData.amenities));
      
      if (formData.latitude) formDataToSend.append('latitude', formData.latitude);
      if (formData.longitude) formDataToSend.append('longitude', formData.longitude);

      // Append new images if any
      newImages.forEach((image) => {
        formDataToSend.append('images', image);
      });

      const response = await fetch(`${API_URL}/api/properties/${property._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Property updated successfully!');
        onSuccess();
        onClose();
      } else {
        alert(data.error || data.message || 'Failed to update property');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Error updating property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Edit Property</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Images */}
          {property.images && property.images.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Current Images ({property.images.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {property.images.map((img, index) => (
                  <img
                    key={index}
                    src={`${API_URL}${img}`}
                    alt={`Property ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border-2 border-slate-200"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x80?text=Image';
                    }}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Upload new images below to add more (will be added to existing images)
              </p>
            </div>
          )}

          {/* New Images */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Add New Images (Optional, Max 5)
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="new-images-upload"
              />
              <label htmlFor="new-images-upload" className="cursor-pointer">
                {newImages.length > 0 ? (
                  <div>
                    <Camera className="mx-auto text-green-600 mb-2" size={32} />
                    <p className="text-green-600 font-bold">
                      ✓ {newImages.length} new image(s) selected
                    </p>
                  </div>
                ) : (
                  <div>
                    <Camera className="mx-auto text-slate-400 mb-2" size={32} />
                    <p className="text-slate-600 font-medium text-sm">
                      Click to add new images
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Property Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none h-32"
              required
            />
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Property Type *
            </label>
            <select
              value={formData.propertyType}
              onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              {propertyTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Address *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <button
                type="button"
                onClick={getCoordinatesFromAddress}
                className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all whitespace-nowrap"
              >
                📍 Get Coordinates
              </button>
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Map Preview */}
          {mapPreview && (
            <div className="border-2 border-slate-200 rounded-xl overflow-hidden">
              <iframe
                title="Location Preview"
                src={mapPreview}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          )}

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Monthly Rent (KES) *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Bedrooms
              </label>
              <input
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Bathrooms
              </label>
              <input
                type="number"
                min="0"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Amenities & Features
            </label>
            <div className="grid grid-cols-2 gap-3">
              {availableAmenities.map((amenity) => {
                const Icon = amenity.icon;
                const isSelected = formData.amenities.includes(amenity.value);
                return (
                  <button
                    key={amenity.value}
                    type="button"
                    onClick={() => toggleAmenity(amenity.value)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Icon
                      size={20}
                      className={isSelected ? 'text-blue-600' : 'text-slate-400'}
                    />
                    <span className="font-medium text-sm">{amenity.label}</span>
                    {isSelected && <span className="ml-auto text-blue-600">✓</span>}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Selected: {formData.amenities.length} amenities
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

