import React, { useState, useEffect } from 'react';
import API_URL from '../../config/api';
import { 
  Shield, 
  Users, 
  Home, 
  AlertTriangle,
  Trash2,
  Ban,
  CheckCircle,
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Lock,
  Unlock
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const [landlords, setLandlords] = useState([]);
  const [stats, setStats] = useState({
    totalLandlords: 0,
    totalProperties: 0,
    activeListings: 0,
    suspendedAccounts: 0,
    reportsThisMonth: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLandlord, setSelectedLandlord] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const landlordsResponse = await fetch(`${API_URL}/api/admin/landlords`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const landlordsData = await landlordsResponse.json();
      setLandlords(landlordsData);

      const statsResponse = await fetch(`${API_URL}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsResponse.json();
      setStats(statsData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleSuspendLandlord = async (landlordId) => {
    if (!window.confirm('Suspend this landlord? Their properties will be hidden.')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/landlords/${landlordId}/suspend`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('✅ Landlord suspended');
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUnsuspendLandlord = async (landlordId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/admin/landlords/${landlordId}/unsuspend`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('✅ Landlord reactivated');
      fetchDashboardData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteLandlord = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/admin/landlords/${selectedLandlord._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('✅ Landlord deleted');
      setShowDeleteConfirm(false);
      setSelectedLandlord(null);
      fetchDashboardData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredLandlords = landlords.filter(landlord => {
    const matchesSearch = landlord.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         landlord.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'active' && !landlord.suspended) ||
                         (filterStatus === 'suspended' && landlord.suspended);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-8 shadow-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Shield size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Super Admin Dashboard</h1>
              <p className="text-lg opacity-90">Monitor and manage all landlords</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { icon: Users, label: 'Total Landlords', value: stats.totalLandlords, color: 'blue' },
            { icon: Home, label: 'Total Properties', value: stats.totalProperties, color: 'green' },
            { icon: TrendingUp, label: 'Active Listings', value: stats.activeListings, color: 'purple' },
            { icon: Ban, label: 'Suspended', value: stats.suspendedAccounts, color: 'red' },
            { icon: AlertTriangle, label: 'Reports', value: stats.reportsThisMonth, color: 'yellow' }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Icon size={24} className="text-gray-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search landlords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-6 mt-8 pb-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="text-left p-4">Landlord</th>
                <th className="text-left p-4">Contact</th>
                <th className="text-center p-4">Properties</th>
                <th className="text-center p-4">Status</th>
                <th className="text-center p-4">Joined</th>
                <th className="text-center p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLandlords.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">
                    No landlords found
                  </td>
                </tr>
              ) : (
                filteredLandlords.map((landlord) => (
                  <tr key={landlord._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                          {landlord.name?.charAt(0) || 'L'}
                        </div>
                        <div>
                          <div className="font-semibold">{landlord.name}</div>
                          <div className="text-sm text-gray-500">ID: {landlord._id.slice(-8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{landlord.email}</div>
                      {landlord.phone && <div className="text-sm text-gray-500">{landlord.phone}</div>}
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                        {landlord.propertyCount || 0}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {landlord.suspended ? (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-semibold">
                          Suspended
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center text-sm">
                      {new Date(landlord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => { setSelectedLandlord(landlord); setShowDetailsModal(true); }}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                        >
                          <Eye size={18} />
                        </button>
                        {landlord.suspended ? (
                          <button
                            onClick={() => handleUnsuspendLandlord(landlord._id)}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                          >
                            <Unlock size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSuspendLandlord(landlord._id)}
                            className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200"
                          >
                            <Lock size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => { setSelectedLandlord(landlord); setShowDeleteConfirm(true); }}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteConfirm && selectedLandlord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4">Delete Landlord?</h3>
            <p className="text-center mb-6">
              Delete <strong>{selectedLandlord.name}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => { setShowDeleteConfirm(false); setSelectedLandlord(null); }}
                className="flex-1 px-6 py-3 bg-gray-200 rounded-xl font-bold hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLandlord}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedLandlord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Landlord Details</h3>
              <button onClick={() => { setShowDetailsModal(false); setSelectedLandlord(null); }}>✕</button>
            </div>
            <div className="space-y-4">
              <div><strong>Name:</strong> {selectedLandlord.name}</div>
              <div><strong>Email:</strong> {selectedLandlord.email}</div>
              {selectedLandlord.phone && <div><strong>Phone:</strong> {selectedLandlord.phone}</div>}
              <div><strong>Properties:</strong> {selectedLandlord.propertyCount || 0}</div>
              <div><strong>Joined:</strong> {new Date(selectedLandlord.createdAt).toLocaleString()}</div>
            </div>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="w-full mt-6 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;


