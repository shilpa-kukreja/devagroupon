// pages/admin/about-brands.js
"use client";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import AdminLayout from "../components/AdminLayout";

const CKEditor = dynamic(() => import('@ckeditor/ckeditor5-react').then(mod => mod.CKEditor), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-2 text-gray-600">Loading editor...</p>
    </div>
  </div>
});

// Import the editor build directly (not as dynamic)
let ClassicEditor;
if (typeof window !== 'undefined') {
  ClassicEditor = require('@ckeditor/ckeditor5-build-classic');
}
import dynamic from 'next/dynamic';

export default function AboutBrandsPage() {
  const [aboutBrands, setAboutBrands] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    heading: "",
    content: "",
    image: null,
    color: "",
    brand: "",
    sectionType: "",
    order: 0,
    status: "active"
  });
  const [imagePreview, setImagePreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [viewMode, setViewMode] = useState("table");

  // Section type options
  const sectionTypes = [
    { value: 'main', label: 'Main Section' },
    { value: 'usp', label: 'USP Section' },
    { value: 'blend', label: 'Blend Section' },
    { value: 'flavors', label: 'Flavors Section' }
  ];

  // API base URL
  const API_BASE = "http://localhost:5000/api/aboutbrand";

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [aboutBrandsRes, brandsRes] = await Promise.all([
        fetch(`${API_BASE}/about-brands`),
        fetch("http://localhost:5000/api/admin/brands")
      ]);

      if (!aboutBrandsRes.ok || !brandsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [aboutBrandsData, brandsData] = await Promise.all([
        aboutBrandsRes.json(),
        brandsRes.json()
      ]);

      if (aboutBrandsData.success) setAboutBrands(aboutBrandsData.data);
      if (brandsData.success) setBrands(brandsData.data);
      
    } catch (error) {
      toast.error(error.message || "Error fetching data");
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter about brands
  const filteredAboutBrands = aboutBrands.filter(aboutBrand => {
    const matchesSearch = 
      aboutBrand.heading?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aboutBrand.content?.replace(/<[^>]*>/g, '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      aboutBrand.brand?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBrand = brandFilter === "all" || aboutBrand.brand?._id === brandFilter;
    const matchesSection = sectionFilter === "all" || aboutBrand.sectionType === sectionFilter;
    
    return matchesSearch && matchesBrand && matchesSection;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAboutBrands.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAboutBrands = filteredAboutBrands.slice(indexOfFirstItem, indexOfLastItem);

  // Image handling
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setFormData(prev => ({ ...prev, image: file }));
    
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("heading", formData.heading.trim());
      formDataToSend.append("content", formData.content);
      formDataToSend.append("color", formData.color);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("sectionType", formData.sectionType);
      formDataToSend.append("order", formData.order.toString());
      formDataToSend.append("status", formData.status);
      
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const url = editingId 
        ? `${API_BASE}/about-brands/${editingId}`
        : `${API_BASE}/about-brands`;
      
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formDataToSend });
      const data = await res.json();

      if (data.success) {
        toast.success(`About brand section ${editingId ? 'updated' : 'created'} successfully`);
        handleCloseForm();
        fetchData();
      } else {
        throw new Error(data.message || `Failed to ${editingId ? 'update' : 'create'} about brand section`);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Delete about brand
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this about brand section? This action cannot be undone.")) return;
    
    try {
      const res = await fetch(`${API_BASE}/about-brands/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        toast.success("About brand section deleted successfully");
        fetchData();
      } else {
        throw new Error(data.message || "Failed to delete about brand section");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Edit about brand
  const handleEdit = (aboutBrand) => {
    setFormData({
      heading: aboutBrand.heading,
      content: aboutBrand.content,
      image: null,
      color: aboutBrand.color || "",
      brand: aboutBrand.brand?._id || "",
      sectionType: aboutBrand.sectionType,
      order: aboutBrand.order,
      status: aboutBrand.status
    });
    setImagePreview(aboutBrand.image);
    setEditingId(aboutBrand._id);
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      heading: "",
      content: "",
      image: null,
      color: "",
      brand: "",
      sectionType: "",
      order: 0,
      status: "active"
    });
    setImagePreview("");
    setEditingId(null);
  };

  // Close form
  const handleCloseForm = () => {
    setShowForm(false);
    resetForm();
  };

  // Stats
  const stats = {
    total: aboutBrands.length,
    active: aboutBrands.filter(ab => ab.status === 'active').length,
    brands: brands.length,
    sectionTypes: sectionTypes.length
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, brandFilter, sectionFilter]);

  // Loading skeleton
  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto animate-pulse">
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded-lg w-48"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
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
            <div className="bg-white rounded-lg shadow">
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
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">About Brand Sections</h1>
              <p className="mt-1 text-gray-600">Manage rich content sections for your brands</p>
              <div className="mt-1 text-sm text-gray-500">
                {stats.total} sections across {stats.brands} brands
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              disabled={brands.length === 0}
              className="mt-4 lg:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Section
            </button>
          </div>

          {/* Warning if no brands */}
          {brands.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-yellow-800">No Brands Available</h3>
                  <p className="text-yellow-700 text-sm">You need to create brands first before adding about sections.</p>
                  <button 
                    onClick={() => window.location.href = '/admin/brands'}
                    className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                  >
                    Go to Brands Management
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="rounded-lg bg-blue-50 text-blue-600 p-3">
                  <span className="text-lg">📄</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Sections</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="rounded-lg bg-green-50 text-green-600 p-3">
                  <span className="text-lg">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Sections</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="rounded-lg bg-purple-50 text-purple-600 p-3">
                  <span className="text-lg">🏷️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available Brands</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.brands}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="rounded-lg bg-indigo-50 text-indigo-600 p-3">
                  <span className="text-lg">📋</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Section Types</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.sectionTypes}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Sections
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search sections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <select
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  disabled={brands.length === 0}
                >
                  <option value="all">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand._id} value={brand._id}>{brand.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Type
                </label>
                <select
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Sections</option>
                  {sectionTypes.map(section => (
                    <option key={section.value} value={section.value}>{section.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div className="text-sm text-gray-600 mb-2 sm:mb-0">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAboutBrands.length)} of {filteredAboutBrands.length} results
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">View:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 ${viewMode === "table" ? "bg-blue-100 text-blue-600" : "text-gray-400"}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-400"}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mb-8">
            {currentAboutBrands.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No sections found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {aboutBrands.length === 0 
                    ? "Get started by creating your first about section for a brand."
                    : "No sections match your current search criteria. Try adjusting your filters."
                  }
                </p>
                <div className="mt-6">
                  {(searchTerm || brandFilter !== "all" || sectionFilter !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setBrandFilter("all");
                        setSectionFilter("all");
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-3"
                    >
                      Clear filters
                    </button>
                  )}
                  {aboutBrands.length === 0 && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Create First Section
                    </button>
                  )}
                </div>
              </div>
            ) : viewMode === "table" ? (
              <TableView 
                aboutBrands={currentAboutBrands}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <GridView 
                aboutBrands={currentAboutBrands}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredAboutBrands.length}
              onPageChange={setCurrentPage}
            />
          )}

          {/* Form Modal */}
          {showForm && (
            <AboutBrandForm 
              formData={formData}
              formLoading={formLoading}
              editingId={editingId}
              imagePreview={imagePreview}
              brands={brands}
              sectionTypes={sectionTypes}
              onClose={handleCloseForm}
              onSubmit={handleSubmit}
              onImageChange={handleImageChange}
              onFormDataChange={setFormData}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

// Sub-components

const TableView = ({ aboutBrands, onEdit, onDelete }) => {
  const stripHtml = (html) => {
    return html?.replace(/<[^>]*>/g, '') || '';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Section
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Brand
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {aboutBrands.map((aboutBrand) => (
              <tr key={aboutBrand._id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    {aboutBrand.image && (
                      <img 
                        src={`http://localhost:5000${aboutBrand.image}`}
                        alt={aboutBrand.heading}
                        className="h-10 w-10 rounded-lg object-cover mr-3"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {aboutBrand.heading}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {stripHtml(aboutBrand.content)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900">
                    {aboutBrand.brand?.name || 'N/A'}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900 capitalize">
                    {aboutBrand.sectionType}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {aboutBrand.order}
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    aboutBrand.status === "active" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {aboutBrand.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(aboutBrand)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(aboutBrand._id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
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
  );
};

const GridView = ({ aboutBrands, onEdit, onDelete }) => {
  const stripHtml = (html) => {
    return html?.replace(/<[^>]*>/g, '') || '';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {aboutBrands.map((aboutBrand) => (
        <div key={aboutBrand._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          <div className="h-32 bg-gray-100 overflow-hidden">
            {aboutBrand.image ? (
              <img 
                src={`http://localhost:5000${aboutBrand.image}`}
                alt={aboutBrand.heading}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">{aboutBrand.heading}</h3>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="capitalize">{aboutBrand.sectionType}</span>
              <span className={`px-2 py-1 rounded ${
                aboutBrand.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}>
                {aboutBrand.status}
              </span>
            </div>
            <div className="text-xs text-gray-600 mb-3 line-clamp-2">
              {stripHtml(aboutBrand.content)}
            </div>
            <div className="text-xs text-gray-500 mb-3">
              Brand: {aboutBrand.brand?.name || 'N/A'}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(aboutBrand)}
                className="flex-1 text-center py-1 text-xs font-medium text-blue-600 hover:text-blue-900 border border-blue-600 rounded hover:bg-blue-50"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(aboutBrand._id)}
                className="flex-1 text-center py-1 text-xs font-medium text-red-600 hover:text-red-900 border border-red-600 rounded hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, totalItems, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
      <div className="text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {getPageNumbers().map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 text-sm border rounded ${currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'}`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const AboutBrandForm = ({
  formData,
  formLoading,
  editingId,
  imagePreview,
  brands,
  sectionTypes,
  onClose,
  onSubmit,
  onImageChange,
  onFormDataChange
}) => {
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    onFormDataChange({ ...formData, content: data });
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {editingId ? 'Edit About Section' : 'Add New About Section'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {editingId ? 'Update your about section details below' : 'Fill in the details to create a new about section'}
          </p>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heading *
              </label>
              <input
                type="text"
                value={formData.heading}
                onChange={(e) => onFormDataChange({...formData, heading: e.target.value})}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter section heading"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand *
              </label>
              <select
                value={formData.brand}
                onChange={(e) => onFormDataChange({...formData, brand: e.target.value})}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand._id} value={brand._id}>{brand.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <CKEditor
                editor={ClassicEditor}
                data={formData.content}
                onChange={handleEditorChange}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use the rich text editor to format your content with headings, lists, links, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section Type *
              </label>
              <select
                value={formData.sectionType}
                onChange={(e) => onFormDataChange({...formData, sectionType: e.target.value})}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Section Type</option>
                {sectionTypes.map(section => (
                  <option key={section.value} value={section.value}>{section.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => onFormDataChange({...formData, order: parseInt(e.target.value) || 0})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => onFormDataChange({...formData, color: e.target.value})}
                  className="block w-12 h-12 px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-sm text-gray-500">{formData.color || '#000000'}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => onFormDataChange({...formData, status: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image {!editingId && "*"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              required={!editingId}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              {editingId ? "Select a new image to update, or keep the current one" : "Select an image for this section (max 5MB)"}
            </p>
          </div>

          {imagePreview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Preview
              </label>
              <div className="flex justify-center">
                <img 
                  src={`http://localhost:5000${imagePreview}`}
                  alt="Preview" 
                  className="h-24 w-24 rounded-lg object-cover border border-gray-200"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {formLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  {editingId ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editingId ? 'Update Section' : 'Create Section'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};