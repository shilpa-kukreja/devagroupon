'use client';
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiMail,
  FiTrash2,
  FiUsers,
  FiDownload,
  FiSearch,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiAlertTriangle,
  FiUser,
  FiBriefcase
} from "react-icons/fi";

const SubscriptionManagement = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const subscribersPerPage = 10;

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://devagroupon-1.onrender.com/api/newsletter/subscribers");
      setSubscribers(response.data);
    } catch (error) {
      console.error("Failed to fetch subscribers", error);
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (email) => {
    try {
      setActionLoading(true);
      await axios.delete(`https://devagroupon-1.onrender.com/api/newsletter/subscribers/${email}`);
      toast.success("Subscriber removed successfully");
      setSubscribers((prev) => prev.filter((sub) => sub.email !== email));
      setDeleteConfirm(null);
      setSelectedSubscribers(prev => prev.filter(e => e !== email));
    } catch (error) {
      console.error("Unsubscribe failed", error);
      toast.error(error.response?.data?.message || "Failed to remove subscriber");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkUnsubscribe = async () => {
    if (selectedSubscribers.length === 0) return;
    
    try {
      setActionLoading(true);
      // Using Promise.all for parallel deletion
      await Promise.all(
        selectedSubscribers.map(email => 
          axios.delete(`https://devagroupon-1.onrender.com/api/newsletter/subscribers/${email}`)
        )
      );
      
      toast.success(`${selectedSubscribers.length} subscriber${selectedSubscribers.length > 1 ? 's' : ''} removed successfully`);
      setSubscribers(prev => prev.filter(sub => !selectedSubscribers.includes(sub.email)));
      setSelectedSubscribers([]);
    } catch (error) {
      console.error("Bulk unsubscribe failed", error);
      toast.error("Failed to remove some subscribers");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectSubscriber = (email) => {
    setSelectedSubscribers(prev =>
      prev.includes(email)
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  const handleSelectAll = () => {
    setSelectedSubscribers(
      selectedSubscribers.length === filteredSubscribers.length
        ? []
        : filteredSubscribers.map(sub => sub.email)
    );
  };

  const handleBulkDelete = async () => {
    if (selectedSubscribers.length === 0) return;
    
    if (window.confirm(`Remove ${selectedSubscribers.length} selected subscriber${selectedSubscribers.length > 1 ? 's' : ''}? This action cannot be undone.`)) {
      await handleBulkUnsubscribe();
    }
  };

  const exportSubscribers = () => {
    const headers = ["Email", "First Name", "Last Name", "Company", "Subscription Date", "Status"];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + subscribers.map(sub => 
          `"${sub.email}","${sub.firstName || 'N/A'}","${sub.lastName || 'N/A'}","${sub.companyName || 'N/A'}","${formatDateForExport(sub.subscribedAt)}","Active"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Subscribers exported successfully");
  };

  const formatDateForExport = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSubscriberName = (subscriber) => {
    if (subscriber.firstName && subscriber.lastName) {
      return `${subscriber.firstName} ${subscriber.lastName}`;
    } else if (subscriber.firstName) {
      return subscriber.firstName;
    } else if (subscriber.lastName) {
      return subscriber.lastName;
    }
    return 'Unknown';
  };

  const filteredSubscribers = useMemo(() => 
    subscribers.filter(sub => 
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.firstName && sub.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sub.lastName && sub.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sub.companyName && sub.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [subscribers, searchTerm]
  );

  // Pagination logic
  const paginationData = useMemo(() => {
    const indexOfLastSubscriber = currentPage * subscribersPerPage;
    const indexOfFirstSubscriber = indexOfLastSubscriber - subscribersPerPage;
    const currentSubscribers = filteredSubscribers.slice(indexOfFirstSubscriber, indexOfLastSubscriber);
    const totalPages = Math.ceil(filteredSubscribers.length / subscribersPerPage);

    return {
      currentSubscribers,
      totalPages,
      indexOfFirstSubscriber,
      indexOfLastSubscriber
    };
  }, [currentPage, filteredSubscribers, subscribersPerPage]);

  const { currentSubscribers, totalPages, indexOfFirstSubscriber, indexOfLastSubscriber } = paginationData;

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Newsletter Subscribers</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Manage and monitor your email subscription list
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <FiUsers className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                      <p className="text-2xl font-bold text-gray-900">{subscribers.length.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, or company..."
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition-colors"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                {selectedSubscribers.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    disabled={actionLoading}
                    className="flex items-center px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <FiTrash2 className="h-4 w-4 mr-2" />
                    Remove Selected ({selectedSubscribers.length})
                  </button>
                )}
                
                <button
                  onClick={exportSubscribers}
                  className="flex items-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium"
                >
                  <FiDownload className="h-4 w-4 mr-2" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Subscribers Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {filteredSubscribers.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="pl-6 pr-3 py-4">
                          <input
                            type="checkbox"
                            checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                            onChange={handleSelectAll}
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                          />
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">
                          Subscriber
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">
                          Company
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">
                          Subscription Date
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">
                          Status
                        </th>
                        <th className="pr-6 py-4 text-right text-sm font-semibold text-gray-900 uppercase tracking-wide">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentSubscribers.map((subscriber) => (
                        <tr key={subscriber.email} className="hover:bg-gray-50 transition-colors">
                          <td className="pl-6 pr-3 py-4">
                            <input
                              type="checkbox"
                              checked={selectedSubscribers.includes(subscriber.email)}
                              onChange={() => handleSelectSubscriber(subscriber.email)}
                              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FiUser className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900 text-sm">
                                  {formatSubscriberName(subscriber)}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <FiMail className="h-3 w-3 mr-1" />
                                  {subscriber.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center text-sm text-gray-900">
                              {subscriber.companyName ? (
                                <>
                                  <FiBriefcase className="h-4 w-4 mr-2 text-gray-400" />
                                  {subscriber.companyName}
                                </>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">
                              {subscriber.subscribedAt ? (
                                new Date(subscriber.subscribedAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })
                              ) : (
                                <span className="text-gray-400">Unknown</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <FiCheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </span>
                          </td>
                          <td className="pr-6 py-4 text-right">
                            <button
                              onClick={() => setDeleteConfirm(subscriber)}
                              disabled={actionLoading}
                              className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Remove subscriber"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {filteredSubscribers.length > subscribersPerPage && (
                  <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-medium">{indexOfFirstSubscriber + 1}</span> to{" "}
                      <span className="font-medium">{Math.min(indexOfLastSubscriber, filteredSubscribers.length)}</span> of{" "}
                      <span className="font-medium">{filteredSubscribers.length}</span> results
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg transition-colors ${
                          currentPage === 1
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <FiChevronLeft className="h-5 w-5" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                        <button
                          key={number}
                          onClick={() => setCurrentPage(number)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === number
                              ? "bg-blue-600 text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {number}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg transition-colors ${
                          currentPage === totalPages
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <FiChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <FiMail className="h-16 w-16 mb-4 opacity-40" />
                  <p className="text-xl font-medium text-gray-500 mb-2">
                    {searchTerm ? "No subscribers found" : "No subscribers yet"}
                  </p>
                  <p className="text-sm text-gray-400 max-w-sm">
                    {searchTerm 
                      ? "Try adjusting your search terms or browse all subscribers"
                      : "Subscribers will appear here once they sign up for your newsletter"
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-auto">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-red-100 mr-3">
                <FiAlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Removal</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to remove this subscriber?
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="font-medium text-gray-900">{formatSubscriberName(deleteConfirm)}</div>
              <div className="text-sm text-gray-600 flex items-center mt-1">
                <FiMail className="h-3 w-3 mr-1" />
                {deleteConfirm.email}
              </div>
              {deleteConfirm.companyName && (
                <div className="text-sm text-gray-600 flex items-center mt-1">
                  <FiBriefcase className="h-3 w-3 mr-1" />
                  {deleteConfirm.companyName}
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUnsubscribe(deleteConfirm.email)}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {actionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Removing...
                  </>
                ) : (
                  "Remove Subscriber"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default SubscriptionManagement;