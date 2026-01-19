import React, { useState } from 'react';
import API_URL from '../config/api';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import API_URL from '../config/api';

const DeleteAccountSection = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      alert('Please type DELETE to confirm');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/users/delete-account`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('✅ Account deleted successfully');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/';
      } else {
        alert('❌ Failed to delete account');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error deleting account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Simple Delete Button */}
      <button
        onClick={() => setShowDeleteModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg font-semibold hover:bg-red-700 transition-all"
      >
        <Trash2 size={16} />
        Delete Account
      </button>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-red-600">Delete Account?</h3>
              <button onClick={() => { setShowDeleteModal(false); setConfirmText(''); }}>
                <X size={20} />
              </button>
            </div>

            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-red-600" />
            </div>

            <p className="text-gray-700 text-sm text-center mb-4">
              This will permanently delete your account, properties, and bookings.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-xs font-semibold text-yellow-800 text-center">
                ⚠️ This action cannot be undone!
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type <span className="text-red-600">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="w-full px-3 py-2 border-2 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteModal(false); setConfirmText(''); }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-lg font-semibold hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={confirmText !== 'DELETE' || loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white text-sm rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteAccountSection;


