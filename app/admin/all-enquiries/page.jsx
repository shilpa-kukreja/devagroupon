// components/AdminDashboard.jsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';

export default function AdminDashboard() {
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [error, setError] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  // Function to determine enquiry type based on businessId
  const getEnquiryType = (enquiry) => {
    return enquiry.businessId ? 'logged_in' : 'direct';
  };

  // Get API endpoint based on enquiry type
  const getUpdateEndpoint = (enquiryId, enquiryType) => {
    if (enquiryType === 'logged_in') {
      return `http://localhost:5000/api/productenquiry/admin/${enquiryId}/status`;
    } else {
      return `http://localhost:5000/api/products/enquiry/${enquiryId}`;
    }
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch data from both APIs
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from both APIs
      const [loggedInEnquiriesRes, directEnquiriesRes, statsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/productenquiry/admin/enquiries?page=${currentPage}&limit=10&status=${activeTab !== 'all' ? activeTab : ''}&search=${debouncedSearchTerm}`),
        fetch(`http://localhost:5000/api/products/enquiry/get`),
        fetch('http://localhost:5000/api/productenquiry/admin/stats')
      ]);

      if (!loggedInEnquiriesRes.ok || !directEnquiriesRes.ok) {
        throw new Error('Failed to fetch enquiries data');
      }

      const loggedInData = await loggedInEnquiriesRes.json();
      const directData = await directEnquiriesRes.json();
      const statsData = statsRes.ok ? await statsRes.json() : { success: false };

      // Combine and process enquiries
      let allEnquiries = [];

      // Process logged-in user enquiries (from productenquiry API)
      if (loggedInData.success && loggedInData.data) {
        const loggedInEnquiries = loggedInData.data.map(enquiry => ({
          ...enquiry,
          enquiryType: 'logged_in',
          source: 'productenquiry'
        }));
        allEnquiries = [...allEnquiries, ...loggedInEnquiries];
      }

      // Process direct user enquiries (from products/enquiry API)
      if (directData.success && directData.enquiries) {
        const directEnquiries = directData.enquiries.map(enquiry => ({
          ...enquiry,
          enquiryType: 'direct',
          source: 'products_enquiry'
        }));
        allEnquiries = [...allEnquiries, ...directEnquiries];
      }

      // Apply filters
      if (activeTab !== 'all') {
        allEnquiries = allEnquiries.filter(enquiry => enquiry.status === activeTab);
      }

      if (debouncedSearchTerm) {
        allEnquiries = allEnquiries.filter(enquiry =>
          enquiry.productName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          enquiry.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          enquiry.companyName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          enquiry.Name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
      }

      // Sort by creation date (newest first)
      allEnquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Paginate
      const startIndex = (currentPage - 1) * 10;
      const paginatedEnquiries = allEnquiries.slice(startIndex, startIndex + 10);

      setEnquiries(paginatedEnquiries);
      setPagination({
        currentPage: parseInt(currentPage),
        totalPages: Math.ceil(allEnquiries.length / 10),
        totalEnquiries: allEnquiries.length,
        hasNext: currentPage * 10 < allEnquiries.length,
        hasPrev: currentPage > 1
      });

      // Set stats
      if (statsData.success) {
        setStats(statsData.data);
      } else {
        // Calculate stats from combined data if admin stats API fails
        const total = allEnquiries.length;
        const pending = allEnquiries.filter(e => e.status === 'pending').length;
        const processing = allEnquiries.filter(e => e.status === 'processing').length;
        const completed = allEnquiries.filter(e => e.status === 'completed').length;
        const cancelled = allEnquiries.filter(e => e.status === 'cancelled').length;
        
        // Calculate recent enquiries (last 7 days)
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const recentEnquiries = allEnquiries.filter(e => 
          new Date(e.createdAt) >= lastWeek
        ).length;

        setStats({
          total,
          pending,
          processing,
          completed,
          cancelled,
          recentEnquiries,
          totalBusinesses: allEnquiries.filter(e => e.enquiryType === 'logged_in').length
        });
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeTab, debouncedSearchTerm]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleStatusUpdate = async (enquiryId, newStatus, enquiryType, source) => {
    setUpdatingStatus(enquiryId);
    try {
      let response;
      
      if (enquiryType === 'logged_in') {
        // Update for logged-in users (PATCH request)
        response = await fetch(`http://localhost:5000/api/productenquiry/admin/${enquiryId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus })
        });
      } else {
        // Update for direct users (PUT request)
        response = await fetch(`http://localhost:5000/api/products/enquiry/${enquiryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus })
        });
      }

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setEnquiries(prev => prev.map(item => 
          item._id === enquiryId ? { ...item, status: newStatus } : item
        ));
        
        // Refresh data
        fetchDashboardData();
      } else {
        throw new Error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError(error.message);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleViewDetails = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowEnquiryModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      processing: '🔄',
      completed: '✅',
      cancelled: '❌'
    };
    return icons[status] || '📋';
  };

  // Enquiry Type Badge Component
  const EnquiryTypeBadge = ({ enquiry }) => {
    const enquiryType = getEnquiryType(enquiry);
    const typeConfig = {
      logged_in: {
        label: 'Login User',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: '👤',
        tooltip: 'Registered Business User'
      },
      direct: {
        label: 'Direct User', 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: '🌐',
        tooltip: 'Direct Website Visitor'
      }
    };

    const config = typeConfig[enquiryType];

    return (
      <div className="flex flex-col items-start space-y-1">
        <span 
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}
          title={config.tooltip}
        >
          <span className="mr-1">{config.icon}</span>
          {config.label}
        </span>
        {enquiryType === 'logged_in' && (
          <span className="text-xs text-green-600 font-medium">✅ Registered</span>
        )}
      </div>
    );
  };

  const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
      <span className="mr-1">{getStatusIcon(status)}</span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  const StatCard = ({ label, value, color, icon, subtitle }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
          <div className="flex items-baseline space-x-2">
            <div className={`text-2xl font-bold text-${color}-600`}>{value}</div>
            {subtitle && <span className="text-xs text-gray-500">{subtitle}</span>}
          </div>
        </div>
        <div className={`w-12 h-12 bg-${color}-50 rounded-xl flex items-center justify-center`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && enquiries.length === 0) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading all enquiries from both sources...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-red-400">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-1 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">All Enquiries</h1>
            <p className="mt-2 text-gray-600">Managing enquiries from both logged-in users and direct visitors</p>
            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Login Users
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                Direct Users
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              label="Total Enquiries" 
              value={stats.total || 0} 
              color="blue" 
              icon="📊"
            />
            <StatCard 
              label="Login Users" 
              value={enquiries.filter(e => e.enquiryType === 'logged_in').length} 
              color="green" 
              icon="👤"
            />
            <StatCard 
              label="Direct Users" 
              value={enquiries.filter(e => e.enquiryType === 'direct').length} 
              color="blue" 
              icon="🌐"
            />
            <StatCard 
              label="Pending" 
              value={stats.pending || 0} 
              color="amber" 
              icon="⏳"
            />
          </div>

          {/* User Type Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Type Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Login Users</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {enquiries.filter(e => e.enquiryType === 'logged_in').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Direct Users</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {enquiries.filter(e => e.enquiryType === 'direct').length}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Sources</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">ProductEnquiry API</span>
                  <span className="font-medium text-green-600">Login Users</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Products/Enquiry API</span>
                  <span className="font-medium text-blue-600">Direct Users</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header with Search and Filters */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Enquiry Management</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {pagination.totalEnquiries ? `Total: ${pagination.totalEnquiries} enquiries` : 'No enquiries found'}
                    {` • Login: ${enquiries.filter(e => e.enquiryType === 'logged_in').length}`}
                    {` • Direct: ${enquiries.filter(e => e.enquiryType === 'direct').length}`}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 sm:w-64">
                    <input
                      type="text"
                      placeholder="Search enquiries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      🔍
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Tabs */}
              <div className="flex flex-wrap gap-1 mt-6">
                {[
                  { key: 'all', label: 'All Enquiries', count: stats.total },
                  { key: 'pending', label: 'Pending', count: stats.pending },
                  { key: 'processing', label: 'Processing', count: stats.processing },
                  { key: 'completed', label: 'Completed', count: stats.completed },
                  { key: 'cancelled', label: 'Cancelled', count: stats.cancelled }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setCurrentPage(1);
                    }}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      activeTab === tab.key
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                        activeTab === tab.key ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Enquiries Table */}
            {enquiries.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No enquiries found</h3>
                <p className="text-gray-500 mb-4">
                  {debouncedSearchTerm ? 'Try adjusting your search terms' : 'No enquiries match the current filters'}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product & Business
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact Information
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {enquiries.map((enquiry) => (
                        <tr 
                          key={enquiry._id} 
                          className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                          onClick={() => handleViewDetails(enquiry)}
                        >
                          {/* User Type Column */}
                          <td className="px-6 py-4">
                            <EnquiryTypeBadge enquiry={enquiry} />
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{enquiry.productName}</div>
                            <div className="text-sm text-gray-500 mt-1 line-clamp-2">{enquiry.description}</div>
                            <div className="text-xs text-blue-600 font-medium mt-2">
                              {enquiry.businessId?.companyName || enquiry.companyName || 'N/A'}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{enquiry.Name}</div>
                            <div className="text-xs text-gray-500 mt-1">{enquiry.email}</div>
                            <div className="text-xs text-gray-500">{enquiry.phone}</div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              <strong>Qty:</strong> {enquiry.quantity}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatDate(enquiry.createdAt)}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="flex flex-col space-y-2">
                              <StatusBadge status={enquiry.status} />
                              <select
                                value={enquiry.status}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleStatusUpdate(enquiry._id, e.target.value, enquiry.enquiryType, enquiry.source);
                                }}
                                disabled={updatingStatus === enquiry._id}
                                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <option value="pending">Mark as Pending</option>
                                <option value="processing">Mark as Processing</option>
                                <option value="completed">Mark as Completed</option>
                                <option value="cancelled">Mark as Cancelled</option>
                              </select>
                              {updatingStatus === enquiry._id && (
                                <div className="text-xs text-gray-500">Updating...</div>
                              )}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleViewDetails(enquiry)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded border border-blue-200 hover:bg-blue-50 transition-colors"
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">{((currentPage - 1) * 10) + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * 10, pagination.totalEnquiries)}</span> of{' '}
                        <span className="font-medium">{pagination.totalEnquiries}</span> results
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>
                        <span className="text-sm text-gray-700">
                          Page <span className="font-medium">{currentPage}</span> of{' '}
                          <span className="font-medium">{pagination.totalPages}</span>
                        </span>
                        <button
                          onClick={() => setCurrentPage(prev => prev + 1)}
                          disabled={currentPage === pagination.totalPages}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Enquiry Detail Modal */}
        {showEnquiryModal && selectedEnquiry && (
          <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Enquiry Details</h3>
                  <button
                    onClick={() => setShowEnquiryModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* User Type Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Enquiry Type</h4>
                      <div className="mt-1">
                        <EnquiryTypeBadge enquiry={selectedEnquiry} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Data Source</div>
                      <div className="text-sm font-medium text-gray-700">
                        {selectedEnquiry.source === 'productenquiry' ? 'ProductEnquiry API' : 'Products/Enquiry API'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Product Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.productName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Quantity</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.quantity}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Contact Person</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.Name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Company</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedEnquiry.businessId?.companyName || selectedEnquiry.companyName || 'N/A'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{selectedEnquiry.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">
                      <StatusBadge status={selectedEnquiry.status} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Submitted</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedEnquiry.createdAt)}</p>
                  </div>
                </div>

                {/* Business Details for Login Users */}
                {selectedEnquiry.enquiryType === 'logged_in' && selectedEnquiry.businessId && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Business Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-green-50 p-4 rounded-lg">
                      <div>
                        <label className="text-xs font-medium text-gray-600">Business Name</label>
                        <p className="text-sm text-gray-900">{selectedEnquiry.businessId.companyName}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Contact</label>
                        <p className="text-sm text-gray-900">
                          {selectedEnquiry.businessId.firstName} {selectedEnquiry.businessId.lastName}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowEnquiryModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}