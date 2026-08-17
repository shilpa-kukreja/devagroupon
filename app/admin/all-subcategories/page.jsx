"use client";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import AdminLayout from "../components/AdminLayout";
import * as XLSX from "xlsx";

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    img: null,
    category: "",
    status: "active"
  });
  const [imagePreview, setImagePreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [exportLoading, setExportLoading] = useState(false);

  // Fetch all subcategories and categories
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [subcategoriesRes, categoriesRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/subcategories"),
        fetch("http://localhost:5000/api/admin/categories")
      ]);

      if (!subcategoriesRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [subcategoriesData, categoriesData] = await Promise.all([
        subcategoriesRes.json(),
        categoriesRes.json()
      ]);

      if (subcategoriesData.success) {
        setSubcategories(subcategoriesData.data);
      } else {
        throw new Error(subcategoriesData.message || "Failed to load subcategories");
      }

      if (categoriesData.success) {
        setCategories(categoriesData.data);
      } else {
        throw new Error(categoriesData.message || "Failed to load categories");
      }
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

  // Export to Excel function
  const exportToExcel = () => {
    try {
      setExportLoading(true);
      
      // Prepare data for export
      const exportData = subcategories.map(subcategory => ({
        "ID": subcategory._id,
        "Subcategory Name": subcategory.name,
        "Slug": subcategory.slug || "",
        "Parent Category": subcategory.category?.name || "N/A",
        "Parent Category ID": subcategory.category?._id || "",
        "Main Category": subcategory.category?.maincategory?.name || "N/A",
        "Main Category ID": subcategory.category?.maincategory?._id || "",
        "Status": subcategory.status.charAt(0).toUpperCase() + subcategory.status.slice(1),
        "Image URL": subcategory.img ? `http://localhost:5000${subcategory.img}` : "",
        "Created Date": new Date(subcategory.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        "Created Time": new Date(subcategory.createdAt).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        "Updated Date": subcategory.updatedAt ? new Date(subcategory.updatedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : "",
        "Active": subcategory.status === "active" ? "Yes" : "No",
        "Products Count": subcategory.productsCount || 0
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Add column widths
      const colWidths = [
        { wch: 24 }, // ID
        { wch: 25 }, // Subcategory Name
        { wch: 20 }, // Slug
        { wch: 20 }, // Parent Category
        { wch: 24 }, // Parent Category ID
        { wch: 20 }, // Main Category
        { wch: 24 }, // Main Category ID
        { wch: 12 }, // Status
        { wch: 40 }, // Image URL
        { wch: 15 }, // Created Date
        { wch: 12 }, // Created Time
        { wch: 15 }, // Updated Date
        { wch: 8 },  // Active
        { wch: 12 }, // Products Count
      ];
      worksheet['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Subcategories");

      // Generate file name with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `subcategories_export_${timestamp}.xlsx`;

      // Export the file
      XLSX.writeFile(workbook, fileName);
      
      toast.success(`Exported ${subcategories.length} subcategories to Excel`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export to Excel');
    } finally {
      setExportLoading(false);
    }
  };

  // Export filtered results to Excel
  const exportFilteredToExcel = () => {
    try {
      setExportLoading(true);
      
      const exportData = filteredSubcategories.map(subcategory => ({
        "ID": subcategory._id,
        "Subcategory Name": subcategory.name,
        "Slug": subcategory.slug || "",
        "Parent Category": subcategory.category?.name || "N/A",
        "Parent Category ID": subcategory.category?._id || "",
        "Main Category": subcategory.category?.maincategory?.name || "N/A",
        "Status": subcategory.status.charAt(0).toUpperCase() + subcategory.status.slice(1),
        "Image URL": subcategory.img ? `http://localhost:5000${subcategory.img}` : "",
        "Created Date": new Date(subcategory.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        "Created Time": new Date(subcategory.createdAt).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        "Active": subcategory.status === "active" ? "Yes" : "No",
        "Products Count": subcategory.productsCount || 0
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      const colWidths = [
        { wch: 24 },
        { wch: 25 },
        { wch: 20 },
        { wch: 20 },
        { wch: 24 },
        { wch: 20 },
        { wch: 12 },
        { wch: 40 },
        { wch: 15 },
        { wch: 12 },
        { wch: 8 },
        { wch: 12 },
      ];
      worksheet['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Subcategories");

      const timestamp = new Date().toISOString().split('T')[0];
      const filterInfo = searchTerm ? `_search_${searchTerm.substring(0, 10)}` : "";
      const statusInfo = statusFilter !== "all" ? `_${statusFilter}` : "";
      const fileName = `subcategories_filtered${filterInfo}${statusInfo}_${timestamp}.xlsx`;

      XLSX.writeFile(workbook, fileName);
      
      toast.success(`Exported ${filteredSubcategories.length} filtered subcategories to Excel`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export filtered results');
    } finally {
      setExportLoading(false);
    }
  };

  // Export by Parent Category
  const exportByParentCategory = (categoryId, categoryName) => {
    try {
      setExportLoading(true);
      
      const filteredByParent = subcategories.filter(
        subcategory => subcategory.category?._id === categoryId
      );
      
      const exportData = filteredByParent.map(subcategory => ({
        "ID": subcategory._id,
        "Subcategory Name": subcategory.name,
        "Slug": subcategory.slug || "",
        "Parent Category": subcategory.category?.name || "N/A",
        "Parent Category ID": subcategory.category?._id || "",
        "Status": subcategory.status.charAt(0).toUpperCase() + subcategory.status.slice(1),
        "Image URL": subcategory.img ? `http://localhost:5000${subcategory.img}` : "",
        "Created Date": new Date(subcategory.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        "Active": subcategory.status === "active" ? "Yes" : "No"
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      const colWidths = [
        { wch: 24 },
        { wch: 25 },
        { wch: 20 },
        { wch: 20 },
        { wch: 24 },
        { wch: 12 },
        { wch: 40 },
        { wch: 15 },
        { wch: 8 },
      ];
      worksheet['!cols'] = colWidths;

      const safeName = categoryName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
      XLSX.utils.book_append_sheet(workbook, worksheet, safeName);

      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `subcategories_${safeName}_${timestamp}.xlsx`;

      XLSX.writeFile(workbook, fileName);
      
      toast.success(`Exported ${filteredByParent.length} subcategories for ${categoryName}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Failed to export subcategories for ${categoryName}`);
    } finally {
      setExportLoading(false);
    }
  };

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

  // Handle create/update subcategory
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("category", formData.category);
      formDataToSend.append("status", formData.status);
      
      if (formData.img) {
        formDataToSend.append("img", formData.img);
      }

      const url = editingId 
        ? `http://localhost:5000/api/admin/subcategories/${editingId}`
        : "http://localhost:5000/api/admin/subcategories";
      
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formDataToSend,
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Subcategory ${editingId ? 'updated' : 'created'} successfully`);
        handleCloseForm();
        fetchData();
      } else {
        throw new Error(data.message || `Failed to ${editingId ? 'update' : 'create'} subcategory`);
      }
    } catch (error) {
      toast.error(error.message || `Error ${editingId ? 'updating' : 'creating'} subcategory`);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete subcategory
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subcategory? This action cannot be undone.")) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/admin/subcategories/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Subcategory deleted successfully");
        fetchData();
      } else {
        throw new Error(data.message || "Failed to delete subcategory");
      }
    } catch (error) {
      toast.error(error.message || "Error deleting subcategory");
    }
  };

  // Handle edit subcategory
  const handleEdit = (subcategory) => {
    setFormData({
      name: subcategory.name,
      img: null,
      category: subcategory.category?._id || "",
      status: subcategory.status
    });
    setImagePreview(subcategory.img);
    setEditingId(subcategory._id);
    setShowForm(true);
  };

  // Reset form when closing
  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({ name: "", img: null, category: "", status: "active" });
    setImagePreview("");
    setEditingId(null);
  };

  // Filter subcategories based on search and status
  const filteredSubcategories = subcategories.filter(subcategory => {
    const matchesSearch = 
      subcategory.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subcategory.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subcategory.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || subcategory.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredSubcategories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubcategories = filteredSubcategories.slice(indexOfFirstItem, indexOfLastItem);

  // Get status count
  const getStatusCount = (status) => {
    return subcategories.filter(subcategory => subcategory.status === status).length;
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
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
  const SubcategoryCard = ({ subcategory }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {subcategory.img ? (
          <img 
            src={`http://localhost:5000${subcategory.img} `}
            alt={subcategory.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
            subcategory.status === "active" 
              ? "bg-green-100 text-green-800" 
              : "bg-gray-100 text-gray-800"
          }`}>
            {subcategory.status === "active" ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
          {subcategory.name}
        </h3>
        
        <div className="text-xs text-gray-500 font-mono mb-2">
          {subcategory.slug}
        </div>

        <div className="text-sm text-gray-600 mb-3">
          Parent: {subcategory.category?.name || "N/A"}
        </div>

        <div className="text-xs text-gray-500 mb-4">
          Created: {new Date(subcategory.createdAt).toLocaleDateString()}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(subcategory)}
            className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(subcategory._id)}
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
              <h1 className="text-3xl font-semibold text-gray-900">Subcategory Management</h1>
              <p className="mt-2 text-gray-600">
                Organize and manage your product subcategories
              </p>
              <div className="mt-1 text-sm text-gray-500">
                {subcategories.length} subcategories in system
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
              {/* Export Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={exportToExcel}
                  disabled={exportLoading || subcategories.length === 0}
                  className="inline-flex items-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exportLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent mr-2"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export All
                    </>
                  )}
                </button>
                {filteredSubcategories.length > 0 && (searchTerm || statusFilter !== "all") && (
                  <button
                    onClick={exportFilteredToExcel}
                    disabled={exportLoading}
                    className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {exportLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Exporting...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export Filtered
                      </>
                    )}
                  </button>
                )}
              </div>
              
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setFormData({ name: "", img: null, category: "", status: "active" });
                }}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Subcategory
              </button>
            </div>
          </div>

          {/* Export Options Panel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Export Options</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Export subcategory data to Excel with complete hierarchy information
                </p>
              </div>
              
              {/* Quick Export by Parent Category */}
              {categories.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Export by Parent Category:
                  </span>
                  <select
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value) {
                        const [id, name] = value.split('|');
                        exportByParentCategory(id, name);
                        e.target.value = '';
                      }
                    }}
                    className="block w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Select Parent Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={`${cat._id}|${cat.name}`}>
                        {cat.name} ({subcategories.filter(s => s.category?._id === cat._id).length})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-blue-500 p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Subcategories</p>
                  <p className="text-2xl font-bold text-gray-900">{subcategories.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-green-500 p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{getStatusCount("active")}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-gray-500 p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold text-gray-900">{getStatusCount("inactive")}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-teal-500 p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Parent Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Subcategories
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
                    placeholder="Search by name, slug, or parent category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              <div className="lg:w-64">
                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Header and View Toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastItem, filteredSubcategories.length)}</span> of{" "}
              <span className="font-medium">{filteredSubcategories.length}</span> results
              {searchTerm && (
                <span className="text-blue-600 ml-2">
                  (filtered from {subcategories.length} total)
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

          {/* Subcategories Display */}
          {currentSubcategories.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No subcategories found</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                {subcategories.length === 0 
                  ? "Get started by creating your first subcategory to better organize your products." 
                  : "No subcategories match your current search criteria. Try adjusting your filters."}
              </p>
              <div className="mt-6 space-x-3">
                {(searchTerm || statusFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Clear all filters
                  </button>
                )}
                {subcategories.length === 0 && (
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setEditingId(null);
                      setFormData({ name: "", img: null, category: "", status: "active" });
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create First Subcategory
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
                            Subcategory Details
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Parent Category
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
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
                        {currentSubcategories.map((subcategory) => (
                          <tr key={subcategory._id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {subcategory.img && (
                                  <img 
                                    src={`http://localhost:5000${subcategory.img} `}
                                    alt={subcategory.name}
                                    className="h-10 w-10 rounded-lg object-cover mr-3"
                                  />
                                )}
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {subcategory.name}
                                  </div>
                                  <div className="text-xs text-gray-500 font-mono">
                                    {subcategory.slug}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {subcategory.category?.name || "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  subcategory.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {subcategory.status === "active" ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(subcategory.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleEdit(subcategory)}
                                  className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(subcategory._id)}
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
                  {currentSubcategories.map((subcategory) => (
                    <SubcategoryCard key={subcategory._id} subcategory={subcategory} />
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
                        <span className="font-medium">{Math.min(indexOfLastItem, filteredSubcategories.length)}</span> of{" "}
                        <span className="font-medium">{filteredSubcategories.length}</span> results
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
                                ? 'bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
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
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingId ? 'Edit Subcategory' : 'Add New Subcategory'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingId ? 'Update your subcategory details below' : 'Fill in the details to create a new subcategory'}
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subcategory Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Enter subcategory name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">Select Parent Category</option>
                        {categories.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image {!editingId && "*"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required={!editingId}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {editingId ? "Select a new image to update, or keep the current one" : "Select an image for the subcategory (max 5MB)"}
                    </p>
                  </div>

                  {imagePreview && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image Preview
                      </label>
                      <div className="flex justify-center">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="h-24 w-24 rounded-lg object-cover border border-gray-200"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

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
                        editingId ? 'Update Subcategory' : 'Create Subcategory'
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