import React, { useState } from 'react';
import API_URL from '../config/api';
import { Star, X } from 'lucide-react';

export default function RatingModal({ property, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!userEmail.trim()) {
      alert('Please enter your email');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: property._id,
          rating,
          review,
          userName: userName.trim(),
          userEmail: userEmail.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Thank you for your review!');
        onSubmit(); // Refresh properties
        onClose();
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold text-slate-800">Rate Property</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Property Info */}
          <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{property.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">{property.address}</p>
            <p className="text-green-600 dark:text-green-400 font-bold text-lg mt-2">
              KES {property.price?.toLocaleString()}/month
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Your Rating *
              </label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={40}
                      className={`${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-center mt-2 text-sm text-slate-600">
                {rating === 0 && 'Select a rating'}
                {rating === 1 && '⭐ Poor'}
                {rating === 2 && '⭐⭐ Fair'}
                {rating === 3 && '⭐⭐⭐ Good'}
                {rating === 4 && '⭐⭐⭐⭐ Very Good'}
                {rating === 5 && '⭐⭐⭐⭐⭐ Excellent'}
              </p>
            </div>

            {/* User Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="John Doe"
                required
              />
            </div>

            {/* User Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Your Email *
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="john@example.com"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                We use your email to prevent duplicate reviews
              </p>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Your Review (Optional)
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none h-32"
                placeholder="Tell others about your experience with this property..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


