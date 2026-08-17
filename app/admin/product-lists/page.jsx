// app/admin/products/page.jsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import AdminLayout from "../components/AdminLayout";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  // Debounce search
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Fetch products and categories
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(brandFilter !== 'all' && { brand: brandFilter })
      });

      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`http://localhost:5000/api/product/products?${queryParams}`),
        fetch("http://localhost:5000/api/product/categories")
      ]);

      if (!productsRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [productsData, categoriesData] = await Promise.all([
        productsRes.json(),
        categoriesRes.json()
      ]);

      if (productsData.success) {
        setProducts(productsData.data);
        setTotalProducts(productsData.pagination.totalProducts);
      } else {
        throw new Error(productsData.message || "Failed to load products");
      }

      if (categoriesData.success) {
        setCategories(categoriesData.data);
      }
    } catch (error) {
      toast.error(error.message || "Error fetching data");
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, statusFilter, categoryFilter, brandFilter]);

  // Debounced search
  const debouncedFetchData = useCallback(debounce(fetchData, 300), [fetchData]);

  useEffect(() => {
    debouncedFetchData();
  }, [debouncedFetchData]);

  // Handle delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }
    
    try {
      setDeleteLoading(id);
      const res = await fetch(`http://localhost:5000/api/product/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Product deleted successfully");
        fetchData();
      } else {
        throw new Error(data.message || "Failed to delete product");
      }
    } catch (error) {
      toast.error(error.message || "Error deleting product");
    } finally {
      setDeleteLoading(null);
    }
  };


  const handleEdit = (productId) => {
        router.push(`/admin/add-product?id=${productId}`);
    };

  // Calculate discount percentage
  const calculateDiscount = (price, discountPrice) => {
    if (!discountPrice || price <= 0) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setBrandFilter("all");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  // Loading skeleton
  if (loading && products.length === 0) {
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

            {/* Filters Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
              ))}
            </div>

            {/* View Toggle Skeleton */}
            <div className="flex justify-between items-center mb-6">
              <div className="h-6 bg-gray-200 rounded w-32"></div>
              <div className="flex gap-2">
                <div className="h-10 w-10 bg-gray-200 rounded"></div>
                <div className="h-10 w-10 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-200 rounded flex-1"></div>
                      <div className="h-8 bg-gray-200 rounded flex-1"></div>
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

  // Product Card Component for Grid View
  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {product.thumbImg ? (
          <img 
            src={`http://localhost:5000/${product.thumbImg}`} 
            alt={product.name}
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
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
            product.status === "active" 
              ? "bg-green-100 text-green-800" 
              : "bg-gray-100 text-gray-800"
          }`}>
            {product.status === "active" ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Discount Badge */}
        {product.discountPrice && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
              {calculateDiscount(product.price, product.discountPrice)}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-gray-500 text-xs mb-3 line-clamp-2">
          {product.shortDescription || "No description available"}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          {product.discountPrice ? (
            <>
              <span className="text-lg font-semibold text-gray-900">
                ${product.discountPrice}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ${product.price}
              </span>
            </>
          ) : (
            <span className="text-lg font-semibold text-gray-900">
              ${product.price}
            </span>
          )}
        </div>

        {/* Stock and Categories */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
            product.stock > 10 
              ? "bg-green-100 text-green-800" 
              : product.stock > 0 
                ? "bg-yellow-100 text-yellow-800" 
                : "bg-red-100 text-red-800"
          }`}>
            Stock: {product.stock}
          </span>
          
          <div className="text-xs text-gray-500 font-mono">
            {product.sku}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(product._id)}
            className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(product._id)}
            disabled={deleteLoading === product._id}
            className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {deleteLoading === product._id ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Product Row Component for List View
  const ProductRow = ({ product }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
          {product.thumbImg ? (
            <img 
              src={product.thumbImg} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                {product.shortDescription || "No description available"}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                product.status === "active" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {product.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Price */}
              <div className="flex items-center gap-2">
                {product.discountPrice ? (
                  <>
                    <span className="text-base font-semibold text-gray-900">
                      ${product.discountPrice}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${product.price}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                      {calculateDiscount(product.price, product.discountPrice)}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-base font-semibold text-gray-900">
                    ${product.price}
                  </span>
                )}
              </div>

              {/* Stock */}
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                product.stock > 10 
                  ? "bg-green-100 text-green-800" 
                  : product.stock > 0 
                    ? "bg-yellow-100 text-yellow-800" 
                    : "bg-red-100 text-red-800"
              }`}>
                Stock: {product.stock}
              </span>

              {/* SKU */}
              <div className="text-xs text-gray-500 font-mono">
                SKU: {product.sku}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEdit(product._id)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                disabled={deleteLoading === product._id}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {deleteLoading === product._id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
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
              <h1 className="text-3xl font-semibold text-gray-900">Product Management</h1>
              <p className="mt-2 text-gray-600">
                Manage your product catalog efficiently
              </p>
              <div className="mt-1 text-sm text-gray-500">
                {totalProducts} products in inventory
              </div>
            </div>
            <Link
              href="/admin/add-product"
              className="mt-4 lg:mt-0 inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </Link>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Products
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
                    placeholder="Search by name, SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="categoryFilter"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.categories?.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div>
                <label htmlFor="brandFilter" className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <select
                  id="brandFilter"
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Brands</option>
                  {categories.brands?.map(brand => (
                    <option key={brand._id} value={brand._id}>{brand.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Clear Filters */}
            {(searchTerm || statusFilter !== "all" || categoryFilter !== "all" || brandFilter !== "all") && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Results Header and View Toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{" "}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalProducts)}</span> of{" "}
              <span className="font-medium">{totalProducts}</span> results
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
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === "list" 
                      ? "bg-blue-100 text-blue-600" 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Products Display */}
          {products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                {totalProducts === 0 
                  ? "Get started by adding your first product to the catalog." 
                  : "No products match your current search criteria. Try adjusting your filters."}
              </p>
              <div className="mt-6">
                <Link
                  href="/admin/products/add"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Product
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div className="space-y-4 mb-8">
                  {products.map((product) => (
                    <ProductRow key={product._id} product={product} />
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
                        Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{" "}
                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalProducts)}</span> of{" "}
                        <span className="font-medium">{totalProducts}</span> results
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
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                                pageNum === currentPage
                                  ? 'bg-blue-600 text-white  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                  : 'text-gray-900'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
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
        </div>
      </div>
    </AdminLayout>
  );
}