"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import AdminLayout from "../components/AdminLayout";

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [popularFilter, setPopularFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    img: null,
    description: "",
    populerbrand: false,
    maincategory: [],
    status: "active"
  });
  const [imagePreview, setImagePreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  // API base URL
  const API_BASE = "https://devagroupon-1.onrender.com/api/admin";

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [brandsRes, mainCategoriesRes] = await Promise.all([
        fetch(`${API_BASE}/brands`),
        fetch(`${API_BASE}/main-categories`)
      ]);

      if (!brandsRes.ok || !mainCategoriesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [brandsData, mainCategoriesData] = await Promise.all([
        brandsRes.json(),
        mainCategoriesRes.json()
      ]);

      if (brandsData.success) setBrands(brandsData.data);
      if (mainCategoriesData.success) setMainCategories(mainCategoriesData.data);
      
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

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  // Filter and sort brands
  const filteredAndSortedBrands = useMemo(() => {
    let filtered = brands.filter(brand => {
      const matchesSearch = brand.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || brand.status === statusFilter;
      const matchesPopular = popularFilter === "all" ||
        (popularFilter === "popular" && brand.populerbrand) ||
        (popularFilter === "regular" && !brand.populerbrand);

      return matchesSearch && matchesStatus && matchesPopular;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "maincategory") {
        aValue = a.maincategory?.length || 0;
        bValue = b.maincategory?.length || 0;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [brands, searchTerm, statusFilter, popularFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedBrands.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBrands = filteredAndSortedBrands.slice(indexOfFirstItem, indexOfLastItem);

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

    setFormData(prev => ({ ...prev, img: file }));

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
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("populerbrand", formData.populerbrand.toString());
      formDataToSend.append("status", formData.status);

      formData.maincategory.forEach(categoryId => {
        formDataToSend.append("maincategory", categoryId);
      });

      if (formData.img) {
        formDataToSend.append("img", formData.img);
      }

      const url = editingId ? `${API_BASE}/brands/${editingId}` : `${API_BASE}/brands`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formDataToSend });
      const data = await res.json();

      if (data.success) {
        toast.success(`Brand ${editingId ? 'updated' : 'created'} successfully`);
        handleCloseForm();
        fetchData();
      } else {
        throw new Error(data.message || `Failed to ${editingId ? 'update' : 'create'} brand`);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Delete brand
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand? This action cannot be undone.")) return;

    try {
      const res = await fetch(`${API_BASE}/brands/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        toast.success("Brand deleted successfully");
        fetchData();
      } else {
        throw new Error(data.message || "Failed to delete brand");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Edit brand
  const handleEdit = (brand) => {
    setFormData({
      name: brand.name,
      img: null,
      description: brand.description || "",
      populerbrand: brand.populerbrand || false,
      maincategory: brand.maincategory?.map(mc => mc._id) || [],
      status: brand.status
    });
    setImagePreview(brand.img);
    setEditingId(brand._id);
    setShowForm(true);
  };

  // Reset form
  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({
      name: "",
      img: null,
      description: "",
      populerbrand: false,
      maincategory: [],
      status: "active"
    });
    setImagePreview("");
    setEditingId(null);
  };

  // Category selection
  const handleMainCategoryChange = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      maincategory: prev.maincategory.includes(categoryId)
        ? prev.maincategory.filter(id => id !== categoryId)
        : [...prev.maincategory, categoryId]
    }));
  };

  // Stats
  const stats = useMemo(() => ({
    total: brands.length,
    active: brands.filter(brand => brand.status === "active").length,
    popular: brands.filter(brand => brand.populerbrand).length,
    categories: mainCategories.length
  }), [brands, mainCategories]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, popularFilter]);

  // Loading skeleton
  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <PageHeader 
            stats={stats}
            onAddBrand={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({
                name: "",
                img: null,
                description: "",
                populerbrand: false,
                maincategory: [],
                status: "active"
              });
              setImagePreview("");
            }}
          />

          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Filters */}
          <Filters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            popularFilter={popularFilter}
            onPopularFilterChange={setPopularFilter}
          />

          {/* Results Header */}
          <ResultsHeader 
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredAndSortedBrands.length}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onItemsPerPageChange={(value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
          />

          {/* Content */}
          <div className="mb-8">
            {currentBrands.length === 0 ? (
              <EmptyState 
                hasBrands={brands.length > 0}
                hasFilters={searchTerm || statusFilter !== "all" || popularFilter !== "all"}
                onClearFilters={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setPopularFilter("all");
                }}
                onAddBrand={() => setShowForm(true)}
              />
            ) : viewMode === "table" ? (
              <TableView 
                brands={currentBrands}
                sortConfig={sortConfig}
                onSort={handleSort}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <GridView 
                brands={currentBrands}
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
              totalItems={filteredAndSortedBrands.length}
              onPageChange={setCurrentPage}
            />
          )}

          {/* Form Modal */}
          {showForm && (
            <BrandForm 
              formData={formData}
              formLoading={formLoading}
              editingId={editingId}
              imagePreview={imagePreview}
              mainCategories={mainCategories}
              onClose={handleCloseForm}
              onSubmit={handleSubmit}
              onImageChange={handleImageChange}
              onFormDataChange={setFormData}
              onMainCategoryChange={handleMainCategoryChange}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

// Sub-components for better organization

const LoadingSkeleton = () => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

const PageHeader = ({ stats, onAddBrand }) => (
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Brand Management</h1>
      <p className="mt-1 text-gray-600">Manage and organize your product brands</p>
      <div className="mt-1 text-sm text-gray-500">{stats.total} brands in system</div>
    </div>
    <button
      onClick={onAddBrand}
      className="mt-4 lg:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Add Brand
    </button>
  </div>
);

const StatsCards = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <StatCard 
      title="Total Brands" 
      value={stats.total} 
      icon="📊" 
      color="blue" 
    />
    <StatCard 
      title="Active Brands" 
      value={stats.active} 
      icon="✅" 
      color="green" 
    />
    <StatCard 
      title="Popular Brands" 
      value={stats.popular} 
      icon="⭐" 
      color="yellow" 
    />
    <StatCard 
      title="Categories" 
      value={stats.categories} 
      icon="📁" 
      color="purple" 
    />
  </div>
);

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600"
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center">
        <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
          <span className="text-lg">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

const Filters = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange, 
  popularFilter, 
  onPopularFilterChange 
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Brands
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Popularity
        </label>
        <select
          value={popularFilter}
          onChange={(e) => onPopularFilterChange(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Brands</option>
          <option value="popular">Popular Only</option>
          <option value="regular">Regular Only</option>
        </select>
      </div>
    </div>
  </div>
);

const ResultsHeader = ({ 
  currentPage, 
  itemsPerPage, 
  totalItems, 
  viewMode, 
  onViewModeChange, 
  onItemsPerPageChange 
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
    <div className="text-sm text-gray-600 mb-2 sm:mb-0">
      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
    </div>
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <label className="text-sm text-gray-600">View:</label>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
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
          onClick={() => onViewModeChange("table")}
          className={`p-2 ${viewMode === "table" ? "bg-blue-100 text-blue-600" : "text-gray-400"}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <button
          onClick={() => onViewModeChange("grid")}
          className={`p-2 ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-400"}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

const TableView = ({ brands, sortConfig, onSort, onEdit, onDelete }) => {
  const SortableHeader = ({ label, sortKey }) => (
    <th 
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <svg className={`w-4 h-4 ${sortConfig.key === sortKey ? "text-gray-900" : "text-gray-300"} ${sortConfig.direction === "desc" ? "transform rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader label="Brand" sortKey="name" />
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categories
              </th>
              <SortableHeader label="Status" sortKey="status" />
              <SortableHeader label="Categories" sortKey="maincategory" />
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {brands.map((brand) => (
              <tr key={brand._id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    {brand.img && (
                      <img src={process.env.NEXT_PUBLIC_API_URL + brand.img} alt={brand.name} className="h-10 w-10 rounded-lg object-cover mr-3" />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{brand.name}</div>
                      <div className="text-xs text-gray-500">{brand.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {brand.maincategory?.slice(0, 2).map((mc) => (
                      <span key={mc._id} className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {mc.name}
                      </span>
                    ))}
                    {brand.maincategory?.length > 2 && (
                      <span className="text-xs text-gray-500">+{brand.maincategory.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col space-y-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${brand.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                      {brand.status}
                    </span>
                    {brand.populerbrand && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        Popular
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {brand.maincategory?.length || 0}
                </td>
                <td className="px-4 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(brand)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(brand._id)}
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

const GridView = ({ brands, onEdit, onDelete }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {brands.map((brand) => (
      <div key={brand._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="h-32 bg-gray-100 overflow-hidden">
          {brand.img ? (
            <img src={brand.img} alt={brand.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">{brand.name}</h3>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span className={`px-2 py-1 rounded ${brand.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
              {brand.status}
            </span>
            {brand.populerbrand && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Popular</span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(brand)}
              className="flex-1 text-center py-1 text-xs font-medium text-blue-600 hover:text-blue-900 border border-blue-600 rounded hover:bg-blue-50"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(brand._id)}
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

const EmptyState = ({ hasBrands, hasFilters, onClearFilters, onAddBrand }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h3 className="mt-4 text-lg font-medium text-gray-900">No brands found</h3>
    <p className="mt-2 text-sm text-gray-500">
      {hasBrands 
        ? "No brands match your current search criteria. Try adjusting your filters."
        : "Get started by creating your first brand."
      }
    </p>
    <div className="mt-6">
      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-3"
        >
          Clear filters
        </button>
      )}
      {!hasBrands && (
        <button
          onClick={onAddBrand}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Create First Brand
        </button>
      )}
    </div>
  </div>
);

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

const BrandForm = ({
  formData,
  formLoading,
  editingId,
  imagePreview,
  mainCategories,
  onClose,
  onSubmit,
  onImageChange,
  onFormDataChange,
  onMainCategoryChange
}) => (
  <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {editingId ? 'Edit Brand' : 'Add New Brand'}
        </h3>
      </div>
      <form onSubmit={onSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter brand name"
            />
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
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter brand description"
          />
        </div>

        {imagePreview && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image Preview
            </label>
            <img
              src={imagePreview}
              alt="Preview"
              className="h-24 w-24 rounded-lg object-cover border border-gray-300"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => onFormDataChange({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="populerbrand"
              checked={formData.populerbrand}
              onChange={(e) => onFormDataChange({ ...formData, populerbrand: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="populerbrand" className="ml-2 text-sm text-gray-700">
              Mark as Popular Brand
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Main Categories
          </label>
          <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {mainCategories.map(mc => (
                <div key={mc._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`mc-${mc._id}`}
                    checked={formData.maincategory.includes(mc._id)}
                    onChange={() => onMainCategoryChange(mc._id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`mc-${mc._id}`} className="ml-2 text-sm text-gray-700">
                    {mc.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Selected: {formData.maincategory.length} categories
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={formLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {formLoading ? "Saving..." : editingId ? "Update Brand" : "Create Brand"}
          </button>
        </div>
      </form>
    </div>
  </div>
);