import React, { useState, useEffect } from 'react';
import API_URL from '../config/api';
import { useParams } from 'react-router-dom';
import API_URL from '../config/api';
import { Phone, Mail, MessageCircle, MapPin, Bed, Bath, Home } from 'lucide-react';
import API_URL from '../config/api';

const PropertyDetail = () => {
  const { id: propertyId } = useParams(); // Get property ID from URL
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ TRACK VIEW - Runs once when page loads
  useEffect(() => {
    if (propertyId) {
      // Fetch property details
      fetchProperty();
      
      // Track view
      fetch(`${API_URL}/api/analytics/track/view/${propertyId}`, {
        method: 'POST'
      }).catch(err => console.error('Track view error:', err));
    }
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`${API_URL}/api/properties/${propertyId}`);
      const data = await response.json();
      setProperty(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching property:', error);
      setLoading(false);
    }
  };

  // ✅ TRACK PHONE CLICK
  const handlePhoneClick = async () => {
    await fetch(`${API_URL}/api/analytics/track/click/${propertyId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'phone' })
    }).catch(err => console.error('Track click error:', err));
    
    // Open phone dialer
    window.location.href = `tel:${property.landlord.phone}`;
  };

  // ✅ TRACK EMAIL CLICK
  const handleEmailClick = async () => {
    await fetch(`${API_URL}/api/analytics/track/click/${propertyId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'email' })
    }).catch(err => console.error('Track click error:', err));
    
    // Open email client
    window.location.href = `mailto:${property.landlord.email}`;
  };

  // ✅ TRACK WHATSAPP CLICK
  const handleWhatsAppClick = async () => {
    await fetch(`${API_URL}/api/analytics/track/click/${propertyId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'whatsapp' })
    }).catch(err => console.error('Track click error:', err));
    
    // Open WhatsApp
    const phone = property.landlord.phone.replace(/\D/g, ''); // Remove non-digits
    window.open(`https://wa.me/${phone}`, '_blank');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!property) {
    return <div className="flex items-center justify-center min-h-screen">Property not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Property Images */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-6">
          {property.images && property.images.length > 0 && (
            <img 
              src={property.images[0]} 
              alt={property.title}
              className="w-full h-96 object-cover"
            />
          )}
        </div>

        {/* Property Details */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
          <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
          <div className="text-2xl font-bold text-green-600 mb-4">
            KES {property.price?.toLocaleString()}/month
          </div>
          
          <div className="flex gap-6 mb-6">
            {property.bedrooms && (
              <div className="flex items-center gap-2">
                <Bed size={20} className="text-gray-600" />
                <span>{property.bedrooms} Bedrooms</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-2">
                <Bath size={20} className="text-gray-600" />
                <span>{property.bathrooms} Bathrooms</span>
              </div>
            )}
          </div>

          <p className="text-gray-700 mb-6">{property.description}</p>

          {property.location && (
            <div className="flex items-center gap-2 text-gray-600 mb-6">
              <MapPin size={20} />
              <span>{property.location.address}</span>
            </div>
          )}
        </div>

        {/* Contact Landlord Section - WITH ANALYTICS TRACKING */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg border-2 border-green-200">
          <h2 className="text-2xl font-bold mb-6">Contact Landlord</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            {/* Phone Button */}
            <button
              onClick={handlePhoneClick}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
            >
              <Phone size={20} />
              Call Now
            </button>

            {/* Email Button */}
            <button
              onClick={handleEmailClick}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all"
            >
              <Mail size={20} />
              Send Email
            </button>

            {/* WhatsApp Button */}
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
            >
              <MessageCircle size={20} />
              WhatsApp
            </button>
          </div>

          <div className="mt-6 p-4 bg-white rounded-xl">
            <p className="text-sm text-gray-600 mb-2">Landlord Details:</p>
            <p className="font-semibold">{property.landlord?.fullName || property.landlord?.name}</p>
            <p className="text-gray-600">{property.landlord?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;

