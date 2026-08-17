"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  BuildingOfficeIcon,
  ShoppingBagIcon,
  TagIcon,
  UsersIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import AdminLayout from '../components/AdminLayout';

export default function AdminDashboard() {
 
 
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Businesses state
  const [businesses, setBusinesses] = useState([]);
  const [businessLoading, setBusinessLoading] = useState(false);
  const [businessPage, setBusinessPage] = useState(1);
  const [businessTotalPages, setBusinessTotalPages] = useState(1);
  const [businessSearch, setBusinessSearch] = useState('');
  const [businessStatusFilter, setBusinessStatusFilter] = useState('all');

  // Categories state
  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Form states
  const [showMainCategoryForm, setShowMainCategoryForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSubcategoryForm, setShowSubcategoryForm] = useState(false);
  const [showBrandForm, setShowBrandForm] = useState(false);

  const [mainCategoryForm, setMainCategoryForm] = useState({ name: '', img: '', status: 'active' });
  const [categoryForm, setCategoryForm] = useState({ name: '', img: '', maincategory: '', status: 'active' });
  const [subcategoryForm, setSubcategoryForm] = useState({ name: '', img: '', category: '', status: 'active' });
  const [brandForm, setBrandForm] = useState({ 
    name: '', 
    img: '', 
    description: '', 
    populerbrand: false, 
    maincategory: [], 
    status: 'active' 
  });



  useEffect(() => {
    if (activeTab === 'main-categories') {
      fetchMainCategories();
    } else if (activeTab === 'categories') {
      fetchCategories();
    } else if (activeTab === 'subcategories') {
      fetchSubcategories();
    } else if (activeTab === 'brands') {
      fetchBrands();
    }
  }, [activeTab, businessPage, businessSearch, businessStatusFilter]);

  
 

  const fetchMainCategories = async () => {
    try {
      const response = await fetch('https://devagroupon-1.onrender.com/api/admin/main-categories', {
       
      });
      const data = await response.json();
      if (data.success) {
        setMainCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching main categories:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://devagroupon-1.onrender.com/api/admin/categories', {
       
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await fetch('https://devagroupon-1.onrender.com/api/admin/categories/subcategories', {
        
      });
      const data = await response.json();
      if (data.success) {
        setSubcategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch('https://devagroupon-1.onrender.com/api/admin/brands', {
       
      });
      const data = await response.json();
      if (data.success) {
        setBrands(data.data);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  

 

  // Category Management Functions
  const handleCreateMainCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://devagroupon-1.onrender.com/api/admin/categories/main-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify(mainCategoryForm)
      });

      const data = await response.json();
      if (data.success) {
        setShowMainCategoryForm(false);
        setMainCategoryForm({ name: '', img: '', status: 'active' });
        fetchMainCategories();
        alert('Main category created successfully!');
      } else {
        alert(data.message || 'Error creating main category');
      }
    } catch (error) {
      console.error('Error creating main category:', error);
      alert('Error creating main category');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://devagroupon-1.onrender.com/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify(categoryForm)
      });

      const data = await response.json();
      if (data.success) {
        setShowCategoryForm(false);
        setCategoryForm({ name: '', img: '', maincategory: '', status: 'active' });
        fetchCategories();
        alert('Category created successfully!');
      } else {
        alert(data.message || 'Error creating category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Error creating category');
    }
  };

  const handleCreateSubcategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://devagroupon-1.onrender.com/api/admin/subcategories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify(subcategoryForm)
      });

      const data = await response.json();
      if (data.success) {
        setShowSubcategoryForm(false);
        setSubcategoryForm({ name: '', img: '', category: '', status: 'active' });
        fetchSubcategories();
        alert('Subcategory created successfully!');
      } else {
        alert(data.message || 'Error creating subcategory');
      }
    } catch (error) {
      console.error('Error creating subcategory:', error);
      alert('Error creating subcategory');
    }
  };

  const handleCreateBrand = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://devagroupon-1.onrender.com/api/admin/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify(brandForm)
      });

      const data = await response.json();
      if (data.success) {
        setShowBrandForm(false);
        setBrandForm({ 
          name: '', 
          img: '', 
          description: '', 
          populerbrand: false, 
          maincategory: [], 
          status: 'active' 
        });
        fetchBrands();
        alert('Brand created successfully!');
      } else {
        alert(data.message || 'Error creating brand');
      }
    } catch (error) {
      console.error('Error creating brand:', error);
      alert('Error creating brand');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
    <div className="min-h-screen bg-gray-50">
   
     

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <nav className="flex overflow-x-auto">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
              { id: 'businesses', name: 'Businesses', icon: BuildingOfficeIcon },
              { id: 'main-categories', name: 'Main Categories', icon: TagIcon },
              { id: 'categories', name: 'Categories', icon: TagIcon },
              { id: 'subcategories', name: 'Subcategories', icon: TagIcon },
              { id: 'brands', name: 'Brands', icon: ShoppingBagIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-lime-500 text-lime-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Overview</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-100 p-3">
                    <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Businesses</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.businesses?.total || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-yellow-100 p-3">
                    <ClockIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.businesses?.pending || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.businesses?.approved || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-red-100 p-3">
                    <XCircleIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Rejected</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.businesses?.rejected || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-purple-100 p-3">
                    <ShoppingBagIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.products || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-indigo-100 p-3">
                    <TagIcon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Categories</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.categories || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-pink-100 p-3">
                    <UsersIcon className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Brands</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.brands || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Businesses Tab */}
        {activeTab === 'businesses' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Business Management</h2>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search businesses..."
                      value={businessSearch}
                      onChange={(e) => setBusinessSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    />
                  </div>
                </div>
                <select
                  value={businessStatusFilter}
                  onChange={(e) => setBusinessStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Businesses Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {businessLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500"></div>
                </div>
              ) : businesses.length === 0 ? (
                <div className="text-center py-12">
                  <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No businesses</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No businesses found matching your criteria.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Registered
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {businesses.map((business) => (
                        <tr key={business._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{business.companyName}</div>
                            <div className="text-sm text-gray-500">{business.businessType}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {business.firstName} {business.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{business.email}</div>
                            <div className="text-sm text-gray-500">{business.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{business.city}</div>
                            <div className="text-sm text-gray-500">{business.country}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              business.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              business.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {business.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(business.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              {business.status !== 'Approved' && (
                                <button
                                  onClick={() => handleBusinessStatusUpdate(business._id, 'Approved')}
                                  className="text-green-600 hover:text-green-900 transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircleIcon className="w-4 h-4" />
                                </button>
                              )}
                              {business.status !== 'Rejected' && (
                                <button
                                  onClick={() => handleBusinessStatusUpdate(business._id, 'Rejected')}
                                  className="text-red-600 hover:text-red-900 transition-colors"
                                  title="Reject"
                                >
                                  <XCircleIcon className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteBusiness(business._id)}
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                                title="Delete"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {businessTotalPages > 1 && (
                <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Page {businessPage} of {businessTotalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setBusinessPage(prev => Math.max(prev - 1, 1))}
                      disabled={businessPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setBusinessPage(prev => Math.min(prev + 1, businessTotalPages))}
                      disabled={businessPage === businessTotalPages}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Categories Tab */}
        {activeTab === 'main-categories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Main Categories</h2>
              <button
                onClick={() => setShowMainCategoryForm(true)}
                className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 transition-colors flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Add Main Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mainCategories.map((category) => (
                <div key={category._id} className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {category.status}
                    </span>
                  </div>
                  <img
                    src={category.img}
                    alt={category.name}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Slug: {category.slug}</span>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Category Form Modal */}
            {showMainCategoryForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Add Main Category</h3>
                  </div>
                  <form onSubmit={handleCreateMainCategory} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={mainCategoryForm.name}
                        onChange={(e) => setMainCategoryForm({...mainCategoryForm, name: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL *
                      </label>
                      <input
                        type="url"
                        value={mainCategoryForm.img}
                        onChange={(e) => setMainCategoryForm({...mainCategoryForm, img: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={mainCategoryForm.status}
                        onChange={(e) => setMainCategoryForm({...mainCategoryForm, status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowMainCategoryForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add similar sections for Categories, Subcategories, and Brands */}
        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
              <button
                onClick={() => setShowCategoryForm(true)}
                className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 transition-colors flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Add Category
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Main Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category._id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {category.img && (
                            <img src={category.img} alt={category.name} className="w-10 h-10 rounded-lg mr-3" />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                            <div className="text-sm text-gray-500">{category.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {category.maincategory?.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {category.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Category Form Modal */}
            {showCategoryForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Add Category</h3>
                  </div>
                  <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Main Category *
                      </label>
                      <select
                        value={categoryForm.maincategory}
                        onChange={(e) => setCategoryForm({...categoryForm, maincategory: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                      >
                        <option value="">Select Main Category</option>
                        {mainCategories.map(mc => (
                          <option key={mc._id} value={mc._id}>{mc.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={categoryForm.img}
                        onChange={(e) => setCategoryForm({...categoryForm, img: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={categoryForm.status}
                        onChange={(e) => setCategoryForm({...categoryForm, status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowCategoryForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add similar sections for Subcategories and Brands following the same pattern */}
      </div>
    </div>
    </AdminLayout>
  );
}