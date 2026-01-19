import React, { useState } from 'react';
import API_URL from '../config/api';
import { X, MapPin, DollarSign, Star, Bed, Bath, Check, Minus } from 'lucide-react';
import API_URL from '../config/api';

export default function PropertyComparison({ properties, onClose }) {
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [showSelector, setShowSelector] = useState(true);

  // Toggle property selection
  const toggleProperty = (property) => {
    if (selectedProperties.find(p => p._id === property._id)) {
      setSelectedProperties(selectedProperties.filter(p => p._id !== property._id));
    } else {
      if (selectedProperties.length < 3) {
        setSelectedProperties([...selectedProperties, property]);
      } else {
        alert('You can compare up to 3 properties at a time');
      }
    }
  };

  // Get all unique amenities from selected properties
  const getAllAmenities = () => {
    const amenitiesSet = new Set();
    selectedProperties.forEach(property => {
      property.amenities?.forEach(amenity => amenitiesSet.add(amenity));
    });
    return Array.from(amenitiesSet).sort();
  };

  // Check if property has amenity
  const hasAmenity = (property, amenity) => {
    return property.amenities?.includes(amenity);
  };

  // Get icon for amenity
  const getAmenityIcon = (amenity) => {
    const amenityIcons = {
      'WiFi': '📶',
      'Parking': '🚗',
      'AC': '❄️',
      'Air Conditioning': '❄️',
      'Security': '🔒',
      'Gym': '💪',
      'Pool': '🏊',
      'Swimming Pool': '🏊',
      'Pet-friendly': '🐕',
      'Pet Friendly': '🐕',
      'Furnished': '🛋️',
      'Balcony': '🌳',
      'Garden': '🌿',
      'Elevator': '🛗',
      'Laundry': '🧺',
      'Kitchen': '🍳',
      'Generator': '⚡',
      'Backup Generator': '⚡'
    };
    return amenityIcons[amenity] || '✓';
  };

  if (showSelector && selectedProperties.length < 2) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Select Properties to Compare</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Choose 2-3 properties ({selectedProperties.length} selected)
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"
            >
              <X size={24} className="text-slate-600 dark:text-slate-400" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties.map(property => {
                const isSelected = selectedProperties.find(p => p._id === property._id);
                const mainImage = property.mainImage || property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400';

                return (
                  <div
                    key={property._id}
                    onClick={() => toggleProperty(property)}
                    className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 shadow-lg transform scale-105'
                        : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-10 bg-blue-500 text-white rounded-full p-2">
                        <Check size={20} />
                      </div>
                    )}
                    
                    <img
                      src={`${API_URL}${mainImage}`}
                      alt={property.title}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400';
                      }}
                    />
                    
                    <div className="p-4 bg-white dark:bg-slate-800">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-1">{property.title}</h3>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mb-2">
                        <MapPin size={14} />
                        <span>{property.address}</span>
                      </div>
                      <p className="text-green-600 dark:text-green-400 font-bold">
                        KES {property.price?.toLocaleString()}/mo
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedProperties.length >= 2 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowSelector(false)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-xl transition-all"
                >
                  Compare {selectedProperties.length} Properties
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Property Comparison</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Comparing {selectedProperties.length} properties
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSelector(true)}
              className="px-4 py-2 border-2 border-blue-500 text-blue-500 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-slate-700 transition-all"
            >
              Change Selection
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"
            >
              <X size={24} className="text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 bg-slate-50 dark:bg-slate-900 font-bold text-slate-700 dark:text-slate-300 border-b-2 border-slate-200 dark:border-slate-700 sticky left-0 z-10">
                  Feature
                </th>
                {selectedProperties.map(property => (
                  <th key={property._id} className="p-4 bg-slate-50 dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-700 min-w-[250px]">
                    <div className="text-left">
                      <img
                        src={`${API_URL}${property.mainImage || property.images?.[0] || ''}`}
                        alt={property.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400';
                        }}
                      />
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">{property.title}</h3>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Location */}
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <td className="p-4 font-medium text-slate-700 dark:text-slate-300 sticky left-0 bg-white dark:bg-slate-800">
                  <MapPin size={18} className="inline mr-2" />
                  Location
                </td>
                {selectedProperties.map(property => (
                  <td key={property._id} className="p-4 text-slate-600 dark:text-slate-400">
                    {property.address}
                  </td>
                ))}
              </tr>

              {/* Price */}
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <td className="p-4 font-medium text-slate-700 dark:text-slate-300 sticky left-0 bg-slate-50 dark:bg-slate-900">
                  <DollarSign size={18} className="inline mr-2" />
                  Monthly Rent
                </td>
                {selectedProperties.map(property => (
                  <td key={property._id} className="p-4 text-green-600 dark:text-green-400 font-bold text-lg">
                    KES {property.price?.toLocaleString()}
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <td className="p-4 font-medium text-slate-700 dark:text-slate-300 sticky left-0 bg-white dark:bg-slate-800">
                  <Star size={18} className="inline mr-2" />
                  Rating
                </td>
                {selectedProperties.map(property => (
                  <td key={property._id} className="p-4">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        {property.rating > 0 ? property.rating.toFixed(1) : 'New'}
                      </span>
                      {property.reviewCount > 0 && (
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          ({property.reviewCount})
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Property Type */}
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <td className="p-4 font-medium text-slate-700 dark:text-slate-300 sticky left-0 bg-slate-50 dark:bg-slate-900">
                  🏠 Property Type
                </td>
                {selectedProperties.map(property => (
                  <td key={property._id} className="p-4 text-slate-600 dark:text-slate-400 capitalize">
                    {property.propertyType || 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Bedrooms */}
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <td className="p-4 font-medium text-slate-700 dark:text-slate-300 sticky left-0 bg-white dark:bg-slate-800">
                  <Bed size={18} className="inline mr-2" />
                  Bedrooms
                </td>
                {selectedProperties.map(property => (
                  <td key={property._id} className="p-4 text-slate-600 dark:text-slate-400">
                    {property.bedrooms || 0}
                  </td>
                ))}
              </tr>

              {/* Bathrooms */}
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <td className="p-4 font-medium text-slate-700 dark:text-slate-300 sticky left-0 bg-slate-50 dark:bg-slate-900">
                  <Bath size={18} className="inline mr-2" />
                  Bathrooms
                </td>
                {selectedProperties.map(property => (
                  <td key={property._id} className="p-4 text-slate-600 dark:text-slate-400">
                    {property.bathrooms || 0}
                  </td>
                ))}
              </tr>

              {/* Description */}
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <td className="p-4 font-medium text-slate-700 dark:text-slate-300 sticky left-0 bg-white dark:bg-slate-800">
                  Description
                </td>
                {selectedProperties.map(property => (
                  <td key={property._id} className="p-4 text-sm text-slate-600 dark:text-slate-400">
                    {property.description || 'No description available'}
                  </td>
                ))}
              </tr>

              {/* Amenities Header */}
              <tr className="bg-slate-100 dark:bg-slate-800">
                <td colSpan={selectedProperties.length + 1} className="p-4 font-bold text-slate-800 dark:text-slate-100 text-center">
                  Amenities & Features
                </td>
              </tr>

              {/* Individual Amenities */}
              {getAllAmenities().length > 0 ? (
                getAllAmenities().map((amenity, index) => (
                  <tr key={amenity} className={`border-b border-slate-200 dark:border-slate-700 ${index % 2 === 0 ? 'bg-slate-50 dark:bg-slate-900' : ''}`}>
                    <td className={`p-4 font-medium text-slate-700 dark:text-slate-300 sticky left-0 ${index % 2 === 0 ? 'bg-slate-50 dark:bg-slate-900' : 'bg-white dark:bg-slate-800'}`}>
                      <span className="mr-2">{getAmenityIcon(amenity)}</span>
                      {amenity}
                    </td>
                    {selectedProperties.map(property => (
                      <td key={property._id} className="p-4 text-center">
                        {hasAmenity(property, amenity) ? (
                          <Check size={20} className="text-green-500 mx-auto" />
                        ) : (
                          <Minus size={20} className="text-slate-300 dark:text-slate-600 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={selectedProperties.length + 1} className="p-4 text-center text-slate-500 dark:text-slate-400 italic">
                    No amenities listed for these properties
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with action buttons */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
          <div className="flex flex-wrap gap-4 justify-center">
            {selectedProperties.map(property => (
              <a
                key={property._id}
                href={`#property-${property._id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  // Scroll to property or open details
                  document.getElementById(`property-${property._id}`)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                View {property.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

