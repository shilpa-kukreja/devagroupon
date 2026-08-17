"use client";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import AdminLayout from "../components/AdminLayout";

export default function CountriesPage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    img: null
  });
  const [imagePreview, setImagePreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"

  // Fetch all countries
  const fetchCountries = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/admin/countries");
      
      if (!res.ok) {
        throw new Error('Failed to fetch countries');
      }

      const data = await res.json();
      if (data.success) {
        setCountries(data.data);
      } else {
        throw new Error(data.message || "Failed to load countries");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching countries");
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setFormData({ ...formData, img: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle create/update country
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      
      if (formData.img) {
        formDataToSend.append("img", formData.img);
      }

      const url = editingId 
        ? `http://localhost:5000/api/admin/countries/${editingId}`
        : "http://localhost:5000/api/admin/countries";
      
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formDataToSend,
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Country ${editingId ? 'updated' : 'created'} successfully`);
        handleCloseForm();
        fetchCountries();
      } else {
        throw new Error(data.message || `Failed to ${editingId ? 'update' : 'create'} country`);
      }
    } catch (error) {
      toast.error(error.message || `Error ${editingId ? 'updating' : 'creating'} country`);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete country
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this country? This action cannot be undone.")) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/admin/countries/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Country deleted successfully");
        fetchCountries();
      } else {
        throw new Error(data.message || "Failed to delete country");
      }
    } catch (error) {
      toast.error(error.message || "Error deleting country");
    }
  };

  // Handle edit country
  const handleEdit = (country) => {
    setFormData({
      name: country.name,
      img: null
    });
    setImagePreview(`http://localhost:5000${country.img}` || country.img);
    setEditingId(country._id);
    setShowForm(true);
  };

  // Reset form when closing
  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({ name: "", img: null });
    setImagePreview("");
    setEditingId(null);
  };

  // Filter countries based on search
  const filteredCountries = countries.filter(country => {
    return country.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCountries = filteredCountries.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Loading skeleton
  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded-lg w-48"></div>
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="ml-4">
                      <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table Skeleton */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-t-lg"></div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 border-b border-gray-200 p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Grid Card Component
  const CountryCard = ({ country }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Flag Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {country.img ? (
          <img 
            src={`http://localhost:5000${country.img}`} // Replace with your backend APIcountry.img} 
            alt={country.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
          {country.name}
        </h3>

        <div className="text-xs text-gray-500 mb-4">
          Created: {new Date(country.createdAt).toLocaleDateString()}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(country)}
            className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(country._id)}
            className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Country Management</h1>
              <p className="mt-2 text-gray-600">
                Manage and organize your supported countries
              </p>
              <div className="mt-1 text-sm text-gray-500">
                {countries.length} countries in system
              </div>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setFormData({ name: "", img: null });
                setImagePreview("");
              }}
              className="mt-4 lg:mt-0 inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Country
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-blue-500 p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Countries</p>
                  <p className="text-2xl font-bold text-gray-900">{countries.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-green-500 p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Support</p>
                  <p className="text-2xl font-bold text-gray-900">{countries.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-purple-500 p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Flags Available</p>
                  <p className="text-2xl font-bold text-gray-900">{countries.filter(c => c.img).length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Countries
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="search"
                    placeholder="Search by country name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Header and View Toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastItem, filteredCountries.length)}</span> of{" "}
              <span className="font-medium">{filteredCountries.length}</span> results
              {searchTerm && (
                <span className="text-blue-600 ml-2">
                  (filtered from {countries.length} total)
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Items Per Page */}
              <div className="flex items-center space-x-2">
                <label htmlFor="itemsPerPage" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Items per page:
                </label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="block w-20 px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-1 border border-gray-300 rounded-md p-1">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === "table" 
                      ? "bg-blue-100 text-blue-600" 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === "grid" 
                      ? "bg-blue-100 text-blue-600" 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Countries Display */}
          {currentCountries.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No countries found</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                {countries.length === 0 
                  ? "Get started by adding your first country to expand your business reach." 
                  : "No countries match your current search criteria. Try adjusting your filters."}
              </p>
              <div className="mt-6 space-x-3">
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Clear search
                  </button>
                )}
                {countries.length === 0 && (
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setEditingId(null);
                      setFormData({ name: "", img: null });
                      setImagePreview("");
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add First Country
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Table View */}
              {viewMode === "table" && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Country Details
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Flag
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentCountries.map((country) => (
                          <tr key={country._id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {country.img && (
                                  <img 
                                    src={`http://localhost:5000${country.img}`} // Replace with your backend APIcountry.img} 
                                    alt={country.name}
                                    className="h-10 w-10 rounded-lg object-cover mr-3"
                                  />
                                )}
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {country.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Country
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {country.img ? (
                                <img 
                                  src={`http://localhost:5000${country.img}`} // Replace with your backend APIcountry.img} 
                                  alt={country.name}
                                  className="h-12 w-16 rounded object-cover border border-gray-200"
                                />
                              ) : (
                                <div className="h-12 w-16 rounded bg-gray-100 flex items-center justify-center border border-gray-200">
                                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(country.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleEdit(country)}
                                  className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(country._id)}
                                  className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {currentCountries.map((country) => (
                    <CountryCard key={country._id} country={country} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                        <span className="font-medium">{Math.min(indexOfLastItem, filteredCountries.length)}</span> of{" "}
                        <span className="font-medium">{filteredCountries.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                        <button
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                          </svg>
                        </button>
                        
                        {getPageNumbers().map((pageNumber, index) => (
                          <button
                            key={index}
                            onClick={() => typeof pageNumber === 'number' && setCurrentPage(pageNumber)}
                            disabled={pageNumber === '...'}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                              pageNumber === currentPage
                                ? 'bg-blue-600 text-white  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                : pageNumber === '...'
                                ? 'text-gray-500 cursor-default'
                                : 'text-gray-900'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l4.5 4.25a.75.75 0 01-1.06.02z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingId ? 'Edit Country' : 'Add New Country'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingId ? 'Update your country details below' : 'Fill in the details to add a new country'}
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter country name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Flag Image {!editingId && "*"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required={!editingId}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {editingId ? "Select a new flag image to update, or keep the current one" : "Select a flag image for the country (max 5MB)"}
                    </p>
                  </div>

                  {imagePreview && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Flag Preview
                      </label>
                      <div className="flex justify-center">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="h-16 w-24 rounded object-cover border border-gray-200"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {formLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          {editingId ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        editingId ? 'Update Country' : 'Add Country'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}